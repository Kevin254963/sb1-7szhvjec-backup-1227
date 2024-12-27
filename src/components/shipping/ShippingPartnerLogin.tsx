import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Store, ArrowLeft } from 'lucide-react';

export default function ShippingPartnerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First sign in the user
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;
      if (!user) throw new Error('No user data returned');

      // Then check if they're a shipping partner
      const { data: partner, error: partnerError } = await supabase
        .from('shipping_partners')
        .select('id, verified')
        .eq('user_id', user.id)
        .single();

      if (partnerError) throw partnerError;
      if (!partner) {
        await supabase.auth.signOut();
        throw new Error('Account not found or not authorized as shipping partner');
      }

      if (!partner.verified) {
        await supabase.auth.signOut();
        throw new Error('Your account is pending verification. Please check back later.');
      }

      // Get authorization role
      const { data: auth } = await supabase
        .from('authorizations')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (auth?.role !== 'shipping_partner') {
        await supabase.auth.signOut();
        throw new Error('Invalid account type');
      }

      // Redirect to shipping dashboard
      navigate('/shipping/dashboard', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
        <div className="flex justify-center">
          <Store className="w-12 h-12 text-orange-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Shipping Partner Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/shipping/register" className="text-orange-600 hover:text-orange-500">
            register as a new shipping partner
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success && (
            <div className="mb-4 p-3 rounded-md bg-green-50 text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}