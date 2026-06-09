'use client';

import React, { useEffect, useState } from 'react';
import { taskService } from '@/lib/services/dataService';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface TaskItem {
  id: string;
  title: string;
  site: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  due: string;
  status: string;
  assignee: string;
}

const PRIORITY_COLOR: Record<string, string> = {
  urgent: 'var(--critical)',
  high: 'var(--warning)',
  medium: 'var(--info)',
  low: 'var(--text3)',
};

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

export default function DashboardUrgentTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskService.getAll().then((data) => {
      const urgent = (data as TaskItem[])
        .filter((t) => t.status !== 'completed' && (t.priority === 'urgent' || t.priority === 'high'))
        .slice(0, 5);
      setTasks(urgent);
      setLoading(false);
    }).catch(() => setLoading(false));

    const supabase = createClient();
    const channel = supabase
      .channel('tasks_urgent_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        taskService.getAll().then((data) => {
          const urgent = (data as TaskItem[])
            .filter((t) => t.status !== 'completed' && (t.priority === 'urgent' || t.priority === 'high'))
            .slice(0, 5);
          setTasks(urgent);
        }).catch(() => {});
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="samko-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <h2 className="font-head text-foreground" style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Urgent Tasks
        </h2>
        <Link href="/task-manager" style={{ fontSize: 11, color: 'var(--primary)', textDecoration: 'none' }}>
          View all →
        </Link>
      </div>
      <div>
        {loading ? (
          <div className="flex items-center justify-center" style={{ padding: 32 }}>
            <div className="text-muted-foreground" style={{ fontSize: 13 }}>Loading tasks…</div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex items-center justify-center" style={{ padding: 32 }}>
            <div className="text-muted-foreground" style={{ fontSize: 13 }}>No urgent tasks</div>
          </div>
        ) : (
          tasks.map((task) => {
            const days = daysUntil(task.due);
            return (
              <div
                key={task.id}
                className="flex items-start gap-3"
                style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}
              >
                <div
                  className="rounded-full flex-shrink-0 mt-1.5"
                  style={{ width: 7, height: 7, background: PRIORITY_COLOR[task.priority] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium" style={{ fontSize: 12, lineHeight: 1.4 }}>{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground" style={{ fontSize: 10 }}>{task.site}</span>
                    <span className="text-muted-foreground" style={{ fontSize: 10 }}>·</span>
                    <span
                      style={{
                        fontSize: 10,
                        color: days < 0 ? 'var(--critical)' : days < 7 ? 'var(--warning)' : 'var(--text3)',
                        fontWeight: days < 7 ? 600 : 400,
                      }}
                    >
                      {days < 0 ? `${Math.abs(days)}d overdue` : `Due ${formatDateGB(task.due)}`}
                    </span>
                  </div>
                </div>
                <span
                  className="rounded font-head flex-shrink-0"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '2px 6px',
                    textTransform: 'uppercase',
                    background: task.priority === 'urgent' ? 'var(--critical-bg)' : 'var(--warning-bg)',
                    color: task.priority === 'urgent' ? 'var(--critical)' : 'var(--warning)',
                  }}
                >
                  {task.priority}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}