'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, ShieldAlert, ShieldCheck, Clock } from 'lucide-react';
import { complianceService } from '@/lib/services/dataService';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface ComplianceItem {
  id: string;
  item: string;
  site: string;
  category: string;
  dueDate: string;
  status: 'ok' | 'warning' | 'critical';
  assignee: string;
  lastReviewed: string;
  notes: string;
}

function daysUntil(dateStr: string): number {
  if (!dateStr) return 999;
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDateGB(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' });
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

export default function ComplianceTrackerClient() {
  const [statusFilter, setStatusFilter] = useState<'All' | 'critical' | 'warning' | 'ok'>('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [siteFilter, setSiteFilter] = useState('All Sites');
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = () => {
    complianceService.getAll().then((data) => {
      setItems(data as ComplianceItem[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    loadItems();
    const supabase = createClient();
    const channel = supabase
      .channel('compliance_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'compliance_items' }, loadItems)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const CATEGORIES_LIST = useMemo(() => ['All', ...Array.from(new Set(items.map((c) => c.category))).sort()], [items]);
  const SITES_LIST = useMemo(() => ['All Sites', ...Array.from(new Set(items.map((c) => c.site))).sort()], [items]);

  const critCount = items.filter((c) => c.status === 'critical').length;
  const warnCount = items.filter((c) => c.status === 'warning').length;
  const okCount = items.filter((c) => c.status === 'ok').length;

  const filtered = useMemo(() => {
    let list = [...items];
    if (statusFilter !== 'All') list = list.filter((c) => c.status === statusFilter);
    if (categoryFilter !== 'All') list = list.filter((c) => c.category === categoryFilter);
    if (siteFilter !== 'All Sites') list = list.filter((c) => c.site === siteFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.item.toLowerCase().includes(q) ||
        c.site.toLowerCase().includes(q) ||
        c.assignee.toLowerCase().includes(q)
      );
    }
    const order = { critical: 0, warning: 1, ok: 2 };
    list.sort((a, b) => {
      const oDiff = order[a.status] - order[b.status];
      if (oDiff !== 0) return oDiff;
      return daysUntil(a.dueDate) - daysUntil(b.dueDate);
    });
    return list;
  }, [items, statusFilter, categoryFilter, siteFilter, search]);

  const trafficLight = (status: string) => {
    if (status === 'critical') return { emoji: '🔴', label: 'Overdue', color: 'var(--critical)' };
    if (status === 'warning') return { emoji: '🟡', label: 'Due Soon', color: 'var(--warning)' };
    return { emoji: '🟢', label: 'Compliant', color: 'var(--ok)' };
  };

  const handleMarkReviewed = async (item: ComplianceItem) => {
    try {
      await complianceService.updateStatus(item.id, item.status);
      toast.success('Marked as reviewed', { description: item.item });
      loadItems();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <>
      {/* Traffic-light KPI summary */}
      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { id: 'tl-critical', label: 'Overdue / Expired', val: critCount, emoji: '🔴', color: 'var(--critical)', bg: 'var(--critical-bg)', top: 'var(--critical)', icon: <ShieldAlert size={18} />, sub: 'Immediate regulatory risk', filter: 'critical' as const },
          { id: 'tl-warning', label: 'Due Within 60 Days', val: warnCount, emoji: '🟡', color: 'var(--warning)', bg: 'var(--warning-bg)', top: 'var(--warning)', icon: <Clock size={18} />, sub: 'Action required soon', filter: 'warning' as const },
          { id: 'tl-ok', label: 'Compliant', val: okCount, emoji: '🟢', color: 'var(--ok)', bg: 'var(--ok-bg)', top: 'var(--ok)', icon: <ShieldCheck size={18} />, sub: 'No action required', filter: 'ok' as const },
        ].map((kpi) => (
          <div
            key={kpi.id}
            className="samko-card cursor-pointer transition-all duration-150"
            style={{ padding: '18px 20px', borderTop: `3px solid ${kpi.top}`, outline: statusFilter === kpi.filter ? `2px solid ${kpi.color}` : 'none' }}
            onClick={() => setStatusFilter(statusFilter === kpi.filter ? 'All' : kpi.filter)}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = kpi.color; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center justify-center rounded-lg" style={{ width: 34, height: 34, background: kpi.bg, color: kpi.color }}>{kpi.icon}</div>
              <span style={{ fontSize: 22 }}>{kpi.emoji}</span>
            </div>
            <div className="font-head tabular-nums" style={{ fontSize: 36, fontWeight: 800, color: kpi.color, lineHeight: 1, marginBottom: 4 }}>
              {loading ? '—' : kpi.val}
            </div>
            <div className="font-head text-foreground" style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{kpi.label}</div>
            <div className="text-muted-foreground" style={{ fontSize: 11 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Category breakdown strip */}
      <div className="samko-card mb-5" style={{ padding: '14px 18px' }}>
        <div className="font-head text-muted-foreground mb-3" style={{ fontSize: 10, letterSpacing: '1.2px', textTransform: 'uppercase' }}>
          Compliance health by category
        </div>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES_LIST.filter((c) => c !== 'All').map((cat) => {
            const catItems = items.filter((c) => c.category === cat);
            const hasCrit = catItems.some((c) => c.status === 'critical');
            const hasWarn = catItems.some((c) => c.status === 'warning');
            const emoji = hasCrit ? '🔴' : hasWarn ? '🟡' : '🟢';
            return (
              <div
                key={`cat-health-${cat}`}
                className="flex items-center gap-2 rounded-lg cursor-pointer transition-all duration-150"
                style={{ padding: '6px 12px', background: categoryFilter === cat ? 'rgba(232,201,122,0.10)' : 'var(--surface2)', border: `1px solid ${categoryFilter === cat ? 'var(--primary)' : 'var(--border)'}` }}
                onClick={() => setCategoryFilter(categoryFilter === cat ? 'All' : cat)}
              >
                <span style={{ fontSize: 12 }}>{emoji}</span>
                <span className="text-foreground" style={{ fontSize: 12, fontWeight: 500 }}>{cat}</span>
                <span className="font-head tabular-nums" style={{ fontSize: 11, color: 'var(--text3)' }}>{catItems.length}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search + site filter */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 rounded-lg" style={{ background: 'var(--surface2)', border: '1px solid var(--border-strong)', padding: '8px 14px', minWidth: 260 }}>
          <Search size={14} style={{ color: 'var(--text3)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search compliance items, assignees…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--foreground)', fontSize: 13, flex: 1, fontFamily: 'var(--font-sans)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: 0 }}>
              <X size={13} />
            </button>
          )}
        </div>
        <select
          value={siteFilter}
          onChange={(e) => setSiteFilter(e.target.value)}
          style={{ background: 'var(--surface2)', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--foreground)', fontFamily: 'var(--font-sans)', cursor: 'pointer', outline: 'none' }}
        >
          {SITES_LIST.map((s) => <option key={`comp-site-${s}`} value={s}>{s}</option>)}
        </select>
        <p className="text-muted-foreground ml-auto" style={{ fontSize: 12 }}>
          <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{filtered.length}</span> of {items.length} items
        </p>
      </div>

      {/* Compliance table */}
      <div className="samko-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="flex items-center justify-center" style={{ padding: 40 }}>
            <div className="text-muted-foreground" style={{ fontSize: 13 }}>Loading compliance items…</div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck size={22} />}
            title="No compliance items match your filters"
            description="Adjust your status, category, or site filters to find the compliance obligation you are looking for."
            action={
              <button onClick={() => { setStatusFilter('All'); setCategoryFilter('All'); setSiteFilter('All Sites'); setSearch(''); }} className="samko-btn-ghost">
                Clear all filters
              </button>
            }
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Status', 'Compliance Item', 'Site', 'Category', 'Due Date', 'Days Left', 'Assignee', 'Last Reviewed'].map((h) => (
                    <th key={`comp-th-${h}`} className="table-header-cell">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const days = daysUntil(item.dueDate);
                  const tl = trafficLight(item.status);
                  const isExpanded = expandedRow === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      <tr className="table-row-hover" style={{ cursor: 'pointer' }} onClick={() => setExpandedRow(isExpanded ? null : item.id)}>
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: 14 }}>{tl.emoji}</span>
                            <StatusBadge variant={item.status} label={tl.label} showDot={false} />
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className="text-foreground font-medium" style={{ fontSize: 13 }}>{item.item}</span>
                        </td>
                        <td className="table-cell text-muted2" style={{ fontSize: 12 }}>{item.site}</td>
                        <td className="table-cell">
                          <span className="rounded" style={{ background: 'var(--surface3)', color: 'var(--text2)', fontSize: 10, fontWeight: 600, padding: '2px 8px', display: 'inline-block' }}>
                            {item.category}
                          </span>
                        </td>
                        <td className="table-cell text-muted2" style={{ fontSize: 12 }}>{formatDateGB(item.dueDate)}</td>
                        <td className="table-cell">
                          <span className="font-head tabular-nums" style={{ fontSize: 13, fontWeight: 700, color: days < 0 ? 'var(--critical)' : days < 60 ? 'var(--warning)' : 'var(--text2)' }}>
                            {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 22, height: 22, background: 'var(--surface3)', color: 'var(--text2)', fontSize: 9, fontWeight: 700 }}>
                              {item.assignee.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <span className="text-muted2" style={{ fontSize: 12 }}>{item.assignee}</span>
                          </div>
                        </td>
                        <td className="table-cell text-muted3" style={{ fontSize: 11 }}>{formatDateGB(item.lastReviewed)}</td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${item.id}-expanded`}>
                          <td colSpan={8} style={{ padding: '12px 20px 14px', background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-head text-muted-foreground" style={{ fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Notes</p>
                                <p className="text-foreground" style={{ fontSize: 13, lineHeight: 1.5 }}>{item.notes}</p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  className="samko-btn-ghost"
                                  style={{ padding: '6px 14px', fontSize: 12 }}
                                  onClick={(e) => { e.stopPropagation(); toast.success('Task created', { description: `Follow-up task for ${item.item}` }); }}
                                >
                                  Create Task
                                </button>
                                <button
                                  className="samko-btn-primary"
                                  style={{ padding: '6px 14px', fontSize: 12 }}
                                  onClick={(e) => { e.stopPropagation(); handleMarkReviewed(item); }}
                                >
                                  Mark Reviewed
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary footer */}
      <div className="flex items-center justify-between mt-4 rounded-xl" style={{ padding: '12px 18px', background: 'var(--surface2)', border: '1px solid var(--border)' }}>
        <p className="text-muted-foreground" style={{ fontSize: 12 }}>
          Group compliance rate:{' '}
          <span className="font-head tabular-nums" style={{ color: 'var(--warning)', fontWeight: 700, fontSize: 14 }}>
            {items.length > 0 ? Math.round((okCount / items.length) * 100) : 0}%
          </span>{' '}
          ({okCount}/{items.length} items compliant)
        </p>
        <p className="text-muted-foreground" style={{ fontSize: 11 }}>Live data from Supabase</p>
      </div>
    </>
  );
}