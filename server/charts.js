/**
 * Chart functions using PDFKit native drawing (no external dependencies)
 */

/**
 * Draw a risk gauge using PDFKit shapes
 */
export function drawRiskGauge(doc, riskScore, x, y) {
  const maxScore = 100;
  const radius = 60;
  const centerX = x + radius;
  const centerY = y + radius;

  // Determine color based on risk
  let color = '#22c55e'; // green
  if (riskScore >= 60) {
    color = '#ef4444'; // red
  } else if (riskScore >= 30) {
    color = '#f97316'; // orange
  }

  // Draw gauge background
  doc.circle(centerX, centerY, radius).stroke('#e5e7eb');

  // Draw gauge fill (arc simulation with circle segments)
  const percentage = Math.min(riskScore / maxScore, 1);
  const endAngle = Math.PI * 1.5 * percentage;

  doc.fillColor(color);
  doc.opacity(0.7);
  doc.circle(centerX, centerY, radius * 0.7).fillAndStroke(color, '#7c3aed');
  doc.opacity(1);

  // Draw score text
  doc.fontSize(24).fillColor('#ffffff').text(String(riskScore), centerX - 15, centerY - 12, { width: 30, align: 'center' });
  doc.fontSize(10).fillColor('#9ca3af').text('Risk Score', centerX - 20, centerY + 10, { width: 40, align: 'center' });
}

/**
 * Draw a horizontal bar chart for top risks
 */
export function drawTopRisksChart(doc, riskBreakdown, x, y, width = 500, height = 200) {
  if (!riskBreakdown || riskBreakdown.length === 0) {
    doc.fontSize(10).fillColor('#9ca3af').text('No risk data available', x, y);
    return;
  }

  const sorted = [...riskBreakdown].sort((a, b) => b.points - a.points).slice(0, 5);
  const maxPoints = Math.max(...sorted.map(item => item.points), 1);
  const barHeight = height / sorted.length;
  const barWidth = width - 150;

  sorted.forEach((item, index) => {
    const barY = y + index * barHeight;
    const fillWidth = (item.points / maxPoints) * barWidth;

    // Label
    doc.fontSize(9).fillColor('#e5e7eb');
    const label = item.reason.slice(0, 20) + (item.reason.length > 20 ? '...' : '');
    doc.text(label, x, barY + 5, { width: 140, height: 15, ellipsis: true });

    // Bar background
    doc.rect(x + 145, barY + 5, barWidth, 15).stroke('#374151');

    // Bar fill
    doc.fillColor('#ef4444').rect(x + 145, barY + 5, fillWidth, 15).fill();

    // Score text
    doc.fontSize(8).fillColor('#9ca3af').text(String(item.points), x + 145 + fillWidth + 5, barY + 5);
  });
}

/**
 * Draw a simple pie chart for risk breakdown
 */
export function drawPieChart(doc, riskBreakdown, x, y, radius = 50) {
  if (!riskBreakdown || riskBreakdown.length === 0) {
    doc.fontSize(10).fillColor('#9ca3af').text('No breakdown data', x, y);
    return;
  }

  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
  const totalPoints = riskBreakdown.reduce((sum, item) => sum + item.points, 1);
  const items = riskBreakdown.slice(0, 6);

  let currentAngle = -Math.PI / 2;

  items.forEach((item, index) => {
    const sliceAngle = (item.points / totalPoints) * Math.PI * 2;
    const endAngle = currentAngle + sliceAngle;

    // Draw slice
    doc.fillColor(colors[index % colors.length]);
    doc.opacity(0.8);

    // Draw arc using lines and curves (simple pie segment)
    const startX = x + Math.cos(currentAngle) * radius;
    const startY = y + Math.sin(currentAngle) * radius;
    const endX = x + Math.cos(endAngle) * radius;
    const endY = y + Math.sin(endAngle) * radius;

    doc.moveTo(x, y);
    doc.lineTo(startX, startY);
    doc.arc(x, y, radius, currentAngle, endAngle);
    doc.lineTo(x, y);
    doc.fill();

    currentAngle = endAngle;
  });

  doc.opacity(1);

  // Add legend
  let legendY = y + radius + 20;
  items.forEach((item, index) => {
    doc.fillColor(colors[index % colors.length]).rect(x - radius - 20, legendY, 10, 10).fill();
    const label = item.reason.slice(0, 30) + (item.reason.length > 30 ? '...' : '');
    doc.fontSize(8).fillColor('#e5e7eb').text(label, x - radius - 5, legendY + 1, { width: 150, height: 10 });
    legendY += 12;
  });
}

/**
 * Draw a summary stats box
 */
export function drawStatsBox(doc, stats, x, y, width = 500) {
  const boxHeight = 100;
  const statWidth = width / 3;

  // Background
  doc.rect(x, y, width, boxHeight).fillColor('#1f2937').fill();
  doc.rect(x, y, width, boxHeight).strokeColor('#4b5563').stroke();

  // Stats
  const statItems = [
    { label: 'HTTPS', value: stats.https ? '✓' : '✗', color: stats.https ? '#22c55e' : '#ef4444' },
    { label: 'IP Address', value: stats.usesIP ? 'YES' : 'NO', color: stats.usesIP ? '#ef4444' : '#22c55e' },
    { label: 'Shortener', value: stats.isShortener ? 'YES' : 'NO', color: stats.isShortener ? '#ef4444' : '#22c55e' }
  ];

  statItems.forEach((stat, index) => {
    const statX = x + index * statWidth + 10;
    doc.fontSize(9).fillColor('#9ca3af').text(stat.label, statX, y + 10);
    doc.fontSize(16).fillColor(stat.color).text(stat.value, statX, y + 25);
  });
}
