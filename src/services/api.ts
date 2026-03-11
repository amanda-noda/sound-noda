import type { Track } from '../data/tracks'
import { formatDuration } from '../data/tracks'

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

function normalizeTrack(t: Record<string, unknown>): Track {
  const duration = typeof t.duration === 'number' ? t.duration : undefined
  return {
    id: String(t.id ?? ''),
    title: String(t.title ?? ''),
    artist: String(t.artist ?? 'Artista desconhecido'),
    album: t.album ? String(t.album) : undefined,
    type: 'Música',
    coverUrl: String(t.coverUrl ?? ''),
    audioUrl: String(t.audioUrl ?? ''),
    duration,
    durationFormatted: (t.durationFormatted as string) || (duration ? formatDuration(duration) : undefined),
  }
}

export async function searchTracks(
  q: string,
  limit = 50,
  index = 0
): Promise<{ tracks: Track[]; total: number; next: number | null }> {
  const res = await fetch(
    `${API_BASE}/search/tracks?q=${encodeURIComponent(q)}&limit=${limit}&index=${index}`
  )
  const data = await res.json()
  const tracks = (data.tracks || []).map(normalizeTrack)
  return {
    tracks,
    total: data.total ?? 0,
    next: data.next ?? null,
  }
}

export async function searchAlbums(
  q: string,
  limit = 30,
  index = 0
): Promise<{ albums: ApiAlbum[]; total: number }> {
  const res = await fetch(
    `${API_BASE}/search/albums?q=${encodeURIComponent(q)}&limit=${limit}&index=${index}`
  )
  const data = await res.json()
  return { albums: data.albums ?? [], total: data.total ?? 0 }
}

export async function searchArtists(
  q: string,
  limit = 30,
  index = 0
): Promise<{ artists: ApiArtist[]; total: number }> {
  const res = await fetch(
    `${API_BASE}/search/artists?q=${encodeURIComponent(q)}&limit=${limit}&index=${index}`
  )
  const data = await res.json()
  return { artists: data.artists ?? [], total: data.total ?? 0 }
}

export async function getChartTracks(
  limit = 100,
  index = 0
): Promise<{ tracks: Track[]; total: number; next: number | null }> {
  const res = await fetch(`${API_BASE}/chart/tracks?limit=${limit}&index=${index}`)
  const data = await res.json()
  const tracks = (data.tracks || []).map(normalizeTrack)
  return {
    tracks,
    total: data.total ?? tracks.length,
    next: data.next ?? null,
  }
}

export async function getAlbumTracks(albumId: string): Promise<Track[]> {
  const res = await fetch(`${API_BASE}/album/${encodeURIComponent(albumId)}/tracks`)
  const data = await res.json()
  return (data.tracks || []).map(normalizeTrack)
}

export async function getArtistTracks(artistId: string): Promise<Track[]> {
  const res = await fetch(`${API_BASE}/artist/${encodeURIComponent(artistId)}/tracks`)
  const data = await res.json()
  return (data.tracks || []).map(normalizeTrack)
}
