// scenesin - Tech Explainer Shots
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
      note: 'Code Editor: Writing Modern APIs',
      cam: [W / 2, H / 2],
      zoom: 0.04,
      draw: (lt, d, t) => {
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, W, H);
        const winW = IS_LANDSCAPE ? 1300 : 960;
        const winH = IS_LANDSCAPE ? 680 : 800;
        K.codeEditor({
          x: (W - winW) / 2,
          y: (H - winH) / 2 - (IS_LANDSCAPE ? 50 : 100),
          w: winW,
          h: winH,
          title: 'server.ts - scenesin',
          code: [
            'import { createServer } from "scenesin";',
            'const app = createServer({ format: "9:16" });',
            'app.on("render", async (scene) => {',
            '  await scene.animate({ duration: 30 });',
            '});',
            'app.listen(8080);'
          ],
          activeLine: Math.min(5, Math.floor(lt * 1.5)),
          t
        });
      }
    },
    {
      id: 'S2',
      at: L(1),
      note: 'Terminal Execution',
      cam: [W / 2, H / 2],
      zoom: 0.05,
      draw: (lt, d, t) => {
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, W, H);
        const winW = IS_LANDSCAPE ? 1200 : 920;
        const winH = IS_LANDSCAPE ? 600 : 720;
        K.terminal({
          x: (W - winW) / 2,
          y: (H - winH) / 2 - (IS_LANDSCAPE ? 50 : 100),
          w: winW,
          h: winH,
          title: 'bash - zsh',
          lines: [
            { cmd: 'npx scenesin create --format 16:9' },
            { info: 'Detecting local Chromium engine...' },
            { ok: 'Loaded 8 visual styles successfully' },
            { ok: '60 FPS renderer ready' }
          ],
          t
        });
      }
    },
    {
      id: 'S3',
      at: L(2),
      note: 'API Microservices Architecture',
      cam: [W / 2, H / 2],
      zoom: 0.04,
      draw: (lt, d, t) => {
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, W, H);
        const diagW = IS_LANDSCAPE ? 1400 : 980;
        const diagH = IS_LANDSCAPE ? 600 : 700;
        K.apiArchitectureDiagram({
          x: (W - diagW) / 2,
          y: (H - diagH) / 2 - (IS_LANDSCAPE ? 50 : 100),
          w: diagW,
          h: diagH,
          t
        });
      }
    },
    {
      id: 'S4',
      at: L(3),
      note: 'Production Ready Deployment',
      cam: [W / 2, H / 2],
      zoom: 0.05,
      draw: (lt, d, t) => {
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, W, H);
        const winW = IS_LANDSCAPE ? 1200 : 920;
        const winH = IS_LANDSCAPE ? 600 : 700;
        K.terminal({
          x: (W - winW) / 2,
          y: (H - winH) / 2 - (IS_LANDSCAPE ? 50 : 100),
          w: winW,
          h: winH,
          title: 'deploy.sh',
          lines: [
            { cmd: 'scenesin build --prod' },
            { ok: 'Compiled to 4K MP4 (0 dropped frames)' },
            { ok: 'Published by Anouar Zeklat (@anouar.co)' }
          ],
          t
        });
      }
    }
  ];

  shots.forEach((s) => cue('whoosh', s.at - 0.05, 0.4));
  cue('tock', Wd('code', 0), 0.4);
  cue('tock', Wd('terminal', 1), 0.4);
  cue('pop', Wd('deploy', 3), 0.5);

  return { shots, cues };
}
