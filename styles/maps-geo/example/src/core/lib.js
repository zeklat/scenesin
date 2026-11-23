// scenesin - Maps & Geography Core Library
// Author: Anouar Zeklat (@anouar.co)

const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
export const FORMAT = urlParams.get('format') || '9:16';
export const IS_LANDSCAPE = FORMAT === '16:9';
export const W = IS_LANDSCAPE ? 1920 : 1080;
export const H = IS_LANDSCAPE ? 1080 : 1920;
export const FPS = 30;

export let ctx = null;
export function setCtx(c) { ctx = c; }

export const C = {
  ocean: '#0B132B',       // Deep navy ocean
  land: '#1C2541',        // Slate continent
  landBorder: '#3A506B',  // Coastline outline
  route: '#F72585',       // Vibrant neon flight route
  glow: '#4CC9F0',        // Cyan radar glow
  pin: '#FFD166',         // Gold waypoint pin
  text: '#FFFFFF',
  muted: '#8D99AE',
  cardBg: '#131B2E',
  cardBorder: '#2A3B5C'
};

export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const seg = (t, a, b) => clamp((t - a) / ((b - a) || 1e-6));
export const eo = (t) => 1 - Math.pow(1 - t, 3);
export const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const eob = (t) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export function rr(x, y, w, h, r = 16) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}
