/*
  # Add new admin account

  1. Creates a new admin user with specified credentials
  2. Sets up proper authorization with admin role and permissions
*/

DO $$ 
DECLARE
  admin_id uuid;
BEGIN
  -- First check if admin user exists
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'admin@gmail.com';

  -- If admin doesn't exist, create them
  IF admin_id IS NULL THEN
    -- Create admin user
    INSERT INTO auth.users (
      id,
      email,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      instance_id,
      aud,
      confirmation_token
    ) VALUES (
      gen_random_uuid(),
      'admin@gmail.com',
      '{"provider":"email","providers":["email"]}',
      '{}',
      false,
      'authenticated',
      crypt('00000000', gen_salt('bf')),
      now(),
      now(),
      now(),
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      encode(gen_random_bytes(32), 'hex')
    )
    RETURNING id INTO admin_id;

    -- Create profile
    INSERT INTO profiles (
      id,
      email,
      full_name,
      created_at,
      updated_at
    ) VALUES (
      admin_id,
      'admin@gmail.com',
      'System Administrator',
      now(),
      now()
    );

    -- Create admin authorization
    INSERT INTO authorizations (
      user_id,
      role,
      permissions
    ) VALUES (
      admin_id,
      'admin',
      jsonb_build_object(
        'manage_verifications', true,
        'manage_users', true,
        'manage_suppliers', true
      )
    );

    RAISE NOTICE 'Admin account created successfully';
  ELSE
    -- Update existing admin's password and ensure authorization exists
    UPDATE auth.users
    SET encrypted_password = crypt('00000000', gen_salt('bf'))
    WHERE id = admin_id;

    -- Ensure admin authorization exists with correct permissions
    INSERT INTO authorizations (
      user_id,
      role,
      permissions
    ) VALUES (
      admin_id,
      'admin',
      jsonb_build_object(
        'manage_verifications', true,
        'manage_users', true,
        'manage_suppliers', true
      )
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      role = 'admin',
      permissions = jsonb_build_object(
        'manage_verifications', true,
        'manage_users', true,
        'manage_suppliers', true
      ),
      updated_at = now();

    RAISE NOTICE 'Admin account updated successfully';
  END IF;
END $$;