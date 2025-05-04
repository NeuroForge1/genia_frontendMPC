import React from 'react';

const Referrals: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in font-inter">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-genia-black">Referidos</h1>
        <p className="text-genia-gray-dark">Gestiona tu programa de referidos y haz crecer tu red.</p>
      </div>

      {/* Placeholder for referrals management interface - Apply branding styles */}
      <div className="bg-genia-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-genia-black">Programa de Referidos</h2>
          {/* Placeholder for referral link or stats */}
        </div>
        {/* Placeholder for referral stats and list */}
        <div className="text-center py-12 border-2 border-dashed border-genia-gray-medium/50 rounded-xl">
          <p className="text-genia-gray-dark">Próximamente: Enlace de referido único, estadísticas y listado de referidos.</p>
          {/* Example: Could show referral link and basic stats */}
        </div>
      </div>
    </div>
  );
};

export default Referrals;

