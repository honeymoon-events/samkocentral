'use client';

import React, { useState } from 'react';
import { User, Bell, Shield, Building2, Palette, Mail, Phone, Lock, Eye, EyeOff, Save, CheckCircle, Info,  } from 'lucide-react';

type SettingsSection = 'profile' | 'notifications' | 'security' | 'organisation' | 'appearance';

const sectionNav: { id: SettingsSection; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'profile', label: 'Profile', icon: <User size={16} />, desc: 'Your personal details' },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={16} />, desc: 'Alerts and reminders' },
  { id: 'security', label: 'Security', icon: <Shield size={16} />, desc: 'Password and access' },
  { id: 'organisation', label: 'Organisation', icon: <Building2 size={16} />, desc: 'Group-wide settings' },
  { id: 'appearance', label: 'Appearance', icon: <Palette size={16} />, desc: 'Display preferences' },
];

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text2)',
  marginBottom: 5,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--surface2)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--foreground)',
  fontSize: 13,
  padding: '9px 12px',
  outline: 'none',
};

const sectionTitle = (title: string, sub: string) => (
  <div className="mb-5" style={{ paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
    <h2 className="font-head text-foreground" style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{title}</h2>
    <p className="text-muted-foreground" style={{ fontSize: 12 }}>{sub}</p>
  </div>
);

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        background: checked ? 'var(--primary)' : 'var(--surface3)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 21 : 3,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: checked ? '#000' : 'var(--text3)',
          transition: 'left 0.2s',
        }}
      />
    </button>
  );
}

