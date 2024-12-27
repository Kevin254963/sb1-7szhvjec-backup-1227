import React from 'react';
import Navigation from './Navigation';
import ProductTable from './ProductTable';
import { useProducts } from '../hooks/useProducts';
import LoadingSpinner from './LoadingSpinner';

export default function ProductCatalog() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          Error loading products: {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <ProductTable products={products} />
    </div>
  );
}