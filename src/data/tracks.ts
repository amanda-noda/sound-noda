export interface Track {
  id: string
  title: string
  artist: string
  album?: string
  type: 'Música' | 'Vídeo'
  coverUrl: string
  views?: string
  category?: string
  audioUrl: string
  youtubeVideoId?: string
  duration?: number
}

const SOUNDHELIX = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song'

/* Capas originais da Deezer CDN (500x500) */
export const recentTracks: Track[] = [
  { id: '1', title: "The First Time", artist: "Damiano David", album: "Funny Little Fears", type: "Música", coverUrl: "https://cdn-images.dzcdn.net/images/cover/812582837d3006d43ab53535635e3bfb/500x500-000000-80-0-0.jpg", category: "Energia", audioUrl: `${SOUNDHELIX}-1.mp3`, youtubeVideoId: "g4HERPfpn8o" },
  { id: '2', title: "Between Mountain Tops (Radio Edit)", artist: "Meanetik", album: "Horizons", type: "Música", coverUrl: "https://cdn-images.dzcdn.net/images/cover/71d2e44267cc6e3360754a5130ad6140/500x500-000000-80-0-0.jpg", category: "Relax", audioUrl: `${SOUNDHELIX}-2.mp3` },
  { id: '3', title: "Wednesday Addams (Baltimore Club Mix)", artist: "Phoenix Storm", album: "Club Mixes", type: "Música", coverUrl: "https://cdn-images.dzcdn.net/images/cover/35b17cf4a28af9a6e9e05691634144c9/500x500-000000-80-0-0.jpg", category: "Festa", audioUrl: `${SOUNDHELIX}-3.mp3` },
  { id: '4', title: "we can't be friends (wait for your love)", artist: "Ariana Grande", album: "Eternal Sunshine", type: "Música", coverUrl: "https://cdn-images.dzcdn.net/images/cover/9349b2fcb4bd060060a33f054a619e83/500x500-000000-80-0-0.jpg", views: "348 mi de visualizações", category: "Romance", audioUrl: `${SOUNDHELIX}-4.mp3`, youtubeVideoId: "DhK0fZ_hs04" },
  { id: '5', title: "Tubarões (Ao Vivo)", artist: "Diego & Victor Hugo", album: "Ao Vivo", type: "Música", coverUrl: "https://cdn-images.dzcdn.net/images/cover/930fb4fbfa39ee7e94be17683b280713/500x500-000000-80-0-0.jpg", category: "Festa", audioUrl: `${SOUNDHELIX}-5.mp3`, youtubeVideoId: "10XarNSkw0s" },
  { id: '6', title: "Ranc", artist: "Henr", album: "Solo", type: "Música", coverUrl: "https://cdn-images.dzcdn.net/images/cover/28a609499f6e39218b1c6130350ded92/500x500-000000-80-0-0.jpg", category: "Triste", audioUrl: `${SOUNDHELIX}-6.mp3` },
  { id: '7', title: "Sunset Dreams", artist: "Ambient Collective", album: "Ambient Vol. 1", type: "Música", coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop", category: "Para dormir", audioUrl: `${SOUNDHELIX}-7.mp3` },
  { id: '8', title: "Focus Mode", artist: "Study Beats", album: "Productivity", type: "Música", coverUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&h=500&fit=crop", category: "Foco", audioUrl: `${SOUNDHELIX}-8.mp3` },
  { id: '9', title: "Workout Anthem", artist: "Fit Sounds", album: "Gym Hits", type: "Música", coverUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=500&fit=crop", category: "Para treinar", audioUrl: `${SOUNDHELIX}-9.mp3` },
  { id: '10', title: "Good Vibes Only", artist: "Happy Tunes", album: "Positive", type: "Música", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop", category: "Positividade", audioUrl: `${SOUNDHELIX}-10.mp3` },
]
