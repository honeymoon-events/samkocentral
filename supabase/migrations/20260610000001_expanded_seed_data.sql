-- ============================================================
-- SamkoCentral: Expanded Seed Data
-- 10 Users, 15 Sites, 50 Documents, 50 Compliance Items,
-- 50 Tasks, 20 Vendors, 50 Alerts, 50 Notifications
-- ============================================================

DO $$
DECLARE
  -- Existing users from migration 003 (fixed UUIDs)
  admin_uuid    UUID := 'a1000000-0000-0000-0000-000000000001'::UUID;
  manager1_uuid UUID := 'a1000000-0000-0000-0000-000000000002'::UUID;
  manager2_uuid UUID := 'a1000000-0000-0000-0000-000000000003'::UUID;
  manager3_uuid UUID := 'a1000000-0000-0000-0000-000000000004'::UUID;
  manager4_uuid UUID := 'a1000000-0000-0000-0000-000000000005'::UUID;
  manager5_uuid UUID := 'a1000000-0000-0000-0000-000000000006'::UUID;
  officer_uuid  UUID := 'a1000000-0000-0000-0000-000000000007'::UUID;

  -- 3 new users
  manager6_uuid UUID := 'a1000000-0000-0000-0000-000000000008'::UUID;
  manager7_uuid UUID := 'a1000000-0000-0000-0000-000000000009'::UUID;
  readonly_uuid UUID := 'a1000000-0000-0000-0000-000000000010'::UUID;

  -- Sites (existing 6 + 9 new = 15)
  site1_uuid  UUID := 'b1000000-0000-0000-0000-000000000001'::UUID;
  site2_uuid  UUID := 'b1000000-0000-0000-0000-000000000002'::UUID;
  site3_uuid  UUID := 'b1000000-0000-0000-0000-000000000003'::UUID;
  site4_uuid  UUID := 'b1000000-0000-0000-0000-000000000004'::UUID;
  site5_uuid  UUID := 'b1000000-0000-0000-0000-000000000005'::UUID;
  site6_uuid  UUID := 'b1000000-0000-0000-0000-000000000006'::UUID;
  site7_uuid  UUID := 'b1000000-0000-0000-0000-000000000007'::UUID;
  site8_uuid  UUID := 'b1000000-0000-0000-0000-000000000008'::UUID;
  site9_uuid  UUID := 'b1000000-0000-0000-0000-000000000009'::UUID;
  site10_uuid UUID := 'b1000000-0000-0000-0000-000000000010'::UUID;
  site11_uuid UUID := 'b1000000-0000-0000-0000-000000000011'::UUID;
  site12_uuid UUID := 'b1000000-0000-0000-0000-000000000012'::UUID;
  site13_uuid UUID := 'b1000000-0000-0000-0000-000000000013'::UUID;
  site14_uuid UUID := 'b1000000-0000-0000-0000-000000000014'::UUID;
  site15_uuid UUID := 'b1000000-0000-0000-0000-000000000015'::UUID;

  -- Document categories (reuse existing by name, declare UUIDs for reference)
  cat_insurance_uuid   UUID := 'c1000000-0000-0000-0000-000000000001'::UUID;
  cat_fire_uuid        UUID := 'c1000000-0000-0000-0000-000000000002'::UUID;
  cat_gas_uuid         UUID := 'c1000000-0000-0000-0000-000000000003'::UUID;
  cat_electrical_uuid  UUID := 'c1000000-0000-0000-0000-000000000004'::UUID;
  cat_food_uuid        UUID := 'c1000000-0000-0000-0000-000000000005'::UUID;
  cat_licenses_uuid    UUID := 'c1000000-0000-0000-0000-000000000006'::UUID;
  cat_hs_uuid          UUID := 'c1000000-0000-0000-0000-000000000007'::UUID;
  cat_hr_uuid          UUID := 'c1000000-0000-0000-0000-000000000008'::UUID;
  cat_vehicle_uuid     UUID := 'c1000000-0000-0000-0000-000000000009'::UUID;
  cat_lease_uuid       UUID := 'c1000000-0000-0000-0000-000000000010'::UUID;

  -- Vendors (20 total)
  vendor1_uuid  UUID := 'd1000000-0000-0000-0000-000000000001'::UUID;
  vendor2_uuid  UUID := 'd1000000-0000-0000-0000-000000000002'::UUID;
  vendor3_uuid  UUID := 'd1000000-0000-0000-0000-000000000003'::UUID;
  vendor4_uuid  UUID := 'd1000000-0000-0000-0000-000000000004'::UUID;
  vendor5_uuid  UUID := 'd1000000-0000-0000-0000-000000000005'::UUID;
  vendor6_uuid  UUID := 'd1000000-0000-0000-0000-000000000006'::UUID;
  vendor7_uuid  UUID := 'd1000000-0000-0000-0000-000000000007'::UUID;
  vendor8_uuid  UUID := 'd1000000-0000-0000-0000-000000000008'::UUID;
  vendor9_uuid  UUID := 'd1000000-0000-0000-0000-000000000009'::UUID;
  vendor10_uuid UUID := 'd1000000-0000-0000-0000-000000000010'::UUID;
  vendor11_uuid UUID := 'd1000000-0000-0000-0000-000000000011'::UUID;
  vendor12_uuid UUID := 'd1000000-0000-0000-0000-000000000012'::UUID;
  vendor13_uuid UUID := 'd1000000-0000-0000-0000-000000000013'::UUID;
  vendor14_uuid UUID := 'd1000000-0000-0000-0000-000000000014'::UUID;
  vendor15_uuid UUID := 'd1000000-0000-0000-0000-000000000015'::UUID;
  vendor16_uuid UUID := 'd1000000-0000-0000-0000-000000000016'::UUID;
  vendor17_uuid UUID := 'd1000000-0000-0000-0000-000000000017'::UUID;
  vendor18_uuid UUID := 'd1000000-0000-0000-0000-000000000018'::UUID;
  vendor19_uuid UUID := 'd1000000-0000-0000-0000-000000000019'::UUID;
  vendor20_uuid UUID := 'd1000000-0000-0000-0000-000000000020'::UUID;

BEGIN

-- ─── 3 NEW AUTH USERS ────────────────────────────────────────
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
  is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
  recovery_token, recovery_sent_at, email_change_token_new, email_change,
  email_change_sent_at, email_change_token_current, email_change_confirm_status,
  reauthentication_token, reauthentication_sent_at, phone, phone_change,
  phone_change_token, phone_change_sent_at
) VALUES
  (manager6_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'r.nguyen@samkocentral.co.uk', crypt('SiteManager2026!', gen_salt('bf', 10)), now(), now(), now(),
   jsonb_build_object('full_name', 'Rachel Nguyen', 'role', 'site_manager'),
   jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
   false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),

  (manager7_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'd.walsh@samkocentral.co.uk', crypt('SiteManager2026!', gen_salt('bf', 10)), now(), now(), now(),
   jsonb_build_object('full_name', 'David Walsh', 'role', 'site_manager'),
   jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
   false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),

  (readonly_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'viewer@samkocentral.co.uk', crypt('ReadOnly2026!', gen_salt('bf', 10)), now(), now(), now(),
   jsonb_build_object('full_name', 'Alex Turner', 'role', 'read_only'),
   jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
   false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null)
ON CONFLICT (id) DO NOTHING;

-- Auth identities for new users
INSERT INTO auth.identities (
  id, user_id, provider_id, provider, identity_data,
  last_sign_in_at, created_at, updated_at
) VALUES
  (gen_random_uuid(), manager6_uuid, 'r.nguyen@samkocentral.co.uk', 'email',
   jsonb_build_object('sub', manager6_uuid::TEXT, 'email', 'r.nguyen@samkocentral.co.uk', 'email_verified', true, 'provider', 'email'),
   now(), now(), now()),
  (gen_random_uuid(), manager7_uuid, 'd.walsh@samkocentral.co.uk', 'email',
   jsonb_build_object('sub', manager7_uuid::TEXT, 'email', 'd.walsh@samkocentral.co.uk', 'email_verified', true, 'provider', 'email'),
   now(), now(), now()),
  (gen_random_uuid(), readonly_uuid, 'viewer@samkocentral.co.uk', 'email',
   jsonb_build_object('sub', readonly_uuid::TEXT, 'email', 'viewer@samkocentral.co.uk', 'email_verified', true, 'provider', 'email'),
   now(), now(), now())
ON CONFLICT (provider, provider_id) DO NOTHING;

-- User profiles for new users
INSERT INTO public.user_profiles (id, email, full_name, role, is_active)
VALUES
  (manager6_uuid, 'r.nguyen@samkocentral.co.uk',  'Rachel Nguyen', 'site_manager', true),
  (manager7_uuid, 'd.walsh@samkocentral.co.uk',    'David Walsh',   'site_manager', true),
  (readonly_uuid, 'viewer@samkocentral.co.uk',     'Alex Turner',   'read_only',    true)
ON CONFLICT (id) DO UPDATE SET
  email     = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role      = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- ─── 15 SITES ────────────────────────────────────────────────
-- Delete existing sites seeded by earlier migrations to avoid duplicates,
-- then re-insert all 15 with fixed UUIDs for FK references.
DELETE FROM public.sites WHERE id IN (
  site1_uuid, site2_uuid, site3_uuid, site4_uuid, site5_uuid, site6_uuid
);

