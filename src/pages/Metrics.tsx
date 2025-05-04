import React from 'react';

const Metrics: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in font-inter">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-genia-black">Métricas</h1>
        <p className="text-genia-gray-dark">Visualiza el rendimiento de tus acciones y el crecimiento de tu negocio.</p>
      </div>

      {/* Placeholder for metrics visualization - Apply branding styles */}
      <div className="bg-genia-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-genia-black">Panel de Métricas</h2>
          {/* Placeholder for date range picker or filters */}
        </div>
        {/* Placeholder for charts and key metrics */}
        <div className="text-center py-12 border-2 border-dashed border-genia-gray-medium/50 rounded-xl">
          <p className="text-genia-gray-dark">Próximamente: Gráficos interactivos y métricas clave (Leads, Ventas, CVR).</p>
          {/* Example: Could show placeholder charts here */}
        </div>
      </div>
    </div>
  );
};

export default Metrics;

