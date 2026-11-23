// scenesin - Infographics & Data Visualization Core Library
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
  bg: '#0F172A',         // Slate 900
  cardBg: '#1E293B',     // Slate 800
  cardBorder: '#334155', // Slate 700
  primary: '#38BDF8',    // Sky 400
  secondary: '#818CF8',  // Indigo 400
  accent: '#F43F5E',     // Rose 500
  success: '#10B981',    // Emerald 500
  warning: '#FBBF24',    // Amber 400
  text: '#F8FAFC',
  muted: '#94A3B8',
  chartColors: ['#38BDF8', '#818CF8', '#F43F5E', '#10B981', '#FBBF24', '#A855F7']
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

