# 🎬 scenesin

> **Create viral motion graphic explainer videos from code and scripts.**  
> **100% in code on your computer. $0 cost. No API keys. 0 dropped frames.**  
> **Created by Anouar Zeklat** • Instagram: [@anouar.co](https://instagram.com/anouar.co) • YouTube: [@anouarzeklat](https://www.youtube.com/@anouarzeklat)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node: >=18](https://img.shields.io/badge/Node-%3E%3D18-green.svg)](https://nodejs.org/)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://python.org)
[![Instagram](https://img.shields.io/badge/Instagram-@anouar.co-E4405F?logo=instagram&logoColor=white)](https://instagram.com/anouar.co)
[![YouTube](https://img.shields.io/badge/YouTube-@anouarzeklat-FF0000?logo=youtube&logoColor=white)](https://www.youtube.com/@anouarzeklat)

---

## 🌟 Why scenesin?

Most AI video tools cost \$30–\$100/month, hallucinate text, and output blurry 24fps videos.  
**`scenesin`** turns your script into **crisp 60fps motion graphics, synchronized AI voiceover, dynamic word-by-word subtitles, procedural sound effects, and ducked background music** — rendered directly on your machine.

Works universally with **Antigravity**, **Claude Code**, **Cursor**, or standalone from any **Terminal (Mac, Windows, Linux)**!

---

## 🛠️ Built-In Motion & Rendering Stack (100% Free & Open-Source)

Every project rendered with `scenesin` has instant access to studio-grade motion libraries served directly by the engine:

| Library | Role in `scenesin` | Access |
|---|---|---|
| **GSAP** | Studio timelines, `SplitText`, `MorphSVG`, `DrawSVG`, `ScrambleText`, elastic springs | `/node_modules/gsap/index.js` |
| **Anime.js** | Smooth spring physics, staggered kinetic reveals, SVG path morphing | `/vendor/anime.js` |
| **Rough.js** | Hand-drawn whiteboard, sketchy illustrations, editorial paper-cutout lines | `/vendor/rough.js` |
| **Mo.js** | Explosive bursts, shape swirls, kinetic particle pops on cuts | `/vendor/mojs.js` |
| **Three.js** | Full 3D WebGL environments, glowing anatomical/scientific meshes, camera sweeps | `/vendor/three.js` |
| **FFmpeg** | Bundled H.264 MP4 + AAC audio encoding (zero manual PATH setup) | Built-in (`@ffmpeg-installer/ffmpeg`) |
| **Manim** *(optional)* | 3Blue1Brown-style math & scientific animations (`pip install manim`) | `python scripts/manim_bridge.py` |
| **Edge-TTS / Kokoro / WhisperX** | Free neural voiceover + word-level / phoneme-level timestamp sync | `scripts/voice.py` & `requirements-optional.txt` |

---

## 📐 2 Adaptive Formats

| Format | Dimensions | Best For |
|---|---|---|
| **9:16 Vertical** | `1080 x 1920` | YouTube Shorts, Instagram Reels, TikTok |
| **16:9 Landscape** | `1920 x 1080` | YouTube Long-Form, Pitch Decks, Demos, Web Embeds |

---

## 🎨 The 8 Visual Styles

```text
1. ⚡ Kinetic Typography
   Bold title cards, dynamic spring physics, neon keyword glows, and animated metric counters.

2. 💻 Technology / Software Explainer
   Dark-mode VS Code typing, terminal commands, browser mockups, and microservice node diagrams.

3. 🎨 2D Cartoon Animation
   Expressive characters, animated storytelling, flat vector art, and anatomical cutaways.

4. 🌐 3D Explainer
   Three.js procedural meshes, orbiting camera paths, futuristic wireframes, and volumetric lighting.

5. 📊 Infographic / Data Visualization
   Animated rising bar charts, circular donut percentage meters, KPI metric cards, and statistics.

6. 📜 Documentary / Paper Cutout
   Stop-motion ripped paper textures, archival illustrations, timeline pins, and historical collage.

7. 🗺️ Maps / Geography
   3D globe & vector world projections, curved flight paths, animated borders, and GPS radar pins.

8. 🔬 Scientific Visualization
   3D human body with glowing organs, rotating DNA helices, molecular bonds, and physics particles.
```

---

## 🚀 Quickstart (30 Seconds)

### 1. Clone the repository
```bash
git clone https://github.com/anouarzeklat/scenesin.git
cd scenesin
```
*(The repository starts clean and lightweight. No 1 GB model weights are downloaded into Git!)*

### 2. Install dependencies
```bash
npm install
```

### 3. Launch the Interactive Video Wizard
```bash
node bin/scenesin.mjs create
# or using Python:
python scenesin.py create
```

The interactive wizard asks you 5 simple questions:
1. **Format**: `9:16 Vertical` or `16:9 Landscape`
2. **Visual Style**: Pick from the 8 styles (or Smart Auto-Mix)
3. **Voiceover**: `Yes / No` (Select from Guy, Jenny, Aria, Ryan, Sonia, Michael, Heart)
4. **Sound Effects (SFX)**: `Yes / No` (Synchronized whooshes, keyboard clicks, pops)
5. **Background Music**: `Yes / No` (Lo-Fi, Synthwave, Ambient with auto-ducking)

Your project is automatically initialized inside `output/<your-project-name>/`!

---

## 🎮 CLI Commands

```bash
# Preview live in browser at 60 FPS
node bin/scenesin.mjs preview output/my-video

# Check frame integrity & caption timings
node bin/scenesin.mjs check output/my-video

# Generate a visual contact sheet of all shots
node bin/scenesin.mjs sheet output/my-video review/sheet.jpg

# Render the final MP4 video
node bin/scenesin.mjs render output/my-video
```

---

## 🤖 Use with Any AI Agent

`scenesin` is built from the ground up for agentic workflows:

- **Antigravity**: Load the native skill located at `SKILL.md` or `.agents/skills/scenesin/SKILL.md`. Prompt:  
  *"Make a 16:9 tech explainer video explaining Docker in 45 seconds using scenesin."*
- **Claude Code**: Works out of the box with `CLAUDE.md`.
- **Cursor**: Includes `.cursorrules` and `.cursor/rules/scenesin.mdc` for instant project orchestration.

---

## 📁 Clean Repository Layout

```text
scenesin/
├── bin/
│   └── scenesin.mjs         # Universal CLI runner & interactive wizard
├── scenesin.py              # Python CLI entrypoint
├── src/
│   └── engine/              # Capture engine, browser locator, ffmpeg bridge
├── styles/                  # The 8 Visual Style Templates
│   ├── kinetic-typography/
│   ├── tech-explainer/
│   ├── cartoon-2d/
│   ├── 3d-explainer/
│   ├── infographics/
│   ├── paper-cutout/
│   ├── maps-geo/
│   └── scientific-viz/
├── scripts/                 # Voice synthesis & timing engines
├── output/                  # User created projects (empty on git clone via .gitkeep)
│   └── .gitkeep
├── SKILL.md                 # Antigravity agent specification
├── CLAUDE.md                # Claude Code configuration
└── .cursorrules             # Cursor AI assistant rules
```

---

## 👤 Author & Community

Built with ❤️ by **Anouar Zeklat**  
Instagram: [@anouar.co](https://instagram.com/anouar.co)  
YouTube: [@anouarzeklat](https://www.youtube.com/@anouarzeklat)  
Feel free to open an issue, submit a pull request, or tag **@anouar.co** in videos you create!
