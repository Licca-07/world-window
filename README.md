# World Window

Public YouTube live cameras — cities and nature — rotating every 45 seconds.

**Live:** https://world-window.vercel.app

GitHub Pages mirror: https://licca-07.github.io/world-window/

## Scripts

```bash
npm install
npm run dev      # local server
npm run build    # production build
npm run preview  # preview production build
```

## Music

A quiet five-song Mixkit loop plays after you open the window (cameras stay muted). Adjust the volume slider on the start screen or top-right.

Tracks, under the [Mixkit License](https://mixkit.co/license/#musicFree): [Valley Sunset](https://mixkit.co/free-stock-music/valley-sunset-127/), [Forest Mist Whispers](https://mixkit.co/free-stock-music/forest-mist-whispers-148/), [Vastness](https://mixkit.co/free-stock-music/vastness-184/), [Rest Now](https://mixkit.co/free-stock-music/rest-now-584/), [Deep Meditation](https://mixkit.co/free-stock-music/deep-meditation-109/). A gentle low-pass keeps it night-friendly.

## Customize cameras

Edit `src/data/cameras.ts`. Prefer **single-location** streams (e.g. EarthCam). Multi-city mashups often keep one title while the picture jumps between places, so labels drift.
