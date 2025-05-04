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



## Registro de Desarrollo y Solución de Problemas (Mayo 2025)

Este registro documenta los problemas encontrados y las soluciones implementadas durante la fase de corrección de errores funcionales del sistema GENIA MPC.

### Resumen de Problemas y Soluciones:

1.  **Problema CORS:** El frontend (`https://genia-frontend-mpc.vercel.app`) no podía comunicarse con el backend (`https://genia-backendmpc.onrender.com`) debido a la configuración de Cross-Origin Resource Sharing.
    *   **Diagnóstico:** La variable de entorno `CORS_ALLOWED_ORIGINS` en Render no se estaba procesando correctamente como una lista de orígenes permitidos.
    *   **Solución:** Se modificó el archivo `/home/ubuntu/genia_backendMPC/app/core/config.py` en el backend para que procese manualmente la variable `CORS_ALLOWED_ORIGINS`, aceptando tanto formato JSON array (`["url1", "url2"]`) como CSV (`url1,url2`). Se confirmó mediante pruebas locales (`test_manual_cors_parsing.py`) que ambos formatos funcionaban. Se actualizó la variable `CORS_ALLOWED_ORIGINS` en la configuración del servicio backend en Render al valor JSON: `["http://localhost:5173","https://genia-frontend-mpc.vercel.app"]`.

2.  **Página `/tools` no cargaba:** La página en el frontend (`/tools`) se quedaba mostrando "Cargando..." indefinidamente.
    *   **Diagnóstico:** Se confirmó que el endpoint del backend (`/api/v1/tools`) funcionaba correctamente y devolvía los datos. El problema estaba en el frontend, específicamente en cómo el componente `ToolsExplorer.tsx` accedía a los datos devueltos por la llamada API (usando `axios`). Esperaba los datos directamente en la variable `toolsData`, pero `axios` devuelve la respuesta completa, y los datos estaban en `toolsData.data`.
    *   **Solución:** Se modificó la línea relevante en `/home/ubuntu/genia_frontendMPC/src/pages/ToolsExplorer.tsx` de `const tools = toolsData;` a `const tools = toolsData?.data;` (Commit `cf7ab00`).

3.  **Problemas de Autenticación (Registro/Confirmación/Login):** Se identificaron varios problemas relacionados con el flujo de autenticación gestionado por Supabase.
    *   **Síntoma 1:** Al registrar un nuevo usuario (`geniaecosystem@gmail.com`), el enlace de confirmación enviado por correo electrónico redirigía a una URL que mostraba un error `404: DEPLOYMENT_NOT_FOUND` de Vercel.
    *   **Síntoma 2:** Al intentar iniciar sesión con un usuario existente (`mendezchristhian1@gmail.com`), el proceso se quedaba bloqueado mostrando "Iniciando sesión...".
    *   **Diagnóstico:**
        *   El análisis de la URL del enlace de confirmación (`https://genia-frontendmpc.vercel.app/#error=...`) reveló que **faltaba un guion** en el dominio (`genia-frontendmpc` vs `genia-frontend-mpc`). Esto indicaba que la **"Site URL"** configurada en Supabase era incorrecta.
        *   El análisis del código `/home/ubuntu/genia_frontendMPC/src/contexts/AuthContext.tsx` mostró que:
            *   No había lógica para procesar los tokens de sesión (`access_token`, `refresh_token`) que Supabase añade a la URL de redirección después de la confirmación de correo o inicio de sesión OAuth.
            *   La función `signUp` redirigía inmediatamente al `/dashboard` sin esperar la confirmación del correo.
            *   La función `signIn` podría no estar manejando adecuadamente los estados de carga y éxito, contribuyendo al bloqueo.
    *   **Solución (Código - Commit `bdaf6de`):** Se modificó `/home/ubuntu/genia_frontendMPC/src/contexts/AuthContext.tsx` para:
        *   Añadir lógica en `useEffect` para detectar y procesar los parámetros (`access_token`, `refresh_token`, `type`, `error`) del hash (`#`) de la URL al cargar la aplicación. Esto permite manejar la sesión establecida por el enlace de confirmación o devoluciones de llamada de OAuth.
        *   Modificar la función `signUp` para mostrar el mensaje "Registro exitoso. Revisa tu correo para confirmar tu cuenta." y **no** redirigir automáticamente al dashboard.
        *   Mejorar la función `signIn` para usar un flag de éxito y asegurar que la obtención de detalles del usuario se complete antes de redirigir al dashboard, además de manejar mejor los errores y el estado `loading`.
    *   **Solución Pendiente (Configuración):** Se indicó al usuario la necesidad de corregir la **"Site URL"** en la configuración de Autenticación de Supabase para que sea exactamente `https://genia-frontend-mpc.vercel.app`.

