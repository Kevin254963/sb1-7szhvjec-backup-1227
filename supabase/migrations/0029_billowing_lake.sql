-- First, update the valid_role constraint to include shipping_partner
ALTER TABLE authorizations 
DROP CONSTRAINT IF EXISTS valid_role;

ALTER TABLE authorizations 
ADD CONSTRAINT valid_role 
CHECK (role IN ('admin', 'user', 'supplier', 'shipping_partner'));

-- Update the shipping partner authorization function
CREATE OR REPLACE FUNCTION handle_new_shipping_partner_authorization()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update the user's authorization to shipping_partner role
  UPDATE authorizations
  SET role = 'shipping_partner',
      permissions = jsonb_build_object(
        'manage_deliveries', true,
        'view_service_areas', true
      ),
      updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_shipping_partner_created_authorization ON shipping_partners;

CREATE TRIGGER on_shipping_partner_created_authorization
  AFTER INSERT ON shipping_partners
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_shipping_partner_authorization();