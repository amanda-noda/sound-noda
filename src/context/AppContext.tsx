import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react'
import type { Track } from '../data/tracks'
import YouTubePlayer from '../components/YouTubePlayer'

export type View = 'inicio' | 'explorar' | 'biblioteca'
export type RepeatMode = 'off' | 'one' | 'all'

export interface Playlist {
  id: string
  title: string
  subtitle: string
  trackIds: string[]
}

interface AppContextType {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  currentView: View
  setCurrentView: (view: View) => void
  playlists: Playlist[]
  addPlaylist: (title: string) => void
  selectedPlaylistId: string | null
  selectPlaylist: (id: string | null) => void
  addTrackToPlaylist: (playlistId: string, trackId: string) => void
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  likedTrackIds: Set<string>
  toggleLike: (trackId: string) => void
  isLiked: (trackId: string) => boolean
  queue: Track[]
  queueIndex: number
  addToQueue: (track: Track) => void
  addToQueueNext: (track: Track) => void
  removeFromQueue: (index: number) => void
  playFromQueue: (tracks: Track[], startIndex: number) => void
  clearQueue: () => void
  nowPlaying: Track | null
  isPlaying: boolean
  progress: number
  duration: number
  volume: number
  shuffle: boolean
  repeat: RepeatMode
  playTrack: (track: Track, addToQueue?: boolean) => void
  togglePlayPause: () => void
  previousTrack: () => void
  nextTrack: () => void
  seek: (time: number) => void
  setVolume: (vol: number) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  showCastingModal: boolean
  setShowCastingModal: (show: boolean) => void
  showProfileDropdown: boolean
  setShowProfileDropdown: (show: boolean) => void
  showAddToPlaylistModal: { track: Track } | null
  setShowAddToPlaylistModal: (v: { track: Track } | null) => void
}

const AppContext = createContext<AppContextType | null>(null)

const FALLBACK_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

function getTrackAudioUrl(track: Track): string {
  return track.audioUrl || FALLBACK_AUDIO
}

