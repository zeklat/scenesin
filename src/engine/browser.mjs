// scenesin - Smart Chromium Browser Locator
// Supports Windows, macOS, Linux (Chrome, Brave, Edge, Chromium)
// Author: Anouar Zeklat (@anouar.co)

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

export function findBrowser() {
  if (process.env.CHROME && fs.existsSync(process.env.CHROME)) {
    return process.env.CHROME;
  }

  const candidates = [
    // Windows Paths
    'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'BraveSoftware/Brave-Browser/Application/brave.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft/Edge/Application/msedge.exe'),

    // macOS Paths
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',

    // Linux Paths
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/brave-browser',
    '/usr/bin/microsoft-edge',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
  ];

  for (const c of candidates) {
    if (c && fs.existsSync(c)) {
      return c;
    }
  }

  // Fallback: which/where
  try {
    const cmd = process.platform === 'win32' ? 'where.exe brave chrome msedge' : 'which google-chrome brave-browser chromium';
    const lines = execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' }).trim().split('\n');
    for (const l of lines) {
      const p = l.trim();
      if (p && fs.existsSync(p)) return p;
    }
  } catch {}

  return null;
}

