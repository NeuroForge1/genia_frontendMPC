import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userDetails: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserDetails(session.user.id);
        }
      } catch (error) {
        console.error('Error al obtener sesión inicial:', error);
        toast.error('Error al iniciar sesión');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Manejar tokens de sesión desde el hash de la URL (para confirmación de email/OAuth)
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // Quita el # inicial
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");

      if (accessToken && refreshToken) {
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(({ data, error }) => {
            if (error) {
              console.error("Error setting session from URL hash:", error);
              toast.error("Error al procesar la sesión desde la URL.");
            } else if (data.session) {
              if (type === "signup") {
                toast.success("¡Correo electrónico confirmado con éxito!");
              }
              // El onAuthStateChange debería manejar la actualización del estado
              // Limpiar el hash de la URL
              window.history.replaceState(null, "", window.location.pathname + window.location.search);
              // Navegar al dashboard después de confirmar/iniciar sesión desde URL
              navigate("/dashboard"); 
            }
          });
      } else if (params.get("error")) {
        // Manejar errores de OAuth en el hash
        toast.error(`Error de autenticación: ${params.get("error_description") || params.get("error")}`);
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserDetails(session.user.id);
        } else {
          setUserDetails(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      setUserDetails(data);
    } catch (error) {
      console.error('Error al obtener detalles del usuario:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    let success = false; // Flag to track success
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Fetch details directly after successful sign-in
      if (data.user) {
         await fetchUserDetails(data.user.id); 
         success = true; // Mark as successful
      } else {
         // This case shouldn't happen if signInWithPassword succeeds without error, but handle defensively
         throw new Error("Inicio de sesión exitoso pero no se encontró el usuario.");
      }

    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
      // Only navigate if sign-in and detail fetching were successful
      if (success) {
        toast.success('Inicio de sesión exitoso');
        navigate('/dashboard');
      }
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Registro exitoso. Revisa tu correo para confirmar tu cuenta.");
      // navigate("/dashboard"); // No redirigir automáticamente, esperar confirmación
    } catch (error: any) {
      console.error('Error al registrarse:', error);
      toast.error(error.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast.success('Sesión cerrada');
      navigate('/login');
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      toast.error(error.message || 'Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback/google`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión con Google:', error);
      toast.error(error.message || 'Error al iniciar sesión con Google');
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback/facebook`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión con Facebook:', error);
      toast.error(error.message || 'Error al iniciar sesión con Facebook');
      setLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }
      
      // Actualizar datos en la tabla usuarios
      const { error } = await supabase
        .from('usuarios')
        .update(data)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Actualizar datos en el contexto
      await fetchUserDetails(user.id);
      
      toast.success('Perfil actualizado correctamente');
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      toast.error(error.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    userDetails,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
