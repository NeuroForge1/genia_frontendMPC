import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-sm border text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Página no encontrada</h2>
        <p className="mt-2 text-muted-foreground">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <a 
          href="/"
          className="mt-6 inline-block btn btn-primary"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
