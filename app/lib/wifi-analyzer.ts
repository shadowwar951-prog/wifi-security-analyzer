export interface WifiNetwork {
  ssid: string
  bssid?: string
  signal: number
  frequency?: number
  channel?: number
  security: string
  encryption?: string
  vendor?: string
  ipAddress?: string
}

export interface SecurityCheck {
  checkName: string
  status: 'pass' | 'fail' | 'warning' | 'info'
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  message: string
  details?: string
}

export interface AnalysisResult {
  score: number
  riskLevel: 'SEGURA' | 'MODERADA' | 'RIESGOSA' | 'PELIGROSA'
  riskColor: string
  checks: SecurityCheck[]
  vulnerabilities: string[]
  recommendations: string[]
}

export function analyzeWifiSecurity(network: WifiNetwork): AnalysisResult {
  const checks: SecurityCheck[] = []
  const vulnerabilities: string[] = []
  const recommendations: string[] = []
  let score = 100

  // 1. Análisis del protocolo de seguridad
  const securityUpper = network.security.toUpperCase()
  
  if (securityUpper.includes('WPA3')) {
    checks.push({
      checkName: 'Protocolo de Seguridad',
      status: 'pass',
      severity: 'info',
      message: 'WPA3 detectado - Protocolo más seguro disponible',
      details: 'WPA3 utiliza cifrado SAE (Simultaneous Authentication of Equals) y ofrece protección contra ataques de diccionario.'
    })
  } else if (securityUpper.includes('WPA2')) {
    checks.push({
      checkName: 'Protocolo de Seguridad',
      status: 'warning',
      severity: 'medium',
      message: 'WPA2 detectado - Aceptable pero con limitaciones',
      details: 'WPA2 es seguro cuando se configura correctamente. Considera migrar a WPA3 si tu router lo soporta.'
    })
    score -= 10
    recommendations.push('Actualizar a WPA3 para mayor seguridad')
  } else if (securityUpper.includes('WPA')) {
    checks.push({
      checkName: 'Protocolo de Seguridad',
      status: 'fail',
      severity: 'high',
      message: 'WPA (v1) detectado - Protocolo obsoleto y vulnerable',
      details: 'WPA-TKIP ha sido comprometido. Actualiza inmediatamente a WPA2 o WPA3.'
    })
    vulnerabilities.push('Protocolo WPA obsoleto con vulnerabilidades conocidas (TKIP attacks)')
    score -= 30
    recommendations.push('Actualizar router urgentemente a WPA2/WPA3')
  } else if (securityUpper.includes('WEP')) {
    checks.push({
      checkName: 'Protocolo de Seguridad',
      status: 'fail',
      severity: 'critical',
      message: 'WEP detectado - EXTREMADAMENTE PELIGROSO',
      details: 'WEP puede ser crackeado en minutos con herramientas básicas. No conectarse bajo ninguna circunstancia.'
    })
    vulnerabilities.push('WEP completamente comprometido - puede ser descifrado en < 60 segundos')
    score -= 60
    recommendations.push('NO conectarse a esta red. WEP es inseguro por diseño.')
  } else if (securityUpper === 'OPEN' || securityUpper === 'NONE' || securityUpper === 'ABIERTA') {
    checks.push({
      checkName: 'Protocolo de Seguridad',
      status: 'fail',
      severity: 'critical',
      message: 'Red ABIERTA - Sin ningún cifrado',
      details: 'Todo el tráfico es visible para cualquier persona con un analizador de paquetes. Peligro extremo.'
    })
    vulnerabilities.push('Red sin cifrado - Todo el tráfico es interceptable (Man-in-the-Middle)')
    score -= 70
    recommendations.push('NUNCA envíes información sensible en redes abiertas')
    recommendations.push('Usa siempre VPN en redes públicas abiertas')
  }

  // 2. Análisis de señal
  const signalDb = network.signal
  if (signalDb >= -50) {
    checks.push({
      checkName: 'Intensidad de Señal',
      status: 'pass',
      severity: 'info',
      message: `Señal excelente: ${signalDb} dBm`,
      details: 'Señal fuerte indica que estás cerca del punto de acceso legítimo.'
    })
  } else if (signalDb >= -70) {
    checks.push({
      checkName: 'Intensidad de Señal',
      status: 'warning',
      severity: 'low',
      message: `Señal moderada: ${signalDb} dBm`,
      details: 'Señal aceptable. La conexión puede ser inestable en algunas condiciones.'
    })
    score -= 5
  } else {
    checks.push({
      checkName: 'Intensidad de Señal',
      status: 'fail',
      severity: 'medium',
      message: `Señal débil: ${signalDb} dBm - Posible Evil Twin`,
      details: 'Una señal muy débil puede indicar un punto de acceso malicioso (Evil Twin) que imita una red legítima.'
    })
    vulnerabilities.push('Señal débil - posible indicador de punto de acceso Evil Twin')
    score -= 15
  }

  // 3. Verificación de SSID sospechoso
  const ssid = network.ssid
  const suspiciousPatterns = [
    { pattern: /free.*wifi/i, msg: 'SSID contiene "free wifi" - patrón común en redes trampa' },
    { pattern: /public.*wifi/i, msg: 'Red pública sin verificar' },
    { pattern: /linksys|netgear|dlink|default/i, msg: 'SSID genérico de fábrica - router mal configurado' },
    { pattern: /^\s+|\s+$/g, msg: 'SSID con espacios sospechosos - técnica de spoofing' },
    { pattern: /\d{8,}/g, msg: 'SSID con secuencia larga de números - posiblemente generada' },
  ]

  let ssidSuspicious = false
  for (const sp of suspiciousPatterns) {
    if (sp.pattern.test(ssid)) {
      ssidSuspicious = true
      vulnerabilities.push(sp.msg)
      score -= 10
      break
    }
  }

  if (ssidSuspicious) {
    checks.push({
      checkName: 'Análisis de SSID',
      status: 'warning',
      severity: 'medium',
      message: 'SSID con patrones sospechosos detectados',
      details: 'El nombre de la red coincide con patrones comunes de redes maliciosas o mal configuradas.'
    })
    recommendations.push('Verifica la autenticidad de la red con el administrador del lugar')
  } else {
    checks.push({
      checkName: 'Análisis de SSID',
      status: 'pass',
      severity: 'info',
      message: 'SSID sin patrones de riesgo conocidos',
      details: 'El nombre de la red no coincide con patrones comunes de redes maliciosas.'
    })
  }

  // 4. Análisis de frecuencia
  if (network.frequency) {
    const freq = network.frequency
    if (freq >= 5000) {
      checks.push({
        checkName: 'Banda de Frecuencia',
        status: 'pass',
        severity: 'info',
        message: '5 GHz - Banda menos congestionada y más segura',
        details: 'Las redes 5 GHz tienen menor alcance, reduciendo la superficie de ataque desde el exterior.'
      })
    } else if (freq >= 2400 && freq <= 2500) {
      checks.push({
        checkName: 'Banda de Frecuencia',
        status: 'warning',
        severity: 'low',
        message: '2.4 GHz - Banda congestionada con mayor alcance',
        details: 'La banda 2.4 GHz tiene mayor alcance, lo que puede facilitar ataques desde mayor distancia.'
      })
      score -= 5
    }
  }

  // 5. Análisis de cifrado
  if (network.encryption) {
    const enc = network.encryption.toUpperCase()
    if (enc.includes('AES') || enc.includes('CCMP')) {
      checks.push({
        checkName: 'Algoritmo de Cifrado',
        status: 'pass',
        severity: 'info',
        message: 'AES/CCMP - Cifrado robusto',
        details: 'AES es el estándar de cifrado avanzado, considerado seguro para uso actual.'
      })
    } else if (enc.includes('TKIP')) {
      checks.push({
        checkName: 'Algoritmo de Cifrado',
        status: 'fail',
        severity: 'high',
        message: 'TKIP - Algoritmo deprecated y vulnerable',
        details: 'TKIP fue deprecado en 2012. Vulnerable a ataques Beck-Tews y Ohigashi-Morii.'
      })
      vulnerabilities.push('TKIP vulnerable a ataques de recuperación de clave')
      score -= 20
    }
  }

  // 6. Verificación IP (si disponible)
  if (network.ipAddress) {
    const ip = network.ipAddress
    const privateRanges = [
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./
    ]
    const isPrivate = privateRanges.some(r => r.test(ip))
    
    if (isPrivate) {
      checks.push({
        checkName: 'Asignación de IP',
        status: 'pass',
        severity: 'info',
        message: `IP privada asignada: ${ip}`,
        details: 'La dirección IP está en rango privado, lo cual es normal en redes domésticas y corporativas.'
      })
    } else {
      checks.push({
        checkName: 'Asignación de IP',
        status: 'warning',
        severity: 'medium',
        message: `IP pública directa: ${ip} - Inusual`,
        details: 'Recibir una IP pública directamente es inusual y puede indicar una red mal configurada o maliciosa.'
      })
      score -= 15
      vulnerabilities.push('IP pública asignada directamente - configuración inusual')
    }
  }

  // 7. Verificación de vendor/MAC
  if (network.vendor) {
    checks.push({
      checkName: 'Fabricante del Dispositivo',
      status: 'info',
      severity: 'info',
      message: `Fabricante identificado: ${network.vendor}`,
      details: 'El OUI (Organizationally Unique Identifier) identifica al fabricante del punto de acceso.'
    })
  } else if (network.bssid) {
    checks.push({
      checkName: 'Fabricante del Dispositivo',
      status: 'warning',
      severity: 'low',
      message: 'Fabricante no identificado - MAC posiblemente aleatoria',
      details: 'MAC address aleatoria o no registrada puede indicar técnicas de evasión de seguimiento, aunque también es usado por algunos sistemas de privacidad.'
    })
    score -= 5
  }

  // Calcular nivel de riesgo final
  score = Math.max(0, Math.min(100, score))
  
  let riskLevel: AnalysisResult['riskLevel']
  let riskColor: string

  if (score >= 80) {
    riskLevel = 'SEGURA'
    riskColor = '#15b371'
  } else if (score >= 60) {
    riskLevel = 'MODERADA'
    riskColor = '#f59e0b'
  } else if (score >= 40) {
    riskLevel = 'RIESGOSA'
    riskColor = '#f97316'
  } else {
    riskLevel = 'PELIGROSA'
    riskColor = '#ef4444'
  }

  // Recomendaciones generales
  if (score < 100) {
    recommendations.push('Usa siempre una VPN confiable al conectarte a redes públicas')
    recommendations.push('Verifica que los sitios que visitas usen HTTPS (candado en el navegador)')
    recommendations.push('Desactiva la conexión automática a redes WiFi en tu dispositivo')
  }

  if (recommendations.length === 0) {
    recommendations.push('¡Excelente! Esta red cumple con los estándares de seguridad modernos.')
    recommendations.push('Mantén actualizado el firmware de tu router periódicamente.')
  }

  return {
    score,
    riskLevel,
    riskColor,
    checks,
    vulnerabilities,
    recommendations,
  }
}

