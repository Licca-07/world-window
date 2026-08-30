# World Window

Public YouTube live cameras — cities and nature — rotating every 45 seconds.

**Live:** https://licca-07.github.io/world-window/

## Scripts

```bash
npm install
npm run dev      # local server
npm run build    # production build
npm run preview  # preview production build
```

## Music

A quiet lofi loop plays after you open the window (cameras stay muted). Adjust the volume slider on the start screen or top-right.

Track: [Smooth Like Jazz](https://mixkit.co/free-stock-music/smooth-like-jazz-24/) from Mixkit, used under the [Mixkit License](https://mixkit.co/license/#musicFree). A gentle low-pass keeps it night-friendly.

## Customize cameras

Edit `src/data/cameras.ts`. Prefer **single-location** streams (e.g. EarthCam). Multi-city mashups often keep one title while the picture jumps between places, so labels drift.
