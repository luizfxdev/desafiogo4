'use client'

import {
  ShuffleIcon, SkipBackIcon, PlayIcon, PauseIcon, SkipForwardIcon, RepeatIcon,
} from '@phosphor-icons/react'
import styles from './ControlButtons.module.scss'

interface ControlButtonsProps {
  isPlaying: boolean
  progress: number
  currentTime: string
  duration: string
  onTogglePlay: () => void
  onSeek: (pct: number) => void
  onPrev: () => void
  onNext: () => void
}

export default function ControlButtons({
  isPlaying, progress, currentTime, duration, onTogglePlay, onSeek, onPrev, onNext,
}: ControlButtonsProps) {

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    onSeek(Math.min(100, Math.max(0, pct)))
  }

  function handleProgressKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowRight') onSeek(Math.min(100, progress + 5))
    if (e.key === 'ArrowLeft')  onSeek(Math.max(0, progress - 5))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.progressWrap}>
        <span className={styles.timeLabel}>{currentTime}</span>
        <div
          className={styles.progressBar}
          role="slider"
          aria-label="Progresso da música"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onClick={handleProgressClick}
          onKeyDown={handleProgressKey}
        >
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.timeLabel}>{duration}</span>
      </div>

      <div className={styles.buttonRow}>
        <button type="button" className={styles.button} title="Shuffle">
          <ShuffleIcon />
        </button>

        <button type="button" className={styles.button} onClick={onPrev} title="Anterior">
          <SkipBackIcon />
        </button>

        <button
          type="button"
          className={`${styles.button} ${styles.playButton} ${isPlaying ? styles.playing : ''}`}
          onClick={onTogglePlay}
          title={isPlaying ? 'Pausar' : 'Reproduzir'}
          aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          <PlayIcon className={styles.iconPlay} />
          <PauseIcon className={styles.iconPause} />
        </button>

        <button type="button" className={styles.button} onClick={onNext} title="Próxima">
          <SkipForwardIcon />
        </button>

        <button type="button" className={styles.button} title="Repetir">
          <RepeatIcon />
        </button>
      </div>
    </div>
  )
}