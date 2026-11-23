# CLAUDE.md for scenesin
Author: Anouar Zeklat (Instagram: @anouar.co | YouTube: https://www.youtube.com/@anouarzeklat)

`scenesin` is an open-source tool that creates motion graphic explainer videos from code and scripts in 9:16 and 16:9 formats across 8 visual styles.

## Built-In Free Motion Libraries
Available automatically inside any project via `/vendor/*` and `/node_modules/*`:
- `GSAP` (`/node_modules/gsap/index.js` + SplitText, MorphSVG, DrawSVG, MotionPath)
- `Anime.js` (`/vendor/anime.js`)
- `Rough.js` (`/vendor/rough.js` — hand-drawn sketchy canvas/SVG)
- `Mo.js` (`/vendor/mojs.js` — bursts, swirls, particle pops)
- `Three.js` (`/vendor/three.js` — 3D WebGL)
- `Manim` (`python scripts/manim_bridge.py` — optional `pip install manim`)
- `WhisperX` (optional forced alignment in `requirements-optional.txt`)

## Primary Commands
- Run interactive wizard: `node bin/scenesin.mjs create` or `python scenesin.py create`
- Preview in browser: `node bin/scenesin.mjs preview <project-folder>`
- Check frame integrity: `node bin/scenesin.mjs check <project-folder>`
- Render video: `node bin/scenesin.mjs render <project-folder>`

## 8 Visual Styles Available
1. `kinetic-typography` - Dynamic typography, neon highlights, counters
2. `tech-explainer` - Code editor, terminal, browser, API diagrams
3. `cartoon-2d` - 2D character reactions, flat vector cutaways
4. `3d-explainer` - Three.js 3D meshes, orbiting camera paths
5. `infographics` - Animated bar charts, donut percentage meters, KPI cards
6. `paper-cutout` - Paper textures, archival collage, timeline pins
7. `maps-geo` - Animated flight routes, geographic maps, GPS pins
8. `scientific-viz` - 3D body with glowing organs, DNA, molecular bonds

## User Request Guidelines
When a user asks to make a video:
1. Always ask them for:
   - Format: `9:16` or `16:9`
   - Style: One of the 8 styles (or Auto-Mix)
   - Voiceover: Yes/No (and voice preference)
   - SFX: Yes/No
   - Background Music: Yes/No
2. Projects are created in `output/<project-name>/` (which starts empty with `.gitkeep`).
3. Never force massive 1GB model downloads; use `estimate.py` or Edge-TTS by default.

