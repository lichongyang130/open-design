#!/usr/bin/env python3
"""Reconcile two CSV/XLSX/XLSM tables by explicit key columns.

Duplicate and blank keys are isolated for review instead of being paired
arbitrarily. The script never edits input files and writes a review workbook
plus a JSON audit report.
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import os
import re
import sys
import tempfile
import unicodedata
from datetime import date, datetime, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any
from collections import defaultdict


SUPPORTED_SUFFIXES = {".csv", ".xlsx", ".xlsm"}
SUPPORTED_CSV_ENCODINGS = ("utf-8", "gb18030", "cp1252")
MAX_CELLS_PER_SHEET = 1_000_000
MAX_DATA_ROWS = 250_000
MAX_JSON_DETAILS = 5_000
NUMERIC_TEXT = re.compile(r"^[+-]?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$")


class ReconciliationError(Exception):
    """Actionable input, schema, safety, or validation failure."""


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def json_value(value: Any) -> Any:
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    return str(value)


def canonical_decimal(value: Any) -> str:
    number = Decimal(str(value))
    normalized = number.normalize()
    if normalized == 0:
        return "0"
    return format(normalized, "f")


def canonical(value: Any) -> tuple[str, str] | None:
    if value is None:
        return None
    if isinstance(value, bool):
        return ("bool", "true" if value else "false")
    if isinstance(value, (int, float, Decimal)) and not isinstance(value, bool):
        return ("number", canonical_decimal(value))
    if isinstance(value, (datetime, date)):
        return ("date", value.isoformat())

    text = unicodedata.normalize("NFC", str(value)).strip()
    if text == "":
        return None
    # Normalize plain numeric strings to numeric values so 100 and 100.00
    # compare equal, but preserve leading-zero identifiers such as "00123".
    if NUMERIC_TEXT.fullmatch(text) and not re.match(r"^[+-]?0[0-9]+(?:\.[0-9]+)?$", text):
        try:
            return ("number", canonical_decimal(text))
        except InvalidOperation:
            pass
    return ("text", text)


def display_value(value: Any) -> str:
    if value is None:
        return ""
    return str(json_value(value))


def key_label(key: tuple[tuple[str, str], ...]) -> str:
    return " | ".join(value for _, value in key)


def add_detail(report: dict[str, Any], collection: str, item: dict[str, Any]) -> None:
    details = report[collection]
    if len(details) < MAX_JSON_DETAILS:
        details.append(item)
    else:
        report["details_truncated"] = True


def choose_delimiter(text: str) -> str:
    try:
        return csv.Sniffer().sniff(text[:65536], delimiters=",;\t|").delimiter
    except csv.Error:
        return ","


def read_csv_table(path: Path) -> tuple[list[str], list[dict[str, Any]], list[str]]:
    raw = path.read_bytes()
    decoded: str | None = None
    if raw.startswith(b"\xef\xbb\xbf"):
        decoded = raw.decode("utf-8-sig")
    else:
        for encoding in SUPPORTED_CSV_ENCODINGS:
            try:
                decoded = raw.decode(encoding)
                break
            except UnicodeDecodeError:
                continue
    if decoded is None:
        raise ReconciliationError(
            f"Could not decode {path.name}. Export it as UTF-8 or GB18030 CSV and retry."
        )
    delimiter = choose_delimiter(decoded)
    try:
        rows = list(csv.reader(io.StringIO(decoded, newline=""), delimiter=delimiter))
    except csv.Error as exc:
        raise ReconciliationError(f"Could not parse CSV {path.name}: {exc}") from exc
    if not rows:
        raise ReconciliationError(f"{path.name} is empty.")
    headers = normalize_headers(rows[0], path.name)
    if len(rows) - 1 > MAX_DATA_ROWS:
        raise ReconciliationError(
            f"{path.name} has more than {MAX_DATA_ROWS:,} data rows, above the current safety limit."
        )
    records: list[dict[str, Any]] = []
    for index, row in enumerate(rows[1:], start=2):
        if len(row) > len(headers) and any(not is_blank(v) for v in row[len(headers):]):
            raise ReconciliationError(
                f"{path.name}, record {index} has values beyond the {len(headers)} header columns."
            )
        values = row[:len(headers)] + [None] * max(0, len(headers) - len(row))
        records.append({"row_number": index, "values": dict(zip(headers, values))})
    warnings = [f"CSV delimiter detected as {repr(delimiter)}; source encoding was decoded and report values are normalized."]
    return headers, records, warnings


def is_blank(value: Any) -> bool:
    return value is None or (isinstance(value, str) and value.strip() == "")


def normalize_headers(raw_headers: list[Any], file_name: str) -> list[str]:
    headers: list[str] = []
    for position, raw in enumerate(raw_headers, start=1):
        if raw is None or str(raw).strip() == "":
            raise ReconciliationError(
                f"{file_name} has an empty header at column {position}. Give each column a unique name."
            )
        header = unicodedata.normalize("NFC", str(raw)).strip()
        if header in headers:
            raise ReconciliationError(
                f"{file_name} has duplicate header {header!r}. Rename duplicate columns before reconciliation."
            )
        headers.append(header)
    return headers


def read_excel_table(path: Path, sheet_name: str | None) -> tuple[list[str], list[dict[str, Any]], list[str], str]:
    try:
        from openpyxl import load_workbook
    except ImportError as exc:
        raise ReconciliationError(
            "Excel reconciliation requires openpyxl. Install it in the active Python environment with: "
            "python3 -m pip install openpyxl."
        ) from exc

    warnings: list[str] = []
    try:
        workbook = load_workbook(path, data_only=True, read_only=True, keep_links=True)
        formulas_book = load_workbook(path, data_only=False, read_only=True, keep_links=True)
    except Exception as exc:
        try:
            workbook.close()
        except Exception:
            pass
        raise ReconciliationError(f"Could not open workbook {path.name}: {exc}") from exc

    try:
        if sheet_name:
            if sheet_name not in workbook.sheetnames:
                raise ReconciliationError(
                    f"Worksheet {sheet_name!r} was not found in {path.name}. Available: {', '.join(workbook.sheetnames)}"
                )
            sheet = workbook[sheet_name]
            formula_sheet = formulas_book[sheet_name]
        else:
            visible = [ws.title for ws in workbook.worksheets if ws.sheet_state == "visible"]
            if not visible:
                raise ReconciliationError(f"{path.name} has no visible worksheets. Specify --sheet explicitly.")
            sheet = workbook[visible[0]]
            formula_sheet = formulas_book[visible[0]]
            sheet_name = visible[0]

        rectangle = sheet.max_row * sheet.max_column
        if rectangle > MAX_CELLS_PER_SHEET:
            raise ReconciliationError(
                f"{path.name}:{sheet.title} spans {rectangle:,} cells, above the {MAX_CELLS_PER_SHEET:,} cell safety limit."
            )
        if max(0, sheet.max_row - 1) > MAX_DATA_ROWS:
            raise ReconciliationError(
                f"{path.name}:{sheet.title} has more than {MAX_DATA_ROWS:,} data rows, above the current safety limit."
            )

        raw_rows = list(sheet.iter_rows(values_only=True))
        if not raw_rows:
            raise ReconciliationError(f"{path.name}:{sheet.title} is empty.")
        headers = normalize_headers(list(raw_rows[0]), f"{path.name}:{sheet.title}")
        records: list[dict[str, Any]] = []
        formula_count = 0
        blank_formula_cache_count = 0
        for row_number, (raw_row, formula_row) in enumerate(
            zip(raw_rows[1:], formula_sheet.iter_rows(values_only=False)[1:]),
            start=2,
        ):
            if any(cell.data_type == "f" for cell in formula_row):
                formula_count += sum(1 for cell in formula_row if cell.data_type == "f")
                for column, cell in enumerate(formula_row, start=1):
                    if cell.data_type == "f" and column <= len(raw_row) and raw_row[column - 1] is None:
                        blank_formula_cache_count += 1
            if len(raw_row) > len(headers) and any(not is_blank(v) for v in raw_row[len(headers):]):
                raise ReconciliationError(
                    f"{path.name}:{sheet.title} row {row_number} has values beyond the header columns."
                )
            values = list(raw_row[:len(headers)]) + [None] * max(0, len(headers) - len(raw_row))
            records.append({"row_number": row_number, "values": dict(zip(headers, values))})
        if formula_count:
            warnings.append(
                f"{path.name}:{sheet.title} contains {formula_count} formula cells. Comparison uses saved cached values; formulas are not recalculated."
            )
        if blank_formula_cache_count:
            warnings.append(
                f"{path.name}:{sheet.title} contains {blank_formula_cache_count} formula cell(s) with empty cached values. Recalculate and save the workbook in Excel/LibreOffice before relying on those comparisons."
            )
        return headers, records, warnings, sheet.title
    finally:
        workbook.close()
        formulas_book.close()


def read_table(path: Path, sheet_name: str | None) -> tuple[list[str], list[dict[str, Any]], list[str], str | None]:
    suffix = path.suffix.lower()
    if suffix == ".csv":
        headers, records, warnings = read_csv_table(path)
        return headers, records, warnings, None
    headers, records, warnings, selected = read_excel_table(path, sheet_name)
    return headers, records, warnings, selected


def make_key(record: dict[str, Any], key_columns: list[str]) -> tuple[tuple[str, str], ...] | None:
    parts = []
    for column in key_columns:
        item = canonical(record["values"].get(column))
        if item is None:
            return None
        parts.append(item)
    return tuple(parts)


def row_as_json(record: dict[str, Any]) -> dict[str, Any]:
    return {key: json_value(value) for key, value in record["values"].items()}


def build_report(input_a: Path, input_b: Path, output_path: Path, report_path: Path) -> dict[str, Any]:
    return {
        "schema_version": 1,
        "tool": "spreadsheet-reconciliation",
        "created_at": utc_now(),
        "completed_at": None,
        "input_a": str(input_a.resolve()),
        "input_b": str(input_b.resolve()),
        "output_workbook": str(output_path.resolve()),
        "report_json": str(report_path.resolve()),
        "summary": {
            "rows_in_a": 0,
            "rows_in_b": 0,
            "matched_unique_keys": 0,
            "matched_without_differences": 0,
            "matched_with_differences": 0,
            "field_differences": 0,
            "only_in_a": 0,
            "only_in_b": 0,
            "duplicate_keys": 0,
            "rows_with_blank_keys_a": 0,
            "rows_with_blank_keys_b": 0,
            "comparison_columns": [],
            "key_columns": [],
        },
        "differences": [],
        "only_in_a": [],
        "only_in_b": [],
        "duplicate_keys": [],
        "needs_review": [],
        "warnings": [],
    }


def reconcile(
    input_a: Path,
    input_b: Path,
    output_path: Path,
    report_path: Path,
    *,
    key_columns: list[str],
    compare_columns: list[str] | None = None,
    sheet_a: str | None = None,
    sheet_b: str | None = None,
) -> dict[str, Any]:
    headers_a, records_a, warnings_a, chosen_sheet_a = read_table(input_a, sheet_a)
    headers_b, records_b, warnings_b, chosen_sheet_b = read_table(input_b, sheet_b)
    report = build_report(input_a, input_b, output_path, report_path)
    report["warnings"].extend(warnings_a)
    report["warnings"].extend(warnings_b)
    report["selected_sheet_a"] = chosen_sheet_a
    report["selected_sheet_b"] = chosen_sheet_b

    missing_a = [key for key in key_columns if key not in headers_a]
    missing_b = [key for key in key_columns if key not in headers_b]
    if missing_a or missing_b:
        raise ReconciliationError(
            f"Key column mismatch. Missing from A: {missing_a or 'none'}; missing from B: {missing_b or 'none'}."
        )
    shared = [column for column in headers_a if column in headers_b]
    if compare_columns is None:
        columns = [column for column in shared if column not in key_columns]
    else:
        missing_compare_a = [col for col in compare_columns if col not in headers_a]
        missing_compare_b = [col for col in compare_columns if col not in headers_b]
        if missing_compare_a or missing_compare_b:
            raise ReconciliationError(
                f"Compare column mismatch. Missing from A: {missing_compare_a or 'none'}; missing from B: {missing_compare_b or 'none'}."
            )
        if any(column in key_columns for column in compare_columns):
            raise ReconciliationError("Compare columns must not repeat key columns.")
        columns = compare_columns
    report["summary"]["rows_in_a"] = len(records_a)
    report["summary"]["rows_in_b"] = len(records_b)
    report["summary"]["key_columns"] = key_columns
    report["summary"]["comparison_columns"] = columns
    if not columns:
        report["warnings"].append("No non-key comparison columns were selected; only key presence and duplicate-key checks were performed.")

    indexes: list[dict[tuple[tuple[str, str], ...], list[dict[str, Any]]]] = []
    blank_rows_by_file: list[list[dict[str, Any]]] = []
    for label, records in (("A", records_a), ("B", records_b)):
        index: dict[tuple[tuple[str, str], ...], list[dict[str, Any]]] = defaultdict(list)
        blanks: list[dict[str, Any]] = []
        for record in records:
            key = make_key(record, key_columns)
            if key is None:
                blanks.append(record)
                review = {
                    "file": label,
                    "row_number": record["row_number"],
                    "key_values": {column: json_value(record["values"].get(column)) for column in key_columns},
                    "row_data": row_as_json(record),
                    "issue": "blank_key",
                }
                add_detail(report, "needs_review", review)
            else:
                index[key].append(record)
        indexes.append(index)
        blank_rows_by_file.append(blanks)

    index_a, index_b = indexes
    ambiguous_keys = {
        key
        for key in set(index_a) | set(index_b)
        if len(index_a.get(key, [])) > 1 or len(index_b.get(key, [])) > 1
    }
    report["summary"]["rows_with_blank_keys_a"] = len(blank_rows_by_file[0])
    report["summary"]["rows_with_blank_keys_b"] = len(blank_rows_by_file[1])
    report["summary"]["duplicate_keys"] = len(ambiguous_keys)

    for key in sorted(ambiguous_keys, key=key_label):
        rows_a = index_a.get(key, [])
        rows_b = index_b.get(key, [])
        add_detail(report, "duplicate_keys", {
            "key": {column: value for column, (_, value) in zip(key_columns, key)},
            "key_label": key_label(key),
            "rows_a": [record["row_number"] for record in rows_a],
            "rows_b": [record["row_number"] for record in rows_b],
            "count_a": len(rows_a),
            "count_b": len(rows_b),
            "issue": "duplicate_key_ambiguous_match",
            "action": "not_auto_paired",
        })

    unique_a = {key: rows[0] for key, rows in index_a.items() if len(rows) == 1 and key not in ambiguous_keys}
    unique_b = {key: rows[0] for key, rows in index_b.items() if len(rows) == 1 and key not in ambiguous_keys}
    keys_a = set(unique_a)
    keys_b = set(unique_b)

    for key in sorted(keys_a - keys_b, key=key_label):
        record = unique_a[key]
        add_detail(report, "only_in_a", {
            "key": {column: display_value(record["values"].get(column)) for column in key_columns},
            "row_number": record["row_number"],
            "row_data": row_as_json(record),
        })
    for key in sorted(keys_b - keys_a, key=key_label):
        record = unique_b[key]
        add_detail(report, "only_in_b", {
            "key": {column: display_value(record["values"].get(column)) for column in key_columns},
            "row_number": record["row_number"],
            "row_data": row_as_json(record),
        })

    comparable = keys_a & keys_b
    matched_same = 0
    matched_diff = 0
    field_diff_count = 0
    for key in sorted(comparable, key=key_label):
        a_record = unique_a[key]
        b_record = unique_b[key]
        key_differences = 0
        for column in columns:
            value_a = a_record["values"].get(column)
            value_b = b_record["values"].get(column)
            if canonical(value_a) == canonical(value_b):
                continue
            key_differences += 1
            field_diff_count += 1
            add_detail(report, "differences", {
                "key": {name: display_value(a_record["values"].get(name)) for name in key_columns},
                "key_label": key_label(key),
                "row_a": a_record["row_number"],
                "row_b": b_record["row_number"],
                "column": column,
                "value_a": json_value(value_a),
                "value_b": json_value(value_b),
            })
        if key_differences:
            matched_diff += 1
        else:
            matched_same += 1

    report["summary"]["matched_unique_keys"] = len(comparable)
    report["summary"]["matched_without_differences"] = matched_same
    report["summary"]["matched_with_differences"] = matched_diff
    report["summary"]["field_differences"] = field_diff_count
    report["summary"]["only_in_a"] = len(keys_a - keys_b)
    report["summary"]["only_in_b"] = len(keys_b - keys_a)
    report["summary"]["details_truncated"] = report.get("details_truncated", False)
    if report["summary"]["rows_with_blank_keys_a"] or report["summary"]["rows_with_blank_keys_b"]:
        report["warnings"].append("Rows with blank key fields were excluded from matching and placed in Needs Review.")
    if ambiguous_keys:
        report["warnings"].append("Keys duplicated in either file were excluded from automatic matching and placed in Duplicate Keys.")

    return report


def safe_cell(value: Any) -> Any:
    # Prevent report cells from being interpreted as formulas when opened in Excel.
    if isinstance(value, str) and value.lstrip().startswith(("=", "+", "-", "@")):
        return "'" + value
    return value


def write_xlsx_report(path: Path, report: dict[str, Any], overwrite: bool) -> None:
    try:
        from openpyxl import Workbook, load_workbook
        from openpyxl.styles import Font, PatternFill
    except ImportError as exc:
        raise ReconciliationError(
            "Writing the reconciliation workbook requires openpyxl. Install it with: python3 -m pip install openpyxl."
        ) from exc
    if path.exists() and not overwrite:
        raise ReconciliationError(f"Report workbook already exists: {path}. Choose a new --output path.")
    path.parent.mkdir(parents=True, exist_ok=True)
    workbook = Workbook()
    summary_sheet = workbook.active
    summary_sheet.title = "Summary"
    summary_sheet.append(["Metric", "Value"])
    summary = report["summary"]
    summary_rows = [
        ("Input A", report["input_a"]),
        ("Input B", report["input_b"]),
        ("Selected sheet A", report.get("selected_sheet_a") or "(CSV)"),
        ("Selected sheet B", report.get("selected_sheet_b") or "(CSV)"),
        ("Key columns", ", ".join(summary["key_columns"])),
        ("Compared columns", ", ".join(summary["comparison_columns"])),
        ("Rows in A", summary["rows_in_a"]),
        ("Rows in B", summary["rows_in_b"]),
        ("Unique keys matched", summary["matched_unique_keys"]),
        ("Matched keys without differences", summary["matched_without_differences"]),
        ("Matched keys with differences", summary["matched_with_differences"]),
        ("Field differences", summary["field_differences"]),
        ("Only in A", summary["only_in_a"]),
        ("Only in B", summary["only_in_b"]),
        ("Duplicate keys requiring review", summary["duplicate_keys"]),
        ("Rows with blank keys in A", summary["rows_with_blank_keys_a"]),
        ("Rows with blank keys in B", summary["rows_with_blank_keys_b"]),
    ]
    for row in summary_rows:
        summary_sheet.append([safe_cell(row[0]), safe_cell(row[1])])
    for warning in report["warnings"]:
        summary_sheet.append(["Warning", safe_cell(warning)])

    differences_sheet = workbook.create_sheet("Field Differences")
    key_columns = summary["key_columns"]
    differences_sheet.append([*key_columns, "A Row", "B Row", "Column", "Value in A", "Value in B"])
    for item in report["differences"]:
        differences_sheet.append([
            *[safe_cell(item["key"].get(column, "")) for column in key_columns],
            item["row_a"], item["row_b"], safe_cell(item["column"]),
            safe_cell(display_value(item["value_a"])), safe_cell(display_value(item["value_b"])),
        ])

    only_a = workbook.create_sheet("Only in A")
    only_a.append(["Source Row", *headers_from_report(report, "A")])
    for item in report["only_in_a"]:
        only_a.append([item["row_number"], *[
            safe_cell(display_value(item["row_data"].get(column))) for column in headers_from_report(report, "A")
        ]])

    only_b = workbook.create_sheet("Only in B")
    only_b.append(["Source Row", *headers_from_report(report, "B")])
    for item in report["only_in_b"]:
        only_b.append([item["row_number"], *[
            safe_cell(display_value(item["row_data"].get(column))) for column in headers_from_report(report, "B")
        ]])

    duplicates = workbook.create_sheet("Duplicate Keys")
    duplicates.append([*key_columns, "Rows in A", "Rows in B", "Count A", "Count B", "Issue"])
    for item in report["duplicate_keys"]:
        duplicates.append([
            *[safe_cell(display_value(item["key"].get(column))) for column in key_columns],
            ", ".join(map(str, item["rows_a"])),
            ", ".join(map(str, item["rows_b"])),
            item["count_a"], item["count_b"], item["issue"],
        ])

    review = workbook.create_sheet("Needs Review")
    review.append(["File", "Source Row", "Issue", "Key Values", "Row Data"])
    for item in report["needs_review"]:
        review.append([
            item["file"], item["row_number"], item["issue"],
            safe_cell(json.dumps(item["key_values"], ensure_ascii=False)),
            safe_cell(json.dumps(item["row_data"], ensure_ascii=False)),
        ])

    header_fill = PatternFill(fill_type="solid", fgColor="244062")
    for sheet in workbook.worksheets:
        sheet.freeze_panes = "A2"
        sheet.auto_filter.ref = sheet.dimensions
        for cell in sheet[1]:
            cell.font = Font(bold=True, color="FFFFFF")
            cell.fill = header_fill
        for column_cells in sheet.columns:
            max_width = max((len(str(cell.value or "")) for cell in list(column_cells)[:200]), default=10)
            sheet.column_dimensions[column_cells[0].column_letter].width = max(10, min(42, max_width + 2))

    fd, temp_name = tempfile.mkstemp(prefix=f".{path.stem}.", suffix=".xlsx", dir=str(path.parent))
    os.close(fd)
    try:
        workbook.save(temp_name)
        workbook.close()
        verification = load_workbook(temp_name, read_only=True, data_only=True)
        try:
            expected_names = ["Summary", "Field Differences", "Only in A", "Only in B", "Duplicate Keys", "Needs Review"]
            if verification.sheetnames != expected_names:
                raise ReconciliationError("Output validation failed: reconciliation report tabs are missing or reordered.")
            if verification["Field Differences"].max_row != len(report["differences"]) + 1:
                raise ReconciliationError("Output validation failed: field-difference rows do not match the report.")
            if verification["Only in A"].max_row != len(report["only_in_a"]) + 1:
                raise ReconciliationError("Output validation failed: Only in A rows do not match the report.")
            if verification["Only in B"].max_row != len(report["only_in_b"]) + 1:
                raise ReconciliationError("Output validation failed: Only in B rows do not match the report.")
        finally:
            verification.close()
        os.replace(temp_name, path)
    finally:
        try:
            workbook.close()
        except Exception:
            pass
        if os.path.exists(temp_name):
            os.unlink(temp_name)


def headers_from_report(report: dict[str, Any], label: str) -> list[str]:
    return report[f"headers_{label.lower()}"]


def write_json_report(path: Path, report: dict[str, Any], overwrite: bool) -> None:
    if path.exists() and not overwrite:
        raise ReconciliationError(f"JSON report already exists: {path}. Choose a new --report path.")
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temp_name = tempfile.mkstemp(prefix=f".{path.stem}.", suffix=".json", dir=str(path.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as handle:
            json.dump(report, handle, ensure_ascii=False, indent=2)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temp_name, path)
    finally:
        if os.path.exists(temp_name):
            os.unlink(temp_name)


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Match two CSV/XLSX/XLSM tables by explicit key columns and write a differences workbook plus JSON report."
    )
    parser.add_argument("file_a", type=Path)
    parser.add_argument("file_b", type=Path)
    parser.add_argument("--key", action="append", required=True, help="Key column name; repeat for a composite key")
    parser.add_argument("--compare", action="append", help="Column to compare; repeat for multiple columns. Defaults to all shared non-key columns.")
    parser.add_argument("--sheet-a", help="Worksheet name in file A (Excel only; defaults to the first visible sheet)")
    parser.add_argument("--sheet-b", help="Worksheet name in file B (Excel only; defaults to the first visible sheet)")
    parser.add_argument("--output", type=Path, help="Reconciliation XLSX path")
    parser.add_argument("--report", type=Path, help="JSON audit-report path")
    parser.add_argument("--overwrite-output", action="store_true", help="Allow replacing existing report outputs; never overwrites input files")
    return parser.parse_args(argv)


def run(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    input_a = args.file_a.expanduser().resolve()
    input_b = args.file_b.expanduser().resolve()
    for input_path in (input_a, input_b):
        if not input_path.is_file():
            raise ReconciliationError(f"Input file does not exist or is not a regular file: {input_path}")
        if input_path.suffix.lower() not in SUPPORTED_SUFFIXES:
            raise ReconciliationError(f"Unsupported file type for {input_path.name}; use CSV, XLSX, or XLSM.")
    if input_a == input_b:
        raise ReconciliationError("Input A and input B must be different files.")

    default_stem = f"{input_a.stem}_vs_{input_b.stem}_reconciliation"
    output_path = (
        args.output.expanduser().resolve()
        if args.output
        else input_a.with_name(default_stem + ".xlsx")
    )
    report_path = (
        args.report.expanduser().resolve()
        if args.report
        else input_a.with_name(default_stem + ".json")
    )
    if output_path in {input_a, input_b} or report_path in {input_a, input_b}:
        raise ReconciliationError("Report paths must never overwrite either input file.")
    if output_path == report_path:
        raise ReconciliationError("The XLSX workbook and JSON report must use different paths.")
    if output_path.suffix.lower() != ".xlsx":
        raise ReconciliationError("The reconciliation workbook output must use the .xlsx extension.")
    if not args.overwrite_output:
        existing = [str(path) for path in (output_path, report_path) if path.exists()]
        if existing:
            raise ReconciliationError("Output path(s) already exist: " + ", ".join(existing) + ". Choose new paths or explicitly allow overwriting report outputs.")

    report = reconcile(
        input_a,
        input_b,
        output_path,
        report_path,
        key_columns=args.key,
        compare_columns=args.compare,
        sheet_a=args.sheet_a,
        sheet_b=args.sheet_b,
    )
    _, records_a, _, _ = read_table(input_a, args.sheet_a)
    _, records_b, _, _ = read_table(input_b, args.sheet_b)
    headers_a = list(records_a[0]["values"].keys()) if records_a else []
    headers_b = list(records_b[0]["values"].keys()) if records_b else []
    # Preserve the schema even when a source has headers but zero data records.
    if not headers_a:
        headers_a, _, _, _ = read_table(input_a, args.sheet_a)
    if not headers_b:
        headers_b, _, _, _ = read_table(input_b, args.sheet_b)
    report["headers_a"] = headers_a
    report["headers_b"] = headers_b
    report["completed_at"] = utc_now()
    write_xlsx_report(output_path, report, overwrite=args.overwrite_output)
    write_json_report(report_path, report, overwrite=args.overwrite_output)
    print(json.dumps({
        "ok": True,
        "input_a": str(input_a),
        "input_b": str(input_b),
        "output_workbook": str(output_path),
        "report_json": str(report_path),
        "summary": report["summary"],
        "warnings": report["warnings"],
    }, ensure_ascii=False, indent=2))
    return 0


def main() -> None:
    try:
        raise SystemExit(run())
    except ReconciliationError as exc:
        print(f"reconcile_spreadsheets: {exc}", file=sys.stderr)
        raise SystemExit(2)


if __name__ == "__main__":
    main()
