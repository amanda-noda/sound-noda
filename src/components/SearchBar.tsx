import { useApp } from '../context/AppContext'
import { useEffect, useRef } from 'react'
import './SearchBar.css'

export default function SearchBar() {
  const {
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    showCastingModal,
    setShowCastingModal,
    showProfileDropdown,
    setShowProfileDropdown,
    showToast,
  } = useApp()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [setShowProfileDropdown])

  return (
    <header className="search-bar">
      <div className="search-input-wrapper">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input
          type="search"
          placeholder="Pesquise músicas, álbuns, artistas, podcasts"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSelectedCategory(null)}
          onKeyDown={(e) => e.key === 'Escape' && setSearchQuery('')}
          autoComplete="off"
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setSearchQuery('')}
            aria-label="Limpar pesquisa"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        )}
      </div>
      <div className="header-actions">
        <button
          className="icon-btn"
          aria-label="Casting"
          onClick={() => setShowCastingModal(true)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zm0-4v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z"/>
          </svg>
        </button>
        <div className="avatar-wrapper" ref={dropdownRef}>
          <button
            className="avatar-btn"
            aria-label="Perfil"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="avatar" />
          </button>
          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="avatar avatar-lg" />
                <span>amanda fernandes</span>
              </div>
              <button
                className="dropdown-item"
                onClick={() => {
                  setShowProfileDropdown(false)
                  showToast('Configurações da conta')
                }}
              >
                Conta
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  setShowProfileDropdown(false)
                  showToast('Editar perfil')
                }}
              >
                Perfil
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  setShowProfileDropdown(false)
                  showToast('Você saiu da sua conta')
                }}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>

      {showCastingModal && (
        <div className="modal-overlay" onClick={() => setShowCastingModal(false)}>
          <div className="casting-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Conectar a um dispositivo</h3>
            <p>Nenhum dispositivo encontrado.</p>
            <p className="casting-hint">Certifique-se de que seu Chromecast, TV ou alto-falante está ligado.</p>
            <button className="modal-close" onClick={() => setShowCastingModal(false)}>Fechar</button>
          </div>
        </div>
      )}
    </header>
  )
}
