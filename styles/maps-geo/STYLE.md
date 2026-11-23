# Maps & Geography Style Guide (scenesin)
Author: Anouar Zeklat (Instagram: @anouar.co)

Cinematic, geographic visual storytelling featuring vector map projections, glowing route curves, pulsating GPS radar pins, and continental highlight zones.

## 1. Visual Aesthetics
- **Color Palette**: Deep maritime ocean `#0B132B`, slate continent masses `#1C2541`, neon flight route `#F72585`, radar cyan glow `#4CC9F0`, waypoint gold `#FFD166`.
- **Motion**: Bezier quadratic flight curve progression, plane heading indicators, and radar pulse waves.

## 2. Formats Supported
- `9:16` (1080x1920) for geopolitical reels and travel history shorts.
- `16:9` (1920x1080) for documentary maps, global supply chain breakdowns, and geopolitical analysis.

## 3. Key Components
- `K.geoMapBackground(t)`: Vector map grid and continental basemaps.
- `K.locationPin({ x, y, label, sub, color, t })`: Pulsating GPS radar pin and coordinate tag.
- `K.flightRoute({ from, to, t, d, color })`: Smooth animated flight arc.