INSERT INTO public.sites (id, name, site_type, city, address, manager_name, phone, status, risk, open_issues, compliance_score) VALUES
  (site1_uuid,  'The Grand Meridian',        'Hotel',      'London',     '14 Belgrave Square, London SW1X 8PS',          'Sarah Chen',      '+44 20 7946 0300', 'operational', 'low',    2,  94),
  (site2_uuid,  'Harbour View Hotel',        'Hotel',      'Bristol',    '2 Harbourside Walk, Bristol BS1 4RB',           'James Okafor',    '+44 117 946 0221', 'operational', 'medium', 5,  78),
  (site3_uuid,  'Brasserie Lumiere',         'Restaurant', 'London',     '88 King Street, London WC2E 8JS',               'Isabelle Martin', '+44 20 7946 0445', 'operational', 'low',    1,  97),
  (site4_uuid,  'The Copper Kettle',         'Restaurant', 'Bath',       '7 Milsom Street, Bath BA1 1BZ',                 'Tom Bradley',     '+44 1225 946 012', 'maintenance', 'high',   9,  61),
  (site5_uuid,  'Skyline Suites',            'Hotel',      'Manchester', '200 Deansgate, Manchester M3 4LQ',              'Priya Sharma',    '+44 161 946 0110', 'operational', 'medium', 3,  85),
  (site6_uuid,  'Vault 42 Bar Kitchen',      'Restaurant', 'Edinburgh',  '42 Victoria Street, Edinburgh EH1 2JW',        'Ewan McAllister', '+44 131 946 0887', 'operational', 'low',    0,  99),
  (site7_uuid,  'The Riverside Inn',         'Hotel',      'Oxford',     '1 Folly Bridge, Oxford OX1 4LB',                'Rachel Nguyen',   '+44 1865 946 100', 'operational', 'low',    1,  92),
  (site8_uuid,  'Northgate Brasserie',       'Restaurant', 'Chester',    '22 Northgate Street, Chester CH1 2HQ',          'David Walsh',     '+44 1244 946 200', 'operational', 'medium', 4,  80),
  (site9_uuid,  'The Loch House Hotel',      'Hotel',      'Glasgow',    '88 Buchanan Street, Glasgow G1 3HA',            'Rachel Nguyen',   '+44 141 946 0300', 'operational', 'low',    2,  91),
  (site10_uuid, 'Clifton Grand Hotel',       'Hotel',      'Bristol',    '10 Clifton Down Road, Bristol BS8 4AA',         'James Okafor',    '+44 117 946 0400', 'operational', 'medium', 3,  83),
  (site11_uuid, 'The Spice Garden',          'Restaurant', 'Birmingham', '55 Broad Street, Birmingham B1 2HJ',            'David Walsh',     '+44 121 946 0500', 'at_risk',     'high',   7,  65),
  (site12_uuid, 'Lakeside Conference Centre','Hotel',      'Windermere', '3 Lake Road, Windermere LA23 2JF',              'Priya Sharma',    '+44 1539 946 600', 'operational', 'low',    0, 100),
  (site13_uuid, 'The Old Forge Pub',         'Restaurant', 'York',       '14 Stonegate, York YO1 8AS',                    'Tom Bradley',     '+44 1904 946 700', 'operational', 'medium', 2,  88),
  (site14_uuid, 'Meridian Business Hotel',   'Hotel',      'Leeds',      '100 Wellington Street, Leeds LS1 4LT',          'Sarah Chen',      '+44 113 946 0800', 'operational', 'low',    1,  95),
  (site15_uuid, 'The Coastal Kitchen',       'Restaurant', 'Brighton',   '7 Kings Road Arches, Brighton BN1 1NB',         'Isabelle Martin', '+44 1273 946 900', 'maintenance', 'high',   8,  67)
ON CONFLICT (id) DO NOTHING;

-- ─── DOCUMENT CATEGORIES (ensure fixed UUIDs exist) ──────────
INSERT INTO public.document_categories (id, name, description) VALUES
  (cat_insurance_uuid,  'Insurance',    'Public liability, employer liability, fleet insurance'),
  (cat_fire_uuid,       'Fire Safety',  'Fire risk assessments, certificates, evacuation plans'),
  (cat_gas_uuid,        'Gas Safety',   'Gas safety records, boiler certificates'),
  (cat_electrical_uuid, 'Electrical',   'EICR, PAT testing records'),
  (cat_food_uuid,       'Food Hygiene', 'Food hygiene certificates, HACCP plans'),
  (cat_licenses_uuid,   'Licenses',     'Alcohol licences, premises licences'),
  (cat_hs_uuid,         'H&S',          'Health and safety policies, risk assessments'),
  (cat_hr_uuid,         'HR',           'DBS checks, employment contracts'),
  (cat_vehicle_uuid,    'Vehicle',      'MOT certificates, vehicle insurance'),
  (cat_lease_uuid,      'Lease',        'Lease agreements, property documents')
ON CONFLICT (name) DO UPDATE SET id = EXCLUDED.id;

