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
        // toast.error('Error al iniciar sesión'); // Avoid toast on initial load error
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
        setLoading(true); // Show loading while processing hash
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(({ data, error }) => {
            if (error) {
              console.error("Error setting session from URL hash:", error);
              toast.error("Error al procesar la sesión desde la URL.");
              setLoading(false);
              navigate('/login'); // Redirect to login on error
            } else if (data.session) {
              // Session set successfully, onAuthStateChange will handle the rest
              if (type === "signup") {
                toast.success("¡Correo electrónico confirmado con éxito!");
              }
              // Limpiar el hash de la URL
              window.history.replaceState(null, "", window.location.pathname + window.location.search);
              // Navigate to dashboard *after* onAuthStateChange likely finishes
              // Let onAuthStateChange handle setting loading to false
              navigate("/dashboard"); 
            }
          }).catch(err => {
            console.error("Catch setting session from URL hash:", err);
            toast.error("Error inesperado al procesar la sesión desde la URL.");
            setLoading(false);
            navigate('/login');
          });
      } else if (params.get("error")) {
        // Manejar errores de OAuth en el hash
        toast.error(`Error de autenticación: ${params.get("error_description") || params.get("error")}`);
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        setLoading(false); // Ensure loading is false
        navigate('/login'); // Redirect to login on OAuth error
      }
    }

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("onAuthStateChange triggered. Event:", _event, "Session:", !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log("Fetching user details for", session.user.id);
          await fetchUserDetails(session.user.id);
        } else {
          console.log("No session or user, clearing userDetails.");
          setUserDetails(null);
        }
        
        console.log("Setting loading to false in onAuthStateChange");
        setLoading(false); // Ensure loading is false after state change is processed
      }
    );

    return () => {
      console.log("Unsubscribing from onAuthStateChange");
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Removed navigate from dependencies as it can cause loops if not stable

  const fetchUserDetails = async (userId: string) => {
    console.log(`Attempting to fetch details for user ${userId}`);
    try {
      const { data, error, status } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && status !== 406) { // 406: No rows found
        console.error(`Error fetching user details for ${userId} (status ${status}):`, error);
        setUserDetails(null); // Clear details on significant error
        return null;
      }

      if (data) {
        console.log(`Successfully fetched details for user ${userId}:`, data);
        setUserDetails(data);
        return data;
      }
      
      // Status 406: User exists in auth but not in 'usuarios' table yet (normal for new signups)
      console.warn(`No details found for user ${userId} (status ${status}), likely a new user.`);
      setUserDetails(null); 
      return null;

    } catch (error) {
      console.error(`Catch block error in fetchUserDetails for ${userId}:`, error);
      setUserDetails(null); 
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true); // Set loading true for the sign-in attempt
      console.log("Attempting sign in for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase signIn error:', error);
        throw error; // Throw error to be caught below
      }

      // If signInWithPassword succeeds, onAuthStateChange will trigger,
      // which will fetch user details and set loading to false.
      // We can navigate immediately.
      console.log("Supabase signIn successful, navigating to dashboard...");
      toast.success('Inicio de sesión exitoso');
      navigate('/dashboard');
      // setLoading(false); // Let onAuthStateChange handle setting loading to false

    } catch (error: any) {
      console.error('Error caught during sign in process:', error);
      toast.error(error.message || 'Error al iniciar sesión');
      setLoading(false); // Explicitly set loading false ONLY on error
    }
    // No finally block needed as success path relies on onAuthStateChange
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      console.log("Attempting sign up for:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name, // Store name in user metadata if needed
          },
          // emailRedirectTo: `${window.location.origin}/` // Redirect to home after confirmation
        },
      });

      if (error) {
        console.error('Supabase signUp error:', error);
        throw error;
      }

      // User created in auth, but needs confirmation.
      // Optionally create entry in 'usuarios' table here if needed immediately,
      // otherwise, could be done via trigger or after email confirmation.
      console.log("Supabase signUp successful (confirmation required):", data.user);
      toast.success("Registro exitoso. Revisa tu correo para confirmar tu cuenta.");
      // navigate("/dashboard"); // Do not redirect automatically
    } catch (error: any) {
      console.error('Error caught during sign up process:', error);
      toast.error(error.message || 'Error al registrarse');
    } finally {
      setLoading(false); // Set loading false after attempt
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log("Attempting sign out...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
        throw error;
      }
      console.log("Sign out successful, navigating to login.");
      setUserDetails(null); // Clear user details on sign out
      toast.success('Sesión cerrada');
      navigate('/login');
    } catch (error: any) {
      console.error('Error caught during sign out process:', error);
      toast.error(error.message || 'Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  // --- OAuth Methods (Placeholders - Ensure Redirect URLs are configured in Supabase) ---
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      console.log("Attempting Google OAuth sign in...");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Ensure this matches Supabase config and your routing setup
          // redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      // Supabase handles redirection
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast.error(error.message || 'Error al iniciar sesión con Google');
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setLoading(true);
      console.log("Attempting Facebook OAuth sign in...");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          // Ensure this matches Supabase config and your routing setup
          // redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      // Supabase handles redirection
    } catch (error: any) {
      console.error('Error signing in with Facebook:', error);
      toast.error(error.message || 'Error al iniciar sesión con Facebook');
      setLoading(false);
    }
  };
  // --- End OAuth Methods ---

  const updateProfile = async (data: any) => {
    try {
      setLoading(true);
      if (!user) throw new Error('No hay usuario autenticado');
      
      console.log(`Updating profile for user ${user.id} with data:`, data);
      const { error } = await supabase
        .from('usuarios')
        .update(data)
        .eq('id', user.id);

      if (error) {
        console.error(`Error updating profile for ${user.id}:`, error);
        throw error;
      }

      // Re-fetch details to update context state
      console.log("Profile updated, re-fetching details...");
      await fetchUserDetails(user.id);
      
      toast.success('Perfil actualizado correctamente');
    } catch (error: any) {
      console.error('Error caught during profile update:', error);
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

