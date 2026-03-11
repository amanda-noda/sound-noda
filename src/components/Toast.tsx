import { useApp } from '../context/AppContext'
import './Toast.css'

export default function Toast() {
  const { toast } = useApp()

  if (!toast) return null

  return (
    <div className="toast" role="status">
      {toast}
    </div>
  )
}