-- ─── 50 DOCUMENTS ────────────────────────────────────────────
INSERT INTO public.documents (id, name, site_id, category_id, expiry_date, status, file_size, uploaded_at, uploaded_by, version, notes) VALUES
  -- Site 1 - The Grand Meridian
  (gen_random_uuid(), 'Public Liability Insurance 2026',         site1_uuid,  cat_insurance_uuid,  '2026-08-15', 'ok',       '2.4 MB', now() - interval '300 days', manager1_uuid, 'v3.1', 'Renewed with Aviva Commercial'),
  (gen_random_uuid(), 'Employer Liability Insurance',            site1_uuid,  cat_insurance_uuid,  '2026-08-15', 'ok',       '1.9 MB', now() - interval '300 days', manager1_uuid, 'v4.0', 'Group policy covers all staff'),
  (gen_random_uuid(), 'Fire Risk Assessment 2025',               site1_uuid,  cat_fire_uuid,        '2026-11-10', 'ok',       '3.1 MB', now() - interval '200 days', manager1_uuid, 'v2.1', 'Passed with no major findings'),
  (gen_random_uuid(), 'DBS Check Register Front of House',       site1_uuid,  cat_hr_uuid,          '2026-10-01', 'ok',       '0.9 MB', now() - interval '250 days', manager1_uuid, 'v2.1', '12 staff checked - all clear'),
  -- Site 2 - Harbour View Hotel
  (gen_random_uuid(), 'Fire Safety Certificate',                 site2_uuid,  cat_fire_uuid,        '2026-06-20', 'warning',  '1.1 MB', now() - interval '400 days', manager2_uuid, 'v2.0', 'Renewal due - FireGuard booked'),
  (gen_random_uuid(), 'Vehicle MOT Certificate Van XR22',        site2_uuid,  cat_vehicle_uuid,     '2026-07-04', 'warning',  '0.4 MB', now() - interval '365 days', manager2_uuid, 'v1.0', 'MOT due July 2026'),
  (gen_random_uuid(), 'Health and Safety Policy',                site2_uuid,  cat_hs_uuid,          '2026-08-01', 'ok',       '1.4 MB', now() - interval '180 days', manager2_uuid, 'v2.0', 'Annual review completed'),
  -- Site 3 - Brasserie Lumiere
  (gen_random_uuid(), 'Food Hygiene Certificate Level 5',        site3_uuid,  cat_food_uuid,        '2028-03-22', 'ok',       '0.6 MB', now() - interval '100 days', manager3_uuid, 'v2.2', '5-star rating achieved'),
  (gen_random_uuid(), 'Waste Carrier Licence',                   site3_uuid,  cat_licenses_uuid,    '2026-09-14', 'ok',       '0.5 MB', now() - interval '500 days', manager3_uuid, 'v2.0', 'Environment Agency licence'),
  (gen_random_uuid(), 'Alcohol Premises Licence',                site3_uuid,  cat_licenses_uuid,    '2027-06-30', 'ok',       '2.8 MB', now() - interval '600 days', admin_uuid,    'v1.0', 'Westminster Council licence'),
  -- Site 4 - The Copper Kettle
  (gen_random_uuid(), 'Gas Safety Record',                       site4_uuid,  cat_gas_uuid,         '2026-06-02', 'critical', '0.8 MB', now() - interval '370 days', manager4_uuid, 'v1.4', 'EXPIRED - City Gas Engineers booked'),
  (gen_random_uuid(), 'PAT Testing Record Kitchen',              site4_uuid,  cat_electrical_uuid,  '2026-05-30', 'critical', '1.2 MB', now() - interval '380 days', manager4_uuid, 'v1.1', 'OVERDUE - Apex Electrical to attend'),
  (gen_random_uuid(), 'Legionella Risk Assessment',              site4_uuid,  cat_hs_uuid,          '2026-06-15', 'critical', '2.1 MB', now() - interval '380 days', manager4_uuid, 'v1.0', 'OVERDUE - HSE requirement'),
  (gen_random_uuid(), 'Food Hygiene Inspection Report',          site4_uuid,  cat_food_uuid,        '2026-12-01', 'ok',       '1.5 MB', now() - interval '200 days', manager4_uuid, 'v1.0', '4-star rating - improvement plan in place'),
  -- Site 5 - Skyline Suites
  (gen_random_uuid(), 'EICR Electrical Installation Report',     site5_uuid,  cat_electrical_uuid,  '2026-07-10', 'warning',  '5.7 MB', now() - interval '1800 days',manager5_uuid, 'v1.0', '5-yearly inspection due - Apex booked'),
  (gen_random_uuid(), 'Health and Safety Policy',                site5_uuid,  cat_hs_uuid,          '2026-11-01', 'ok',       '1.4 MB', now() - interval '220 days', manager5_uuid, 'v3.0', 'Updated post-audit'),
  (gen_random_uuid(), 'Public Liability Insurance',              site5_uuid,  cat_insurance_uuid,   '2026-09-30', 'ok',       '2.1 MB', now() - interval '280 days', manager5_uuid, 'v2.0', 'Aviva group policy'),
  -- Site 6 - Vault 42
  (gen_random_uuid(), 'Premises Alcohol Licence',                site6_uuid,  cat_licenses_uuid,    '2027-01-31', 'ok',       '3.2 MB', now() - interval '500 days', admin_uuid,    'v5.0', 'Edinburgh Council ref ECC/2025/0042'),
  (gen_random_uuid(), 'Lease Agreement Main Premises',           site6_uuid,  cat_lease_uuid,       '2031-12-31', 'ok',       '8.1 MB', now() - interval '900 days', admin_uuid,    'v1.0', '10-year lease signed 2022'),
  (gen_random_uuid(), 'Fire Risk Assessment',                    site6_uuid,  cat_fire_uuid,        '2027-02-28', 'ok',       '2.3 MB', now() - interval '150 days', admin_uuid,    'v1.0', 'No issues found'),
  -- Site 7 - The Riverside Inn
  (gen_random_uuid(), 'Public Liability Insurance',              site7_uuid,  cat_insurance_uuid,   '2026-10-15', 'ok',       '2.2 MB', now() - interval '260 days', manager6_uuid, 'v1.0', 'Aviva group policy'),
  (gen_random_uuid(), 'Gas Safety Certificate',                  site7_uuid,  cat_gas_uuid,         '2026-12-01', 'ok',       '0.7 MB', now() - interval '180 days', manager6_uuid, 'v2.0', 'Annual inspection passed'),
  (gen_random_uuid(), 'Food Hygiene Certificate',                site7_uuid,  cat_food_uuid,        '2027-05-10', 'ok',       '0.6 MB', now() - interval '120 days', manager6_uuid, 'v1.0', '5-star rating'),
  -- Site 8 - Northgate Brasserie
  (gen_random_uuid(), 'Fire Risk Assessment',                    site8_uuid,  cat_fire_uuid,        '2026-08-20', 'warning',  '2.0 MB', now() - interval '350 days', manager7_uuid, 'v1.0', 'Minor remediation works required'),
  (gen_random_uuid(), 'Alcohol Licence',                         site8_uuid,  cat_licenses_uuid,    '2027-03-31', 'ok',       '2.5 MB', now() - interval '400 days', admin_uuid,    'v2.0', 'Chester Council licence'),
  -- Site 9 - The Loch House Hotel
  (gen_random_uuid(), 'Public Liability Insurance',              site9_uuid,  cat_insurance_uuid,   '2026-11-30', 'ok',       '2.3 MB', now() - interval '240 days', manager6_uuid, 'v1.0', 'Aviva group policy'),
  (gen_random_uuid(), 'EICR Certificate',                        site9_uuid,  cat_electrical_uuid,  '2027-04-15', 'ok',       '4.2 MB', now() - interval '300 days', manager6_uuid, 'v1.0', 'Full inspection passed'),
  (gen_random_uuid(), 'Gas Safety Record',                       site9_uuid,  cat_gas_uuid,         '2026-10-20', 'ok',       '0.8 MB', now() - interval '200 days', manager6_uuid, 'v1.0', 'Annual inspection passed'),
  -- Site 10 - Clifton Grand Hotel
  (gen_random_uuid(), 'Health and Safety Policy',                site10_uuid, cat_hs_uuid,          '2026-12-31', 'ok',       '1.6 MB', now() - interval '190 days', manager2_uuid, 'v2.0', 'Annual review completed'),
  (gen_random_uuid(), 'Fire Safety Certificate',                 site10_uuid, cat_fire_uuid,        '2026-09-15', 'ok',       '1.8 MB', now() - interval '280 days', manager2_uuid, 'v1.0', 'Passed with minor recommendations'),
  -- Site 11 - The Spice Garden
  (gen_random_uuid(), 'Gas Safety Record',                       site11_uuid, cat_gas_uuid,         '2026-06-10', 'critical', '0.9 MB', now() - interval '375 days', manager7_uuid, 'v1.0', 'EXPIRED - urgent renewal required'),
  (gen_random_uuid(), 'Food Hygiene Certificate',                site11_uuid, cat_food_uuid,        '2026-07-01', 'warning',  '0.7 MB', now() - interval '350 days', manager7_uuid, 'v1.0', 'Improvement notice received'),
  (gen_random_uuid(), 'Fire Risk Assessment',                    site11_uuid, cat_fire_uuid,        '2026-06-30', 'warning',  '2.2 MB', now() - interval '360 days', manager7_uuid, 'v1.0', 'Remediation works in progress'),
  -- Site 12 - Lakeside Conference Centre
  (gen_random_uuid(), 'Public Liability Insurance',              site12_uuid, cat_insurance_uuid,   '2027-01-15', 'ok',       '2.6 MB', now() - interval '200 days', manager5_uuid, 'v1.0', 'Aviva group policy'),
  (gen_random_uuid(), 'Premises Licence',                        site12_uuid, cat_licenses_uuid,    '2028-06-30', 'ok',       '3.0 MB', now() - interval '500 days', admin_uuid,    'v1.0', 'Cumbria Council licence'),
  -- Site 13 - The Old Forge Pub
  (gen_random_uuid(), 'Alcohol Licence',                         site13_uuid, cat_licenses_uuid,    '2027-08-31', 'ok',       '2.4 MB', now() - interval '450 days', admin_uuid,    'v3.0', 'York Council licence'),
  (gen_random_uuid(), 'Gas Safety Record',                       site13_uuid, cat_gas_uuid,         '2026-11-15', 'ok',       '0.8 MB', now() - interval '160 days', manager4_uuid, 'v1.0', 'Annual inspection passed'),
  -- Site 14 - Meridian Business Hotel
  (gen_random_uuid(), 'Public Liability Insurance',              site14_uuid, cat_insurance_uuid,   '2026-12-01', 'ok',       '2.1 MB', now() - interval '220 days', manager1_uuid, 'v2.0', 'Aviva group policy'),
  (gen_random_uuid(), 'EICR Certificate',                        site14_uuid, cat_electrical_uuid,  '2027-06-30', 'ok',       '4.8 MB', now() - interval '310 days', manager1_uuid, 'v1.0', 'Full 5-year inspection passed'),
  (gen_random_uuid(), 'Fire Risk Assessment',                    site14_uuid, cat_fire_uuid,        '2027-01-20', 'ok',       '2.7 MB', now() - interval '170 days', manager1_uuid, 'v1.0', 'No issues found'),
  -- Site 15 - The Coastal Kitchen
  (gen_random_uuid(), 'Gas Safety Record',                       site15_uuid, cat_gas_uuid,         '2026-06-05', 'critical', '0.9 MB', now() - interval '372 days', manager3_uuid, 'v1.0', 'EXPIRED - renewal overdue'),
  (gen_random_uuid(), 'Food Hygiene Certificate',                site15_uuid, cat_food_uuid,        '2026-07-15', 'warning',  '0.7 MB', now() - interval '340 days', manager3_uuid, 'v1.0', 'Re-inspection scheduled'),
  (gen_random_uuid(), 'Fire Risk Assessment',                    site15_uuid, cat_fire_uuid,        '2026-08-01', 'warning',  '2.1 MB', now() - interval '330 days', manager3_uuid, 'v1.0', 'Action plan submitted'),
  (gen_random_uuid(), 'Lease Agreement',                         site15_uuid, cat_lease_uuid,       '2030-06-30', 'ok',       '6.5 MB', now() - interval '800 days', admin_uuid,    'v1.0', '7-year lease signed 2023')
ON CONFLICT (id) DO NOTHING;

