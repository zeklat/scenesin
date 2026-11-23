// scenesin - Kinetic Typography Component Kit
// Author: Anouar Zeklat (@anouar.co)

import { ctx, C, W, H, IS_LANDSCAPE, clamp, lerp, seg, eo, eob, drawCard, drawPill, rr } from './lib.js';

export function gridBackground(t = 0) {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle animated cyber grid
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  const gridSize = IS_LANDSCAPE ? 120 : 90;
  const offset = (t * 20) % gridSize;

  for (let x = offset; x < W; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = offset; y < H; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();
}

export function progressBar(t, dur) {
  const p = clamp(t / (dur || 1));
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(0, 0, W, 8);
  ctx.fillStyle = C.primary;
  ctx.fillRect(0, 0, W * p, 8);
}

export function titleCard({ title, subtitle, tag = 'INSIGHT', color = C.primary, t = 0, d = 3 }) {
  const pop = eob(clamp(t / 0.4));
  const cardW = IS_LANDSCAPE ? 1100 : 880;
  const cardH = IS_LANDSCAPE ? 520 : 640;
  const cx = W / 2, cy = H / 2 - (IS_LANDSCAPE ? 40 : 100);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(pop, pop);

  // Main Card
  drawCard(-cardW / 2, -cardH / 2, cardW, cardH, 32, C.cardBg, color);

  // Top Tag
  drawPill(tag, 0, -cardH / 2 + (IS_LANDSCAPE ? 60 : 80), color, 'rgba(0, 240, 255, 0.12)');

  // Title
  ctx.font = `900 ${IS_LANDSCAPE ? 72 : 84}px 'Inter'`;
  ctx.fillStyle = C.text;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 0, IS_LANDSCAPE ? 0 : -20);

  // Subtitle
  if (subtitle) {
    ctx.font = `600 ${IS_LANDSCAPE ? 34 : 40}px 'Inter'`;
    ctx.fillStyle = C.muted;
    ctx.fillText(subtitle, 0, IS_LANDSCAPE ? 80 : 90);
  }

  ctx.restore();
}

export function statCounter({ value, label, prefix = '', suffix = '', color = C.accent, t = 0, d = 3 }) {
  const p = eo(clamp(t / (d * 0.7)));
  const currentVal = Math.round(value * p);
  const cardW = IS_LANDSCAPE ? 800 : 760;
  const cardH = IS_LANDSCAPE ? 400 : 500;
  const cx = W / 2, cy = H / 2 - (IS_LANDSCAPE ? 40 : 100);

  ctx.save();
  ctx.translate(cx, cy);
  drawCard(-cardW / 2, -cardH / 2, cardW, cardH, 28, C.cardBg, C.cardBorder);

  // Big Stat Number
  ctx.font = `900 ${IS_LANDSCAPE ? 110 : 130}px 'Inter'`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${prefix}${currentVal.toLocaleString()}${suffix}`, 0, -30);

  // Label
  ctx.font = `700 ${IS_LANDSCAPE ? 36 : 42}px 'Inter'`;
  ctx.fillStyle = C.muted;
  ctx.fillText(label, 0, 70);

  ctx.restore();
}

export function floatingBadge({ text, x, y, angle = -0.08, color = C.secondary, t = 0 }) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.sin(t * 3) * 0.02);
  drawPill(text, 0, 0, color, 'rgba(255, 0, 85, 0.2)');
  ctx.restore();
}

