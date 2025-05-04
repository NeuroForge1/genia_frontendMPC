import React from 'react';

const Funnels: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in font-inter">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-genia-black">Embudos</h1>
        <p className="text-genia-gray-dark">Diseña, gestiona y analiza tus embudos de automatización.</p>
      </div>

      {/* Placeholder for funnels management interface - Apply branding styles */}
      <div className="bg-genia-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-genia-black">Mis Embudos</h2>
          {/* Branded primary button */}
          <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-genia-white bg-genia-mint hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-genia-mint">
            Crear Nuevo Embudo
          </button>
        </div>
        {/* Placeholder for funnel list or editor */}
        <div className="text-center py-12 border-2 border-dashed border-genia-gray-medium/50 rounded-xl">
          <p className="text-genia-gray-dark">Próximamente: Editor visual y listado de embudos.</p>
          {/* Example: Could show a list of existing funnels here */}
        </div>
      </div>
    </div>
  );
};

export default Funnels;

