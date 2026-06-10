'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, X, ClipboardList, Loader2 } from 'lucide-react';
import { taskService, siteService } from '@/lib/services/dataService';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
type TaskStatus = 'open' | 'in-progress' | 'completed';

interface TaskItem {
  id: string;
  title: string;
  site: string;
  priority: TaskPriority;
  due: string;
  status: TaskStatus;
  assignee: string;
  category: string;
  description: string;
}

interface SiteItem { id: string; name: string; }

const PRIORITY_FILTERS = ['All', 'urgent', 'high', 'medium', 'low'] as const;
const STATUS_FILTERS_TASK = ['All', 'open', 'in-progress', 'completed'] as const;

interface TaskFormValues {
  title: string;
  site: string;
  priority: TaskPriority;
  due: string;
  assignee: string;
  category: string;
  description: string;
}

const PRIORITY_COLOR: Record<TaskPriority, string> = {
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

export default function TaskManagerClient() {
  const [priorityFilter, setPriorityFilter] = useState<typeof PRIORITY_FILTERS[number]>('All');
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_FILTERS_TASK[number]>('All');
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [sites, setSites] = useState<SiteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskFormValues>({
    defaultValues: { title: '', site: '', priority: 'medium', due: '', assignee: '', category: 'H&S', description: '' },
  });

  const loadTasks = () => {
    taskService.getAll().then((data) => {
      setTasks(data as TaskItem[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
    siteService.getAll().then((data) => setSites(data as SiteItem[])).catch(() => {});

    const supabase = createClient();
    const channel = supabase
      .channel('tasks_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, loadTasks)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = useMemo(() => {
    let t = [...tasks];
    if (priorityFilter !== 'All') t = t.filter((task) => task.priority === priorityFilter);
    if (statusFilter !== 'All') t = t.filter((task) => task.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      t = t.filter((task) =>
        task.title.toLowerCase().includes(q) ||
        task.site.toLowerCase().includes(q) ||
        task.assignee.toLowerCase().includes(q)
      );
    }
    const pOrder: Record<TaskPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
    t.sort((a, b) => {
      const pDiff = pOrder[a.priority] - pOrder[b.priority];
      if (pDiff !== 0) return pDiff;
      return daysUntil(a.due) - daysUntil(b.due);
    });
    return t;
  }, [tasks, priorityFilter, statusFilter, search]);

  const taskCounts = useMemo(() => ({
    urgent: tasks.filter((t) => t.priority === 'urgent').length,
    open: tasks.filter((t) => t.status === 'open').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }), [tasks]);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setOpenStatusDropdown(null);
    try {
      await taskService.updateStatus(taskId, newStatus);
      toast.success('Task status updated', { description: `Status changed to ${newStatus}` });
      loadTasks();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleCreate = handleSubmit(async (data) => {
    try {
      const selectedSite = sites.find((s) => s.name === data.site);
      await taskService.create({
        title: data.title,
        siteId: selectedSite?.id,
        priority: data.priority,
        dueDate: data.due || undefined,
        category: data.category,
        description: data.description,
      });
      toast.success('Task created', { description: `"${data.title}" has been added` });
      reset();
      setCreateOpen(false);
      loadTasks();
    } catch {
      toast.error('Failed to create task');
    }
  });

  return (
    <>
      {/* KPI summary */}
      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Urgent Tasks', val: taskCounts.urgent, color: 'var(--critical)', bg: 'var(--critical-bg)', top: 'var(--critical)' },
          { label: 'Open', val: taskCounts.open, color: 'var(--warning)', bg: 'var(--warning-bg)', top: 'var(--warning)' },
          { label: 'In Progress', val: taskCounts.inProgress, color: 'var(--info)', bg: 'var(--info-bg)', top: 'var(--info)' },
          { label: 'Completed', val: taskCounts.completed, color: 'var(--ok)', bg: 'var(--ok-bg)', top: 'var(--ok)' },
        ].map((kpi) => (
          <div key={`task-kpi-${kpi.label}`} className="samko-card" style={{ padding: '16px 18px', borderTop: `3px solid ${kpi.top}` }}>
            <div className="text-muted-foreground font-head" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{kpi.label}</div>
            <div className="font-head tabular-nums" style={{ fontSize: 30, fontWeight: 800, color: kpi.color, lineHeight: 1 }}>
              {loading ? '—' : kpi.val}
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 rounded-lg" style={{ background: 'var(--surface2)', border: '1px solid var(--border-strong)', padding: '8px 14px', minWidth: 240 }}>
          <Search size={14} style={{ color: 'var(--text3)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search tasks, sites, assignees…"
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
        <button onClick={() => setCreateOpen(true)} className="samko-btn-primary flex items-center gap-2 ml-auto" style={{ padding: '8px 16px', fontSize: 12 }}>
          <Plus size={13} />
          Create Task
        </button>
      </div>

      {/* Priority chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-muted-foreground" style={{ fontSize: 12, alignSelf: 'center' }}>Priority:</span>
        {PRIORITY_FILTERS.map((p) => (
          <button key={`priority-chip-${p}`} onClick={() => setPriorityFilter(p)} className={`filter-chip-btn ${priorityFilter === p ? 'active-chip' : ''}`}>
            {p === 'urgent' ? '🔴' : p === 'high' ? '🟡' : p === 'medium' ? '🔵' : p === 'low' ? '⚪' : ''} {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
        <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
        <span className="text-muted-foreground" style={{ fontSize: 12, alignSelf: 'center' }}>Status:</span>
        {STATUS_FILTERS_TASK.map((s) => (
          <button key={`status-task-chip-${s}`} onClick={() => setStatusFilter(s)} className={`filter-chip-btn ${statusFilter === s ? 'active-chip' : ''}`}>
            {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <p className="text-muted-foreground ml-auto" style={{ fontSize: 12, alignSelf: 'center' }}>
          <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{filtered.length}</span> tasks
        </p>
      </div>

      {/* Task table */}
      <div className="samko-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="flex items-center justify-center" style={{ padding: 40 }}>
            <div className="text-muted-foreground" style={{ fontSize: 13 }}>Loading tasks…</div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={22} />}
            title="No tasks match your filters"
            description="Adjust the priority or status filters, or create a new task to get started."
            action={
              <button onClick={() => setCreateOpen(true)} className="samko-btn-primary flex items-center gap-2" style={{ padding: '8px 16px', fontSize: 13 }}>
                <Plus size={13} />Create Task
              </button>
            }
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Priority', 'Task', 'Site', 'Category', 'Assignee', 'Status', 'Due Date', 'Days Left'].map((h) => (
                    <th key={`task-th-${h}`} className="table-header-cell">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((task) => {
                  const days = daysUntil(task.due);
                  const currentStatus = task.status;
                  const isDropdownOpen = openStatusDropdown === task.id;

                  return (
                    <tr key={task.id} className="table-row-hover">
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, background: PRIORITY_COLOR[task.priority], display: 'block' }} />
                          <span style={{ fontSize: 11, fontWeight: 600, color: PRIORITY_COLOR[task.priority], textTransform: 'capitalize' }}>{task.priority}</span>
                        </div>
                      </td>
                      <td className="table-cell" style={{ maxWidth: 280 }}>
                        <div className="text-foreground font-medium" style={{ fontSize: 13, lineHeight: 1.3 }}>{task.title}</div>
                        <div className="text-muted-foreground" style={{ fontSize: 11, marginTop: 2, lineHeight: 1.4 }}>
                          {task.description.length > 60 ? task.description.slice(0, 60) + '…' : task.description}
                        </div>
                      </td>
                      <td className="table-cell text-muted2" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{task.site}</td>
                      <td className="table-cell">
                        <span className="rounded" style={{ background: 'var(--surface3)', color: 'var(--text2)', fontSize: 10, fontWeight: 600, padding: '2px 8px', display: 'inline-block', whiteSpace: 'nowrap' }}>
                          {task.category}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 22, height: 22, background: 'var(--surface3)', color: 'var(--text2)', fontSize: 8, fontWeight: 700 }}>
                            {task.assignee.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-muted2 whitespace-nowrap" style={{ fontSize: 12 }}>{task.assignee}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="relative">
                          <button
                            onClick={() => setOpenStatusDropdown(isDropdownOpen ? null : task.id)}
                            className="flex items-center gap-1 rounded-full transition-all duration-150"
                            style={{
                              background: currentStatus === 'completed' ? 'var(--ok-bg)' : currentStatus === 'in-progress' ? 'var(--info-bg)' : 'var(--warning-bg)',
                              color: currentStatus === 'completed' ? 'var(--ok)' : currentStatus === 'in-progress' ? 'var(--info)' : 'var(--warning)',
                              padding: '3px 9px', fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                            }}
                          >
                            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                            <span style={{ fontSize: 9, marginLeft: 2 }}>▾</span>
                          </button>
                          {isDropdownOpen && (
                            <div className="absolute z-20 rounded-lg" style={{ top: '100%', left: 0, marginTop: 4, background: 'var(--card)', border: '1px solid var(--border-strong)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', minWidth: 140, overflow: 'hidden' }}>
                              {(['open', 'in-progress', 'completed'] as TaskStatus[]).map((s) => (
                                <button
                                  key={`status-opt-${task.id}-${s}`}
                                  onClick={() => handleStatusChange(task.id, s)}
                                  className="w-full flex items-center gap-2 transition-all duration-100"
                                  style={{ padding: '9px 14px', background: currentStatus === s ? 'var(--surface2)' : 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--foreground)', fontFamily: 'var(--font-sans)', textAlign: 'left' }}
                                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'; }}
                                  onMouseLeave={(e) => { if (currentStatus !== s) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                >
                                  <span className="rounded-full" style={{ width: 6, height: 6, background: s === 'completed' ? 'var(--ok)' : s === 'in-progress' ? 'var(--info)' : 'var(--warning)', display: 'block', flexShrink: 0 }} />
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="table-cell text-muted2" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                        {formatDateGB(task.due).split(' ').slice(0, 2).join(' ')}
                      </td>
                      <td className="table-cell">
                        <span className="font-head tabular-nums" style={{ fontSize: 13, fontWeight: 700, color: days < 0 ? 'var(--critical)' : days <= 7 ? 'var(--critical)' : days <= 30 ? 'var(--warning)' : 'var(--text2)' }}>
                          {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <Modal open={createOpen} onClose={() => { setCreateOpen(false); reset(); }} title="Create Compliance Task" subtitle="Assign a new action item to a site manager or team member" width={560}>
        <form onSubmit={handleCreate} noValidate>
          <div className="flex flex-col gap-4">
            <div>
              <label className="samko-label" htmlFor="task-title">Task title *</label>
              <input id="task-title" type="text" className="samko-input" placeholder="e.g. Renew gas safety certificate" {...register('title', { required: 'Task title is required' })} />
              {errors.title && <p style={{ fontSize: 11, color: 'var(--critical)', marginTop: 4 }}>{errors.title.message}</p>}
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label className="samko-label" htmlFor="task-site">Site</label>
                <select id="task-site" className="samko-input" style={{ cursor: 'pointer' }} {...register('site')}>
                  <option value="">All Sites</option>
                  {sites.map((s) => <option key={`task-site-opt-${s.id}`} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="samko-label" htmlFor="task-priority">Priority *</label>
                <select id="task-priority" className="samko-input" style={{ cursor: 'pointer' }} {...register('priority', { required: true })}>
                  {(['urgent', 'high', 'medium', 'low'] as TaskPriority[]).map((p) => (
                    <option key={`task-pri-${p}`} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="samko-label" htmlFor="task-due">Due date</label>
                <input id="task-due" type="date" className="samko-input" {...register('due')} />
              </div>
              <div>
                <label className="samko-label" htmlFor="task-category">Category</label>
                <select id="task-category" className="samko-input" style={{ cursor: 'pointer' }} {...register('category')}>
                  {['H&S', 'Fire Safety', 'Gas Safety', 'Electrical', 'Insurance', 'Food Hygiene', 'Licenses', 'Vehicle', 'HR', 'Lease'].map((c) => (
                    <option key={`task-cat-${c}`} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="samko-label" htmlFor="task-assignee">Assignee</label>
              <input id="task-assignee" type="text" className="samko-input" placeholder="e.g. Tom Bradley" {...register('assignee')} />
            </div>
            <div>
              <label className="samko-label" htmlFor="task-description">Description</label>
              <textarea id="task-description" className="samko-input" placeholder="Describe what needs to be done…" rows={3} style={{ resize: 'vertical' }} {...register('description')} />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-border">
            <button type="button" onClick={() => { setCreateOpen(false); reset(); }} className="samko-btn-ghost">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="samko-btn-primary flex items-center gap-2" style={{ minWidth: 130 }}>
              {isSubmitting ? <><Loader2 size={13} className="animate-spin" />Creating…</> : <><Plus size={13} />Create Task</>}
            </button>
          </div>
        </form>
      </Modal>

      {openStatusDropdown && <div className="fixed inset-0 z-10" onClick={() => setOpenStatusDropdown(null)} />}
    </>
  );
}