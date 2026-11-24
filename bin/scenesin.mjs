#!/usr/bin/env node
// scenesin v2.0 - Cinematic Motion Graphic Explainer Video Engine
// Author: Anouar Zeklat (@anouar.co | youtube/@anouarzeklat | x/@anouarzeklat)
// License: MIT

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runCapture } from '../src/engine/capture.mjs';
import { snapWebsite, fetchLogo, fetchPhoto } from '../src/engine/media.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const STYLES = [
  { id: 'kinetic-typography', name: 'Kinetic Typography', desc: 'Bold titles, neon highlights, dynamic spring text, counters' },
  { id: 'tech-explainer', name: 'Technology / Software Explainer', desc: 'Code editor, terminal, laptop website demos, API diagrams' },
  { id: 'stick-story', name: 'Stick Story (Stickman Animation)', desc: 'Expressive stickman actors, room sets, gold step cards' },
  { id: 'cartoon-2d', name: '2D Cartoon Animation', desc: 'Expressive characters, storytelling, flat vector cutaways' },
  { id: '3d-explainer', name: '3D Explainer', desc: 'Three.js 3D meshes, orbiting camera, volumetric lighting' },
  { id: 'infographics', name: 'Infographic / Data Visualization', desc: 'Animated bar charts, donut gauges, KPI comparisons' },
  { id: 'paper-cutout', name: 'Documentary / Paper Cutout', desc: 'Torn paper textures, real photos, archival timelines' },
  { id: 'maps-geo', name: 'Maps / Geography', desc: 'Animated flight routes, countries, borders, radar pins' },
  { id: 'scientific-viz', name: 'Scientific Visualization', desc: '3D body, glowing organs, DNA, physics & biology' },
  { id: 'auto-mix', name: 'Smart Auto-Mix (Cinematic)', desc: 'Dynamic blend of styles + websites + photos + logos' }
];

const THEMES = [
  { id: 'neon-cyber', name: 'Neon Cyber Dark', desc: 'Deep obsidian + electric cyan, hyper pink & emerald glow' },
  { id: 'editorial-doc', name: 'Editorial Documentary', desc: 'Vox / Johnny Harris warm charcoal, cream & gold accents' },
  { id: 'apple-minimal', name: 'Apple Minimal Clean', desc: 'Crisp studio light/frosted glass with razor-sharp typography' },
  { id: 'warm-paper', name: 'Warm Archival Paper', desc: 'Parchment textures, ink outlines & vintage crimson highlights' },
  { id: 'matrix-dev', name: 'Matrix / Hacker Terminal', desc: 'GitHub dark slate, syntax purple & terminal acid green' }
];

const CHARACTERS = [
  { id: 'none', name: 'No Character (Pure Motion & Media)', desc: 'Focus on websites, photos, logos, charts & typography' },
  { id: 'stickman', name: 'Stickman Actor', desc: 'Expressive black stickman with acting eyes & props' },
  { id: 'cartoon-2d', name: '2D Cartoon Host', desc: 'Friendly flat vector hero with expressive reactions' }
];

const VOICES = [
  { id: 'en-US-AndrewMultilingualNeural', name: 'Andrew (Confident YouTube)', desc: 'Warm, natural storyteller — best for 16:9 YouTube' },
  { id: 'en-US-SteffanNeural', name: 'Steffan (Enthusiastic Shorts)', desc: 'High-energy, punchy — best for Reels / TikTok / Shorts' },
  { id: 'en-US-BrianMultilingualNeural', name: 'Brian ("What If" Narrator)', desc: 'Curious, captivating — classic "What happens if...?" vibe' },
  { id: 'en-US-ChristopherNeural', name: 'Christopher (Deep Cinema)', desc: 'Rich, authoritative documentary voice' },
  { id: 'en-US-AvaMultilingualNeural', name: 'Ava (Expressive Female)', desc: 'Warm, conversational, super natural' },
  { id: 'en-GB-RyanNeural', name: 'Ryan (British Tech)', desc: 'Sharp, polished UK narrator for tech & science' },
  { id: 'ar-MA-JamalNeural', name: 'Jamal (Arabic Neural)', desc: 'Crisp Arabic voice (or enter any of 300+ Edge/Kokoro IDs)' }
];

