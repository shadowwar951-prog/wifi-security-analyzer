'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ScanRecord {
  id: string
  ssid: string
  security: string
  signal: number
  score: number
  riskLevel: string
  createdAt: string
  vulnerabilities: string[]
}

interface Stats {
  total: number
  byRisk: Record<string, number>
  avgScore: number
}

const riskColors: Record<string, string> = {
  SEGURA: '#15b371',
  MODERADA: '#f59e0b',
  RIESGOSA: '#f97316',
  PELIGROSA: '#ef4444'
}

export default function HistorialPage() {
  const [scans, setScans] = useState<ScanRecord[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/history')
      .then(r => r.json())
      .then(data => {
        setScans(data.scans || [])
        setStats(data.stats || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a3d30', background: 'rgba(4,13,10,0.95)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <Link href="/" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#e8f5ef', textDecoration: 'none' }}>
            WIFI<span style={{ color: '#15b371' }}>SEC</span>
          </Link>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            {[{ href: '/', label: 'ANALIZAR' }, { href: '/historial', label: 'HISTORIAL' }, { href: '/educacion', label: 'GUÍA' }].map(l => (
              <Link key={l.href} href={l.href} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#7ab89a', textDecoration: 'none', letterSpacing: '0.08em' }}>{l.label}</Link>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d7060', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>// REGISTRO DE ANÁLISIS</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '2.5rem', color: '#e8f5ef' }}>
            Historial de <span style={{ color: '#15b371' }}>Escaneos</span>
          </h1>
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total Análisis', value: stats.total, color: '#06b6d4' },
              { label: 'Redes Seguras', value: stats.byRisk.SEGURA || 0, color: '#15b371' },
              { label: 'En Riesgo', value: (stats.byRisk.RIESGOSA || 0) + (stats.byRisk.PELIGROSA || 0), color: '#ef4444' },
              { label: 'Puntuación Promedio', value: stats.avgScore, color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#0a1e18', border: '1px solid #1a3d30', borderRadius: '2px', padding: '1.25rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#3d7060', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Scan list */}
        <div style={{ background: '#0a1e18', border: '1px solid #1a3d30', borderRadius: '2px' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1a3d30', display: 'grid', gridTemplateColumns: '1fr 100px 80px 80px 100px 120px', gap: '1rem' }}>
            {['RED', 'SEGURIDAD', 'SEÑAL', 'SCORE', 'RIESGO', 'FECHA'].map(h => (
              <div key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#3d7060', letterSpacing: '0.1em' }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', color: '#3d7060' }}>
              Cargando historial...
            </div>
          ) : scans.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', color: '#3d7060', marginBottom: '1rem' }}>No hay escaneos registrados aún</div>
              <Link href="/" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#15b371', textDecoration: 'none', border: '1px solid rgba(21,179,113,0.3)', padding: '0.5rem 1rem', borderRadius: '2px' }}>
                → REALIZAR PRIMER ANÁLISIS
              </Link>
            </div>
          ) : scans.map((scan, i) => (
            <div key={scan.id} style={{ padding: '1rem 1.5rem', borderBottom: i < scans.length - 1 ? '1px solid #1a3d30' : 'none', display: 'grid', gridTemplateColumns: '1fr 100px 80px 80px 100px 120px', gap: '1rem', alignItems: 'center', transition: 'background 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0f2820' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', color: '#e8f5ef' }}>{scan.ssid}</div>
                {scan.vulnerabilities && Array.isArray(scan.vulnerabilities) && scan.vulnerabilities.length > 0 && (
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#ef4444', marginTop: '0.2rem' }}>
                    ⚠ {scan.vulnerabilities.length} vulnerabilidad{scan.vulnerabilities.length > 1 ? 'es' : ''}
                  </div>
                )}
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', padding: '0.2rem 0.4rem', background: 'rgba(10,30,24,0.8)', border: '1px solid #1a3d30', borderRadius: '2px', color: '#7ab89a', textAlign: 'center' }}>{scan.security}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', color: scan.signal >= -60 ? '#15b371' : scan.signal >= -75 ? '#f59e0b' : '#ef4444' }}>{scan.signal} dBm</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '1rem', fontWeight: 700, color: riskColors[scan.riskLevel] || '#7ab89a' }}>{scan.score}</div>
              <div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', padding: '0.2rem 0.5rem', background: `${riskColors[scan.riskLevel] || '#3d7060'}22`, color: riskColors[scan.riskLevel] || '#3d7060', border: `1px solid ${riskColors[scan.riskLevel] || '#3d7060'}44`, borderRadius: '2px' }}>
                  {scan.riskLevel}
                </span>
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#3d7060' }}>
                {new Date(scan.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
