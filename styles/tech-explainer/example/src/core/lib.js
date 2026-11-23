// scenesin - Tech Explainer Core Library
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
  bg: '#0E1117',
  windowBg: '#161B22',
  windowHeader: '#21262D',
  windowBorder: '#30363D',
  editorBg: '#0D1117',
  text: '#E6EDF3',
  muted: '#8B949E',
  syntaxKeyword: '#FF7B72',   // Pink / Red
  syntaxFunction: '#D2A8FF',  // Purple
  syntaxString: '#A5D6FF',    // Light Blue
  syntaxComment: '#8B949E',   // Gray
  syntaxNumber: '#79C0FF',    // Cyan
  accent: '#58A6FF',          // VS Code Blue
  success: '#3FB950',         // Green
  warning: '#D29922',         // Yellow
  error: '#F85149',           // Red
  nodeClient: '#388BFD',
  nodeServer: '#8957E5',
  nodeDb: '#238636'
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

