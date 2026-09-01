import { useEffect, useRef } from 'react'
import { loadYouTubeApi } from '../lib/youtube'

type YoutubePlayerProps = {
  videoId: string
  onReady?: () => void
  onError?: () => void
}

export function YoutubePlayer({ videoId, onReady, onError }: YoutubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YT.Player | null>(null)
  const readyRef = useRef(false)
  const videoIdRef = useRef(videoId)
  const onReadyRef = useRef(onReady)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onReadyRef.current = onReady
    onErrorRef.current = onError
  }, [onReady, onError])

  useEffect(() => {
    videoIdRef.current = videoId
  }, [videoId])

  useEffect(() => {
    let cancelled = false
    const initialId = videoIdRef.current

    loadYouTubeApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT) return

      playerRef.current = new window.YT.Player(containerRef.current, {
        width: '100%',
        height: '100%',
        videoId: initialId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          fs: 0,
          iv_load_policy: 3,
          disablekb: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            readyRef.current = true
            const latest = videoIdRef.current
            if (latest !== initialId) {
              event.target.loadVideoById({ videoId: latest })
            }
            event.target.mute()
            event.target.playVideo()
            onReadyRef.current?.()
          },
          onError: () => {
            onErrorRef.current?.()
          },
          onStateChange: (event) => {
            const { data, target } = event
            if (
              data === window.YT!.PlayerState.CUED ||
              data === window.YT!.PlayerState.UNSTARTED ||
              data === window.YT!.PlayerState.PAUSED
            ) {
              target.mute()
              target.playVideo()
            }
          },
        },
      })
    })

    return () => {
      cancelled = true
      readyRef.current = false
      try {
        playerRef.current?.destroy()
      } catch {
        // ignore
      }
      playerRef.current = null
    }
  }, [])

  useEffect(() => {
    const player = playerRef.current
    if (!player || !readyRef.current) return
    try {
      player.loadVideoById({ videoId })
      player.mute()
      player.playVideo()
    } catch {
      onErrorRef.current?.()
    }
  }, [videoId])

  return (
    <div className="player-wrap">
      <div className="player-host" ref={containerRef} />
      <div className="player-shield" aria-hidden />
    </div>
  )
}
