-- ============================================================
-- SamkoCentral: Seed Data Migration
-- Creates auth users, sites, documents, compliance, tasks,
-- vendors, alerts, and notifications
-- ============================================================

DO $$
DECLARE
  admin_uuid    UUID := gen_random_uuid();
  manager1_uuid UUID := gen_random_uuid();
  manager2_uuid UUID := gen_random_uuid();
  manager3_uuid UUID := gen_random_uuid();
  manager4_uuid UUID := gen_random_uuid();
  manager5_uuid UUID := gen_random_uuid();
  officer_uuid  UUID := gen_random_uuid();

  site1_uuid UUID := gen_random_uuid();
  site2_uuid UUID := gen_random_uuid();
  site3_uuid UUID := gen_random_uuid();
  site4_uuid UUID := gen_random_uuid();
  site5_uuid UUID := gen_random_uuid();
  site6_uuid UUID := gen_random_uuid();

  cat_insurance_uuid   UUID := gen_random_uuid();
  cat_fire_uuid        UUID := gen_random_uuid();
  cat_gas_uuid         UUID := gen_random_uuid();
  cat_electrical_uuid  UUID := gen_random_uuid();
  cat_food_uuid        UUID := gen_random_uuid();
  cat_licenses_uuid    UUID := gen_random_uuid();
  cat_hs_uuid          UUID := gen_random_uuid();
  cat_hr_uuid          UUID := gen_random_uuid();
  cat_vehicle_uuid     UUID := gen_random_uuid();
  cat_lease_uuid       UUID := gen_random_uuid();

  vendor1_uuid UUID := gen_random_uuid();
  vendor2_uuid UUID := gen_random_uuid();
  vendor3_uuid UUID := gen_random_uuid();
  vendor4_uuid UUID := gen_random_uuid();
  vendor5_uuid UUID := gen_random_uuid();
  vendor6_uuid UUID := gen_random_uuid();

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

-- ─── SITES ───────────────────────────────────────────────────
INSERT INTO public.sites (id, name, site_type, city, address, manager_name, phone, status, risk, open_issues, compliance_score) VALUES
  (site1_uuid, 'The Grand Meridian',   'Hotel',      'London',     '14 Belgrave Square, London SW1X 8PS',       'Sarah Chen',      '+44 20 7946 0300', 'operational', 'low',    2, 94),
  (site2_uuid, 'Harbour View Hotel',   'Hotel',      'Bristol',    '2 Harbourside Walk, Bristol BS1 4RB',        'James Okafor',    '+44 117 946 0221', 'operational', 'medium', 5, 78),
  (site3_uuid, 'Brasserie Lumiere',    'Restaurant', 'London',     '88 King Street, London WC2E 8JS',            'Isabelle Martin', '+44 20 7946 0445', 'operational', 'low',    1, 97),
  (site4_uuid, 'The Copper Kettle',    'Restaurant', 'Bath',       '7 Milsom Street, Bath BA1 1BZ',              'Tom Bradley',     '+44 1225 946 012', 'maintenance', 'high',   9, 61),
  (site5_uuid, 'Skyline Suites',       'Hotel',      'Manchester', '200 Deansgate, Manchester M3 4LQ',           'Priya Sharma',    '+44 161 946 0110', 'operational', 'medium', 3, 85),
  (site6_uuid, 'Vault 42 Bar Kitchen', 'Restaurant', 'Edinburgh',  '42 Victoria Street, Edinburgh EH1 2JW',     'Ewan McAllister', '+44 131 946 0887', 'operational', 'low',    0, 99)
ON CONFLICT (id) DO NOTHING;

-- ─── DOCUMENT CATEGORIES ─────────────────────────────────────
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
ON CONFLICT (name) DO NOTHING;

