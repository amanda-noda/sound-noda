import { useApp } from '../context/AppContext'
import type { View } from '../context/AppContext'
import './Sidebar.css'

const navItems: { view: View; label: string; icon: string }[] = [
  { view: 'inicio', label: 'Início', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
  { view: 'explorar', label: 'Explorar', icon: 'M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z' },
  { view: 'biblioteca', label: 'Biblioteca', icon: 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z' },
]

export default function Sidebar() {
  const {
    sidebarCollapsed,
    toggleSidebar,
    currentView,
    setCurrentView,
    playlists,
    addPlaylist,
    selectedPlaylistId,
    selectPlaylist,
    showToast,
  } = useApp()

  const handleNewPlaylist = () => {
    const title = prompt('Nome da playlist:')
    if (title !== null) {
      addPlaylist(title)
      showToast('Playlist criada')
    }
  }

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="menu-btn" onClick={toggleSidebar} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        {!sidebarCollapsed && (
          <div className="logo">
            <span>Sound Noda</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ view, label, icon }) => (
          <button
            key={view}
            className={`nav-item ${currentView === view ? 'active' : ''}`}
            onClick={() => setCurrentView(view)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d={icon}/>
            </svg>
            {!sidebarCollapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {!sidebarCollapsed && (
        <>
          <button className="new-playlist-btn" onClick={handleNewPlaylist}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <span>Nova playlist</span>
          </button>

          <div className="playlists-section">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                className={`playlist-item ${selectedPlaylistId === playlist.id ? 'active' : ''}`}
                onClick={() => selectPlaylist(selectedPlaylistId === playlist.id ? null : playlist.id)}
              >
                <span className="playlist-title">{playlist.title}</span>
                <span className="playlist-subtitle">{playlist.subtitle}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </aside>
  )
}
