'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Building2, AlertTriangle, CheckCircle,  } from 'lucide-react';
import { siteService, complianceService, taskService, alertService } from '@/lib/services/dataService';
import StatusBadge from '@/components/ui/StatusBadge';
import ComplianceRing from '@/components/ui/ComplianceRing';

interface SiteData {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  manager: string;
  phone: string;
  status: string;
  risk: string;
  openIssues: number;
  compliance: number;
}

interface ComplianceItem {
  id: string;
  item: string;
  site: string;
  category: string;
  dueDate: string;
  status: 'ok' | 'warning' | 'critical';
  assignee: string;
  notes: string;
}

interface TaskItem {
  id: string;
  title: string;
  site: string;
  priority: string;
  due: string;
  status: string;
  assignee: string;
  category: string;
}

interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  site: string;
  isRead: boolean;
  time: string;
}

interface SiteDetailsClientProps {
  siteId: string;
}

const statCard = (label: string, value: string | number, color: string, sub?: string) => (
  <div className="samko-card" style={{ padding: '16px 18px' }}>
    <div className="text-muted-foreground font-head" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
      {label}
    </div>
    <div className="font-head tabular-nums" style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1, marginBottom: 4 }}>
      {value}
    </div>
    {sub && <div className="text-muted-foreground" style={{ fontSize: 11 }}>{sub}</div>}
  </div>
);

