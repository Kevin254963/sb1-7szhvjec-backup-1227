import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSupplier } from '../../hooks/useSupplier';
import { validateProduct } from '../../utils/validation';
import ProductForm from './forms/ProductForm';
import type { ProductFormData } from '../../types/product';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export default function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const { supplier } = useSupplier();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    length: '',
    width: '',
    height: '',
    hsCode: '',
    price: '',
    stock: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateProduct(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('products')
        .insert([{
          supplier_id: supplier?.id,
          name: formData.name,
          description: formData.description,
          dimensions: {
            length: parseFloat(formData.length),
            width: parseFloat(formData.width),
            height: parseFloat(formData.height)
          },
          hs_code: formData.hsCode,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          active: true
        }]);

      if (insertError) throw insertError;

      onProductAdded();
      onClose();
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err instanceof Error ? err.message : 'Error adding product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Add New Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <ProductForm 
            formData={formData}
            onChange={handleChange}
            error={error}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}