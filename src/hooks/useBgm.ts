import { useEffect, useRef } from 'react'

const TRACKS = [
  'valley-sunset.mp3',
  'forest-mist-whispers.mp3',
  'vastness.mp3',
  'rest-now.mp3',
  'deep-meditation.mp3',
].map((file) => `${import.meta.env.BASE_URL}audio/${file}`)

const FADE_MS = 1400
const ADVANCE_PAD_S = 0.4
/** Keep the bed warm and night-friendly — cut sparkly highs. */
const LOWPASS_HZ = 1600

export const DEFAULT_VOLUME = 0.32

export function useBgm(active: boolean, volume: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const volumeRef = useRef(volume)
  const fadeFrameRef = useRef(0)
  const indexRef = useRef(0)
  const advancingRef = useRef(false)
  const muted = volume <= 0.001

  useEffect(() => {
    volumeRef.current = volume
    const audio = audioRef.current
    if (audio && active && !muted && !audio.paused) {
      audio.volume = volume
    }
  }, [volume, active, muted])

  useEffect(() => {
    indexRef.current = Math.floor(Math.random() * TRACKS.length)
    const audio = new Audio(TRACKS[indexRef.current])
    audio.loop = false
    audio.preload = 'auto'
    audio.volume = 0
    audio.crossOrigin = 'anonymous'
    audioRef.current = audio

    const advance = () => {
      if (advancingRef.current) return
      advancingRef.current = true
      indexRef.current = (indexRef.current + 1) % TRACKS.length
      audio.loop = false
      audio.src = TRACKS[indexRef.current]
      audio.load()
      audio.volume = volumeRef.current
      void audio.play().catch(() => {
        // Autoplay can still fail if the user gesture is lost; stay silent.
      })
      window.setTimeout(() => {
        advancingRef.current = false
      }, 800)
    }

    const onTimeUpdate = () => {
      const { duration, currentTime } = audio
      if (!Number.isFinite(duration) || duration < 1) return
      if (duration - currentTime <= ADVANCE_PAD_S) advance()
    }

    audio.addEventListener('ended', advance)
    audio.addEventListener('timeupdate', onTimeUpdate)

    const AudioCtx = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioCtx()
    ctxRef.current = ctx
    const source = ctx.createMediaElementSource(audio)
    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = LOWPASS_HZ
    lowpass.Q.value = 0.55
    const shelf = ctx.createBiquadFilter()
    shelf.type = 'highshelf'
    shelf.frequency.value = 2400
    shelf.gain.value = -7
    source.connect(lowpass)
    lowpass.connect(shelf)
    shelf.connect(ctx.destination)

    return () => {
      cancelAnimationFrame(fadeFrameRef.current)
      audio.removeEventListener('ended', advance)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.pause()
      audio.src = ''
      audioRef.current = null
      void ctx.close()
      ctxRef.current = null
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    const ctx = ctxRef.current
    if (!audio) return

    cancelAnimationFrame(fadeFrameRef.current)

    if (!active || muted) {
      audio.pause()
      audio.volume = 0
      return
    }

    void ctx?.resume()
    const play = audio.play()
    if (play) {
      play.catch(() => {
        // Autoplay can still fail if the user gesture is lost; stay silent.
      })
    }

    const from = audio.volume
    const started = performance.now()
    const fade = (now: number) => {
      const t = Math.min(1, (now - started) / FADE_MS)
      if (audioRef.current !== audio) return
      audio.volume = from + (volumeRef.current - from) * t
      if (t < 1) fadeFrameRef.current = requestAnimationFrame(fade)
    }
    fadeFrameRef.current = requestAnimationFrame(fade)

    return () => cancelAnimationFrame(fadeFrameRef.current)
  }, [active, muted])

  return { muted, volume }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}
