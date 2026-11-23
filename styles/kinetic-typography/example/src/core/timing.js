// scenesin - Kinetic Typography Timing Helper
// Author: Anouar Zeklat (@anouar.co)

export const T = { dur: 0, lines: [], words: [] };

export async function loadTiming() {
  const [lj, wj] = await Promise.all([
    (await fetch('data/lines.json', { cache: 'no-store' })).json(),
    (await fetch('data/words.json', { cache: 'no-store' })).json(),
  ]);
  T.dur = lj.duration;
  T.lines = lj.lines;
  T.words = wj;
}

export const L = (i) => T.lines[i]?.start ?? 0;
export const Le = (i) => T.lines[i]?.end ?? 0;
export const lineWords = (i) => T.words.filter((w) => w.line === i);

export function Wd(prefix, lineIdx = null) {
  const p = prefix.toLowerCase();
  const pool = lineIdx !== null ? lineWords(lineIdx) : T.words;
  const match = pool.find((w) => w.w.toLowerCase().replace(/[^a-z0-9]/g, '').startsWith(p));
  if (!match) {
    if (pool.length > 0) return pool[0].s;
    return lineIdx !== null ? L(lineIdx) : 0;
  }
  return match.s;
}

