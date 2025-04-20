import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Plan básico gratuito',
      features: [
        'Acceso a herramientas básicas de IA',
        'Límite de 5 tareas por día',
        'Soporte comunitario'
      ],
      credits: 10,
      recommended: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19.99,
      description: 'Plan profesional con más herramientas',
      features: [
        'Acceso a todas las herramientas de IA',
        'Límite de 50 tareas por día',
        'Soporte por email',
        'Procesamiento prioritario'
      ],
      credits: 100,
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99.99,
      description: 'Plan empresarial con todas las funcionalidades',
      features: [
        'Acceso ilimitado a todas las herramientas',
        'Sin límite de tareas',
        'Soporte dedicado',
        'Procesamiento prioritario',
        'Herramientas personalizadas'
      ],
      credits: 1000,
      recommended: false
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    if (!selectedPlan) return;
    
    if (user) {
      // Redirigir a la página de pago o actualizar el plan
      navigate('/dashboard');
    } else {
      // Redirigir a la página de registro
      navigate('/register', { state: { selectedPlan } });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Planes y Precios
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`border rounded-lg shadow-sm divide-y divide-gray-200 ${
                plan.recommended ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200'
              }`}
            >
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">{plan.name}</h2>
                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  {plan.price > 0 && <span className="text-base font-medium text-gray-500">/mes</span>}
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  Incluye {plan.credits} créditos
                </p>
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`mt-8 block w-full py-2 px-4 rounded-md text-sm font-semibold text-center ${
                    selectedPlan === plan.id
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Seleccionado' : 'Seleccionar'}
                </button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  Características
                </h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex">
                      <svg 
                        className="flex-shrink-0 h-5 w-5 text-green-500" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      <span className="ml-3 text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={handleSubscribe}
            disabled={!selectedPlan}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {user ? 'Actualizar Plan' : 'Registrarse y Suscribirse'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
