-- Drop and recreate the valid_role constraint with shipping_partner role
ALTER TABLE authorizations 
DROP CONSTRAINT IF EXISTS valid_role;

ALTER TABLE authorizations 
ADD CONSTRAINT valid_role 
CHECK (role IN ('admin', 'user', 'supplier', 'shipping_partner'));

-- Update the shipping partner authorization function to be more robust
CREATE OR REPLACE FUNCTION handle_new_shipping_partner_authorization()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- First check if authorization exists
  IF EXISTS (
    SELECT 1 FROM authorizations WHERE user_id = NEW.user_id
  ) THEN
    -- Update existing authorization
    UPDATE authorizations
    SET role = 'shipping_partner',
        permissions = jsonb_build_object(
          'manage_deliveries', true,
          'view_service_areas', true
        ),
        updated_at = now()
    WHERE user_id = NEW.user_id;
  ELSE
    -- Create new authorization
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
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_shipping_partner_created_authorization ON shipping_partners;

CREATE TRIGGER on_shipping_partner_created_authorization
  AFTER INSERT ON shipping_partners
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_shipping_partner_authorization();

-- Update any existing shipping partners to have correct authorization
DO $$
BEGIN
  UPDATE authorizations a
  SET role = 'shipping_partner',
      permissions = jsonb_build_object(
        'manage_deliveries', true,
        'view_service_areas', true
      ),
      updated_at = now()
  FROM shipping_partners sp
  WHERE sp.user_id = a.user_id;
END $$;