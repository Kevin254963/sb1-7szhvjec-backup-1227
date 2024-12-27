import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err instanceof Error ? err.message : 'Error loading products');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, reloadProducts: loadProducts };
}