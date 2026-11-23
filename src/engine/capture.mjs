// scenesin - Universal Video Render Engine
// Supports 9:16 (Shorts/Reels/TikTok) & 16:9 (YouTube/Landscape)
// Frame-exact capture via Chromium DevTools Protocol (CDP) + FFmpeg
// Author: Anouar Zeklat (@anouar.co)

import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { findBrowser } from './browser.mjs';
import { findFFmpeg } from './ffmpeg.mjs';

const WS = globalThis.WebSocket || (await import('ws')).default;
const ENGINE_REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const NODE_MODULES_ROOT = path.join(ENGINE_REPO_ROOT, 'node_modules');

const VENDOR_ALIASES = {
  '/vendor/gsap.js': 'gsap/index.js',
  '/vendor/gsap-all.js': 'gsap/all.js',
  '/vendor/rough.js': 'roughjs/bundled/rough.esm.js',
  '/vendor/anime.js': 'animejs/dist/bundles/anime.esm.min.js',
  '/vendor/mojs.js': '@mojs/core/dist/mo.umd.js',
  '/vendor/three.js': 'three/build/three.module.js'
};

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.otf': 'font/otf', '.ttf': 'font/ttf',
  '.woff2': 'font/woff2', '.wav': 'audio/wav', '.mp3': 'audio/mpeg',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml'
};

