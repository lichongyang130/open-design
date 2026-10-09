import { describe, expect, it } from 'vitest';
import JSZip from 'jszip';

import { buildDocumentPreview } from '../src/document-preview.js';
import { kindFor } from '../src/projects.js';

describe('spreadsheet document preview', () => {
  it('classifies CSV as readable text and XLSX/XLSM as spreadsheet workbooks', () => {
    expect(kindFor('sales.csv')).toBe('text');
    expect(kindFor('sales.xlsx')).toBe('spreadsheet');
    expect(kindFor('sales.xlsm')).toBe('spreadsheet');
  });

  it('preserves cell addresses, formulas, cached values, and formula error evidence', async () => {
    const zip = new JSZip();
    zip.file(
      'xl/workbook.xml',
      '<workbook xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Sales" sheetId="1" r:id="rId1"/></sheets></workbook>',
    );
    zip.file(
      'xl/_rels/workbook.xml.rels',
      '<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml" Type="worksheet"/></Relationships>',
    );
    zip.file(
      'xl/styles.xml',
      '<styleSheet><numFmts count="1"><numFmt numFmtId="164" formatCode="yyyy-mm-dd"/></numFmts><cellXfs count="2"><xf numFmtId="0"/><xf numFmtId="164"/></cellXfs></styleSheet>',
    );
    zip.file(
      'xl/sharedStrings.xml',
      '<sst><si><t>Amount</t></si><si><t>Total</t></si></sst>',
    );
    zip.file(
      'xl/worksheets/sheet1.xml',
      '<worksheet><sheetData>' +
        '<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c></row>' +
        '<row r="2"><c r="A2"><v>12</v></c><c r="B2"><f>SUM(A2:A2)</f><v>12</v></c><c r="C2" t="e"><v>#REF!</v></c><c r="D2"/><c r="E2" s="1"><v>45292</v></c></row>' +
        '</sheetData></worksheet>',
    );

    const buffer = await zip.generateAsync({ type: 'nodebuffer' });
    const preview = await buildDocumentPreview({ name: 'sales.xlsx', buffer });
    const section = preview.sections.find((item) => item.title === 'Sales');
    const lines = section?.lines.join('\n') ?? '';

    expect(lines).toContain('A1="Amount"');
    expect(lines).toContain('B2 formula=SUM(A2:A2) cached=12');
    expect(lines).toContain('C2 error=#REF!');
    expect(lines).toContain('D2=(blank)');
    expect(lines).toContain('E2=45292 format="yyyy-mm-dd"');
  });
});
