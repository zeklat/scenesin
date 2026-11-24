// scenesin v2.0 - Live Online Media Fetcher (Zero API Keys, 100% Free)
// 1. snapWebsite(url, outPath)  -> Retina website screenshot via headless Chromium (for laptop/browser scenes)
// 2. fetchLogo(brand, outPath)  -> Crisp SVG company logo via SimpleIcons CDN (GitHub, Apple, OpenAI, Tesla, etc.)
// 3. fetchPhoto(query, outPath) -> High-res photo of famous people / topics via Wikipedia/Wikimedia REST API
// Author: Anouar Zeklat (@anouar.co | youtube/@anouarzeklat | x/@anouarzeklat)

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { findBrowser } from './browser.mjs';

const WS = globalThis.WebSocket || (await import('ws')).default;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Capture a clean, retina screenshot of any live website using headless Chromium.
 * Ideal for animating real websites inside a laptop or browser mockup!
 */
export async function snapWebsite(url, outPath, { width = 1440, height = 900, fullPage = false, waitMs = 1800 } = {}) {
  const browserPath = findBrowser();
  if (!browserPath) throw new Error('No Chromium browser found (Chrome, Brave, or Edge required).');

  const fullUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'scenesin-snap-'));
  const browser = spawn(browserPath, [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${prof}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    `--window-size=${width},${height}`,
    '--disable-background-timer-throttling',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws;
  try {
    let dbg;
    for (let i = 0; i < 150 && !dbg; i++) {
      try { dbg = fs.readFileSync(path.join(prof, 'DevToolsActivePort'), 'utf8').split('\n')[0].trim(); }
      catch { await sleep(100); }
    }
    if (!dbg) throw new Error('Headless browser failed to start.');

    const r = await fetch(`http://127.0.0.1:${dbg}/json/new?${encodeURIComponent(fullUrl)}`, { method: 'PUT' });
    const target = await r.json();
    ws = new WS(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

    let id = 0;
    const pend = new Map();
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && pend.has(m.id)) {
        const p = pend.get(m.id);
        pend.delete(m.id);
        m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
      }
    };
    const send = (method, params = {}) => new Promise((res, rej) => {
      const i = ++id;
      pend.set(i, { res, rej });
      ws.send(JSON.stringify({ id: i, method, params }));
    });

    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width, height, deviceScaleFactor: 2, mobile: false
    });

    // Wait for page load + settle
    await sleep(waitMs);
    for (let i = 0; i < 40; i++) {
      const ready = await send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true }).catch(() => null);
      if (ready?.result?.value === 'complete') break;
      await sleep(150);
    }
    await sleep(600);

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: fullPage,
      fromSurface: true
    });

    const dest = path.resolve(outPath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, Buffer.from(shot.data, 'base64'));
    return dest;
  } finally {
    try { ws?.close(); } catch {}
    try { browser.kill('SIGKILL'); } catch {}
    setTimeout(() => { try { fs.rmSync(prof, { recursive: true, force: true }); } catch {} }, 300);
  }
}

/**
 * Fetch a crisp vector SVG brand logo for any company (GitHub, OpenAI, Apple, Google, Tesla, YouTube, etc.)
 * via SimpleIcons CDN (100% free, no API key).
 */
export async function fetchLogo(brandName, outPath, colorHex = 'FFFFFF') {
  const slug = brandName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanHex = colorHex.replace('#', '');
  const url = `https://cdn.simpleicons.org/${slug}/${cleanHex}`;

  const res = await fetch(url, { headers: { 'User-Agent': 'scenesin/2.0' } });
  if (!res.ok) {
    throw new Error(`Logo not found for "${brandName}" (slug: ${slug}). Try the official brand slug.`);
  }
  const svg = await res.text();
  const dest = path.resolve(outPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, svg, 'utf8');
  return dest;
}

/**
 * Fetch a real, high-resolution photo of any famous person, landmark, company HQ, or topic
 * via the free Wikipedia / Wikimedia REST API (no API key required).
 */
export async function fetchPhoto(query, outPath) {
  const headers = { 'User-Agent': 'scenesin/2.0 (https://github.com/zeklat/scenesin)' };

  // 1. Search Wikipedia for the best matching article title
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json`;
  const sRes = await fetch(searchUrl, { headers });
  if (!sRes.ok) throw new Error(`Photo search failed (${sRes.status})`);
  const sData = await sRes.json();
  const title = sData?.query?.search?.[0]?.title;
  if (!title) throw new Error(`No Wikipedia subject found for "${query}".`);

  // 2. Fetch the REST summary to get the high-res originalimage / thumbnail
  const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const sumRes = await fetch(sumUrl, { headers });
  if (!sumRes.ok) throw new Error(`Could not fetch summary for "${title}".`);
  const sumData = await sumRes.json();

  const imgUrl = sumData?.originalimage?.source || sumData?.thumbnail?.source;
  if (!imgUrl) throw new Error(`No image available for "${title}".`);

  const imgRes = await fetch(imgUrl, { headers });
  if (!imgRes.ok) throw new Error(`Failed to download image from ${imgUrl}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());

  const dest = path.resolve(outPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return { path: dest, title, source: imgUrl };
}