-- ─── 50 COMPLIANCE ITEMS ─────────────────────────────────────
INSERT INTO public.compliance_items (id, item, site_id, category, due_date, status, assignee_id, last_reviewed, notes) VALUES
  -- Site 1
  (gen_random_uuid(), 'Public Liability Insurance',          site1_uuid,  'Insurance',    '2026-08-15', 'ok',       manager1_uuid, now()::DATE - 65,  'Renewed with Aviva Commercial'),
  (gen_random_uuid(), 'Employer Liability Insurance',        site1_uuid,  'Insurance',    '2026-08-15', 'ok',       manager1_uuid, now()::DATE - 65,  'Group policy covers all staff'),
  (gen_random_uuid(), 'Fire Risk Assessment',                site1_uuid,  'Fire Safety',  '2026-11-10', 'ok',       manager1_uuid, now()::DATE - 35,  'Passed - no major findings'),
  (gen_random_uuid(), 'DBS Checks All Staff',                site1_uuid,  'HR',           '2026-10-01', 'ok',       manager1_uuid, now()::DATE - 50,  '12 staff checked - all clear'),
  -- Site 2
  (gen_random_uuid(), 'Fire Safety Certificate',             site2_uuid,  'Fire Safety',  '2026-06-20', 'warning',  manager2_uuid, now()::DATE - 400, 'Renewal due - FireGuard booked'),
  (gen_random_uuid(), 'Vehicle Insurance Van XR22',          site2_uuid,  'Vehicle',      '2026-07-04', 'warning',  manager2_uuid, now()::DATE - 365, 'Admiral Business fleet policy'),
  (gen_random_uuid(), 'Health and Safety Policy Review',     site2_uuid,  'H&S',          '2026-08-01', 'ok',       manager2_uuid, now()::DATE - 45,  'Annual review completed'),
  -- Site 3
  (gen_random_uuid(), 'Food Hygiene Inspection',             site3_uuid,  'Food Hygiene', '2028-03-22', 'ok',       manager3_uuid, now()::DATE - 100, '5-star rating maintained'),
  (gen_random_uuid(), 'Waste Carrier Licence',               site3_uuid,  'Licenses',     '2026-09-14', 'ok',       manager3_uuid, now()::DATE - 500, 'Environment Agency licence'),
  (gen_random_uuid(), 'Alcohol Premises Licence',            site3_uuid,  'Licenses',     '2027-06-30', 'ok',       admin_uuid,    now()::DATE - 600, 'Westminster Council'),
  -- Site 4
  (gen_random_uuid(), 'Gas Safety Inspection',               site4_uuid,  'Gas Safety',   '2026-06-02', 'critical', manager4_uuid, now()::DATE - 370, 'EXPIRED - City Gas Engineers booked'),
  (gen_random_uuid(), 'PAT Testing Kitchen Equipment',       site4_uuid,  'Electrical',   '2026-05-30', 'critical', manager4_uuid, now()::DATE - 380, 'OVERDUE - Apex Electrical to attend'),
  (gen_random_uuid(), 'Legionella Risk Assessment',          site4_uuid,  'H&S',          '2026-06-15', 'critical', manager4_uuid, now()::DATE - 380, 'OVERDUE - HSE requirement'),
  (gen_random_uuid(), 'Food Hygiene Rating',                 site4_uuid,  'Food Hygiene', '2026-12-01', 'ok',       manager4_uuid, now()::DATE - 200, '4-star - improvement plan in place'),
  -- Site 5
  (gen_random_uuid(), 'EICR Certificate Renewal',            site5_uuid,  'Electrical',   '2026-07-10', 'warning',  manager5_uuid, now()::DATE - 1800,'5-yearly inspection due - Apex booked'),
  (gen_random_uuid(), 'Health and Safety Policy',            site5_uuid,  'H&S',          '2026-11-01', 'ok',       manager5_uuid, now()::DATE - 220, 'Updated post-audit'),
  (gen_random_uuid(), 'Public Liability Insurance',          site5_uuid,  'Insurance',    '2026-09-30', 'ok',       manager5_uuid, now()::DATE - 280, 'Aviva group policy'),
  -- Site 6
  (gen_random_uuid(), 'Alcohol Licence Renewal',             site6_uuid,  'Licenses',     '2027-01-31', 'ok',       admin_uuid,    now()::DATE - 500, 'Edinburgh Council ref ECC/2025/0042'),
  (gen_random_uuid(), 'Fire Risk Assessment',                site6_uuid,  'Fire Safety',  '2027-02-28', 'ok',       admin_uuid,    now()::DATE - 150, 'No issues found'),
  -- Site 7
  (gen_random_uuid(), 'Gas Safety Certificate',              site7_uuid,  'Gas Safety',   '2026-12-01', 'ok',       manager6_uuid, now()::DATE - 180, 'Annual inspection passed'),
  (gen_random_uuid(), 'Food Hygiene Certificate',            site7_uuid,  'Food Hygiene', '2027-05-10', 'ok',       manager6_uuid, now()::DATE - 120, '5-star rating'),
  (gen_random_uuid(), 'Public Liability Insurance',          site7_uuid,  'Insurance',    '2026-10-15', 'ok',       manager6_uuid, now()::DATE - 260, 'Aviva group policy'),
  -- Site 8
  (gen_random_uuid(), 'Fire Risk Assessment',                site8_uuid,  'Fire Safety',  '2026-08-20', 'warning',  manager7_uuid, now()::DATE - 350, 'Minor remediation works required'),
  (gen_random_uuid(), 'Alcohol Licence',                     site8_uuid,  'Licenses',     '2027-03-31', 'ok',       admin_uuid,    now()::DATE - 400, 'Chester Council licence'),
  -- Site 9
  (gen_random_uuid(), 'EICR Certificate',                    site9_uuid,  'Electrical',   '2027-04-15', 'ok',       manager6_uuid, now()::DATE - 300, 'Full inspection passed'),
  (gen_random_uuid(), 'Gas Safety Record',                   site9_uuid,  'Gas Safety',   '2026-10-20', 'ok',       manager6_uuid, now()::DATE - 200, 'Annual inspection passed'),
  -- Site 10
  (gen_random_uuid(), 'Health and Safety Policy',            site10_uuid, 'H&S',          '2026-12-31', 'ok',       manager2_uuid, now()::DATE - 190, 'Annual review completed'),
  (gen_random_uuid(), 'Fire Safety Certificate',             site10_uuid, 'Fire Safety',  '2026-09-15', 'ok',       manager2_uuid, now()::DATE - 280, 'Passed with minor recommendations'),
  -- Site 11
  (gen_random_uuid(), 'Gas Safety Record',                   site11_uuid, 'Gas Safety',   '2026-06-10', 'critical', manager7_uuid, now()::DATE - 375, 'EXPIRED - urgent renewal required'),
  (gen_random_uuid(), 'Food Hygiene Rating',                 site11_uuid, 'Food Hygiene', '2026-07-01', 'warning',  manager7_uuid, now()::DATE - 350, 'Improvement notice received'),
  (gen_random_uuid(), 'Fire Risk Assessment',                site11_uuid, 'Fire Safety',  '2026-06-30', 'warning',  manager7_uuid, now()::DATE - 360, 'Remediation works in progress'),
  -- Site 12
  (gen_random_uuid(), 'Public Liability Insurance',          site12_uuid, 'Insurance',    '2027-01-15', 'ok',       manager5_uuid, now()::DATE - 200, 'Aviva group policy'),
  (gen_random_uuid(), 'Premises Licence',                    site12_uuid, 'Licenses',     '2028-06-30', 'ok',       admin_uuid,    now()::DATE - 500, 'Cumbria Council licence'),
  -- Site 13
  (gen_random_uuid(), 'Alcohol Licence',                     site13_uuid, 'Licenses',     '2027-08-31', 'ok',       admin_uuid,    now()::DATE - 450, 'York Council licence'),
  (gen_random_uuid(), 'Gas Safety Record',                   site13_uuid, 'Gas Safety',   '2026-11-15', 'ok',       manager4_uuid, now()::DATE - 160, 'Annual inspection passed'),
  -- Site 14
  (gen_random_uuid(), 'Public Liability Insurance',          site14_uuid, 'Insurance',    '2026-12-01', 'ok',       manager1_uuid, now()::DATE - 220, 'Aviva group policy'),
  (gen_random_uuid(), 'EICR Certificate',                    site14_uuid, 'Electrical',   '2027-06-30', 'ok',       manager1_uuid, now()::DATE - 310, 'Full 5-year inspection passed'),
  (gen_random_uuid(), 'Fire Risk Assessment',                site14_uuid, 'Fire Safety',  '2027-01-20', 'ok',       manager1_uuid, now()::DATE - 170, 'No issues found'),
  -- Site 15
  (gen_random_uuid(), 'Gas Safety Record',                   site15_uuid, 'Gas Safety',   '2026-06-05', 'critical', manager3_uuid, now()::DATE - 372, 'EXPIRED - renewal overdue'),
  (gen_random_uuid(), 'Food Hygiene Certificate',            site15_uuid, 'Food Hygiene', '2026-07-15', 'warning',  manager3_uuid, now()::DATE - 340, 'Re-inspection scheduled'),
  (gen_random_uuid(), 'Fire Risk Assessment',                site15_uuid, 'Fire Safety',  '2026-08-01', 'warning',  manager3_uuid, now()::DATE - 330, 'Action plan submitted'),
  -- Cross-site / group level
  (gen_random_uuid(), 'Group Insurance Portfolio Review',    NULL,        'Insurance',    '2026-09-01', 'ok',       admin_uuid,    now()::DATE - 90,  'Annual group-wide review with Aviva'),
  (gen_random_uuid(), 'Annual Supplier Insurance Audit',     NULL,        'Insurance',    '2026-09-01', 'ok',       officer_uuid,  now()::DATE - 60,  'Collect certificates from all suppliers'),
  (gen_random_uuid(), 'Data Protection Policy Review',       NULL,        'H&S',          '2026-10-01', 'ok',       officer_uuid,  now()::DATE - 30,  'GDPR annual review - ICO guidance updated'),
  (gen_random_uuid(), 'Modern Slavery Statement',            NULL,        'HR',           '2026-12-31', 'ok',       admin_uuid,    now()::DATE - 120, 'Annual statement published on website'),
  (gen_random_uuid(), 'Group Fire Safety Audit',             NULL,        'Fire Safety',  '2026-11-30', 'ok',       officer_uuid,  now()::DATE - 80,  'Group-wide audit by external consultant'),
  (gen_random_uuid(), 'Cyber Essentials Certification',      NULL,        'H&S',          '2026-08-31', 'warning',  admin_uuid,    now()::DATE - 200, 'Renewal application in progress'),
  (gen_random_uuid(), 'Environmental Compliance Review',     NULL,        'H&S',          '2026-12-01', 'ok',       officer_uuid,  now()::DATE - 45,  'Annual environmental impact assessment')
ON CONFLICT (id) DO NOTHING;

