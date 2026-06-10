import AppLayout from '@/components/AppLayout';
import Topbar from '@/components/Topbar';
import SettingsClient from './components/SettingsClient';

export default function SettingsPage() {
  return (
    <AppLayout currentPath="/settings">
      <Topbar
        title="Settings"
        subtitle="Manage your account, notifications, and application preferences"
      />
      <main
        className="flex-1 overflow-y-auto"
        style={{ padding: '24px 28px', background: 'var(--background)' }}
      >
        <SettingsClient />
      </main>
    </AppLayout>
  );
}
