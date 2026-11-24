// scenesin v2.0 - Cinematic Motion & Media Canvas Kit
// Import inside any shot via: import * as Cinema from '/vendor/cinema.js';
// Includes: Laptop/Browser Website Viewer, Vox Highlighter, Mouse Cursor, Ken Burns Photo Cards,
// Brand Logo Badges, Whip-Pan Transitions, Film Grain & Vignette.
// Author: Anouar Zeklat (@anouar.co | youtube/@anouarzeklat | x/@anouarzeklat)

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const eo = (t) => 1 - Math.pow(1 - t, 3);
const eob = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

/** Preload an image (website snapshot, photo, or SVG logo) for frame-exact canvas drawing */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Draw a sleek MacBook / Browser frame displaying a live website screenshot with smooth auto-scroll & glass glare!
 */
export function drawLaptopWebsite(ctx, {
  img, url = 'github.com/zeklat/scenesin', x, y, w, h, scrollProgress = 0, t = 0, borderColor = '#38BDF8'
}) {
  ctx.save();
  // Drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 45;
  ctx.shadowOffsetY = 22;

  // Outer laptop bezel
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 24);
  ctx.fillStyle = '#0F1522';
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.lineWidth = 3;
  ctx.strokeStyle = borderColor;
  ctx.stroke();

  // Browser chrome header
  const barH = 48;
  ctx.beginPath();
  ctx.roundRect(x, y, w, barH, [24, 24, 0, 0]);
  ctx.fillStyle = '#1B2333';
  ctx.fill();

  ['#FF5F56', '#FFBD2E', '#27C93F'].forEach((col, i) => {
    ctx.beginPath();
    ctx.arc(x + 26 + i * 22, y + barH / 2, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
  });

  // URL Address Pill
  const pillW = Math.min(w * 0.58, 540);
  ctx.beginPath();
  ctx.roundRect(x + w / 2 - pillW / 2, y + 10, pillW, 28, 14);
  ctx.fillStyle = '#0C111C';
  ctx.fill();
  ctx.font = "600 16px monospace";
  ctx.fillStyle = '#94A3B8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`🔒  ${url}`, x + w / 2, y + 24);

  // Clipped website viewport
  const vx = x + 3, vy = y + barH, vw = w - 6, vh = h - barH - 3;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(vx, vy, vw, vh, [0, 0, 21, 21]);
  ctx.clip();

  if (img && img.width > 0) {
    const scale = vw / img.width;
    const drawH = img.height * scale;
    const maxScroll = Math.max(0, drawH - vh);
    const offsetY = -maxScroll * clamp(scrollProgress);
    ctx.drawImage(img, vx, vy + offsetY, vw, drawH);
  } else {
    ctx.fillStyle = '#131A29';
    ctx.fillRect(vx, vy, vw, vh);
  }

  // Subtle moving diagonal glass glare sweep
  const glareX = lerp(vx - vw * 0.4, vx + vw * 1.4, (t * 0.25) % 1);
  const grad = ctx.createLinearGradient(glareX - 120, vy, glareX + 120, vy + vh);
  grad.addColorStop(0, 'rgba(255,255,255,0)');
  grad.addColorStop(0.5, 'rgba(255,255,255,0.07)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(vx, vy, vw, vh);
  ctx.restore();

  // Laptop metallic base lip underneath
  ctx.beginPath();
  ctx.roundRect(x - w * 0.05, y + h + 2, w * 1.1, 18, [4, 4, 14, 14]);
  ctx.fillStyle = '#334155';
  ctx.fill();
  ctx.restore();
}

/**
 * Vox / Johnny Harris Article Highlighter: dims image & sweeps a glowing marker bar across a key line!
 */
export function drawArticleHighlight(ctx, { x, y, w, h, progress = 1, color = 'rgba(255, 230, 0, 0.45)' }) {
  const p = eo(clamp(progress));
  if (p <= 0) return;
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w * p, h, 8);
  ctx.fill();
  ctx.restore();
}

/**
 * Animated Bezier Mouse Cursor with smooth click ripple!
 */
