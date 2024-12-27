import React from 'react';
import { Map } from 'lucide-react';
import { useShippingPartner } from '../../../hooks/useShippingPartner';
import ServiceAreasSelect from '../ServiceAreasSelect';

export default function ServiceAreasManager() {
  const { partner, loading } = useShippingPartner();

  if (!partner || loading) return null;

  const handleServiceAreasChange = async (areas: string[]) => {
    // Service areas update logic will be implemented here
    console.log('Updating service areas:', areas);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <Map className="w-6 h-6 text-orange-600 mr-2" />
        <h2 className="text-xl font-semibold">Service Areas</h2>
      </div>

      <ServiceAreasSelect
        selectedAreas={partner.service_areas}
        onChange={handleServiceAreasChange}
      />
    </div>
  );
}