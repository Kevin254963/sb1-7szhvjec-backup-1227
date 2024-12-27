import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { validatePhoneFormat } from '../../utils/validation';
import { formatPhoneNumber } from '../../utils/formatters';
import type { ShippingPartnerFormData } from '../../types/shipping';
import ServiceAreasSelect from './ServiceAreasSelect';

export default function ShippingPartnerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ShippingPartnerFormData>({
    email: '',
    password: '',
    company_name: '',
    contact_name: '',
    phone: '',
    address: '',
    service_areas: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const phoneError = validatePhoneFormat(formData.phone);
    if (phoneError) {
      setError(phoneError);
      setLoading(false);
      return;
    }

    try {
      // Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('No user data returned');

      // Create shipping partner profile
      const { error: partnerError } = await supabase
        .from('shipping_partners')
        .insert([{
          user_id: authData.user.id,
          company_name: formData.company_name,
          contact_name: formData.contact_name,
          phone: formData.phone,
          address: formData.address,
          service_areas: formData.service_areas,
          verified: false
        }]);

      if (partnerError) {
        await supabase.auth.signOut();
        throw partnerError;
      }

      navigate('/shipping/login', { 
        state: { 
          message: 'Registration successful! Please wait for account verification.' 
        }
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'phone' ? formatPhoneNumber(value) : value
    }));
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
          <Truck className="w-12 h-12 text-orange-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Register as a Shipping Partner
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/shipping/login" className="text-orange-600 hover:text-orange-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                id="company_name"
                name="company_name"
                type="text"
                required
                value={formData.company_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">
                Contact Name
              </label>
              <input
                id="contact_name"
                name="contact_name"
                type="text"
                required
                value={formData.contact_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555)555-5555"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Business Address
              </label>
              <textarea
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <ServiceAreasSelect
              selectedAreas={formData.service_areas}
              onChange={(areas) => setFormData(prev => ({ ...prev, service_areas: areas }))}
            />

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
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}