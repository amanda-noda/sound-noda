import express from 'express'
import cors from 'cors'
import musicRoutes from './routes/music.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api', musicRoutes)

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', message: 'Sound Noda API' })
})

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`)
})
