'use client'

import Link from 'next/link'

const protocols = [
  {
    name: 'WPA3', year: '2018', score: 100, color: '#15b371',
    description: 'El estándar más moderno. Usa SAE (Dragonfly handshake) que elimina los ataques de diccionario offline. Cifrado de 192 bits en redes enterprise.',
    pros: ['Resistente a ataques de diccionario', 'Perfect Forward Secrecy', 'Protección en redes abiertas (OWE)', 'Autenticación simultánea de iguales'],
    cons: ['No todos los dispositivos lo soportan', 'Requiere firmware actualizado'],
    recommendation: 'SIEMPRE preferir cuando esté disponible'
  },
  {
    name: 'WPA2', year: '2004', score: 75, color: '#f59e0b',
    description: 'Estándar vigente por 20 años. Usa AES-CCMP que es robusto, pero vulnerable a ataques de diccionario si la contraseña es débil.',
    pros: ['Ampliamente compatible', 'AES robusto', 'Maduro y bien probado'],
    cons: ['Vulnerable a PMKID attacks', 'Ataques de diccionario posibles', 'KRACK vulnerability (parcheada)'],
    recommendation: 'Aceptable con contraseña fuerte (+12 caracteres, aleatoria)'
  },
  {
    name: 'WPA', year: '2003', score: 35, color: '#f97316',
    description: 'Primera versión de WPA. Usa TKIP que fue diseñado como parche temporal para WEP. Múltiples vulnerabilidades conocidas.',
    pros: ['Mejor que WEP'],
    cons: ['TKIP comprometido', 'Beck-Tews attack', 'Deprecated en 2012 por IEEE', 'No usar bajo ningún concepto empresarial'],
    recommendation: 'EVITAR. Actualizar el router urgentemente.'
  },
  {
    name: 'WEP', year: '1997', score: 5, color: '#ef4444',
    description: 'Completamente roto. Puede ser descifrado en menos de 60 segundos con Aircrack-ng. El algoritmo RC4 implementado incorrectamente.',
    pros: ['Nada positivo en 2024'],
    cons: ['Crackeable en < 60 segundos', 'IV reuse attacks', 'Fluhrer-Mantin-Shamir attack', 'Prohibido en muchos países para uso bancario'],
    recommendation: 'NUNCA conectarse. Nivel de seguridad equivalente a red abierta.'
  },
  {
    name: 'OPEN', year: 'N/A', score: 0, color: '#dc2626',
    description: 'Sin cifrado. Todo el tráfico visible en texto plano. Cualquier persona en la misma red puede interceptar contraseñas, cookies y mensajes.',
    pros: ['Fácil de conectar'],
    cons: ['ZERO cifrado', 'Man-in-the-Middle trivial', 'ARP spoofing', 'SSL stripping posible', 'Packet sniffing sin esfuerzo'],
    recommendation: 'NUNCA enviar datos sensibles. Usar VPN si es absolutamente necesario.'
  }
]

const tips = [
  { icon: '🔐', title: 'Usa VPN en redes públicas', desc: 'Una VPN cifra todo tu tráfico, haciendo inútil cualquier intercepción. Es tu mejor defensa en redes desconocidas.' },
  { icon: '🔍', title: 'Verifica el HTTPS', desc: 'Asegúrate de que los sitios importantes usen HTTPS (candado verde). Nunca introduzcas contraseñas en sitios HTTP.' },
  { icon: '📵', title: 'Desactiva la conexión automática', desc: 'Los dispositivos que se conectan automáticamente son vulnerables a Evil Twin attacks. Conéctate manualmente.' },
  { icon: '🔄', title: 'Actualiza el firmware del router', desc: 'Los fabricantes liberan parches de seguridad periódicamente. Un router desactualizado es un vector de ataque.' },
  { icon: '💪', title: 'Contraseña WiFi robusta', desc: 'Mínimo 16 caracteres, mezcla mayúsculas, minúsculas, números y símbolos. Evita palabras del diccionario.' },
  { icon: '📊', title: 'Monitorea dispositivos conectados', desc: 'Revisa periódicamente qué dispositivos están en tu red. Un intruso conectado puede comprometer toda la red.' },
  { icon: '🌐', title: 'Segmenta tu red', desc: 'Usa una red de invitados separada para dispositivos IoT y visitantes. Limita el acceso a tu red principal.' },
  { icon: '🎭', title: 'Alerta de Evil Twin', desc: 'Si ves dos redes con el mismo nombre, una puede ser maliciosa. Verifica siempre el BSSID con el administrador.' },
]

