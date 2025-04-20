import React from 'react';
import { useUIStore } from '@/services/store';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon,
  BellIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { toggleSidebar, sidebarOpen, toggleDarkMode, darkMode } = useUIStore();
  const { user, userDetails, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  
  // Cerrar menús al hacer clic fuera de ellos
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b bg-card shadow-sm">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 mr-4 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {sidebarOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
        
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold">GENIA MCP</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {darkMode ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>
        
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Notificaciones"
          >
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card rounded-md shadow-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">Notificaciones</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-border hover:bg-muted">
                  <p className="text-sm font-medium">Bienvenido a GENIA MCP</p>
                  <p className="text-xs text-muted-foreground mt-1">Explora todas las herramientas disponibles</p>
                  <p className="text-xs text-muted-foreground mt-1">Hace 2 horas</p>
                </div>
                <div className="p-4 border-b border-border hover:bg-muted">
                  <p className="text-sm font-medium">Nuevos créditos añadidos</p>
                  <p className="text-xs text-muted-foreground mt-1">Se han añadido 100 créditos a tu cuenta</p>
                  <p className="text-xs text-muted-foreground mt-1">Hace 1 día</p>
                </div>
              </div>
              <div className="p-2 text-center border-t border-border">
                <Link to="/notifications" className="text-xs text-primary hover:underline">
                  Ver todas las notificaciones
                </Link>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
            aria-label="Menú de usuario"
          >
            {userDetails?.avatar_url ? (
              <img 
                src={userDetails.avatar_url} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="w-8 h-8" />
            )}
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-card rounded-md shadow-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <p className="font-medium">{userDetails?.name || user?.email}</p>
                <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
              </div>
              <div className="p-2">
                <Link 
                  to="/profile" 
                  className="flex items-center px-4 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setShowUserMenu(false)}
                >
                  Perfil
                </Link>
                <Link 
                  to="/dashboard" 
                  className="flex items-center px-4 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setShowUserMenu(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center px-4 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setShowUserMenu(false)}
                >
                  Configuración
                </Link>
              </div>
              <div className="p-2 border-t border-border">
                <button 
                  onClick={() => {
                    signOut();
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-muted rounded-md text-left"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
