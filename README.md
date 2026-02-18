# 💰 Asset Wallet

**Aplicación web para registrar, analizar y visualizar el rendimiento de un portafolio de activos financieros.**

Diseñada con una interfaz mobile-first inspirada en [Exodus Wallet](https://www.exodus.com/), con estética dark premium, gradientes sutiles y navegación fluida.

---

## ⚡ Creado con Vibe Coding

Este proyecto fue desarrollado en su totalidad mediante **Vibe Coding** — un enfoque de desarrollo asistido por IA donde la aplicación se construyó de forma conversacional e iterativa usando **GitHub Copilot (Agent Mode)** como copiloto de desarrollo.

Desde la arquitectura inicial hasta cada componente, estilo CSS y migración a Supabase, todo fue generado a través de instrucciones en lenguaje natural, revisiones en tiempo real y refinamiento progresivo. Sin escribir código manualmente.

**Stack de Vibe Coding:**
- 🤖 GitHub Copilot con Claude como modelo de IA
- 💬 Desarrollo conversacional iterativo en VS Code
- 🔄 Ciclos rápidos de prompt → generación → revisión → ajuste

---

## 🛠 Tech Stack

| Tecnología | Uso |
|---|---|
| **Next.js 15** | Framework React con App Router |
| **React 19** | UI con componentes client-side |
| **Supabase** | Auth (email/password) + Base de datos PostgreSQL |
| **Chart.js 4** | Gráficos interactivos (línea, dona, barras) |
| **react-icons** | Iconografía (Heroicons 2 + Remix Icons) |
| **CSS puro** | Estilos custom sin frameworks, mobile-first |

---

## 📱 Características

- **Dashboard** — Balance total con glow animado, estadísticas rápidas y gráfico de distribución
- **Gestión de activos** — CRUD completo con 8 tipos (Acciones, Crypto, Bonos, Bienes Raíces, Fondos, Ahorro, Commodities, Otro)
- **Registro de valores** — Historial de valuaciones por activo con fecha y notas
- **Analítica** — Timeline del portafolio, rendimiento por activo, distribución por tipo
- **Autenticación** — Login/Registro con email y contraseña vía Supabase Auth
- **Row Level Security** — Cada usuario solo accede a sus propios datos
- **Exportar/Importar** — Respaldo en JSON
- **Responsive** — UI optimizada para móvil (600px) con bottom navigation estilo app nativa
- **Dark theme** — Paleta Exodus con gradientes azul-púrpura

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com/) (plan gratuito funciona)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/asset-wallet.git
cd asset-wallet
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

Crea un proyecto en [supabase.com](https://supabase.com/) y ejecuta el contenido de `supabase-schema.sql` en el **SQL Editor** de tu dashboard. Esto crea las tablas `assets`, `transactions` y `settings` con políticas RLS.

### 4. Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

Ambos valores están en **Settings → API** de tu proyecto en Supabase.

### 5. Configurar Auth

En el dashboard de Supabase ve a **Authentication → Providers** y asegúrate de que **Email** esté habilitado. Si quieres login sin confirmación por correo, desactiva "Confirm email" en **Authentication → Settings**.

### 6. Ejecutar

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) y regístrate con tu email.

---

## 📂 Estructura del proyecto

```
asset-wallet/
├── app/
│   ├── globals.css          # Estilos globales (dark theme Exodus)
│   ├── icon.svg             # Favicon con gradiente
│   ├── layout.jsx           # Root layout
│   └── page.jsx             # Entry point (Auth gate)
├── components/
│   ├── AppShell.jsx         # Layout principal (header + nav + content)
│   ├── BottomNav.jsx        # Navegación inferior estilo app
│   ├── LoginPage.jsx        # Login/Registro con Supabase Auth
│   ├── charts/              # Gráficos Chart.js
│   ├── modals/              # Modales (agregar activo, registrar valor)
│   ├── ui/                  # Componentes UI (notificaciones)
│   └── views/               # Vistas (Dashboard, Assets, Analytics, Settings)
├── context/
│   ├── AuthContext.jsx      # Autenticación con Supabase
│   └── PortfolioContext.jsx # Estado global del portafolio
├── lib/
│   ├── chartSetup.js        # Configuración global de Chart.js
│   ├── icons.jsx            # Mapeo centralizado de iconos
│   ├── portfolio.js         # Lógica de negocio y cálculos
│   ├── storage.js           # Capa de datos (Supabase + cache en memoria)
│   └── supabase.js          # Cliente Supabase
└── supabase-schema.sql      # SQL para crear tablas y políticas RLS
```

---

## 📄 Licencia

MIT
