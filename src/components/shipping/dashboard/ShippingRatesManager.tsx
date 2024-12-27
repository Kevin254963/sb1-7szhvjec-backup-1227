import React, { useState } from 'react';
import { DollarSign, Plus } from 'lucide-react';
import { useShippingRates } from '../../../hooks/useShippingRates';
import RateForm from './RateForm';

export default function ShippingRatesManager() {
  const { rates, loading, error, addRate, updateRate, deleteRate } = useShippingRates();
  const [showAddForm, setShowAddForm] = useState(false);

  if (!rates) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <DollarSign className="w-6 h-6 text-orange-600 mr-2" />
          <h2 className="text-xl font-semibold">Shipping Rates</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Rate
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ZIP Code Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Base Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rates.map((rate) => (
              <tr key={rate.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {rate.zip_code_start} - {rate.zip_code_end}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${rate.base_rate.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => deleteRate(rate.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <RateForm
          onSubmit={addRate}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}