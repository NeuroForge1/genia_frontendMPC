import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { toast } from 'react-hot-toast';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        toast.error("No se pudo iniciar sesión con el proveedor");
        console.error("Error al obtener la sesión:", error);
        navigate("/login");
        return;
      }

      toast.success("Inicio de sesión exitoso");
      navigate("/dashboard");
    };

    handleOAuthRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-lg text-muted-foreground">Procesando autenticación...</p>
    </div>
  );
};

export default OAuthCallback;
