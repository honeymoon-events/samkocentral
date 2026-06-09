'use client';

import React, { useEffect, useState } from 'react';
import { siteService } from '@/lib/services/dataService';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';

interface SiteRow {
  id: string;
  name: string;
  type: string;
  city: string;
  manager: string;
  status: string;
  risk: string;
  openIssues: number;
  compliance: number;
}

export default function DashboardSiteTable() {
  const [sites, setSites] = useState<SiteRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    siteService.getAll().then((data) => {
      setSites(data as SiteRow[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="samko-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div
        className="flex items-center justify-between"
        style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}
      >
        <h2 className="font-head text-foreground" style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Site Compliance Overview
        </h2>
        <Link href="/multi-site-operations" style={{ fontSize: 11, color: 'var(--primary)', textDecoration: 'none' }}>
          View all sites →
        </Link>
      </div>
      <div style={{ overflowX: 'auto' }}>
        {loading ? (
          <div className="flex items-center justify-center" style={{ padding: 40 }}>
            <div className="text-muted-foreground" style={{ fontSize: 13 }}>Loading sites…</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Site', 'Type', 'City', 'Manager', 'Status', 'Risk Level', 'Open Issues', 'Compliance Score'].map((h) => (
                  <th key={`th-${h}`} className="table-header-cell">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sites?.map((site) => (
                <tr key={site?.id} className="table-row-hover">
                  <td className="table-cell">
                    <span className="text-foreground font-medium" style={{ fontSize: 13 }}>{site?.name}</span>
                  </td>
                  <td className="table-cell">
                    <span className="rounded" style={{ background: 'var(--surface3)', color: 'var(--text2)', fontSize: 10, fontWeight: 600, padding: '2px 8px', display: 'inline-block' }}>
                      {site?.type}
                    </span>
                  </td>
                  <td className="table-cell text-muted2" style={{ fontSize: 12 }}>{site?.city}</td>
                  <td className="table-cell text-muted2" style={{ fontSize: 12 }}>{site?.manager}</td>
                  <td className="table-cell">
                    <StatusBadge
                      variant={site?.status === 'operational' ? 'ok' : 'maintenance'}
                      label={site?.status === 'operational' ? 'Operational' : 'Maintenance'}
                    />
                  </td>
                  <td className="table-cell">
                    <StatusBadge
                      variant={site?.risk === 'high' ? 'critical' : site?.risk === 'medium' ? 'warning' : 'ok'}
                      label={site?.risk ? site.risk.charAt(0).toUpperCase() + site.risk.slice(1) : ''}
                    />
                  </td>
                  <td className="table-cell">
                    <span
                      className="font-head tabular-nums"
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: site?.openIssues > 5 ? 'var(--critical)' : site?.openIssues > 2 ? 'var(--warning)' : 'var(--ok)',
                      }}
                    >
                      {site?.openIssues}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="comp-bar-track" style={{ width: 80 }}>
                        <div
                          className="comp-bar-fill"
                          style={{
                            width: `${site?.compliance}%`,
                            background: site?.compliance >= 90 ? 'var(--ok)' : site?.compliance >= 70 ? 'var(--warning)' : 'var(--critical)',
                          }}
                        />
                      </div>
                      <span
                        className="font-head tabular-nums"
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: site?.compliance >= 90 ? 'var(--ok)' : site?.compliance >= 70 ? 'var(--warning)' : 'var(--critical)',
                        }}
                      >
                        {site?.compliance}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}