import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Authorization, AuthState } from '../types/auth';

const defaultAuthState: AuthState = {
  role: null,
  permissions: {},
  isAdmin: false,
  isSupplier: false,
  isUser: false,
  can: () => false,
};

export function useAuth(): AuthState {
  const [auth, setAuth] = useState<AuthState>(defaultAuthState);

  useEffect(() => {
    const loadAuthorization = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setAuth(defaultAuthState);
          return;
        }

        const { data: authorization, error } = await supabase
          .from('authorizations')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Authorization error:', error);
          setAuth(defaultAuthState);
          return;
        }

        setAuth({
          role: authorization.role,
          permissions: authorization.permissions || {},
          isAdmin: authorization.role === 'admin',
          isSupplier: authorization.role === 'supplier',
          isUser: authorization.role === 'user',
          can: (permission: string) => !!authorization.permissions?.[permission],
        });
      } catch (error) {
        console.error('Error loading authorization:', error);
        setAuth(defaultAuthState);
      }
    };

    loadAuthorization();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadAuthorization();
    });

    return () => subscription.unsubscribe();
  }, []);

  return auth;
}