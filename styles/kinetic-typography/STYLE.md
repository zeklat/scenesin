# Kinetic Typography Style Guide (scenesin)
Author: Anouar Zeklat (Instagram: @anouar.co)

High-energy, typography-driven explainer videos. Bold title cards, animated spring physics, word-by-word highlights, and metric counters.

## 1. Look & Feel
- **Palette**: Dark cyber aesthetic. Primary Cyan `#00F0FF`, Secondary Pink `#FF0055`, Accent Yellow `#FFE600`, Acid Green `#00FFA3`, Deep Background `#0A0C10`, Card Background `#141822`.
- **Typography**: Inter 900 (Black) for high-impact titles and captions.
- **Accents**: Neon glow pills behind keywords, floating badges, cyber grid background.

## 2. Formats Supported
- `9:16` (1080x1920) for TikTok, Reels, YouTube Shorts.
- `16:9` (1920x1080) for YouTube Longform, presentations, website embeds.

## 3. Key Components
- `K.titleCard({ title, subtitle, tag, color, t, d })`: Main headline card with tag pill and smooth overshoot.
- `K.statCounter({ value, label, prefix, suffix, color, t, d })`: Animated counting numbers.
- `K.floatingBadge({ text, x, y, angle, color, t })`: Dynamic floating pill tag.
- `K.progressBar(t, dur)`: Top progress bar indicating video progression.
- `K.gridBackground(t)`: Subtle moving background grid.