export default function EducacionPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
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

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#3d7060', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>// CENTRO DE CONOCIMIENTO</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#e8f5ef', marginBottom: '1rem' }}>
            Guía de <span style={{ color: '#15b371' }}>Seguridad WiFi</span>
          </h1>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.85rem', color: '#7ab89a', maxWidth: '700px', lineHeight: 1.8 }}>
            Entiende los protocolos de seguridad inalámbrica, sus vulnerabilidades y cómo protegerte efectivamente en la era digital.
          </p>
        </div>

        {/* Protocol comparison */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.5rem', color: '#e8f5ef', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#15b371', border: '1px solid rgba(21,179,113,0.3)', padding: '0.25rem 0.5rem' }}>01</span>
            Protocolos de Seguridad Comparados
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {protocols.map((p, i) => (
              <div key={i} style={{ background: '#0a1e18', border: `1px solid ${p.color}33`, borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '0' }}>
                  {/* Left: Protocol info */}
                  <div style={{ padding: '1.5rem', background: `${p.color}08`, borderRight: `1px solid ${p.color}22`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.8rem', color: p.color }}>{p.name}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#3d7060' }}>Desde {p.year}</div>
                    {/* Score bar */}
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#3d7060', marginBottom: '0.25rem' }}>SEGURIDAD: {p.score}/100</div>
                      <div style={{ height: '4px', background: '#1a3d30', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${p.score}%`, background: p.color, borderRadius: '2px', boxShadow: `0 0 8px ${p.color}` }} />
                      </div>
                    </div>
                  </div>
                  {/* Right: Details */}
                  <div style={{ padding: '1.5rem' }}>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', color: '#7ab89a', lineHeight: 1.7, marginBottom: '1rem' }}>{p.description}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#15b371', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>✓ VENTAJAS</div>
                        {p.pros.map((pro, j) => <div key={j} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#7ab89a', marginBottom: '0.25rem' }}>• {pro}</div>)}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#ef4444', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>✗ RIESGOS</div>
                        {p.cons.map((con, j) => <div key={j} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#7ab89a', marginBottom: '0.25rem' }}>• {con}</div>)}
                      </div>
                    </div>
                    <div style={{ padding: '0.6rem 1rem', background: `${p.color}11`, border: `1px solid ${p.color}33`, borderRadius: '2px' }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: p.color }}>→ {p.recommendation}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security tips */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.5rem', color: '#e8f5ef', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#15b371', border: '1px solid rgba(21,179,113,0.3)', padding: '0.25rem 0.5rem' }}>02</span>
            Buenas Prácticas de Seguridad
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {tips.map((tip, i) => (
              <div key={i} style={{ background: '#0a1e18', border: '1px solid #1a3d30', borderRadius: '2px', padding: '1.25rem', transition: 'all 0.2s', cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#15b371'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(21,179,113,0.1)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1a3d30'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{tip.icon}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#e8f5ef', marginBottom: '0.5rem' }}>{tip.title}</div>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', color: '#7ab89a', lineHeight: 1.7 }}>{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Attack types */}
        <section>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.5rem', color: '#e8f5ef', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#15b371', border: '1px solid rgba(21,179,113,0.3)', padding: '0.25rem 0.5rem' }}>03</span>
            Tipos de Ataques WiFi Conocidos
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {[
              { name: 'Evil Twin Attack', severity: 'CRÍTICO', color: '#ef4444', desc: 'El atacante crea una red con el mismo nombre (SSID) que la legítima. Las víctimas se conectan creyendo que es la red real, permitiendo intercepción completa del tráfico.' },
              { name: 'Man-in-the-Middle', severity: 'CRÍTICO', color: '#ef4444', desc: 'El atacante se posiciona entre el usuario y el router, interceptando y potencialmente modificando toda la comunicación sin que ninguna de las partes lo detecte.' },
              { name: 'PMKID Attack', severity: 'ALTO', color: '#f97316', desc: 'Ataque moderno contra WPA2 que no requiere capturar el handshake. El PMKID en cada paquete de beacon permite ataques de diccionario offline.' },
              { name: 'Deauth Attack', severity: 'MEDIO', color: '#f59e0b', desc: 'Envío de frames de desautenticación falsos que desconectan a los usuarios de la red. Usado para forzar reconexiones y capturar handshakes WPA.' },
              { name: 'ARP Spoofing', severity: 'ALTO', color: '#f97316', desc: 'Envío de mensajes ARP falsos para asociar la MAC del atacante con la IP del gateway, redirigiendo todo el tráfico de la red a través del atacante.' },
              { name: 'SSL Stripping', severity: 'ALTO', color: '#f97316', desc: 'Downgrade de conexiones HTTPS a HTTP transparente para el usuario, permitiendo al atacante leer credenciales y datos en texto plano.' },
            ].map((attack, i) => (
              <div key={i} style={{ background: '#0a1e18', border: `1px solid ${attack.color}33`, borderRadius: '2px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#e8f5ef' }}>{attack.name}</div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: attack.color, border: `1px solid ${attack.color}44`, padding: '0.15rem 0.4rem', borderRadius: '2px', flexShrink: 0, marginLeft: '0.5rem' }}>{attack.severity}</span>
                </div>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', color: '#7ab89a', lineHeight: 1.7 }}>{attack.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ marginTop: '3rem', textAlign: 'center', padding: '3rem', background: 'rgba(21,179,113,0.05)', border: '1px solid rgba(21,179,113,0.2)', borderRadius: '2px' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#e8f5ef', marginBottom: '1rem' }}>
            ¿Listo para analizar tu red?
          </div>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', color: '#7ab89a', marginBottom: '1.5rem' }}>
            Pon a prueba el nivel de seguridad de cualquier red WiFi con nuestro analizador
          </p>
          <Link href="/" className="cyber-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.75rem 2rem' }}>
            ▶ ANALIZAR AHORA
          </Link>
        </div>
      </main>
    </div>
  )
}
