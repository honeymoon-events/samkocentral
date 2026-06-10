'use client';

import React, { useEffect, useState } from 'react';
import { alertService } from '@/lib/services/dataService';
import { createClient } from '@/lib/supabase/client';

interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  site: string;
  isRead: boolean;
  time: string;
}

function timeAgo(isoString: string): string {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function DashboardAlertFeed() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    alertService.getAll().then((data) => {
      setAlerts(data as AlertItem[]);
      setLoading(false);
    }).catch(() => setLoading(false));

    // Real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel('alerts_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => {
        alertService.getAll().then((data) => setAlerts(data as AlertItem[])).catch(() => {});
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const alertColors = {
    critical: { dot: 'var(--critical)', bg: 'var(--critical-bg)', border: 'rgba(244,63,94,0.15)' },
    warning: { dot: 'var(--warning)', bg: 'var(--warning-bg)', border: 'rgba(251,191,36,0.15)' },
    info: { dot: 'var(--info)', bg: 'var(--info-bg)', border: 'rgba(96,165,250,0.15)' },
  };

  return (
    <div className="samko-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <h2 className="font-head text-foreground" style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Alert Feed
        </h2>
        <span
          className="rounded-full font-head tabular-nums"
          style={{ background: 'var(--critical-bg)', color: 'var(--critical)', fontSize: 10, fontWeight: 700, padding: '2px 8px' }}
        >
          {alerts.filter((a) => !a.isRead).length} unread
        </span>
      </div>
      <div style={{ maxHeight: 320, overflowY: 'auto' }}>
        {loading ? (
          <div className="flex items-center justify-center" style={{ padding: 32 }}>
            <div className="text-muted-foreground" style={{ fontSize: 13 }}>Loading alerts…</div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex items-center justify-center" style={{ padding: 32 }}>
            <div className="text-muted-foreground" style={{ fontSize: 13 }}>No alerts</div>
          </div>
        ) : (
          alerts.map((alert) => {
            const colors = alertColors[alert.type];
            return (
              <div
                key={alert.id}
                className="flex items-start gap-3"
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid var(--border)',
                  background: alert.isRead ? 'transparent' : colors.bg,
                  opacity: alert.isRead ? 0.7 : 1,
                }}
              >
                <div
                  className="rounded-full flex-shrink-0 mt-1.5"
                  style={{ width: 7, height: 7, background: colors.dot }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground" style={{ fontSize: 12, lineHeight: 1.5 }}>{alert.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground" style={{ fontSize: 10 }}>{alert.site}</span>
                    <span className="text-muted-foreground" style={{ fontSize: 10 }}>·</span>
                    <span className="text-muted-foreground" style={{ fontSize: 10 }}>{timeAgo(alert.time)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}