import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { FaGoogle, FaFacebookF } from 'react-icons/fa'; // Import icons

const Login: React.FC = () => {
  const { signIn, signInWithGoogle, signInWithFacebook } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      // Supabase handles redirection via onAuthStateChange in AuthContext
      // toast.success('Inicio de sesión exitoso'); // Toast might be handled in AuthContext
    } catch (error: any) {
      console.error('Error en inicio de sesión:', error);
      toast.error(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithFacebook();
      }
      // Redirection is handled by Supabase/AuthContext
    } catch (error: any) {
      console.error(`Error al iniciar sesión con ${provider}:`, error);
      toast.error(error.message || `Error al iniciar sesión con ${provider}.`);
      setIsLoading(false); // Ensure loading state is reset on error
    }
    // No need for finally here if redirection happens
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      {/* Logo/Brand Name */}
      <div className="mb-8 text-center">
        {/* Placeholder for a proper logo if available */}
        {/* <img src="/logo.png" alt="GENIA Logo" className="h-12 mx-auto mb-2" /> */}
        <h1 className="text-4xl font-bold text-purple-700 tracking-tight">GENIA</h1>
        <p className="text-gray-600">Tu Centro de Mando Inteligente</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Iniciar Sesión</h2>

        {/* Login Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              className={`input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              {...register('email', {
                required: 'El correo electrónico es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Dirección de correo inválida'
                }
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={`input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-gray-700">
                Recordarme
              </label>
            </div>
            <Link to="/forgot-password" className="font-medium text-purple-600 hover:text-purple-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="btn w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-center">
          <span className="border-t border-gray-300 flex-grow"></span>
          <span className="px-3 text-sm text-gray-500">O continúa con</span>
          <span className="border-t border-gray-300 flex-grow"></span>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading}
            className="btn w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50"
          >
            <FaGoogle className="w-5 h-5 mr-2 text-red-500" />
            Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuthSignIn('facebook')}
            disabled={isLoading}
            className="btn w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50"
          >
            <FaFacebookF className="w-5 h-5 mr-2 text-blue-600" />
            Facebook
          </button>
        </div>

        {/* Link to Register */}
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

