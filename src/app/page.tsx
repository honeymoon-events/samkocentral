import AppLayout from '@/components/AppLayout';
import Topbar from '@/components/Topbar';
import DashboardKPIGrid from './components/DashboardKPIGrid';
import DashboardAlertFeed from './components/DashboardAlertFeed';
import DashboardUrgentTasks from './components/DashboardUrgentTasks';
import DashboardSiteTable from './components/DashboardSiteTable';
import DashboardComplianceChart from './components/DashboardComplianceChart';

export default function ExecutiveDashboardPage() {
  return (
    <AppLayout currentPath="/">
      <Topbar
        title="Executive Dashboard"
        subtitle="Group-wide compliance snapshot — 29 May 2026, 13:40"
      />
      <main
        className="flex-1 overflow-y-auto"
        style={{ padding: '24px 28px', background: 'var(--background)' }}
      >
        <DashboardKPIGrid />
        <DashboardComplianceChart />
        <div
          className="grid gap-4 mb-5"
          style={{ gridTemplateColumns: '1fr 1fr' }}
        >
          <DashboardAlertFeed />
          <DashboardUrgentTasks />
        </div>
        <DashboardSiteTable />
      </main>
    </AppLayout>
  );
}