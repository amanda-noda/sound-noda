import { useState, useMemo, useEffect, useCallback } from 'react'
import { recentTracks } from '../data/tracks'
import type { Track } from '../data/tracks'
import { useApp } from '../context/AppContext'
import {
  searchTracks,
  searchAlbums,
  searchArtists,
  getAlbumTracks,
  getArtistTracks,
  type ApiAlbum,
  type ApiArtist,
} from '../services/api'
import MusicCard from './MusicCard'
import './SearchView.css'

type SearchTab = 'musicas' | 'albuns' | 'artistas' | 'playlists'

type LocalAlbum = { album: string; artist: string; coverUrl: string; tracks: Track[] }
type LocalArtist = { artist: string; coverUrl: string; tracks: Track[] }

export default function SearchView() {
  const { searchQuery, playlists, playFromQueue, selectPlaylist, showToast } = useApp()
  const [activeTab, setActiveTab] = useState<SearchTab>('musicas')
  const [apiTracks, setApiTracks] = useState<Track[]>([])
  const [apiAlbums, setApiAlbums] = useState<ApiAlbum[]>([])
  const [apiArtists, setApiArtists] = useState<ApiArtist[]>([])
  const [tracksTotal, setTracksTotal] = useState(0)
  const [tracksNextIndex, setTracksNextIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadingAlbumId, setLoadingAlbumId] = useState<string | null>(null)
  const [loadingArtistId, setLoadingArtistId] = useState<string | null>(null)

  const query = searchQuery.trim()

  useEffect(() => {
    if (!query) {
      setApiTracks([])
      setApiAlbums([])
      setApiArtists([])
      setTracksTotal(0)
      setTracksNextIndex(null)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    Promise.all([
      searchTracks(query, 50, 0),
      searchAlbums(query, 30),
      searchArtists(query, 30),
    ])
      .then(([tracksRes, albumsRes, artistsRes]) => {
        if (controller.signal.aborted) return
        setApiTracks(tracksRes.tracks)
        setApiAlbums(albumsRes.albums)
        setApiArtists(artistsRes.artists)
        setTracksTotal(tracksRes.total)
        setTracksNextIndex(tracksRes.next)
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setApiTracks([])
          setApiAlbums([])
          setApiArtists([])
          setTracksTotal(0)
          setTracksNextIndex(null)
          showToast('Erro ao buscar. Verifique se a API está rodando.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [query, showToast])

  const handleLoadMoreTracks = useCallback(async () => {
    if (!query || tracksNextIndex === null || loadingMore) return
    setLoadingMore(true)
    try {
      const res = await searchTracks(query, 50, tracksNextIndex)
      setApiTracks((prev) => [...prev, ...res.tracks])
      setTracksNextIndex(res.next)
    } catch {
      showToast('Erro ao carregar mais músicas.')
    } finally {
      setLoadingMore(false)
    }
  }, [query, tracksNextIndex, loadingMore, showToast])

  const handleAlbumClick = useCallback(
    async (album: ApiAlbum) => {
      setLoadingAlbumId(album.id)
      try {
        const tracks = await getAlbumTracks(album.id)
        if (tracks.length > 0) playFromQueue(tracks, 0)
        else showToast('Nenhuma faixa disponível neste álbum.')
      } catch {
        showToast('Erro ao carregar o álbum.')
      } finally {
        setLoadingAlbumId(null)
      }
    },
    [playFromQueue, showToast]
  )

  const handleArtistClick = useCallback(
    async (artist: ApiArtist) => {
      setLoadingArtistId(artist.id)
      try {
        const tracks = await getArtistTracks(artist.id)
        if (tracks.length > 0) playFromQueue(tracks, 0)
        else showToast('Nenhuma faixa disponível para este artista.')
      } catch {
        showToast('Erro ao carregar o artista.')
      } finally {
        setLoadingArtistId(null)
      }
    },
    [playFromQueue, showToast]
  )

  const { tracks, albums, artists, matchingPlaylists } = useMemo(() => {
    const q = query.toLowerCase()
    const hasQuery = !!query

    const localFilteredTracks = hasQuery
      ? recentTracks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.artist.toLowerCase().includes(q) ||
            (t.album?.toLowerCase().includes(q) ?? false) ||
            (t.category?.toLowerCase().includes(q) ?? false)
        )
      : recentTracks

    const albumMap = new Map<string, LocalAlbum>()
    localFilteredTracks.forEach((t) => {
      const key = `${t.album || t.artist}-${t.artist}`
      if (!albumMap.has(key)) {
        albumMap.set(key, {
          album: t.album || t.artist,
          artist: t.artist,
          coverUrl: t.coverUrl,
          tracks: [],
        })
      }
      albumMap.get(key)!.tracks.push(t)
    })

    const artistMap = new Map<string, LocalArtist>()
    localFilteredTracks.forEach((t) => {
      if (!artistMap.has(t.artist)) {
        artistMap.set(t.artist, { artist: t.artist, coverUrl: t.coverUrl, tracks: [] })
      }
      artistMap.get(t.artist)!.tracks.push(t)
    })

    const filteredPlaylists = hasQuery
      ? playlists.filter(
          (p) =>
            p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q)
        )
      : playlists

    return {
      tracks: hasQuery ? apiTracks : localFilteredTracks,
      albums: hasQuery ? apiAlbums : Array.from(albumMap.values()),
      artists: hasQuery ? apiArtists : Array.from(artistMap.values()),
      matchingPlaylists: filteredPlaylists,
      isApiMode: hasQuery,
    }
  }, [query, apiTracks, apiAlbums, apiArtists, playlists])

  const isApiMode = !!query
  const trackCount = isApiMode ? apiTracks.length : tracks.length
  const albumCount = isApiMode ? apiAlbums.length : albums.length
  const artistCount = isApiMode ? apiArtists.length : artists.length

  const tabs: { id: SearchTab; label: string; count: number }[] = [
    { id: 'musicas', label: 'Músicas', count: trackCount },
    { id: 'albuns', label: 'Álbuns', count: albumCount },
    { id: 'artistas', label: 'Artistas', count: artistCount },
    { id: 'playlists', label: 'Playlists', count: matchingPlaylists.length },
  ]

  return (
    <section className="search-view">
      <div className="search-results-header">
        <h2>Resultados para "{searchQuery}"</h2>
        <div className="search-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`search-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="search-results-content">
        {loading && (
          <div className="search-loading">
            <div className="loading-spinner" />
            <p>Buscando músicas...</p>
          </div>
        )}

        {!loading && activeTab === 'musicas' && (
          <div className="search-tab-content">
            {tracks.length > 0 ? (
              <>
                <button
                  className="play-all-btn"
                  onClick={() => playFromQueue(tracks, 0)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Tocar tudo
                </button>
                <div className="search-tracks-grid">
                  {tracks.map((track) => (
                    <MusicCard key={track.id} track={track} />
                  ))}
                </div>
                {isApiMode && tracksNextIndex !== null && (
                  <button
                    className="load-more-btn"
                    onClick={handleLoadMoreTracks}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Carregando...' : `Carregar mais (${tracksTotal - tracks.length} restantes)`}
                  </button>
                )}
              </>
            ) : (
              <p className="no-results">Nenhuma música encontrada.</p>
            )}
          </div>
        )}

        {!loading && activeTab === 'albuns' && (
          <div className="search-tab-content">
            {albumCount > 0 ? (
              <div className="search-albums-grid">
                {isApiMode
                  ? (apiAlbums as ApiAlbum[]).map((album) => (
                      <div
                        key={album.id}
                        className={`album-card ${loadingAlbumId === album.id ? 'loading' : ''}`}
                        onClick={() => handleAlbumClick(album)}
                      >
                        <img src={album.coverUrl} alt={album.title} />
                        <div className="album-info">
                          <span className="album-name">{album.title}</span>
                          <span className="album-artist">{album.artist}</span>
                        </div>
                      </div>
                    ))
                  : (albums as LocalAlbum[]).map((album) => (
                      <div
                        key={`${album.album}-${album.artist}`}
                        className="album-card"
                        onClick={() => playFromQueue(album.tracks, 0)}
                      >
                        <img src={album.coverUrl} alt={album.album} />
                        <div className="album-info">
                          <span className="album-name">{album.album}</span>
                          <span className="album-artist">{album.artist}</span>
                        </div>
                      </div>
                    ))}
              </div>
            ) : (
              <p className="no-results">Nenhum álbum encontrado.</p>
            )}
          </div>
        )}

        {!loading && activeTab === 'artistas' && (
          <div className="search-tab-content">
            {artistCount > 0 ? (
              <div className="search-artists-grid">
                {isApiMode
                  ? (apiArtists as ApiArtist[]).map((artist) => (
                      <div
                        key={artist.id}
                        className={`artist-card ${loadingArtistId === artist.id ? 'loading' : ''}`}
                        onClick={() => handleArtistClick(artist)}
                      >
                        <img src={artist.coverUrl} alt={artist.name} />
                        <span className="artist-name">{artist.name}</span>
                        <span className="artist-meta">Artista</span>
                      </div>
                    ))
                  : (artists as LocalArtist[]).map((artist) => (
                      <div
                        key={artist.artist}
                        className="artist-card"
                        onClick={() => playFromQueue(artist.tracks, 0)}
                      >
                        <img src={artist.coverUrl} alt={artist.artist} />
                        <span className="artist-name">{artist.artist}</span>
                        <span className="artist-meta">Artista</span>
                      </div>
                    ))}
              </div>
            ) : (
              <p className="no-results">Nenhum artista encontrado.</p>
            )}
          </div>
        )}

        {!loading && activeTab === 'playlists' && (
          <div className="search-tab-content">
            {matchingPlaylists.length > 0 ? (
              <div className="search-playlists-grid">
                {matchingPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="playlist-card"
                    onClick={() => selectPlaylist(playlist.id)}
                  >
                    <div className="playlist-cover">
                      <div className="playlist-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.5c0 1.38-1.12 2.5-2.5 2.5S12 15.88 12 14.5s1.12-2.5 2.5-2.5c.59 0 1.12.23 1.5.59V6h4z"/>
                        </svg>
                      </div>
                    </div>
                    <span className="playlist-name">{playlist.title}</span>
                    <span className="playlist-meta">{playlist.subtitle}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-results">Nenhuma playlist encontrada.</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