-- ─── 50 TASKS ────────────────────────────────────────────────
INSERT INTO public.tasks (id, title, site_id, priority, due_date, status, assignee_id, category, description, created_by) VALUES
  -- Critical / Urgent
  (gen_random_uuid(), 'Renew gas safety certificate - Copper Kettle',     site4_uuid,  'urgent', now()::DATE + 2,  'open',        manager4_uuid, 'Gas Safety',   'Annual gas safety inspection overdue. Contact City Gas Engineers immediately.', admin_uuid),
  (gen_random_uuid(), 'PAT testing all kitchen equipment - Copper Kettle',site4_uuid,  'urgent', now()::DATE + 1,  'open',        manager4_uuid, 'Electrical',   'Full PAT testing of all kitchen equipment. Apex Electrical to attend on-site.', admin_uuid),
  (gen_random_uuid(), 'Legionella assessment - Copper Kettle',            site4_uuid,  'urgent', now()::DATE + 5,  'open',        manager4_uuid, 'H&S',          'Mandatory water system risk assessment. HSE compliance requirement.', admin_uuid),
  (gen_random_uuid(), 'Renew gas safety certificate - Spice Garden',      site11_uuid, 'urgent', now()::DATE + 3,  'open',        manager7_uuid, 'Gas Safety',   'Gas safety record expired. Contact registered engineer immediately.', admin_uuid),
  (gen_random_uuid(), 'Renew gas safety certificate - Coastal Kitchen',   site15_uuid, 'urgent', now()::DATE + 4,  'open',        manager3_uuid, 'Gas Safety',   'Gas safety record expired. Arrange inspection with registered engineer.', admin_uuid),
  -- High priority
  (gen_random_uuid(), 'Book fire risk assessment - Harbour View',         site2_uuid,  'high',   now()::DATE + 10, 'in_progress', manager2_uuid, 'Fire Safety',  'Annual FRA required. FireGuard Systems booked - awaiting confirmation.', admin_uuid),
  (gen_random_uuid(), 'Upload renewed EICR document - Skyline Suites',    site5_uuid,  'high',   now()::DATE + 30, 'open',        manager5_uuid, 'Electrical',   'Upload new EICR certificate once Apex Electrical inspection complete.', admin_uuid),
  (gen_random_uuid(), 'Fire risk assessment remediation - Northgate',     site8_uuid,  'high',   now()::DATE + 14, 'in_progress', manager7_uuid, 'Fire Safety',  'Complete remediation works identified in FRA. Contractor engaged.', admin_uuid),
  (gen_random_uuid(), 'Food hygiene improvement plan - Spice Garden',     site11_uuid, 'high',   now()::DATE + 21, 'in_progress', manager7_uuid, 'Food Hygiene', 'Implement improvement notice actions. Re-inspection booked for next month.', admin_uuid),
  (gen_random_uuid(), 'Fire risk assessment remediation - Coastal Kitchen',site15_uuid,'high',   now()::DATE + 18, 'open',        manager3_uuid, 'Fire Safety',  'Complete action plan items from FRA. Contractor quotes received.', admin_uuid),
  -- Medium priority
  (gen_random_uuid(), 'Renew vehicle insurance Van XR22',                 site2_uuid,  'medium', now()::DATE + 24, 'open',        manager2_uuid, 'Vehicle',      'Commercial fleet policy renewal with Admiral Business. Get 3 quotes.', admin_uuid),
  (gen_random_uuid(), 'Update H&S policy - Harbour View',                 site2_uuid,  'medium', now()::DATE + 52, 'open',        manager2_uuid, 'H&S',          'Annual H&S policy review. Circulate to all staff for sign-off.', admin_uuid),
  (gen_random_uuid(), 'Renew Cyber Essentials certification',             NULL,        'medium', now()::DATE + 82, 'in_progress', admin_uuid,    'IT Security',  'Annual Cyber Essentials renewal. IT team to complete self-assessment.', admin_uuid),
  (gen_random_uuid(), 'Staff fire safety training - Copper Kettle',       site4_uuid,  'medium', now()::DATE + 30, 'open',        manager4_uuid, 'Fire Safety',  'Mandatory annual fire safety training for all staff. Book with FireGuard.', admin_uuid),
  (gen_random_uuid(), 'DBS renewal checks - Harbour View',                site2_uuid,  'medium', now()::DATE + 60, 'open',        manager2_uuid, 'HR',           'Annual DBS renewal for 8 front-of-house staff members.', admin_uuid),
  (gen_random_uuid(), 'CCTV maintenance check - Grand Meridian',          site1_uuid,  'medium', now()::DATE + 45, 'open',        manager1_uuid, 'Security',     'Annual CCTV system maintenance by SecureNet. Schedule site visit.', admin_uuid),
  (gen_random_uuid(), 'Pest control quarterly visit - Brasserie Lumiere', site3_uuid,  'medium', now()::DATE + 15, 'open',        manager3_uuid, 'Food Hygiene', 'Quarterly pest control inspection. Rentokil to attend.', admin_uuid),
  (gen_random_uuid(), 'Boiler service - Riverside Inn',                   site7_uuid,  'medium', now()::DATE + 40, 'open',        manager6_uuid, 'Gas Safety',   'Annual boiler service and safety check by City Gas Engineers.', admin_uuid),
  (gen_random_uuid(), 'Staff food hygiene training - Coastal Kitchen',    site15_uuid, 'medium', now()::DATE + 28, 'open',        manager3_uuid, 'Food Hygiene', 'Level 2 food hygiene refresher training for kitchen staff.', admin_uuid),
  (gen_random_uuid(), 'Annual supplier insurance review',                 NULL,        'medium', now()::DATE + 83, 'open',        admin_uuid,    'Insurance',    'Collect and verify insurance certificates from all contracted suppliers.', admin_uuid),
  -- Low priority
  (gen_random_uuid(), 'Update emergency contact list - all sites',        NULL,        'low',    now()::DATE + 90, 'open',        officer_uuid,  'H&S',          'Annual review of emergency contact lists across all 15 sites.', admin_uuid),
  (gen_random_uuid(), 'Review lease terms - Vault 42',                    site6_uuid,  'low',    now()::DATE + 180,'open',        admin_uuid,    'Lease',        'Mid-term lease review with landlord. Solicitor to be instructed.', admin_uuid),
  (gen_random_uuid(), 'Update staff handbook - group wide',               NULL,        'low',    now()::DATE + 120,'open',        officer_uuid,  'HR',           'Annual staff handbook review incorporating legislative changes.', admin_uuid),
  (gen_random_uuid(), 'Energy audit - Lakeside Conference Centre',        site12_uuid, 'low',    now()::DATE + 150,'open',        manager5_uuid, 'H&S',          'Annual energy consumption audit. Identify efficiency improvements.', admin_uuid),
  (gen_random_uuid(), 'Review CCTV policy - group wide',                  NULL,        'low',    now()::DATE + 100,'open',        officer_uuid,  'IT Security',  'Annual CCTV policy review in line with ICO guidance.', admin_uuid),
  -- Completed tasks
  (gen_random_uuid(), 'Renew alcohol licence - Vault 42',                 site6_uuid,  'high',   now()::DATE - 30, 'completed',   admin_uuid,    'Licenses',     'Licence renewed with Edinburgh Council. Reference ECC/2025/0042.', admin_uuid),
  (gen_random_uuid(), 'Food hygiene inspection - Brasserie Lumiere',      site3_uuid,  'high',   now()::DATE - 100,'completed',   manager3_uuid, 'Food Hygiene', '5-star rating achieved. No improvement actions required.', admin_uuid),
  (gen_random_uuid(), 'EICR inspection - Loch House Hotel',               site9_uuid,  'high',   now()::DATE - 65, 'completed',   manager6_uuid, 'Electrical',   'Full 5-year EICR inspection passed. Certificate uploaded.', admin_uuid),
  (gen_random_uuid(), 'Fire risk assessment - Meridian Business Hotel',   site14_uuid, 'medium', now()::DATE - 50, 'completed',   manager1_uuid, 'Fire Safety',  'Annual FRA completed. No issues found.', admin_uuid),
  (gen_random_uuid(), 'H&S policy review - Skyline Suites',               site5_uuid,  'medium', now()::DATE - 45, 'completed',   manager5_uuid, 'H&S',          'Annual review completed. Updated post-audit findings.', admin_uuid),
  (gen_random_uuid(), 'Gas safety inspection - Riverside Inn',            site7_uuid,  'high',   now()::DATE - 80, 'completed',   manager6_uuid, 'Gas Safety',   'Annual inspection passed. Certificate valid until Dec 2026.', admin_uuid),
  (gen_random_uuid(), 'DBS checks renewal - Grand Meridian',              site1_uuid,  'medium', now()::DATE - 110,'completed',   manager1_uuid, 'HR',           'All 12 front-of-house staff DBS checks renewed.', admin_uuid),
  (gen_random_uuid(), 'Lease renewal negotiation - Coastal Kitchen',      site15_uuid, 'high',   now()::DATE - 200,'completed',   admin_uuid,    'Lease',        '7-year lease signed. Solicitor fees settled.', admin_uuid),
  (gen_random_uuid(), 'Premises licence renewal - Lakeside',              site12_uuid, 'medium', now()::DATE - 150,'completed',   admin_uuid,    'Licenses',     'Cumbria Council licence renewed until 2028.', admin_uuid),
  (gen_random_uuid(), 'CCTV upgrade - Grand Meridian',                    site1_uuid,  'low',    now()::DATE - 90, 'completed',   manager1_uuid, 'Security',     'SecureNet installed 8 new HD cameras. System fully operational.', admin_uuid),
  -- In progress tasks
  (gen_random_uuid(), 'Boiler replacement - Copper Kettle',               site4_uuid,  'urgent', now()::DATE + 7,  'in_progress', manager4_uuid, 'Gas Safety',   'Old boiler condemned. Replacement unit ordered - installation this week.', admin_uuid),
  (gen_random_uuid(), 'Kitchen deep clean - Spice Garden',                site11_uuid, 'high',   now()::DATE + 3,  'in_progress', manager7_uuid, 'Food Hygiene', 'Full kitchen deep clean ahead of re-inspection. Specialist team engaged.', admin_uuid),
  (gen_random_uuid(), 'Fire door replacement - Coastal Kitchen',          site15_uuid, 'high',   now()::DATE + 10, 'in_progress', manager3_uuid, 'Fire Safety',  'Three fire doors identified as non-compliant. Replacement in progress.', admin_uuid),
  (gen_random_uuid(), 'Staff training records update - group wide',       NULL,        'medium', now()::DATE + 20, 'in_progress', officer_uuid,  'HR',           'Centralise all staff training records into new HR system.', admin_uuid),
  (gen_random_uuid(), 'Waste management review - Old Forge Pub',          site13_uuid, 'low',    now()::DATE + 60, 'in_progress', manager4_uuid, 'H&S',          'Review waste carrier arrangements and update licence if required.', admin_uuid),
  (gen_random_uuid(), 'Supplier contract renewals Q3 2026',               NULL,        'medium', now()::DATE + 45, 'in_progress', admin_uuid,    'Insurance',    'Review and renew 6 supplier contracts due in Q3 2026.', admin_uuid),
  (gen_random_uuid(), 'Data protection impact assessment - new POS',      NULL,        'medium', now()::DATE + 35, 'in_progress', officer_uuid,  'IT Security',  'DPIA required before new POS system goes live across all sites.', admin_uuid),
  (gen_random_uuid(), 'Accessibility audit - Clifton Grand Hotel',        site10_uuid, 'low',    now()::DATE + 75, 'in_progress', manager2_uuid, 'H&S',          'Disability access audit ahead of planned refurbishment.', admin_uuid),
  (gen_random_uuid(), 'Menu allergen review - Northgate Brasserie',       site8_uuid,  'high',   now()::DATE + 8,  'in_progress', manager7_uuid, 'Food Hygiene', 'Full allergen review following Natasha Law update. Menu reprint required.', admin_uuid),
  (gen_random_uuid(), 'Insurance renewal preparation - group',            NULL,        'medium', now()::DATE + 55, 'in_progress', admin_uuid,    'Insurance',    'Prepare renewal documentation for group insurance portfolio review.', admin_uuid),
  (gen_random_uuid(), 'Noise assessment - Vault 42',                      site6_uuid,  'low',    now()::DATE + 90, 'open',        admin_uuid,    'H&S',          'Noise level assessment required for licence compliance.', admin_uuid),
  (gen_random_uuid(), 'Electrical safety check - Old Forge Pub',          site13_uuid, 'medium', now()::DATE + 50, 'open',        manager4_uuid, 'Electrical',   'Interim electrical safety check ahead of full EICR due 2027.', admin_uuid),
  (gen_random_uuid(), 'Legionella assessment - Loch House Hotel',         site9_uuid,  'medium', now()::DATE + 40, 'open',        manager6_uuid, 'H&S',          'Annual water system risk assessment. Third party assessor required.', admin_uuid),
  (gen_random_uuid(), 'Staff first aid training - Meridian Business',     site14_uuid, 'low',    now()::DATE + 70, 'open',        manager1_uuid, 'H&S',          'Annual first aid refresher training for designated first aiders.', admin_uuid),
  (gen_random_uuid(), 'Review cleaning contracts - group wide',           NULL,        'low',    now()::DATE + 95, 'open',        admin_uuid,    'Insurance',    'Annual review of cleaning contracts across all sites. CleanSafe renewal due.', admin_uuid)
