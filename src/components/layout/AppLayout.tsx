import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import the actual Sidebar
import TopHeader from './TopHeader'; // Import the actual TopHeader

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-inter"> {/* Added font-inter based on branding */}
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64"> {/* Adjust margin-left to match sidebar width */}
        {/* Top Header */}
        <TopHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* Renders the matched child route component */}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

