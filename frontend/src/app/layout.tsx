import type { Metadata } from 'next'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Music Manager — Electronic Beats',
  description: 'Gerenciador de músicas eletrônicas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}