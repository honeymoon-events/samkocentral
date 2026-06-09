'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from './ui/AppLogo';
import { LayoutDashboard, Building2, FileText, ShieldCheck, ClipboardList, Settings, ChevronLeft, ChevronRight, AlertTriangle,  } from 'lucide-react';
import { ALERTS, TASKS } from '@/lib/mockData';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badgeCount?: number;
  badgeVariant?: 'critical' | 'warning';
}

interface SidebarProps {
  currentPath: string;
}

const criticalCount = ALERTS.filter((a) => a.type === 'critical').length;
const openTaskCount = TASKS.filter((t) => t.status === 'open').length;

export default function Sidebar({ currentPath }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      href: '/',
      icon: <LayoutDashboard size={17} />,
    },
    {
      id: 'sites',
      label: 'Multi-Site Operations',
      href: '/multi-site-operations',
      icon: <Building2 size={17} />,
    },
    {
      id: 'documents',
      label: 'Document Repository',
      href: '/document-repository',
      icon: <FileText size={17} />,
    },
    {
      id: 'compliance',
      label: 'Compliance Tracker',
      href: '/compliance-tracker',
      icon: <ShieldCheck size={17} />,
      badgeCount: criticalCount,
      badgeVariant: 'critical',
    },
    {
      id: 'tasks',
      label: 'Task Manager',
      href: '/task-manager',
      icon: <ClipboardList size={17} />,
      badgeCount: openTaskCount,
      badgeVariant: 'warning',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href);
  };

  return (
    <aside
      className="flex flex-col bg-card border-r border-border transition-sidebar flex-shrink-0 relative"
      style={{ width: collapsed ? 64 : 220, minWidth: collapsed ? 64 : 220 }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 border-b border-border"
        style={{ padding: collapsed ? '18px 14px' : '18px 18px', minHeight: 64 }}
      >
        <div className="flex-shrink-0">
          <AppLogo size={28} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div
              className="font-head text-primary leading-tight"
              style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px' }}
            >
              SamkoCentral
            </div>
            <div
              className="text-muted-foreground"
              style={{ fontSize: 9, letterSpacing: '1.4px', textTransform: 'uppercase', marginTop: 1 }}
            >
              Operations · Compliance
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto" style={{ padding: '14px 8px 8px' }}>
        {!collapsed && (
          <div
            className="text-muted-foreground font-head"
            style={{
              fontSize: 10,
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              padding: '0 8px',
              marginBottom: 8,
            }}
          >
            Navigation
          </div>
        )}
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={`nav-${item.id}`}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className="flex items-center gap-2 rounded-lg transition-all duration-150 group relative"
                style={{
                  padding: collapsed ? '9px 10px' : '9px 10px',
                  background: active ? 'rgba(232,201,122,0.12)' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--text2)',
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--surface2)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--foreground)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text2)';
                  }
                }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate" style={{ fontSize: 13 }}>
                      {item.label}
                    </span>
                    {item.badgeCount !== undefined && item.badgeCount > 0 && (
                      <span
                        className={item.badgeVariant === 'critical' ? 'nav-badge-count' : 'nav-badge-warn'}
                      >
                        {item.badgeCount}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{
                      background: item.badgeVariant === 'critical' ? 'var(--critical)' : 'var(--warning)',
                    }}
                  />
                )}
                {collapsed && (
                  <span
                    className="absolute left-full ml-2 px-2 py-1 rounded text-xs font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50"
                    style={{
                      background: 'var(--surface3)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border-strong)',
                      fontSize: 12,
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-border my-3" />

        {/* Settings */}
        <Link
          href="/settings"
          title={collapsed ? 'Settings' : undefined}
          className="flex items-center gap-2 rounded-lg transition-all duration-150 group relative"
          style={{
            padding: '9px 10px',
            color: 'var(--text2)',
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--surface2)';
            (e.currentTarget as HTMLElement).style.color = 'var(--foreground)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--text2)';
          }}
        >
          <Settings size={17} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
          {collapsed && (
            <span
              className="absolute left-full ml-2 px-2 py-1 rounded text-xs font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50"
              style={{
                background: 'var(--surface3)',
                color: 'var(--foreground)',
                border: '1px solid var(--border-strong)',
                fontSize: 12,
              }}
            >
              Settings
            </span>
          )}
        </Link>
      </nav>

      {/* Critical Alert Banner */}
      {!collapsed && criticalCount > 0 && (
        <div
          className="mx-2 mb-2 rounded-lg flex items-center gap-2"
          style={{
            background: 'rgba(244,63,94,0.10)',
            border: '1px solid rgba(244,63,94,0.25)',
            padding: '8px 10px',
          }}
        >
          <AlertTriangle size={13} style={{ color: 'var(--critical)', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'var(--critical)', fontWeight: 600 }}>
            {criticalCount} critical items
          </span>
        </div>
      )}

      {/* User */}
      <div
        className="border-t border-border"
        style={{ padding: collapsed ? '12px 8px' : '12px 10px' }}
      >
        <div
          className="flex items-center gap-2 rounded-lg cursor-pointer transition-all duration-150"
          style={{
            padding: '8px 8px',
            background: 'var(--surface2)',
          }}
        >
          <div
            className="flex-shrink-0 rounded-full flex items-center justify-center font-head"
            style={{
              width: 28,
              height: 28,
              background: 'var(--accent)',
              color: '#000',
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            GA
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="text-foreground font-medium truncate" style={{ fontSize: 12 }}>
                George Ashworth
              </div>
              <div className="text-muted-foreground" style={{ fontSize: 10 }}>
                Group Admin
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 flex items-center justify-center rounded-full border border-border transition-all duration-150 hover:border-primary z-10"
        style={{
          width: 24,
          height: 24,
          background: 'var(--card)',
          color: 'var(--text2)',
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}