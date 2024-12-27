-- Update phone format constraint to match the exact format
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS phone_format;

ALTER TABLE profiles
ADD CONSTRAINT phone_format
CHECK (
  phone IS NULL OR 
  phone ~ '^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$'
);

-- Add helpful comment explaining the format
COMMENT ON CONSTRAINT phone_format ON profiles IS 
  'Phone numbers must be in format (XXX)XXX-XXXX';