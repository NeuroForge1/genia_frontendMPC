import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from 'react-query';
import { apiService } from '@/services/api';
import { useToolStore } from '@/services/store';

const ToolsExplorer: React.FC = () => {
  const { user, userDetails } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites, addRecentTool, incrementToolUsage } = useToolStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  
  // Cargar herramientas disponibles
  const { data: tools, isLoading } = useQuery('tools', async () => {
    // En una implementación real, esto obtendría datos del backend
    // Simulamos la carga de datos para este ejemplo
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      { 
        id: 'openai', 
        name: 'OpenAI', 
        description: 'Generación de texto y procesamiento de lenguaje natural con OpenAI',
        icon: '🤖',
        category: 'ai',
        plan: 'free',
        creditCost: 1,
        capabilities: [
          {
            id: 'generate_text',
            name: 'Generar Texto',
            description: 'Genera texto a partir de un prompt utilizando GPT-4',
            params: [
              { name: 'prompt', type: 'string', required: true, description: 'Texto de entrada para generar contenido' },
              { name: 'max_tokens', type: 'number', required: false, default: 500, description: 'Longitud máxima del texto generado' },
              { name: 'temperature', type: 'number', required: false, default: 0.7, description: 'Temperatura de generación (0-1)' }
            ]
          },
          {
            id: 'transcribe_audio',
            name: 'Transcribir Audio',
            description: 'Transcribe audio a texto utilizando Whisper',
            params: [
              { name: 'audio_url', type: 'string', required: true, description: 'URL del archivo de audio a transcribir' }
            ]
          }
        ]
      },
      { 
        id: 'whatsapp', 
        name: 'WhatsApp', 
        description: 'Envío y recepción de mensajes de WhatsApp',
        icon: '💬',
        category: 'messaging',
        plan: 'basic',
        creditCost: 5,
        capabilities: [
          {
            id: 'send_message',
            name: 'Enviar Mensaje',
            description: 'Envía un mensaje de WhatsApp a un número específico',
            params: [
              { name: 'to', type: 'string', required: true, description: 'Número de teléfono del destinatario (formato internacional)' },
              { name: 'message', type: 'string', required: true, description: 'Contenido del mensaje a enviar' }
            ]
          },
          {
            id: 'send_template',
            name: 'Enviar Plantilla',
            description: 'Envía un mensaje de plantilla aprobado por WhatsApp',
            params: [
              { name: 'to', type: 'string', required: true, description: 'Número de teléfono del destinatario' },
              { name: 'template_name', type: 'string', required: true, description: 'Nombre de la plantilla aprobada' },
              { name: 'template_params', type: 'object', required: true, description: 'Parámetros para la plantilla' }
            ]
          }
        ]
      },
      { 
        id: 'whatsapp_analysis', 
        name: 'Análisis WhatsApp', 
        description: 'Análisis avanzado de conversaciones de WhatsApp',
        icon: '📊',
        category: 'analytics',
        plan: 'pro',
        creditCost: 10,
        capabilities: [
          {
            id: 'analyze_sentiment',
            name: 'Analizar Sentimiento',
            description: 'Analiza el sentimiento de una conversación de WhatsApp',
            params: [
              { name: 'chat_id', type: 'string', required: true, description: 'ID de la conversación a analizar' },
              { name: 'time_period', type: 'string', required: false, default: 'week', description: 'Período de tiempo a analizar (day, week, month, all)' }
            ]
          },
          {
            id: 'extract_topics',
            name: 'Extraer Temas',
            description: 'Extrae los temas principales de una conversación',
            params: [
              { name: 'chat_id', type: 'string', required: true, description: 'ID de la conversación a analizar' },
              { name: 'max_topics', type: 'number', required: false, default: 5, description: 'Número máximo de temas a extraer' }
            ]
          }
        ]
      },
      { 
        id: 'ai_assistant', 
        name: 'Asistente IA', 
        description: 'Creación y gestión de asistentes de IA personalizados',
        icon: '🧠',
        category: 'ai',
        plan: 'pro',
        creditCost: 15,
        capabilities: [
          {
            id: 'create_assistant',
            name: 'Crear Asistente',
            description: 'Crea un asistente de IA personalizado',
            params: [
              { name: 'name', type: 'string', required: true, description: 'Nombre del asistente' },
              { name: 'instructions', type: 'string', required: true, description: 'Instrucciones para el asistente' },
              { name: 'tools', type: 'array', required: false, default: ['code_interpreter'], description: 'Herramientas disponibles para el asistente' }
            ]
          },
          {
            id: 'run_assistant',
            name: 'Ejecutar Asistente',
            description: 'Ejecuta un asistente en un hilo de conversación',
            params: [
              { name: 'thread_id', type: 'string', required: true, description: 'ID del hilo de conversación' },
              { name: 'assistant_id', type: 'string', required: true, description: 'ID del asistente a ejecutar' }
            ]
          }
        ]
      },
      { 
        id: 'seo_analysis', 
        name: 'Análisis SEO', 
        description: 'Análisis y optimización SEO para contenido web',
        icon: '🔍',
        category: 'marketing',
        plan: 'basic',
        creditCost: 8,
        capabilities: [
          {
            id: 'analyze_content',
            name: 'Analizar Contenido',
            description: 'Analiza contenido para optimización SEO',
            params: [
              { name: 'content', type: 'string', required: true, description: 'Contenido a analizar' },
              { name: 'keywords', type: 'array', required: true, description: 'Palabras clave objetivo' }
            ]
          },
          {
            id: 'generate_meta_tags',
            name: 'Generar Meta Tags',
            description: 'Genera meta tags optimizados para SEO',
            params: [
              { name: 'title', type: 'string', required: true, description: 'Título de la página' },
              { name: 'content', type: 'string', required: true, description: 'Contenido de la página' }
            ]
          }
        ]
      },
      { 
        id: 'webhook_integration', 
        name: 'Integración Webhook', 
        description: 'Gestión de integraciones mediante webhooks',
        icon: '🔗',
        category: 'integration',
        plan: 'enterprise',
        creditCost: 12,
        capabilities: [
          {
            id: 'create_webhook',
            name: 'Crear Webhook',
            description: 'Crea un nuevo webhook para integraciones',
            params: [
              { name: 'name', type: 'string', required: true, description: 'Nombre del webhook' },
              { name: 'target_url', type: 'string', required: true, description: 'URL de destino del webhook' },
              { name: 'events', type: 'array', required: true, description: 'Eventos que disparan el webhook' }
            ]
          },
          {
            id: 'trigger_webhook',
            name: 'Disparar Webhook',
            description: 'Dispara manualmente un webhook con datos personalizados',
            params: [
              { name: 'webhook_id', type: 'string', required: true, description: 'ID del webhook a disparar' },
              { name: 'event', type: 'string', required: true, description: 'Evento a disparar' },
              { name: 'payload', type: 'object', required: true, description: 'Datos a enviar con el webhook' }
            ]
          }
        ]
      }
    ];
  });
  
  // Filtrar herramientas por categoría y búsqueda
  const filteredTools = tools?.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // Verificar si una herramienta está disponible según el plan del usuario
  const isToolAvailable = (toolPlan: string) => {
    const planHierarchy = {
      'free': 0,
      'basic': 1,
      'pro': 2,
      'enterprise': 3
    };
    
    const userPlanLevel = planHierarchy[userDetails?.plan || 'free'] || 0;
    const toolPlanLevel = planHierarchy[toolPlan] || 0;
    
    return userPlanLevel >= toolPlanLevel;
  };
  
  // Manejar la selección de una herramienta
  const handleSelectTool = (tool: any) => {
    setSelectedTool(tool);
    addRecentTool(tool.id);
  };
  
  // Manejar la ejecución de una capacidad
  const handleExecuteCapability = async (capability: any) => {
    if (!selectedTool) return;
    
    // Recopilar parámetros (en una implementación real, esto sería un formulario)
    const params: any = {};
    capability.params.forEach((param: any) => {
      // Simulamos valores para este ejemplo
      if (param.type === 'string') {
        params[param.name] = param.name === 'prompt' ? 'Explica el concepto de inteligencia artificial en términos simples' : 'valor de ejemplo';
      } else if (param.type === 'number') {
        params[param.name] = param.default || 0;
      } else if (param.type === 'array') {
        params[param.name] = [];
      } else if (param.type === 'object') {
        params[param.name] = {};
      }
    });
    
    try {
      setIsExecuting(true);
      setExecutionResult(null);
      
      // En una implementación real, esto llamaría al backend
      // Simulamos una respuesta para este ejemplo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = {
        status: 'success',
        data: {
          result: 'La inteligencia artificial (IA) es como enseñar a las computadoras a pensar y aprender de manera similar a los humanos. Imagina que le das a una computadora la capacidad de reconocer patrones, resolver problemas y mejorar con el tiempo, sin necesidad de programarla específicamente para cada tarea. Es como tener un asistente digital que puede entender lo que dices, reconocer imágenes, tomar decisiones y adaptarse a nuevas situaciones.',
          execution_time: '1.2s',
          credits_used: selectedTool.creditCost
        }
      };
      
      setExecutionResult(result);
      incrementToolUsage(selectedTool.id);
      
    } catch (error) {
      setExecutionResult({
        status: 'error',
        message: 'Error al ejecutar la capacidad'
      });
    } finally {
      setIsExecuting(false);
    }
  };
  
  // Manejar favoritos
  const toggleFavorite = (toolId: string) => {
    if (favorites.includes(toolId)) {
      removeFromFavorites(toolId);
    } else {
      addToFavorites(toolId);
    }
  };
  
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
          <h1 className="text-2xl font-bold">Explorador de Herramientas</h1>
          <p className="text-muted-foreground">Descubre y utiliza las herramientas disponibles en GENIA MCP</p>
        </div>
      </div>
      
      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar herramientas..."
            className="input w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCategory('all')}
          >
            Todas
          </button>
          <button
            className={`btn ${selectedCategory === 'ai' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCategory('ai')}
          >
            IA
          </button>
          <button
            className={`btn ${selectedCategory === 'messaging' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCategory('messaging')}
          >
            Mensajería
          </button>
          <button
            className={`btn ${selectedCategory === 'analytics' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCategory('analytics')}
          >
            Analítica
          </button>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de herramientas */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title text-lg">Herramientas</h2>
            </div>
            <div className="card-content p-0">
              <div className="divide-y">
                {filteredTools?.map((tool) => (
                  <div 
                    key={tool.id}
                    className={`p-4 cursor-pointer hover:bg-muted transition-colors ${selectedTool?.id === tool.id ? 'bg-muted' : ''}`}
                    onClick={() => handleSelectTool(tool)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-xl">
                        {tool.icon}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{tool.name}</h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(tool.id);
                            }}
                            className="text-muted-foreground hover:text-yellow-500 transition-colors"
                          >
                            {favorites.includes(tool.id) ? (
                              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isToolAvailable(tool.plan) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {tool.plan.charAt(0).toUpperCase() + tool.plan.slice(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">{tool.creditCost} créditos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredTools?.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No se encontraron herramientas que coincidan con los filtros.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Detalle de herramienta */}
        <div className="lg:col-span-2">
          {selectedTool ? (
            <div className="card">
              <div className="card-header">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full text-2xl">
                    {selectedTool.icon}
                  </div>
                  <div className="ml-4">
                    <h2 className="card-title">{selectedTool.name}</h2>
                    <p className="card-description">{selectedTool.description}</p>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="space-y-6">
                  {/* Información de la herramienta */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Plan requerido</p>
                      <p className="text-lg font-bold capitalize">{selectedTool.plan}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Costo por uso</p>
                      <p className="text-lg font-bold">{selectedTool.creditCost} créditos</p>
                    </div>
                  </div>
                  
                  {/* Capacidades */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Capacidades</h3>
                    <div className="space-y-4">
                      {selectedTool.capabilities.map((capability: any) => (
                        <div key={capability.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{capability.name}</h4>
                            <button
                              className={`btn btn-sm ${isToolAvailable(selectedTool.plan) ? 'btn-primary' : 'btn-outline opacity-50 cursor-not-allowed'}`}
                              onClick={() => isToolAvailable(selectedTool.plan) && handleExecuteCapability(capability)}
                              disabled={!isToolAvailable(selectedTool.plan) || isExecuting}
                            >
                              {isExecuting ? 'Ejecutando...' : 'Ejecutar'}
                            </button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{capability.description}</p>
                          
                          {/* Parámetros */}
                          <div className="mt-3">
                            <p className="text-xs font-medium mb-2">Parámetros:</p>
                            <div className="space-y-2">
                              {capability.params.map((param: any) => (
                                <div key={param.name} className="flex items-start">
                                  <span className="text-xs font-medium min-w-[100px]">{param.name}</span>
                                  <span className="text-xs text-muted-foreground">{param.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Resultado de ejecución */}
                  {executionResult && (
                    <div className={`border rounded-lg p-4 ${executionResult.status === 'success' ? 'border-green-300' : 'border-red-300'}`}>
                      <h3 className="text-lg font-medium mb-2">Resultado</h3>
                      {executionResult.status === 'success' ? (
                        <div>
                          <div className="bg-muted p-4 rounded-lg mb-3">
                            <p className="whitespace-pre-wrap">{executionResult.data.result}</p>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Tiempo de ejecución: {executionResult.data.execution_time}</span>
                            <span>Créditos utilizados: {executionResult.data.credits_used}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-red-500">
                          {executionResult.message}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Mensaje de plan no disponible */}
                  {!isToolAvailable(selectedTool.plan) && (
                    <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                      <div className="flex items-start">
                        <svg className="w-6 h-6 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-accent">Actualiza tu plan</h3>
                          <p className="mt-1 text-sm">Esta herramienta requiere el plan {selectedTool.plan}. Actualiza tu plan para acceder a esta funcionalidad.</p>
                          <a href="/pricing" className="mt-2 inline-block text-sm font-medium text-accent hover:underline">
                            Ver planes disponibles
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-content p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium">Selecciona una herramienta</h3>
                <p className="mt-2 text-muted-foreground">Elige una herramienta de la lista para ver sus detalles y capacidades.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolsExplorer;
