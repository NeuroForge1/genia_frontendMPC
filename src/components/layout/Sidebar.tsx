import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bot, Settings, BarChart3, CreditCard, Users, Mail, MessageSquare, Link, Search } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/chat', icon: Bot, label: 'Genia CEO' },
    { path: '/tools', icon: Search, label: 'Herramientas' }, // Using Search as a placeholder for Tools/Explore
    { path: '/funnels', icon: Link, label: 'Embudos' },
    { path: '/content', icon: Mail, label: 'Contenido' }, // Using Mail as placeholder
    { path: '/metrics', icon: BarChart3, label: 'Métricas' },
    { path: '/referrals', icon: Users, label: 'Referidos' }, // Assuming a /referrals route
    { path: '/pricing', icon: CreditCard, label: 'Planes' },
    { path: '/settings', icon: Settings, label: 'Configuración' }, // Assuming a /settings route base
  ];

  return (
    <div className="w-64 h-screen bg-genia-sidebar text-gray-300 p-4 fixed left-0 top-0 flex flex-col font-inter">
      {/* Logo Placeholder */}
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-bold text-genia-white">GENIA</h1>
        <p className="text-xs text-gray-400">No pienses, ejecuta.</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-700 text-genia-white' : 'hover:bg-gray-800 hover:text-genia-white'}`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer/User Info Placeholder */}
      <div className="mt-auto border-t border-gray-700 pt-4">
        {/* User profile/logout can go here */}
        <p className="text-xs text-center text-gray-500">© 2025 GENIA</p>
      </div>
    </div>
  );
};

export default Sidebar;

