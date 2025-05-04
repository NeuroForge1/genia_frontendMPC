import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from 'react-query'; // Import useQueryClient
import { apiService } from '@/services/api';
import { Star } from 'lucide-react'; // Import Star icon

// Definir tipos para evitar errores de TypeScript
type PlanType = 'free' | 'basic' | 'pro' | 'enterprise';
type PlanHierarchy = {
  [key in PlanType]: number;
};

const ToolsExplorer: React.FC = () => {
  const { user, userDetails, loading: authLoading } = useAuth(); // Get loading state
  // const { favorites, addToFavorites, removeFromFavorites, addRecentTool, incrementToolUsage } = useToolStore(); // TODO: Implement or import useToolStore
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [selectedCapability, setSelectedCapability] = useState<any>(null); // State for selected capability
  const [formParams, setFormParams] = useState<any>({}); // State for form parameters
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const queryClient = useQueryClient(); // Get query client instance

  // Cargar herramientas disponibles
  const { data: toolsData, isLoading: toolsLoading } = useQuery("tools", apiService.tools.getAvailable, {
    enabled: !!user, // Only run if user is logged in
  });
  const tools = toolsData?.data; // Extract data from response

  // Combine loading states
  const isLoading = authLoading || toolsLoading;

  // Filtrar herramientas por categoría y búsqueda
  const filteredTools = tools?.filter((tool: any) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // Verificar si una herramienta está disponible según el plan del usuario
  const isToolAvailable = (toolPlan: string) => {
    const planHierarchy: PlanHierarchy = {
      'free': 0,
      'basic': 1,
      'pro': 2,
      'enterprise': 3
    };
    
    const userPlan = (userDetails?.plan as PlanType) || 'free';
    const validToolPlan = (toolPlan as PlanType) || 'free';
    
    const userPlanLevel = planHierarchy[userPlan];
    const toolPlanLevel = planHierarchy[validToolPlan];
    
    return userPlanLevel >= toolPlanLevel;
  };
  
  // Manejar la selección de una herramienta
  const handleSelectTool = (tool: any) => {
    setSelectedTool(tool);
    setSelectedCapability(null); // Reset capability selection when tool changes
    setFormParams({}); // Reset form params
    setExecutionResult(null); // Clear results
    // addRecentTool(tool.id); // TODO: Implement or import useToolStore
  };
  
  // Manejar cambio en los parámetros del formulario
  const handleParamChange = (paramName: string, value: any) => {
    setFormParams((prev: any) => ({ ...prev, [paramName]: value }));
  };

  // Manejar la selección de una capacidad
  const handleSelectCapability = (capability: any) => {
    setSelectedCapability(capability);
    setFormParams({}); // Reset form params when capability changes
    setExecutionResult(null); // Clear previous results
  };

  // Manejar la ejecución de una capacidad
  const handleExecuteCapability = async () => {
    if (!selectedTool || !selectedCapability) return;

    // Basic validation: Check if all required params are filled
    const missingParams = selectedCapability.params?.filter(
      (param: any) => param.required && !formParams[param.name]
    );

    if (missingParams && missingParams.length > 0) {
      alert(`Faltan parámetros requeridos: ${missingParams.map((p: any) => p.name).join(", ")}`);
      return;
    }

    try {
      setIsExecuting(true);
      setExecutionResult(null);

      // Call the real backend API endpoint
      const response = await apiService.tools.execute(
        selectedTool.id, 
        selectedCapability.id, 
        formParams
      );

      setExecutionResult(response.data); // Store the actual response data
      // incrementToolUsage(selectedTool.id); // TODO: Implement or import useToolStore
      // TODO: Update user credits globally (e.g., refetch user data or update Zustand store)

    } catch (error: any) {
      console.error("Error executing capability:", error);
      setExecutionResult({
        status: "error",
        message: error.response?.data?.error || error.message || "Error al ejecutar la capacidad",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Manejar favoritos (Placeholder)
  const toggleFavorite = (toolId: string) => {
    console.log("Toggle favorite for:", toolId); // Placeholder
    // TODO: Implement actual favorite logic using useToolStore
    // if (favorites.includes(toolId)) {
    //   removeFromFavorites(toolId);
    // } else {
    //   addToFavorites(toolId);
    // }
  };
  
  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Main component render
  return (
    <div className="space-y-6 animate-fade-in font-inter"> {/* Use branding font and animation */}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-genia-black">Explorador de Herramientas</h1>
          <p className="text-genia-gray-dark">Descubre y utiliza las herramientas disponibles en GENIA</p>
        </div>
      </div>
      
      {/* Filters and Search - Apply branding styles */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar herramientas..."
            className="w-full px-4 py-2 border border-genia-gray-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-genia-blue/50 focus:border-genia-blue" // Branded input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Branded buttons - Simplified class logic */}
          <button
            className={`inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${selectedCategory === "all" ? 'bg-genia-blue text-genia-white border-genia-blue' : 'border-genia-gray-medium text-genia-gray-dark bg-genia-white hover:bg-genia-gray-light'}`}
            onClick={() => setSelectedCategory("all")}
          >
            Todas
          </button>
          {/* TODO: Dynamically generate categories from tools data */}
          <button
            className={`inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${selectedCategory === "ai" ? 'bg-genia-blue text-genia-white border-genia-blue' : 'border-genia-gray-medium text-genia-gray-dark bg-genia-white hover:bg-genia-gray-light'}`}
            onClick={() => setSelectedCategory("ai")}
          >
            IA
          </button>
          <button
            className={`inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${selectedCategory === "messaging" ? 'bg-genia-blue text-genia-white border-genia-blue' : 'border-genia-gray-medium text-genia-gray-dark bg-genia-white hover:bg-genia-gray-light'}`}
            onClick={() => setSelectedCategory("messaging")}
          >
            Mensajería
          </button>
          <button
            className={`inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${selectedCategory === "analytics" ? 'bg-genia-blue text-genia-white border-genia-blue' : 'border-genia-gray-medium text-genia-gray-dark bg-genia-white hover:bg-genia-gray-light'}`}
            onClick={() => setSelectedCategory("analytics")}
          >
            Analítica
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tools List - Apply branding styles */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-genia-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-genia-gray-medium/50">
              <h2 className="text-lg font-semibold text-genia-black">Herramientas</h2>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="divide-y divide-genia-gray-medium/30">
                {filteredTools?.map((tool: any) => (
                  <div 
                    key={tool.id}
                    className={`p-4 cursor-pointer hover:bg-genia-gray-light/50 transition-colors ${selectedTool?.id === tool.id ? 'bg-genia-blue/5' : ''}`}
                    onClick={() => handleSelectTool(tool)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-genia-mint/20 rounded-full text-genia-mint">
                        {/* TODO: Use Lucide icons consistently or tool.icon */} 
                        {tool.icon || '🛠️'} 
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-genia-black">{tool.name}</h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent selecting the tool when clicking favorite
                              toggleFavorite(tool.id);
                            }}
                            className="text-genia-gray-dark hover:text-yellow-500 transition-colors p-1 rounded-full hover:bg-yellow-100/50"
                            aria-label="Marcar como favorito"
                          >
                            {/* Use Lucide Star icon - Favorite status logic commented out */}
                            <Star className={`w-5 h-5`} />
                          </button>
                        </div>
                        <p className="text-sm text-genia-gray-dark mt-1">{tool.description}</p>
                        <div className="flex items-center mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${isToolAvailable(tool.plan) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {isToolAvailable(tool.plan) ? "Disponible" : "Plan Superior"}
                          </span>
                          <span className="text-xs text-genia-gray-dark ml-2">{tool.creditCost} créditos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Display message if no tools match filters */}
                {!isLoading && filteredTools?.length === 0 && (
                  <div className="p-4 text-center text-genia-gray-dark">
                    No se encontraron herramientas que coincidan con tu búsqueda o filtro.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tool Details - Apply branding styles */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTool ? (
            <>
              {/* Tool Header */}
              <div className="bg-genia-white rounded-2xl shadow-lg">
                <div className="p-6 border-b border-genia-gray-medium/50">
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-genia-mint/20 rounded-full text-genia-mint text-2xl mr-4">
                      {selectedTool.icon || '🛠️'}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-genia-black">{selectedTool.name}</h2>
                      <p className="text-sm text-genia-gray-dark">{selectedTool.description}</p>
                    </div>
                  </div>
                </div>
                
                {/* Capabilities Section */}
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4 text-genia-black">Capacidades</h3>
                  <div className="space-y-4">
                    {selectedTool.capabilities.map((capability: any) => (
                      <div key={capability.id} className="border border-genia-gray-medium/30 rounded-xl p-4">
                        <h4 className="font-medium text-genia-black">{capability.name}</h4>
                        <p className="text-sm text-genia-gray-dark mt-1">{capability.description}</p>
                        
                        {/* Parameters Form */}
                        <div className="mt-4">
                          <h5 className="text-sm font-medium mb-2 text-genia-gray-dark">Parámetros:</h5>
                          {capability.params && capability.params.length > 0 ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleExecuteCapability(); }} className="space-y-3">
                              {capability.params.map((param: any) => (
                                <div key={param.name}>
                                  <label htmlFor={`${capability.id}-${param.name}`} className="block text-sm font-medium text-genia-gray-dark mb-1">
                                    {param.name} {param.required && <span className="text-red-500">*</span>}
                                  </label>
                                  {/* TODO: Render different input types based on param.type (e.g., textarea, select) */}
                                  <input
                                    type={param.type === "number" ? "number" : "text"} // Basic type handling
                                    id={`${capability.id}-${param.name}`}
                                    name={param.name}
                                    placeholder={param.description || param.name}
                                    required={param.required}
                                    value={formParams[param.name] || ""}
                                    onChange={(e) => handleParamChange(param.name, e.target.value)}
                                    className="w-full px-3 py-2 border border-genia-gray-medium rounded-lg focus:outline-none focus:ring-1 focus:ring-genia-blue focus:border-genia-blue text-sm"
                                  />
                                </div>
                              ))}
                              {/* Execute Button within the form for this capability */}
                              <div className="mt-4">
                                <button
                                  type="submit" // Changed to submit
                                  disabled={isExecuting || !isToolAvailable(selectedTool.plan)}
                                  className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-genia-white ${isToolAvailable(selectedTool.plan) ? 'bg-genia-mint hover:bg-emerald-600' : 'bg-genia-gray-medium cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-genia-mint disabled:opacity-50`}
                                >
                                  {isExecuting ? (
                                    <>
                                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Ejecutando...
                                    </>
                                  ) : (
                                    `Ejecutar ${capability.name}`
                                  )}
                                </button>
                              </div>
                            </form>
                          ) : (
                            <p className="text-sm text-genia-gray-dark italic">Esta capacidad no requiere parámetros.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Execution Result Section */}
              {executionResult && (
                <div className="bg-genia-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-medium mb-4 text-genia-black">Resultado de la Ejecución</h3>
                  {executionResult.status === "error" ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <strong className="font-bold">Error: </strong>
                      <span className="block sm:inline">{executionResult.message}</span>
                    </div>
                  ) : (
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      {JSON.stringify(executionResult, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </>
          ) : (
            // Placeholder when no tool is selected
            <div className="bg-genia-white rounded-2xl shadow-lg p-10 text-center text-genia-gray-dark">
              <p>Selecciona una herramienta de la lista para ver sus detalles y capacidades.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolsExplorer;

