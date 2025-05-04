import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';

import AppLayout from '@/components/layout/AppLayout'; // Import the layout

// Importar páginas
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import OAuthCallback from '@/pages/OAuthCallback';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import ToolsExplorer from '@/pages/ToolsExplorer';
import Profile from '@/pages/Profile';
import Pricing from '@/pages/Pricing';

// Crear cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Rutas protegidas envueltas en AppLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}> {/* Wrap protected routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tools" element={<ToolsExplorer />} />
                <Route path="/profile" element={<Profile />} />
                {/* Add other protected routes inside AppLayout here */}
              </Route>
            </Route>
            
            {/* Redirección y 404 */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
