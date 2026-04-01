# DESAFIOG03 | Desempacotando Arquivos JSON 🎵

[![Go](https://img.shields.io/badge/Go-1.22%2B-00ADD8?style=flat-square&logo=go)](https://golang.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![SCSS](https://img.shields.io/badge/SCSS-Modular-CC6699?style=flat-square&logo=sass)](https://sass-lang.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

Gerencie e explore faixas de música eletrônica em uma interface cyberpunk imersiva. Uma aplicação full-stack que combina **Go** (backend) com **Next.js 16** (frontend) para ler, processar e exibir dados de faixas em formato JSON com player de áudio integrado.

---

## 📖 Descrição do Desafio

Nas ruas neon de **Neo-Shibuya**, onde sintetizadores ecoam entre arranha-céus e batidas eletrônicas pulsam no asfalto molhado, você trabalha em uma plataforma de streaming de música eletrônica.

Seu sistema deve:

1. **Ler arquivos JSON** usando `ioutil.ReadFile()` no backend Go
2. **Desempacotar os dados** usando `json.Unmarshal()` em structs Go
3. **Expor uma API REST** para o frontend consumir
4. **Exibir as informações** de forma organizada com output terminal estilizado
5. **Reproduzir as faixas** com player de áudio completo

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USUÁRIO SELECIONA UMA FAIXA                             │
│    ├─ Escolhe no <select> estilizado (cyberpunk)           │
│    ├─ handleSelect() reseta audioFile para null            │
│    ├─ JSON da faixa re-renderiza com animação fadeInUp     │
│    └─ Stats (BPM, duração, ano) e tags atualizam           │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 2. USUÁRIO CLICA EM INICIAR                                │
│    ├─ handleIniciar() seta audioFile com nome do .mp3      │
│    ├─ useEffect detecta mudança em audioFile               │
│    ├─ requestAnimationFrame aguarda commit do React        │
│    └─ useEffectEvent dispara togglePlay() sem stale closure│
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 3. NEXT.JS ROUTE HANDLER (src/app/api/music/route.ts)      │
│    ├─ GET /api/music → proxy para /api/musics no Go        │
│    ├─ GET /api/music?id=N → proxy para /api/musics/:id     │
│    ├─ Dinâmico por padrão (Next.js 16, sem cache)          │
│    └─ try/catch retorna 503 se backend indisponível        │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 4. BACKEND GO (Gin) PROCESSA                               │
│    ├─ Lê music1-5.json com os.ReadFile()                   │
│    ├─ Desempacota com json.Unmarshal() em struct Music      │
│    ├─ GET /api/musics → retorna slice []Music              │
│    ├─ GET /api/musics/:id → retorna Music por ID           │
│    ├─ GET /api/audio/:filename → stream do .mp3            │
│    └─ CORS liberado para http://localhost:3000             │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 5. FRONTEND RENDERIZA E REPRODUZ                           │
│    ├─ useAudio cria HTMLAudioElement com URL do backend     │
│    ├─ Barras de som animadas (quiet/normal/loud por BPM)   │
│    ├─ Gradiente neon: verde → azul → roxo                  │
│    ├─ Output terminal: chaves azul, strings verde, nums rosa│
│    └─ Player externo: progresso, play/pause, prev/next     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 6. USUÁRIO CONTROLA A REPRODUÇÃO                           │
│    ├─ Play/pause via togglePlay() com useRef anti-stale    │
│    ├─ Seek clicando ou com ← → na barra de progresso       │
│    ├─ Anterior/próxima navegam no array de músicas         │
│    └─ RETORNAR para audioFile=null e seek(0)               │
└─────────────────────────────────────────────────────────────┘

```
---

## 📋 Estrutura do Projeto

```
DESAFIOG03
├── backend/
│   ├── config/
│   │   └── config.go
│   ├── data/
│   │   ├── music1.json          # Alok - Jungle
│   │   ├── music2.json          # Martin Garrix - Animals
│   │   ├── music3.json          # Benny Benassi - Satisfaction
│   │   ├── music4.json          # Eli Brown - Be The One
│   │   └── music5.json          # Tiësto - Mockingbird
│   ├── assets/                  # Arquivos .mp3 (adicionar manualmente)
│   ├── handlers/
│   │   ├── music.go
│   │   └── sound.go
│   ├── middleware/
│   │   └── cors.go
│   ├── models/
│   │   └── music.go
│   ├── routes/
│   │   └── routes.go
│   ├── go.mod
│   ├── go.sum
│   └── main.go
│
└── frontend/
    ├── public/
    │   └── background.mp4       # Vídeo 4K (adicionar manualmente)
    └── src/
        ├── app/
        │   ├── api/music/
        │   │   └── route.ts
        │   ├── music/
        │   │   └── page.tsx
        │   ├── globals.scss
        │   ├── layout.tsx
        │   └── page.tsx
        ├── features/
        │   └── music/
        │       ├── components/
        │       │   ├── hooks/
        │       │   │   ├── useAudio.ts
        │       │   │   └── useBackgroundVideo.ts
        │       │   ├── utils/
        │       │   │   └── soundConfig.ts
        │       │   ├── ControlButtons.tsx
        │       │   ├── MusicContainer.tsx
        │       │   └── SoundButton.tsx
        │       ├── page.module.scss
        │       └── page.tsx
        └── shared/
            ├── components/
            │   ├── Button/
            │   └── Container/
            └── styles/
                ├── animations.scss
                ├── mixins.scss
                └── variables.scss
```

---

## 🚀 Como Executar

### Pré-requisitos

- Go 1.22+
- Node.js 20+
- npm 10+

### Backend

```bash
cd backend

# Instalar dependências
go mod tidy

# Adicionar os arquivos de áudio em backend/assets/:
#   Alok - Jungle.mp3
#   Animals - Martin Garrix.mp3
#   Benny Benassi - Satisfaction.mp3
#   Eli Brown - Be The One.mp3
#   Tiësto - Mockingbird.mp3

go run main.go
# API disponível em http://localhost:8080
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Adicionar o vídeo em frontend/public/background.mp4

npm run dev
# App disponível em http://localhost:3000
```

---

## 🎮 Como Usar

1. **Selecione uma faixa** no dropdown estilizado
2. **Visualize o JSON** no output terminal
3. **Clique em INICIAR** para carregar e reproduzir
4. **Controle o player** com play/pause, anterior e próxima
5. **Clique em RETORNAR** para parar e resetar

---

## 🔧 API REST

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/musics` | Lista todas as faixas |
| `GET` | `/api/musics/:id` | Busca faixa por ID |
| `GET` | `/api/audio/:filename` | Stream do arquivo MP3 |

### Exemplo de Response

```json
{
  "id": 1,
  "titulo": "Jungle",
  "artista": "Alok, The Chainsmokers & Mae Stephens",
  "genero": "Progressive House",
  "duracao": "3:28",
  "bpm": 120,
  "ano": 2018,
  "producao": {
    "produtor": "Alok, The Chainsmokers",
    "pais": "Brasil / EUA",
    "gravadora": "Astralwerks"
  },
  "instrumentos": ["Sintetizador", "Vocais", "Bateria eletrônica"],
  "ambiente": "Floresta urbana noturna com luzes neon",
  "cores_predominantes": ["Verde neon", "Azul neon", "Roxo"],
  "arquivo_mp3": "Alok - Jungle.mp3"
}
```

---

## 🎨 Stack Tecnológica

| Camada | Tecnologia | Função |
|--------|-----------|--------|
| **Backend** | Go 1.22 + Gin | API REST, leitura de JSON, stream de áudio |
| **Frontend** | Next.js 16 + React 19.2 | Interface, roteamento, SSR |
| **Linguagem** | TypeScript 5.8 | Tipagem estática |
| **Estilos** | SCSS Modular | Layout cyberpunk, animações |
| **Ícones** | Phosphor Icons | Controles do player |
| **Vídeo** | HTML5 `<video>` | Background 4K fixo à direita |

---

## 🎵 Faixas

| # | Título | Artista | Gênero | BPM |
|---|--------|---------|--------|-----|
| 1 | Jungle | Alok, The Chainsmokers & Mae Stephens | Progressive House | 120 |
| 2 | Animals | Martin Garrix | Electro House | 128 |
| 3 | Satisfaction | Benny Benassi | Electro House | 130 |
| 4 | Be The One | Eli Brown | Tech House | 125 |
| 5 | Mockingbird | Tiësto | Progressive House | 124 |

---

## 🎨 Paleta de Cores

- **Azul Neon**: `#00d4ff`
- **Rosa Neon**: `#ff2d78`
- **Roxo Neon**: `#b44fff`
- **Verde Neon**: `#12E2DC`
- **Fundo**: `#05050f`

---

## 📚 Dependências

### Backend (Go)
- `github.com/gin-gonic/gin` — servidor HTTP e roteamento
- `github.com/gin-contrib/cors` — controle de CORS

### Frontend (Node)
- `next` — framework React
- `react` / `react-dom` — UI
- `sass` — pré-processador CSS
- `@phosphor-icons/react` — ícones do player

---

## 👨‍💻 Autor

**Luiz Felipe de Oliveira**

Desenvolvedor Full Stack apaixonado por criar soluções elegantes e eficientes.

- 🌐 **Portfólio:** [luizfxdev.com.br](https://luizfxdev.com.br)
- 💼 **LinkedIn:** [in/luizfxdev](https://www.linkedin.com/in/luizfxdev)
- 🐙 **GitHub:** [@luizfxdev](https://github.com/luizfxdev)

---

<div align="center">

**Desenvolvido com 💙 usando Go, Next.js e muita criatividade**

</div>