export function drawMouseCursor(ctx, { x, y, clickProgress = 0 }) {
  ctx.save();
  if (clickProgress > 0 && clickProgress < 1) {
    const r = 10 + clickProgress * 44;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 240, 255, ${1 - clickProgress})`;
    ctx.lineWidth = 4 * (1 - clickProgress);
    ctx.stroke();
  }
  ctx.translate(x, y);
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 34);
  ctx.lineTo(9, 26);
  ctx.lineTo(16, 40);
  ctx.lineTo(22, 37);
  ctx.lineTo(15, 23);
  ctx.lineTo(26, 23);
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#0F172A';
  ctx.stroke();
  ctx.restore();
}

/**
 * Ken Burns Cinematic Photo Card (for famous people, historical photos, & documentary shots)
 */
export function drawPhotoCard(ctx, {
  img, x, y, w, h, caption = '', zoom = 1.08, lt = 0, d = 4, angle = -0.02, style = 'editorial'
}) {
  const pop = eob(clamp(lt / 0.35));
  const kb = lerp(1.0, zoom, clamp(lt / (d || 1)));
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(angle);
  ctx.scale(pop, pop);

  const pad = style === 'polaroid' ? 18 : 10;
  const botPad = style === 'polaroid' ? 76 : caption ? 58 : 10;

  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 35;
  ctx.shadowOffsetY = 16;
  ctx.beginPath();
  ctx.roundRect(-w / 2 - pad, -h / 2 - pad, w + pad * 2, h + pad + botPad, style === 'polaroid' ? 8 : 22);
  ctx.fillStyle = style === 'polaroid' ? '#F8F5EE' : '#141B29';
  ctx.fill();
  ctx.shadowBlur = 0;

  if (style !== 'polaroid') {
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.stroke();
  }

  // Clipped Ken Burns Image
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, style === 'polaroid' ? 4 : 14);
  ctx.clip();
  if (img && img.width > 0) {
    const scale = Math.max(w / img.width, h / img.height) * kb;
    const dw = img.width * scale, dh = img.height * scale;
    ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
  }
  ctx.restore();

  if (caption) {
    ctx.font = `800 24px 'Inter'`;
    ctx.fillStyle = style === 'polaroid' ? '#1E293B' : '#F8FAFC';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(caption, 0, h / 2 + botPad / 2);
  }
  ctx.restore();
}

/**
 * Crisp Floating Company Logo Badge (with neon glow ring)
 */
export function drawBrandBadge(ctx, { img, label = '', x, y, size = 120, color = '#00F0FF', lt = 0 }) {
  const pop = eob(clamp(lt / 0.32));
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pop, pop);

  ctx.shadowColor = color;
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.roundRect(-size / 2, -size / 2, size, size, size * 0.24);
  ctx.fillStyle = '#0E1422';
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 3;
  ctx.strokeStyle = color;
  ctx.stroke();

  if (img && img.width > 0) {
    const pad = size * 0.22;
    ctx.drawImage(img, -size / 2 + pad, -size / 2 + pad, size - pad * 2, size - pad * 2);
  }
  if (label) {
    ctx.font = "800 22px 'Inter'";
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, size / 2 + 28);
  }
  ctx.restore();
}

/**
 * Smooth Whip-Pan Entrance Offset (returns horizontal px offset that snaps smoothly to 0)
 */
export function whipPanX(lt, W, dir = 1, dur = 0.24) {
  const p = eo(clamp(lt / dur));
  return (1 - p) * W * 0.35 * dir;
}

/**
 * Subtle Cinematic Vignette + Organic Film Grain Overlay (never flat or robotic!)
 */
export function drawCinemaPostFX(ctx, W, H, t, { vignette = 0.42, grain = 0.04 } = {}) {
  ctx.save();
  if (vignette > 0) {
    const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.32, W / 2, H / 2, Math.max(W, H) * 0.72);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(0,0,0,${vignette})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  if (grain > 0) {
    // Lightweight deterministic scan-grain specks (fast at 30fps)
    const seed = Math.floor(t * 24);
    ctx.fillStyle = `rgba(255,255,255,${grain})`;
    for (let i = 0; i < 65; i++) {
      const rx = ((Math.sin((i + seed * 13) * 12.9898) * 43758.5453) % 1 + 1) % 1;
      const ry = ((Math.sin((i + seed * 29) * 78.233) * 43758.5453) % 1 + 1) % 1;
      ctx.fillRect(rx * W, ry * H, 2, 2);
    }
  }
  ctx.restore();
}

