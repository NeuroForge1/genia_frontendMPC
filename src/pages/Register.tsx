import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';

const Register: React.FC = () => {
  const { signUp, signInWithGoogle, signInWithFacebook } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password, data.name);
      toast.success('Registro exitoso. Por favor, verifica tu correo electrónico para activar tu cuenta.');
      // Optionally navigate to a confirmation page or login page
      // navigate('/login'); 
    } catch (error: any) {
      console.error('Error en registro:', error);
      toast.error(error.message || 'Error al registrar la cuenta. Inténtalo de nuevo.');
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
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      {/* Logo/Brand Name */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-purple-700 tracking-tight">GENIA</h1>
        <p className="text-gray-600">Tu Centro de Mando Inteligente</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Crear Nueva Cuenta</h2>

        {/* Registration Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Tu Nombre"
              className={`input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              {...register('name', {
                required: 'El nombre es obligatorio',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres'
                }
              })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

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
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número, símbolo"
              className={`input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres'
                },
                // Consider simplifying the regex or providing clearer feedback if needed
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                  message: 'Incluir mayúscula, minúscula, número y símbolo'
                }
              })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repite la contraseña"
              className={`input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              {...register('confirmPassword', {
                required: 'Debes confirmar la contraseña',
                validate: value => value === password || 'Las contraseñas no coinciden'
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              {...register('terms', { required: 'Debes aceptar los términos' })}
            />
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-600">
                Acepto los{' '}
                <Link to="/terms" target="_blank" className="font-medium text-purple-600 hover:text-purple-500">
                  Términos y Condiciones
                </Link>{' '}y la{' '}
                <Link to="/privacy" target="_blank" className="font-medium text-purple-600 hover:text-purple-500">
                  Política de Privacidad
                </Link>.
              </label>
              {errors.terms && (
                <p className="mt-1 text-xs text-red-600">{errors.terms.message}</p>
              )}
            </div>
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
                  Registrando...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-center">
          <span className="border-t border-gray-300 flex-grow"></span>
          <span className="px-3 text-sm text-gray-500">O regístrate con</span>
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

        {/* Link to Login */}
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

