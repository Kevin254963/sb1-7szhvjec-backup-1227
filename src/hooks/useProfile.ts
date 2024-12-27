import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/profile';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // First try to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingProfile) {
        setProfile(existingProfile);
        setLoading(false);
        return;
      }

      // If no profile exists, create one
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{ 
          id: user.id, 
          email: user.email,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (createError) throw createError;
      
      setProfile(newProfile);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    reloadProfile: loadProfile
  };
}