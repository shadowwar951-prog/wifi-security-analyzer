'use client'

import { useState, useEffect } from 'react'
import { analyzeWifiSecurity, generateMockNetworks, WifiNetwork, AnalysisResult } from './lib/wifi-analyzer'
import Link from 'next/link'

// ---- COMPONENTS ----

function Header() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('es-CO', { hour12: false }))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header style={{ borderBottom: '1px solid #1a3d30', background: 'rgba(4,13,10,0.95)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '32px', height: '32px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(21,179,113,0.2)', border: '1px solid rgba(21,179,113,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WifiIcon size={16} color="#15b371" />
            </div>
            <div style={{ position: 'absolute', inset: '-4px', borderRadius: '50%', border: '1px solid rgba(21,179,113,0.2)', animation: 'pulse-ring 2s infinite' }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em', color: '#e8f5ef' }}>
              WIFI<span style={{ color: '#15b371' }}>SEC</span>
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#3d7060', letterSpacing: '0.1em' }}>ANALYZER v2.0</div>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <NavLink href="/" label="ANALIZAR" />
          <NavLink href="/historial" label="HISTORIAL" />
          <NavLink href="/educacion" label="GUÍA" />
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#3d7060', padding: '0.25rem 0.5rem', border: '1px solid #1a3d30', borderRadius: '2px' }}>
            {time || '--:--:--'}
          </div>
        </nav>
      </div>
    </header>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', color: '#7ab89a', textDecoration: 'none', padding: '0.25rem 0', borderBottom: '1px solid transparent', transition: 'all 0.2s' }}
      onMouseEnter={e => { (e.target as HTMLElement).style.color = '#15b371'; (e.target as HTMLElement).style.borderBottomColor = '#15b371' }}
      onMouseLeave={e => { (e.target as HTMLElement).style.color = '#7ab89a'; (e.target as HTMLElement).style.borderBottomColor = 'transparent' }}>
      {label}
    </Link>
  )
}

function WifiIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
      <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
      <line x1="12" y1="20" x2="12.01" y2="20"/>
    </svg>
  )
}

function ScoreGauge({ score, riskLevel, riskColor }: { score: number; riskLevel: string; riskColor: string }) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{ position: 'relative', width: '180px', height: '180px' }}>
        <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#1a3d30" strokeWidth="8" />
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke={riskColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)', filter: `drop-shadow(0 0 8px ${riskColor})` }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '2.5rem', fontWeight: 700, color: riskColor, lineHeight: 1, textShadow: `0 0 20px ${riskColor}` }}>
            {score}
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#3d7060', marginTop: '0.25rem' }}>PUNTOS</div>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.15em',
          color: riskColor, textShadow: `0 0 20px ${riskColor}`
        }}>
          RED {riskLevel}
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d7060', marginTop: '0.25rem' }}>
          {score >= 80 ? '✓ SEGURO CONECTARSE' : score >= 60 ? '⚠ PRECAUCIÓN' : score >= 40 ? '⚠ RIESGO ELEVADO' : '✗ NO CONECTARSE'}
        </div>
      </div>
    </div>
  )
}

