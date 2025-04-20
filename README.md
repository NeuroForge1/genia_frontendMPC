# GENIA MPC Frontend

Este repositorio contiene el frontend para el sistema GENIA MPC, una plataforma SaaS basada en el Modelo de Cliente Potenciado (MCP) de Anthropic.

## Características

- Interfaz de usuario moderna con React y Tailwind CSS
- Sistema de autenticación con Supabase
- Integración con múltiples herramientas (OpenAI, WhatsApp, Stripe, Gmail, etc.)
- Dashboard interactivo para gestionar herramientas y tareas
- Explorador de herramientas disponibles según el plan del usuario

## Requisitos

- Node.js 16+
- npm o yarn

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/NeuroForge1/genia_frontendMPC.git
cd genia_frontendMPC
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

4. Configura las variables de entorno en el archivo `.env`:
```
VITE_API_URL=https://genia-backendmpc.onrender.com
VITE_SUPABASE_URL=https://axfcmtrhsvmtzqqhxwul.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4ZmNtdHJoc3ZtdHpxcWh4d3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjA2MzksImV4cCI6MjA1OTM5NjYzOX0.F7X3QI2AL90Q-XZjWceSuW45vDMBjz7txTqge4lwxtQ
```

5. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Despliegue en Vercel

Para desplegar el frontend en Vercel, sigue estos pasos:

1. Asegúrate de que los archivos `tsconfig.json` y `tsconfig.node.json` estén presentes en el repositorio.

2. Configura un nuevo proyecto en Vercel:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: dist
   - Install Command: `npm install`

3. Configura las variables de entorno en Vercel:
```
VITE_API_URL=https://genia-backendmpc.onrender.com
VITE_SUPABASE_URL=https://axfcmtrhsvmtzqqhxwul.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4ZmNtdHJoc3ZtdHpxcWh4d3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjA2MzksImV4cCI6MjA1OTM5NjYzOX0.F7X3QI2AL90Q-XZjWceSuW45vDMBjz7txTqge4lwxtQ
```

4. Haz clic en "Deploy" para iniciar el despliegue.

## Estructura del Proyecto

- `src/`: Código fuente principal
  - `components/`: Componentes reutilizables
  - `contexts/`: Contextos de React (AuthContext, etc.)
  - `pages/`: Páginas principales de la aplicación
  - `services/`: Servicios para comunicación con el backend
  - `styles/`: Estilos globales y configuración de Tailwind

## Licencia

MIT
