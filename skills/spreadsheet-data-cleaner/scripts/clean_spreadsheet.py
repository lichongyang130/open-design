#!/usr/bin/env python3
"""Conservative spreadsheet cleaner for CSV, XLSX, and XLSM.

CSV structural changes are supported explicitly. Excel row positions are never
deleted or shifted; opted-in duplicate removal clears duplicate row values only,
preserving row coordinates and formula references. Formulas are preserved, not
evaluated by this script.
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
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable


MAX_CELLS_PER_SHEET = 1_000_000
MAX_RECORDED_ITEMS = 5_000
SUPPORTED_CSV_ENCODINGS = ("utf-8", "gb18030", "cp1252")


class CleanerError(Exception):
    """An actionable input, safety, or validation failure."""


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def is_blank(value: Any) -> bool:
    return value is None or (isinstance(value, str) and value.strip() == "")


def clean_text(value: Any, collapse_whitespace: bool) -> Any:
    if not isinstance(value, str) or value.startswith("="):
        return value
    result = value.strip()
    if collapse_whitespace:
        result = re.sub(r"\s+", " ", result)
    return result


def _record(items: list[dict[str, Any]], item: dict[str, Any], report: dict[str, Any]) -> None:
    if len(items) < MAX_RECORDED_ITEMS:
        items.append(item)
    else:
        report["details_truncated"] = True


def _build_report(
    input_path: Path,
    output_path: Path,
    file_type: str,
    dry_run: bool,
) -> dict[str, Any]:
    return {
        "schema_version": 1,
        "tool": "spreadsheet-data-cleaner",
        "created_at": utc_now(),
        "input_file": str(input_path.resolve()),
        "output_file": str(output_path.resolve()),
        "file_type": file_type,
        "dry_run": dry_run,
        "summary": {
            "sheets_processed": 0,
            "rows_read": 0,
            "blank_rows_detected": 0,
            "blank_rows_removed": 0,
            "blank_rows_planned_for_removal": 0,
            "duplicate_rows_detected": 0,
            "duplicate_rows_removed": 0,
            "duplicate_rows_planned_for_removal": 0,
            "duplicate_rows_cleared": 0,
            "duplicate_rows_planned_for_clearing": 0,
            "text_cells_trimmed": 0,
            "text_cells_planned_to_trim": 0,
            "rows_after_planned_changes": 0,
            "formula_cells_preserved": 0,
        },
        "changes": [],
        "findings": [],
        "warnings": [],
    }


def _choose_delimiter(text: str) -> str:
    try:
        return csv.Sniffer().sniff(text[:65536], delimiters=",;\t|").delimiter
    except csv.Error:
        return ","


def _read_csv(input_path: Path) -> tuple[list[list[str]], str, str]:
    payload = input_path.read_bytes()
    decoded: str | None = None
    encoding = "utf-8"
    if payload.startswith(b"\xef\xbb\xbf"):
        decoded = payload.decode("utf-8-sig")
        encoding = "utf-8-sig"
    else:
        for candidate in SUPPORTED_CSV_ENCODINGS:
            try:
                decoded = payload.decode(candidate)
                encoding = candidate
                break
            except UnicodeDecodeError:
                continue
    if decoded is None:
        raise CleanerError(
            "Could not decode this CSV as UTF-8, GB18030, or a common single-byte encoding. "
            "Convert it to UTF-8 or specify an explicitly supported encoding."
        )
    delimiter = _choose_delimiter(decoded)
    try:
        rows = list(csv.reader(io.StringIO(decoded, newline=""), delimiter=delimiter))
    except csv.Error as exc:
        raise CleanerError(f"CSV parse failed: {exc}") from exc
    return rows, delimiter, encoding


def _write_csv(path: Path, rows: list[list[Any]], delimiter: str, encoding: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    use_bom = encoding == "utf-8-sig"
    out_encoding = "utf-8-sig" if use_bom else "utf-8"
    fd, temp_name = tempfile.mkstemp(prefix=f".{path.stem}.", suffix=path.suffix, dir=str(path.parent))
    try:
        with os.fdopen(fd, "w", encoding=out_encoding, newline="") as handle:
            writer = csv.writer(handle, delimiter=delimiter, lineterminator="\n")
            writer.writerows(rows)
            handle.flush()
            os.fsync(handle.fileno())
        with open(temp_name, "r", encoding=out_encoding, newline="") as handle:
            verified = list(csv.reader(handle, delimiter=delimiter))
        if verified != rows:
            raise CleanerError("CSV output validation failed; the output was not published.")
        os.replace(temp_name, path)
    finally:
        if os.path.exists(temp_name):
            os.unlink(temp_name)


def clean_csv(
    input_path: Path,
    output_path: Path,
    *,
    report: dict[str, Any],
    trim_text: bool = True,
    collapse_whitespace: bool = False,
    drop_empty_rows: bool = False,
    dedupe: bool = False,
    has_header: bool = True,
    dry_run: bool = False,
) -> dict[str, Any]:
    rows, delimiter, source_encoding = _read_csv(input_path)
    report["delimiter"] = {"\t": "tab"}.get(delimiter, delimiter)
    report["source_encoding"] = source_encoding
    report["summary"]["sheets_processed"] = 1
    report["summary"]["rows_read"] = len(rows)

    transformed: list[list[str]] = []
    original_line_numbers: list[int] = []
    for line_number, row in enumerate(rows, start=1):
        new_row = list(row)
        if trim_text:
            for column_index, value in enumerate(row, start=1):
                cleaned = clean_text(value, collapse_whitespace)
                if cleaned != value:
                    new_row[column_index - 1] = cleaned
                    report["summary"]["text_cells_planned_to_trim"] += 1
                    if not dry_run:
                        report["summary"]["text_cells_trimmed"] += 1
                    _record(
                        report["changes"],
                        {
                            "kind": "trim_text",
                            "row": line_number,
                            "column": column_index,
                            "original": value,
                            "updated": cleaned,
                        },
                        report,
                    )
        transformed.append(new_row)
        original_line_numbers.append(line_number)

    blank_rows = 0
    rows_after_blanks: list[list[str]] = []
    line_numbers_after_blanks: list[int] = []
    for row, line_number in zip(transformed, original_line_numbers):
        if all(is_blank(value) for value in row):
            blank_rows += 1
            _record(
                report["findings"],
                {"kind": "blank_row", "row": line_number, "action": ("would_remove" if dry_run else "removed") if drop_empty_rows else "reported_only"},
                report,
            )
            if drop_empty_rows:
                if dry_run:
                    report["summary"]["blank_rows_planned_for_removal"] += 1
                else:
                    report["summary"]["blank_rows_removed"] += 1
                continue
        rows_after_blanks.append(row)
        line_numbers_after_blanks.append(line_number)
    report["summary"]["blank_rows_detected"] = blank_rows

    seen: dict[tuple[str, ...], int] = {}
    final_rows: list[list[str]] = []
    data_start = 2 if has_header and rows_after_blanks else 1
    for index, (row, line_number) in enumerate(zip(rows_after_blanks, line_numbers_after_blanks), start=1):
        if index < data_start or all(is_blank(value) for value in row):
            final_rows.append(row)
            continue
        key = tuple(row)
        kept_line = seen.get(key)
        if kept_line is None:
            seen[key] = line_number
            final_rows.append(row)
            continue
        report["summary"]["duplicate_rows_detected"] += 1
        _record(
            report["findings"],
            {
                "kind": "exact_duplicate_row",
                "row": line_number,
                "kept_row": kept_line,
                "action": ("would_remove" if dry_run else "removed") if dedupe else "reported_only",
            },
            report,
        )
        if dedupe:
            if dry_run:
                report["summary"]["duplicate_rows_planned_for_removal"] += 1
            else:
                report["summary"]["duplicate_rows_removed"] += 1
        else:
            final_rows.append(row)

    if dry_run:
        report["warnings"].append("Dry run only: the input file was not changed and no cleaned workbook/CSV was written.")
    else:
        _write_csv(output_path, final_rows, delimiter, source_encoding)
        report["output_written"] = True
    report["summary"]["rows_after_planned_changes"] = len(final_rows)
    if not dry_run:
        report["summary"]["rows_written"] = len(final_rows)
    return report


def _formula_count(workbook: Any) -> int:
    count = 0
    for worksheet in workbook.worksheets:
        for row in worksheet.iter_rows():
            for cell in row:
                if isinstance(cell.value, str) and cell.value.startswith("="):
                    count += 1
    return count


def _json_value(value: Any) -> Any:
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    if hasattr(value, "isoformat"):
        try:
            return value.isoformat()
        except Exception:
            pass
    return str(value)


def clean_workbook(
    input_path: Path,
    output_path: Path,
    *,
    report: dict[str, Any],
    trim_text: bool = True,
    collapse_whitespace: bool = False,
    dedupe: bool = False,
    has_header: bool = True,
    selected_sheets: list[str] | None = None,
    include_hidden_sheets: bool = False,
    dry_run: bool = False,
) -> dict[str, Any]:
    try:
        from openpyxl import load_workbook
        from openpyxl.cell.cell import MergedCell
    except ImportError as exc:
        raise CleanerError(
            "Excel support requires openpyxl. Install it in the active Python environment "
            "with: python3 -m pip install openpyxl. CSV cleaning works without it."
        ) from exc

    keep_vba = input_path.suffix.lower() == ".xlsm"
    try:
        workbook = load_workbook(input_path, data_only=False, keep_vba=keep_vba, keep_links=True)
    except Exception as exc:
        raise CleanerError(f"Could not open workbook: {exc}") from exc

    available_names = [sheet.title for sheet in workbook.worksheets]
    if selected_sheets:
        missing = [name for name in selected_sheets if name not in available_names]
        if missing:
            workbook.close()
            raise CleanerError(f"Unknown worksheet(s): {', '.join(missing)}. Available: {', '.join(available_names)}")
        targets = [workbook[name] for name in selected_sheets]
    else:
        targets = [
            sheet for sheet in workbook.worksheets
            if include_hidden_sheets or sheet.sheet_state == "visible"
        ]

    if not targets:
        workbook.close()
        raise CleanerError("No worksheets selected. Check --sheet or use --include-hidden-sheets.")

    for sheet in workbook.worksheets:
        if sheet not in targets:
            report["warnings"].append(f"Skipped worksheet {sheet.title!r} (not selected or hidden).")

    initial_formula_count = _formula_count(workbook)
    summary = report["summary"]
    for worksheet in targets:
        cell_rectangle = worksheet.max_row * worksheet.max_column
        if cell_rectangle > MAX_CELLS_PER_SHEET:
            workbook.close()
            raise CleanerError(
                f"Worksheet {worksheet.title!r} spans {cell_rectangle:,} cells, above the safety limit "
                f"of {MAX_CELLS_PER_SHEET:,}. Export only the relevant range to CSV or split the task."
            )
        summary["sheets_processed"] += 1
        summary["rows_read"] += worksheet.max_row
        if worksheet.max_row == 0 or worksheet.max_column == 0:
            continue

        seen: dict[tuple[Any, ...], int] = {}
        header_row = 1 if has_header else None
        for row_index in range(1, worksheet.max_row + 1):
            cells = [worksheet.cell(row=row_index, column=col) for col in range(1, worksheet.max_column + 1)]
            writable_cells = [cell for cell in cells if not isinstance(cell, MergedCell)]
            if trim_text:
                for cell in writable_cells:
                    old_value = cell.value
                    new_value = clean_text(old_value, collapse_whitespace)
                    if new_value != old_value:
                        cell.value = new_value
                        summary["text_cells_planned_to_trim"] += 1
                        if not dry_run:
                            summary["text_cells_trimmed"] += 1
                        _record(
                            report["changes"],
                            {
                                "kind": "trim_text",
                                "sheet": worksheet.title,
                                "cell": cell.coordinate,
                                "original": _json_value(old_value),
                                "updated": _json_value(new_value),
                            },
                            report,
                        )
            for cell in writable_cells:
                if isinstance(cell.value, str) and cell.value.startswith("="):
                    summary["formula_cells_preserved"] += 1

            values = tuple((type(cell.value).__name__, _json_value(cell.value)) for cell in cells)
            if all(is_blank(value) for value in values):
                summary["blank_rows_detected"] += 1
                _record(
                    report["findings"],
                    {"kind": "blank_row", "sheet": worksheet.title, "row": row_index, "action": "reported_only"},
                    report,
                )
                continue

            if header_row == row_index:
                continue
            key = tuple(values)
            kept_row = seen.get(key)
            if kept_row is None:
                seen[key] = row_index
                continue

            summary["duplicate_rows_detected"] += 1
            row_has_formula = any(
                isinstance(cell.value, str) and cell.value.startswith("=")
                for cell in writable_cells
            )
            action = "reported_only"
            if dedupe and row_has_formula:
                action = "not_cleared_formula_cells_present"
            elif dedupe:
                action = "would_clear_values_in_place" if dry_run else "cleared_values_in_place"
                for cell in writable_cells:
                    if cell.value is not None:
                        old_value = cell.value
                        cell.value = None
                        _record(
                            report["changes"],
                            {
                                "kind": "clear_duplicate_value",
                                "sheet": worksheet.title,
                                "cell": cell.coordinate,
                                "row": row_index,
                                "kept_row": kept_row,
                                "original": _json_value(old_value),
                                "updated": None,
                            },
                            report,
                        )
                if dry_run:
                    summary["duplicate_rows_planned_for_clearing"] += 1
                else:
                    summary["duplicate_rows_cleared"] += 1
            _record(
                report["findings"],
                {
                    "kind": "exact_duplicate_row",
                    "sheet": worksheet.title,
                    "row": row_index,
                    "kept_row": kept_row,
                    "action": action,
                },
                report,
            )

    try:
        calc = getattr(workbook, "calculation", None)
        if calc is not None:
            calc.fullCalcOnLoad = True
            calc.forceFullCalc = True
            calc.calcMode = "auto"
            report["warnings"].append(
                "Formula cells were preserved but not evaluated by this script; the workbook requests recalculation when opened in a compatible spreadsheet app."
            )
        else:
            report["warnings"].append("Formula cells were preserved but no recalculation-on-open flag was available.")
        if keep_vba:
            report["warnings"].append("VBA preservation was enabled for XLSM. Review advanced workbook features after opening the output.")
        report["warnings"].append(
            "Excel row positions were not deleted or shifted. Opted-in duplicate rows have their values cleared in place; formula-bearing duplicate rows are left for review."
        )
        summary["rows_after_planned_changes"] = summary["rows_read"]
        if not dry_run:
            summary["rows_written"] = summary["rows_read"]
            output_path.parent.mkdir(parents=True, exist_ok=True)
            fd, temp_name = tempfile.mkstemp(prefix=f".{output_path.stem}.", suffix=output_path.suffix, dir=str(output_path.parent))
            os.close(fd)
            try:
                workbook.save(temp_name)
                verification = load_workbook(temp_name, data_only=False, keep_vba=keep_vba, keep_links=True, read_only=True)
                try:
                    if verification.sheetnames != workbook.sheetnames:
                        raise CleanerError("Workbook validation failed: worksheet names changed.")
                    if _formula_count(verification) != initial_formula_count:
                        raise CleanerError("Workbook validation failed: formula count changed.")
                finally:
                    verification.close()
                os.replace(temp_name, output_path)
            finally:
                if os.path.exists(temp_name):
                    os.unlink(temp_name)
            report["output_written"] = True
        else:
            report["warnings"].append("Dry run only: the input workbook was not changed and no cleaned workbook was written.")
        return report
    finally:
        workbook.close()


def write_report(report_path: Path, report: dict[str, Any], overwrite: bool) -> None:
    if report_path.exists() and not overwrite:
        raise CleanerError(
            f"Report already exists: {report_path}. Choose a new --report path or pass --overwrite-output."
        )
    report_path.parent.mkdir(parents=True, exist_ok=True)
    fd, temp_name = tempfile.mkstemp(prefix=f".{report_path.stem}.", suffix=".json", dir=str(report_path.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as handle:
            json.dump(report, handle, ensure_ascii=False, indent=2)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temp_name, report_path)
    finally:
        if os.path.exists(temp_name):
            os.unlink(temp_name)


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Safely clean CSV/XLSX/XLSM files and write a JSON audit report. The input is never overwritten."
    )
    parser.add_argument("input_file", type=Path, help="CSV, XLSX, or XLSM input file")
    parser.add_argument("--output", type=Path, help="Output file path; defaults to <name>_cleaned.<ext>")
    parser.add_argument("--report", type=Path, help="JSON report path; defaults to <output-stem>_cleaning_report.json")
    parser.add_argument("--dry-run", action="store_true", help="Analyze and report planned changes without writing a cleaned file")
    parser.add_argument("--drop-empty-rows", action="store_true", help="CSV only: remove rows whose cells are all blank")
    parser.add_argument("--dedupe", action="store_true", help="Opt in to removing exact duplicate CSV rows or clearing duplicate Excel row values in place")
    parser.add_argument("--no-header", action="store_true", help="Treat the first row as data instead of a header")
    parser.add_argument("--collapse-whitespace", action="store_true", help="Also collapse internal whitespace; may change intentional spacing")
    parser.add_argument("--no-trim-text", action="store_true", help="Do not trim leading/trailing whitespace")
    parser.add_argument("--sheet", action="append", help="Excel worksheet to process; repeat to select multiple sheets")
    parser.add_argument("--include-hidden-sheets", action="store_true", help="Include hidden Excel worksheets when no --sheet was provided")
    parser.add_argument("--overwrite-output", action="store_true", help="Allow replacing an existing output/report, never the input")
    return parser.parse_args(argv)


def run(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    input_path = args.input_file.expanduser().resolve()
    if not input_path.is_file():
        raise CleanerError(f"Input file does not exist or is not a regular file: {input_path}")
    suffix = input_path.suffix.lower()
    if suffix not in {".csv", ".xlsx", ".xlsm"}:
        raise CleanerError("Supported formats are .csv, .xlsx, and .xlsm. Legacy .xls files must be exported to .xlsx first.")

    output_path = (args.output.expanduser().resolve() if args.output else input_path.with_name(input_path.stem + "_cleaned" + input_path.suffix))
    report_path = (args.report.expanduser().resolve() if args.report else output_path.with_name(output_path.stem + "_cleaning_report.json"))
    if output_path == input_path or report_path == input_path:
        raise CleanerError("The output and report paths must never overwrite the input file.")
    if output_path == report_path:
        raise CleanerError("The cleaned file and JSON report must use different paths.")
    if output_path.suffix.lower() != suffix:
        raise CleanerError(f"Output extension must remain {suffix} to preserve the file type.")
    if not args.dry_run and output_path.exists() and not args.overwrite_output:
        raise CleanerError(f"Output already exists: {output_path}. Choose a new --output path or pass --overwrite-output.")
    if report_path.exists() and not args.overwrite_output:
        raise CleanerError(f"Report already exists: {report_path}. Choose a new --report path or pass --overwrite-output.")
    if suffix in {".xlsx", ".xlsm"} and args.drop_empty_rows:
        raise CleanerError(
            "--drop-empty-rows is CSV-only. Excel rows are not physically deleted because doing so can invalidate formulas and references."
        )

    report = _build_report(input_path, output_path, suffix.lstrip("."), args.dry_run)
    if args.collapse_whitespace:
        report["warnings"].append("Internal whitespace collapsing was enabled and may alter intentional text spacing.")
    if args.no_trim_text:
        report["warnings"].append("Whitespace trimming was disabled.")

    if suffix == ".csv":
        clean_csv(
            input_path, output_path, report=report,
            trim_text=not args.no_trim_text,
            collapse_whitespace=args.collapse_whitespace,
            drop_empty_rows=args.drop_empty_rows,
            dedupe=args.dedupe,
            has_header=not args.no_header,
            dry_run=args.dry_run,
        )
    else:
        clean_workbook(
            input_path, output_path, report=report,
            trim_text=not args.no_trim_text,
            collapse_whitespace=args.collapse_whitespace,
            dedupe=args.dedupe,
            has_header=not args.no_header,
            selected_sheets=args.sheet,
            include_hidden_sheets=args.include_hidden_sheets,
            dry_run=args.dry_run,
        )
    report["completed_at"] = utc_now()
    write_report(report_path, report, overwrite=args.overwrite_output)
    print(json.dumps({
        "ok": True,
        "input": str(input_path),
        "output": None if args.dry_run else str(output_path),
        "report": str(report_path),
        "summary": report["summary"],
        "warnings": report["warnings"],
    }, ensure_ascii=False, indent=2))
    return 0


def main() -> None:
    try:
        raise SystemExit(run())
    except CleanerError as exc:
        print(f"spreadsheet-data-cleaner: {exc}", file=sys.stderr)
        raise SystemExit(2)


if __name__ == "__main__":
    main()
