import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Users, Store, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminNavigation() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/admin" className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Admin Portal
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/users"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Users className="w-5 h-5 mr-1" />
              Users
            </Link>
            <Link
              to="/admin/suppliers"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Store className="w-5 h-5 mr-1" />
              Suppliers
            </Link>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <LogOut className="w-5 h-5 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}