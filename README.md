# 🎬 scenesin v2.0

> **Create cinematic motion graphic explainer videos from code, scripts, live websites, brand logos & real photos.**  
> **100% in code on your computer. \$0 cost. No API keys. 0 dropped frames.**  
> **Created by Anouar Zeklat** • Instagram: [@anouar.co](https://instagram.com/anouar.co) • YouTube: [@anouarzeklat](https://www.youtube.com/@anouarzeklat) • X: [@anouarzeklat](https://x.com/anouarzeklat)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node: >=18](https://img.shields.io/badge/Node-%3E%3D18-green.svg)](https://nodejs.org/)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://python.org)
[![Instagram](https://img.shields.io/badge/Instagram-@anouar.co-E4405F?logo=instagram&logoColor=white)](https://instagram.com/anouar.co)
[![YouTube](https://img.shields.io/badge/YouTube-@anouarzeklat-FF0000?logo=youtube&logoColor=white)](https://www.youtube.com/@anouarzeklat)
[![X](https://img.shields.io/badge/X-@anouarzeklat-000000?logo=x&logoColor=white)](https://x.com/anouarzeklat)

---

## 🌟 Why scenesin v2.0?

Most AI video tools cost \$30–\$100/month, hallucinate blurry text, and output robotic 24fps videos.  
**`scenesin`** turns your script into **cinematic motion graphics, live auto-scrolling website laptop demos, real company vector logos, Ken Burns photos of famous people & topics, expressive stickman animations, human-sounding AI voiceover, word-synced captions, and procedural SFX** — rendered locally at `0` dropped frames.

Works universally with **Antigravity**, **Claude Code**, **Cursor**, or standalone from any **Terminal (Windows, macOS, Linux)**!

---

## ✨ What's New in v2.0 (Cinematic & Online Media Engine)

- **🌐 Live Website Laptop Snapshots (`scenesin snap <url>`)**: Automatically captures any website in retina quality and animates it inside a sleek **MacBook / Browser screen** with smooth auto-scroll, glass glare sweep, and animated mouse cursor!
- **🏷️ Instant Company Vector Logos (`scenesin logo <brand>`)**: Mention GitHub, Apple, OpenAI, Tesla, YouTube, or any brand — pulls crisp SVG logos automatically with zero API keys.
- **🖼️ Real Photos of Famous People & Topics (`scenesin photo "<query>"`)**: Pulls high-res real photos via Wikimedia Commons and animates them with **Ken Burns zoom**, Polaroid/editorial cards, and **Vox / Johnny Harris highlighter sweeps**.
- **🎥 Cinematic Post-FX (`/vendor/cinema.js`)**: Subtle organic film grain, soft vignette, whip-pan transitions, animated Bezier mouse cursor + click ripples, and `Rough.js` hand-drawn underlines & callouts — **cinematic, never robotic**.
- **🎙️ 7 Curated Human-Sounding Voices (+ 300+ Languages)**: Choose from *Confident YouTube* (`Andrew`), *Enthusiastic Shorts* (`Steffan`), *"What If" Narrator* (`Brian`), *Deep Cinema* (`Christopher`), *Expressive Female* (`Ava`), *British Tech* (`Ryan`), and *Arabic Neural* (`Jamal`) — plus 300+ Edge-TTS & offline Kokoro-82M voices.

---

## 🛠️ Built-In Free Motion & Rendering Stack

Every project rendered with `scenesin` has instant access to studio-grade libraries served directly by the engine:

| Library | Role in `scenesin` | Access |
|---|---|---|
| **Cinema Kit** | Laptop website viewer, Vox highlighter, mouse cursor, Ken Burns photo cards, film grain & whip-pans | `/vendor/cinema.js` |
| **GSAP** | Studio timelines, `SplitText`, `MorphSVG`, `DrawSVG`, `ScrambleText`, elastic springs | `/node_modules/gsap/index.js` |
| **Rough.js** | Hand-drawn sketchy highlights, circles, slashes & editorial whiteboard lines | `/vendor/rough.js` |
| **Anime.js** | Smooth spring physics, staggered kinetic reveals, SVG path morphing | `/vendor/anime.js` |
| **Mo.js** | Explosive bursts, shape swirls, kinetic particle pops on cuts | `/vendor/mojs.js` |
| **Three.js** | Full 3D WebGL environments, glowing anatomical/scientific meshes, camera sweeps | `/vendor/three.js` |
| **FFmpeg** | Bundled H.264 MP4 + AAC audio encoding (zero manual PATH setup) | Built-in (`@ffmpeg-installer/ffmpeg`) |
| **Manim** *(optional)* | 3Blue1Brown-style math & scientific animations (`pip install manim`) | `python scripts/manim_bridge.py` |
| **Edge-TTS / Kokoro / WhisperX** | Free neural voiceover + millisecond word-boundary sync | `scripts/voice.py` & `requirements-optional.txt` |

---

## 📐 2 Adaptive Formats

| Format | Dimensions | Best For |
|---|---|---|
| **9:16 Vertical** | `1080 × 1920` | YouTube Shorts, Instagram Reels, TikTok |
| **16:9 Landscape** | `1920 × 1080` | YouTube Long-Form, Pitch Decks, Product Demos, Web Embeds |

---

## 🎨 10+ Visual Styles

```text
 1. ⚡ Kinetic Typography        Bold titles, neon highlights, spring physics & animated counters
 2. 💻 Tech / Software Explainer VS Code typing, terminal logs, live laptop websites & API nodes
 3. 🕹️ Stick Story (Stickman)    Expressive stickman actors, day/night rooms & gold step cards
 4. 🎨 2D Cartoon Animation      Flat vector characters, x-ray cutaways & animated storytelling
 5. 🌐 3D Explainer              Three.js procedural meshes, orbiting cameras & volumetric lighting
 6. 📊 Infographics & Data Viz   Animated rising bar charts, circular donut gauges & KPI cards
 7. 📜 Documentary / Paper Cut   Torn paper textures, real Ken Burns photos & archival timelines
 8. 🗺️ Maps & Geography          Curved flight routes, borders & pulsating GPS radar pins
 9. 🔬 Scientific Visualization  3D glowing organs, DNA helices, molecular bonds & physics
10. 🔀 Smart Auto-Mix (Cinema)   Blends styles + live websites + company logos + real photos!
```

---

## 🚀 Quickstart (30 Seconds)

### 1. Clone the repository
```bash
git clone https://github.com/zeklat/scenesin.git
cd scenesin
npm install
```
*(Starts clean and lightweight — zero 1 GB model weights in Git, and `output/` starts empty!)*

### 2. Launch the Interactive Director Wizard
```bash
node bin/scenesin.mjs create
# or via Python:
python scenesin.py create
```

The interactive wizard directs your video across **8 creative choices**:
1. **Format**: `9:16 Vertical` or `16:9 Landscape`
2. **Visual Style**: Pick from 10 styles (including *Stickman* & *Smart Auto-Mix*)
3. **Color Theme**: *Neon Cyber*, *Editorial Documentary*, *Apple Minimal*, *Warm Paper*, or *Matrix Terminal*
4. **Online Media Assets**: Auto-include live website laptop snaps, company logos & famous person photos (`Yes / No`)
5. **Characters**: *None*, *Stickman Actor*, or *2D Cartoon Host*
6. **Cinematic FX**: Film grain, vignette, whip-pan transitions & animated mouse cursor (`Yes / No`)
7. **Voiceover**: `Yes / No` + 7 curated cinematic voices (*Andrew YouTube*, *Steffan Shorts*, *Brian "What If"*, *Christopher Cinema*, *Ava Female*, *Ryan UK*, *Jamal Arabic*) or any custom ID
8. **Sound Effects & Background Music**: Synchronized procedural SFX + optional auto-ducked music

---

## 🎮 CLI Commands

```bash
# Snap any live website for laptop/browser scenes
node bin/scenesin.mjs snap https://github.com/zeklat/scenesin output/my-video/assets/snaps/site.png

# Fetch a crisp SVG company logo (GitHub, Apple, OpenAI, Tesla, YouTube...)
node bin/scenesin.mjs logo github output/my-video/assets/logos/github.svg

# Fetch a real photo of a famous person or topic
node bin/scenesin.mjs photo "Steve Jobs" output/my-video/assets/media/person.jpg

# Preview live in browser at 60 FPS
node bin/scenesin.mjs preview output/my-video

# Check frame integrity & word-synced captions
node bin/scenesin.mjs check output/my-video

# Generate a visual QA contact sheet
node bin/scenesin.mjs sheet output/my-video review/all.jpg

# Render final 1080p MP4
node bin/scenesin.mjs render output/my-video
```

---

## 🤖 Use with Any AI Coding Agent

`scenesin` ships with native skill & rule files so **any AI agent** can direct, fetch real websites/logos/photos, animate, QA, and render full videos for you:
- **Antigravity**: [SKILL.md](SKILL.md) & `.agents/skills/scenesin/SKILL.md`
- **Claude Code**: [CLAUDE.md](CLAUDE.md) & `.claude/skills/scenesin/SKILL.md`
- **Cursor**: [.cursorrules](.cursorrules) & `.cursor/rules/scenesin.mdc`

---

## 👤 Author & Community

Built with ❤️ by **Anouar Zeklat**  
Instagram: [@anouar.co](https://instagram.com/anouar.co)  
YouTube: [@anouarzeklat](https://www.youtube.com/@anouarzeklat)  
X: [@anouarzeklat](https://x.com/anouarzeklat)  
Feel free to star ⭐ the repo, open an issue, or tag **@anouar.co** in videos you create!
