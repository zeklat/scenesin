// scenesin - Infographics Shots
// Author: Anouar Zeklat (@anouar.co)

import { W, H, IS_LANDSCAPE, C, ctx } from './core/lib.js';
import { L, Le, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const cues = [];
  const cue = (type, at, gain = 0.5) => cues.push({ type, at: Math.max(0, at), gain });

  const shots = [
    {
      id: 'S1',
      at: L(0),
      note: 'KPI Overview',
      cam: [W / 2, H / 2],
      zoom: 0.04,
      draw: (lt, d, t) => {
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, W, H);
        const cardW = IS_LANDSCAPE ? 1000 : 860;
        const cardH = IS_LANDSCAPE ? 220 : 240;
        K.kpiCard({
          x: (W - cardW) / 2,
          y: (H - cardH) / 2 - (IS_LANDSCAPE ? 100 : 200),
          w: cardW,
          h: cardH,
          title: 'GLOBAL VIDEO ENGAGEMENT',
          value: '4.8 Billion',
          change: '32%',
          isPositive: true,
          t: lt
        });
      }
    },
    {
      id: 'S2',
      at: L(1),
      note: 'Platform Breakdown Bar Chart',
      cam: [W / 2, H / 2],
      zoom: 0.04,
      draw: (lt, d, t) => {
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, W, H);
        const chartW = IS_LANDSCAPE ? 1200 : 920;
        const chartH = IS_LANDSCAPE ? 600 : 700;
        K.barChart({
          x: (W - chartW) / 2,
          y: (H - chartH) / 2 - (IS_LANDSCAPE ? 50 : 100),
          w: chartW,
          h: chartH,
          title: 'RETENTION RATE BY VISUAL STYLE',
          items: [
            { label: 'Kinetic', value: 89, suffix: '%' },
            { label: '3D Mesh', value: 94, suffix: '%' },
            { label: 'Tech Code', value: 82, suffix: '%' },
            { label: 'Static Text', value: 31, suffix: '%', color: C.accent }
          ],
          t: lt,
          d
        });
      }
    },
    {
      id: 'S3',
      at: L(2),
      note: 'Efficiency Donut Gauge',
      cam: [W / 2, H / 2],
      zoom: 0.04,
      draw: (lt, d, t) => {
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, W, H);
        const cx = W / 2;
        const cy = H / 2 - (IS_LANDSCAPE ? 40 : 120);
        const radius = IS_LANDSCAPE ? 200 : 240;
        K.donutChart({
          x: cx,
          y: cy,
          r: radius,
          percent: 92,
          label: 'Viewer Retention Score',
          color: C.primary,
          t: lt,
          d
        });
      }
    },
    {
      id: 'S4',
      at: L(3),
      note: 'Conclusion Metric',
      cam: [W / 2, H / 2],
      zoom: 0.05,
      draw: (lt, d, t) => {
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, W, H);
        const cardW = IS_LANDSCAPE ? 1000 : 860;
        const cardH = IS_LANDSCAPE ? 220 : 240;
        K.kpiCard({
          x: (W - cardW) / 2,
          y: (H - cardH) / 2 - (IS_LANDSCAPE ? 60 : 160),
          w: cardW,
          h: cardH,
          title: 'PRODUCTION COST PER VIDEO',
          value: '$0.00 (Open Source)',
          change: '100% Free',
          isPositive: true,
          t: lt
        });
      }
    }
  ];

  shots.forEach((s) => cue('whoosh', s.at - 0.05, 0.4));
  cue('pop', Wd('billion', 0), 0.5);
  cue('tock', Wd('retention', 1), 0.4);
  cue('pop', Wd('free', 3), 0.5);

  return { shots, cues };
}
