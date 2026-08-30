import { useEffect, useMemo, useState } from 'react'
import {
  cameras,
  INTERVAL_MS,
  type Camera,
  type CameraCategory,
} from './data/cameras'
import { formatLocalDate, formatLocalTime, shuffle } from './lib/time'
import { YoutubePlayer } from './components/YoutubePlayer'
import { VolumePicker } from './components/VolumePicker'
import { DEFAULT_VOLUME, useBgm } from './hooks/useBgm'
import './App.css'

type Filter = 'all' | CameraCategory

function filterCameras(list: Camera[], filter: Filter): Camera[] {
  if (filter === 'all') return list
  return list.filter((c) => c.category === filter)
}

export default function App() {
  const [filter, setFilter] = useState<Filter>('all')
  const [queue, setQueue] = useState<Camera[]>(() => shuffle(cameras))
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [started, setStarted] = useState(false)
  const [remainingMs, setRemainingMs] = useState(INTERVAL_MS)
  const [now, setNow] = useState(() => new Date())
  const [placeKey, setPlaceKey] = useState(0)
  const [failedIds, setFailedIds] = useState<Set<string>>(() => new Set())
  const [volume, setVolume] = useState(DEFAULT_VOLUME)
  useBgm(started, volume)

  const filtered = useMemo(() => filterCameras(cameras, filter), [filter])

  useEffect(() => {
    const next = shuffle(filtered)
    setQueue(next.length ? next : shuffle(cameras))
    setIndex(0)
    setRemainingMs(INTERVAL_MS)
    setFailedIds(new Set())
    setPlaceKey((k) => k + 1)
  }, [filtered])

  const current = queue[index % Math.max(queue.length, 1)] ?? cameras[0]
  const progress = 1 - remainingMs / INTERVAL_MS

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!started || paused || !current) return

    const tick = window.setInterval(() => {
      setRemainingMs((ms) => {
        if (ms <= 250) {
          setIndex((i) => {
            const nextIndex = (i + 1) % queue.length
            setPlaceKey((k) => k + 1)
            return nextIndex
          })
          return INTERVAL_MS
        }
        return ms - 250
      })
    }, 250)

    return () => window.clearInterval(tick)
  }, [started, paused, current, queue.length])

  const skip = () => {
    if (queue.length <= 1) {
      setRemainingMs(INTERVAL_MS)
      return
    }
    setIndex((i) => (i + 1) % queue.length)
    setRemainingMs(INTERVAL_MS)
    setPlaceKey((k) => k + 1)
  }

  const onError = () => {
    if (!current) return
    setFailedIds((prev) => {
      const next = new Set(prev)
      next.add(current.id)
      return next
    })
    // Advance past the broken stream; skip known failures when possible
    setIndex((i) => {
      if (queue.length <= 1) return i
      let next = (i + 1) % queue.length
      let guard = 0
      while (
        (queue[next]?.id === current.id || failedIds.has(queue[next]?.id)) &&
        guard < queue.length
      ) {
        next = (next + 1) % queue.length
        guard += 1
      }
      return next
    })
    setRemainingMs(INTERVAL_MS)
    setPlaceKey((k) => k + 1)
  }

  if (!started) {
    return (
      <div className="gate">
        <div className="gate-atmosphere" aria-hidden />
        <header className="gate-brand">
          <p className="brand-mark">World Window</p>
          <h1>Look out onto the living planet.</h1>
          <p className="gate-lede">
            Public live cameras — cities and wild places — rotate every 45
            seconds. Quiet music starts when you open.
          </p>
          <VolumePicker value={volume} onChange={setVolume} />
          <button type="button" className="primary" onClick={() => setStarted(true)}>
            Open the window
          </button>
        </header>
      </div>
    )
  }

  return (
    <div className="stage">
      <div className="video-plane" aria-hidden={!current}>
        <YoutubePlayer
          videoId={current.videoId}
          onError={onError}
        />
      </div>

      <header className="top-bar">
        <p className="brand-mark">World Window</p>
        <div className="top-actions">
          <div className="filters" role="group" aria-label="Camera type">
            {(
              [
                ['all', 'All'],
                ['city', 'City'],
                ['nature', 'Nature'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={filter === value ? 'chip is-active' : 'chip'}
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
              >
                {label}
              </button>
            ))}
          </div>
          <VolumePicker value={volume} onChange={setVolume} />
        </div>
      </header>

      <footer className="bottom-bar">
        <div key={placeKey} className="place-block">
          <p className="place-category">{current.category}</p>
          <h2 className="place-name">
            <a
              href={`https://www.youtube.com/watch?v=${current.videoId}`}
              target="_blank"
              rel="noreferrer"
            >
              {current.name}
            </a>
          </h2>
          <p className="place-meta">
            {current.place}
            {current.country !== 'Space' ? `, ${current.country}` : ''}
          </p>
        </div>

        <div className="clock-block">
          <p className="local-label">Local time</p>
          <p className="local-time">{formatLocalTime(current.timezone, now)}</p>
          <p className="local-date">{formatLocalDate(current.timezone, now)}</p>
        </div>

        <div className="controls">
          <button
            type="button"
            className="ghost"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button type="button" className="ghost" onClick={skip}>
            Next
          </button>
          <div
            className="progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-label="Time until next camera"
          >
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>
          <p className="countdown">
            {paused ? 'Paused' : `${Math.ceil(remainingMs / 1000)}s`}
          </p>
        </div>
      </footer>
    </div>
  )
}