ON CONFLICT (id) DO NOTHING;

-- ─── 20 VENDORS ──────────────────────────────────────────────
INSERT INTO public.vendors (id, name, category, contract_expiry, insurance_expiry, status, contact_name, email, phone, contract_value) VALUES
  (vendor1_uuid,  'CleanSafe Services Ltd',      'Cleaning',          '2027-03-31', '2026-09-01', 'ok',       'Mark Phillips',   'mark@cleansafe.co.uk',       '+44 20 7946 1100',  '48000/yr'),
  (vendor2_uuid,  'FireGuard Systems',           'Fire Safety',       '2026-07-15', '2026-06-30', 'warning',  'Donna Walsh',     'd.walsh@fireguard.co.uk',    '+44 117 946 2200',  '12500/yr'),
  (vendor3_uuid,  'City Gas Engineers',          'Gas',               '2026-06-10', '2026-05-28', 'critical', 'Steve Nunn',      'steve@citygas.co.uk',        '+44 1225 946 330',  '6200/yr'),
  (vendor4_uuid,  'Apex Electrical',             'Electrical',        '2027-12-31', '2027-01-15', 'ok',       'Rachel Tong',     'r.tong@apexelec.co.uk',      '+44 161 946 4400',  '32000/yr'),
  (vendor5_uuid,  'Nordic Food Supply',          'Food & Beverage',   '2026-10-31', '2026-10-31', 'ok',       'Lars Eriksen',    'lars@nordicfood.co.uk',      '+44 131 946 5500',  '96000/yr'),
  (vendor6_uuid,  'SecureNet CCTV',              'Security',          '2028-06-01', '2027-06-01', 'ok',       'Amir Patel',      'amir@securenet.co.uk',       '+44 20 7946 6600',  '18400/yr'),
  (vendor7_uuid,  'Rentokil Pest Control',       'Pest Control',      '2027-01-31', '2026-12-31', 'ok',       'Karen Booth',     'k.booth@rentokil.co.uk',     '+44 800 946 7700',  '9600/yr'),
  (vendor8_uuid,  'Aqua Water Treatment',        'Water Treatment',   '2026-11-30', '2026-11-30', 'ok',       'Neil Forsyth',    'neil@aquawater.co.uk',       '+44 1865 946 880',  '14400/yr'),
  (vendor9_uuid,  'BrightWaste Recycling',       'Waste Management',  '2027-06-30', '2027-06-30', 'ok',       'Fiona Grant',     'fiona@brightwaste.co.uk',    '+44 1244 946 990',  '7200/yr'),
  (vendor10_uuid, 'Premier Linen Services',      'Laundry',           '2026-12-31', '2026-12-31', 'ok',       'Tony Marsh',      'tony@premierlinen.co.uk',    '+44 141 946 1010',  '36000/yr'),
  (vendor11_uuid, 'SafeGuard Security',          'Security',          '2027-09-30', '2027-09-30', 'ok',       'Chloe Barker',    'chloe@safeguard.co.uk',      '+44 113 946 1111',  '24000/yr'),
  (vendor12_uuid, 'TechFix IT Solutions',        'IT Services',       '2026-08-31', '2026-08-31', 'warning',  'Raj Patel',       'raj@techfix.co.uk',          '+44 20 7946 1212',  '19200/yr'),
  (vendor13_uuid, 'GreenLeaf Landscaping',       'Grounds Maintenance','2027-04-30', '2027-04-30', 'ok',      'Emma Sutton',     'emma@greenleaf.co.uk',       '+44 1539 946 1313', '8400/yr'),
  (vendor14_uuid, 'Catering Equipment Repairs',  'Maintenance',       '2026-09-30', '2026-09-30', 'warning',  'Paul Higgins',    'paul@caterequip.co.uk',      '+44 121 946 1414',  '15600/yr'),
  (vendor15_uuid, 'Aviva Commercial Insurance',  'Insurance',         '2026-08-15', '2026-08-15', 'ok',       'Sandra Leigh',    's.leigh@aviva.co.uk',        '+44 800 946 1515',  '62000/yr'),
  (vendor16_uuid, 'Admiral Business Fleet',      'Vehicle Insurance', '2026-07-04', '2026-07-04', 'warning',  'Chris Doyle',     'c.doyle@admiral.co.uk',      '+44 800 946 1616',  '4800/yr'),
  (vendor17_uuid, 'Ecolab Food Safety',          'Food Hygiene',      '2027-02-28', '2027-02-28', 'ok',       'Heather Moss',    'h.moss@ecolab.co.uk',        '+44 1904 946 1717', '11200/yr'),
  (vendor18_uuid, 'Kone Lifts & Escalators',     'Maintenance',       '2028-03-31', '2028-03-31', 'ok',       'Mikael Virtanen', 'm.virtanen@kone.co.uk',      '+44 1273 946 1818', '28800/yr'),
  (vendor19_uuid, 'BT Business Broadband',       'IT Services',       '2027-11-30', '2027-11-30', 'ok',       'Lisa Chambers',   'l.chambers@bt.com',          '+44 800 946 1919',  '16800/yr'),
  (vendor20_uuid, 'Sodexo Facilities Mgmt',      'Facilities',        '2026-06-30', '2026-06-30', 'critical', 'Derek Stone',     'd.stone@sodexo.co.uk',       '+44 20 7946 2020',  '84000/yr')
ON CONFLICT (id) DO NOTHING;

-- Vendor site mappings
INSERT INTO public.vendor_site_mappings (vendor_id, site_id, is_all_sites) VALUES
  (vendor1_uuid,  site1_uuid,  false),
  (vendor1_uuid,  site3_uuid,  false),
  (vendor1_uuid,  site6_uuid,  false),
  (vendor2_uuid,  site2_uuid,  false),
  (vendor2_uuid,  site5_uuid,  false),
  (vendor2_uuid,  site8_uuid,  false),
  (vendor3_uuid,  site4_uuid,  false),
  (vendor3_uuid,  site11_uuid, false),
  (vendor3_uuid,  site15_uuid, false),
  (vendor4_uuid,  NULL,        true),
  (vendor5_uuid,  site3_uuid,  false),
  (vendor5_uuid,  site6_uuid,  false),
  (vendor5_uuid,  site8_uuid,  false),
  (vendor6_uuid,  site1_uuid,  false),
  (vendor6_uuid,  site2_uuid,  false),
  (vendor6_uuid,  site14_uuid, false),
  (vendor7_uuid,  site3_uuid,  false),
  (vendor7_uuid,  site6_uuid,  false),
  (vendor7_uuid,  site11_uuid, false),
  (vendor8_uuid,  NULL,        true),
  (vendor9_uuid,  NULL,        true),
  (vendor10_uuid, site1_uuid,  false),
  (vendor10_uuid, site5_uuid,  false),
  (vendor10_uuid, site9_uuid,  false),
  (vendor11_uuid, site1_uuid,  false),
  (vendor11_uuid, site6_uuid,  false),
  (vendor12_uuid, NULL,        true),
  (vendor13_uuid, site7_uuid,  false),
  (vendor13_uuid, site12_uuid, false),
  (vendor14_uuid, site4_uuid,  false),
  (vendor14_uuid, site11_uuid, false),
  (vendor15_uuid, NULL,        true),
  (vendor16_uuid, site2_uuid,  false),
  (vendor17_uuid, site3_uuid,  false),
  (vendor17_uuid, site4_uuid,  false),
  (vendor17_uuid, site11_uuid, false),
  (vendor18_uuid, site1_uuid,  false),
  (vendor18_uuid, site5_uuid,  false),
  (vendor18_uuid, site14_uuid, false),
  (vendor19_uuid, NULL,        true),
  (vendor20_uuid, NULL,        true)
