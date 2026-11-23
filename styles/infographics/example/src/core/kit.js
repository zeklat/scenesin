// scenesin - Infographics Component Kit
// Animated charts, donut meters, KPI cards, and data comparisons
// Author: Anouar Zeklat (@anouar.co)

import { ctx, C, W, H, IS_LANDSCAPE, clamp, lerp, seg, eo, eob, rr } from './lib.js';

export function kpiCard({ x, y, w, h, title, value, change, isPositive = true, t = 0 }) {
  rr(x, y, w, h, 24);
  ctx.fillStyle = C.cardBg;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = C.cardBorder;
  ctx.stroke();

  ctx.save();
  // Title
  ctx.font = `600 ${IS_LANDSCAPE ? 24 : 28}px 'Inter'`;
  ctx.fillStyle = C.muted;
  ctx.textAlign = 'left';
  ctx.fillText(title, x + 36, y + 54);

  // Big Value
  ctx.font = `900 ${IS_LANDSCAPE ? 68 : 80}px 'Inter'`;
  ctx.fillStyle = C.text;
  ctx.fillText(value, x + 36, y + 130);

  // Change Badge
  if (change) {
    const badgeW = IS_LANDSCAPE ? 160 : 180;
    const badgeH = 44;
    const bx = x + w - badgeW - 36;
    const by = y + 40;
    rr(bx, by, badgeW, badgeH, 22);
    ctx.fillStyle = isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)';
    ctx.fill();

    ctx.font = `800 ${IS_LANDSCAPE ? 22 : 24}px 'Inter'`;
    ctx.fillStyle = isPositive ? C.success : C.accent;
    ctx.textAlign = 'center';
    ctx.fillText(`${isPositive ? '▲ +' : '▼ -'}${change}`, bx + badgeW / 2, by + 28);
  }
  ctx.restore();
}

export function barChart({ x, y, w, h, title = '', items = [], t = 0, d = 3 }) {
  rr(x, y, w, h, 28);
  ctx.fillStyle = C.cardBg;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = C.cardBorder;
  ctx.stroke();

  ctx.save();
  // Header
  if (title) {
    ctx.font = `800 ${IS_LANDSCAPE ? 32 : 36}px 'Inter'`;
    ctx.fillStyle = C.text;
    ctx.textAlign = 'left';
    ctx.fillText(title, x + 40, y + 60);
  }

  const chartTop = y + 110;
  const chartHeight = h - 160;
  const barCount = items.length;
  const barSlot = (w - 80) / barCount;
  const barWidth = barSlot * 0.55;
  const maxVal = Math.max(...items.map(i => i.value)) || 100;
  const progress = eo(clamp(t / (d * 0.75)));

  items.forEach((item, idx) => {
    const bx = x + 40 + idx * barSlot + (barSlot - barWidth) / 2;
    const targetH = (item.value / maxVal) * chartHeight;
    const curH = targetH * progress;
    const by = chartTop + chartHeight - curH;

    // Bar column
    rr(bx, by, barWidth, curH, 12);
    ctx.fillStyle = item.color || C.chartColors[idx % C.chartColors.length];
    ctx.fill();

    // Value text on top
    if (curH > 30) {
      ctx.font = `800 ${IS_LANDSCAPE ? 22 : 26}px 'Inter'`;
      ctx.fillStyle = C.text;
      ctx.textAlign = 'center';
      const curVal = Math.round(item.value * progress);
      ctx.fillText(`${curVal}${item.suffix || ''}`, bx + barWidth / 2, by - 12);
    }

    // Label at bottom
    ctx.font = `600 ${IS_LANDSCAPE ? 20 : 24}px 'Inter'`;
    ctx.fillStyle = C.muted;
    ctx.textAlign = 'center';
    ctx.fillText(item.label, bx + barWidth / 2, chartTop + chartHeight + 34);
  });

  ctx.restore();
}

export function donutChart({ x, y, r, percent = 75, label = 'Efficiency', color = C.primary, t = 0, d = 3 }) {
  const p = eo(clamp(t / (d * 0.7)));
  const curPercent = Math.round(percent * p);
  const strokeW = IS_LANDSCAPE ? 28 : 34;

  ctx.save();
  // Background circle track
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.lineWidth = strokeW;
  ctx.strokeStyle = C.cardBorder;
  ctx.stroke();

  // Active Progress arc
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (Math.PI * 2 * (curPercent / 100));
  ctx.beginPath();
  ctx.arc(x, y, r, startAngle, endAngle);
  ctx.lineWidth = strokeW;
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Center Number
  ctx.font = `900 ${IS_LANDSCAPE ? 72 : 84}px 'Inter'`;
  ctx.fillStyle = C.text;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${curPercent}%`, x, y - 10);

  // Center Subtitle
  ctx.font = `600 ${IS_LANDSCAPE ? 22 : 26}px 'Inter'`;
  ctx.fillStyle = C.muted;
  ctx.fillText(label, x, y + 46);

  ctx.restore();
}