export async function runCapture(projectRoot, args = []) {
  const ROOT = path.resolve(projectRoot);
  const flags = new Set(args.filter(a => a.startsWith('--')));
  const positional = args.filter(a => !a.startsWith('--'));
  const mode = positional[0] || 'check';
  const rest = positional.slice(1);

  // Read script.json to check format
  let script = {};
  const scriptPath = path.join(ROOT, 'script.json');
  if (fs.existsSync(scriptPath)) {
    try {
      script = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
    } catch {}
  }

  // Determine Aspect Ratio & Resolution
  let format = script.format || '9:16';
  for (const arg of args) {
    if (arg === '--16:9' || arg === '--landscape') format = '16:9';
    if (arg === '--9:16' || arg === '--vertical') format = '9:16';
  }
  const isLandscape = (format === '16:9');
  const WIDTH = isLandscape ? 1920 : 1080;
  const HEIGHT = isLandscape ? 1080 : 1920;
  const FPS = +(process.env.FPS || 30);

  function serve(port = 0) {
    return new Promise((res) => {
      const srv = http.createServer((req, r) => {
        const u = decodeURIComponent(req.url.split('?')[0]);
        let f = null;

        // 1. Built-in shared motion libraries (/vendor/* and /node_modules/*)
        if (VENDOR_ALIASES[u]) {
          f = path.join(NODE_MODULES_ROOT, VENDOR_ALIASES[u]);
        } else if (u.startsWith('/node_modules/')) {
          const candidate = path.join(NODE_MODULES_ROOT, u.slice('/node_modules/'.length));
          if (candidate.startsWith(NODE_MODULES_ROOT)) f = candidate;
        } else {
          // 2. Project local files
          const candidate = path.join(ROOT, u === '/' ? 'index.html' : u);
          if (candidate.startsWith(ROOT)) f = candidate;
        }

        if (!f || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
          r.writeHead(404); r.end(); return;
        }
        r.writeHead(200, {
          'Content-Type': MIME[path.extname(f)] || 'application/octet-stream',
          'Cache-Control': 'no-store'
        });
        fs.createReadStream(f).pipe(r);
      });
      srv.listen(port, '127.0.0.1', () => res(srv));
    });
  }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  async function openPage(port) {
    const browserPath = findBrowser();
    if (!browserPath) {
      throw new Error('No Chromium-based browser found. Install Google Chrome, Brave, or Microsoft Edge.');
    }

    const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'scenesin-browser-'));
    const browser = spawn(browserPath, [
      '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${prof}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--hide-scrollbars',
      `--window-size=${WIDTH},${HEIGHT}`,
      '--ignore-gpu-blocklist',
      '--enable-unsafe-swiftshader',
      ...(process.env.SOFTWARE_GL ? ['--use-angle=swiftshader'] : []),
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      'about:blank'
    ], { stdio: 'ignore' });

    let dbg;
    for (let i = 0; i < 200 && !dbg; i++) {
      try {
        dbg = fs.readFileSync(path.join(prof, 'DevToolsActivePort'), 'utf8').split('\n')[0].trim();
      } catch {
        await sleep(100);
      }
    }
    if (!dbg) throw new Error('Browser did not start or failed to bind DevTools port.');

    const targetUrl = `http://127.0.0.1:${port}/index.html?capture=1&format=${format}${process.env.QS || ''}`;
    const r = await fetch(`http://127.0.0.1:${dbg}/json/new?${encodeURIComponent(targetUrl)}`, { method: 'PUT' });
    const target = await r.json();
    const ws = new WS(target.webSocketDebuggerUrl);

    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    let id = 0; const pend = new Map(), logs = [];
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && pend.has(m.id)) {
        const p = pend.get(m.id);
        pend.delete(m.id);
        m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
      } else if (m.method === 'Runtime.exceptionThrown') {
        logs.push('EXCEPTION ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
      } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
        logs.push('ERROR ' + m.params.args.map((a) => a.value ?? a.description).join(' '));
      }
    };

    const send = (method, params = {}) => new Promise((res, rej) => {
      const i = ++id;
      pend.set(i, { res, rej });
      ws.send(JSON.stringify({ id: i, method, params }));
    });

    const ev = async (expr) => {
      const x = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      if (x.exceptionDetails) {
        throw new Error(x.exceptionDetails.exception?.description || x.exceptionDetails.text);
      }
      return x.result.value;
    };

    await send('Runtime.enable');
    for (let i = 0; ; i++) {
      const st = await ev('window.OP ? (OP.bootError ? "ERR:" + OP.bootError : OP.ready) : false').catch(() => false);
      if (st === true) break;
      if (typeof st === 'string') throw new Error('Boot failed: ' + st + '\n' + logs.join('\n'));
      if (i > 1200) throw new Error('Boot timeout\n' + logs.join('\n'));
      await sleep(100);
    }

    const close = () => {
      try { ws.close(); } catch {}
      try { browser.kill('SIGKILL'); } catch {}
      setTimeout(() => { try { fs.rmSync(prof, { recursive: true, force: true }); } catch {} }, 300);
    };

    return { ev, logs, close };
  }

  const jpg = (d) => Buffer.from(d.slice(d.indexOf(',') + 1), 'base64');
  const FRAME = (t, q, label) => `(() => {
    const d = OP.frame(${t}, ${q});
    ${label ? `const cv = document.getElementById('cv'), c = cv.getContext('2d');
    c.setTransform(1,0,0,1,0,0);
    c.fillStyle = '#000'; c.fillRect(0, 0, 260, 86);
    c.fillStyle = '#fff'; c.font = '700 60px sans-serif';
    c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    c.fillText('${(+t).toFixed(2)}s', 14, 64);
    return cv.toDataURL('image/jpeg', ${q});` : 'return d;'}
  })()`;

  const srv = await serve(mode === 'preview' ? 8765 : 0);
  const port = srv.address().port;

  if (mode === 'preview') {
    console.log(`\n==================================================`);
    console.log(`  🎬 scenesin preview server running!`);
    console.log(`  🔗 Open: http://127.0.0.1:${port}/`);
    console.log(`  📐 Format: ${format} (${WIDTH}x${HEIGHT})`);
    console.log(`  Press Ctrl+C to stop.`);
    console.log(`==================================================\n`);
    return;
  }

  const P = await openPage(port);
  const ffmpegBin = await findFFmpeg();

  try {
    const dur = await P.ev('OP.duration()');

    if (mode === 'check') {
      console.log(`Duration: ${dur.toFixed(2)}s | Format: ${format} (${WIDTH}x${HEIGHT})`);
      for (const s of await P.ev('OP.shots()')) {
        console.log(`  Shot ${s.id.padEnd(5)}: ${s.at.toFixed(2).padStart(6)}s → ${s.end.toFixed(2).padStart(6)}s  (${(s.end - s.at).toFixed(2)}s)  ${s.note}`);
      }
      console.log('\nCaptions:');
      for (const c of await P.ev('OP.captions()')) {
        console.log(`  ${c.s.toFixed(2).padStart(6)}s–${c.e.toFixed(2).padEnd(6)}s: "${c.text}"`);
      }
      let bad = 0;
      for (let t = 0; t < dur; t += 0.25) {
        try {
          await P.ev(`OP.draw(${t})`);
        } catch (e) {
          bad++;
          console.log(`ERROR at ${t.toFixed(2)}s: ${e.message.split('\n')[0]}`);
        }
      }
      if (P.logs.length) console.log(P.logs.join('\n'));
      console.log(bad || P.logs.length ? '\n❌ CHECK FAILED' : '\n✅ CHECK PASSED');
    } else if (mode === 'cues') {
      const cues = await P.ev('OP.cues()');
      fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
      fs.writeFileSync(path.join(ROOT, 'data/cues.json'), JSON.stringify({ duration: dur, cues }, null, 2));
      console.log(`data/cues.json: ${cues.length} audio cues saved, total duration: ${dur.toFixed(2)}s`);
    } else if (mode === 'frames') {
      const dir = path.resolve(ROOT, rest[0] || 'review/frames');
      fs.mkdirSync(dir, { recursive: true });
      for (const t of (rest[1] || '0').split(',').map(Number)) {
        fs.writeFileSync(path.join(dir, `t${t.toFixed(2)}.jpg`), jpg(await P.ev(FRAME(t, 0.95))));
      }
      console.log(`Frames exported to: ${dir}`);
    } else if (mode === 'sheet') {
      const out = path.resolve(ROOT, rest[0] || 'review/all.jpg');
      const step = +(rest[1] || 0.5);
      const cols = +(rest[2] || (isLandscape ? 6 : 9));
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'scenesin-sheet-'));
      let n = 0;
      for (let t = step / 2; t < dur; t += step) {
        fs.writeFileSync(path.join(tmp, `f${String(n++).padStart(4, '0')}.jpg`), jpg(await P.ev(FRAME(t, 0.8, true))));
      }
      const rows = Math.ceil(n / cols);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      const scaleW = isLandscape ? 384 : 216;
      const scaleH = isLandscape ? 216 : 384;
      const r = spawnSync(ffmpegBin, [
        '-v', 'error', '-y', '-framerate', '1',
        '-i', path.join(tmp, 'f%04d.jpg'),
        '-vf', `scale=${scaleW}:${scaleH},tile=${cols}x${rows}:padding=4:color=black`,
        '-frames:v', '1', '-q:v', '3', out
      ]);
      fs.rmSync(tmp, { recursive: true, force: true });
      if (r.status) throw new Error('ffmpeg error: ' + r.stderr);
      console.log(`Contact sheet generated: ${out} (${n} frames)`);
    } else if (mode === 'video') {
      const out = path.resolve(ROOT, rest[0] || `renders/video_${format.replace(':', 'x')}.mp4`);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      const mix = path.join(ROOT, 'data/mix.wav');
      const hasMix = fs.existsSync(mix);
      const a0 = rest[1] ? +rest[1] : 0;
      const a1 = rest[2] ? Math.min(+rest[2], dur) : dur;
      const n = Math.round((a1 - a0) * FPS);

      const ff = spawn(ffmpegBin, [
        '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
        ...(hasMix ? ['-ss', String(a0), '-t', String(a1 - a0), '-i', mix] : ['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo']),
        '-map', '0:v', '-map', '1:a',
        '-c:v', 'libx264', '-preset', flags.has('--draft') ? 'ultrafast' : 'veryfast',
        '-crf', flags.has('--draft') ? '28' : '18',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '192k',
        '-shortest', '-movflags', '+faststart',
        out
      ], { stdio: ['pipe', 'inherit', 'inherit'] });

      const t0 = Date.now();
      for (let i = 0; i < n; i++) {
        const b = jpg(await P.ev(FRAME(a0 + i / FPS, flags.has('--draft') ? 0.8 : 0.93)));
        if (!ff.stdin.write(b)) await new Promise((r) => ff.stdin.once('drain', r));
        if (i % 30 === 0 || i === n - 1) {
          process.stdout.write(`\rRendering [${format}] ${i + 1}/${n} frames (${Math.round(((i + 1) / n) * 100)}%)...`);
        }
      }
      ff.stdin.end();
      await new Promise((r) => ff.on('close', r));
      console.log(`\n\n🎉 Done! Video saved: ${out}`);
      console.log(`   Dimensions: ${WIDTH}x${HEIGHT} (${format})`);
      console.log(`   Render time: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    } else {
      console.log('Available modes: check | cues | sheet | frames | video | preview');
    }
  } finally {
    P.close();
    srv.close();
  }
}
