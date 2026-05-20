import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  
  // Sample data
  const sampleScans = [
    { ssid: 'CorporateWiFi_5G', security: 'WPA3', signal: -45, score: 95, riskLevel: 'SEGURA', encryption: 'AES', frequency: 5260 },
    { ssid: 'Free_Airport_WiFi', security: 'OPEN', signal: -68, score: 5, riskLevel: 'PELIGROSA', encryption: 'NONE', frequency: 2437 },
    { ssid: 'CafeNET', security: 'WPA2', signal: -58, score: 72, riskLevel: 'MODERADA', encryption: 'AES', frequency: 2462 },
  ]

  for (const scan of sampleScans) {
    await prisma.wifiScan.create({
      data: {
        ...scan,
        vulnerabilities: scan.security === 'OPEN' ? ['Red sin cifrado'] : [],
        recommendations: ['Usar VPN siempre'],
      }
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