ON CONFLICT (id) DO NOTHING;

-- ─── 50 ALERTS ───────────────────────────────────────────────
INSERT INTO public.alerts (id, alert_type, message, site_id, is_read, created_at) VALUES
  -- Critical alerts
  (gen_random_uuid(), 'critical', 'Gas Safety Record EXPIRED - The Copper Kettle',                    site4_uuid,  false, now() - interval '2 hours'),
  (gen_random_uuid(), 'critical', 'PAT Testing overdue - The Copper Kettle',                          site4_uuid,  false, now() - interval '2 hours'),
  (gen_random_uuid(), 'critical', 'Legionella assessment overdue - The Copper Kettle',                site4_uuid,  false, now() - interval '1 day'),
  (gen_random_uuid(), 'critical', 'Gas Safety Record EXPIRED - The Spice Garden',                     site11_uuid, false, now() - interval '3 hours'),
  (gen_random_uuid(), 'critical', 'Gas Safety Record EXPIRED - The Coastal Kitchen',                  site15_uuid, false, now() - interval '4 hours'),
  (gen_random_uuid(), 'critical', 'Vendor contract expired - Sodexo Facilities Management',           NULL,        false, now() - interval '5 hours'),
  (gen_random_uuid(), 'critical', 'Vendor insurance expired - City Gas Engineers',                    NULL,        false, now() - interval '6 hours'),
  (gen_random_uuid(), 'critical', 'Compliance score below 70% - The Copper Kettle (61%)',             site4_uuid,  false, now() - interval '12 hours'),
  (gen_random_uuid(), 'critical', 'Site at risk status - The Spice Garden',                           site11_uuid, false, now() - interval '1 day'),
  (gen_random_uuid(), 'critical', 'Boiler condemned - immediate replacement required - Copper Kettle',site4_uuid,  false, now() - interval '2 days'),
  -- Warning alerts
  (gen_random_uuid(), 'warning',  'Fire Safety Certificate expires in 10 days - Harbour View Hotel',  site2_uuid,  false, now() - interval '2 days'),
  (gen_random_uuid(), 'warning',  'EICR expires in 30 days - Skyline Suites',                         site5_uuid,  false, now() - interval '3 days'),
  (gen_random_uuid(), 'warning',  'Vehicle insurance expires in 24 days - Harbour View Van XR22',     site2_uuid,  false, now() - interval '3 days'),
  (gen_random_uuid(), 'warning',  'Fire Risk Assessment overdue - Northgate Brasserie',               site8_uuid,  false, now() - interval '4 days'),
  (gen_random_uuid(), 'warning',  'Food hygiene improvement notice - The Spice Garden',               site11_uuid, false, now() - interval '4 days'),
  (gen_random_uuid(), 'warning',  'Fire risk assessment action plan overdue - Coastal Kitchen',       site15_uuid, false, now() - interval '5 days'),
  (gen_random_uuid(), 'warning',  'Vendor contract expires in 45 days - FireGuard Systems',           NULL,        false, now() - interval '5 days'),
  (gen_random_uuid(), 'warning',  'Vendor insurance expires in 30 days - FireGuard Systems',          NULL,        false, now() - interval '6 days'),
  (gen_random_uuid(), 'warning',  'Vendor contract expires in 60 days - Admiral Business Fleet',      NULL,        false, now() - interval '6 days'),
  (gen_random_uuid(), 'warning',  'Compliance score below 80% - Harbour View Hotel (78%)',            site2_uuid,  false, now() - interval '7 days'),
  (gen_random_uuid(), 'warning',  'Compliance score below 70% - The Coastal Kitchen (67%)',           site15_uuid, false, now() - interval '7 days'),
  (gen_random_uuid(), 'warning',  'Vendor contract expires in 30 days - Catering Equipment Repairs',  NULL,        false, now() - interval '8 days'),
  (gen_random_uuid(), 'warning',  'IT contract expires in 60 days - TechFix IT Solutions',            NULL,        false, now() - interval '8 days'),
  (gen_random_uuid(), 'warning',  'Food hygiene re-inspection due - The Coastal Kitchen',             site15_uuid, false, now() - interval '9 days'),
  (gen_random_uuid(), 'warning',  'Maintenance site - The Copper Kettle has 9 open issues',           site4_uuid,  true,  now() - interval '10 days'),
  -- Info alerts
  (gen_random_uuid(), 'info',     'New document uploaded: Lease Agreement - Vault 42',                site6_uuid,  true,  now() - interval '4 days'),
  (gen_random_uuid(), 'info',     'Task completed: Alcohol licence renewed - Vault 42',               site6_uuid,  true,  now() - interval '5 days'),
  (gen_random_uuid(), 'info',     'Task completed: Food hygiene inspection - Brasserie Lumiere',      site3_uuid,  true,  now() - interval '10 days'),
  (gen_random_uuid(), 'info',     'New vendor added: Ecolab Food Safety',                             NULL,        true,  now() - interval '11 days'),
  (gen_random_uuid(), 'info',     'Task completed: EICR inspection - Loch House Hotel',               site9_uuid,  true,  now() - interval '12 days'),
  (gen_random_uuid(), 'info',     'Compliance score improved to 99% - Vault 42 Bar Kitchen',          site6_uuid,  true,  now() - interval '13 days'),
  (gen_random_uuid(), 'info',     'New site added: Meridian Business Hotel - Leeds',                  site14_uuid, true,  now() - interval '14 days'),
  (gen_random_uuid(), 'info',     'Task completed: FRA - Meridian Business Hotel',                    site14_uuid, true,  now() - interval '15 days'),
  (gen_random_uuid(), 'info',     'Vendor contract renewed: CleanSafe Services Ltd',                  NULL,        true,  now() - interval '16 days'),
  (gen_random_uuid(), 'info',     'Task completed: Gas safety inspection - Riverside Inn',            site7_uuid,  true,  now() - interval '17 days'),
  (gen_random_uuid(), 'info',     'Monthly compliance report generated for May 2026',                 NULL,        true,  now() - interval '18 days'),
  (gen_random_uuid(), 'info',     'New user added: Rachel Nguyen - Site Manager',                     NULL,        true,  now() - interval '19 days'),
  (gen_random_uuid(), 'info',     'New user added: David Walsh - Site Manager',                       NULL,        true,  now() - interval '20 days'),
  (gen_random_uuid(), 'info',     'Task completed: DBS checks renewal - Grand Meridian',              site1_uuid,  true,  now() - interval '21 days'),
  (gen_random_uuid(), 'info',     'Compliance score 100% - Lakeside Conference Centre',               site12_uuid, true,  now() - interval '22 days'),
  (gen_random_uuid(), 'info',     'Vendor insurance renewed: Apex Electrical',                        NULL,        true,  now() - interval '23 days'),
  (gen_random_uuid(), 'info',     'Task completed: CCTV upgrade - Grand Meridian',                    site1_uuid,  true,  now() - interval '24 days'),
  (gen_random_uuid(), 'info',     'Quarterly pest control completed - Brasserie Lumiere',             site3_uuid,  true,  now() - interval '25 days'),
  (gen_random_uuid(), 'info',     'New document uploaded: EICR Certificate - Loch House Hotel',       site9_uuid,  true,  now() - interval '26 days'),
  (gen_random_uuid(), 'info',     'Task completed: Premises licence renewal - Lakeside',              site12_uuid, true,  now() - interval '27 days'),
  (gen_random_uuid(), 'info',     'Compliance review completed: The Old Forge Pub (88%)',             site13_uuid, true,  now() - interval '28 days'),
  (gen_random_uuid(), 'info',     'Vendor contract renewed: Nordic Food Supply',                      NULL,        true,  now() - interval '29 days'),
  (gen_random_uuid(), 'info',     'Annual group insurance portfolio reviewed with Aviva',             NULL,        true,  now() - interval '30 days')
ON CONFLICT (id) DO NOTHING;

