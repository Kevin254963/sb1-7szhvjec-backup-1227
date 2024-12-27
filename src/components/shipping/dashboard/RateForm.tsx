import React, { useState } from 'react';
import { X } from 'lucide-react';

interface RateFormProps {
  onSubmit: (data: {
    zip_code_start: string;
    zip_code_end: string;
    base_rate: number;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function RateForm({ onSubmit, onCancel }: RateFormProps) {
  const [formData, setFormData] = useState({
    zip_code_start: '',
    zip_code_end: '',
    base_rate: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.zip_code_start || !formData.zip_code_end || !formData.base_rate) {
      setError('All fields are required');
      return;
    }

    try {
      await onSubmit({
        zip_code_start: formData.zip_code_start,
        zip_code_end: formData.zip_code_end,
        base_rate: parseFloat(formData.base_rate)
      });
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Add Shipping Rate</h3>
          <button onClick={onCancel}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Starting ZIP Code
            </label>
            <input
              type="text"
              pattern="[0-9]{5}"
              required
              value={formData.zip_code_start}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                zip_code_start: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="00000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ending ZIP Code
            </label>
            <input
              type="text"
              pattern="[0-9]{5}"
              required
              value={formData.zip_code_end}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                zip_code_end: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="99999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Base Rate ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.base_rate}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                base_rate: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="0.00"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
            >
              Add Rate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}