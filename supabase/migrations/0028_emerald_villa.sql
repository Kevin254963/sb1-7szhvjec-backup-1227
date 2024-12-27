/*
  # Add Shipping Partner Support

  1. New Tables
    - `shipping_partners`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `company_name` (text)
      - `contact_name` (text)
      - `phone` (text)
      - `address` (text)
      - `service_areas` (jsonb)
      - `verified` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for shipping partners
*/

CREATE TABLE shipping_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  company_name text NOT NULL,
  contact_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  service_areas jsonb NOT NULL DEFAULT '[]',
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_shipping_partner_user UNIQUE (user_id),
  CONSTRAINT phone_format CHECK (phone ~ '^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$')
);

-- Enable RLS
ALTER TABLE shipping_partners ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Shipping partners can view own profile"
  ON shipping_partners
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Shipping partners can update own profile"
  ON shipping_partners
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can register as shipping partner"
  ON shipping_partners
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to handle shipping partner role assignment
CREATE OR REPLACE FUNCTION handle_new_shipping_partner_authorization()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE authorizations
  SET role = 'shipping_partner',
      permissions = jsonb_build_object(
        'manage_deliveries', true,
        'view_service_areas', true
      )
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for shipping partner role assignment
CREATE TRIGGER on_shipping_partner_created_authorization
  AFTER INSERT ON shipping_partners
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_shipping_partner_authorization();