-- ─── DOCUMENTS ───────────────────────────────────────────────
INSERT INTO public.documents (id, name, site_id, category_id, expiry_date, status, file_size, uploaded_at, uploaded_by, version) VALUES
  (gen_random_uuid(), 'Public Liability Insurance',         site1_uuid, cat_insurance_uuid,  '2026-08-15', 'ok',       '2.4 MB', '2025-08-10 09:00:00+00', manager1_uuid, 'v3.1'),
  (gen_random_uuid(), 'Fire Safety Certificate',            site2_uuid, cat_fire_uuid,        '2026-06-20', 'warning',  '1.1 MB', '2024-06-18 10:00:00+00', manager2_uuid, 'v2.0'),
  (gen_random_uuid(), 'Gas Safety Record',                  site4_uuid, cat_gas_uuid,         '2026-06-02', 'critical', '0.8 MB', '2025-06-01 08:00:00+00', manager4_uuid, 'v1.4'),
  (gen_random_uuid(), 'Premises Alcohol Licence',           site6_uuid, cat_licenses_uuid,    '2027-01-31', 'ok',       '3.2 MB', '2025-01-28 11:00:00+00', admin_uuid,    'v5.0'),
  (gen_random_uuid(), 'EICR Electrical Installation Report',site5_uuid, cat_electrical_uuid,  '2026-07-10', 'warning',  '5.7 MB', '2021-07-08 09:00:00+00', manager5_uuid, 'v1.0'),
  (gen_random_uuid(), 'Food Hygiene Certificate Level 5',   site3_uuid, cat_food_uuid,        '2028-03-22', 'ok',       '0.6 MB', '2025-03-20 14:00:00+00', manager3_uuid, 'v2.2'),
  (gen_random_uuid(), 'Employer Liability Insurance',       site1_uuid, cat_insurance_uuid,   '2026-08-15', 'ok',       '1.9 MB', '2025-08-10 09:00:00+00', manager1_uuid, 'v4.0'),
  (gen_random_uuid(), 'PAT Testing Record',                 site4_uuid, cat_electrical_uuid,  '2026-05-30', 'critical', '1.2 MB', '2025-05-29 10:00:00+00', manager4_uuid, 'v1.1'),
  (gen_random_uuid(), 'Vehicle MOT Certificate Van XR22',   site2_uuid, cat_vehicle_uuid,     '2026-07-04', 'warning',  '0.4 MB', '2025-07-03 09:00:00+00', manager2_uuid, 'v1.0'),
  (gen_random_uuid(), 'Lease Agreement Main Premises',      site6_uuid, cat_lease_uuid,       '2031-12-31', 'ok',       '8.1 MB', '2024-01-05 11:00:00+00', admin_uuid,    'v1.0'),
  (gen_random_uuid(), 'Health and Safety Policy',           site5_uuid, cat_hs_uuid,          '2026-11-01', 'ok',       '1.4 MB', '2025-11-01 09:00:00+00', manager5_uuid, 'v3.0'),
  (gen_random_uuid(), 'Waste Carrier Licence',              site3_uuid, cat_licenses_uuid,    '2026-09-14', 'ok',       '0.5 MB', '2024-09-10 10:00:00+00', manager3_uuid, 'v2.0'),
  (gen_random_uuid(), 'Legionella Risk Assessment',         site4_uuid, cat_hs_uuid,          '2026-06-15', 'critical', '2.1 MB', '2025-06-14 08:00:00+00', manager4_uuid, 'v1.0'),
  (gen_random_uuid(), 'DBS Check Register Front of House',  site1_uuid, cat_hr_uuid,          '2026-10-01', 'ok',       '0.9 MB', '2025-10-01 09:00:00+00', manager1_uuid, 'v2.1')
ON CONFLICT (id) DO NOTHING;

-- ─── COMPLIANCE ITEMS ────────────────────────────────────────
INSERT INTO public.compliance_items (id, item, site_id, category, due_date, status, assignee_id, last_reviewed, notes) VALUES
  (gen_random_uuid(), 'Public Liability Insurance',    site1_uuid, 'Insurance',    '2026-08-15', 'ok',       manager1_uuid, '2025-08-10', 'Renewed annually with Aviva Commercial'),
  (gen_random_uuid(), 'Fire Risk Assessment',          site2_uuid, 'Fire Safety',  '2026-06-20', 'warning',  manager2_uuid, '2024-06-18', 'FireGuard Systems contracted to carry out assessment'),
  (gen_random_uuid(), 'Gas Safety Inspection',         site4_uuid, 'Gas Safety',   '2026-06-02', 'critical', manager4_uuid, '2025-06-01', 'City Gas Engineers to attend - booking urgent'),
  (gen_random_uuid(), 'PAT Testing Kitchen Equipment', site4_uuid, 'Electrical',   '2026-05-30', 'critical', manager4_uuid, '2025-05-29', 'Apex Electrical to conduct full kitchen sweep'),
  (gen_random_uuid(), 'EICR Certificate Renewal',      site5_uuid, 'Electrical',   '2026-07-10', 'warning',  manager5_uuid, '2021-07-08', 'Full 5-yearly inspection due - Apex Electrical booked'),
  (gen_random_uuid(), 'Food Hygiene Inspection',       site3_uuid, 'Food Hygiene', '2028-03-22', 'ok',       manager3_uuid, '2025-03-20', 'Achieved 5-star rating - next inspection 2028'),
  (gen_random_uuid(), 'Alcohol Licence Renewal',       site6_uuid, 'Licenses',     '2027-01-31', 'ok',       admin_uuid,    '2025-01-28', 'Edinburgh Council licence reference ECC/2025/0042'),
  (gen_random_uuid(), 'Vehicle Insurance Van XR22',    site2_uuid, 'Vehicle',      '2026-07-04', 'warning',  manager2_uuid, '2025-07-03', 'Commercial fleet policy with Admiral Business'),
  (gen_random_uuid(), 'DBS Checks Front of House',     site1_uuid, 'HR',           '2026-10-01', 'ok',       manager1_uuid, '2025-10-01', '12 staff checked - all clear, renewed annually'),
  (gen_random_uuid(), 'Legionella Risk Assessment',    site4_uuid, 'H&S',          '2026-06-15', 'critical', manager4_uuid, '2025-06-14', 'Water system assessment overdue - HSE requirement')
