import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUIStore } from '@/services/store';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  CreditCardIcon,
  UserIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const { sidebarOpen } = useUIStore();
  const { userDetails, signOut } = useAuth();
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Herramientas', href: '/tools', icon: WrenchScrewdriverIcon },
    { name: 'Analíticas', href: '/analytics', icon: ChartBarIcon },
    { name: 'Planes', href: '/pricing', icon: CreditCardIcon },
    { name: 'Perfil', href: '/profile', icon: UserIcon },
    { name: 'Configuración', href: '/settings', icon: Cog6ToothIcon },
    { name: 'Ayuda', href: '/help', icon: QuestionMarkCircleIcon },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  if (!sidebarOpen) {
    return null;
  }
  
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:translate-x-0">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-border">
          <h1 className="text-xl font-bold">GENIA MCP</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-md
                  ${isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'}
                `}
              >
                <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {userDetails?.avatar_url ? (
                <img
                  className="h-10 w-10 rounded-full"
                  src={userDetails.avatar_url}
                  alt="Avatar"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-primary" />
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{userDetails?.name || 'Usuario'}</p>
              <p className="text-xs text-muted-foreground">{userDetails?.plan || 'Plan Free'}</p>
            </div>
          </div>
          
          <button
            onClick={signOut}
            className="mt-4 flex items-center px-4 py-2 text-sm font-medium w-full rounded-md hover:bg-muted"
          >
            <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
