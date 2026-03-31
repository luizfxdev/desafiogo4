'use client'

import Container from '@/shared/components/Container/Container'
import Button from '@/shared/components/Button/Button'
import SoundButton from './SoundButton'
import styles from './MusicContainer.module.scss'
import type { Music } from '../Page'

interface MusicContainerProps {
  musics: Music[]
  selected: Music
  isPlaying: boolean
  showOutput: boolean
  onSelect: (id: number) => void
  onIniciar: () => void
  onRetornar: () => void
}

function JsonLine({ label, value, isLast = false }: { label: string; value: string | number; isLast?: boolean }) {
  const isStr = typeof value === 'string'
  return (
    <div>
      <span className={styles.key}>&quot;{label}&quot;</span>
      <span className={styles.punc}>: </span>
      {isStr
        ? <span className={styles.str}>&quot;{value}&quot;</span>
        : <span className={styles.num}>{value}</span>
      }
      {!isLast && <span className={styles.punc}>,</span>}
    </div>
  )
}

export default function MusicContainer({
  musics, selected, isPlaying, showOutput, onSelect, onIniciar, onRetornar,
}: MusicContainerProps) {
  return (
    <Container>
      {/* A - Título */}
      <div className={styles.header}>
        <div className={styles.trackLabel}>// faixa ativa</div>
        <div className={styles.trackTitle}>
          {selected.titulo.toUpperCase()}
          <SoundButton bpm={selected.bpm} isPlaying={isPlaying} />
        </div>
        <div className={styles.trackArtist}>{selected.artista} — {selected.genero}</div>
      </div>

      {/* B - Select */}
      <div className={styles.selectWrap}>
        <label htmlFor="music-select">// selecionar faixa</label>
        <select
          id="music-select"
          className={styles.select}
          value={selected.id}
          onChange={e => onSelect(Number(e.target.value))}
        >
          {musics.map(m => (
            <option key={m.id} value={m.id}>
              {String(m.id).padStart(2, '0')} — {m.titulo} · {m.artista.split(',')[0]}
            </option>
          ))}
        </select>
      </div>

      {/* C - Card stats */}
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <span className={`${styles.statValue} ${styles.bpm}`}>{selected.bpm}</span>
          <span className={styles.statLabel}>BPM</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statValue} ${styles.dur}`}>{selected.duracao}</span>
          <span className={styles.statLabel}>DUR</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statValue} ${styles.year}`}>{selected.ano}</span>
          <span className={styles.statLabel}>ANO</span>
        </div>
      </div>

      {/* D - Botões */}
      <div className={styles.btnRow}>
        <Button label="INICIAR" variant="iniciar" onClick={onIniciar} />
        <Button label="RETORNAR" variant="retornar" onClick={onRetornar} />
      </div>

      {/* E - Output terminal (só após INICIAR) */}
      {showOutput && (
        <div className={styles.jsonOutput}>
          <div className={styles.outputLabel}>OUTPUT_TERMINAL</div>
          <div key={selected.id} className={styles.jsonPre}>
            <span className={styles.bracket}>{'{'}</span>{'\n'}
            {'  '}<JsonLine label="id" value={selected.id} />{'\n'}
            {'  '}<JsonLine label="titulo" value={selected.titulo} />{'\n'}
            {'  '}<JsonLine label="artista" value={selected.artista} />{'\n'}
            {'  '}<JsonLine label="genero" value={selected.genero} />{'\n'}
            {'  '}<JsonLine label="duracao" value={selected.duracao} />{'\n'}
            {'  '}<JsonLine label="bpm" value={selected.bpm} />{'\n'}
            {'  '}<JsonLine label="ano" value={selected.ano} />{'\n'}
            {'  '}<span className={styles.key}>&quot;producao&quot;</span>
            <span className={styles.punc}>: </span>
            <span className={styles.bracket}>{'{'}</span>{'\n'}
            {'    '}<JsonLine label="produtor" value={selected.producao.produtor} />{'\n'}
            {'    '}<JsonLine label="pais" value={selected.producao.pais} />{'\n'}
            {'    '}<JsonLine label="gravadora" value={selected.producao.gravadora} isLast />{'\n'}
            {'  '}<span className={styles.bracket}>{'}'}</span>
            <span className={styles.punc}>,</span>{'\n'}
            {'  '}<span className={styles.key}>&quot;instrumentos&quot;</span>
            <span className={styles.punc}>: </span>
            <span className={styles.bracket}>[</span>{'\n'}
            {selected.instrumentos.map((instr, i) => (
              <span key={i}>
                {'    '}<span className={styles.str}>&quot;{instr}&quot;</span>
                {i < selected.instrumentos.length - 1 && <span className={styles.punc}>,</span>}
                {'\n'}
              </span>
            ))}
            {'  '}<span className={styles.bracket}>]</span>
            <span className={styles.punc}>,</span>{'\n'}
            {'  '}<JsonLine label="ambiente" value={selected.ambiente} />{'\n'}
            {'  '}<span className={styles.key}>&quot;cores_predominantes&quot;</span>
            <span className={styles.punc}>: </span>
            <span className={styles.bracket}>[</span>
            {selected.cores_predominantes.map((c, i) => (
              <span key={i}>
                <span className={styles.str}>&quot;{c}&quot;</span>
                {i < selected.cores_predominantes.length - 1 && <span className={styles.punc}>, </span>}
              </span>
            ))}
            <span className={styles.bracket}>]</span>{'\n'}
            <span className={styles.bracket}>{'}'}</span>
          </div>
        </div>
      )}
    </Container>
  )
}