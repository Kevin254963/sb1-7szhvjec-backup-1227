import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, Map, TrendingUp, Shield } from 'lucide-react';

export default function ShippingPartnerPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center">
            <Truck className="w-16 h-16 text-orange-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-8 mb-8">
            Shipping Partner Portal
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join our network of trusted shipping partners and grow your delivery business.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/shipping/register"
              className="px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors inline-flex items-center"
            >
              <Truck className="w-5 h-5 mr-2" />
              Become a Partner
            </Link>
            <Link
              to="/shipping/login"
              className="px-8 py-3 bg-white text-orange-600 rounded-lg font-semibold border border-orange-600 hover:bg-orange-50 transition-colors"
            >
              Partner Login
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Package className="w-12 h-12 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Delivery Management</h3>
            <p className="text-gray-600">Efficiently manage and track all your deliveries in one place</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Map className="w-12 h-12 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Service Areas</h3>
            <p className="text-gray-600">Define and manage your delivery service areas flexibly</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <TrendingUp className="w-12 h-12 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Business Growth</h3>
            <p className="text-gray-600">Expand your delivery business with our growing customer base</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Shield className="w-12 h-12 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
            <p className="text-gray-600">Operate on our secure and reliable delivery platform</p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Why Partner With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Increased Revenue</h3>
              <p className="text-gray-600">Access a large customer base and increase your delivery volume</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Map className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Coverage</h3>
              <p className="text-gray-600">Choose your service areas and manage them dynamically</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Reliable payment processing and financial security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}