function CheckItem({ check }: { check: AnalysisResult['checks'][0] }) {
  const [open, setOpen] = useState(false)
  const icons = { pass: '✓', fail: '✗', warning: '⚠', info: 'ℹ' }
  const colors = { pass: '#15b371', fail: '#ef4444', warning: '#f59e0b', info: '#06b6d4' }
  const bg = { pass: 'rgba(21,179,113,0.08)', fail: 'rgba(239,68,68,0.08)', warning: 'rgba(245,158,11,0.08)', info: 'rgba(6,182,212,0.08)' }

  return (
    <div style={{ border: `1px solid ${colors[check.status]}33`, borderRadius: '2px', background: bg[check.status], marginBottom: '0.5rem', overflow: 'hidden', transition: 'all 0.2s' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.9rem', color: colors[check.status], flexShrink: 0, width: '20px', textAlign: 'center' }}>
          {icons[check.status]}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#3d7060', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{check.checkName}</div>
          <div style={{ fontSize: '0.85rem', color: '#e8f5ef', marginTop: '0.15rem' }}>{check.message}</div>
        </div>
        <span style={{ color: '#3d7060', fontSize: '0.7rem', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
      </div>
      {open && check.details && (
        <div style={{ padding: '0.75rem 1rem 0.75rem 2.75rem', borderTop: `1px solid ${colors[check.status]}22` }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', color: '#7ab89a', lineHeight: 1.6 }}>{check.details}</p>
        </div>
      )}
    </div>
  )
}

function ScanForm({ onAnalyze, isLoading }: { onAnalyze: (n: WifiNetwork) => void; isLoading: boolean }) {
  const [form, setForm] = useState<WifiNetwork>({
    ssid: '',
    bssid: '',
    signal: -60,
    frequency: 2437,
    channel: 6,
    security: 'WPA2',
    encryption: 'AES',
    vendor: '',
    ipAddress: '',
  })

  const set = (k: keyof WifiNetwork, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const securityOptions = ['WPA3', 'WPA2', 'WPA', 'WEP', 'OPEN']
  const encryptionOptions = ['AES', 'TKIP', 'NONE']

  return (
    <div className="cyber-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#15b371', boxShadow: '0 0 8px #15b371', animation: 'blink 1s infinite' }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#15b371', letterSpacing: '0.1em' }}>INGRESAR DATOS DE RED</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d7060', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Nombre de Red (SSID) *</label>
          <input className="cyber-input" value={form.ssid} onChange={e => set('ssid', e.target.value)} placeholder="Ej: MiCasaWiFi_5G" style={{ width: '100%' }} />
        </div>

        <div>
          <label style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d7060', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Protocolo de Seguridad *</label>
          <select className="cyber-input" value={form.security} onChange={e => set('security', e.target.value)} style={{ width: '100%' }}>
            {securityOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d7060', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Cifrado</label>
          <select className="cyber-input" value={form.encryption} onChange={e => set('encryption', e.target.value)} style={{ width: '100%' }}>
            {encryptionOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d7060', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Intensidad de Señal (dBm)</label>
          <input className="cyber-input" type="number" value={form.signal} onChange={e => set('signal', parseInt(e.target.value))} min="-100" max="0" placeholder="-60" style={{ width: '100%' }} />
        </div>

        <div>
          <label style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d7060', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Frecuencia (MHz)</label>
          <input className="cyber-input" type="number" value={form.frequency} onChange={e => set('frequency', parseInt(e.target.value))} placeholder="2437" style={{ width: '100%' }} />
        </div>

        <div>
          <label style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d7060', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>BSSID (MAC Address)</label>
          <input className="cyber-input" value={form.bssid} onChange={e => set('bssid', e.target.value)} placeholder="AA:BB:CC:DD:EE:FF" style={{ width: '100%' }} />
        </div>

        <div>
          <label style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d7060', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>IP Asignada</label>
          <input className="cyber-input" value={form.ipAddress} onChange={e => set('ipAddress', e.target.value)} placeholder="192.168.1.105" style={{ width: '100%' }} />
        </div>

        <div>
          <label style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d7060', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Fabricante (opcional)</label>
          <input className="cyber-input" value={form.vendor} onChange={e => set('vendor', e.target.value)} placeholder="Ej: TP-Link Technologies" style={{ width: '100%' }} />
        </div>
      </div>

      <button
        className="cyber-btn"
        disabled={!form.ssid || !form.security || isLoading}
        onClick={() => onAnalyze(form)}
        style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.8rem', padding: '0.9rem' }}
      >
        {isLoading ? '▶ ANALIZANDO RED...' : '▶ INICIAR ANÁLISIS DE SEGURIDAD'}
      </button>
    </div>
  )
}

function QuickScan({ onSelect }: { onSelect: (n: WifiNetwork) => void }) {
  const networks = generateMockNetworks()
  const colors = { WPA3: '#15b371', WPA2: '#f59e0b', WPA: '#f97316', WEP: '#ef4444', OPEN: '#ef4444' }
  
  return (
    <div className="cyber-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#3d7060', letterSpacing: '0.1em' }}>// REDES DE MUESTRA</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {networks.map((n, i) => (
          <button key={i} onClick={() => onSelect(n)} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem',
            background: 'rgba(10,30,24,0.5)', border: '1px solid #1a3d30', borderRadius: '2px',
            cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.2s'
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#15b371'; (e.currentTarget as HTMLElement).style.background = 'rgba(21,179,113,0.05)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1a3d30'; (e.currentTarget as HTMLElement).style.background = 'rgba(10,30,24,0.5)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[n.security as keyof typeof colors] || '#3d7060', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', color: '#e8f5ef' }}>{n.ssid}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#3d7060' }}>{n.security} • {n.signal} dBm • {n.frequency && n.frequency >= 5000 ? '5GHz' : '2.4GHz'}</div>
            </div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: colors[n.security as keyof typeof colors] || '#3d7060', padding: '0.15rem 0.4rem', border: `1px solid ${colors[n.security as keyof typeof colors] || '#3d7060'}44`, borderRadius: '2px' }}>
              {n.security}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function AnalysisPanel({ result, network }: { result: AnalysisResult; network: WifiNetwork }) {
  const [activeTab, setActiveTab] = useState<'checks' | 'vulns' | 'recs'>('checks')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Score */}
      <div className="cyber-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d7060', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Análisis completado › {network.ssid}
        </div>
        <ScoreGauge score={result.score} riskLevel={result.riskLevel} riskColor={result.riskColor} />
        <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '300px' }}>
          {[
            { label: 'CHECKS', value: result.checks.length, color: '#06b6d4' },
            { label: 'VULNS', value: result.vulnerabilities.length, color: result.vulnerabilities.length > 0 ? '#ef4444' : '#15b371' },
            { label: 'RECOMEND.', value: result.recommendations.length, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '0.5rem', background: 'rgba(10,30,24,0.5)', border: `1px solid ${s.color}33`, borderRadius: '2px' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: '#3d7060', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="cyber-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0', marginBottom: '1rem', borderBottom: '1px solid #1a3d30' }}>
          {[
            { key: 'checks', label: 'VERIFICACIONES' },
            { key: 'vulns', label: 'VULNERABILIDADES' },
            { key: 'recs', label: 'RECOMENDACIONES' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} style={{
              fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.08em',
              padding: '0.6rem 1rem', background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === tab.key ? '#15b371' : '#3d7060',
              borderBottom: activeTab === tab.key ? '2px solid #15b371' : '2px solid transparent',
              marginBottom: '-1px', transition: 'all 0.2s'
            }}>{tab.label}</button>
          ))}
        </div>

        {activeTab === 'checks' && (
          <div>
            {result.checks.map((check, i) => <CheckItem key={i} check={check} />)}
          </div>
        )}

        {activeTab === 'vulns' && (
          <div>
            {result.vulnerabilities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#15b371', fontFamily: "'Space Mono', monospace", fontSize: '0.85rem' }}>
                ✓ No se encontraron vulnerabilidades
              </div>
            ) : result.vulnerabilities.map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '2px', marginBottom: '0.5rem' }}>
                <span style={{ color: '#ef4444', flexShrink: 0 }}>⚠</span>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', color: '#e8f5ef', lineHeight: 1.5 }}>{v}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recs' && (
          <div>
            {result.recommendations.map((rec, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'rgba(21,179,113,0.05)', border: '1px solid rgba(21,179,113,0.15)', borderRadius: '2px', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", color: '#15b371', flexShrink: 0, fontSize: '0.8rem' }}>{String(i+1).padStart(2,'0')}.</span>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', color: '#e8f5ef', lineHeight: 1.5 }}>{rec}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function HeroSection({ onScrollToForm }: { onScrollToForm: () => void }) {
  return (
    <section style={{ padding: '5rem 1.5rem 3rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.75rem', border: '1px solid rgba(21,179,113,0.3)', borderRadius: '2px', marginBottom: '2rem', background: 'rgba(21,179,113,0.05)' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#15b371', animation: 'blink 1.5s infinite' }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#15b371', letterSpacing: '0.1em' }}>SISTEMA ACTIVO — ANÁLISIS EN TIEMPO REAL</span>
      </div>

      <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
        <span style={{ color: '#e8f5ef' }}>Evalúa la</span><br />
        <span style={{ color: '#15b371', textShadow: '0 0 40px rgba(21,179,113,0.4)' }}>Seguridad WiFi</span><br />
        <span style={{ color: '#e8f5ef' }}>antes de conectarte</span>
      </h1>

      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.9rem', color: '#7ab89a', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
        Analiza protocolos de seguridad, detecta vulnerabilidades conocidas y recibe recomendaciones personalizadas para proteger tu privacidad digital.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
        <button className="cyber-btn" onClick={onScrollToForm} style={{ fontSize: '0.8rem' }}>▶ ANALIZAR AHORA</button>
        <Link href="/educacion" style={{
          fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.08em',
          padding: '0.75rem 1.5rem', border: '1px solid #1a3d30', color: '#7ab89a',
          textDecoration: 'none', borderRadius: '2px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          transition: 'all 0.2s'
        }}>→ VER GUÍA DE SEGURIDAD</Link>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '0', borderTop: '1px solid #1a3d30', borderBottom: '1px solid #1a3d30', padding: '1.5rem 0', justifyContent: 'center' }}>
        {[
          { num: '7', label: 'Factores Analizados' },
          { num: '4', label: 'Niveles de Riesgo' },
          { num: '∞', label: 'Análisis Ilimitados' },
          { num: '100%', label: 'Gratis y Privado' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '0 2rem', textAlign: 'center', borderRight: i < 3 ? '1px solid #1a3d30' : 'none' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.8rem', color: '#15b371' }}>{s.num}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#3d7060', marginTop: '0.25rem', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ---- MAIN PAGE ----

export default function HomePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [currentNetwork, setCurrentNetwork] = useState<WifiNetwork | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formRef, setFormRef] = useState<HTMLElement | null>(null)

  const handleAnalyze = async (network: WifiNetwork) => {
    setIsLoading(true)
    
    // Simulate API call with small delay for UX
    await new Promise(r => setTimeout(r, 1200))
    
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(network),
      })
      const data = await res.json()
      setResult(data.analysis)
    } catch {
      // Fallback to client-side analysis
      const analysis = analyzeWifiSecurity(network)
      setResult(analysis)
    }
    
    setCurrentNetwork(network)
    setIsLoading(false)
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      
      <HeroSection onScrollToForm={() => {
        document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })
      }} />

      {/* Main Analyzer */}
      <section id="analyzer" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Left: Form + Quick Scan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d7060', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#15b371' }}>01</span> — CONFIGURAR ANÁLISIS
            </div>
            <ScanForm onAnalyze={handleAnalyze} isLoading={isLoading} />
            
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d7060', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ color: '#15b371' }}>02</span> — O ELEGIR RED DE MUESTRA
            </div>
            <QuickScan onSelect={n => { handleAnalyze(n) }} />
          </div>

          {/* Right: Results */}
          <div id="results">
            {isLoading ? (
              <div className="cyber-card" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      position: 'absolute', inset: `${i * 10}px`,
                      borderRadius: '50%', border: `1px solid rgba(21,179,113,${0.5 - i * 0.15})`,
                      animation: `pulse-ring 2s ${i * 0.3}s infinite`
                    }} />
                  ))}
                  <div style={{ position: 'absolute', inset: '30px', borderRadius: '50%', background: 'rgba(21,179,113,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <WifiIcon size={20} color="#15b371" />
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.85rem', color: '#15b371', textAlign: 'center' }}>Analizando red...</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d7060', textAlign: 'center', marginTop: '0.5rem' }}>Evaluando protocolos de seguridad</div>
                </div>
                {['Verificando protocolo WPA...', 'Analizando cifrado...', 'Escaneando vulnerabilidades...', 'Generando recomendaciones...'].map((msg, i) => (
                  <div key={i} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: i === 0 ? '#15b371' : '#1a3d30', transition: 'color 0.5s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#15b371' }}>›</span> {msg}
                  </div>
                ))}
              </div>
            ) : result && currentNetwork ? (
              <AnalysisPanel result={result} network={currentNetwork} />
            ) : (
              <div className="cyber-card" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', minHeight: '400px', justifyContent: 'center' }}>
                <div style={{ position: 'relative', opacity: 0.4 }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '1px solid #1a3d30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <WifiIcon size={32} color="#1a3d30" />
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', color: '#3d7060' }}>Sistema en espera</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#1a3d30', marginTop: '0.5rem' }}>Ingresa los datos de la red WiFi<br />o selecciona una red de muestra</div>
                </div>
                <div style={{ width: '100%', maxWidth: '250px', height: '1px', background: 'linear-gradient(90deg, transparent, #1a3d30, transparent)' }} />
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#1a3d30', letterSpacing: '0.1em' }}>AWAITING_INPUT<span className="blink">_</span></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1a3d30', padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#1a3d30' }}>
          © 2025 WIFISEC ANALYZER — Protege tu privacidad digital
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['ANALIZAR', 'HISTORIAL', 'GUÍA'].map(item => (
            <span key={item} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#1a3d30', letterSpacing: '0.1em' }}>{item}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
