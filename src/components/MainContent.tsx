import SearchBar from './SearchBar'
import Categories from './Categories'
import MusicSection from './MusicSection'
import './MainContent.css'

export default function MainContent() {
  return (
    <main className="main-content">
      <SearchBar />
      <div className="content-scroll">
        <Categories />
        <MusicSection />
      </div>
    </main>
  )
}
