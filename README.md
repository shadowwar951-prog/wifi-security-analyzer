# 📡 WiFiSec Analyzer

Sistema completo de evaluación de seguridad WiFi. Analiza redes inalámbricas y proporciona un score de seguridad con vulnerabilidades detectadas y recomendaciones personalizadas.

## 🚀 Deploy en Vercel

### Paso 1: Preparar el proyecto
```bash
git init
git add .
git commit -m "Initial commit: WiFiSec Analyzer"
```

### Paso 2: Subir a GitHub
```bash
gh repo create wifi-security-analyzer --public
git remote add origin https://github.com/TU_USUARIO/wifi-security-analyzer.git
git push -u origin main
```

### Paso 3: Conectar con Vercel
1. Ve a **vercel.com** e inicia sesión
2. Click en **"Add New Project"**
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es Next.js

### Paso 4: Configurar Base de Datos (Vercel Postgres)
1. En el dashboard de Vercel, ve a tu proyecto
2. Click en **"Storage"** tab
3. Click **"Create Database"** → selecciona **Postgres**
4. Dale un nombre: `wifisec-db`
5. Vercel automáticamente añade las variables de entorno

### Paso 5: Variables de entorno adicionales
En Vercel Dashboard → Settings → Environment Variables, añade:
```
DATABASE_URL=<se genera automáticamente por Vercel Postgres>
```

### Paso 6: Configurar Prisma para Vercel
En tu `vercel.json` ya está configurado el comando de build:
```json
{
  "buildCommand": "prisma generate && next build"
}
```

### Paso 7: Ejecutar migraciones
Después del primer deploy, en la terminal:
```bash
npx vercel env pull .env.production.local
npx prisma migrate deploy
```

O usando Vercel CLI:
```bash
npx vercel --prod
```

---

## 🛠️ Desarrollo Local

### Requisitos
- Node.js 18+
- PostgreSQL (local o remoto)

### Instalación
```bash
npm install
```

### Configurar base de datos local
```bash
# Crear base de datos
createdb wifisec

# Copiar variables de entorno
cp .env.example .env.local
# Edita .env.local con tu DATABASE_URL

# Ejecutar migraciones
npx prisma migrate dev

# Seed (opcional)
npx prisma db seed
```

### Ejecutar en desarrollo
```bash
npm run dev
# Abre http://localhost:3000
```

---

## 🏗️ Arquitectura

```
wifi-security-analyzer/
├── app/
│   ├── api/
│   │   ├── scan/route.ts      # POST: Analizar red, GET: Lista scans
│   │   └── history/route.ts   # GET: Historial con stats
│   ├── lib/
│   │   ├── prisma.ts          # Cliente Prisma singleton
│   │   └── wifi-analyzer.ts   # Lógica de análisis de seguridad
│   ├── historial/page.tsx     # Página historial
│   ├── educacion/page.tsx     # Guía educativa
│   ├── globals.css            # Estilos globales
│   ├── layout.tsx             # Layout raíz
│   └── page.tsx               # Página principal (analizador)
├── prisma/
│   └── schema.prisma          # Modelos de base de datos
├── vercel.json                # Configuración de deploy
└── package.json
```

## 🔒 Características de Seguridad Analizadas

1. **Protocolo de seguridad** — WPA3 > WPA2 > WPA > WEP > OPEN
2. **Algoritmo de cifrado** — AES/CCMP vs TKIP vs ninguno
3. **Intensidad de señal** — Detección de posibles Evil Twin
4. **Análisis de SSID** — Patrones sospechosos de redes maliciosas
5. **Banda de frecuencia** — 2.4 GHz vs 5 GHz
6. **Asignación de IP** — Verificación de rango privado/público
7. **Identificación de fabricante** — OUI lookup del BSSID

## 🗄️ Modelos de Base de Datos

- **WifiScan** — Resultado principal de cada análisis
- **ScanResult** — Resultados individuales de cada verificación
- **AlertLog** — Log de alertas del sistema

## 📦 Stack Tecnológico

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Deploy**: Vercel + Vercel Postgres
- **Fuentes**: Google Fonts (Syne + Space Mono)
