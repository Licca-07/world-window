import { useEffect, useRef } from 'react'

const TRACK = `${import.meta.env.BASE_URL}audio/smooth-like-jazz.mp3`
const FADE_MS = 1400
/** Keep the bed warm and night-friendly — cut sparkly highs. */
const LOWPASS_HZ = 2100

export const DEFAULT_VOLUME = 0.4

export function useBgm(active: boolean, volume: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const volumeRef = useRef(volume)
  const fadeFrameRef = useRef(0)
  const muted = volume <= 0.001

  useEffect(() => {
    volumeRef.current = volume
    const audio = audioRef.current
    if (audio && active && !muted && !audio.paused) {
      audio.volume = volume
    }
  }, [volume, active, muted])

  useEffect(() => {
    const audio = new Audio(TRACK)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0
    audio.crossOrigin = 'anonymous'
    audioRef.current = audio

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
