import { useState, useRef, useEffect } from 'react'
import type { Track } from '../data/tracks'
import { formatDuration } from '../data/tracks'
import { useApp } from '../context/AppContext'
import './MusicCard.css'

interface MusicCardProps {
  track: Track
}

export default function MusicCard({ track }: MusicCardProps) {
  const {
    nowPlaying,
    isPlaying,
    playTrack,
    addToQueue,
    addToQueueNext,
    toggleLike,
    isLiked,
    setShowAddToPlaylistModal,
  } = useApp()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isCurrentTrack = nowPlaying?.id === track.id

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

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
      <div className="card-actions" ref={menuRef}>
        <button
          className="card-action-btn"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Mais opções"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
        {showMenu && (
          <div className="card-context-menu">
            <button onClick={() => { playTrack(track); setShowMenu(false); }}>
              Tocar
            </button>
            <button onClick={() => { addToQueueNext(track); setShowMenu(false); }}>
              Tocar em seguida
            </button>
            <button onClick={() => { addToQueue(track); setShowMenu(false); }}>
              Adicionar à fila
            </button>
            <button onClick={() => { setShowAddToPlaylistModal({ track }); setShowMenu(false); }}>
              Adicionar à playlist
            </button>
            <button onClick={() => { toggleLike(track.id); setShowMenu(false); }}>
              {isLiked(track.id) ? 'Remover dos curtidos' : 'Curtir'}
            </button>
          </div>
        )}
      </div>
      <h3 className="card-title">{track.title}</h3>
      <p className="card-meta">
        {track.artist}
        {(track.durationFormatted ?? (track.duration ? formatDuration(track.duration) : null)) && (
          <> • {track.durationFormatted ?? formatDuration(track.duration!)}</>
        )}
        {track.views && ` • ${track.views}`}
      </p>
    </div>
  )
}
