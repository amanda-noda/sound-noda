export interface Track {
  id: string
  title: string
  artist: string
  type: 'Música' | 'Vídeo'
  coverUrl: string
  views?: string
  category?: string
  audioUrl: string
}

const SOUNDHELIX = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song'

export const recentTracks: Track[] = [
  { id: '1', title: "The First Time", artist: "Damiano David", type: "Música", coverUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=400&fit=crop", category: "Energia", audioUrl: `${SOUNDHELIX}-1.mp3` },
  { id: '2', title: "Between Mountain Tops (Radio Edit)", artist: "Meanetik", type: "Música", coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop", category: "Relax", audioUrl: `${SOUNDHELIX}-2.mp3` },
  { id: '3', title: "Wednesday Addams (Baltimore Club Mix)", artist: "Phoenix Storm", type: "Música", coverUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=400&fit=crop", category: "Festa", audioUrl: `${SOUNDHELIX}-3.mp3` },
  { id: '4', title: "we can't be friends (wait for your love)", artist: "Ariana Grande", type: "Música", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", views: "348 mi de visualizações", category: "Romance", audioUrl: `${SOUNDHELIX}-4.mp3` },
  { id: '5', title: "Tubarões (Ao Vivo)", artist: "Diego & Victor Hugo", type: "Música", coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop", category: "Festa", audioUrl: `${SOUNDHELIX}-5.mp3` },
  { id: '6', title: "Ranc", artist: "Henr", type: "Música", coverUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop", category: "Triste", audioUrl: `${SOUNDHELIX}-6.mp3` },
  { id: '7', title: "Sunset Dreams", artist: "Ambient Collective", type: "Música", coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", category: "Para dormir", audioUrl: `${SOUNDHELIX}-7.mp3` },
  { id: '8', title: "Focus Mode", artist: "Study Beats", type: "Música", coverUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=400&fit=crop", category: "Foco", audioUrl: `${SOUNDHELIX}-8.mp3` },
  { id: '9', title: "Workout Anthem", artist: "Fit Sounds", type: "Música", coverUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop", category: "Para treinar", audioUrl: `${SOUNDHELIX}-9.mp3` },
  { id: '10', title: "Good Vibes Only", artist: "Happy Tunes", type: "Música", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", category: "Positividade", audioUrl: `${SOUNDHELIX}-10.mp3` },
]
