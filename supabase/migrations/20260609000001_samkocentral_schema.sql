-- ============================================================
-- SamkoCentral: Complete Schema Migration
-- Entities: user_profiles, roles, permissions, sites, documents,
--   document_categories, tasks, compliance_items, vendors,
--   vendor_site_mappings, alerts, notifications, activity_logs
-- ============================================================

-- ─── 1. ENUMS ────────────────────────────────────────────────
DROP TYPE IF EXISTS public.user_role CASCADE;
CREATE TYPE public.user_role AS ENUM ('group_admin', 'site_manager', 'compliance_officer', 'read_only');

DROP TYPE IF EXISTS public.site_status CASCADE;
CREATE TYPE public.site_status AS ENUM ('operational', 'maintenance', 'at_risk');

DROP TYPE IF EXISTS public.risk_level CASCADE;
CREATE TYPE public.risk_level AS ENUM ('low', 'medium', 'high');

DROP TYPE IF EXISTS public.doc_status CASCADE;
CREATE TYPE public.doc_status AS ENUM ('ok', 'warning', 'critical');

DROP TYPE IF EXISTS public.task_priority CASCADE;
CREATE TYPE public.task_priority AS ENUM ('urgent', 'high', 'medium', 'low');

DROP TYPE IF EXISTS public.task_status CASCADE;
CREATE TYPE public.task_status AS ENUM ('open', 'in_progress', 'completed');

DROP TYPE IF EXISTS public.alert_type CASCADE;
CREATE TYPE public.alert_type AS ENUM ('critical', 'warning', 'info');

DROP TYPE IF EXISTS public.vendor_status CASCADE;
CREATE TYPE public.vendor_status AS ENUM ('ok', 'warning', 'critical');

-- ─── 2. CORE TABLES ──────────────────────────────────────────

