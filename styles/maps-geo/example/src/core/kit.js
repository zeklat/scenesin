// scenesin - Maps & Geography Component Kit
// Animated flight paths, pulsating GPS waypoints, and geographic outlines
// Author: Anouar Zeklat (@anouar.co)

import { ctx, C, W, H, IS_LANDSCAPE, clamp, lerp, seg, eo, eob, rr } from './lib.js';

export function geoMapBackground(t = 0) {
  // Ocean
  ctx.fillStyle = C.ocean;
  ctx.fillRect(0, 0, W, H);

  // Latitude and Longitude Grids
  ctx.save();
  ctx.strokeStyle = 'rgba(76, 201, 240, 0.08)';
  ctx.lineWidth = 1;
  const step = IS_LANDSCAPE ? 140 : 120;
  for (let x = 0; x < W; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Simplified Abstract Continents (Vector Shapes)
  ctx.fillStyle = C.land;
  ctx.strokeStyle = C.landBorder;
  ctx.lineWidth = 3;

  // North America shape
  ctx.beginPath();
  ctx.moveTo(W * 0.15, H * 0.25);
  ctx.bezierCurveTo(W * 0.28, H * 0.22, W * 0.35, H * 0.35, W * 0.25, H * 0.48);
  ctx.bezierCurveTo(W * 0.18, H * 0.45, W * 0.12, H * 0.38, W * 0.15, H * 0.25);
  ctx.fill();
  ctx.stroke();

  // Europe & Asia shape
  ctx.beginPath();
  ctx.moveTo(W * 0.48, H * 0.24);
  ctx.bezierCurveTo(W * 0.75, H * 0.22, W * 0.88, H * 0.38, W * 0.72, H * 0.52);
  ctx.bezierCurveTo(W * 0.58, H * 0.48, W * 0.45, H * 0.36, W * 0.48, H * 0.24);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export function locationPin({ x, y, label, sub, color = C.pin, t = 0 }) {
  ctx.save();
  // Pulsating Radar Wave
  const safeT = Math.max(0, t);
  const wave = (safeT * 1.5) % 1;
  const radius = Math.max(2, 16 + wave * 40);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(0.5, 3 * (1 - wave));
  ctx.stroke();

  // Center Dot
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Label Card
  const pop = eob(clamp(safeT / 0.3));
  ctx.translate(x, y);
  ctx.scale(pop, pop);

  const cardW = IS_LANDSCAPE ? 260 : 220;
  const cardH = IS_LANDSCAPE ? 70 : 80;
  const cx = 18, cy = -cardH - 12;

  rr(cx, cy, cardW, cardH, 16);
  ctx.fillStyle = C.cardBg;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.font = `800 ${IS_LANDSCAPE ? 22 : 24}px 'Inter'`;
  ctx.fillStyle = C.text;
  ctx.textAlign = 'left';
  ctx.fillText(label, cx + 18, cy + (IS_LANDSCAPE ? 30 : 34));

  if (sub) {
    ctx.font = `600 ${IS_LANDSCAPE ? 16 : 18}px 'Inter'`;
    ctx.fillStyle = C.muted;
    ctx.fillText(sub, cx + 18, cy + (IS_LANDSCAPE ? 52 : 58));
  }

  ctx.restore();
}

export function flightRoute({ from, to, t = 0, d = 3, color = C.route }) {
  const p = eo(clamp(t / (d * 0.8)));

  // Quadratic control point for flight arc curvature
  const midX = (from.x + to.x) / 2;
  const midY = Math.min(from.y, to.y) - (IS_LANDSCAPE ? 180 : 220);

  ctx.save();
  // Background dashed curve track
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.quadraticCurveTo(midX, midY, to.x, to.y);
  ctx.setLineDash([8, 8]);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.stroke();

  // Animated colored flight arc
  ctx.setLineDash([]);
  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);

  // Interpolate along quadratic curve
  const steps = 40;
  const activeSteps = Math.floor(steps * p);
  for (let i = 1; i <= activeSteps; i++) {
    const u = i / steps;
    const px = Math.pow(1 - u, 2) * from.x + 2 * (1 - u) * u * midX + Math.pow(u, 2) * to.x;
    const py = Math.pow(1 - u, 2) * from.y + 2 * (1 - u) * u * midY + Math.pow(u, 2) * to.y;
    ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Moving Plane / Indicator Dot
  if (p > 0 && p < 1) {
    const u = p;
    const px = Math.pow(1 - u, 2) * from.x + 2 * (1 - u) * u * midX + Math.pow(u, 2) * to.x;
    const py = Math.pow(1 - u, 2) * from.y + 2 * (1 - u) * u * midY + Math.pow(u, 2) * to.y;

    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI * 2);
    ctx.fillStyle = C.glow;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
  }

  ctx.restore();
}
