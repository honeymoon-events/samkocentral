'use client';

import { createClient } from '@/lib/supabase/client';

function isSchemaError(error: any): boolean {
  if (!error) return false;
  if (error.code && typeof error.code === 'string') {
    const errorClass = error.code.substring(0, 2);
    if (errorClass === '42') return true;
    if (errorClass === '23') return false;
    if (errorClass === '08') return true;
  }
  if (error.message) {
    const schemaErrorPatterns = [
      /relation.*does not exist/i,
      /column.*does not exist/i,
      /function.*does not exist/i,
      /syntax error/i,
      /type.*does not exist/i,
    ];
    return schemaErrorPatterns.some((p) => p.test(error.message));
  }
  return false;
}

// ─── SITES ───────────────────────────────────────────────────
export const siteService = {
  async getAll() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('name', { ascending: true });
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return (data || []).map((s) => ({
      id: s.id,
      name: s.name,
      type: s.site_type as 'Hotel' | 'Restaurant',
      city: s.city,
      address: s.address,
      manager: s.manager_name,
      phone: s.phone,
      status: s.status as 'operational' | 'maintenance' | 'at_risk',
      risk: s.risk as 'low' | 'medium' | 'high',
      openIssues: s.open_issues,
      compliance: s.compliance_score,
    }));
  },

  async update(id: string, updates: Partial<{ status: string; risk: string; openIssues: number; compliance: number }>) {
    const supabase = createClient();
    const dbUpdates: any = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.risk !== undefined) dbUpdates.risk = updates.risk;
    if (updates.openIssues !== undefined) dbUpdates.open_issues = updates.openIssues;
    if (updates.compliance !== undefined) dbUpdates.compliance_score = updates.compliance;
    const { error } = await supabase.from('sites').update(dbUpdates).eq('id', id);
    if (error && isSchemaError(error)) throw error;
  },
};

// ─── DOCUMENTS ───────────────────────────────────────────────
export const documentService = {
  async getAll() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .select(`*, sites(name), document_categories(name), uploader:user_profiles!documents_uploaded_by_fkey(full_name)`)
      .order('expiry_date', { ascending: true });
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return (data || []).map((d) => ({
      id: d.id,
      name: d.name,
      site: (d.sites as any)?.name || '',
      siteId: d.site_id,
      category: (d.document_categories as any)?.name || '',
      categoryId: d.category_id,
      expiry: d.expiry_date || '',
      status: d.status as 'ok' | 'warning' | 'critical',
      size: d.file_size || '',
      uploaded: d.uploaded_at ? d.uploaded_at.split('T')[0] : '',
      uploadedBy: (d.uploader as any)?.full_name || '',
      version: d.version,
      notes: d.notes || '',
    }));
  },

  async create(doc: {
    name: string;
    siteId: string;
    categoryId?: string;
    expiryDate?: string;
    version?: string;
    notes?: string;
    uploadedBy?: string;
  }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('documents')
      .insert({
        name: doc.name,
        site_id: doc.siteId,
        category_id: doc.categoryId || null,
        expiry_date: doc.expiryDate || null,
        version: doc.version || 'v1.0',
        notes: doc.notes || null,
        uploaded_by: user.id,
        status: 'ok',
      })
      .select()
      .single();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return data;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error && isSchemaError(error)) throw error;
  },
};

// ─── COMPLIANCE ───────────────────────────────────────────────
export const complianceService = {
  async getAll() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('compliance_items')
      .select(`*, sites(name), assignee:user_profiles!compliance_items_assignee_id_fkey(full_name)`)
      .order('due_date', { ascending: true });
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return (data || []).map((c) => ({
      id: c.id,
      item: c.item,
      site: (c.sites as any)?.name || '',
      siteId: c.site_id,
      category: c.category,
      dueDate: c.due_date || '',
      status: c.status as 'ok' | 'warning' | 'critical',
      assignee: (c.assignee as any)?.full_name || '',
      assigneeId: c.assignee_id,
      lastReviewed: c.last_reviewed || '',
      notes: c.notes || '',
    }));
  },

  async updateStatus(id: string, status: 'ok' | 'warning' | 'critical') {
    const supabase = createClient();
    const { error } = await supabase
      .from('compliance_items')
      .update({ status, last_reviewed: new Date().toISOString().split('T')[0] })
      .eq('id', id);
    if (error && isSchemaError(error)) throw error;
  },
};

