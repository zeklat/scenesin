// scenesin - Kinetic Typography Main Runner
// Author: Anouar Zeklat (@anouar.co)

import { W, H, setCtx, ctx, clamp, eo, eio, IS_LANDSCAPE } from './core/lib.js';
import { T, loadTiming } from './core/timing.js';
import { buildCaptions, drawCaption, captionList } from './core/captions.js';
import { buildShots } from './shots.js';
import * as K from './core/kit.js';

const cv = document.getElementById('cv');
cv.width = W;
cv.height = H;
setCtx(cv.getContext('2d'));

const OP = (window.OP = { ready: false });

function draw(t) {
  t = clamp(t, 0, T.dur - 1e-4);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;

  const S = OP._shots;
  let i = S.length - 1;
  while (i > 0 && S[i].at > t) i--;
  const sh = S[i];
  const end = i < S.length - 1 ? S[i + 1].at : T.dur;
  const d = end - sh.at;
  const lt = t - sh.at;

  // Camera Punch on Cut
  const punch = 1 + 0.08 * (1 - eo(clamp(lt / 0.28)));
  const drift = 1 + (sh.zoom ?? 0.04) * eio(clamp(lt / d));
  const [cx, cy] = sh.cam || [W / 2, H / 2];

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(punch * drift, punch * drift);
  ctx.translate(-cx, -cy);

  sh.draw(lt, d, t);
  ctx.restore();

  // Progress Bar
  K.progressBar(t, T.dur);

  // Transition Flash
  if (i > 0 && lt < 0.1) {
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.4 * (1 - lt / 0.1);
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  // Draw Captions
  drawCaption(t);
}

(async () => {
  try {
    await document.fonts.load("900 100px 'Inter'");
    const script = await (await fetch('script.json', { cache: 'no-store' })).json();
    await loadTiming();
    buildCaptions(script);
    const { shots, cues } = buildShots();
    shots.sort((a, b) => a.at - b.at);

    OP._shots = shots;
    OP._cues = cues;
    OP.duration = () => T.dur;
    OP.shots = () => shots.map((s, idx) => ({ id: s.id, at: s.at, end: idx < shots.length - 1 ? shots[idx + 1].at : T.dur, note: s.note }));
    OP.captions = () => captionList();
    OP.cues = () => cues;
    OP.draw = draw;
    OP.frame = (time, q = 0.92) => {
      draw(time);
      return cv.toDataURL('image/jpeg', q);
    };

    draw(0);
    OP.ready = true;
    console.log(`scenesin: Kinetic Typography initialized. Duration: ${T.dur.toFixed(2)}s (${IS_LANDSCAPE ? '16:9' : '9:16'})`);
  } catch (err) {
    console.error('Initialization error:', err);
    OP.bootError = err.message || String(err);
  }
})();
