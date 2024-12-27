import React from 'react';
import { ProductFormData } from '../../../types/product';

interface ProductFormProps {
  formData: ProductFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
}

export default function ProductForm({ formData, onChange, error }: ProductFormProps) {
  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow numbers and one decimal point
    const sanitizedValue = value.replace(/[^\d.]/g, '');
    // Handle multiple decimal points - keep only the first one
    const parts = sanitizedValue.split('.');
    const formattedValue = parts.length > 2 
      ? `${parts[0]}.${parts[1]}`
      : sanitizedValue;

    onChange({
      ...e,
      target: {
        ...e.target,
        name,
        value: formattedValue
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          required
          value={formData.description}
          onChange={onChange}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Length (cm)</label>
          <input
            type="text"
            inputMode="decimal"
            name="length"
            required
            value={formData.length}
            onChange={handleDimensionChange}
            placeholder="0.00"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Width (cm)</label>
          <input
            type="text"
            inputMode="decimal"
            name="width"
            required
            value={formData.width}
            onChange={handleDimensionChange}
            placeholder="0.00"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
          <input
            type="text"
            inputMode="decimal"
            name="height"
            required
            value={formData.height}
            onChange={handleDimensionChange}
            placeholder="0.00"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">HS Code</label>
        <input
          type="text"
          name="hsCode"
          required
          placeholder="e.g., 7304.31"
          value={formData.hsCode}
          onChange={onChange}
          pattern="\d{4}\.\d{2}"
          title="HS Code must be in format: XXXX.XX"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price ($)</label>
        <input
          type="number"
          name="price"
          required
          min="0.01"
          step="0.01"
          value={formData.price}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          name="stock"
          required
          min="0"
          value={formData.stock}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}