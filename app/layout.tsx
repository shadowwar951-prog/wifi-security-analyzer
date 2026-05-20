import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WiFi Security Analyzer | Evalúa tu seguridad',
  description: 'Analiza la seguridad de redes WiFi y protege tu privacidad digital. Sistema de evaluación avanzado con puntuación y recomendaciones.',
  keywords: 'wifi, seguridad, análisis, redes, ciberseguridad, wpa3, wpa2',
  openGraph: {
    title: 'WiFi Security Analyzer',
    description: 'Evalúa qué tan seguro es conectarte a una red WiFi',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📡</text></svg>" />
      </head>
      <body className="grid-bg">
        {children}
      </body>
    </html>
  )
}
