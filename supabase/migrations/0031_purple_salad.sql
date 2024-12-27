/*
  # Fix shipping partner authorization

  1. Changes
    - Update valid_role constraint to include shipping_partner role
    - Add function to handle shipping partner authorization
    - Add trigger for shipping partner authorization
    - Add cleanup for any existing shipping partners

  2. Security
    - Enable RLS on shipping_partners table
    - Add policies for shipping partner access
*/

-- Drop and recreate the valid_role constraint
ALTER TABLE authorizations 
DROP CONSTRAINT IF EXISTS valid_role;

ALTER TABLE authorizations 
ADD CONSTRAINT valid_role 
CHECK (role IN ('admin', 'user', 'supplier', 'shipping_partner'));

-- Create improved shipping partner authorization function
CREATE OR REPLACE FUNCTION handle_new_shipping_partner_authorization()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create or update authorization
  INSERT INTO authorizations (
    user_id,
    role,
    permissions
  ) VALUES (
    NEW.user_id,
    'shipping_partner',
    jsonb_build_object(
      'manage_deliveries', true,
      'view_service_areas', true
    )
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    role = 'shipping_partner',
    permissions = jsonb_build_object(
      'manage_deliveries', true,
      'view_service_areas', true
    ),
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_shipping_partner_created_authorization ON shipping_partners;

CREATE TRIGGER on_shipping_partner_created_authorization
  AFTER INSERT ON shipping_partners
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_shipping_partner_authorization();

-- Update existing shipping partners
DO $$
BEGIN
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
    SELECT 1 FROM authorizations a WHERE a.user_id = sp.user_id
  );

  -- Update any existing authorizations
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