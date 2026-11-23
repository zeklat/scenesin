---
name: scenesin
description: Create viral motion graphic explainer videos from code and scripts in 9:16 (Shorts/Reels/TikTok) and 16:9 (YouTube) across 8 visual styles. Free local or cloud AI voice, word-synced subtitles, SFX, and ducked background music, rendered to MP4 with 0 dropped frames. Created by Anouar Zeklat (@anouar.co).
---

# scenesin

> **Author**: Anouar Zeklat (Instagram: [@anouar.co](https://instagram.com/anouar.co) • YouTube: [@anouarzeklat](https://www.youtube.com/@anouarzeklat))  
> **Repository**: `scenesin`

Create finished motion graphic explainer videos completely in code on your computer: script, voiceover narration, word-level synchronized typography, procedural animation, sound effects, and music, rendered to crisp MP4.

**Everything is code**: HTML Canvas / SVG, Chromium headless rendering, Three.js 3D meshes, procedural audio synthesis, and FFmpeg multiplexing. No paid AI video APIs, no subscription fees, no credit limits.

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
| 3 | **`cartoon-2d`** | 2D character reactions, flat vector cutaways, expressive body language | Storytelling, "what happens if", health, life habits |
| 4 | **`3d-explainer`** | Three.js 3D meshes, orbiting camera paths, volumetric lighting | Futuristic tech, mystery, spatial dimensions, mechanics |
| 5 | **`infographics`** | Animated bar charts, donut percentage meters, KPI cards, statistics | Market data, finance, KPI reviews, comparative metrics |
| 6 | **`paper-cutout`** | Stop-motion paper textures, archival illustrations, timeline pins | History, documentaries, biographies, historical events |
| 7 | **`maps-geo`** | 3D/flat maps, animated flight routes, pulsating GPS radar pins | Travel routes, geopolitics, global trade, migrations |
| 8 | **`scientific-viz`** | 3D human body, glowing internal organs, DNA helices, molecular structures | Biology, medical science, human anatomy, physics |

---

## 3. Mandatory User Intake Workflow

Whenever the user asks you to create a video, you MUST ask for these 5 options:

```text
1. Format:
   • 9:16 Vertical (Shorts/Reels/TikTok)
   • 16:9 Landscape (YouTube)

2. Visual Style:
   • Kinetic Typography
   • Technology / Software Explainer
   • 2D Cartoon Animation
   • 3D Explainer
   • Infographic / Data Visualization
   • Documentary / Paper Cutout
   • Maps / Geography
   • Scientific Visualization
   • Smart Auto-Mix

3. Voiceover Narration:
   • Yes (Pick a voice: Guy, Jenny, Aria, Ryan, Sonia, Michael, Heart)
   • No (Captions-only kinetic mode)

4. Sound Effects (SFX):
   • Yes (Synchronized whooshes, pops, typing clicks)
   • No

5. Background Music:
   • Yes (Lo-Fi, Synthwave, Cinematic with auto-ducking)
   • No
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
