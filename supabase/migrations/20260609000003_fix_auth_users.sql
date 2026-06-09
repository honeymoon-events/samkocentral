-- ============================================================
-- SamkoCentral: Fix Auth Users Seed
-- Creates demo auth users with proper identities records
-- required for email/password sign-in to work in Supabase
-- ============================================================

DO $$
DECLARE
  admin_uuid    UUID := 'a1000000-0000-0000-0000-000000000001'::UUID;
  manager1_uuid UUID := 'a1000000-0000-0000-0000-000000000002'::UUID;
  manager2_uuid UUID := 'a1000000-0000-0000-0000-000000000003'::UUID;
  manager3_uuid UUID := 'a1000000-0000-0000-0000-000000000004'::UUID;
  manager4_uuid UUID := 'a1000000-0000-0000-0000-000000000005'::UUID;
  manager5_uuid UUID := 'a1000000-0000-0000-0000-000000000006'::UUID;
  officer_uuid  UUID := 'a1000000-0000-0000-0000-000000000007'::UUID;
BEGIN

-- ─── AUTH USERS ──────────────────────────────────────────────
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
  is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
  recovery_token, recovery_sent_at, email_change_token_new, email_change,
  email_change_sent_at, email_change_token_current, email_change_confirm_status,
  reauthentication_token, reauthentication_sent_at, phone, phone_change,
  phone_change_token, phone_change_sent_at
) VALUES
  (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'g.admin@samkocentral.co.uk', crypt('SamkoCentral2026!', gen_salt('bf', 10)), now(), now(), now(),
   jsonb_build_object('full_name', 'George Ashworth', 'role', 'group_admin'),
   jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
   false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),

  (manager1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   's.chen@samkocentral.co.uk', crypt('SiteManager2026!', gen_salt('bf', 10)), now(), now(), now(),
   jsonb_build_object('full_name', 'Sarah Chen', 'role', 'site_manager'),
   jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
   false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),

  (manager2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'j.okafor@samkocentral.co.uk', crypt('SiteManager2026!', gen_salt('bf', 10)), now(), now(), now(),
   jsonb_build_object('full_name', 'James Okafor', 'role', 'site_manager'),
   jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
   false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),

  (manager3_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'i.martin@samkocentral.co.uk', crypt('SiteManager2026!', gen_salt('bf', 10)), now(), now(), now(),
   jsonb_build_object('full_name', 'Isabelle Martin', 'role', 'site_manager'),
   jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
   false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),

  (manager4_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   't.bradley@samkocentral.co.uk', crypt('SiteManager2026!', gen_salt('bf', 10)), now(), now(), now(),
   jsonb_build_object('full_name', 'Tom Bradley', 'role', 'site_manager'),
   jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
   false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),

  (manager5_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'p.sharma@samkocentral.co.uk', crypt('SiteManager2026!', gen_salt('bf', 10)), now(), now(), now(),
   jsonb_build_object('full_name', 'Priya Sharma', 'role', 'site_manager'),
   jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
   false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),

  (officer_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'c.officer@samkocentral.co.uk', crypt('Compliance2026!', gen_salt('bf', 10)), now(), now(), now(),
   jsonb_build_object('full_name', 'Claire Oduya', 'role', 'compliance_officer'),
   jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
   false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null)
ON CONFLICT (id) DO NOTHING;

-- ─── AUTH IDENTITIES (required for email/password sign-in) ───
-- Each auth user needs a corresponding identity record in auth.identities
-- Without this, signInWithPassword returns "Invalid login credentials"
INSERT INTO auth.identities (
  id, user_id, provider_id, provider, identity_data,
  last_sign_in_at, created_at, updated_at
) VALUES
  (gen_random_uuid(), admin_uuid,    'g.admin@samkocentral.co.uk',    'email',
   jsonb_build_object('sub', admin_uuid::TEXT,    'email', 'g.admin@samkocentral.co.uk',    'email_verified', true, 'provider', 'email'),
   now(), now(), now()),

  (gen_random_uuid(), manager1_uuid, 's.chen@samkocentral.co.uk',     'email',
   jsonb_build_object('sub', manager1_uuid::TEXT, 'email', 's.chen@samkocentral.co.uk',     'email_verified', true, 'provider', 'email'),
   now(), now(), now()),

  (gen_random_uuid(), manager2_uuid, 'j.okafor@samkocentral.co.uk',   'email',
   jsonb_build_object('sub', manager2_uuid::TEXT, 'email', 'j.okafor@samkocentral.co.uk',   'email_verified', true, 'provider', 'email'),
   now(), now(), now()),

  (gen_random_uuid(), manager3_uuid, 'i.martin@samkocentral.co.uk',   'email',
   jsonb_build_object('sub', manager3_uuid::TEXT, 'email', 'i.martin@samkocentral.co.uk',   'email_verified', true, 'provider', 'email'),
   now(), now(), now()),

  (gen_random_uuid(), manager4_uuid, 't.bradley@samkocentral.co.uk',  'email',
   jsonb_build_object('sub', manager4_uuid::TEXT, 'email', 't.bradley@samkocentral.co.uk',  'email_verified', true, 'provider', 'email'),
   now(), now(), now()),

  (gen_random_uuid(), manager5_uuid, 'p.sharma@samkocentral.co.uk',   'email',
   jsonb_build_object('sub', manager5_uuid::TEXT, 'email', 'p.sharma@samkocentral.co.uk',   'email_verified', true, 'provider', 'email'),
   now(), now(), now()),

  (gen_random_uuid(), officer_uuid,  'c.officer@samkocentral.co.uk',  'email',
   jsonb_build_object('sub', officer_uuid::TEXT,  'email', 'c.officer@samkocentral.co.uk',  'email_verified', true, 'provider', 'email'),
   now(), now(), now())
ON CONFLICT (provider, provider_id) DO NOTHING;

-- ─── USER PROFILES ────────────────────────────────────────────
-- Insert profiles directly in case the trigger did not fire
-- (trigger may not fire for direct auth.users inserts in some Supabase versions)
INSERT INTO public.user_profiles (id, email, full_name, role, is_active)
VALUES
  (admin_uuid,    'g.admin@samkocentral.co.uk',   'George Ashworth', 'group_admin',        true),
  (manager1_uuid, 's.chen@samkocentral.co.uk',    'Sarah Chen',      'site_manager',       true),
  (manager2_uuid, 'j.okafor@samkocentral.co.uk',  'James Okafor',    'site_manager',       true),
  (manager3_uuid, 'i.martin@samkocentral.co.uk',  'Isabelle Martin', 'site_manager',       true),
  (manager4_uuid, 't.bradley@samkocentral.co.uk', 'Tom Bradley',     'site_manager',       true),
  (manager5_uuid, 'p.sharma@samkocentral.co.uk',  'Priya Sharma',    'site_manager',       true),
  (officer_uuid,  'c.officer@samkocentral.co.uk', 'Claire Oduya',    'compliance_officer', true)
ON CONFLICT (id) DO UPDATE SET
  email      = EXCLUDED.email,
  full_name  = EXCLUDED.full_name,
  role       = EXCLUDED.role,
  is_active  = EXCLUDED.is_active;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Auth seed error: % - %', SQLSTATE, SQLERRM;
END $$;
