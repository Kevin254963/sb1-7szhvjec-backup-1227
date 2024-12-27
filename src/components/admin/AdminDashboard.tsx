import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminNavigation from './AdminNavigation';
import AdminTabs from './Dashboard/AdminTabs';
import AdminContent from './Dashboard/AdminContent';
import { testConnection } from '../../lib/supabaseTest';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    async function checkConnection() {
      const isConnected = await testConnection();
      setConnectionError(!isConnected);
    }
    checkConnection();
  }, []);

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (connectionError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Database Connection Error</h2>
          <p className="text-gray-600">
            Unable to connect to the database. Please check your connection settings and try again.
          </p>
          <pre className="mt-4 p-4 bg-gray-50 rounded text-sm">
            URL: {import.meta.env.VITE_SUPABASE_URL}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavigation />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage suppliers, users, and system settings
          </p>
        </div>

        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <AdminContent activeTab={activeTab} />
      </div>
    </div>
  );
}