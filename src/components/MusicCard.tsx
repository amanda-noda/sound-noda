import type { Track } from '../data/tracks'
import { useApp } from '../context/AppContext'
import './MusicCard.css'

interface MusicCardProps {
  track: Track
}

export default function MusicCard({ track }: MusicCardProps) {
  const { nowPlaying, isPlaying, playTrack } = useApp()
  const isCurrentTrack = nowPlaying?.id === track.id

  return (
    <div className="music-card">
      <div className="card-cover">
        <img src={track.coverUrl} alt={track.title} />
        <button
          className="play-overlay"
          aria-label={`Tocar ${track.title}`}
          onClick={() => playTrack(track)}
        >
          {isCurrentTrack && isPlaying ? (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      </div>
      <h3 className="card-title">{track.title}</h3>
      <p className="card-meta">
        {track.type} • {track.artist}
        {track.views && ` • ${track.views}`}
      </p>
    </div>
  )
}
