import { useApp } from '../context/AppContext'
import './NowPlaying.css'

export default function NowPlaying() {
  const { nowPlaying, isPlaying, togglePlayPause } = useApp()

  if (!nowPlaying) return null

  return (
    <footer className="now-playing">
      <div className="now-playing-track">
        <img src={nowPlaying.coverUrl} alt={nowPlaying.title} className="now-playing-cover" />
        <div className="now-playing-info">
          <span className="now-playing-title">{nowPlaying.title}</span>
          <span className="now-playing-artist">{nowPlaying.artist}</span>
        </div>
      </div>
      <div className="now-playing-controls">
        <button
          className="play-pause-btn"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pausar' : 'Tocar'}
        >
          {isPlaying ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      </div>
      <div className="now-playing-placeholder" />
    </footer>
  )
}
