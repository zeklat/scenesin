// scenesin - Maps & Geography Shots
// Author: Anouar Zeklat (@anouar.co)

import { W, H, IS_LANDSCAPE, C, ctx } from './core/lib.js';
import { L, Le, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const cues = [];
  const cue = (type, at, gain = 0.5) => cues.push({ type, at: Math.max(0, at), gain });

  const pNewYork = { x: W * (IS_LANDSCAPE ? 0.28 : 0.24), y: H * (IS_LANDSCAPE ? 0.45 : 0.42) };
  const pLondon = { x: W * (IS_LANDSCAPE ? 0.62 : 0.72), y: H * (IS_LANDSCAPE ? 0.38 : 0.36) };
  const pTokyo = { x: W * (IS_LANDSCAPE ? 0.85 : 0.82), y: H * (IS_LANDSCAPE ? 0.42 : 0.48) };

  const shots = [
    {
      id: 'S1',
      at: L(0),
      note: 'Map Overview & Origin',
      cam: [W / 2, H / 2],
      zoom: 0.04,
      draw: (lt, d, t) => {
        K.geoMapBackground(t);
        K.locationPin({ x: pNewYork.x, y: pNewYork.y, label: 'NEW YORK', sub: 'Coordinates 40.7° N', color: C.pin, t: lt });
      }
    },
    {
      id: 'S2',
      at: L(1),
      note: 'Transatlantic Flight Route',
      cam: [W / 2, H / 2],
      zoom: 0.05,
      draw: (lt, d, t) => {
        K.geoMapBackground(t);
        K.locationPin({ x: pNewYork.x, y: pNewYork.y, label: 'NEW YORK', sub: 'Departure', color: C.pin, t: 1 });
        K.locationPin({ x: pLondon.x, y: pLondon.y, label: 'LONDON', sub: 'Arrival', color: C.glow, t: lt });
        K.flightRoute({ from: pNewYork, to: pLondon, t: lt, d, color: C.route });
      }
    },
    {
      id: 'S3',
      at: L(2),
      note: 'Global Reach to Tokyo',
      cam: [W / 2, H / 2],
      zoom: 0.04,
      draw: (lt, d, t) => {
        K.geoMapBackground(t);
        K.locationPin({ x: pLondon.x, y: pLondon.y, label: 'LONDON', sub: 'Transit', color: C.glow, t: 1 });
        K.locationPin({ x: pTokyo.x, y: pTokyo.y, label: 'TOKYO', sub: 'Final Destination', color: C.pin, t: lt });
        K.flightRoute({ from: pLondon, to: pTokyo, t: lt, d, color: '#00FFA3' });
      }
    },
    {
      id: 'S4',
      at: L(3),
      note: 'Worldwide Connected Map',
      cam: [W / 2, H / 2],
      zoom: 0.05,
      draw: (lt, d, t) => {
        K.geoMapBackground(t);
        K.locationPin({ x: pNewYork.x, y: pNewYork.y, label: 'NEW YORK', color: C.pin, t: 1 });
        K.locationPin({ x: pLondon.x, y: pLondon.y, label: 'LONDON', color: C.glow, t: 1 });
        K.locationPin({ x: pTokyo.x, y: pTokyo.y, label: 'TOKYO', color: C.pin, t: 1 });
        K.flightRoute({ from: pNewYork, to: pLondon, t: d, d, color: C.route });
        K.flightRoute({ from: pLondon, to: pTokyo, t: d, d, color: '#00FFA3' });
      }
    }
  ];

  shots.forEach((s) => cue('whoosh', s.at - 0.05, 0.4));
  cue('pop', Wd('york', 0), 0.5);
  cue('slide', Wd('atlantic', 1), 0.5);
  cue('pop', Wd('tokyo', 2), 0.5);

  return { shots, cues };
}
