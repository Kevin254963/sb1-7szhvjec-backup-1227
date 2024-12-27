import React from 'react';
import { useShippingPartner } from '../../../hooks/useShippingPartner';
import ShippingNavigation from './ShippingNavigation';
import ShippingRatesManager from './ShippingRatesManager';
import ServiceAreasManager from './ServiceAreasManager';
import LoadingSpinner from '../../LoadingSpinner';

export default function ShippingPartnerDashboard() {
  const { partner, loading } = useShippingPartner();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!partner) {
    return null;
  }

  return (
    <div>
      <ShippingNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {partner.company_name}</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your shipping rates and service areas</p>
          </div>
          <div className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
            Verified Partner
          </div>
        </div>

        <div className="space-y-8">
          <ShippingRatesManager />
          <ServiceAreasManager />
        </div>
      </div>
    </div>
  );
}