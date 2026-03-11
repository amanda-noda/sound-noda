import { useEffect, useRef } from 'react'
import YouTube from 'react-youtube'
import './YouTubePlayer.css'

interface YouTubePlayerProps {
  videoId: string | null
  isPlaying: boolean
  volume: number
  progress: number
  onReady: (player: YT.Player) => void
  onStateChange: (state: number) => void
  onProgress: (currentTime: number, duration: number) => void
}

export default function YouTubePlayer({
  videoId,
  isPlaying,
  volume,
  onReady,
  onStateChange,
  onProgress,
}: YouTubePlayerProps) {
  const playerRef = useRef<YT.Player | null>(null)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const player = playerRef.current
    if (!player) return
    player.setVolume(Math.round(volume * 100))
  }, [volume])

  useEffect(() => {
    const player = playerRef.current
    if (!player || !videoId) return
    if (isPlaying) {
      player.playVideo()
    } else {
      player.pauseVideo()
    }
  }, [isPlaying, videoId])

  const handleReady = (event: { target: YT.Player }) => {
    playerRef.current = event.target
    onReady(event.target)
    if (isPlaying) {
      event.target.playVideo()
    }
  }

  const handleStateChange = (event: { data: number }) => {
    onStateChange(event.data)
    if (event.data === YT.PlayerState.PLAYING) {
      progressIntervalRef.current = setInterval(() => {
        const player = playerRef.current
        if (player && typeof player.getCurrentTime === 'function') {
          const current = player.getCurrentTime()
          const duration = player.getDuration()
          if (duration > 0) onProgress(current, duration)
        }
      }, 500)
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }
  }

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  if (!videoId) return null

  return (
    <div className="youtube-player-hidden">
      <YouTube
        key={videoId}
        videoId={videoId}
        opts={{
          width: '1',
          height: '1',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
          },
        }}
        onReady={handleReady}
        onStateChange={handleStateChange}
      />
    </div>
  )
}
