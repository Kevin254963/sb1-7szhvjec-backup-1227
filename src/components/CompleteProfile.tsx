import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import ProfileForm from './ProfileForm';
import LoadingSpinner from './LoadingSpinner';

export default function CompleteProfile() {
  const { profile, loading } = useProfile();

  if (loading) {
    return <LoadingSpinner />;
  }

  // If profile is already complete, redirect to products
  if (profile?.full_name && profile?.company_name && profile?.zip_code) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12">
        <div className="max-w-md mx-auto">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
            Complete Your Profile
          </h2>
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="mb-4 text-sm text-gray-600">
              Please complete your profile information to continue.
            </div>
            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
}