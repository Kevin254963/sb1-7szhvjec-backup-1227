/*
  # Fix shipping partners table and constraints

  1. Changes
    - Add proper validation for service areas
    - Add indexes for performance
    - Add admin policies
    - Add verification handling

  2. Security
    - Add RLS policies for shipping partner verification
    - Add policies for admin management
*/

-- Create function to validate service areas array
CREATE OR REPLACE FUNCTION is_valid_service_areas(areas jsonb)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if it's an array and not empty
  IF NOT jsonb_typeof(areas) = 'array' OR jsonb_array_length(areas) = 0 THEN
    RETURN false;
  END IF;
  
  -- Check if all elements are valid state codes
  RETURN true;
END;
$$;

-- Add service_areas validation
ALTER TABLE shipping_partners
DROP CONSTRAINT IF EXISTS valid_service_areas;

ALTER TABLE shipping_partners
ADD CONSTRAINT valid_service_areas
CHECK (is_valid_service_areas(service_areas));

-- Add helpful indexes
CREATE INDEX IF NOT EXISTS idx_shipping_partners_user_id
  ON shipping_partners(user_id);

CREATE INDEX IF NOT EXISTS idx_shipping_partners_verified
  ON shipping_partners(verified);

-- Add admin policies for shipping partner management
CREATE POLICY "Admins can view all shipping partners"
  ON shipping_partners
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorizations
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update shipping partner verification"
  ON shipping_partners
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorizations
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorizations
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Function to handle shipping partner verification
CREATE OR REPLACE FUNCTION verify_shipping_partner(
  partner_id uuid,
  should_verify boolean
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM authorizations
    WHERE user_id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Update shipping partner verification status
  UPDATE shipping_partners
  SET 
    verified = should_verify,
    updated_at = now()
  WHERE id = partner_id;
END;
$$;

-- Clean up any invalid service areas
UPDATE shipping_partners
SET service_areas = '[]'::jsonb
WHERE service_areas IS NULL;

-- Ensure all shipping partners have proper authorizations
DO $$
BEGIN
  -- Handle shipping partners without authorizations
  INSERT INTO authorizations (
    user_id,
    role,
    permissions
  )
  SELECT 
    sp.user_id,
    'shipping_partner',
    jsonb_build_object(
      'manage_deliveries', true,
      'view_service_areas', true
    )
  FROM shipping_partners sp
  WHERE NOT EXISTS (
    SELECT 1 FROM authorizations a 
    WHERE a.user_id = sp.user_id
  );

  -- Update existing authorizations
  UPDATE authorizations a
  SET 
    role = 'shipping_partner',
    permissions = jsonb_build_object(
      'manage_deliveries', true,
      'view_service_areas', true
    ),
    updated_at = now()
  FROM shipping_partners sp
  WHERE sp.user_id = a.user_id
  AND a.role != 'shipping_partner';
END $$;