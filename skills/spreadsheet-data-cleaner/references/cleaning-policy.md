# Spreadsheet Cleaning Policy

## Safe by default

- Never overwrite the source workbook or CSV.
- Trim leading/trailing whitespace from text cells.
- Do not coerce types, fill blanks, normalize dates, change currencies, or modify formulas without a rule supported by the user request or a clear data contract.
- Keep an audit trail for every text edit and every row-level finding.
- Treat unusual values as findings, not automatically as errors.

## Destructive actions require scope

- CSV blank-row removal is explicit (--drop-empty-rows).
- CSV exact duplicate-row removal is explicit (--dedupe) and keeps the first occurrence.
- For XLSX/XLSM, rows are never shifted. Explicit duplicate cleanup clears cell values in exact duplicate rows only when that row contains no formula. Formula-bearing duplicate rows remain untouched and are reported.
- Exact duplicates mean every cell in the selected row matches after the configured text normalization. This is not equivalent to a repeated business key such as order number or invoice number.

## Verification boundary

- CSV output is parsed back and compared to the in-memory expected rows before publication.
- Excel output is reopened and checked for the same worksheet names and formula count.
- Formula strings are preserved, not calculated. Reopening in a compatible spreadsheet application may be required to refresh displayed formula results.
- XLSX/XLSM features outside the fidelity guarantees of openpyxl must be reviewed in the native application.
- JSON report paths must not alias the source file.
