# GENIA MCP - Frontend

Este repositorio contiene el frontend del proyecto GENIA MCP, una plataforma SaaS basada en el Modelo de Cliente Potenciado (MCP) que permite a los usuarios acceder a herramientas de IA y automatización.

## Tecnologías

- **React 18** - Biblioteca para construir interfaces de usuario
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Herramienta de construcción rápida para desarrollo web
- **Tailwind CSS** - Framework CSS utilitario
- **React Router** - Enrutamiento para aplicaciones React
- **React Query** - Gestión de estado del servidor y caché
- **Zustand** - Gestión de estado del cliente
- **Supabase** - Backend as a Service para autenticación y base de datos

## Requisitos

- Node.js 18 o superior
- npm 8 o superior

## Instalación

1. Clona este repositorio:
```bash
git clone https://github.com/NeuroForge1/genia_frontendMPC.git
cd genia_frontendMPC
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-de-supabase
```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Construcción

Para construir la aplicación para producción:

```bash
npm run build
```

Los archivos de construcción se generarán en el directorio `dist`.

## Estructura del Proyecto

```
src/
├── assets/         # Recursos estáticos (imágenes, fuentes, etc.)
├── components/     # Componentes reutilizables
│   ├── auth/       # Componentes relacionados con autenticación
│   ├── layout/     # Componentes de diseño (Header, Sidebar, etc.)
│   └── ui/         # Componentes de interfaz de usuario
├── contexts/       # Contextos de React (AuthContext, etc.)
├── hooks/          # Hooks personalizados
├── pages/          # Componentes de página
├── services/       # Servicios (API, Supabase, etc.)
├── styles/         # Estilos globales
└── utils/          # Utilidades y funciones auxiliares
```

## Características

- **Autenticación** - Inicio de sesión y registro con email/contraseña y proveedores OAuth (Google, Facebook)
- **Dashboard** - Panel de control con resumen de actividad y herramientas populares
- **Explorador de Herramientas** - Interfaz para descubrir y utilizar las herramientas disponibles
- **Gestión de Perfil** - Configuración de cuenta y preferencias
- **Planes y Pagos** - Gestión de suscripciones y créditos

## Despliegue

El frontend está configurado para ser desplegado en Vercel. Para desplegar:

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno en Vercel:
   - `VITE_API_URL` - URL del backend (ej. https://genia-backend-mpc.onrender.com)
   - `VITE_SUPABASE_URL` - URL de tu proyecto Supabase
   - `VITE_SUPABASE_ANON_KEY` - Clave anónima de Supabase

## Pruebas

Para ejecutar las pruebas:

```bash
npm run test
```

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Para cualquier consulta o sugerencia, por favor contacta a [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com).
