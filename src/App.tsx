import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import NowPlaying from './components/NowPlaying'
import AddToPlaylistModal from './components/AddToPlaylistModal'
import './App.css'

function AppContent() {
  const { showAddToPlaylistModal, setShowAddToPlaylistModal } = useApp()
  return (
    <>
      <div className="app">
        <Sidebar />
        <MainContent />
        <NowPlaying />
      </div>
      {showAddToPlaylistModal && (
        <AddToPlaylistModal
          track={showAddToPlaylistModal.track}
          onClose={() => setShowAddToPlaylistModal(null)}
        />
      )}
    </>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