function prompt(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(query, (ans) => { rl.close(); resolve(ans.trim()); }));
}

function banner() {
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║   🎬 SCENESIN v2.0 — Cinematic Explainer Videos from Code & Media    ║
║   Created by Anouar Zeklat (@anouar.co | YT & X: @anouarzeklat)      ║
║   9:16 & 16:9 • Live Web Snaps • Logos & Photos • 0 Dropped Frames   ║
╚══════════════════════════════════════════════════════════════════════╝
`);
}

async function interactiveWizard() {
  banner();
  console.log('Let’s direct your new cinematic video:\n');

  // 1. Format
  console.log('📐 STEP 1: Video Format / Aspect Ratio');
  console.log('  [1] 📱 9:16 Vertical  (1080×1920 — Shorts, Reels, TikTok)');
  console.log('  [2] 🖥️ 16:9 Landscape (1920×1080 — YouTube, Demos, Web)');
  const formatChoice = await prompt('\nSelect format [1-2] (default: 1): ');
  const format = formatChoice === '2' ? '16:9' : '9:16';
  console.log(`➜ Format: ${format}\n`);

  // 2. Style
  console.log('🎨 STEP 2: Visual Style');
  STYLES.forEach((s, idx) => {
    console.log(`  [${String(idx + 1).padStart(2)}] ${s.name.padEnd(34)} - ${s.desc}`);
  });
  const styleChoice = await prompt(`\nSelect style [1-${STYLES.length}] (default: 10 Auto-Mix): `);
  const sIdx = Math.max(0, Math.min(STYLES.length - 1, (parseInt(styleChoice, 10) || 10) - 1));
  const style = STYLES[sIdx].id;
  console.log(`➜ Style: ${STYLES[sIdx].name} (${style})\n`);

  // 3. Color Theme
  console.log('🌈 STEP 3: Color Theme & Mood');
  THEMES.forEach((th, idx) => {
    console.log(`  [${idx + 1}] ${th.name.padEnd(26)} - ${th.desc}`);
  });
  const themeChoice = await prompt(`\nSelect theme [1-${THEMES.length}] (default: 1): `);
  const theme = THEMES[Math.max(0, Math.min(THEMES.length - 1, (parseInt(themeChoice, 10) || 1) - 1))].id;
  console.log(`➜ Theme: ${theme}\n`);

  // 4. Online Media Assets (Website Snaps, Company Logos, Real Photos)
  console.log('🌐 STEP 4: Online Visual Assets (Websites, Company Logos, Real Photos)');
  const mediaChoice = await prompt('Include live website laptop snaps, company logos & famous person photos? (Y/n) [default: Y]: ');
  const onlineAssets = mediaChoice.toLowerCase() !== 'n';
  console.log(`➜ Online Media Assets: ${onlineAssets ? 'Enabled (Auto-fetch websites, logos & photos)' : 'Disabled'}\n`);

  // 5. Characters
  console.log('🕹️ STEP 5: On-Screen Character / Host');
  CHARACTERS.forEach((ch, idx) => {
    console.log(`  [${idx + 1}] ${ch.name.padEnd(34)} - ${ch.desc}`);
  });
  const charChoice = await prompt(`\nSelect character [1-${CHARACTERS.length}] (default: 1): `);
  const character = CHARACTERS[Math.max(0, Math.min(CHARACTERS.length - 1, (parseInt(charChoice, 10) || 1) - 1))].id;
  console.log(`➜ Character: ${character}\n`);

  // 6. Cinematic Post-FX
  console.log('🎥 STEP 6: Cinematic Polish');
  const fxChoice = await prompt('Enable Film Grain, Vignette, Whip-Pan Transitions & Animated Cursor? (Y/n) [default: Y]: ');
  const cinemaFx = fxChoice.toLowerCase() !== 'n';
  console.log(`➜ Cinematic FX: ${cinemaFx ? 'Enabled' : 'Disabled'}\n`);

  // 7. Voiceover
  console.log('🎙️ STEP 7: AI Voiceover Narration');
  const voChoice = await prompt('Enable AI Voiceover? (Y/n) [default: Y]: ');
  const hasVoiceover = voChoice.toLowerCase() !== 'n';
  let voice = format === '16:9' ? 'en-US-AndrewMultilingualNeural' : 'en-US-SteffanNeural';

  if (hasVoiceover) {
    console.log('\nChoose from 7 curated human-sounding voices:');
    VOICES.forEach((v, idx) => {
      console.log(`  [${idx + 1}] ${v.name.padEnd(32)} - ${v.desc}`);
    });
    console.log(`  [8] Custom Voice ID (any of 300+ Edge-TTS or Kokoro voices)`);
    const vChoice = await prompt(`\nChoose voice [1-8] (default: ${format === '16:9' ? '1 Andrew' : '2 Steffan'}): `);
    const vIdx = (parseInt(vChoice, 10) || (format === '16:9' ? 1 : 2)) - 1;
    if (vIdx >= 0 && vIdx < VOICES.length) {
      voice = VOICES[vIdx].id;
    } else {
      voice = (await prompt('Enter custom voice ID (e.g. en-US-GuyNeural): ')) || voice;
    }
    console.log(`➜ Voice: ${voice}\n`);
  } else {
    console.log('➜ Voiceover: Disabled (Captions-only mode)\n');
  }

  // 8. SFX & Background Music
  console.log('🔊 STEP 8: Sound Effects & Background Music');
  const sfxChoice = await prompt('Enable synchronized Sound Effects (whoosh, pop, click, slam)? (Y/n) [default: Y]: ');
  const hasSfx = sfxChoice.toLowerCase() !== 'n';
  const bgmChoice = await prompt('Add background music with auto-ducking? (y/N) [default: N]: ');
  const hasBgm = bgmChoice.toLowerCase() === 'y';
  console.log(`➜ SFX: ${hasSfx ? 'Enabled' : 'Disabled'} | Music: ${hasBgm ? 'Enabled' : 'None'}\n`);

  // 9. Project Name
  const defaultProjName = `video_${Date.now().toString().slice(-4)}`;
  const projName = (await prompt(`📁 Project name [default: ${defaultProjName}]: `)) || defaultProjName;
  const targetDir = path.join(REPO_ROOT, 'output', projName);

  console.log(`\n🚀 Creating cinematic project at: output/${projName} ...`);
  copyProjectTemplate(style, targetDir, {
    title: projName,
    style,
    format,
    theme,
    onlineAssets,
    character,
    cinemaFx,
    voice,
    voiceover: hasVoiceover,
    sfx: hasSfx,
    music: hasBgm ? 'bed' : 'none'
  });

  console.log(`\n✅ Project created at: ${targetDir}`);
  console.log('\nNext steps:');
  console.log(`  • Snap a live website:   node bin/scenesin.mjs snap https://github.com/zeklat/scenesin output/${projName}/assets/snaps/site.png`);
  console.log(`  • Fetch a company logo:  node bin/scenesin.mjs logo github output/${projName}/assets/logos/github.svg`);
  console.log(`  • Fetch a person photo:  node bin/scenesin.mjs photo "Steve Jobs" output/${projName}/assets/media/person.jpg`);
  console.log(`  • Preview at 60fps:      node bin/scenesin.mjs preview output/${projName}`);
  console.log(`  • Render final MP4:      node bin/scenesin.mjs render output/${projName}`);

  const runNow = await prompt('\nPreview in browser right now? (Y/n): ');
  if (runNow.toLowerCase() !== 'n') {
    await runCapture(targetDir, ['preview']);
  }
}

