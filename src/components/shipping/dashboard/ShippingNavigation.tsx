import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Map, DollarSign, LogOut } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function ShippingNavigation() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/shipping/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/shipping/dashboard" className="flex items-center">
              <Truck className="h-8 w-8 text-orange-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Shipping Portal
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/shipping/rates"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <DollarSign className="w-5 h-5 mr-1" />
              Shipping Rates
            </Link>
            <Link
              to="/shipping/areas"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Map className="w-5 h-5 mr-1" />
              Service Areas
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