'use client'

import styles from './Button.module.scss'

type ButtonVariant = 'iniciar' | 'retornar'

interface ButtonProps {
  label: string
  variant: ButtonVariant
  onClick?: () => void
}

export default function Button({ label, variant, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[variant]}`}
      onClick={onClick}
    >
      <span>{label}</span>
      <div className={styles.wave} />
    </button>
  )
}