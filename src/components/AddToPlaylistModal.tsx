import { useApp } from '../context/AppContext'
import type { Track } from '../data/tracks'
import './AddToPlaylistModal.css'

interface AddToPlaylistModalProps {
  track: Track
  onClose: () => void
}

export default function AddToPlaylistModal({ track, onClose }: AddToPlaylistModalProps) {
  const { playlists, addTrackToPlaylist, showToast } = useApp()

  const playlistsWithTrack = new Set(
    playlists.filter((p) => p.trackIds.includes(track.id)).map((p) => p.id)
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-to-playlist-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Adicionar à playlist</h3>
        <p className="track-name">{track.title}</p>
        <div className="playlist-list">
          {playlists.map((playlist) => {
            const isInPlaylist = playlistsWithTrack.has(playlist.id)
            return (
              <button
                key={playlist.id}
                className="playlist-option"
                onClick={() => {
                  if (isInPlaylist) return
                  addTrackToPlaylist(playlist.id, track.id)
                  showToast(`Adicionado a ${playlist.title}`)
                  onClose()
                }}
              >
                <span>{playlist.title}</span>
                {isInPlaylist && <span className="check">✓</span>}
              </button>
            )
          })}
        </div>
        <button className="modal-close" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  )
}
