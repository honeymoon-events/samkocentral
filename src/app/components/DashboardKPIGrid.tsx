import React from 'react';
import { DOCUMENTS, COMPLIANCE, TASKS, SITES, VENDORS } from '@/lib/mockData';
import { AlertTriangle, FileWarning, ClipboardList, ShieldCheck, Building2, Handshake } from 'lucide-react';

export default function DashboardKPIGrid() {
  const criticalAlerts =
    DOCUMENTS.filter((d) => d.status === 'critical').length +
    COMPLIANCE.filter((c) => c.status === 'critical').length;
  const expiringSoon = DOCUMENTS.filter((d) => d.status === 'warning').length;
  const openTasks = TASKS.filter((t) => t.status === 'open').length;
  const avgCompliance = Math.round(
    SITES.reduce((a, s) => a + s.compliance, 0) / SITES.length
  );
  const highRiskSites = SITES.filter((s) => s.risk === 'high').length;
  const vendorAlerts = VENDORS.filter((v) => v.status !== 'ok').length;

  const cards = [
    {
      id: 'kpi-critical',
      label: 'Critical Alerts',
      value: criticalAlerts,
      sub: 'Immediate action required',
      icon: <AlertTriangle size={18} />,
      variant: 'critical' as const,
      span: 2,
    },
    {
      id: 'kpi-expiring',
      label: 'Expiring Within 60 Days',
      value: expiringSoon,
      sub: 'Documents due for renewal',
      icon: <FileWarning size={18} />,
      variant: 'warning' as const,
      span: 1,
    },
    {
      id: 'kpi-tasks',
      label: 'Open Tasks',
      value: openTasks,
      sub: 'Across all sites',
      icon: <ClipboardList size={18} />,
      variant: 'info' as const,
      span: 1,
    },
    {
      id: 'kpi-compliance',
      label: 'Avg Compliance Score',
      value: `${avgCompliance}%`,
      sub: 'Group-wide score',
      icon: <ShieldCheck size={18} />,
      variant: avgCompliance >= 85 ? ('ok' as const) : ('warning' as const),
      span: 1,
    },
    {
      id: 'kpi-risk',
      label: 'High-Risk Sites',
      value: highRiskSites,
      sub: 'Compliance score below 70%',
      icon: <Building2 size={18} />,
      variant: highRiskSites > 0 ? ('critical' as const) : ('ok' as const),
      span: 1,
    },
    {
      id: 'kpi-vendors',
      label: 'Vendor Alerts',
      value: vendorAlerts,
      sub: 'Contract or insurance expiring',
      icon: <Handshake size={18} />,
      variant: vendorAlerts > 1 ? ('warning' as const) : ('ok' as const),
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
    <div
      className="grid mb-5"
      style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}
    >
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
                style={{
                  width: 34,
                  height: 34,
                  background: colors.bg,
                  color: colors.value,
                }}
              >
                {card.icon}
              </div>
              {card.id === 'kpi-critical' && criticalAlerts > 0 && (
                <span
                  className="animate-pulse-gold rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    background: 'var(--critical)',
                    display: 'block',
                  }}
                />
              )}
            </div>
            <div
              className="font-head tabular-nums"
              style={{
                fontSize: card.span > 1 ? 40 : 32,
                fontWeight: 800,
                lineHeight: 1,
                color: colors.value,
                marginBottom: 4,
              }}
            >
              {card.value}
            </div>
            <div
              className="font-head text-foreground"
              style={{ fontSize: 12, fontWeight: 700, marginBottom: 2, letterSpacing: '0.02em' }}
            >
              {card.label}
            </div>
            <div className="text-muted-foreground" style={{ fontSize: 11 }}>
              {card.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}