function copyProjectTemplate(styleId, targetDir, config) {
  let effectiveStyle = styleId;
  if (styleId === 'auto-mix') effectiveStyle = 'kinetic-typography';
  const styleDir = path.join(REPO_ROOT, 'styles', effectiveStyle, 'example');

  if (!fs.existsSync(styleDir)) {
    throw new Error(`Style template not found: ${styleDir}`);
  }

  fs.mkdirSync(targetDir, { recursive: true });
  fs.cpSync(styleDir, targetDir, { recursive: true });
  fs.mkdirSync(path.join(targetDir, 'assets', 'snaps'), { recursive: true });
  fs.mkdirSync(path.join(targetDir, 'assets', 'logos'), { recursive: true });
  fs.mkdirSync(path.join(targetDir, 'assets', 'media'), { recursive: true });

  const scriptPath = path.join(targetDir, 'script.json');
  let script = {};
  if (fs.existsSync(scriptPath)) {
    try { script = JSON.parse(fs.readFileSync(scriptPath, 'utf8')); } catch {}
  }

  Object.assign(script, {
    format: config.format,
    style: config.style,
    theme: config.theme || 'neon-cyber',
    onlineAssets: config.onlineAssets ?? true,
    character: config.character || 'none',
    cinemaFx: config.cinemaFx ?? true,
    voice: config.voice,
    voiceover: config.voiceover,
    sfx: config.sfx,
    music: config.music
  });
  fs.writeFileSync(scriptPath, JSON.stringify(script, null, 2));

  try {
    const pythonBin = process.platform === 'win32' ? 'python' : 'python3';
    execSync(`${pythonBin} scripts/estimate.py "${targetDir}"`, { cwd: REPO_ROOT, stdio: 'ignore' });
  } catch {}
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'create') {
    if (args.includes('--format') || args.includes('--style')) {
      banner();
      const format = args.includes('--16:9') ? '16:9' : '9:16';
      const style = args.find((a, i) => args[i - 1] === '--style') || 'kinetic-typography';
      const proj = args.find((a, i) => args[i - 1] === '--project') || `output/video_${Date.now().toString().slice(-4)}`;
      const targetDir = path.resolve(REPO_ROOT, proj);
      copyProjectTemplate(style, targetDir, {
        format, style,
        theme: 'neon-cyber',
        onlineAssets: true,
        character: style === 'stick-story' ? 'stickman' : 'none',
        cinemaFx: true,
        voice: format === '16:9' ? 'en-US-AndrewMultilingualNeural' : 'en-US-SteffanNeural',
        voiceover: true, sfx: true, music: 'none'
      });
      console.log(`Created project at: ${targetDir}`);
      return;
    }
    await interactiveWizard();
    return;
  }

  // New v2.0 Online Media Commands
  if (command === 'snap') {
    const url = args[1];
    const out = args[2] || 'assets/snaps/website.png';
    if (!url) throw new Error('Usage: scenesin snap <url> [output.png] [--full]');
    console.log(`📸 Capturing live website snapshot: ${url} ...`);
    const saved = await snapWebsite(url, out, { fullPage: args.includes('--full') });
    console.log(`✅ Website snapshot saved: ${saved}`);
    return;
  }

  if (command === 'logo') {
    const brand = args[1];
    const out = args[2] || `assets/logos/${(brand || 'brand').toLowerCase().replace(/[^a-z0-9]/g, '')}.svg`;
    const color = args[3] || 'FFFFFF';
    if (!brand) throw new Error('Usage: scenesin logo <company> [output.svg] [hexColor]');
    console.log(`🏷️ Fetching crisp vector logo for "${brand}" ...`);
    const saved = await fetchLogo(brand, out, color);
    console.log(`✅ Logo saved: ${saved}`);
    return;
  }

  if (command === 'photo') {
    const query = args[1];
    const out = args[2] || `assets/media/${(query || 'photo').toLowerCase().replace(/[^a-z0-9]+/g, '_')}.jpg`;
    if (!query) throw new Error('Usage: scenesin photo "<person or topic>" [output.jpg]');
    console.log(`🖼️ Fetching real web photo for "${query}" ...`);
    const res = await fetchPhoto(query, out);
    console.log(`✅ Photo saved (${res.title}): ${res.path}`);
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
    console.log('Commands: create | snap | logo | photo | preview | render | check | sheet | frames');
  }
}

main().catch((err) => {
  console.error('\n❌ scenesin error:', err.message || err);
  process.exit(1);
});
