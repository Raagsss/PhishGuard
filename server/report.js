import PDFDocument from 'pdfkit';
import { drawRiskGauge, drawTopRisksChart, drawPieChart, drawStatsBox } from './charts.js';

export function generateScanReport(scan, res) {
  const doc = new PDFDocument({ margin: 40 });
  const scanId = scan._id || scan.id || 'local';
  const createdAt = scan.createdAt ? new Date(scan.createdAt) : new Date();
  const flags = Array.isArray(scan.flags) ? scan.flags : [];
  const riskBreakdown = Array.isArray(scan.riskBreakdown) ? scan.riskBreakdown : [];
  const details = scan.details || {};

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="scan-${scanId}.pdf"`);

  doc.pipe(res);

  // Watermark
  doc.save();
  const centerX = doc.page.width / 2;
  const centerY = doc.page.height / 2;
  doc.opacity(0.12);
  doc.rotate(-30, { origin: [centerX, centerY] });
  doc.fontSize(48).fillColor('#7c3aed').text('PHISHING SCAN', centerX - 220, centerY - 20, {
    width: 440,
    align: 'center'
  });
  doc.restore();

  doc.fontSize(20).text('Phishing Scan Report', { align: 'center' });
  doc.moveDown(1.5);

  doc.fontSize(12).text(`Scan ID: ${scanId}`);
  doc.text(`URL: ${scan.url || 'Unknown'}`);
  doc.text(`Risk Level: ${String(scan.riskLevel || 'unknown').toUpperCase()}`);
  doc.text(`Risk Score: ${scan.riskScore ?? 'N/A'}`);
  doc.text(`Date: ${createdAt.toLocaleString()}`);
  doc.moveDown(2);

  // Draw Risk Score Gauge
  doc.fontSize(12).text('Risk Score Gauge', { underline: true });
  doc.moveDown();
  drawRiskGauge(doc, scan.riskScore ?? 0, 180, doc.y);
  doc.moveDown(130);

  // Draw stats box
  doc.moveDown();
  drawStatsBox(doc, details, 50, doc.y);
  doc.moveDown(110);

  doc.addPage();

  // Draw Top Risks Chart
  doc.fontSize(12).text('Top Risk Factors', { underline: true });
  doc.moveDown();
  drawTopRisksChart(doc, riskBreakdown, 50, doc.y, 450, 180);
  doc.moveDown(200);

  doc.addPage();

  // Draw Pie Chart for Risk Breakdown
  doc.fontSize(12).text('Risk Breakdown Distribution', { underline: true });
  doc.moveDown();
  drawPieChart(doc, riskBreakdown, 200, doc.y, 80);
  doc.moveDown(250);

  doc.addPage();

  doc.fontSize(14).text('Detailed Flags', { underline: true });
  doc.moveDown(0.5);

  if (flags.length === 0) {
    doc.fontSize(12).text('No issues detected');
  } else {
    flags.forEach((flag, index) => {
      doc.fontSize(12).text(`${index + 1}. ${flag}`);
    });
  }

  doc.moveDown();
  doc.fontSize(14).text('Risk Breakdown', { underline: true });
  doc.moveDown(0.5);

  if (riskBreakdown.length === 0) {
    doc.fontSize(12).text('No weighted indicators found');
  } else {
    riskBreakdown.forEach((item, index) => {
      doc.fontSize(12).text(`${index + 1}. +${item.points} — ${item.reason}`);
    });
  }

  doc.moveDown();
  doc.fontSize(14).text('Technical Details', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).text(JSON.stringify(details, null, 2));

  doc.end();
}
