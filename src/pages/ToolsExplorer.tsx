import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api'; // Assuming apiService is correctly imported
import { Star, Search } from 'lucide-react'; // Assuming lucide-react icons are used
// import { useToolStore } from '../store/toolStore'; // Temporarily commented out

const ToolsExplorer: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    // const { favorites, toggleFavorite } = useToolStore(); // Temporarily commented out

    const { data: toolsData, isLoading, error } = useQuery('availableTools', apiService.tools.getAvailable);

    const filteredTools = toolsData?.data?.filter((tool: any) => // Added 'any' for now, should be typed later
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><p>Cargando...</p></div>;
    }

    if (error) {
        // Added type assertion for error
        return <div className="flex justify-center items-center h-screen"><p>Error al cargar las herramientas: {(error as Error).message}</p></div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Explorador de Herramientas</h1>

            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Buscar herramientas por nombre o descripción..."
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {filteredTools && filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.map((tool: any) => ( // Added 'any' for now
                        <div key={tool.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 flex flex-col">
                            <Link to={`/tools/${tool.id}`} className="flex-grow">
                                <div className="p-5">
                                    <div className="flex items-center mb-3">
                                        {/* Placeholder for tool icon - assuming tool.icon_url exists or use a default */}
                                        <img src={tool.icon_url || '/default-icon.png'} alt={`${tool.name} icon`} className="w-10 h-10 mr-4 rounded-full object-cover" onError={(e) => (e.currentTarget.src = '/default-icon.png')} />
                                        <h2 className="text-xl font-semibold text-gray-800">{tool.name}</h2>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                                </div>
                            </Link>
                            <div className="p-5 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-xs text-gray-500">ID: {tool.id}</span>
                                {/* Simplified Star icon logic - temporarily removing favorite toggle */}
                                <button
                                    // onClick={() => toggleFavorite(tool.id)} // Temporarily commented out
                                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                                    aria-label={/* favorites.includes(tool.id) ? */ "Quitar de favoritos" /* : "Añadir a favoritos" */} // Simplified label
                                >
                                    {/* Simplified className, removing conditional styling based on favorites */}
                                    <Star className={`w-5 h-5`} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500">No se encontraron herramientas que coincidan con tu búsqueda.</p>
                </div>
            )}
        </div> // Closing main container div
    ); // Closing return statement
}; // Closing component function

export default ToolsExplorer; // Exporting component