// ─── TASKS ────────────────────────────────────────────────────
export const taskService = {
  async getAll() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tasks')
      .select(`*, sites(name), assignee:user_profiles!tasks_assignee_id_fkey(full_name)`)
      .order('due_date', { ascending: true });
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return (data || []).map((t) => ({
      id: t.id,
      title: t.title,
      site: (t.sites as any)?.name || 'All Sites',
      siteId: t.site_id,
      priority: t.priority as 'urgent' | 'high' | 'medium' | 'low',
      due: t.due_date || '',
      status: t.status.replace('_', '-') as 'open' | 'in-progress' | 'completed',
      assignee: (t.assignee as any)?.full_name || '',
      assigneeId: t.assignee_id,
      category: t.category,
      description: t.description || '',
    }));
  },

  async create(task: {
    title: string;
    siteId?: string;
    priority: string;
    dueDate?: string;
    assigneeId?: string;
    category: string;
    description?: string;
  }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        site_id: task.siteId || null,
        priority: task.priority,
        due_date: task.dueDate || null,
        assignee_id: task.assigneeId || null,
        category: task.category,
        description: task.description || null,
        status: 'open',
        created_by: user.id,
      })
      .select()
      .single();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return data;
  },

  async updateStatus(id: string, status: 'open' | 'in-progress' | 'completed') {
    const supabase = createClient();
    const dbStatus = status.replace('-', '_');
    const { error } = await supabase
      .from('tasks')
      .update({ status: dbStatus })
      .eq('id', id);
    if (error && isSchemaError(error)) throw error;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error && isSchemaError(error)) throw error;
  },
};

// ─── ALERTS ───────────────────────────────────────────────────
export const alertService = {
  async getAll() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('alerts')
      .select(`*, sites(name)`)
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return (data || []).map((a) => ({
      id: a.id,
      type: a.alert_type as 'critical' | 'warning' | 'info',
      message: a.message,
      site: (a.sites as any)?.name || '',
      siteId: a.site_id,
      isRead: a.is_read,
      time: a.created_at,
    }));
  },

  async markRead(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('alerts').update({ is_read: true }).eq('id', id);
    if (error && isSchemaError(error)) throw error;
  },
};

// ─── VENDORS ──────────────────────────────────────────────────
export const vendorService = {
  async getAll() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('vendors')
      .select(`*, vendor_site_mappings(site_id, is_all_sites, sites(name))`)
      .order('name', { ascending: true });
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return (data || []).map((v) => {
      const mappings = (v.vendor_site_mappings as any[]) || [];
      const isAllSites = mappings.some((m) => m.is_all_sites);
      const siteNames = isAllSites
        ? ['All Sites']
        : mappings.map((m) => m.sites?.name).filter(Boolean);
      return {
        id: v.id,
        name: v.name,
        category: v.category,
        sites: siteNames,
        contractExpiry: v.contract_expiry || '',
        insuranceExpiry: v.insurance_expiry || '',
        status: v.status as 'ok' | 'warning' | 'critical',
        contact: v.contact_name,
        email: v.email || '',
        phone: v.phone || '',
        value: v.contract_value ? `£${v.contract_value}` : '',
      };
    });
  },
};

// ─── DASHBOARD STATS ──────────────────────────────────────────
export const dashboardService = {
  async getStats() {
    const supabase = createClient();
    const [sitesRes, docsRes, complianceRes, tasksRes, vendorsRes] = await Promise.all([
      supabase.from('sites').select('compliance_score, risk, status'),
      supabase.from('documents').select('status'),
      supabase.from('compliance_items').select('status'),
      supabase.from('tasks').select('status, priority'),
      supabase.from('vendors').select('status'),
    ]);

    const sites = sitesRes.data || [];
    const docs = docsRes.data || [];
    const compliance = complianceRes.data || [];
    const tasks = tasksRes.data || [];
    const vendors = vendorsRes.data || [];

    const criticalAlerts =
      docs.filter((d) => d.status === 'critical').length +
      compliance.filter((c) => c.status === 'critical').length;
    const expiringSoon = docs.filter((d) => d.status === 'warning').length;
    const openTasks = tasks.filter((t) => t.status === 'open').length;
    const avgCompliance =
      sites.length > 0
        ? Math.round(sites.reduce((a: number, s: any) => a + (s.compliance_score || 0), 0) / sites.length)
        : 0;
    const highRiskSites = sites.filter((s: any) => s.risk === 'high').length;
    const vendorAlerts = vendors.filter((v: any) => v.status !== 'ok').length;

    return {
      criticalAlerts,
      expiringSoon,
      openTasks,
      avgCompliance,
      highRiskSites,
      vendorAlerts,
    };
  },
};

// ─── USER PROFILES ────────────────────────────────────────────
export const userService = {
  async getAll() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, full_name, email, role')
      .order('full_name', { ascending: true });
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return data || [];
  },
};
