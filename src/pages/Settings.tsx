import React from 'react';

const Settings: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Configuración</h1>
      <p className="text-muted-foreground">Gestiona tu perfil, integraciones y preferencias.</p>
      {/* Placeholder for settings sections (Profile, Integrations, Billing, etc.) */}
      <div className="mt-4 p-6 border rounded-lg bg-white">
        <p>Próximamente: Interfaz de configuración de cuenta.</p>
        {/* Sub-routes or tabs for Profile, Billing, Integrations could go here */}
      </div>
    </div>
  );
};

export default Settings;

