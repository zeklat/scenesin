// scenesin - Smart FFmpeg Locator
// Finds installed system FFmpeg, @ffmpeg-installer, or python imageio-ffmpeg
// Author: Anouar Zeklat (@anouar.co)

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

let cachedFfmpeg = null;

export async function findFFmpeg() {
  if (cachedFfmpeg) return cachedFfmpeg;

  // 1. Check FFMPEG_PATH env var
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) {
    cachedFfmpeg = process.env.FFMPEG_PATH;
    return cachedFfmpeg;
  }

  // 2. Check @ffmpeg-installer/ffmpeg
  try {
    const installer = await import('@ffmpeg-installer/ffmpeg');
    if (installer?.default?.path && fs.existsSync(installer.default.path)) {
      cachedFfmpeg = installer.default.path;
      return cachedFfmpeg;
    }
  } catch {}

  // 3. Check system PATH
  try {
    const cmd = process.platform === 'win32' ? 'where.exe ffmpeg' : 'which ffmpeg';
    const out = execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' }).trim();
    const p = out.split('\n')[0].trim();
    if (p && fs.existsSync(p)) {
      cachedFfmpeg = p;
      return cachedFfmpeg;
    }
  } catch {}

  // 4. Common Windows installations
  if (process.platform === 'win32') {
    const common = [
      'C:/ffmpeg/bin/ffmpeg.exe',
      'C:/Program Files/ffmpeg/bin/ffmpeg.exe',
      path.join(process.env.LOCALAPPDATA || '', 'Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-7.0.2-full_build/bin/ffmpeg.exe')
    ];
    for (const c of common) {
      if (fs.existsSync(c)) {
        cachedFfmpeg = c;
        return cachedFfmpeg;
      }
    }
  }

  // Fallback to literal 'ffmpeg' if in path
  cachedFfmpeg = 'ffmpeg';
  return cachedFfmpeg;
}