-- ─── 50 NOTIFICATIONS ────────────────────────────────────────
INSERT INTO public.notifications (user_id, title, message, is_read, related_entity_type, created_at) VALUES
  -- Admin notifications
  (admin_uuid, 'CRITICAL: Gas Safety Expired - Copper Kettle',     'Gas Safety Record at The Copper Kettle has expired. Immediate action required.',                          false, 'compliance_item', now() - interval '2 hours'),
  (admin_uuid, 'CRITICAL: Gas Safety Expired - Spice Garden',      'Gas Safety Record at The Spice Garden has expired. Contact City Gas Engineers immediately.',              false, 'compliance_item', now() - interval '3 hours'),
  (admin_uuid, 'CRITICAL: Gas Safety Expired - Coastal Kitchen',   'Gas Safety Record at The Coastal Kitchen has expired. Arrange inspection urgently.',                      false, 'compliance_item', now() - interval '4 hours'),
  (admin_uuid, 'CRITICAL: PAT Testing Overdue - Copper Kettle',    'PAT Testing at The Copper Kettle is overdue. Schedule Apex Electrical immediately.',                      false, 'compliance_item', now() - interval '2 hours'),
  (admin_uuid, 'CRITICAL: Vendor Contract Expired - Sodexo',       'Sodexo Facilities Management contract has expired. Renewal negotiation required.',                        false, 'vendor',          now() - interval '5 hours'),
  (admin_uuid, 'WARNING: Fire Certificate Expiring - Harbour View','Fire Safety Certificate at Harbour View Hotel expires in 10 days. Confirm FireGuard booking.',             false, 'compliance_item', now() - interval '2 days'),
  (admin_uuid, 'WARNING: EICR Expiring - Skyline Suites',          'EICR Certificate at Skyline Suites expires in 30 days. Apex Electrical inspection booked.',               false, 'compliance_item', now() - interval '3 days'),
  (admin_uuid, 'WARNING: Vendor Insurance Expiring - FireGuard',   'FireGuard Systems insurance expires in 30 days. Request renewal certificate.',                            false, 'vendor',          now() - interval '6 days'),
  (admin_uuid, 'Task Assigned: Annual Supplier Insurance Review',  'You have been assigned the annual supplier insurance review task. Due 1 September 2026.',                 false, 'task',            now() - interval '7 days'),
  (admin_uuid, 'Task Completed: Alcohol Licence Renewed - Vault 42','Vault 42 alcohol licence successfully renewed. Reference ECC/2025/0042.',                                true,  'task',            now() - interval '30 days'),
  (admin_uuid, 'New Site Added: Meridian Business Hotel',          'Meridian Business Hotel, Leeds has been added to the portfolio. Sarah Chen assigned as manager.',          true,  'site',            now() - interval '14 days'),
  (admin_uuid, 'Monthly Report: May 2026 Compliance Summary',      'May 2026 compliance report is ready. Group average score: 84%. 3 critical items require attention.',      true,  'site',            now() - interval '18 days'),
  -- Manager 1 (Sarah Chen) notifications
  (manager1_uuid, 'Task Assigned: CCTV Maintenance Check',         'Annual CCTV maintenance check at The Grand Meridian due in 45 days. Contact SecureNet.',                  false, 'task',            now() - interval '1 day'),
  (manager1_uuid, 'Task Completed: DBS Checks Renewed',            'All 12 DBS checks at The Grand Meridian have been renewed successfully.',                                  true,  'task',            now() - interval '21 days'),
  (manager1_uuid, 'Task Completed: CCTV Upgrade',                  'SecureNet CCTV upgrade at The Grand Meridian completed. 8 new HD cameras installed.',                     true,  'task',            now() - interval '24 days'),
  (manager1_uuid, 'Compliance Score: Grand Meridian 94%',          'The Grand Meridian compliance score is 94%. 2 open issues require attention.',                             true,  'site',            now() - interval '5 days'),
  -- Manager 2 (James Okafor) notifications
  (manager2_uuid, 'ACTION REQUIRED: Fire Certificate Expiring',    'Fire Safety Certificate at Harbour View Hotel expires in 10 days. Confirm FireGuard booking date.',        false, 'compliance_item', now() - interval '2 days'),
  (manager2_uuid, 'ACTION REQUIRED: Vehicle Insurance Expiring',   'Van XR22 vehicle insurance expires in 24 days. Renew with Admiral Business immediately.',                 false, 'compliance_item', now() - interval '3 days'),
  (manager2_uuid, 'Task Assigned: DBS Renewal Checks',             'DBS renewal checks for 8 staff at Harbour View Hotel due in 60 days.',                                    false, 'task',            now() - interval '4 days'),
  (manager2_uuid, 'Fire Risk Assessment Reminder',                 'Fire Risk Assessment at Harbour View Hotel is due in 10 days.',                                            true,  'compliance_item', now() - interval '2 days'),
  -- Manager 3 (Isabelle Martin) notifications
  (manager3_uuid, 'Task Assigned: Pest Control Visit',             'Quarterly pest control visit at Brasserie Lumiere due in 15 days. Contact Rentokil.',                     false, 'task',            now() - interval '1 day'),
  (manager3_uuid, 'ACTION REQUIRED: Gas Safety Expired - Coastal', 'Gas Safety Record at The Coastal Kitchen has expired. Arrange inspection urgently.',                      false, 'compliance_item', now() - interval '4 hours'),
  (manager3_uuid, 'Task Completed: Food Hygiene Inspection',       'Brasserie Lumiere achieved 5-star food hygiene rating. Excellent result.',                                 true,  'task',            now() - interval '100 days'),
  (manager3_uuid, 'Compliance Score: Brasserie Lumiere 97%',       'Brasserie Lumiere compliance score is 97%. Only 1 open issue.',                                            true,  'site',            now() - interval '5 days'),
  -- Manager 4 (Tom Bradley) notifications
  (manager4_uuid, 'CRITICAL: Gas Safety Expired',                  'Gas Safety Record at The Copper Kettle has expired. Contact City Gas Engineers immediately.',              false, 'compliance_item', now() - interval '2 hours'),
  (manager4_uuid, 'CRITICAL: PAT Testing Overdue',                 'PAT Testing at The Copper Kettle is overdue. Schedule Apex Electrical immediately.',                      false, 'compliance_item', now() - interval '2 hours'),
  (manager4_uuid, 'CRITICAL: Legionella Assessment Overdue',       'Legionella risk assessment is overdue at The Copper Kettle. HSE requirement.',                             false, 'compliance_item', now() - interval '1 day'),
  (manager4_uuid, 'URGENT: Boiler Replacement In Progress',        'Boiler replacement at The Copper Kettle is in progress. Ensure engineer access is arranged.',             false, 'task',            now() - interval '2 days'),
  (manager4_uuid, 'Compliance Score: Copper Kettle 61%',           'The Copper Kettle compliance score has dropped to 61%. Immediate action required on 9 open issues.',      false, 'site',            now() - interval '3 days'),
  -- Manager 5 (Priya Sharma) notifications
  (manager5_uuid, 'WARNING: EICR Expiring - Skyline Suites',       'EICR Certificate at Skyline Suites expires in 30 days. Apex Electrical inspection is booked.',            false, 'compliance_item', now() - interval '3 days'),
  (manager5_uuid, 'Task Assigned: Energy Audit - Lakeside',        'Annual energy audit at Lakeside Conference Centre due in 150 days.',                                       false, 'task',            now() - interval '2 days'),
  (manager5_uuid, 'Compliance Score: Skyline Suites 85%',          'Skyline Suites compliance score is 85%. 3 open issues require attention.',                                 true,  'site',            now() - interval '5 days'),
  (manager5_uuid, 'Compliance Score: Lakeside 100%',               'Lakeside Conference Centre has achieved 100% compliance score. Excellent work.',                           true,  'site',            now() - interval '22 days'),
  -- Manager 6 (Rachel Nguyen) notifications
  (manager6_uuid, 'Task Completed: EICR Inspection - Loch House',  'EICR inspection at Loch House Hotel completed and passed. Certificate uploaded.',                          true,  'task',            now() - interval '65 days'),
  (manager6_uuid, 'Task Completed: Gas Safety - Riverside Inn',    'Annual gas safety inspection at The Riverside Inn passed. Certificate valid until Dec 2026.',              true,  'task',            now() - interval '80 days'),
  (manager6_uuid, 'Task Assigned: Legionella Assessment',          'Annual legionella risk assessment at Loch House Hotel due in 40 days.',                                    false, 'task',            now() - interval '1 day'),
  (manager6_uuid, 'Compliance Score: Riverside Inn 92%',           'The Riverside Inn compliance score is 92%. 1 open issue.',                                                 true,  'site',            now() - interval '5 days'),
  -- Manager 7 (David Walsh) notifications
  (manager7_uuid, 'CRITICAL: Gas Safety Expired - Spice Garden',   'Gas Safety Record at The Spice Garden has expired. Contact City Gas Engineers immediately.',              false, 'compliance_item', now() - interval '3 hours'),
  (manager7_uuid, 'HIGH: Food Hygiene Improvement Notice',         'Improvement notice received at The Spice Garden. Implement all actions before re-inspection.',             false, 'compliance_item', now() - interval '4 days'),
  (manager7_uuid, 'HIGH: Fire Risk Remediation - Northgate',       'Fire risk assessment remediation works at Northgate Brasserie must be completed by deadline.',             false, 'task',            now() - interval '5 days'),
  (manager7_uuid, 'Task Assigned: Kitchen Deep Clean - Spice Garden','Full kitchen deep clean at The Spice Garden required ahead of re-inspection.',                           false, 'task',            now() - interval '2 days'),
  (manager7_uuid, 'Compliance Score: Spice Garden 65%',            'The Spice Garden compliance score is 65%. 7 open issues require urgent attention.',                        false, 'site',            now() - interval '3 days'),
  -- Compliance Officer (Claire Oduya) notifications
  (officer_uuid, 'Compliance Review Due: Copper Kettle',           'Monthly compliance review is due for The Copper Kettle. 9 open issues require assessment.',                false, 'site',            now() - interval '3 days'),
  (officer_uuid, 'Compliance Review Due: Spice Garden',            'Monthly compliance review is due for The Spice Garden. Site is at risk status.',                           false, 'site',            now() - interval '3 days'),
  (officer_uuid, 'Task Assigned: Data Protection Impact Assessment','DPIA required before new POS system goes live. Complete within 35 days.',                                  false, 'task',            now() - interval '2 days'),
  (officer_uuid, 'Task Assigned: Group Fire Safety Audit',         'Annual group-wide fire safety audit due by 30 November 2026. Engage external consultant.',                 false, 'task',            now() - interval '1 day'),
  (officer_uuid, 'Monthly Report: May 2026 Ready for Review',      'May 2026 compliance report has been generated. Please review and sign off.',                               false, 'site',            now() - interval '18 days'),
  (officer_uuid, 'Cyber Essentials Renewal In Progress',           'Cyber Essentials certification renewal application is in progress. IT team completing self-assessment.',   true,  'compliance_item', now() - interval '10 days')
ON CONFLICT (id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Expanded seed data error: % - %', SQLSTATE, SQLERRM;
END $$;
