import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    const scans = await prisma.wifiScan.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        ssid: true,
        security: true,
        signal: true,
        score: true,
        riskLevel: true,
        createdAt: true,
        vulnerabilities: true,
      }
    })

    const stats = {
      total: scans.length,
      byRisk: {
        SEGURA: scans.filter(s => s.riskLevel === 'SEGURA').length,
        MODERADA: scans.filter(s => s.riskLevel === 'MODERADA').length,
        RIESGOSA: scans.filter(s => s.riskLevel === 'RIESGOSA').length,
        PELIGROSA: scans.filter(s => s.riskLevel === 'PELIGROSA').length,
      },
      avgScore: scans.length > 0 
        ? Math.round(scans.reduce((a, s) => a + s.score, 0) / scans.length) 
        : 0
    }

    return NextResponse.json({ scans, stats })
  } catch {
    return NextResponse.json({ scans: [], stats: { total: 0, byRisk: {}, avgScore: 0 } })
  }
}
