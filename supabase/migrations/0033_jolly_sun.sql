-- Add shipping_partner role to valid_role constraint
ALTER TABLE authorizations 
DROP CONSTRAINT IF EXISTS valid_role;

ALTER TABLE authorizations 
ADD CONSTRAINT valid_role 
CHECK (role IN ('admin', 'user', 'supplier', 'shipping_partner'));

-- Create function to handle shipping partner authorization
CREATE OR REPLACE FUNCTION handle_shipping_partner_auth()
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

-- Create trigger for shipping partner authorization
DROP TRIGGER IF EXISTS on_shipping_partner_created ON shipping_partners;

CREATE TRIGGER on_shipping_partner_created
  AFTER INSERT ON shipping_partners
  FOR EACH ROW
  EXECUTE FUNCTION handle_shipping_partner_auth();

-- Add policy for shipping partner verification check
CREATE POLICY "Shipping partners can view own verification status"
  ON shipping_partners
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);