function SaveBar({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <div className="flex items-center justify-between mt-6 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
      {saved ? (
        <span className="flex items-center gap-2" style={{ fontSize: 12, color: 'var(--ok)' }}>
          <CheckCircle size={13} /> Changes saved
        </span>
      ) : <span />}
      <button
        onClick={onSave}
        className="flex items-center gap-2"
        style={{
          background: 'var(--primary)',
          color: '#000',
          border: 'none',
          borderRadius: 8,
          padding: '9px 20px',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        <Save size={13} /> Save Changes
      </button>
    </div>
  );
}

export default function SettingsClient() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({ fullName: 'James Samko', email: 'james@samkocentral.com', phone: '+44 20 7946 0958', role: 'Group Operations Manager', timezone: 'Europe/London' });

  // Notification state
  const [notifs, setNotifs] = useState({
    criticalAlerts: true,
    complianceReminders: true,
    taskAssignments: true,
    weeklyDigest: false,
    siteStatusChanges: true,
    vendorExpiry: true,
    documentExpiry: true,
    emailNotifs: true,
    inAppNotifs: true,
  });

  // Security state
  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactor: false, sessionTimeout: '60' });

  // Organisation state
  const [org, setOrg] = useState({ groupName: 'Samko Hospitality Group', defaultCurrency: 'GBP', complianceLeadTime: '30', fiscalYearStart: 'April', autoArchiveDays: '90' });

  // Appearance state
  const [appearance, setAppearance] = useState({ compactMode: false, showBadgeCounts: true, defaultView: 'grid', dateFormat: 'DD/MM/YYYY' });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex gap-6" style={{ maxWidth: 960 }}>
      {/* Sidebar nav */}
      <div className="flex-shrink-0" style={{ width: 200 }}>
        <div className="samko-card" style={{ padding: '8px 6px' }}>
          {sectionNav.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className="w-full flex items-center gap-3 rounded-lg text-left"
              style={{
                padding: '10px 12px',
                background: activeSection === s.id ? 'rgba(232,201,122,0.12)' : 'transparent',
                color: activeSection === s.id ? 'var(--primary)' : 'var(--text2)',
                border: 'none',
                cursor: 'pointer',
                marginBottom: 2,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { if (activeSection !== s.id) (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'; }}
              onMouseLeave={(e) => { if (activeSection !== s.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <span className="flex-shrink-0">{s.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: activeSection === s.id ? 700 : 500 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{s.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content panel */}
      <div className="flex-1 min-w-0">
        <div className="samko-card" style={{ padding: '24px 26px' }}>

          {/* PROFILE */}
          {activeSection === 'profile' && (
            <div>
              {sectionTitle('Profile Settings', 'Update your personal information and contact details.')}
              <div className="flex flex-col gap-4">
                <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input style={inputStyle} value={profile.fullName} onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Role / Job Title</label>
                    <input style={inputStyle} value={profile.role} onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))} />
                  </div>
                </div>
                <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <div className="relative">
                      <Mail size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                      <input style={{ ...inputStyle, paddingLeft: 30 }} value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <div className="relative">
                      <Phone size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                      <input style={{ ...inputStyle, paddingLeft: 30 }} value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
                    </div>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Timezone</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={profile.timezone} onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}>
                    {['Europe/London', 'Europe/Dublin', 'Europe/Paris', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Asia/Dubai', 'Asia/Singapore'].map((tz) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>
              <SaveBar onSave={handleSave} saved={saved} />
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div>
              {sectionTitle('Notification Preferences', 'Choose which alerts and updates you want to receive.')}
              <div className="flex flex-col gap-1">
                {[
                  { key: 'criticalAlerts', label: 'Critical Compliance Alerts', desc: 'Immediate alerts for overdue or critical compliance items' },
                  { key: 'complianceReminders', label: 'Compliance Due Reminders', desc: 'Reminders before compliance items are due' },
                  { key: 'taskAssignments', label: 'Task Assignments', desc: 'Notify when a task is assigned to you' },
                  { key: 'siteStatusChanges', label: 'Site Status Changes', desc: 'When a site moves to maintenance or at-risk' },
                  { key: 'vendorExpiry', label: 'Vendor Contract Expiry', desc: 'Alerts when vendor contracts or insurance are expiring' },
                  { key: 'documentExpiry', label: 'Document Expiry', desc: 'Alerts when documents are approaching expiry' },
                  { key: 'weeklyDigest', label: 'Weekly Summary Digest', desc: 'A weekly overview of group compliance and tasks' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-lg" style={{ padding: '12px 14px', background: 'var(--surface2)', marginBottom: 6 }}>
                    <div>
                      <div className="text-foreground font-medium" style={{ fontSize: 13 }}>{item.label}</div>
                      <div className="text-muted-foreground" style={{ fontSize: 11, marginTop: 2 }}>{item.desc}</div>
                    </div>
                    <ToggleSwitch
                      checked={notifs[item.key as keyof typeof notifs]}
                      onChange={(v) => setNotifs((n) => ({ ...n, [item.key]: v }))}
                    />
                  </div>
                ))}
                <div className="mt-2 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="font-head text-muted-foreground mb-3" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Delivery Channels</div>
                  <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    {[
                      { key: 'emailNotifs', label: 'Email Notifications', icon: <Mail size={14} /> },
                      { key: 'inAppNotifs', label: 'In-App Notifications', icon: <Bell size={14} /> },
                    ].map((ch) => (
                      <div key={ch.key} className="flex items-center justify-between rounded-lg" style={{ padding: '12px 14px', background: 'var(--surface2)' }}>
                        <div className="flex items-center gap-2" style={{ color: 'var(--text2)', fontSize: 13 }}>
                          {ch.icon} {ch.label}
                        </div>
                        <ToggleSwitch
                          checked={notifs[ch.key as keyof typeof notifs]}
                          onChange={(v) => setNotifs((n) => ({ ...n, [ch.key]: v }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <SaveBar onSave={handleSave} saved={saved} />
            </div>
          )}

          {/* SECURITY */}
          {activeSection === 'security' && (
            <div>
              {sectionTitle('Security Settings', 'Manage your password and account security options.')}
              <div className="flex flex-col gap-4">
                <div>
                  <label style={labelStyle}>Current Password</label>
                  <div className="relative">
                    <Lock size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      style={{ ...inputStyle, paddingLeft: 30, paddingRight: 36 }}
                      value={security.currentPassword}
                      onChange={(e) => setSecurity((s) => ({ ...s, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                    />
                    <button onClick={() => setShowPassword((v) => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}>
                      {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
                <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={labelStyle}>New Password</label>
                    <input type="password" style={inputStyle} value={security.newPassword} onChange={(e) => setSecurity((s) => ({ ...s, newPassword: e.target.value }))} placeholder="Min. 8 characters" />
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm New Password</label>
                    <input type="password" style={inputStyle} value={security.confirmPassword} onChange={(e) => setSecurity((s) => ({ ...s, confirmPassword: e.target.value }))} placeholder="Repeat new password" />
                  </div>
                </div>
                <div className="rounded-lg flex items-start gap-3" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', padding: '10px 14px' }}>
                  <Info size={13} style={{ color: 'var(--info)', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: 'var(--info)' }}>Use at least 8 characters with a mix of letters, numbers, and symbols for a strong password.</span>
                </div>

                <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="font-head text-muted-foreground mb-3" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Session & Access</div>
                  <div className="flex items-center justify-between rounded-lg mb-3" style={{ background: 'var(--surface2)', padding: '12px 14px' }}>
                    <div>
                      <div className="text-foreground font-medium" style={{ fontSize: 13 }}>Two-Factor Authentication</div>
                      <div className="text-muted-foreground" style={{ fontSize: 11, marginTop: 2 }}>Add an extra layer of security to your account</div>
                    </div>
                    <ToggleSwitch checked={security.twoFactor} onChange={(v) => setSecurity((s) => ({ ...s, twoFactor: v }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Session Timeout (minutes)</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={security.sessionTimeout} onChange={(e) => setSecurity((s) => ({ ...s, sessionTimeout: e.target.value }))}>
                      {['15', '30', '60', '120', '240'].map((v) => (
                        <option key={v} value={v}>{v} minutes</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <SaveBar onSave={handleSave} saved={saved} />
            </div>
          )}

          {/* ORGANISATION */}
          {activeSection === 'organisation' && (
            <div>
              {sectionTitle('Organisation Settings', 'Configure group-wide defaults for compliance and operations.')}
              <div className="flex flex-col gap-4">
                <div>
                  <label style={labelStyle}>Group / Organisation Name</label>
                  <input style={inputStyle} value={org.groupName} onChange={(e) => setOrg((o) => ({ ...o, groupName: e.target.value }))} />
                </div>
                <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={labelStyle}>Default Currency</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={org.defaultCurrency} onChange={(e) => setOrg((o) => ({ ...o, defaultCurrency: e.target.value }))}>
                      {['GBP', 'EUR', 'USD', 'AED', 'SGD'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Fiscal Year Start</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={org.fiscalYearStart} onChange={(e) => setOrg((o) => ({ ...o, fiscalYearStart: e.target.value }))}>
                      {['January', 'April', 'July', 'October'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={labelStyle}>Compliance Lead Time (days)</label>
                    <input type="number" min={7} max={90} style={inputStyle} value={org.complianceLeadTime} onChange={(e) => setOrg((o) => ({ ...o, complianceLeadTime: e.target.value }))} />
                    <div className="text-muted-foreground mt-1" style={{ fontSize: 11 }}>Days before due date to trigger warning status</div>
                  </div>
                  <div>
                    <label style={labelStyle}>Auto-Archive Completed Tasks (days)</label>
                    <input type="number" min={30} max={365} style={inputStyle} value={org.autoArchiveDays} onChange={(e) => setOrg((o) => ({ ...o, autoArchiveDays: e.target.value }))} />
                    <div className="text-muted-foreground mt-1" style={{ fontSize: 11 }}>Archive completed tasks after this many days</div>
                  </div>
                </div>
              </div>
              <SaveBar onSave={handleSave} saved={saved} />
            </div>
          )}

          {/* APPEARANCE */}
          {activeSection === 'appearance' && (
            <div>
              {sectionTitle('Appearance & Display', 'Customise how the application looks and behaves.')}
              <div className="flex flex-col gap-3">
                {[
                  { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce spacing for a denser information layout' },
                  { key: 'showBadgeCounts', label: 'Show Badge Counts', desc: 'Display alert and task counts on sidebar navigation items' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-lg" style={{ padding: '12px 14px', background: 'var(--surface2)' }}>
                    <div>
                      <div className="text-foreground font-medium" style={{ fontSize: 13 }}>{item.label}</div>
                      <div className="text-muted-foreground" style={{ fontSize: 11, marginTop: 2 }}>{item.desc}</div>
                    </div>
                    <ToggleSwitch
                      checked={appearance[item.key as keyof typeof appearance] as boolean}
                      onChange={(v) => setAppearance((a) => ({ ...a, [item.key]: v }))}
                    />
                  </div>
                ))}
                <div className="grid gap-4 mt-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={labelStyle}>Default Site View</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={appearance.defaultView} onChange={(e) => setAppearance((a) => ({ ...a, defaultView: e.target.value }))}>
                      <option value="grid">Grid View</option>
                      <option value="list">List View</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Date Format</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={appearance.dateFormat} onChange={(e) => setAppearance((a) => ({ ...a, dateFormat: e.target.value }))}>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
              <SaveBar onSave={handleSave} saved={saved} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
