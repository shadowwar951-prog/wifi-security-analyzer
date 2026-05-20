import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { analyzeWifiSecurity, WifiNetwork } from '@/app/lib/wifi-analyzer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const network: WifiNetwork = body

    if (!network.ssid || !network.security) {
      return NextResponse.json(
        { error: 'SSID y protocolo de seguridad son requeridos' },
        { status: 400 }
      )
    }

    const analysis = analyzeWifiSecurity(network)

    // Guardar en base de datos
    const wifiScan = await prisma.wifiScan.create({
      data: {
        ssid: network.ssid,
        bssid: network.bssid,
        signal: network.signal || 0,
        frequency: network.frequency,
        channel: network.channel,
        security: network.security,
        encryption: network.encryption,
        vendor: network.vendor,
        ipAddress: network.ipAddress,
        score: analysis.score,
        riskLevel: analysis.riskLevel,
        vulnerabilities: analysis.vulnerabilities,
        recommendations: analysis.recommendations,
        scanResults: {
          create: analysis.checks.map(check => ({
            checkName: check.checkName,
            status: check.status,
            severity: check.severity,
            message: check.message,
            details: check.details,
          }))
        }
      },
      include: {
        scanResults: true,
      }
    })

    return NextResponse.json({
      id: wifiScan.id,
      analysis,
      savedAt: wifiScan.createdAt,
    })
  } catch (error) {
    console.error('Error analyzing WiFi:', error)
    
    // Si no hay DB, retornar solo el análisis
    try {
      const body = await request.clone().json()
      const analysis = analyzeWifiSecurity(body)
      return NextResponse.json({ analysis, savedAt: new Date() })
    } catch {
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }
  }
}

export async function GET() {
  try {
    const scans = await prisma.wifiScan.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { scanResults: true }
    })
    return NextResponse.json({ scans })
  } catch {
    return NextResponse.json({ scans: [], error: 'Database not available' })
  }
}
