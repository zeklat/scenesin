#!/usr/bin/env node
// scenesin - The Motion Graphic Explainer Video Generator
// Author: Anouar Zeklat (Instagram: @anouar.co)
// License: MIT

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { spawnSync, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runCapture } from '../src/engine/capture.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const STYLES = [
  { id: 'kinetic-typography', name: 'Kinetic Typography', desc: 'Animated words, bold titles, dynamic text, transitions' },
  { id: 'tech-explainer', name: 'Technology / Software Explainer', desc: 'Code editor, terminal, browser, API diagrams' },
  { id: 'cartoon-2d', name: '2D Cartoon Animation', desc: 'Characters, storytelling, flat vector illustration' },
  { id: '3d-explainer', name: '3D Explainer', desc: 'Three.js 3D meshes, orbiting camera, volumetric lighting' },
  { id: 'infographics', name: 'Infographic / Data Visualization', desc: 'Charts, statistics, comparisons, animated counters' },
  { id: 'paper-cutout', name: 'Documentary / Paper Cutout', desc: 'Maps, archival visuals, paper textures, timelines' },
  { id: 'maps-geo', name: 'Maps / Geography', desc: 'Animated routes, countries, borders, GPS waypoints' },
  { id: 'scientific-viz', name: 'Scientific Visualization', desc: '3D body, glowing organs, anatomy, physics, biology' },
  { id: 'auto-mix', name: 'Smart Auto-Mix', desc: 'Dynamic mix of matching styles across scenes' }
];

const VOICES = [
  { id: 'en-US-GuyNeural', name: 'Guy (US Male Neural)', desc: 'Deep, confident, engaging' },
  { id: 'en-US-JennyNeural', name: 'Jenny (US Female Neural)', desc: 'Clear, modern professional tech' },
  { id: 'en-US-AriaNeural', name: 'Aria (US Female Neural)', desc: 'Expressive, versatile, dynamic' },
  { id: 'en-GB-RyanNeural', name: 'Ryan (UK Male Neural)', desc: 'Sharp, polished UK voice' },
  { id: 'en-GB-SoniaNeural', name: 'Sonia (UK Female Neural)', desc: 'Crisp British accent' },
  { id: 'am_michael', name: 'Michael (Kokoro US Male)', desc: 'Steady explainer (offline ONNX)' },
  { id: 'af_heart', name: 'Heart (Kokoro US Female)', desc: 'Warm natural storytelling (offline ONNX)' }
];

function prompt(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(query, (ans) => { rl.close(); resolve(ans.trim()); }));
}

