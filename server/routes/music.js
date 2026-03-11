import { Router } from 'express'

const router = Router()
const DEEZER_API = 'https://api.deezer.com'

function formatTrack(deezerTrack) {
  return {
    id: `deezer-${deezerTrack.id}`,
    title: deezerTrack.title,
    artist: deezerTrack.artist?.name || 'Artista desconhecido',
    album: deezerTrack.album?.title,
    type: 'Música',
    coverUrl: deezerTrack.album?.cover_medium || deezerTrack.album?.cover || '',
    duration: deezerTrack.duration,
    audioUrl: deezerTrack.preview || '',
    source: 'deezer',
  }
}

router.get('/search/tracks', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query
    if (!q || !q.trim()) {
      return res.json({ tracks: [], total: 0 })
    }
    const response = await fetch(
      `${DEEZER_API}/search/track?q=${encodeURIComponent(q)}&limit=${Math.min(limit, 50)}`
    )
    const data = await response.json()
    const tracks = (data.data || []).map(formatTrack)
    res.json({ tracks, total: data.total || tracks.length })
  } catch (error) {
    console.error('Erro na busca:', error)
    res.status(500).json({ error: 'Erro ao buscar músicas', tracks: [] })
  }
})

router.get('/search/albums', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query
    if (!q || !q.trim()) {
      return res.json({ albums: [], total: 0 })
    }
    const response = await fetch(
      `${DEEZER_API}/search/album?q=${encodeURIComponent(q)}&limit=${Math.min(limit, 50)}`
    )
    const data = await response.json()
    const albums = (data.data || []).map((a) => ({
      id: `album-${a.id}`,
      title: a.title,
      artist: a.artist?.name,
      coverUrl: a.cover_medium || a.cover,
      tracksUrl: a.tracklist,
    }))
    res.json({ albums, total: data.total || albums.length })
  } catch (error) {
    console.error('Erro na busca de álbuns:', error)
    res.status(500).json({ error: 'Erro ao buscar álbuns', albums: [] })
  }
})

router.get('/search/artists', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query
    if (!q || !q.trim()) {
      return res.json({ artists: [], total: 0 })
    }
    const response = await fetch(
      `${DEEZER_API}/search/artist?q=${encodeURIComponent(q)}&limit=${Math.min(limit, 50)}`
    )
    const data = await response.json()
    const artists = (data.data || []).map((a) => ({
      id: `artist-${a.id}`,
      name: a.name,
      coverUrl: a.picture_medium || a.picture,
      tracklistUrl: a.tracklist,
    }))
    res.json({ artists, total: data.total || artists.length })
  } catch (error) {
    console.error('Erro na busca de artistas:', error)
    res.status(500).json({ error: 'Erro ao buscar artistas', artists: [] })
  }
})

router.get('/chart/tracks', async (req, res) => {
  try {
    const { limit = 50 } = req.query
    const response = await fetch(
      `${DEEZER_API}/chart/0/tracks?limit=${Math.min(limit, 100)}`
    )
    const data = await response.json()
    const tracks = (data.data || []).map(formatTrack)
    res.json({ tracks })
  } catch (error) {
    console.error('Erro ao buscar músicas em alta:', error)
    res.status(500).json({ error: 'Erro ao buscar músicas', tracks: [] })
  }
})

router.get('/artist/:id/tracks', async (req, res) => {
  try {
    const { id } = req.params
    const deezerId = id.replace('artist-', '')
    const response = await fetch(`${DEEZER_API}/artist/${deezerId}/top?limit=50`)
    const data = await response.json()
    const tracks = (data.data || []).map(formatTrack)
    res.json({ tracks })
  } catch (error) {
    console.error('Erro ao buscar músicas do artista:', error)
    res.status(500).json({ error: 'Erro ao buscar músicas', tracks: [] })
  }
})

router.get('/album/:id/tracks', async (req, res) => {
  try {
    const { id } = req.params
    const deezerId = id.replace('album-', '')
    const response = await fetch(`${DEEZER_API}/album/${deezerId}/tracks`)
    const data = await response.json()
    const albumResponse = await fetch(`${DEEZER_API}/album/${deezerId}`)
    const albumData = await albumResponse.json()
    const tracks = (data.data || []).map((t) => ({
      ...formatTrack({ ...t, album: { ...albumData, cover_medium: albumData.cover_medium } }),
      coverUrl: albumData.cover_medium || t.album?.cover_medium || '',
    }))
    res.json({ tracks })
  } catch (error) {
    console.error('Erro ao buscar músicas do álbum:', error)
    res.status(500).json({ error: 'Erro ao buscar músicas', tracks: [] })
  }
})

export default router
