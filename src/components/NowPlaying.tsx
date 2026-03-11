import { useApp } from '../context/AppContext'
import './NowPlaying.css'

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function NowPlaying() {
  const {
    nowPlaying,
    isPlaying,
    progress,
    duration,
    volume,
    shuffle,
    repeat,
    togglePlayPause,
    previousTrack,
    nextTrack,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
  } = useApp()

  if (!nowPlaying) return null

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0

  return (
    <footer className="now-playing">
      <div className="now-playing-track">
        <img src={nowPlaying.coverUrl} alt={nowPlaying.title} className="now-playing-cover" />
        <div className="now-playing-info">
          <span className="now-playing-title">{nowPlaying.title}</span>
          <span className="now-playing-artist">{nowPlaying.artist}</span>
        </div>
        <button
          className={`like-btn ${isLiked(nowPlaying.id) ? 'liked' : ''}`}
          onClick={() => toggleLike(nowPlaying.id)}
          aria-label={isLiked(nowPlaying.id) ? 'Descurtir' : 'Curtir'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked(nowPlaying.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="now-playing-controls">
        <div className="control-buttons">
          <button
            className={`control-btn ${shuffle ? 'active' : ''}`}
            onClick={toggleShuffle}
            aria-label="Embaralhar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
            </svg>
          </button>
          <button className="control-btn prev" onClick={previousTrack} aria-label="Anterior">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          <button
            className="play-pause-btn"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pausar' : 'Tocar'}
          >
            {isPlaying ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          <button className="control-btn next" onClick={nextTrack} aria-label="Próxima">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
          <button
            className={`control-btn ${repeat !== 'off' ? 'active' : ''}`}
            onClick={toggleRepeat}
            aria-label="Repetir"
            title={repeat === 'one' ? 'Repetir uma' : repeat === 'all' ? 'Repetir todas' : 'Repetir'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            </svg>
            {repeat === 'one' && <span className="repeat-one">1</span>}
          </button>
        </div>
        <div className="progress-container">
          <span className="progress-time">{formatTime(progress)}</span>
          <div
            className="progress-bar"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const percent = (e.clientX - rect.left) / rect.width
              seek(percent * duration)
            }}
          >
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="progress-time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="now-playing-volume">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="volume-slider"
        />
      </div>
    </footer>
  )
}
