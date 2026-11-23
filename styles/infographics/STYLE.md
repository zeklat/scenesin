# Infographic & Data Visualization Style Guide (scenesin)
Author: Anouar Zeklat (Instagram: @anouar.co)

Data-driven visual storytelling featuring animated bar charts, circular percentage donut meters, executive KPI metric cards, and comparative statistics.

## 1. Visual Aesthetics
- **Color Palette**: Modern FinTech & SaaS palette. Deep Navy/Slate `#0F172A`, Card Background `#1E293B`, Sky Blue `#38BDF8`, Indigo `#818CF8`, Rose `#F43F5E`, Emerald Green `#10B981`, Amber `#FBBF24`.
- **Motion**: Spring-based chart column expansions, progressive circular arc fills, and animated counter numbers.

## 2. Formats Supported
- `9:16` (1080x1920) for statistical reels, financial shorts, and TikTok data breakdowns.
- `16:9` (1920x1080) for executive dashboards, investor pitch decks, and YouTube video essays.

## 3. Key Components
- `K.kpiCard({ x, y, w, h, title, value, change, isPositive, t })`: Clean metric card with percentage delta badges.
- `K.barChart({ x, y, w, h, title, items, t, d })`: Multi-series animated rising bar graph with auto-scaled columns.
- `K.donutChart({ x, y, r, percent, label, color, t, d })`: Circular percentage fill gauge with glowing rim.

