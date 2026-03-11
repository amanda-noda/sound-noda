import { recentTracks } from '../data/tracks'
import { useApp } from '../context/AppContext'
import MusicCard from './MusicCard'
import './LibraryView.css'

export default function LibraryView() {
  const { likedTrackIds, playFromQueue } = useApp()
  const likedTracks = recentTracks.filter((t) => likedTrackIds.has(t.id))

  return (
    <section className="library-view">
      <div className="library-header">
        <h2 className="library-title">Músicas curtidas</h2>
        {likedTracks.length > 0 && (
          <button className="play-all-btn" onClick={() => playFromQueue(likedTracks, 0)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Tocar tudo
          </button>
        )}
      </div>
      {likedTracks.length > 0 ? (
        <div className="library-grid">
          {likedTracks.map((track) => (
            <MusicCard key={track.id} track={track} />
          ))}
        </div>
      ) : (
        <div className="library-empty">
          <p>Você ainda não curtiu nenhuma música.</p>
          <p className="hint">Clique no ícone de coração nas músicas ou no player para curtir.</p>
        </div>
      )}
    </section>
  )
}
