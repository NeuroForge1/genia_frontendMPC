import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

const OAuthCallback: React.FC = () => {
  const { provider } = useParams<{ provider: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // En una implementación real, aquí procesaríamos la respuesta de OAuth
        // Para este ejemplo, simplemente simulamos un éxito después de un breve retraso
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast.success(`Inicio de sesión con ${provider} exitoso`);
        navigate('/dashboard');
      } catch (error: any) {
        console.error('Error en callback OAuth:', error);
        setError(error.message || 'Error al procesar la autenticación');
        toast.error('Error al procesar la autenticación');
      }
    };
    
    handleCallback();
  }, [provider, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-sm border">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Procesando autenticación</h1>
          
          {error ? (
            <div className="mt-4">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => navigate('/login')}
                className="mt-4 btn btn-primary"
              >
                Volver al inicio de sesión
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Completando el inicio de sesión con {provider}...</p>
              <p className="text-sm text-muted-foreground mt-2">Serás redirigido automáticamente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