### Estado Actual (Fin de Correcciones Funcionales):

*   Todos los problemas identificados en el código han sido corregidos y las soluciones desplegadas.
*   El flujo de registro ahora espera la confirmación del correo.
*   El frontend está preparado para manejar el enlace de confirmación una vez que la URL base sea correcta.
*   El inicio de sesión debería funcionar correctamente.
*   La página `/tools` debería cargar los datos.
*   **Acción pendiente:** Corregir la "Site URL" en la configuración de Supabase.




## Resumen Final y Estado Actual (04-Mayo-2025)

Durante esta sesión de trabajo, se abordaron múltiples problemas críticos que afectaban la funcionalidad del sistema GENIA:

1.  **Problema CORS:** Se identificó que el backend no procesaba correctamente la variable de entorno `CORS_ALLOWED_ORIGINS`. 
    *   **Solución:** Se modificó `app/core/config.py` para manejar correctamente formatos JSON y CSV. Se actualizó la variable en Render al formato JSON `["http://localhost:5173","https://genia-frontend-mpc.vercel.app"]`.
2.  **Página `/tools` no cargaba:** Se quedaba en "Cargando...".
    *   **Solución:** Se corrigió el acceso a los datos en `src/pages/ToolsExplorer.tsx`, cambiando `toolsData` por `toolsData?.data`.
3.  **Problemas de Autenticación (Registro/Confirmación/Login):**
    *   El enlace de confirmación de correo llevaba a un error 404/DEPLOYMENT_NOT_FOUND.
    *   El inicio de sesión se bloqueaba en "Iniciando sesión...".
    *   **Solución:** 
        *   Se modificó `src/contexts/AuthContext.tsx` para detectar tokens de sesión en la URL (manejo de confirmación), mostrar mensaje "Revisa tu correo..." tras registro, y mejorar la lógica de `signIn`.
        *   Se corrigió la "Site URL" en la configuración de autenticación de Supabase a `https://genia-frontend-mpc.vercel.app` (antes faltaba un guion).
4.  **Página `/dashboard` no cargaba:** Se quedaba en "Cargando...".
    *   **Solución:** Se añadió la importación faltante de `useQuery` en `src/pages/Dashboard.tsx`.
5.  **Fallos de Despliegue en Vercel:** Múltiples despliegues fallaron debido a errores de sintaxis.
    *   **Solución:** Se corrigieron errores de sintaxis JSX en `src/pages/ToolsExplorer.tsx` (referencias a `useToolStore`, `favorites`).

**Estado Actual:**

*   **Backend:** Configuración CORS corregida y funcional.
*   **Frontend:** Se implementaron correcciones para la carga de `/tools`, el flujo de autenticación (registro, confirmación, inicio de sesión) y la carga del `/dashboard`.
*   **Supabase:** Configuración de "Site URL" corregida.
*   **Despliegue:** **¡PROBLEMA PERSISTENTE!** El último despliegue (commit `faffed8`) **sigue fallando** en Vercel. Aunque se corrigieron los errores de sintaxis JSX identificados previamente, debe haber otro problema subyacente que impide la compilación exitosa.

**Próximos Pasos Recomendados:**

1.  **Investigar el fallo del último despliegue (commit `faffed8`):** Analizar detalladamente los logs de Vercel para identificar la causa raíz del error de compilación.
2.  **Implementar la corrección necesaria:** Solucionar el error identificado en los logs.
3.  **Verificar el despliegue:** Asegurarse de que el nuevo despliegue se complete con éxito.
4.  **Verificación funcional completa:** Probar nuevamente el registro, confirmación de correo, inicio de sesión, carga del dashboard y carga de la página `/tools`.
5.  **Revisar/Implementar `useToolStore`:** Una vez que el despliegue sea estable, descomentar y/o implementar la lógica relacionada con `useToolStore` (favoritos, herramientas recientes, etc.) que fue comentada temporalmente.
6.  **Mejoras de Diseño (UX/UI):** Abordar las mejoras visuales pendientes en el dashboard y otras áreas.
