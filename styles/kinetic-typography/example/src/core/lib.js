// scenesin - Kinetic Typography Core Library
// Author: Anouar Zeklat (@anouar.co)

const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
export const FORMAT = urlParams.get('format') || '9:16';
export const IS_LANDSCAPE = FORMAT === '16:9';
export const W = IS_LANDSCAPE ? 1920 : 1080;
export const H = IS_LANDSCAPE ? 1080 : 1920;
export const FPS = 30;

export let ctx = null;
export function setCtx(c) { ctx = c; }

// High-impact neon & dark editorial palette
export const C = {
  bg: '#0A0C10',
  cardBg: '#141822',
  cardBorder: '#232A3B',
  primary: '#00F0FF',    // Electric Cyan
  secondary: '#FF0055',  // Hyper Pink
  accent: '#FFE600',     // Neon Yellow
  success: '#00FFA3',    // Acid Green
  text: '#FFFFFF',
  muted: '#8E9BAE',
  pillBg: '#1A202C',
  glow: 'rgba(0, 240, 255, 0.4)'
};

// Math & Easing
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const seg = (t, a, b) => clamp((t - a) / ((b - a) || 1e-6));
export const eo = (t) => 1 - Math.pow(1 - t, 3);
export const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const eob = (t) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// Drawing Primitives
export function rr(x, y, w, h, r = 16) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export function drawCard(x, y, w, h, r = 24, bg = C.cardBg, border = C.cardBorder) {
  rr(x, y, w, h, r);
  ctx.fillStyle = bg;
  ctx.fill();
  if (border) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = border;
    ctx.stroke();
  }
}

export function drawPill(text, x, y, color = C.primary, bg = 'rgba(0, 240, 255, 0.15)') {
  ctx.font = `800 ${IS_LANDSCAPE ? 28 : 36}px 'Inter'`;
  const m = ctx.measureText(text);
  const pw = m.width + (IS_LANDSCAPE ? 36 : 48);
  const ph = IS_LANDSCAPE ? 46 : 64;
  rr(x - pw / 2, y - ph / 2, pw, ph, ph / 2);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}
