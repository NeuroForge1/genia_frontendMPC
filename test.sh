#!/bin/bash

# Script de prueba para el frontend de GENIA MCP
# Este script ejecuta pruebas básicas para verificar que el frontend funciona correctamente

echo "Iniciando pruebas del frontend GENIA MCP..."

# Verificar instalación de dependencias
echo "Verificando dependencias..."
npm install

# Ejecutar linting
echo "Ejecutando linting..."
npm run lint || echo "❌ Error en linting"

# Construir el proyecto para verificar que no hay errores de compilación
echo "Construyendo proyecto..."
npm run build && echo "✅ Construcción exitosa" || echo "❌ Error en la construcción"

# Iniciar el servidor de desarrollo en segundo plano para pruebas
echo "Iniciando servidor de desarrollo para pruebas..."
npm run dev &
SERVER_PID=$!

# Esperar a que el servidor esté listo
echo "Esperando a que el servidor esté listo..."
sleep 10

# Verificar que el servidor está funcionando
curl -s http://localhost:5173 | grep -q "GENIA MCP" && echo "✅ Servidor de desarrollo funcionando correctamente" || echo "❌ Error en servidor de desarrollo"

# Detener el servidor
echo "Deteniendo servidor..."
kill $SERVER_PID

echo "Pruebas completadas."
