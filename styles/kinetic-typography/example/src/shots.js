// scenesin - Kinetic Typography Shots
// Author: Anouar Zeklat (@anouar.co)

import { W, H, IS_LANDSCAPE, C } from './core/lib.js';
import { L, Le, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const cues = [];
  const cue = (type, at, gain = 0.5) => cues.push({ type, at: Math.max(0, at), gain });

  const shots = [
    {
      id: 'S1',
      at: L(0),
      note: 'Hook: Big Question',
      cam: [W / 2, H / 2],
      zoom: 0.05,
      draw: (lt, d, t) => {
        K.gridBackground(t);
        K.titleCard({
          title: 'WHY DO APPS FAIL?',
          subtitle: 'The brutal reality of software development',
          tag: 'ANALYSIS',
          color: C.primary,
          t: lt,
          d
        });
        K.floatingBadge({ text: '⚠️ CRITICAL INSIGHT', x: W / 2 + (IS_LANDSCAPE ? 380 : 0), y: IS_LANDSCAPE ? 160 : 360, t });
      }
    },
    {
      id: 'S2',
      at: L(1),
      note: 'The Hype Cycle',
      cam: [W / 2, H / 2],
      zoom: 0.06,
      draw: (lt, d, t) => {
        K.gridBackground(t);
        K.titleCard({
          title: 'THE HYPE CYCLE',
          subtitle: 'Day 1: Motivation is 100% high',
          tag: 'PHASE ONE',
          color: C.accent,
          t: lt,
          d
        });
      }
    },
    {
      id: 'S3',
      at: L(2),
      note: 'Technical Debt Stat',
      cam: [W / 2, H / 2],
      zoom: 0.04,
      draw: (lt, d, t) => {
        K.gridBackground(t);
        K.statCounter({
          value: 84,
          suffix: '%',
          label: 'Fail Due To Hidden Complexity',
          color: C.secondary,
          t: lt,
          d
        });
        K.floatingBadge({ text: 'DEBT ACCUMULATION', x: W / 2, y: IS_LANDSCAPE ? 180 : 420, color: C.secondary, t });
      }
    },
    {
      id: 'S4',
      at: L(3),
      note: 'The Golden Rule',
      cam: [W / 2, H / 2],
      zoom: 0.05,
      draw: (lt, d, t) => {
        K.gridBackground(t);
        K.titleCard({
          title: 'SHIP SMALL & FAST',
          subtitle: 'Iterate weekly, not yearly',
          tag: 'THE FORMULA',
          color: C.success,
          t: lt,
          d
        });
      }
    },
    {
      id: 'S5',
      at: L(4),
      note: 'Loop Automations',
      cam: [W / 2, H / 2],
      zoom: 0.06,
      draw: (lt, d, t) => {
        K.gridBackground(t);
        K.statCounter({
          value: 10,
          prefix: '',
          suffix: 'x',
          label: 'Faster Feedback Velocity',
          color: C.primary,
          t: lt,
          d
        });
      }
    },
    {
      id: 'S6',
      at: L(5),
      note: 'Closing Call To Action',
      cam: [W / 2, H / 2],
      zoom: 0.04,
      draw: (lt, d, t) => {
        K.gridBackground(t);
        K.titleCard({
          title: 'BE UNSTOPPABLE',
          subtitle: 'Built with scenesin @anouar.co',
          tag: 'MASTER THIS',
          color: C.accent,
          t: lt,
          d
        });
      }
    }
  ];

  // Sound cues on cut transitions
  shots.forEach((s) => cue('whoosh', s.at - 0.05, 0.45));
  cue('pop', Wd('fail', 0), 0.5);
  cue('pop', Wd('debt', 2), 0.6);
  cue('pop', Wd('fast', 3), 0.5);

  return { shots, cues };
}
