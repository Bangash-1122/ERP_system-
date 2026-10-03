import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

export function exportToExcel(data, fileName = 'export') {
  if (!data || !data.length) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(blob, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportToCSV(data, fileName = 'export') {
  if (!data || !data.length) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportToPDF(columns, data, title = 'ERP Report', fileName = 'report') {
  const doc = new jsPDF('p', 'pt', 'a4');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(`NEXUS ERP - ${title.toUpperCase()}`, 40, 45);
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 65);

  let y = 95;
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);

  // Table Headers
  const colWidth = 515 / (columns.length || 1);
  doc.setFillColor(241, 245, 249);
  doc.rect(40, y - 12, 515, 20, 'F');
  columns.forEach((col, idx) => {
    doc.text(String(col.header || col.key || ''), 45 + idx * colWidth, y);
  });

  y += 18;

  // Rows
  data.slice(0, 35).forEach((row) => {
    if (y > 780) {
      doc.addPage();
      y = 40;
    }
    columns.forEach((col, idx) => {
      const val = row[col.key] !== undefined ? String(row[col.key]) : '';
      doc.text(val.slice(0, 22), 45 + idx * colWidth, y);
    });
    y += 16;
  });

  doc.save(`${fileName}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
