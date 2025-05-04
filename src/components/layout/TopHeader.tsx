import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CreditsBar from './CreditsBar';
import { Bell, UserCircle } from 'lucide-react';

const TopHeader: React.FC = () => {
  const { userDetails } = useAuth();

  return (
    <div className="h-16 bg-genia-white border-b border-genia-gray-medium flex items-center justify-between px-6 sticky top-0 z-10 font-inter">
      {/* Left side - Can be used for breadcrumbs or page title if needed */}
      <div>
        {/* Placeholder for potential future use */}
      </div>

      {/* Right side - Credits, Notifications, User Menu */}
      <div className="flex items-center space-x-4">
        <CreditsBar />

        <button className="p-2 rounded-full hover:bg-gray-100 text-genia-gray-dark hover:text-genia-black transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        {/* User Menu Placeholder */}
        <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
          <UserCircle className="w-6 h-6 text-genia-gray-dark" />
          <span className="text-sm font-medium text-genia-gray-dark hidden md:block">
            {userDetails?.name || "Usuario"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;

