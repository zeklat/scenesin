// scenesin - Kinetic Typography Caption Engine
// Author: Anouar Zeklat (@anouar.co)

import { ctx, C, clamp, lerp, seg, eob, IS_LANDSCAPE, W, H } from './lib.js';
import { T, lineWords } from './timing.js';

export const CAP = {
  y: IS_LANDSCAPE ? 900 : 1450,
  size: IS_LANDSCAPE ? 90 : 130,
  maxW: IS_LANDSCAPE ? 1600 : 920
};

let caps = [];

function autoChunks(text) {
  const ws = text.toUpperCase().split(/\s+/).filter(Boolean), out = [];
  for (let i = 0; i < ws.length;) {
    const n = ws.length - i === 4 ? 2 : Math.min(3, ws.length - i);
    out.push(ws.slice(i, i + n));
    i += n;
  }
  return out.map((c) => {
    const k = c.reduce((b, w, j) => (w.replace(/[^A-Z]/g, '').length > c[b].replace(/[^A-Z]/g, '').length ? j : b), 0);
    return c.map((w, j) => (j === k ? '*' + w : w)).join(' ');
  });
}

export function buildCaptions(script) {
  caps = [];
  script.lines.forEach((ln, i) => {
    const chunks = (ln.caps ? ln.caps.split('|') : autoChunks(ln.text)).map((s) => s.trim()).filter(Boolean);
    const ws = lineWords(i);
    if (!ws.length) return;
    const counts = chunks.map((c) => c.split(/\s+/).length), N = counts.reduce((a, b) => a + b, 0);
    const nm = (w) => String(w).toLowerCase().replace(/[^a-z0-9']+/g, '');
    let acc = 0, from = 0;
    chunks.forEach((c, j) => {
      const first = nm(c.split(/\s+/)[0]);
      let idx = j === 0 ? 0 : ws.findIndex((w, k) => k > from && first && (nm(w.w) === first || (first.length > 2 && nm(w.w).startsWith(first))));
      if (idx < 0) idx = Math.max(from + (j ? 1 : 0), Math.min(ws.length - 1, Math.round(acc * ws.length / N)));
      acc += counts[j]; from = idx;
      caps.push({
        line: i,
        s: ws[idx].s - 0.04,
        text: c.replace(/\*/g, ''),
        words: c.split(/\s+/).map((w) => ({ txt: w.replace('*', ''), hi: w.startsWith('*') }))
      });
    });
  });
  caps.forEach((c, k) => {
    const next = caps[k + 1], lineEnd = T.lines[c.line].end;
    c.e = next ? (next.s - lineEnd > 0.7 && next.line !== c.line ? lineEnd + 0.35 : next.s) : T.dur;
  });
  return caps;
}

export function drawCaption(t) {
  const c = caps.find((x) => t >= x.s && t < x.e);
  if (!c) return;

  const lt = t - c.s;
  const pop = eob(clamp(lt / 0.18));
  ctx.save();
  ctx.translate(W / 2, CAP.y);
  ctx.scale(pop, pop);

  ctx.font = `900 ${CAP.size}px 'Inter'`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Measure full line width
  const fullText = c.words.map(w => w.txt).join(' ');
  const totalW = ctx.measureText(fullText).width;
  let curX = -totalW / 2;

  c.words.forEach((w) => {
    const wordW = ctx.measureText(w.txt).width;
    const spaceW = ctx.measureText(' ').width;
    const wx = curX + wordW / 2;

    if (w.hi) {
      // Glow pill behind active keyword
      ctx.save();
      ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.beginPath();
      ctx.roundRect(wx - wordW / 2 - 14, -CAP.size / 2 - 6, wordW + 28, CAP.size + 12, 16);
      ctx.fill();
      ctx.restore();
    }

    // Text Outline
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(w.txt, wx, 0);

    // Text Fill
    ctx.fillStyle = w.hi ? C.primary : C.text;
    ctx.fillText(w.txt, wx, 0);

    curX += wordW + spaceW;
  });

  ctx.restore();
}

export const captionList = () => caps;