-- user_profiles (intermediary for auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  role public.user_role NOT NULL DEFAULT 'read_only',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- sites
CREATE TABLE IF NOT EXISTS public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  site_type TEXT NOT NULL DEFAULT 'Hotel',
  city TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  manager_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  status public.site_status NOT NULL DEFAULT 'operational',
  risk public.risk_level NOT NULL DEFAULT 'low',
  open_issues INTEGER NOT NULL DEFAULT 0,
  compliance_score INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- document_categories
CREATE TABLE IF NOT EXISTS public.document_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- documents
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.document_categories(id) ON DELETE SET NULL,
  expiry_date DATE,
  status public.doc_status NOT NULL DEFAULT 'ok',
  file_size TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  version TEXT NOT NULL DEFAULT 'v1.0',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- compliance_items
CREATE TABLE IF NOT EXISTS public.compliance_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item TEXT NOT NULL,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT '',
  due_date DATE,
  status public.doc_status NOT NULL DEFAULT 'ok',
  assignee_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  last_reviewed DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  priority public.task_priority NOT NULL DEFAULT 'medium',
  due_date DATE,
  status public.task_status NOT NULL DEFAULT 'open',
  assignee_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  category TEXT NOT NULL DEFAULT '',
  description TEXT,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- vendors
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  contract_expiry DATE,
  insurance_expiry DATE,
  status public.vendor_status NOT NULL DEFAULT 'ok',
  contact_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  contract_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- vendor_site_mappings (junction)
CREATE TABLE IF NOT EXISTS public.vendor_site_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  is_all_sites BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- alerts
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type public.alert_type NOT NULL DEFAULT 'info',
  message TEXT NOT NULL,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  related_entity_type TEXT,
  related_entity_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- activity_logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 3. INDEXES ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_sites_status ON public.sites(status);
CREATE INDEX IF NOT EXISTS idx_sites_risk ON public.sites(risk);
CREATE INDEX IF NOT EXISTS idx_documents_site_id ON public.documents(site_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_expiry ON public.documents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_compliance_site_id ON public.compliance_items(site_id);
CREATE INDEX IF NOT EXISTS idx_compliance_status ON public.compliance_items(status);
CREATE INDEX IF NOT EXISTS idx_tasks_site_id ON public.tasks(site_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON public.alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_alerts_site_id ON public.alerts(site_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_site_vendor ON public.vendor_site_mappings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_site_site ON public.vendor_site_mappings(site_id);

-- ─── 4. FUNCTIONS ────────────────────────────────────────────

-- Auto-create user_profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'read_only')::public.user_role,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Check if user is admin or compliance officer (for non-user tables)
CREATE OR REPLACE FUNCTION public.is_admin_or_compliance()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM public.user_profiles
  WHERE id = auth.uid()
  AND role IN ('group_admin', 'compliance_officer')
)
$$;

-- Check if user is group_admin
CREATE OR REPLACE FUNCTION public.is_group_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM public.user_profiles
  WHERE id = auth.uid()
  AND role = 'group_admin'
)
$$;

-- ─── 5. ENABLE RLS ───────────────────────────────────────────
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_site_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ─── 6. RLS POLICIES ─────────────────────────────────────────

-- user_profiles: own row only (no function to avoid recursion)
DROP POLICY IF EXISTS "users_manage_own_profile" ON public.user_profiles;
CREATE POLICY "users_manage_own_profile"
ON public.user_profiles FOR ALL TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "authenticated_read_profiles" ON public.user_profiles;
CREATE POLICY "authenticated_read_profiles"
ON public.user_profiles FOR SELECT TO authenticated
USING (true);

-- sites: all authenticated users can read; admins can write
DROP POLICY IF EXISTS "authenticated_read_sites" ON public.sites;
CREATE POLICY "authenticated_read_sites"
ON public.sites FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_sites" ON public.sites;
CREATE POLICY "admin_write_sites"
ON public.sites FOR ALL TO authenticated
USING (public.is_group_admin()) WITH CHECK (public.is_group_admin());

-- document_categories: all read, admin write
DROP POLICY IF EXISTS "authenticated_read_doc_categories" ON public.document_categories;
CREATE POLICY "authenticated_read_doc_categories"
ON public.document_categories FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_doc_categories" ON public.document_categories;
CREATE POLICY "admin_write_doc_categories"
ON public.document_categories FOR ALL TO authenticated
USING (public.is_group_admin()) WITH CHECK (public.is_group_admin());

-- documents: all read, admin/compliance write
DROP POLICY IF EXISTS "authenticated_read_documents" ON public.documents;
CREATE POLICY "authenticated_read_documents"
ON public.documents FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_compliance_write_documents" ON public.documents;
CREATE POLICY "admin_compliance_write_documents"
ON public.documents FOR ALL TO authenticated
USING (public.is_admin_or_compliance()) WITH CHECK (public.is_admin_or_compliance());

-- compliance_items: all read, admin/compliance write
DROP POLICY IF EXISTS "authenticated_read_compliance" ON public.compliance_items;
CREATE POLICY "authenticated_read_compliance"
ON public.compliance_items FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_compliance_write_compliance" ON public.compliance_items;
CREATE POLICY "admin_compliance_write_compliance"
ON public.compliance_items FOR ALL TO authenticated
USING (public.is_admin_or_compliance()) WITH CHECK (public.is_admin_or_compliance());

-- tasks: all read, authenticated write
DROP POLICY IF EXISTS "authenticated_read_tasks" ON public.tasks;
CREATE POLICY "authenticated_read_tasks"
ON public.tasks FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_write_tasks" ON public.tasks;
CREATE POLICY "authenticated_write_tasks"
ON public.tasks FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- vendors: all read, admin write
DROP POLICY IF EXISTS "authenticated_read_vendors" ON public.vendors;
CREATE POLICY "authenticated_read_vendors"
ON public.vendors FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_vendors" ON public.vendors;
CREATE POLICY "admin_write_vendors"
ON public.vendors FOR ALL TO authenticated
USING (public.is_group_admin()) WITH CHECK (public.is_group_admin());

-- vendor_site_mappings: all read, admin write
DROP POLICY IF EXISTS "authenticated_read_vsm" ON public.vendor_site_mappings;
CREATE POLICY "authenticated_read_vsm"
ON public.vendor_site_mappings FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_vsm" ON public.vendor_site_mappings;
CREATE POLICY "admin_write_vsm"
ON public.vendor_site_mappings FOR ALL TO authenticated
USING (public.is_group_admin()) WITH CHECK (public.is_group_admin());

-- alerts: all read, admin write
DROP POLICY IF EXISTS "authenticated_read_alerts" ON public.alerts;
CREATE POLICY "authenticated_read_alerts"
ON public.alerts FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_alerts" ON public.alerts;
CREATE POLICY "admin_write_alerts"
ON public.alerts FOR ALL TO authenticated
USING (public.is_group_admin()) WITH CHECK (public.is_group_admin());

-- notifications: own only
DROP POLICY IF EXISTS "users_own_notifications" ON public.notifications;
CREATE POLICY "users_own_notifications"
ON public.notifications FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- activity_logs: all read, authenticated insert
DROP POLICY IF EXISTS "authenticated_read_activity" ON public.activity_logs;
CREATE POLICY "authenticated_read_activity"
ON public.activity_logs FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_insert_activity" ON public.activity_logs;
CREATE POLICY "authenticated_insert_activity"
ON public.activity_logs FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- ─── 7. TRIGGERS ─────────────────────────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_sites_updated_at ON public.sites;
CREATE TRIGGER set_sites_updated_at
  BEFORE UPDATE ON public.sites
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_documents_updated_at ON public.documents;
CREATE TRIGGER set_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_compliance_updated_at ON public.compliance_items;
CREATE TRIGGER set_compliance_updated_at
  BEFORE UPDATE ON public.compliance_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_tasks_updated_at ON public.tasks;
CREATE TRIGGER set_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_vendors_updated_at ON public.vendors;
CREATE TRIGGER set_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
