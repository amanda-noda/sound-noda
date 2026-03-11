import type { Track } from '../data/tracks'

const API_BASE = '/api'

export interface ApiAlbum {
  id: string
  title: string
  artist?: string
  coverUrl: string
  tracksUrl: string
}

export interface ApiArtist {
  id: string
  name: string
  coverUrl: string
  tracklistUrl: string
}

export async function searchTracks(q: string, limit = 20): Promise<{ tracks: Track[]; total: number }> {
  const res = await fetch(`${API_BASE}/search/tracks?q=${encodeURIComponent(q)}&limit=${limit}`)
  const data = await res.json()
  return { tracks: data.tracks || [], total: data.total || 0 }
}

export async function searchAlbums(q: string, limit = 20): Promise<{ albums: ApiAlbum[]; total: number }> {
  const res = await fetch(`${API_BASE}/search/albums?q=${encodeURIComponent(q)}&limit=${limit}`)
  const data = await res.json()
  return { albums: data.albums || [], total: data.total || 0 }
}

export async function searchArtists(q: string, limit = 20): Promise<{ artists: ApiArtist[]; total: number }> {
  const res = await fetch(`${API_BASE}/search/artists?q=${encodeURIComponent(q)}&limit=${limit}`)
  const data = await res.json()
  return { artists: data.artists || [], total: data.total || 0 }
}

export async function getChartTracks(limit = 50): Promise<Track[]> {
  const res = await fetch(`${API_BASE}/chart/tracks?limit=${limit}`)
  const data = await res.json()
  return data.tracks || []
}

export async function getAlbumTracks(albumId: string): Promise<Track[]> {
  const res = await fetch(`${API_BASE}/album/${encodeURIComponent(albumId)}/tracks`)
  const data = await res.json()
  return data.tracks || []
}

export async function getArtistTracks(artistId: string): Promise<Track[]> {
  const res = await fetch(`${API_BASE}/artist/${encodeURIComponent(artistId)}/tracks`)
  const data = await res.json()
  return data.tracks || []
}
