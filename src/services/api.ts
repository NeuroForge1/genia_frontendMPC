import axios from 'axios';
import { supabase } from './supabase';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token de autenticación
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  
  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores específicos
    if (error.response) {
      // Error de servidor
      if (error.response.status === 401) {
        // Redirigir a login si hay error de autenticación
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Servicios de API
export const apiService = {
  // Servicios de herramientas MCP
  tools: {
    // Ejecutar una herramienta MCP
    execute: async (toolName: string, capability: string, params: any) => {
      return api.post('/api/genia/execute', {
        tool: toolName,
        capability,
        params
      });
    },
    
    // Obtener herramientas disponibles
    getAvailable: async () => {
      return api.get('/api/genia/tools');
    }
  },
  
  // Servicios de usuario
  user: {
    // Obtener perfil del usuario
    getProfile: async () => {
      return api.get('/api/user/profile');
    },
    
    // Actualizar perfil del usuario
    updateProfile: async (data: any) => {
      return api.put('/api/user/profile', data);
    },
    
    // Obtener historial de tareas
    getTasks: async (page = 1, limit = 10) => {
      return api.get(`/api/user/tasks?page=${page}&limit=${limit}`);
    }
  },
  
  // Servicios de pagos
  payments: {
    // Crear sesión de checkout
    createCheckout: async (planId: string) => {
      return api.post('/api/payments/create-checkout', {
        plan_id: planId,
        success_url: `${window.location.origin}/dashboard?payment=success`,
        cancel_url: `${window.location.origin}/pricing?payment=cancelled`
      });
    },
    
    // Crear sesión de portal de cliente
    createPortal: async () => {
      return api.post('/api/payments/create-portal', {
        return_url: `${window.location.origin}/dashboard`
      });
    },
    
    // Obtener planes disponibles
    getPlans: async () => {
      return api.get('/api/payments/plans');
    }
  },
  
  // Servicios de WhatsApp
  whatsapp: {
    // Enviar mensaje de WhatsApp
    sendMessage: async (to: string, message: string) => {
      return api.post('/api/genia/execute', {
        tool: 'whatsapp',
        capability: 'send_message',
        params: { to, message }
      });
    },
    
    // Analizar sentimiento de chat
    analyzeSentiment: async (chatId: string) => {
      return api.post('/api/genia/execute', {
        tool: 'whatsapp_analysis',
        capability: 'analyze_sentiment',
        params: { chat_id: chatId }
      });
    }
  },
  
  // Servicios de IA
  ai: {
    // Generar texto con OpenAI
    generateText: async (prompt: string, options = {}) => {
      return api.post('/api/genia/execute', {
        tool: 'openai',
        capability: 'generate_text',
        params: { prompt, ...options }
      });
    },
    
    // Crear asistente personalizado
    createAssistant: async (name: string, instructions: string, options = {}) => {
      return api.post('/api/genia/execute', {
        tool: 'ai_assistant',
        capability: 'create_assistant',
        params: { name, instructions, ...options }
      });
    }
  },
  
  // Servicios de SEO
  seo: {
    // Analizar contenido para SEO
    analyzeContent: async (content: string, keywords: string[]) => {
      return api.post('/api/genia/execute', {
        tool: 'seo_analysis',
        capability: 'analyze_content',
        params: { content, keywords }
      });
    },
    
    // Generar meta tags
    generateMetaTags: async (title: string, content: string) => {
      return api.post('/api/genia/execute', {
        tool: 'seo_analysis',
        capability: 'generate_meta_tags',
        params: { title, content }
      });
    }
  }
};

export default api;
