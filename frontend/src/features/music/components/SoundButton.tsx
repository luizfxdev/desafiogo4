'use client'
import { getSoundConfig, barDelays } from './utils/soundConfig'
import styles from './SoundButton.module.scss'

interface SoundButtonProps {
  bpm: number
  isPlaying: boolean
}

export default function SoundButton({ bpm, isPlaying }: SoundButtonProps) {
  const config = getSoundConfig(bpm)
  const barDuration = (60 / bpm).toFixed(3)

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.boxContainer}
        style={{ '--bar-duration': `${barDuration}s` } as React.CSSProperties}
      >
        {config.map((animType, i) => (
          <div
            key={i}
            className={[
              styles.box,
              styles[animType],
              !isPlaying ? styles.paused : '',
            ].join(' ')}
            style={{ animationDelay: `${barDelays[i] * Number(barDuration)}s` }}
          />
        ))}
      </div>
    </div>
  )
}