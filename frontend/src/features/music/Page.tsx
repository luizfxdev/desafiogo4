'use client'

import { useEffect, useState, useCallback, useEffectEvent } from 'react'
import MusicContainer from './components/MusicContainer'
import ControlButtons from './components/ControlButtons'
import { useAudio } from './components/hooks/useAudio'
import { useBackgroundVideo } from './components/hooks/useBackgroundVideo'
import styles from './Page.module.scss'

export interface Music {
  id: number
  titulo: string
  artista: string
  genero: string
  duracao: string
  bpm: number
  ano: number
  producao: { produtor: string; pais: string; gravadora: string }
  instrumentos: string[]
  ambiente: string
  cores_predominantes: string[]
  arquivo_mp3: string
}

export default function MusicPage() {
  const [musics,      setMusics]      = useState<Music[]>([])
  const [selectedId,  setSelectedId]  = useState(1)
  const [audioFile,   setAudioFile]   = useState<string | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [showOutput,  setShowOutput]  = useState(false)
  const [apiStatus,   setApiStatus]   = useState<'online' | 'offline' | 'checking'>('checking')

  const { videoRef } = useBackgroundVideo()
  const selected = musics.find(m => m.id === selectedId) ?? musics[0]

  const { isPlaying, progress, currentTime, duration, togglePlay, seek, formatTime } =
    useAudio(audioFile)

  const checkApi = useCallback(() => {
    fetch('/api/music')
      .then(r => r.ok ? setApiStatus('online') : setApiStatus('offline'))
      .catch(() => setApiStatus('offline'))
  }, [])

  useEffect(() => {
    fetch('/api/music')
      .then(r => r.json())
      .then((data: unknown) => {
        const arr = Array.isArray(data)
          ? data
          : (data as any)?.musics ?? (data as any)?.data ?? []
        setMusics(arr)
        setLoading(false)
        setApiStatus('online')
      })
      .catch(() => {
        setLoading(false)
        setApiStatus('offline')
      })
  }, [])

  useEffect(() => {
    const interval = setInterval(checkApi, 30000)
    return () => clearInterval(interval)
  }, [checkApi])

  const handleSelect = useCallback((id: number) => {
    setSelectedId(id)
    setAudioFile(null)
    setShowOutput(false)
  }, [])

  const onAudioReady = useEffectEvent(() => {
    togglePlay()
  })

  const handleIniciar = useCallback(() => {
    if (!selected) return
    setAudioFile(selected.arquivo_mp3)
    setShowOutput(true)
  }, [selected])

  useEffect(() => {
    if (!audioFile) return
    const frameId = requestAnimationFrame(() => onAudioReady())
    return () => cancelAnimationFrame(frameId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioFile])

  const handleRetornar = useCallback(() => {
    setAudioFile(null)
    setShowOutput(false)
    seek(0)
  }, [seek])

  const handlePrev = useCallback(() => {
    if (!musics.length) return
    const idx  = musics.findIndex(m => m.id === selectedId)
    const prev = musics[(idx - 1 + musics.length) % musics.length]
    handleSelect(prev.id)
  }, [musics, selectedId, handleSelect])

  const handleNext = useCallback(() => {
    if (!musics.length) return
    const idx  = musics.findIndex(m => m.id === selectedId)
    const next = musics[(idx + 1) % musics.length]
    handleSelect(next.id)
  }, [musics, selectedId, handleSelect])

  if (loading || !selected) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingText}>// CARREGANDO SISTEMA...</span>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.gridOverlay} />

      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          src="/background.mp4"
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className={styles.videoVignette} />
      </div>

      <div className={styles.scanlines} />

      <div className={styles.layout}>
        <div className={styles.leftCol}>
          <MusicContainer
            musics={musics}
            selected={selected}
            isPlaying={isPlaying}
            showOutput={showOutput}
            onSelect={handleSelect}
            onIniciar={handleIniciar}
            onRetornar={handleRetornar}
          />
          <div className={styles.playerArea}>
            <ControlButtons
              isPlaying={isPlaying}
              progress={progress}
              currentTime={formatTime(currentTime)}
              duration={formatTime(duration)}
              onTogglePlay={togglePlay}
              onSeek={seek}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.pageLabel}>// gerenciador</div>
          <h1 className={styles.pageTitle}>
            MUSIC<br /><em>MANAGER</em>
          </h1>

          <div className={styles.tags}>
            <span className={`${styles.tag} ${styles.tagBlue}`}>{selected.genero}</span>
            <span className={`${styles.tag} ${styles.tagPink}`}>{selected.producao.gravadora}</span>
            <span className={`${styles.tag} ${styles.tagPurple}`}>{selected.producao.pais}</span>
            <span className={`${styles.tag} ${styles.tagGreen}`}>{selected.bpm} BPM</span>
          </div>

          <div className={`${styles.apiStatus} ${styles[apiStatus]}`}>
            <span className={styles.apiDot} />
            <span className={styles.apiLabel}>API</span>
            <span className={styles.apiValue}>
              {apiStatus === 'online' ? 'ONLINE' : apiStatus === 'offline' ? 'OFFLINE' : 'VERIFICANDO...'}
            </span>
            <span className={styles.apiEndpoint}>:8080/api/musics</span>
          </div>

          <div>
            <div className={styles.sectionLabel}>// ambiente</div>
            <p className={styles.ambienteText}>{selected.ambiente}</p>
          </div>

          <div>
            <div className={styles.sectionLabel}>// instrumentos</div>
            <div className={styles.instrumentos}>
              {selected.instrumentos.map((instr, i) => (
                <div key={i} className={styles.instrItem}>{instr}</div>
              ))}
            </div>
          </div>

          <div>
            <div className={styles.sectionLabel}>// cores predominantes</div>
            <div className={styles.colorsRow}>
              {selected.cores_predominantes.map((cor, i) => (
                <div key={i} className={styles.colorChip}>
                  <div
                    className={styles.colorDot}
                    style={{
                      background: corToHex(cor),
                      boxShadow: `0 0 12px ${corToHex(cor)}`,
                    }}
                  />
                  <span>{cor}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.producaoCard}>
            <div className={styles.sectionLabel}>// produção</div>
            <div className={styles.producaoGrid}>
              <span className={styles.pKey}>Produtor</span>
              <span className={styles.pVal}>{selected.producao.produtor}</span>
              <span className={styles.pKey}>País</span>
              <span className={styles.pVal}>{selected.producao.pais}</span>
              <span className={styles.pKey}>Gravadora</span>
              <span className={styles.pVal}>{selected.producao.gravadora}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function corToHex(cor: string): string {
  const map: Record<string, string> = {
    'Verde neon':            '#12E2DC',
    'Azul neon':             '#00d4ff',
    'Roxo':                  '#b44fff',
    'Rosa neon':             '#ff2d78',
    'Azul elétrico':         '#0088ff',
    'Preto profundo':        '#1a1a2e',
    'Rosa vibrante':         '#ff3399',
    'Amarelo neon':          '#f0e040',
    'Azul ciano':            '#00e5ff',
    'Roxo profundo':         '#7b00ff',
    'Azul escuro':           '#003399',
    'Branco fantasmagórico': '#e8eeff',
    'Azul celeste':          '#87ceeb',
    'Rosa suave':            '#ffb3cc',
    'Roxo cósmico':          '#9b59b6',
  }
  return map[cor] ?? '#ffffff'
}