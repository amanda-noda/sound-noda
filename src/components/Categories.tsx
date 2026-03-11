import { useApp } from '../context/AppContext'
import './Categories.css'

const categories = [
  'Podcasts',
  'Relax',
  'Para dormir',
  'Triste',
  'Romance',
  'Energia',
  'Positividade',
  'Para ouvir no trânsito',
  'Festa',
  'Foco',
  'Para treinar',
]

export default function Categories() {
  const { selectedCategory, setSelectedCategory } = useApp()

  return (
    <div className="categories">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
