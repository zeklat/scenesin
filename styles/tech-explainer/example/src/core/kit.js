// scenesin - Tech Explainer Component Kit
// Code editor, terminal, browser mockup, and API diagram nodes
// Author: Anouar Zeklat (@anouar.co)

import { ctx, C, W, H, IS_LANDSCAPE, clamp, lerp, seg, eo, eob, rr } from './lib.js';

export function windowChrome(x, y, w, h, title = '', r = 20) {
  // Window Background & Border
  rr(x, y, w, h, r);
  ctx.fillStyle = C.windowBg;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = C.windowBorder;
  ctx.stroke();

  // Header Bar
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, 56, [r, r, 0, 0]);
  ctx.fillStyle = C.windowHeader;
  ctx.fill();

  // Traffic lights
  const dots = ['#FF5F56', '#FFBD2E', '#27C93F'];
  dots.forEach((col, i) => {
    ctx.beginPath();
    ctx.arc(x + 28 + i * 22, y + 28, 7, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
  });

  // Window Title
  if (title) {
    ctx.font = "600 22px 'Inter'";
    ctx.fillStyle = C.muted;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, x + w / 2, y + 28);
  }
  ctx.restore();
}

export function codeEditor({ x, y, w, h, title = 'engine.ts', code = [], activeLine = 0, t = 0 }) {
  windowChrome(x, y, w, h, title);

  const startY = y + 90;
  const lineH = IS_LANDSCAPE ? 46 : 56;
  const numGutter = 60;

  ctx.save();
  code.forEach((line, idx) => {
    const ly = startY + idx * lineH;
    if (ly > y + h - 30) return;

    // Line Number
    ctx.font = `600 ${IS_LANDSCAPE ? 24 : 28}px monospace`;
    ctx.fillStyle = idx === activeLine ? C.text : C.muted;
    ctx.textAlign = 'right';
    ctx.fillText(String(idx + 1), x + numGutter - 15, ly);

    // Active line highlight
    if (idx === activeLine) {
      ctx.fillStyle = 'rgba(88, 166, 255, 0.12)';
      ctx.fillRect(x + numGutter, ly - (lineH * 0.7), w - numGutter - 20, lineH);
    }

    // Code Text with basic token coloring
    ctx.textAlign = 'left';
    ctx.fillStyle = C.text;
    let cx = x + numGutter + 20;

    // Split keywords
    const tokens = line.split(/(\s+|[(),.:;{}])/);
    tokens.forEach((tok) => {
      if (['const', 'function', 'import', 'export', 'return', 'await', 'async'].includes(tok)) {
        ctx.fillStyle = C.syntaxKeyword;
      } else if (tok.startsWith('"') || tok.startsWith("'") || tok.startsWith('`')) {
        ctx.fillStyle = C.syntaxString;
      } else if (!isNaN(Number(tok)) && tok.trim() !== '') {
        ctx.fillStyle = C.syntaxNumber;
      } else if (['runCapture', 'init', 'render', 'execute'].includes(tok)) {
        ctx.fillStyle = C.syntaxFunction;
      } else {
        ctx.fillStyle = C.text;
      }
      ctx.fillText(tok, cx, ly);
      cx += ctx.measureText(tok).width;
    });

    // Blinking Cursor on active line
    if (idx === activeLine && Math.floor(t * 3) % 2 === 0) {
      ctx.fillStyle = C.accent;
      ctx.fillRect(cx + 4, ly - (lineH * 0.75), 3, lineH * 0.85);
    }
  });
  ctx.restore();
}

export function terminal({ x, y, w, h, title = 'Terminal', lines = [], t = 0 }) {
  windowChrome(x, y, w, h, title);

  const startY = y + 90;
  const lineH = IS_LANDSCAPE ? 44 : 52;

  ctx.save();
  ctx.font = `600 ${IS_LANDSCAPE ? 22 : 26}px monospace`;
  ctx.textAlign = 'left';

  lines.forEach((item, idx) => {
    const ly = startY + idx * lineH;
    if (ly > y + h - 20) return;

    if (item.cmd) {
      ctx.fillStyle = C.success;
      ctx.fillText('➜', x + 30, ly);
      ctx.fillStyle = C.accent;
      ctx.fillText('~', x + 55, ly);
      ctx.fillStyle = C.text;
      ctx.fillText(item.cmd, x + 80, ly);
    } else if (item.ok) {
      ctx.fillStyle = C.success;
      ctx.fillText(`✓ ${item.ok}`, x + 40, ly);
    } else if (item.info) {
      ctx.fillStyle = C.muted;
      ctx.fillText(`ℹ ${item.info}`, x + 40, ly);
    }
  });
  ctx.restore();
}

export function apiArchitectureDiagram({ x, y, w, h, t = 0 }) {
  // Draw API node diagram
  const nodes = [
    { name: 'CLIENT', sub: '9:16 / 16:9 App', color: C.nodeClient, x: x + w * 0.2, y: y + h * 0.5 },
    { name: 'API GATEWAY', sub: 'scenesin Engine', color: C.nodeServer, x: x + w * 0.5, y: y + h * 0.5 },
    { name: 'RENDER POD', sub: 'GPU Chromium / FFmpeg', color: C.nodeDb, x: x + w * 0.8, y: y + h * 0.5 }
  ];

  ctx.save();
  // Connecting Lines
  ctx.lineWidth = 4;
  ctx.strokeStyle = C.windowBorder;
  ctx.beginPath();
  ctx.moveTo(nodes[0].x, nodes[0].y);
  ctx.lineTo(nodes[1].x, nodes[1].y);
  ctx.lineTo(nodes[2].x, nodes[2].y);
  ctx.stroke();

  // Animated Glowing Data Packets
  const packetPos1 = (t * 0.8) % 1;
  const packetPos2 = (t * 0.8 + 0.5) % 1;
  const p1x = lerp(nodes[0].x, nodes[1].x, packetPos1);
  const p2x = lerp(nodes[1].x, nodes[2].x, packetPos2);

  [p1x, p2x].forEach((px) => {
    ctx.beginPath();
    ctx.arc(px, nodes[0].y, 9, 0, Math.PI * 2);
    ctx.fillStyle = C.primary || '#00F0FF';
    ctx.fill();
  });

  // Nodes
  nodes.forEach((n) => {
    const nw = IS_LANDSCAPE ? 260 : 220;
    const nh = IS_LANDSCAPE ? 140 : 160;
    rr(n.x - nw / 2, n.y - nh / 2, nw, nh, 20);
    ctx.fillStyle = C.windowBg;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = n.color;
    ctx.stroke();

    ctx.font = `800 ${IS_LANDSCAPE ? 26 : 30}px 'Inter'`;
    ctx.fillStyle = C.text;
    ctx.textAlign = 'center';
    ctx.fillText(n.name, n.x, n.y - 12);

    ctx.font = `600 ${IS_LANDSCAPE ? 18 : 22}px 'Inter'`;
    ctx.fillStyle = C.muted;
    ctx.fillText(n.sub, n.x, n.y + 26);
  });

  ctx.restore();
}