ON CONFLICT (id) DO NOTHING;

-- ─── TASKS ───────────────────────────────────────────────────
INSERT INTO public.tasks (id, title, site_id, priority, due_date, status, assignee_id, category, description, created_by) VALUES
  (gen_random_uuid(), 'Renew gas safety certificate',          site4_uuid, 'urgent', '2026-06-02', 'open',        manager4_uuid, 'Gas Safety',  'Annual gas safety inspection and certificate renewal required by law. Contact City Gas Engineers immediately.', admin_uuid),
  (gen_random_uuid(), 'PAT testing all kitchen equipment',     site4_uuid, 'urgent', '2026-05-30', 'open',        manager4_uuid, 'Electrical',  'Full portable appliance testing of all kitchen equipment. Apex Electrical to attend on-site.', admin_uuid),
  (gen_random_uuid(), 'Book fire risk assessment',             site2_uuid, 'high',   '2026-06-20', 'in_progress', manager2_uuid, 'Fire Safety', 'Annual FRA required. FireGuard Systems booked - awaiting confirmation of date.', admin_uuid),
  (gen_random_uuid(), 'Upload renewed EICR document',          site5_uuid, 'high',   '2026-07-10', 'open',        manager5_uuid, 'Electrical',  'Upload new EICR certificate to document repository once Apex Electrical inspection complete.', admin_uuid),
  (gen_random_uuid(), 'Legionella assessment full property',   site4_uuid, 'urgent', '2026-06-15', 'open',        manager4_uuid, 'H&S',         'Mandatory water system risk assessment. HSE compliance requirement - third party assessor required.', admin_uuid),
  (gen_random_uuid(), 'Renew vehicle insurance Van XR22',      site2_uuid, 'medium', '2026-07-04', 'open',        manager2_uuid, 'Vehicle',     'Commercial fleet policy renewal with Admiral Business. Get 3 comparison quotes.', admin_uuid),
  (gen_random_uuid(), 'Update Health and Safety policy',       site2_uuid, 'medium', '2026-08-01', 'open',        manager2_uuid, 'H&S',         'Annual H&S policy review and update. Circulate to all staff for acknowledgement signature.', admin_uuid),
  (gen_random_uuid(), 'Annual supplier insurance review',      NULL,       'low',    '2026-09-01', 'open',        admin_uuid,    'Insurance',   'Collect and verify insurance certificates from all contracted suppliers for group compliance records.', admin_uuid)
ON CONFLICT (id) DO NOTHING;

-- ─── VENDORS ─────────────────────────────────────────────────
INSERT INTO public.vendors (id, name, category, contract_expiry, insurance_expiry, status, contact_name, email, phone, contract_value) VALUES
  (vendor1_uuid, 'CleanSafe Services Ltd', 'Cleaning',        '2027-03-31', '2026-09-01', 'ok',       'Mark Phillips', 'mark@cleansafe.co.uk',   '+44 20 7946 1100',  '48000/yr'),
  (vendor2_uuid, 'FireGuard Systems',      'Fire Safety',     '2026-07-15', '2026-06-30', 'warning',  'Donna Walsh',   'd.walsh@fireguard.co.uk', '+44 117 946 2200',  '12500/yr'),
  (vendor3_uuid, 'City Gas Engineers',     'Gas',             '2026-06-10', '2026-05-28', 'critical', 'Steve Nunn',    'steve@citygas.co.uk',     '+44 1225 946 330',  '6200/yr'),
  (vendor4_uuid, 'Apex Electrical',        'Electrical',      '2027-12-31', '2027-01-15', 'ok',       'Rachel Tong',   'r.tong@apexelec.co.uk',   '+44 161 946 4400',  '32000/yr'),
  (vendor5_uuid, 'Nordic Food Supply',     'Food & Beverage', '2026-10-31', '2026-10-31', 'ok',       'Lars Eriksen',  'lars@nordicfood.co.uk',   '+44 131 946 5500',  '96000/yr'),
  (vendor6_uuid, 'SecureNet CCTV',         'Security',        '2028-06-01', '2027-06-01', 'ok',       'Amir Patel',    'amir@securenet.co.uk',    '+44 20 7946 6600',  '18400/yr')