export default function SiteDetailsClient({ siteId }: SiteDetailsClientProps) {
  const [site, setSite] = useState<SiteData | null>(null);
  const [compliance, setCompliance] = useState<ComplianceItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'compliance' | 'tasks' | 'alerts'>('overview');

  useEffect(() => {
    Promise.all([
      siteService.getAll(),
      complianceService.getAll(),
      taskService.getAll(),
      alertService.getAll(),
    ]).then(([sites, comp, tsk, alrt]) => {
      const found = (sites as SiteData[]).find((s) => s.id === siteId) || null;
      setSite(found);
      if (found) {
        setCompliance((comp as ComplianceItem[]).filter((c) => c.site === found.name));
        setTasks((tsk as TaskItem[]).filter((t) => t.site === found.name || t.site === 'All Sites'));
        setAlerts((alrt as AlertItem[]).filter((a) => a.site === found.name));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [siteId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ padding: 60 }}>
        <div className="text-muted-foreground" style={{ fontSize: 14 }}>Loading site details…</div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex flex-col items-center justify-center gap-4" style={{ padding: 60 }}>
        <Building2 size={40} style={{ color: 'var(--text3)' }} />
        <div className="text-muted-foreground" style={{ fontSize: 14 }}>Site not found.</div>
        <Link href="/multi-site-operations" style={{ color: 'var(--primary)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={14} /> Back to Multi-Site Operations
        </Link>
      </div>
    );
  }

  const criticalComp = compliance.filter((c) => c.status === 'critical').length;
  const warningComp = compliance.filter((c) => c.status === 'warning').length;
  const okComp = compliance.filter((c) => c.status === 'ok').length;
  const openTasks = tasks.filter((t) => t.status === 'open').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' || t.priority === 'high').length;
  const unreadAlerts = alerts.filter((a) => !a.isRead).length;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'compliance', label: `Compliance (${compliance.length})` },
    { id: 'tasks', label: `Tasks (${tasks.length})` },
    { id: 'alerts', label: `Alerts (${alerts.length})` },
  ] as const;

  const tabStyle = (id: typeof activeTab): React.CSSProperties => ({
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: activeTab === id ? 700 : 500,
    color: activeTab === id ? 'var(--primary)' : 'var(--text2)',
    background: activeTab === id ? 'rgba(232,201,122,0.12)' : 'transparent',
    border: 'none',
    borderBottom: activeTab === id ? '2px solid var(--primary)' : '2px solid transparent',
    cursor: 'pointer',
    borderRadius: '6px 6px 0 0',
    transition: 'all 0.15s',
  });

  return (
    <div>
      {/* Back link */}
      <Link
        href="/multi-site-operations"
        className="inline-flex items-center gap-2 mb-5"
        style={{ color: 'var(--text2)', fontSize: 13, textDecoration: 'none' }}
      >
        <ArrowLeft size={14} />
        Back to Multi-Site Operations
      </Link>

      {/* Site header card */}
      <div className="samko-card mb-5" style={{ padding: '22px 24px' }}>
        <div className="flex items-start gap-6">
          {/* Icon */}
          <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 56, height: 56, background: 'rgba(232,201,122,0.12)', color: 'var(--primary)' }}>
            <Building2 size={26} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="font-head text-foreground" style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>
                {site.name}
              </h1>
              <StatusBadge
                variant={site.status === 'operational' ? 'ok' : 'maintenance'}
                label={site.status === 'operational' ? 'Operational' : 'Maintenance'}
                size="sm"
              />
              <span className="rounded" style={{ background: 'var(--surface3)', color: 'var(--text3)', fontSize: 10, fontWeight: 600, padding: '3px 8px' }}>
                {site.type}
              </span>
            </div>
            <div className="flex items-center gap-4 flex-wrap" style={{ marginTop: 6 }}>
              <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: 12 }}>
                <MapPin size={12} /> {site.address}, {site.city}
              </span>
              {site.phone && (
                <a href={`tel:${site.phone}`} className="flex items-center gap-1" style={{ color: 'var(--text2)', fontSize: 12, textDecoration: 'none' }}>
                  <Phone size={12} /> {site.phone}
                </a>
              )}
            </div>
          </div>

          {/* Compliance ring */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <ComplianceRing value={site.compliance} size={72} />
            <span className="text-muted-foreground" style={{ fontSize: 10 }}>Compliance Score</span>
          </div>
        </div>

        {/* Manager row */}
        <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(232,201,122,0.12)', color: 'var(--primary)', fontSize: 11, fontWeight: 800 }}>
            {site.manager.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="text-foreground font-medium" style={{ fontSize: 13 }}>{site.manager}</div>
            <div className="text-muted-foreground" style={{ fontSize: 11 }}>Site Manager</div>
          </div>
          <StatusBadge
            variant={site.risk === 'high' ? 'critical' : site.risk === 'medium' ? 'warning' : 'ok'}
            label={`${site.risk?.charAt(0).toUpperCase()}${site.risk?.slice(1)} Risk`}
            size="sm"
          />
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {statCard('Open Issues', site.openIssues, site.openIssues > 5 ? 'var(--critical)' : site.openIssues > 2 ? 'var(--warning)' : 'var(--ok)', 'Unresolved items')}
        {statCard('Critical Compliance', criticalComp, criticalComp > 0 ? 'var(--critical)' : 'var(--ok)', 'Overdue obligations')}
        {statCard('Open Tasks', openTasks, openTasks > 5 ? 'var(--warning)' : 'var(--ok)', `${inProgressTasks} in progress`)}
        {statCard('Unread Alerts', unreadAlerts, unreadAlerts > 0 ? 'var(--warning)' : 'var(--ok)', `${alerts.length} total alerts`)}
      </div>

      {/* Tabs */}
      <div className="samko-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="flex" style={{ borderBottom: '1px solid var(--border)', padding: '0 16px' }}>
          {tabs.map((tab) => (
            <button key={tab.id} style={tabStyle(tab.id)} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px 24px' }}>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {/* Compliance breakdown */}
              <div>
                <div className="font-head text-muted-foreground mb-3" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Compliance Breakdown
                </div>
                {compliance.length === 0 ? (
                  <div className="text-muted-foreground" style={{ fontSize: 13 }}>No compliance items for this site.</div>
                ) : (
                  <>
                    <div className="flex rounded-full overflow-hidden mb-3" style={{ height: 8 }}>
                      {criticalComp > 0 && <div style={{ flex: criticalComp, background: 'var(--critical)' }} />}
                      {warningComp > 0 && <div style={{ flex: warningComp, background: 'var(--warning)' }} />}
                      {okComp > 0 && <div style={{ flex: okComp, background: 'var(--ok)' }} />}
                    </div>
                    <div className="flex gap-4">
                      <span style={{ fontSize: 12, color: 'var(--critical)' }}>🔴 {criticalComp} Critical</span>
                      <span style={{ fontSize: 12, color: 'var(--warning)' }}>🟡 {warningComp} Warning</span>
                      <span style={{ fontSize: 12, color: 'var(--ok)' }}>🟢 {okComp} OK</span>
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      {compliance.filter((c) => c.status !== 'ok').slice(0, 4).map((c) => (
                        <div key={c.id} className="flex items-center gap-3 rounded-lg" style={{ background: 'var(--surface2)', padding: '10px 12px' }}>
                          <span className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, background: c.status === 'critical' ? 'var(--critical)' : 'var(--warning)', display: 'block' }} />
                          <div className="flex-1 min-w-0">
                            <div className="text-foreground truncate" style={{ fontSize: 12, fontWeight: 500 }}>{c.item}</div>
                            <div className="text-muted-foreground" style={{ fontSize: 10 }}>{c.category} · Due {c.dueDate}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Recent tasks */}
              <div>
                <div className="font-head text-muted-foreground mb-3" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Recent Tasks
                </div>
                {tasks.length === 0 ? (
                  <div className="text-muted-foreground" style={{ fontSize: 13 }}>No tasks for this site.</div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {tasks.filter((t) => t.status !== 'completed').slice(0, 5).map((t) => (
                      <div key={t.id} className="flex items-center gap-3 rounded-lg" style={{ background: 'var(--surface2)', padding: '10px 12px' }}>
                        <span className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, background: t.priority === 'urgent' ? 'var(--critical)' : t.priority === 'high' ? 'var(--warning)' : 'var(--info)', display: 'block' }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-foreground truncate" style={{ fontSize: 12, fontWeight: 500 }}>{t.title}</div>
                          <div className="text-muted-foreground" style={{ fontSize: 10 }}>{t.category} · {t.assignee || 'Unassigned'}</div>
                        </div>
                        <span className="rounded" style={{ background: 'var(--surface3)', color: 'var(--text3)', fontSize: 9, fontWeight: 600, padding: '2px 6px', textTransform: 'capitalize' }}>
                          {t.status}
                        </span>
                      </div>
                    ))}
                    {urgentTasks > 0 && (
                      <div className="flex items-center gap-2 rounded-lg mt-1" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', padding: '8px 12px' }}>
                        <AlertTriangle size={12} style={{ color: 'var(--critical)', flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: 'var(--critical)', fontWeight: 600 }}>{urgentTasks} urgent/high priority task{urgentTasks > 1 ? 's' : ''} need attention</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* COMPLIANCE TAB */}
          {activeTab === 'compliance' && (
            <div>
              {compliance.length === 0 ? (
                <div className="text-muted-foreground" style={{ fontSize: 13 }}>No compliance items for this site.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {compliance.map((c) => (
                    <div key={c.id} className="flex items-center gap-4 rounded-lg" style={{ background: 'var(--surface2)', padding: '12px 14px', border: '1px solid var(--border)' }}>
                      <span className="rounded-full flex-shrink-0" style={{ width: 10, height: 10, background: c.status === 'critical' ? 'var(--critical)' : c.status === 'warning' ? 'var(--warning)' : 'var(--ok)', display: 'block' }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-foreground font-medium" style={{ fontSize: 13 }}>{c.item}</div>
                        <div className="text-muted-foreground" style={{ fontSize: 11 }}>{c.category} · Assignee: {c.assignee || 'Unassigned'}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-muted-foreground" style={{ fontSize: 11 }}>Due</div>
                        <div className="text-foreground font-medium" style={{ fontSize: 12 }}>{c.dueDate || '—'}</div>
                      </div>
                      <StatusBadge
                        variant={c.status === 'critical' ? 'critical' : c.status === 'warning' ? 'warning' : 'ok'}
                        label={c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TASKS TAB */}
          {activeTab === 'tasks' && (
            <div>
              {tasks.length === 0 ? (
                <div className="text-muted-foreground" style={{ fontSize: 13 }}>No tasks for this site.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {tasks.map((t) => (
                    <div key={t.id} className="flex items-center gap-4 rounded-lg" style={{ background: 'var(--surface2)', padding: '12px 14px', border: '1px solid var(--border)' }}>
                      <span className="rounded-full flex-shrink-0" style={{ width: 10, height: 10, background: t.priority === 'urgent' ? 'var(--critical)' : t.priority === 'high' ? 'var(--warning)' : t.priority === 'medium' ? 'var(--info)' : 'var(--ok)', display: 'block' }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-foreground font-medium" style={{ fontSize: 13 }}>{t.title}</div>
                        <div className="text-muted-foreground" style={{ fontSize: 11 }}>{t.category} · {t.assignee || 'Unassigned'}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-muted-foreground" style={{ fontSize: 11 }}>Due</div>
                        <div className="text-foreground font-medium" style={{ fontSize: 12 }}>{t.due || '—'}</div>
                      </div>
                      <span className="rounded" style={{ background: 'var(--surface3)', color: 'var(--text3)', fontSize: 10, fontWeight: 600, padding: '3px 8px', textTransform: 'capitalize', flexShrink: 0 }}>
                        {t.priority}
                      </span>
                      <StatusBadge
                        variant={t.status === 'completed' ? 'ok' : t.status === 'in-progress' ? 'warning' : 'maintenance'}
                        label={t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ALERTS TAB */}
          {activeTab === 'alerts' && (
            <div>
              {alerts.length === 0 ? (
                <div className="text-muted-foreground" style={{ fontSize: 13 }}>No alerts for this site.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {alerts.map((a) => (
                    <div key={a.id} className="flex items-start gap-4 rounded-lg" style={{ background: a.isRead ? 'var(--surface2)' : 'rgba(232,201,122,0.06)', padding: '12px 14px', border: `1px solid ${a.isRead ? 'var(--border)' : 'rgba(232,201,122,0.2)'}` }}>
                      <div className="flex-shrink-0 mt-0.5">
                        {a.type === 'critical' ? (
                          <AlertTriangle size={14} style={{ color: 'var(--critical)' }} />
                        ) : a.type === 'warning' ? (
                          <AlertTriangle size={14} style={{ color: 'var(--warning)' }} />
                        ) : (
                          <CheckCircle size={14} style={{ color: 'var(--info)' }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-foreground" style={{ fontSize: 13, fontWeight: a.isRead ? 400 : 600 }}>{a.message}</div>
                        <div className="text-muted-foreground" style={{ fontSize: 11, marginTop: 2 }}>
                          {new Date(a.time).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      {!a.isRead && (
                        <span className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, background: 'var(--primary)', display: 'block', marginTop: 4 }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