function banner() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║   🎬 SCENESIN - Explainer Videos from Code & Scripts             ║
║   Created by Anouar Zeklat (@anouar.co | youtube/@anouarzeklat)  ║
║   8 Visual Styles • 9:16 & 16:9 • 0 Dropped Frames               ║
╚══════════════════════════════════════════════════════════════════╝
`);
}

async function interactiveWizard() {
  banner();
  console.log('Welcome! Let’s configure your new explainer video:\n');

  // 1. Format
  console.log('📌 STEP 1: Choose Video Format / Aspect Ratio');
  console.log('  [1] 📱 9:16 Vertical  (1080x1920 — Shorts, Reels, TikTok)');
  console.log('  [2] 🖥️ 16:9 Landscape (1920x1080 — YouTube, Presentation, Web)');
  const formatChoice = await prompt('\nSelect format [1 or 2] (default: 1): ');
  const format = formatChoice === '2' ? '16:9' : '9:16';
  console.log(`➜ Selected Format: ${format}\n`);

  // 2. Style
  console.log('🎨 STEP 2: Choose Visual Style');
  STYLES.forEach((s, idx) => {
    console.log(`  [${idx + 1}] ${s.name.padEnd(35)} - ${s.desc}`);
  });
  const styleChoice = await prompt(`\nSelect style [1-${STYLES.length}] (default: 1): `);
  const selectedStyleIdx = Math.max(0, Math.min(STYLES.length - 1, (parseInt(styleChoice, 10) || 1) - 1));
  const style = STYLES[selectedStyleIdx].id;
  console.log(`➜ Selected Style: ${STYLES[selectedStyleIdx].name} (${style})\n`);

  // 3. Voiceover
  console.log('🎙️ STEP 3: Voiceover Narration');
  const voChoice = await prompt('Do you want AI voiceover narration? (Y/n) [default: Y]: ');
  const hasVoiceover = voChoice.toLowerCase() !== 'n';
  let voice = 'en-US-GuyNeural';

  if (hasVoiceover) {
    console.log('\nSelect a voice persona:');
    VOICES.forEach((v, idx) => {
      console.log(`  [${idx + 1}] ${v.name.padEnd(28)} - ${v.desc}`);
    });
    console.log(`  [${VOICES.length + 1}] Custom voice ID`);
    const voiceChoice = await prompt(`\nChoose voice [1-${VOICES.length + 1}] (default: 1): `);
    const vIdx = (parseInt(voiceChoice, 10) || 1) - 1;
    if (vIdx < VOICES.length) {
      voice = VOICES[vIdx].id;
    } else {
      voice = await prompt('Enter custom voice ID: ') || 'en-US-GuyNeural';
    }
    console.log(`➜ Selected Voice: ${voice}\n`);
  } else {
    console.log('➜ Voiceover disabled (Captions-only kinetic mode)\n');
  }

  // 4. SFX
  console.log('🔊 STEP 4: Sound Effects (SFX)');
  const sfxChoice = await prompt('Enable synchronized Sound Effects (whoosh, pop, tock)? (Y/n) [default: Y]: ');
  const hasSfx = sfxChoice.toLowerCase() !== 'n';
  console.log(`➜ SFX: ${hasSfx ? 'Enabled' : 'Disabled'}\n`);

  // 5. Background Music
  console.log('🎵 STEP 5: Background Music');
  const bgmChoice = await prompt('Add background music with auto-ducking? (Y/n) [default: Y]: ');
  const hasBgm = bgmChoice.toLowerCase() !== 'n';
  let music = hasBgm ? 'bed' : 'none';
  console.log(`➜ Background Music: ${hasBgm ? 'Enabled (Auto-ducking)' : 'Disabled'}\n`);

  // 6. Project Name
  const defaultProjName = `video_${Date.now().toString().slice(-4)}`;
  const projName = (await prompt(`Enter project name [default: ${defaultProjName}]: `)) || defaultProjName;
  const targetDir = path.join(REPO_ROOT, 'output', projName);

  console.log(`\n🚀 Initializing project at: output/${projName} ...`);
  copyProjectTemplate(style, targetDir, {
    title: projName,
    style,
    format,
    voice,
    voiceover: hasVoiceover,
    sfx: hasSfx,
    music
  });

  console.log(`\n✅ Project created at: ${targetDir}`);
  console.log('\nNext actions:');
  console.log(`  1. Preview in live browser:  node bin/scenesin.mjs preview output/${projName}`);
  console.log(`  2. Render final MP4 video:   node bin/scenesin.mjs render output/${projName}`);

  const runNow = await prompt('\nWould you like to preview in browser right now? (Y/n): ');
  if (runNow.toLowerCase() !== 'n') {
    await runCapture(targetDir, ['preview']);
  }
}

function copyProjectTemplate(styleId, targetDir, config) {
  // Resolve style source
  let effectiveStyle = styleId;
  if (styleId === 'auto-mix') effectiveStyle = 'kinetic-typography';
  const styleDir = path.join(REPO_ROOT, 'styles', effectiveStyle, 'example');

  if (!fs.existsSync(styleDir)) {
    throw new Error(`Style template not found: ${styleDir}`);
  }

  fs.mkdirSync(targetDir, { recursive: true });
  fs.cpSync(styleDir, targetDir, { recursive: true });

  // Update script.json with user choices
  const scriptPath = path.join(targetDir, 'script.json');
  let script = {};
  if (fs.existsSync(scriptPath)) {
    try {
      script = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
    } catch { }
  }

  script.format = config.format;
  script.style = config.style;
  script.voice = config.voice;
  script.voiceover = config.voiceover;
  script.sfx = config.sfx;
  script.music = config.music;
  fs.writeFileSync(scriptPath, JSON.stringify(script, null, 2));

  // Run initial timing calculation
  try {
    const pythonBin = process.platform === 'win32' ? 'python' : 'python3';
    execSync(`${pythonBin} scripts/estimate.py "${targetDir}"`, { cwd: REPO_ROOT, stdio: 'ignore' });
  } catch (e) {
    console.log('Note: Timing estimate will calculate on render.');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'create') {
    // Check if flags passed
    if (args.includes('--format') || args.includes('--style')) {
      // Non-interactive CLI flag mode
      banner();
      const format = args.includes('--16:9') ? '16:9' : '9:16';
      const style = args.find((a, i) => args[i - 1] === '--style') || 'kinetic-typography';
      const proj = args.find((a, i) => args[i - 1] === '--project') || `output/video_${Date.now().toString().slice(-4)}`;
      const targetDir = path.resolve(REPO_ROOT, proj);
      copyProjectTemplate(style, targetDir, {
        format,
        style,
        voice: 'en-US-GuyNeural',
        voiceover: true,
        sfx: true,
        music: 'bed'
      });
      console.log(`Created project at: ${targetDir}`);
      return;
    }
    await interactiveWizard();
    return;
  }

  const projectPath = args[1] || '.';
  const projectDir = path.resolve(process.cwd(), projectPath);

  if (command === 'preview') {
    banner();
    await runCapture(projectDir, ['preview']);
  } else if (command === 'render') {
    banner();
    console.log(`Rendering project: ${projectDir}...`);
    await runCapture(projectDir, ['video', ...args.slice(2)]);
  } else if (command === 'check') {
    banner();
    await runCapture(projectDir, ['check']);
  } else if (command === 'sheet') {
    banner();
    await runCapture(projectDir, ['sheet', ...args.slice(2)]);
  } else if (command === 'frames') {
    banner();
    await runCapture(projectDir, ['frames', ...args.slice(2)]);
  } else {
    console.log(`Unknown command: ${command}`);
    console.log('Available commands: scenesin create | preview | render | check | sheet | frames');
  }
}

main().catch((err) => {
  console.error('\n❌ scenesin error:', err.message || err);
  process.exit(1);
});

