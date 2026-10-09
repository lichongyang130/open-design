from __future__ import annotations

import contextlib
import csv
import io
import json
import tempfile
import unittest
from pathlib import Path

try:
    import openpyxl
except ImportError:
    openpyxl = None

import sys
SKILL_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SKILL_ROOT / "scripts"))

import detect_anomalies as detector  # noqa: E402


class CsvAnomalyDetectionTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory(prefix="od-anomaly-detection-")
        self.root = Path(self.temp.name)
        self.source = self.root / "sales.csv"
        self.report_path = self.root / "sales_anomaly_report.json"
        self.source.write_text(
            "OrderID,Amount,Required,Status\n"
            "001,10,A,paid\n"
            "002,11,B,paid\n"
            "003,12,C,paid\n"
            "004,13,D,paid\n"
            "005,14,E,paid\n"
            "006,15,F,paid\n"
            "007,16,G,paid\n"
            "008,17,H,paid\n"
            "009,1000,,review\n"
            "009,1000,,review\n"
            "010,#DIV/0!,I,review\n",
            encoding="utf-8",
        )

    def tearDown(self) -> None:
        self.temp.cleanup()

    def test_detects_missing_required_values_duplicate_rows_numeric_outliers_and_error_values(self) -> None:
        report = detector.detect(
            self.source,
            required_columns=["Required"],
        )

        self.assertEqual(report["summary"]["missing_values"], 2)
        self.assertEqual(report["summary"]["rows_scanned"], 11)
        self.assertEqual(report["summary"]["exact_duplicate_rows"], 1)
        self.assertEqual(report["summary"]["error_values"], 1)
        self.assertEqual(report["summary"]["numeric_outlier_candidates"], 2)
        self.assertEqual(report["findings"]["exact_duplicate_rows"][0]["row"], 6)
        self.assertEqual(report["findings"]["exact_duplicate_rows"][0]["kept_row"], 5)
        self.assertTrue(all(
            item["action"] == "review_only"
            for item in report["findings"]["numeric_outliers"]
        ))
        self.assertTrue(self.source.exists(), "anomaly detection must not edit the input")

    def test_json_cli_writes_report_without_modifying_source(self) -> None:
        original = self.source.read_bytes()
        stdout = io.StringIO()
        with contextlib.redirect_stdout(stdout):
            result = detector.run([
                str(self.source),
                "--required-column", "Required",
                "--report", str(self.report_path),
            ])

        self.assertEqual(result, 0)
        self.assertTrue(self.report_path.exists())
        self.assertEqual(self.source.read_bytes(), original)
        payload = json.loads(self.report_path.read_text(encoding="utf-8"))
        self.assertEqual(payload["summary"]["exact_duplicate_rows"], 1)
        self.assertIn('"ok": true', stdout.getvalue().lower())

    def test_rejects_report_path_that_overwrites_source(self) -> None:
        original = self.source.read_bytes()
        with self.assertRaises(detector.AnomalyDetectionError):
            detector.run([str(self.source), "--report", str(self.source)])
        self.assertEqual(self.source.read_bytes(), original)

    def test_invalid_required_column_is_an_actionable_error(self) -> None:
        with self.assertRaisesRegex(detector.AnomalyDetectionError, "not found"):
            detector.detect(self.source, required_columns=["Unknown"])


@unittest.skipIf(openpyxl is None, "openpyxl is required for Excel anomaly tests")
class ExcelAnomalyDetectionTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory(prefix="od-anomaly-xlsx-")
        self.root = Path(self.temp.name)
        self.source = self.root / "sales.xlsx"

    def tearDown(self) -> None:
        self.temp.cleanup()

    def test_reports_formula_errors_and_respects_selected_sheet(self) -> None:
        workbook = openpyxl.Workbook()
        first = workbook.active
        first.title = "Orders"
        first.append(["OrderID", "Amount"])
        first.append(["A-1", 10])
        first.append(["A-2", 11])
        first.append(["A-3", 12])
        first.append(["A-4", 1000])
        first.append(["A-5", "=SUM(#REF!)"])
        other = workbook.create_sheet("Hidden")
        other.sheet_state = "hidden"
        other.append(["ID", "Value"])
        other.append(["X", 1])
        workbook.save(self.source)
        workbook.close()

        report = detector.detect(self.source, sheet_name="Orders", numeric_columns=["Amount"])

        self.assertEqual(report["selected_sheet"], "Orders")
        self.assertEqual(report["summary"]["rows_scanned"], 5)
        self.assertEqual(report["summary"]["broken_reference_formulas"], 1)
        self.assertEqual(report["summary"]["numeric_outlier_candidates"], 1)

    def test_unknown_worksheet_is_rejected(self) -> None:
        workbook = openpyxl.Workbook()
        workbook.active.title = "Orders"
        workbook.save(self.source)
        workbook.close()

        with self.assertRaisesRegex(detector.AnomalyDetectionError, "not found"):
            detector.detect(self.source, sheet_name="No Such Sheet")


if __name__ == "__main__":
    unittest.main()
