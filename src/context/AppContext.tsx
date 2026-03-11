import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react'
import type { Track } from '../data/tracks'

export type View = 'inicio' | 'explorar' | 'biblioteca'

export interface Playlist {
  id: string
  title: string
  subtitle: string
}

interface AppContextType {
  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  currentView: View
  setCurrentView: (view: View) => void
  playlists: Playlist[]
  addPlaylist: (title: string) => void
  selectedPlaylistId: string | null
  selectPlaylist: (id: string | null) => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Categories
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void

  // Player
  nowPlaying: Track | null
  isPlaying: boolean
  playTrack: (track: Track) => void
  togglePlayPause: () => void

  // UI
  showCastingModal: boolean
  setShowCastingModal: (show: boolean) => void
  showProfileDropdown: boolean
  setShowProfileDropdown: (show: boolean) => void
}

const AppContext = createContext<AppContextType | null>(null)

const DEMO_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentView, setCurrentView] = useState<View>('inicio')
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: '1', title: 'Música marcada como "G..."', subtitle: 'Playlist automática' },
    { id: '2', title: 'Recap de junho a agosto d...', subtitle: 'Ideal para amanda fernandes' },
    { id: '3', title: 'Música pra cantar e beber', subtitle: 'amanda fernandes' },
    { id: '4', title: 'Melhores Músicas Interna...', subtitle: '#RealMusic: 2025 Songs' },
    { id: '5', title: 'Eu e eu', subtitle: 'amanda fernandes' },
  ])
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [nowPlaying, setNowPlaying] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCastingModal, setShowCastingModal] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const addPlaylist = useCallback((title: string) => {
    const name = title.trim() || `Playlist ${Date.now()}`
    setPlaylists((prev) => [
      ...prev,
      { id: String(Date.now()), title: name, subtitle: 'amanda fernandes' },
    ])
  }, [])

  const selectPlaylist = useCallback((id: string | null) => {
    setSelectedPlaylistId(id)
  }, [])

  const playTrack = useCallback((track: Track) => {
    if (nowPlaying?.id === track.id) {
      setIsPlaying((prev) => {
        const audio = audioRef.current
        if (audio) {
          if (prev) audio.pause()
          else audio.play()
        }
        return !prev
      })
      return
    }
    audioRef.current?.pause()
    setNowPlaying(track)
    setIsPlaying(true)
    const audio = new Audio(DEMO_AUDIO_URL)
    audioRef.current = audio
    audio.play().catch(() => {})
  }, [nowPlaying?.id])

  const togglePlayPause = useCallback(() => {
    if (!nowPlaying) return
    setIsPlaying((prev) => {
      const audio = audioRef.current
      if (audio) {
        if (prev) audio.pause()
        else audio.play()
      }
      return !prev
    })
  }, [nowPlaying])

  const value: AppContextType = {
    sidebarCollapsed,
    toggleSidebar,
    currentView,
    setCurrentView,
    playlists,
    addPlaylist,
    selectedPlaylistId,
    selectPlaylist,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    nowPlaying,
    isPlaying,
    playTrack,
    togglePlayPause,
    showCastingModal,
    setShowCastingModal,
    showProfileDropdown,
    setShowProfileDropdown,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
