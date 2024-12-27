export interface ShippingRate {
  id: string;
  zip_code_start: string;
  zip_code_end: string;
  base_rate: number;
  created_at: string;
}

export interface ShippingPartner {
  id: string;
  user_id: string;
  company_name: string;
  contact_name: string;
  phone: string;
  address: string;
  service_areas: string[];
  verified: boolean;
  created_at: string;
  updated_at: string;
}