import React from 'react';
import { states } from '../../data/states';

interface ServiceAreasSelectProps {
  selectedAreas: string[];
  onChange: (areas: string[]) => void;
}

export default function ServiceAreasSelect({ selectedAreas, onChange }: ServiceAreasSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      onChange([...selectedAreas, value]);
    } else {
      onChange(selectedAreas.filter(area => area !== value));
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onChange(states.map(state => state.code));
    } else {
      onChange([]);
    }
  };

  const allSelected = selectedAreas.length === states.length;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Service Areas
      </label>
      <div className="border border-gray-300 rounded-md">
        <div className="p-3 border-b border-gray-300 bg-gray-50">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">Select All States</span>
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 max-h-48 overflow-y-auto">
          {states.map(state => (
            <label key={state.code} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={state.code}
                checked={selectedAreas.includes(state.code)}
                onChange={handleChange}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">{state.name}</span>
            </label>
          ))}
        </div>
      </div>
      {selectedAreas.length === 0 && (
        <p className="mt-1 text-sm text-red-600">
          Please select at least one service area
        </p>
      )}
      <p className="mt-1 text-sm text-gray-500">
        {selectedAreas.length} of {states.length} states selected
      </p>
    </div>
  );
}