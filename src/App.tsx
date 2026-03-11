import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import NowPlaying from './components/NowPlaying'
import './App.css'

function App() {
  return (
    <AppProvider>
      <div className="app">
        <Sidebar />
        <MainContent />
        <NowPlaying />
      </div>
    </AppProvider>
  )
}

export default App
