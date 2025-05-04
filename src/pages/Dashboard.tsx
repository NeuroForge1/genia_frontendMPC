import React, { useEffect } from 'react'; // Import useEffect
import { useAuth } from '@/contexts/AuthContext';
import { useUserPlanStore } from '@/services/store';
import { apiService } from '@/services/api';
import { BarChart3, BrainCircuit, CreditCard, HelpCircle, Mail, MessageSquare, Search, Sparkles, Webhook } from 'lucide-react'; // Import Lucide icons

const Dashboard: React.FC = () => {
  const { user, userDetails, loading: authLoading } = useAuth(); // Get loading state from auth
  const { credits, plan, setPlan, setCredits } = useUserPlanStore();

  // Update Zustand store when userDetails changes
  useEffect(() => {
    if (userDetails) {
      setPlan(userDetails.plan || 'free');
      setCredits(userDetails.creditos || 0);
    }
  }, [userDetails, setPlan, setCredits]);

  // Cargar herramientas disponibles (Replace simulation with API call)
  const { data: availableToolsData, isLoading: toolsLoading } = useQuery('availableTools', apiService.tools.getAvailable, {
    enabled: !!user, // Only run if user is logged in
  });
  const availableTools = availableToolsData?.data; // Extract data from response

  // Cargar actividad reciente (Replace simulation with API call)
  const { data: recentActivityData, isLoading: activityLoading } = useQuery('recentActivity', () => apiService.user.getTasks(1, 5), { // Fetch first 5 tasks
    enabled: !!user, // Only run if user is logged in
  });
  const recentActivity = recentActivityData?.data?.tasks; // Extract tasks array from response

  // Combine loading states
  const isLoading = authLoading || toolsLoading || activityLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in font-inter"> {/* Use branding font and animation */}
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-genia-black">Dashboard</h1>
          <p className="text-genia-gray-dark">Bienvenido de nuevo, {userDetails?.name || "Usuario"}</p>
        </div>
        {/* Credits display is now in TopHeader via CreditsBar */}
      </div>
      
      {/* Tarjetas de resumen - Apply branding styles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plan Card */}
        <div className="bg-genia-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center">
            <div className="p-2 bg-genia-mint/20 rounded-full">
              {/* Use Lucide icon */}
              <svg className="w-6 h-6 text-genia-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-genia-gray-dark">Plan Actual</h3>
              <p className="text-2xl font-bold capitalize text-genia-black">{plan}</p>
            </div>
          </div>
        </div>
        
        {/* Tasks Card (Placeholder) */}
        <div className="bg-genia-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center">
            <div className="p-2 bg-genia-blue/20 rounded-full">
              {/* Use Lucide icon */}
              <svg className="w-6 h-6 text-genia-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-genia-gray-dark">Tareas Completadas</h3>
              {/* TODO: Fetch real task count */}
              <p className="text-2xl font-bold text-genia-black">{recentActivity?.length || 0}</p> 
            </div>
          </div>
        </div>
        
        {/* Time Saved Card (Placeholder) */}
        <div className="bg-genia-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center">
            <div className="p-2 bg-accent/20 rounded-full">
              {/* Use Lucide icon */}
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-genia-gray-dark">Tiempo Ahorrado</h3>
              <p className="text-2xl font-bold text-genia-black">12.5 h</p> {/* Placeholder value */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Herramientas populares - Apply branding styles */}
      <div className="bg-genia-white rounded-2xl shadow-lg">
        <div className="p-6 border-b border-genia-gray-medium/50">
          <h2 className="text-xl font-semibold text-genia-black">Herramientas Populares</h2>
          <p className="text-sm text-genia-gray-dark">Tus herramientas más utilizadas</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Ensure availableTools is an array before slicing and mapping */}
            {Array.isArray(availableTools) && availableTools.slice(0, 6).map((tool: any) => (
              <div key={tool.id || tool.name} className="flex items-start p-4 border border-genia-gray-medium/30 rounded-xl hover:border-genia-mint hover:shadow-md transition-all bg-genia-white">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-genia-mint/20 rounded-full text-xl">
                  {/* Use Lucide icons */}
                  {tool.id === "openai" ? <BrainCircuit className="w-5 h-5" /> : 
                   tool.id === "whatsapp" ? <MessageSquare className="w-5 h-5" /> : 
                   tool.id === "stripe" ? <CreditCard className="w-5 h-5" /> : 
                   tool.id === "gmail" ? <Mail className="w-5 h-5" /> : 
                   tool.id === "whatsapp_analysis" ? <BarChart3 className="w-5 h-5" /> : 
                   tool.id === "ai_assistant" ? <Sparkles className="w-5 h-5" /> : 
                   tool.id === "seo_analysis" ? <Search className="w-5 h-5" /> : 
                   tool.id === "webhook_integration" ? <Webhook className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />
                  }
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-genia-black">{tool.name}</h3>
                  <p className="text-sm text-genia-gray-dark">{tool.description}</p>
                  {/* Removed usageCount as it's likely not available from API yet */}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-genia-gray-medium/50 flex justify-center">
          {/* Use branded button style */}
          <a href="/tools" className="inline-flex items-center justify-center px-4 py-2 border border-genia-gray-medium text-sm font-medium rounded-md text-genia-gray-dark bg-genia-white hover:bg-genia-gray-light transition-colors">
            Ver todas las herramientas
          </a>
        </div>
      </div>
      
      {/* Actividad reciente - Apply branding styles */}
      <div className="bg-genia-white rounded-2xl shadow-lg">
        <div className="p-6 border-b border-genia-gray-medium/50">
          <h2 className="text-xl font-semibold text-genia-black">Actividad Reciente</h2>
          <p className="text-sm text-genia-gray-dark">Tus últimas acciones en la plataforma</p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-genia-gray-medium/50">
                  <th className="px-4 py-3 text-left font-medium text-genia-gray-dark">Herramienta</th>
                  <th className="px-4 py-3 text-left font-medium text-genia-gray-dark">Acción</th>
                  <th className="px-4 py-3 text-left font-medium text-genia-gray-dark">Fecha</th>
                  <th className="px-4 py-3 text-left font-medium text-genia-gray-dark">Estado</th>
                </tr>
              </thead>
              <tbody>
                {/* Ensure recentActivity is an array before mapping */}
                {Array.isArray(recentActivity) && recentActivity.map((activity: any) => (
                  <tr key={activity.id} className="border-b border-genia-gray-medium/30 hover:bg-genia-gray-light/50">
                    <td className="px-4 py-3 text-genia-black">{activity.tool}</td>
                    <td className="px-4 py-3 text-genia-gray-dark">{activity.capability || activity.action || 
                      (activity.params?.prompt ? "Generación de texto" : 
                       activity.params?.message ? "Envío de mensaje" : "Acción desconocida")
                    }</td>
                    <td className="px-4 py-3 text-genia-gray-dark">{new Date(activity.created_at || activity.date).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {activity.status === "success" ? "Completado" : "Error"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="p-4 border-t border-genia-gray-medium/50 flex justify-center">
          {/* Use branded button style */}
          <a href="/activity" className="inline-flex items-center justify-center px-4 py-2 border border-genia-gray-medium text-sm font-medium rounded-md text-genia-gray-dark bg-genia-white hover:bg-genia-gray-light transition-colors">
            Ver toda la actividad
          </a>
        </div>
      </div>
      
      {/* Sugerencias - Apply branding styles */}
      <div className="bg-genia-blue/5 border border-genia-blue/20 rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-medium text-genia-black">Sugerencias para ti</h3>
        <div className="mt-4 space-y-4">
          {/* Suggestion Item 1 */}
          <div className="flex items-start">
            <div className="flex-shrink-0 p-1 bg-genia-blue/10 rounded-full">
              {/* Use Lucide icon */}
              <svg className="w-5 h-5 text-genia-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-genia-black">Prueba la herramienta de Análisis SEO</p>
              <p className="mt-1 text-sm text-genia-gray-dark">Optimiza tu contenido web para mejorar el posicionamiento.</p>
            </div>
          </div>
          {/* Suggestion Item 2 */}
          <div className="flex items-start">
            <div className="flex-shrink-0 p-1 bg-genia-blue/10 rounded-full">
              {/* Use Lucide icon */}
              <svg className="w-5 h-5 text-genia-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-genia-black">Actualiza a un plan superior</p>
              <p className="mt-1 text-sm text-genia-gray-dark">Desbloquea más herramientas y aumenta tus créditos.</p>
            </div>
          </div>
          {/* Suggestion Item 3 */}
          <div className="flex items-start">
            <div className="flex-shrink-0 p-1 bg-genia-blue/10 rounded-full">
              {/* Use Lucide icon */}
              <svg className="w-5 h-5 text-genia-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-genia-black">Configura notificaciones</p>
              <p className="mt-1 text-sm text-genia-gray-dark">Recibe alertas cuando se completen tus tareas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
