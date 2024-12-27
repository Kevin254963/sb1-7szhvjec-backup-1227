import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ShippingRate } from '../types/shipping';

export function useShippingRates() {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      const { data, error } = await supabase
        .from('shipping_zones')
        .select('*')
        .order('zip_code_start', { ascending: true });

      if (error) throw error;
      setRates(data || []);
    } catch (err) {
      console.error('Error loading shipping rates:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addRate = async (rateData: Omit<ShippingRate, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('shipping_zones')
        .insert([rateData]);

      if (error) throw error;
      await loadRates();
    } catch (err) {
      throw err;
    }
  };

  const updateRate = async (id: string, rateData: Partial<ShippingRate>) => {
    try {
      const { error } = await supabase
        .from('shipping_zones')
        .update(rateData)
        .eq('id', id);

      if (error) throw error;
      await loadRates();
    } catch (err) {
      throw err;
    }
  };

  const deleteRate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shipping_zones')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadRates();
    } catch (err) {
      throw err;
    }
  };

  return {
    rates,
    loading,
    error,
    addRate,
    updateRate,
    deleteRate,
    reloadRates: loadRates
  };
}