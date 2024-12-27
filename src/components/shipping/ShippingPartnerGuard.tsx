import React from 'react';
import { Navigate } from 'react-router-dom';
import { useShippingPartner } from '../../hooks/useShippingPartner';
import LoadingSpinner from '../LoadingSpinner';

interface ShippingPartnerGuardProps {
  children: React.ReactNode;
}

export default function ShippingPartnerGuard({ children }: ShippingPartnerGuardProps) {
  const { partner, loading } = useShippingPartner();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!partner) {
    return <Navigate to="/shipping/login" replace />;
  }

  if (!partner.verified) {
    return <Navigate to="/shipping/login" replace />;
  }

  return <>{children}</>;
}