export function generateMockNetworks(): WifiNetwork[] {
  return [
    {
      ssid: 'MiCasaWiFi_5G',
      bssid: 'AA:BB:CC:DD:EE:FF',
      signal: -45,
      frequency: 5180,
      channel: 36,
      security: 'WPA3',
      encryption: 'AES',
      vendor: 'Cisco Systems',
      ipAddress: '192.168.1.105'
    },
    {
      ssid: 'Free_WiFi_Public',
      bssid: '11:22:33:44:55:66',
      signal: -72,
      frequency: 2437,
      channel: 6,
      security: 'OPEN',
      encryption: 'NONE',
      vendor: undefined,
      ipAddress: '10.0.0.45'
    },
    {
      ssid: 'Cafe_Internet',
      bssid: 'FF:EE:DD:CC:BB:AA',
      signal: -61,
      frequency: 2412,
      channel: 1,
      security: 'WPA2',
      encryption: 'AES',
      vendor: 'TP-Link Technologies',
      ipAddress: '192.168.0.23'
    },
    {
      ssid: 'NETGEAR_DEFAULT',
      bssid: '00:11:22:33:44:55',
      signal: -55,
      frequency: 2462,
      channel: 11,
      security: 'WEP',
      encryption: 'WEP',
      vendor: 'Netgear',
      ipAddress: '192.168.1.10'
    },
    {
      ssid: 'Oficina_Corp_2024',
      bssid: 'DE:AD:BE:EF:00:01',
      signal: -50,
      frequency: 5260,
      channel: 52,
      security: 'WPA2',
      encryption: 'AES',
      vendor: 'Aruba Networks',
      ipAddress: '10.10.1.87'
    }
  ]
}
