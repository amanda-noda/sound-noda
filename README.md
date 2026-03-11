# Sound Noda

Aplicativo de streaming de música inspirado em interfaces modernas de serviços como Spotify. Desenvolvido com React, Vite, TypeScript e uma API backend em Express que consome a [Deezer API](https://developers.deezer.com/) para buscar músicas, álbuns e artistas.

![Sound Noda](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)

## Funcionalidades

- **Player de áudio** – Play/Pause, anterior, próxima, barra de progresso, volume
- **Modos de reprodução** – Embaralhar e repetir (off / todas / uma)
- **Busca em tempo real** – Músicas, álbuns, artistas e playlists
- **Músicas em alta** – Seção com faixas populares da Deezer
- **Fila de reprodução** – Adicionar, tocar em seguida, gerenciar
- **Curtir músicas** – Marcar faixas como favoritas
- **Playlists** – Criar e gerenciar playlists
- **Menu de contexto** – Tocar, adicionar à fila, curtir, adicionar à playlist
- **Categorias** – Filtrar por humor/ocasião (Relax, Festa, Foco, etc.)
- **Duração original** – Exibição do tempo real de cada faixa (formato M:SS)

## Tecnologias

| Stack | Tecnologia |
|-------|------------|
| Frontend | React 19, TypeScript, Vite 7 |
| Backend | Node.js, Express |
| API externa | Deezer API |
| Áudio | HTML5 Audio + YouTube IFrame API (para vídeos) |

## Estrutura do projeto

```
sound-noda/
├── src/
│   ├── components/       # Componentes React
│   │   ├── Sidebar.tsx   # Navegação lateral
│   │   ├── MainContent.tsx
│   │   ├── MusicSection.tsx
│   │   ├── SearchView.tsx
│   │   ├── MusicCard.tsx
│   │   ├── NowPlaying.tsx # Barra do player
│   │   └── ...
│   ├── context/
│   │   └── AppContext.tsx # Estado global
│   ├── services/
│   │   └── api.ts        # Chamadas à API
│   ├── data/
│   │   └── tracks.ts     # Faixas estáticas
│   └── App.tsx
├── server/
│   ├── index.js         # Servidor Express
│   └── routes/
│       └── music.js      # Rotas da API
├── package.json
└── vite.config.ts
```

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/amanda-noda/sound-noda.git
cd sound-noda

# Instale as dependências
npm install
```

### Executando o projeto

**Opção 1 – Tudo junto (recomendado)**

```bash
npm run dev:all
```

Isso inicia:
- **API** em `http://localhost:3001`
- **Frontend** em `http://localhost:8888`

**Opção 2 – Separado**

Em um terminal:

```bash
npm run server
```

Em outro terminal:

```bash
npm run dev
```

Depois acesse: **http://localhost:8888**

### Build para produção

```bash
npm run build
npm run preview
```

## API

A API roda na porta **3001** e usa a Deezer como fonte de dados.

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Status da API |
| GET | `/api/search/tracks?q=termo&limit=50&index=0` | Buscar músicas |
| GET | `/api/search/albums?q=termo&limit=30&index=0` | Buscar álbuns |
| GET | `/api/search/artists?q=termo&limit=30&index=0` | Buscar artistas |
| GET | `/api/chart/tracks?limit=100&index=0` | Músicas em alta |
| GET | `/api/artist/:id/tracks` | Faixas de um artista |
| GET | `/api/album/:id/tracks` | Faixas de um álbum |

### Exemplo de resposta (busca de músicas)

```json
{
  "tracks": [
    {
      "id": "deezer-123456",
      "title": "Nome da música",
      "artist": "Nome do artista",
      "album": "Nome do álbum",
      "duration": 218,
      "durationFormatted": "3:38",
      "coverUrl": "https://cdn-images.dzcdn.net/...",
      "audioUrl": "https://cdnt-preview.dzcdn.net/..."
    }
  ],
  "total": 1500,
  "next": 50
}
```

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o frontend (Vite) |
| `npm run server` | Inicia a API (Express) |
| `npm run dev:all` | Inicia API e frontend juntos |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |

## Observações

- **Preview da Deezer**: as faixas da API usam previews de 30 segundos fornecidos pela Deezer.
- **Fallback**: faixas sem áudio da Deezer usam SoundHelix como fallback.
- **YouTube**: algumas faixas estáticas podem ter `youtubeVideoId` para reprodução via YouTube.

## Licença

Projeto privado.
