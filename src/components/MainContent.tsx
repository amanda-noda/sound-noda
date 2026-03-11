import SearchBar from './SearchBar'
import Categories from './Categories'
import MusicSection from './MusicSection'
import LibraryView from './LibraryView'
import PlaylistView from './PlaylistView'
import { useApp } from '../context/AppContext'
import './MainContent.css'

export default function MainContent() {
  const { currentView, selectedPlaylistId } = useApp()

  return (
    <main className="main-content">
      <SearchBar />
      <div className="content-scroll">
        <Categories />
        {selectedPlaylistId ? (
          <PlaylistView />
        ) : currentView === 'biblioteca' ? (
          <LibraryView />
        ) : (
          <MusicSection />
        )}
      </div>
    </main>
  )
}
