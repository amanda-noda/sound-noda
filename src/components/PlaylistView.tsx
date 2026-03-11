import { recentTracks } from '../data/tracks'
import { useApp } from '../context/AppContext'
import MusicCard from './MusicCard'
import './PlaylistView.css'

export default function PlaylistView() {
  const { playlists, selectedPlaylistId, playFromQueue } = useApp()
  const playlist = playlists.find((p) => p.id === selectedPlaylistId)
  const tracks = playlist
    ? playlist.trackIds
        .map((id) => recentTracks.find((t) => t.id === id))
        .filter((t): t is NonNullable<typeof t> => t != null)
    : []

  if (!selectedPlaylistId || !playlist) return null

  return (
    <section className="playlist-view">
      <div className="playlist-header">
        <div>
          <h2 className="playlist-view-title">{playlist.title}</h2>
          <p className="playlist-view-subtitle">{playlist.subtitle}</p>
        </div>
        {tracks.length > 0 && (
          <button className="play-all-btn" onClick={() => playFromQueue(tracks, 0)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Tocar tudo
          </button>
        )}
      </div>
      {tracks.length > 0 ? (
        <div className="playlist-grid">
          {tracks.map((track) => (
            <MusicCard key={track.id} track={track} />
          ))}
        </div>
      ) : (
        <div className="playlist-empty">
          <p>Esta playlist está vazia.</p>
          <p className="hint">Use "Adicionar à playlist" nas músicas para adicionar faixas.</p>
        </div>
      )}
    </section>
  )
}
