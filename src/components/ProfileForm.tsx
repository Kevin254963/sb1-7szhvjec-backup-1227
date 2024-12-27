import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { formatZipCode } from '../utils/formatters';
import { validatePhoneFormat, validateZipCode } from '../utils/validation';
import PhoneInput from './forms/PhoneInput';
import LoadingSpinner from './LoadingSpinner';

interface ProfileFormProps {
  onComplete?: () => void;
}

export default function ProfileForm({ onComplete }: ProfileFormProps) {
  const navigate = useNavigate();
  const { profile, loading: profileLoading, error: profileError, updateProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    phone: '',
    zip_code: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        company_name: profile.company_name || '',
        phone: profile.phone || '',
        zip_code: profile.zip_code || ''
      });
    }
  }, [profile]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.full_name) newErrors.full_name = 'Full name is required';
    if (!formData.company_name) newErrors.company_name = 'Company name is required';
    
    const phoneError = validatePhoneFormat(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    
    const zipError = validateZipCode(formData.zip_code);
    if (zipError) newErrors.zip_code = zipError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSaving(true);
    setSuccess(false);
    setErrors({});

    const success = await updateProfile(formData);
    if (success) {
      setSuccess(true);
      if (onComplete) {
        onComplete();
      }
      navigate('/products');
    }

    setSaving(false);
  };

  if (profileLoading) {
    return <LoadingSpinner />;
  }

  if (profileError) {
    return <div className="text-red-600 p-4 rounded-md bg-red-50">{profileError}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <input
          type="text"
          id="full_name"
          required
          value={formData.full_name}
          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          className={`mt-1 block w-full rounded-md px-3 py-2 ${
            errors.full_name
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } shadow-sm focus:outline-none focus:ring-1`}
        />
        {errors.full_name && (
          <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
        )}
      </div>

      <div>
        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
          Company Name *
        </label>
        <input
          type="text"
          id="company_name"
          required
          value={formData.company_name}
          onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
          className={`mt-1 block w-full rounded-md px-3 py-2 ${
            errors.company_name
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } shadow-sm focus:outline-none focus:ring-1`}
        />
        {errors.company_name && (
          <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
        )}
      </div>

      <PhoneInput
        value={formData.phone}
        onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
        error={errors.phone}
      />

      <div>
        <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700">
          ZIP Code *
        </label>
        <input
          type="text"
          id="zip_code"
          required
          value={formData.zip_code}
          onChange={(e) => setFormData(prev => ({ ...prev, zip_code: formatZipCode(e.target.value) }))}
          placeholder="12345"
          maxLength={5}
          className={`mt-1 block w-full rounded-md px-3 py-2 ${
            errors.zip_code
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } shadow-sm focus:outline-none focus:ring-1`}
        />
        {errors.zip_code && (
          <p className="mt-1 text-sm text-red-600">{errors.zip_code}</p>
        )}
      </div>

      {success && (
        <div className="text-green-600 bg-green-50 p-3 rounded-md">
          Profile updated successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
      >
        {saving ? 'Saving...' : 'Complete Profile'}
      </button>
    </form>
  );
}