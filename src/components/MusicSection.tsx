import { useMemo, useRef } from 'react'
import { recentTracks } from '../data/tracks'
import { useApp } from '../context/AppContext'
import MusicCard from './MusicCard'
import './MusicSection.css'

export default function MusicSection() {
  const { searchQuery, selectedCategory } = useApp()
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

  const scrollCarousel = (direction: 'left' | 'right') => {
    const el = carouselRef.current
    if (!el) return
    const scrollAmount = 200
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="music-section">
      <div className="section-header">
        <div className="user-info">
          <div className="user-avatar" />
          <span className="user-name">AMANDA FERNANDES</span>
        </div>
        <div className="section-title-row">
          <h2 className="section-title">
            {searchQuery.trim()
              ? `Resultados para "${searchQuery}" (${filteredTracks.length})`
              : 'Ouvir de novo'}
          </h2>
          <div className="section-nav">
            <button
              className="nav-arrow"
              aria-label="Anterior"
              onClick={() => scrollCarousel('left')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            <button
              className="nav-arrow"
              aria-label="Próximo"
              onClick={() => scrollCarousel('right')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
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
          <p className="no-results">
            {searchQuery.trim()
              ? `Nenhum resultado para "${searchQuery}". Tente outro termo.`
              : 'Nenhuma música encontrada.'}
          </p>
        )}
      </div>
    </section>
  )
}