function useYouTube(track: Track | null): boolean {
  return !!(track?.youtubeVideoId)
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentView, setCurrentView] = useState<View>('inicio')
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: '1', title: 'Música marcada como "G..."', subtitle: 'Playlist automática', trackIds: [] },
    { id: '2', title: 'Recap de junho a agosto d...', subtitle: 'Ideal para amanda fernandes', trackIds: [] },
    { id: '3', title: 'Música pra cantar e beber', subtitle: 'amanda fernandes', trackIds: [] },
    { id: '4', title: 'Melhores Músicas Interna...', subtitle: '#RealMusic: 2025 Songs', trackIds: [] },
    { id: '5', title: 'Eu e eu', subtitle: 'amanda fernandes', trackIds: [] },
  ])
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set())
  const [queue, setQueue] = useState<Track[]>([])
  const [queueIndex, setQueueIndex] = useState(0)
  const [nowPlaying, setNowPlaying] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState<RepeatMode>('off')
  const [showCastingModal, setShowCastingModal] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState<{ track: Track } | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const youtubePlayerRef = useRef<YT.Player | null>(null)
  const queueRef = useRef({ queue: [] as Track[], queueIndex: 0 })
  queueRef.current = { queue, queueIndex }

  const useYT = useYouTube(nowPlaying)

  const startPlayback = useCallback((track: Track) => {
    if (track.youtubeVideoId) {
      audioRef.current?.pause()
      setProgress(0)
      setDuration(0)
    } else {
      youtubePlayerRef.current?.pauseVideo?.()
      const audio = new Audio(getTrackAudioUrl(track))
      audioRef.current?.pause()
      audioRef.current = audio
      audio.play().catch(() => {})
    }
  }, [])

  const toggleLike = useCallback((trackId: string) => {
    setLikedTrackIds((prev) => {
      const next = new Set(prev)
      if (next.has(trackId)) next.delete(trackId)
      else next.add(trackId)
      return next
    })
  }, [])

  const isLiked = useCallback((trackId: string) => likedTrackIds.has(trackId), [likedTrackIds])

  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track])
  }, [])

  const addToQueueNext = useCallback((track: Track) => {
    setQueue((prev) => {
      const next = [...prev]
      const idx = queueRef.current.queueIndex
      next.splice(idx + 1, 0, track)
      return next
    })
    if (queue.length === 0) {
      setNowPlaying(track)
      setIsPlaying(true)
      startPlayback(track)
    }
  }, [queue.length, startPlayback])

  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index))
    setQueueIndex((prev) => (index < prev ? prev - 1 : prev))
  }, [])

  const playFromQueue = useCallback((tracks: Track[], startIndex: number) => {
    const track = tracks[startIndex]
    setQueue(tracks)
    setQueueIndex(startIndex)
    setNowPlaying(track)
    setIsPlaying(true)
    startPlayback(track)
  }, [startPlayback])

  const clearQueue = useCallback(() => {
    setQueue([])
    setQueueIndex(0)
  }, [])

  const addTrackToPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId && !p.trackIds.includes(trackId)
          ? { ...p, trackIds: [...p.trackIds, trackId] }
          : p
      )
    )
  }, [])

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) } : p
      )
    )
  }, [])

  const playTrack = useCallback(
    (track: Track, addToQueueMode = false) => {
      if (addToQueueMode) {
        addToQueue(track)
        return
      }
      if (nowPlaying?.id === track.id) {
        setIsPlaying((prev) => {
          if (track.youtubeVideoId) {
            const player = youtubePlayerRef.current
            if (player) prev ? player.pauseVideo() : player.playVideo()
          } else {
            const audio = audioRef.current
            if (audio) prev ? audio.pause() : audio.play()
          }
          return !prev
        })
        return
      }
      setQueue([track])
      setQueueIndex(0)
      setNowPlaying(track)
      setIsPlaying(true)
      startPlayback(track)
    },
    [nowPlaying?.id, addToQueue, startPlayback]
  )

  const goToNext = useCallback(() => {
    const { queue: q, queueIndex: qi } = queueRef.current
    if (q.length === 0) return
    let nextIndex: number
    if (repeat === 'one') {
      setProgress(0)
      if (useYT) {
        youtubePlayerRef.current?.seekTo?.(0, true)
        youtubePlayerRef.current?.playVideo?.()
      } else if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
      return
    }
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * q.length)
    } else {
      nextIndex = qi + 1
      if (nextIndex >= q.length) {
        if (repeat === 'all') nextIndex = 0
        else {
          setIsPlaying(false)
          setNowPlaying(null)
          return
        }
      }
    }
    setQueueIndex(nextIndex)
    setNowPlaying(q[nextIndex])
    setProgress(0)
    startPlayback(q[nextIndex])
  }, [repeat, shuffle, startPlayback, useYT])

  const goToPrevious = useCallback(() => {
    if (progress > 3) {
      setProgress(0)
      if (useYT) {
        youtubePlayerRef.current?.seekTo?.(0, true)
        youtubePlayerRef.current?.playVideo?.()
      } else if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
      return
    }
    const { queue: q, queueIndex: qi } = queueRef.current
    if (q.length === 0 || qi <= 0) return
    const prevIndex = qi - 1
    setQueueIndex(prevIndex)
    setNowPlaying(q[prevIndex])
    setProgress(0)
    startPlayback(q[prevIndex])
  }, [progress, startPlayback, useYT])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || useYT) return
    const onTimeUpdate = () => setProgress(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => goToNext()
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [nowPlaying, goToNext, useYT])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = volume
  }, [volume, nowPlaying])

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  const togglePlayPause = useCallback(() => {
    if (!nowPlaying) return
    setIsPlaying((prev) => {
      if (useYT) {
        const player = youtubePlayerRef.current
        if (player) prev ? player.pauseVideo() : player.playVideo()
      } else {
        const audio = audioRef.current
        if (audio) prev ? audio.pause() : audio.play()
      }
      return !prev
    })
  }, [nowPlaying, useYT])

  const seek = useCallback((time: number) => {
    if (useYT) {
      youtubePlayerRef.current?.seekTo?.(time, true)
    } else {
      const audio = audioRef.current
      if (audio) {
        audio.currentTime = time
        setProgress(time)
      }
    }
  }, [useYT])

  const setVolume = useCallback((vol: number) => {
    setVolumeState(Math.max(0, Math.min(1, vol)))
  }, [])

  const toggleShuffle = useCallback(() => setShuffle((s) => !s), [])
  const toggleRepeat = useCallback(() => {
    setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))
  }, [])

  const toggleSidebar = useCallback(() => setSidebarCollapsed((s) => !s), [])

  const addPlaylist = useCallback((title: string) => {
    const name = title.trim() || `Playlist ${Date.now()}`
    setPlaylists((prev) => [...prev, { id: String(Date.now()), title: name, subtitle: 'amanda fernandes', trackIds: [] }])
  }, [])

  const selectPlaylist = useCallback((id: string | null) => setSelectedPlaylistId(id), [])

  const handleYoutubeReady = useCallback((player: YT.Player) => {
    youtubePlayerRef.current = player
  }, [])

  const handleYoutubeStateChange = useCallback((state: number) => {
    if (state === 0) goToNext()
  }, [goToNext])

  const handleYoutubeProgress = useCallback((currentTime: number, dur: number) => {
    setProgress(currentTime)
    setDuration(dur)
  }, [])

  const value: AppContextType = {
    sidebarCollapsed,
    toggleSidebar,
    currentView,
    setCurrentView,
    playlists,
    addPlaylist,
    selectedPlaylistId,
    selectPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    likedTrackIds,
    toggleLike,
    isLiked,
    queue,
    queueIndex,
    addToQueue,
    addToQueueNext,
    removeFromQueue,
    playFromQueue,
    clearQueue,
    nowPlaying,
    isPlaying,
    progress,
    duration,
    volume,
    shuffle,
    repeat,
    playTrack,
    togglePlayPause,
    previousTrack: goToPrevious,
    nextTrack: goToNext,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    showCastingModal,
    setShowCastingModal,
    showProfileDropdown,
    setShowProfileDropdown,
    showAddToPlaylistModal,
    setShowAddToPlaylistModal,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
      <YouTubePlayer
        videoId={nowPlaying?.youtubeVideoId ?? null}
        isPlaying={isPlaying}
        volume={volume}
        progress={progress}
        onReady={handleYoutubeReady}
        onStateChange={handleYoutubeStateChange}
        onProgress={handleYoutubeProgress}
      />
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
