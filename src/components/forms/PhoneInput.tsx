import React from 'react';
import { formatPhoneNumber } from '../../utils/formatters';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  return (
    <div>
      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
        Phone Number *
      </label>
      <div className="mt-1 relative">
        <input
          type="tel"
          id="phone"
          required
          value={value}
          onChange={(e) => onChange(formatPhoneNumber(e.target.value))}
          placeholder="(555)555-5555"
          className={`block w-full rounded-md px-3 py-2 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } shadow-sm focus:outline-none focus:ring-1`}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}