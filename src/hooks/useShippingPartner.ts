import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ShippingPartner } from '../types/shipping';

export function useShippingPartner() {
  const [partner, setPartner] = useState<ShippingPartner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPartner();
  }, []);

  const loadPartner = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPartner(null);
        return;
      }

      const { data, error } = await supabase
        .from('shipping_partners')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setPartner(data);
    } catch (err) {
      console.error('Error loading shipping partner:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { partner, loading, error };
}