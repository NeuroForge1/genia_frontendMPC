import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPlanStore } from '@/services/store';
import { apiService } from '@/services/api';
import { useQuery } from 'react-query';

const Dashboard: React.FC = () => {
  const { user, userDetails } = useAuth();
  const { credits, plan, setPlan, setCredits } = useUserPlanStore();
  
  // Cargar datos del usuario
  const { data: userData, isLoading } = useQuery('userData', async () => {
    if (!user) return null;
    
    // En una implementación real, esto obtendría datos del backend
    // Simulamos la carga de datos para este ejemplo
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Actualizar el estado global con los datos del usuario
    if (userDetails) {
      setPlan(userDetails.plan || 'free');
      setCredits(userDetails.creditos || 0);
    }
    
    return userDetails;
  });
  
  // Cargar herramientas disponibles
  const { data: availableTools } = useQuery('availableTools', async () => {
    // En una implementación real, esto obtendría datos del backend
    // Simulamos la carga de datos para este ejemplo
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return [
      { id: 'openai', name: 'OpenAI', description: 'Generación de texto y procesamiento de lenguaje natural', icon: '🤖', usageCount: 42 },
      { id: 'whatsapp', name: 'WhatsApp', description: 'Envío y recepción de mensajes de WhatsApp', icon: '💬', usageCount: 18 },
      { id: 'stripe', name: 'Stripe', description: 'Procesamiento de pagos y gestión de suscripciones', icon: '💳', usageCount: 5 },
      { id: 'gmail', name: 'Gmail', description: 'Envío de correos electrónicos a través de Gmail', icon: '📧', usageCount: 12 },
      { id: 'whatsapp_analysis', name: 'Análisis WhatsApp', description: 'Análisis avanzado de conversaciones de WhatsApp', icon: '📊', usageCount: 7 },
      { id: 'ai_assistant', name: 'Asistente IA', description: 'Creación y gestión de asistentes de IA personalizados', icon: '🧠', usageCount: 3 },
    ];
  });
  
  // Cargar actividad reciente
  const { data: recentActivity } = useQuery('recentActivity', async () => {
    // En una implementación real, esto obtendría datos del backend
    // Simulamos la carga de datos para este ejemplo
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      { id: 1, tool: 'OpenAI', action: 'Generación de texto', date: '2025-04-20T15:30:00Z', status: 'success' },
      { id: 2, tool: 'WhatsApp', action: 'Envío de mensaje', date: '2025-04-20T14:45:00Z', status: 'success' },
      { id: 3, tool: 'Análisis WhatsApp', action: 'Análisis de sentimiento', date: '2025-04-19T18:20:00Z', status: 'success' },
      { id: 4, tool: 'Gmail', action: 'Envío de correo', date: '2025-04-19T12:10:00Z', status: 'error' },
      { id: 5, tool: 'Asistente IA', action: 'Creación de asistente', date: '2025-04-18T09:30:00Z', status: 'success' },
    ];
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido de nuevo, {userDetails?.name || 'Usuario'}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full">
            <span className="font-medium">{credits}</span>
            <span className="ml-1 text-muted-foreground">créditos disponibles</span>
          </div>
        </div>
      </div>
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">Plan Actual</h3>
                <p className="text-2xl font-bold capitalize">{plan}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-secondary/10 rounded-full">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">Tareas Completadas</h3>
                <p className="text-2xl font-bold">87</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-accent/10 rounded-full">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">Tiempo Ahorrado</h3>
                <p className="text-2xl font-bold">12.5 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Herramientas populares */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Herramientas Populares</h2>
          <p className="card-description">Tus herramientas más utilizadas</p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTools?.slice(0, 6).map((tool) => (
              <div key={tool.id} className="flex items-start p-4 border rounded-lg hover:border-primary hover:shadow-sm transition-all">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-xl">
                  {tool.icon}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                  <p className="text-xs mt-1">Usado {tool.usageCount} veces</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card-footer justify-center">
          <a href="/tools" className="btn btn-outline">
            Ver todas las herramientas
          </a>
        </div>
      </div>
      
      {/* Actividad reciente */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Actividad Reciente</h2>
          <p className="card-description">Tus últimas acciones en la plataforma</p>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-medium">Herramienta</th>
                  <th className="px-4 py-2 text-left font-medium">Acción</th>
                  <th className="px-4 py-2 text-left font-medium">Fecha</th>
                  <th className="px-4 py-2 text-left font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity?.map((activity) => (
                  <tr key={activity.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3">{activity.tool}</td>
                    <td className="px-4 py-3">{activity.action}</td>
                    <td className="px-4 py-3">{new Date(activity.date).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {activity.status === 'success' ? 'Completado' : 'Error'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer justify-center">
          <a href="/activity" className="btn btn-outline">
            Ver toda la actividad
          </a>
        </div>
      </div>
      
      {/* Sugerencias */}
      <div className="card bg-primary/5 border-primary/20">
        <div className="p-6">
          <h3 className="text-lg font-medium">Sugerencias para ti</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 p-1 bg-primary/10 rounded-full">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Prueba la herramienta de Análisis SEO</p>
                <p className="mt-1 text-sm text-muted-foreground">Optimiza tu contenido web para mejorar el posicionamiento en buscadores.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 p-1 bg-primary/10 rounded-full">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Actualiza a un plan superior</p>
                <p className="mt-1 text-sm text-muted-foreground">Desbloquea más herramientas y aumenta tu límite de créditos mensuales.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 p-1 bg-primary/10 rounded-full">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Configura notificaciones</p>
                <p className="mt-1 text-sm text-muted-foreground">Recibe alertas cuando se completen tus tareas o cuando haya actualizaciones importantes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
