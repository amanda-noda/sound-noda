import { useMemo, useRef } from 'react'
import { recentTracks } from '../data/tracks'
import { useApp } from '../context/AppContext'
import MusicCard from './MusicCard'
import './MusicSection.css'

export default function MusicSection() {
  const { searchQuery, selectedCategory, playFromQueue } = useApp()
  const carouselRef = useRef<HTMLDivElement>(null)

  const filteredTracks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return recentTracks.filter((track) => {
      const matchesSearch =
        !query ||
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query) ||
        (track.category?.toLowerCase().includes(query) ?? false)
      const matchesCategory =
        !selectedCategory || track.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const scrollCarousel = (direction: 'left' | 'right') => {
    const el = carouselRef.current
    if (!el) return
    const scrollAmount = 280
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="music-section">
      <div className="hero-welcome">
        <h1 className="hero-title">
          {searchQuery.trim() ? 'Resultados da busca' : getGreeting()}
        </h1>
        <p className="hero-subtitle">
          {searchQuery.trim()
            ? `${filteredTracks.length} ${filteredTracks.length === 1 ? 'música encontrada' : 'músicas encontradas'}`
            : 'Continue de onde parou ou descubra algo novo'}
        </p>
      </div>

      <div className="section-block">
        <div className="section-header">
          <h2 className="section-title">
            {searchQuery.trim()
              ? `"${searchQuery}"`
              : 'Ouvir de novo'}
          </h2>
          <div className="section-actions">
            {filteredTracks.length > 0 && (
              <button
                className="play-all-btn"
                onClick={() => playFromQueue(filteredTracks, 0)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Tocar tudo
              </button>
            )}
            <div className="section-nav">
              <button
                className="nav-arrow"
                aria-label="Anterior"
                onClick={() => scrollCarousel('left')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              <button
                className="nav-arrow"
                aria-label="Próximo"
                onClick={() => scrollCarousel('right')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="tracks-carousel" ref={carouselRef}>
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track) => (
              <MusicCard key={track.id} track={track} />
            ))
          ) : (
            <div className="no-results">
              <div className="no-results-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <p>
                {searchQuery.trim()
                  ? `Nenhum resultado para "${searchQuery}"`
                  : 'Nenhuma música encontrada'}
              </p>
              <span className="no-results-hint">Tente outra busca ou explore as categorias</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
