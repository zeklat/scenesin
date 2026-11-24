---
name: scenesin
description: Create viral motion graphic explainer videos from code and scripts in 9:16 (Shorts/Reels/TikTok) and 16:9 (YouTube) across 8 visual styles. Free local or cloud AI voice, word-synced subtitles, SFX, and ducked background music, rendered to MP4 with 0 dropped frames. Created by Anouar Zeklat (@anouar.co).
---

# scenesin

> **Author**: Anouar Zeklat (Instagram: [@anouar.co](https://instagram.com/anouar.co) • YouTube: [@anouarzeklat](https://www.youtube.com/@anouarzeklat) • X: [@anouarzeklat](https://x.com/anouarzeklat))  
> **Repository**: `scenesin`

Create finished motion graphic explainer videos completely in code on your computer: script, voiceover narration, word-level synchronized typography, procedural animation, sound effects, and music, rendered to crisp MP4.

**Everything is code**: HTML Canvas / SVG, Chromium headless rendering, **GSAP**, **Anime.js**, **Rough.js**, **Mo.js**, **Three.js**, **Manim** (optional), procedural audio synthesis, and **FFmpeg** multiplexing. No paid AI video APIs, no subscription fees, no credit limits.

### Built-In Free Motion & Cinematic Media Libraries (Available in Every Project)
The `scenesin` engine automatically serves installed libraries at `/vendor/*` and `/node_modules/*`:
- **Cinema Media Kit** (`import * as Cinema from '/vendor/cinema.js'` — `loadImage`, `drawLaptopWebsite`, `drawArticleHighlight`, `drawMouseCursor`, `drawPhotoCard`, `drawBrandBadge`, `whipPanX`, `drawCinemaPostFX`)
- **Live Online Media CLI** (Zero API Keys):
  - **Website Mentioned** → run `node bin/scenesin.mjs snap <url> <proj>/assets/snaps/site.png` and render it on a sleek laptop screen with `Cinema.drawLaptopWebsite(...)` + auto-scroll & mouse cursor!
  - **Company Mentioned** → run `node bin/scenesin.mjs logo <company> <proj>/assets/logos/<brand>.svg` and display it with `Cinema.drawBrandBadge(...)`!
  - **Famous Person / Topic Mentioned** → run `node bin/scenesin.mjs photo "<name>" <proj>/assets/media/person.jpg` and animate it with `Cinema.drawPhotoCard(...)` (Ken Burns zoom)!
- **GSAP** (`import { gsap } from '/node_modules/gsap/index.js'` — plus `SplitText`, `MorphSVGPlugin`, `DrawSVGPlugin`, `MotionPathPlugin`, `ScrambleTextPlugin`)
- **Anime.js** (`import * as anime from '/vendor/anime.js'` — springs, staggers, SVG morphing)
- **Rough.js** (`import rough from '/vendor/rough.js'` — hand-drawn sketchy/whiteboard Canvas & SVG)
- **Mo.js** (`<script src="/vendor/mojs.js"></script>` — kinetic bursts, swirls, particle explosions)
- **Three.js** (`import * as THREE from '/vendor/three.js'` — 3D WebGL meshes & cameras)
- **Manim Bridge** (`python scripts/manim_bridge.py <file.py> <Scene> --format 9:16` — 3Blue1Brown math/science animations, optional `pip install manim`)
- **WhisperX / Faster-Whisper** (optional forced phoneme alignment via `requirements-optional.txt`)

---

## 1. Supported Formats & Dimensions

| Aspect Ratio | Resolution | Best For |
|---|---|---|
| **9:16 Vertical** | `1080 x 1920` | YouTube Shorts, Instagram Reels, TikTok |
| **16:9 Landscape** | `1920 x 1080` | YouTube Long-form, Presentations, Product Demos, Web Embeds |

---

## 2. The 8 Visual Styles

| # | Style ID | Visual Signature | Ideal Topics |
|---|---|---|---|
| 1 | **`kinetic-typography`** | Bold titles, neon keywords, dynamic spring text, counters, badges | High-energy insights, mindset shifts, business rules, quotes |
| 2 | **`tech-explainer`** | Dark-mode code editor, terminal logs, browser mockups, API node graphs | Software development, developer tools, system architecture, SaaS |
| 3 | **`stick-story`** | Stick figures with expressive acting eyes, limb kinematics, room sets | "What would you do if...?", survival steps, life hacks, funny scenarios |
| 4 | **`cartoon-2d`** | 2D character reactions, flat vector cutaways, expressive body language | Storytelling, "what happens if", health, anatomy |
| 5 | **`3d-explainer`** | Three.js 3D meshes, orbiting camera paths, volumetric lighting | Futuristic tech, mystery, spatial dimensions, mechanics |
| 6 | **`infographics`** | Animated bar charts, donut percentage meters, KPI cards, statistics | Market data, finance, KPI reviews, comparative metrics |
| 7 | **`paper-cutout`** | Stop-motion paper textures, archival illustrations, timeline pins | History, documentaries, biographies, historical events |
| 8 | **`maps-geo`** | 3D/flat maps, animated flight routes, pulsating GPS radar pins | Travel routes, geopolitics, global trade, migrations |
| 9 | **`scientific-viz`** | 3D human body, glowing internal organs, DNA helices, molecular structures | Biology, medical science, human anatomy, physics |

---

## 3. Mandatory Creative Director Intake Workflow

Whenever the user asks you to create a video, ask for these creative choices cleanly (all at once):

```text
1. Format:
   • 9:16 Vertical (Shorts/Reels/TikTok)  |  16:9 Landscape (YouTube)

2. Visual Style:
   • Kinetic Typography · Tech Explainer · Stickman (stick-story) · 2D Cartoon
   • 3D Explainer · Infographics · Paper Cutout · Maps & Geo · Scientific Viz · Smart Auto-Mix

3. Color Theme & Mood:
   • Neon Cyber Dark · Editorial Documentary · Apple Minimal · Warm Paper · Matrix Terminal

4. Online Visual Assets (Cinematic Rule):
   • Yes/No — Auto-snap mentioned websites onto laptop screens, fetch company SVG logos,
     and pull real photos of famous people & topics!

5. Characters & Cinematic FX:
   • Character: None · Stickman Actor · 2D Cartoon Host
   • Cinematic FX: Film grain, vignette, whip-pan transitions, animated mouse cursor

6. Voiceover (7 Curated Human-Sounding Voices + 300+ custom IDs):
   • Andrew (Confident YouTube) · Steffan (Enthusiastic Shorts) · Brian ("What If" Narrator)
   • Christopher (Deep Cinema) · Ava (Expressive Female) · Ryan (British Tech) · Jamal (Arabic)
   • Or No Voiceover (captions-only)

7. SFX & Background Music:
   • SFX: Yes / No   |   Background Music: Yes / No
```

---

## 4. Project Structure

User-generated projects live inside `output/<project-name>/`:

```text
output/<project-name>/
├── script.json         # Title, format, voice, lines, captions, and cues
├── index.html          # Canvas & font loader
├── src/
│   ├── main.js         # Boot, rendering loop, camera punch, OP exports
│   ├── shots.js        # Shot definitions, keyframes, transitions
│   └── core/           # Lib, timing, captions, kit
├── data/
│   ├── lines.json      # Line timing
│   ├── words.json      # Word-level timestamp synchronization
│   ├── narration.wav   # Spoken audio track
│   ├── cues.json       # Sound effect cues
│   └── mix.wav         # Multiplexed soundtrack
└── renders/
    └── video.mp4       # Final rendered video
```

---

## 5. Execution Commands

```bash
# Interactive wizard
node bin/scenesin.mjs create
# or via Python
python scenesin.py create

# Preview live in browser at 60 FPS
node bin/scenesin.mjs preview output/<project-name>

# Verify frames and captions
node bin/scenesin.mjs check output/<project-name>

# Export contact sheet
node bin/scenesin.mjs sheet output/<project-name> review/all.jpg

# Render final MP4
node bin/scenesin.mjs render output/<project-name>
```

---

## 6. QA Checklist Before Delivery

1. **Aspect Ratio**: Are visual elements and text cards centered within the chosen format (9:16 or 16:9)?
2. **Word Sync**: Do caption reveals and visual highlights land precisely on the spoken word?
3. **No Collision**: Do subtitles avoid colliding with cards, labels, or top progress indicators?
4. **Clean Timing**: Does the video fade in and fade out smoothly without abrupt cuts?
