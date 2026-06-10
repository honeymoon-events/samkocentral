import AppLayout from '@/components/AppLayout';
import Topbar from '@/components/Topbar';
import SiteDetailsClient from './components/SiteDetailsClient';

interface SiteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function SiteDetailsPage({ params }: SiteDetailsPageProps) {
  const { id } = await params;
  return (
    <AppLayout currentPath="/multi-site-operations">
      <Topbar
        title="Site Details"
        subtitle="Full profile, compliance status, tasks, and contacts for this property"
      />
      <main
        className="flex-1 overflow-y-auto"
        style={{ padding: '24px 28px', background: 'var(--background)' }}
      >
        <SiteDetailsClient siteId={id} />
      </main>
    </AppLayout>
  );
}
