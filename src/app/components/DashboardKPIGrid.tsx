'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, FileWarning, ClipboardList, ShieldCheck, Building2, Handshake } from 'lucide-react';
import { dashboardService } from '@/lib/services/dataService';

interface DashboardStats {
  criticalAlerts: number;
  expiringSoon: number;
  openTasks: number;
  avgCompliance: number;
  highRiskSites: number;
  vendorAlerts: number;
}

export default function DashboardKPIGrid() {
  const [stats, setStats] = useState<DashboardStats>({
    criticalAlerts: 0,
    expiringSoon: 0,
    openTasks: 0,
    avgCompliance: 0,
    highRiskSites: 0,
    vendorAlerts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats().then((s) => {
      setStats(s);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const cards = [
    {
      id: 'kpi-critical',
      label: 'Critical Alerts',
      value: stats.criticalAlerts,
      sub: 'Immediate action required',
      icon: <AlertTriangle size={18} />,
      variant: 'critical' as const,
      span: 2,
    },
    {
      id: 'kpi-expiring',
      label: 'Expiring Within 60 Days',
      value: stats.expiringSoon,
      sub: 'Documents due for renewal',
      icon: <FileWarning size={18} />,
      variant: 'warning' as const,
      span: 1,
    },
    {
      id: 'kpi-tasks',
      label: 'Open Tasks',
      value: stats.openTasks,
      sub: 'Across all sites',
      icon: <ClipboardList size={18} />,
      variant: 'info' as const,
      span: 1,
    },
    {
      id: 'kpi-compliance',
      label: 'Avg Compliance Score',
      value: `${stats.avgCompliance}%`,
      sub: 'Group-wide score',
      icon: <ShieldCheck size={18} />,
      variant: stats.avgCompliance >= 85 ? ('ok' as const) : ('warning' as const),
      span: 1,
    },
    {
      id: 'kpi-risk',
      label: 'High-Risk Sites',
      value: stats.highRiskSites,
      sub: 'Compliance score below 70%',
      icon: <Building2 size={18} />,
      variant: stats.highRiskSites > 0 ? ('critical' as const) : ('ok' as const),
      span: 1,
    },
    {
      id: 'kpi-vendors',
      label: 'Vendor Alerts',
      value: stats.vendorAlerts,
      sub: 'Contract or insurance expiring',
      icon: <Handshake size={18} />,
      variant: stats.vendorAlerts > 1 ? ('warning' as const) : ('ok' as const),
      span: 1,
    },
  ];

  const variantColors = {
    critical: { border: 'var(--critical)', value: 'var(--critical)', bg: 'var(--critical-bg)', top: 'var(--critical)' },
    warning: { border: 'var(--warning)', value: 'var(--warning)', bg: 'var(--warning-bg)', top: 'var(--warning)' },
    ok: { border: 'var(--ok)', value: 'var(--ok)', bg: 'var(--ok-bg)', top: 'var(--ok)' },
    info: { border: 'var(--info)', value: 'var(--info)', bg: 'var(--info-bg)', top: 'var(--info)' },
  };

  return (
    <div className="grid mb-5" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
      {cards.map((card) => {
        const colors = variantColors[card.variant];
        return (
          <div
            key={card.id}
            className="samko-card relative overflow-hidden"
            style={{
              gridColumn: card.span > 1 ? `span ${card.span}` : undefined,
              padding: '18px 20px',
              borderTop: `3px solid ${colors.top}`,
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{ width: 34, height: 34, background: colors.bg, color: colors.value }}
              >
                {card.icon}
              </div>
              {card.id === 'kpi-critical' && stats.criticalAlerts > 0 && (
                <span
                  className="animate-pulse-gold rounded-full"
                  style={{ width: 8, height: 8, background: 'var(--critical)', display: 'block' }}
                />
              )}
            </div>
            <div
              className="font-head tabular-nums"
              style={{
                fontSize: card.span > 1 ? 40 : 32,
                fontWeight: 800,
                lineHeight: 1,
                color: loading ? 'var(--text3)' : colors.value,
                marginBottom: 4,
              }}
            >
              {loading ? '—' : card.value}
            </div>
            <div className="font-head text-foreground" style={{ fontSize: 12, fontWeight: 700, marginBottom: 2, letterSpacing: '0.02em' }}>
              {card.label}
            </div>
            <div className="text-muted-foreground" style={{ fontSize: 11 }}>{card.sub}</div>
          </div>
        );
      })}
    </div>
  );
}