ON CONFLICT (id) DO NOTHING;

-- ─── VENDOR SITE MAPPINGS ─────────────────────────────────────
INSERT INTO public.vendor_site_mappings (vendor_id, site_id, is_all_sites) VALUES
  (vendor1_uuid, site1_uuid, false),
  (vendor1_uuid, site3_uuid, false),
  (vendor2_uuid, site2_uuid, false),
  (vendor2_uuid, site5_uuid, false),
  (vendor3_uuid, site4_uuid, false),
  (vendor4_uuid, NULL,       true),
  (vendor5_uuid, site3_uuid, false),
  (vendor5_uuid, site6_uuid, false),
  (vendor6_uuid, site1_uuid, false),
  (vendor6_uuid, site2_uuid, false)
ON CONFLICT (id) DO NOTHING;

-- ─── ALERTS ──────────────────────────────────────────────────
INSERT INTO public.alerts (id, alert_type, message, site_id, is_read, created_at) VALUES
  (gen_random_uuid(), 'critical', 'Gas Safety Record EXPIRED - The Copper Kettle',                site4_uuid, false, now() - interval '2 hours'),
  (gen_random_uuid(), 'critical', 'PAT Testing overdue - The Copper Kettle',                      site4_uuid, false, now() - interval '2 hours'),
  (gen_random_uuid(), 'critical', 'Legionella assessment overdue - The Copper Kettle',             site4_uuid, false, now() - interval '1 day'),
  (gen_random_uuid(), 'warning',  'Fire Safety Certificate expires in 22 days - Harbour View',    site2_uuid, false, now() - interval '2 days'),
  (gen_random_uuid(), 'warning',  'EICR expires in 42 days - Skyline Suites',                     site5_uuid, false, now() - interval '3 days'),
  (gen_random_uuid(), 'info',     'New document uploaded: Lease Agreement - Vault 42',            site6_uuid, true,  now() - interval '4 days')
ON CONFLICT (id) DO NOTHING;

-- ─── NOTIFICATIONS ────────────────────────────────────────────
INSERT INTO public.notifications (user_id, title, message, is_read, related_entity_type, created_at) VALUES
  (admin_uuid,    'Critical: Gas Safety Expired',      'Gas Safety Record at The Copper Kettle has expired. Immediate action required.',     false, 'compliance_item', now() - interval '2 hours'),
  (admin_uuid,    'Critical: PAT Testing Overdue',     'PAT Testing at The Copper Kettle is overdue. Schedule Apex Electrical immediately.', false, 'compliance_item', now() - interval '2 hours'),
  (manager4_uuid, 'Action Required: Gas Safety',       'Your site has an expired gas safety certificate. Contact City Gas Engineers.',       false, 'task',            now() - interval '2 hours'),
  (manager4_uuid, 'Action Required: Legionella',       'Legionella risk assessment is overdue at The Copper Kettle.',                        false, 'compliance_item', now() - interval '1 day'),
  (officer_uuid,  'Compliance Review Due',             'Monthly compliance review is due for The Copper Kettle.',                            false, 'site',            now() - interval '3 days'),
  (manager2_uuid, 'Fire Risk Assessment Reminder',     'Fire Risk Assessment at Harbour View Hotel is due in 22 days.',                      true,  'compliance_item', now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

-- ─── ACTIVITY LOGS ────────────────────────────────────────────
INSERT INTO public.activity_logs (user_id, action, entity_type, details, created_at) VALUES
  (admin_uuid,    'created',  'task',             jsonb_build_object('title', 'Renew gas safety certificate'),                  now() - interval '3 days'),
  (manager1_uuid, 'uploaded', 'document',         jsonb_build_object('name', 'Public Liability Insurance', 'site', 'The Grand Meridian'), now() - interval '5 days'),
  (manager4_uuid, 'updated',  'compliance_item',  jsonb_build_object('item', 'Gas Safety Inspection', 'status', 'critical'),    now() - interval '1 day'),
  (officer_uuid,  'reviewed', 'compliance_item',  jsonb_build_object('item', 'Food Hygiene Inspection', 'site', 'Brasserie Lumiere'), now() - interval '7 days'),
  (admin_uuid,    'created',  'alert',            jsonb_build_object('message', 'Gas Safety Record EXPIRED'),                   now() - interval '2 hours')
ON CONFLICT (id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Seed data error: %', SQLERRM;
END $$;
