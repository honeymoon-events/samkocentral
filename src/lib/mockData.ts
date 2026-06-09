// ─── SAMKOCENTRAL MOCK DATA ───────────────────────────────────────────────────
// Backend integration point: replace these with API calls to your data layer

export type SiteStatus = 'operational' | 'maintenance' | 'at-risk';
export type RiskLevel = 'low' | 'medium' | 'high';
export type DocStatus = 'ok' | 'warning' | 'critical';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'open' | 'in-progress' | 'completed';
export type AlertType = 'critical' | 'warning' | 'info';
export type VendorStatus = 'ok' | 'warning' | 'critical';

export interface Site {
  id: string;
  name: string;
  type: 'Hotel' | 'Restaurant';
  city: string;
  status: SiteStatus;
  risk: RiskLevel;
  manager: string;
  phone: string;
  openIssues: number;
  compliance: number;
  address: string;
}

export interface Document {
  id: string;
  name: string;
  site: string;
  category: string;
  expiry: string;
  status: DocStatus;
  size: string;
  uploaded: string;
  uploadedBy: string;
  version: string;
}

export interface ComplianceItem {
  id: string;
  item: string;
  site: string;
  category: string;
  dueDate: string;
  status: DocStatus;
  assignee: string;
  lastReviewed: string;
  notes: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  sites: string[];
  contractExpiry: string;
  insuranceExpiry: string;
  status: VendorStatus;
  contact: string;
  email: string;
  phone: string;
  value: string;
}

export interface Task {
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

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  time: string;
  site: string;
}

export const SITES: Site[] = [
  {
    id: 'site-001',
    name: 'The Grand Meridian',
    type: 'Hotel',
    city: 'London',
    status: 'operational',
    risk: 'low',
    manager: 'Sarah Chen',
    phone: '+44 20 7946 0300',
    openIssues: 2,
    compliance: 94,
    address: '14 Belgrave Square, London SW1X 8PS',
  },
  {
    id: 'site-002',
    name: 'Harbour View Hotel',
    type: 'Hotel',
    city: 'Bristol',
    status: 'operational',
    risk: 'medium',
    manager: 'James Okafor',
    phone: '+44 117 946 0221',
    openIssues: 5,
    compliance: 78,
    address: '2 Harbourside Walk, Bristol BS1 4RB',
  },
  {
    id: 'site-003',
    name: 'Brasserie Lumière',
    type: 'Restaurant',
    city: 'London',
    status: 'operational',
    risk: 'low',
    manager: 'Isabelle Martin',
    phone: '+44 20 7946 0445',
    openIssues: 1,
    compliance: 97,
    address: '88 King Street, London WC2E 8JS',
  },
  {
    id: 'site-004',
    name: 'The Copper Kettle',
    type: 'Restaurant',
    city: 'Bath',
    status: 'maintenance',
    risk: 'high',
    manager: 'Tom Bradley',
    phone: '+44 1225 946 012',
    openIssues: 9,
    compliance: 61,
    address: '7 Milsom Street, Bath BA1 1BZ',
  },
  {
    id: 'site-005',
    name: 'Skyline Suites',
    type: 'Hotel',
    city: 'Manchester',
    status: 'operational',
    risk: 'medium',
    manager: 'Priya Sharma',
    phone: '+44 161 946 0110',
    openIssues: 3,
    compliance: 85,
    address: '200 Deansgate, Manchester M3 4LQ',
  },
  {
    id: 'site-006',
    name: 'Vault 42 Bar & Kitchen',
    type: 'Restaurant',
    city: 'Edinburgh',
    status: 'operational',
    risk: 'low',
    manager: 'Ewan McAllister',
    phone: '+44 131 946 0887',
    openIssues: 0,
    compliance: 99,
    address: '42 Victoria Street, Edinburgh EH1 2JW',
  },
];

export const DOCUMENTS: Document[] = [
  {
    id: 'doc-001',
    name: 'Public Liability Insurance',
    site: 'The Grand Meridian',
    category: 'Insurance',
    expiry: '2026-08-15',
    status: 'ok',
    size: '2.4 MB',
    uploaded: '2025-08-10',
    uploadedBy: 'Sarah Chen',
    version: 'v3.1',
  },
  {
    id: 'doc-002',
    name: 'Fire Safety Certificate',
    site: 'Harbour View Hotel',
    category: 'Fire Safety',
    expiry: '2026-06-20',
    status: 'warning',
    size: '1.1 MB',
    uploaded: '2024-06-18',
    uploadedBy: 'James Okafor',
    version: 'v2.0',
  },
  {
    id: 'doc-003',
    name: 'Gas Safety Record',
    site: 'The Copper Kettle',
    category: 'Gas Safety',
    expiry: '2026-06-02',
    status: 'critical',
    size: '0.8 MB',
    uploaded: '2025-06-01',
    uploadedBy: 'Tom Bradley',
    version: 'v1.4',
  },
  {
    id: 'doc-004',
    name: 'Premises Alcohol Licence',
    site: 'Vault 42 Bar & Kitchen',
    category: 'Licenses',
    expiry: '2027-01-31',
    status: 'ok',
    size: '3.2 MB',
    uploaded: '2025-01-28',
    uploadedBy: 'Ewan McAllister',
    version: 'v5.0',
  },
  {
    id: 'doc-005',
    name: 'EICR – Electrical Installation Report',
    site: 'Skyline Suites',
    category: 'Electrical',
    expiry: '2026-07-10',
    status: 'warning',
    size: '5.7 MB',
    uploaded: '2021-07-08',
    uploadedBy: 'Priya Sharma',
    version: 'v1.0',
  },
  {
    id: 'doc-006',
    name: 'Food Hygiene Certificate – Level 5',
    site: 'Brasserie Lumière',
    category: 'Food Hygiene',
    expiry: '2028-03-22',
    status: 'ok',
    size: '0.6 MB',
    uploaded: '2025-03-20',
    uploadedBy: 'Isabelle Martin',
    version: 'v2.2',
  },
  {
    id: 'doc-007',
    name: 'Employer Liability Insurance',
    site: 'The Grand Meridian',
    category: 'Insurance',
    expiry: '2026-08-15',
    status: 'ok',
    size: '1.9 MB',
    uploaded: '2025-08-10',
    uploadedBy: 'Sarah Chen',
    version: 'v4.0',
  },
  {
    id: 'doc-008',
    name: 'PAT Testing Record',
    site: 'The Copper Kettle',
    category: 'Electrical',
    expiry: '2026-05-30',
    status: 'critical',
    size: '1.2 MB',
    uploaded: '2025-05-29',
    uploadedBy: 'Tom Bradley',
    version: 'v1.1',
  },
  {
    id: 'doc-009',
    name: 'Vehicle MOT Certificate – Van XR22',
    site: 'Harbour View Hotel',
    category: 'Vehicle',
    expiry: '2026-07-04',
    status: 'warning',
    size: '0.4 MB',
    uploaded: '2025-07-03',
    uploadedBy: 'James Okafor',
    version: 'v1.0',
  },
  {
    id: 'doc-010',
    name: 'Lease Agreement – Main Premises',
    site: 'Vault 42 Bar & Kitchen',
    category: 'Lease',
    expiry: '2031-12-31',
    status: 'ok',
    size: '8.1 MB',
    uploaded: '2024-01-05',
    uploadedBy: 'Ewan McAllister',
    version: 'v1.0',
  },
  {
    id: 'doc-011',
    name: 'Health & Safety Policy',
    site: 'Skyline Suites',
    category: 'H&S',
    expiry: '2026-11-01',
    status: 'ok',
    size: '1.4 MB',
    uploaded: '2025-11-01',
    uploadedBy: 'Priya Sharma',
    version: 'v3.0',
  },
  {
    id: 'doc-012',
    name: 'Waste Carrier Licence',
    site: 'Brasserie Lumière',
    category: 'Licenses',
    expiry: '2026-09-14',
    status: 'ok',
    size: '0.5 MB',
    uploaded: '2024-09-10',
    uploadedBy: 'Isabelle Martin',
    version: 'v2.0',
  },
  {
    id: 'doc-013',
    name: 'Legionella Risk Assessment',
    site: 'The Copper Kettle',
    category: 'H&S',
    expiry: '2026-06-15',
    status: 'critical',
    size: '2.1 MB',
    uploaded: '2025-06-14',
    uploadedBy: 'Tom Bradley',
    version: 'v1.0',
  },
  {
    id: 'doc-014',
    name: 'DBS Check Register – Front of House',
    site: 'The Grand Meridian',
    category: 'HR',
    expiry: '2026-10-01',
    status: 'ok',
    size: '0.9 MB',
    uploaded: '2025-10-01',
    uploadedBy: 'Sarah Chen',
    version: 'v2.1',
  },
];

export const COMPLIANCE: ComplianceItem[] = [
  {
    id: 'comp-001',
    item: 'Public Liability Insurance',
    site: 'The Grand Meridian',
    category: 'Insurance',
    dueDate: '2026-08-15',
    status: 'ok',
    assignee: 'Sarah Chen',
    lastReviewed: '2025-08-10',
    notes: 'Renewed annually with Aviva Commercial',
  },
  {
    id: 'comp-002',
    item: 'Fire Risk Assessment',
    site: 'Harbour View Hotel',
    category: 'Fire Safety',
    dueDate: '2026-06-20',
    status: 'warning',
    assignee: 'James Okafor',
    lastReviewed: '2024-06-18',
    notes: 'FireGuard Systems contracted to carry out assessment',
  },
  {
    id: 'comp-003',
    item: 'Gas Safety Inspection',
    site: 'The Copper Kettle',
    category: 'Gas Safety',
    dueDate: '2026-06-02',
    status: 'critical',
    assignee: 'Tom Bradley',
    lastReviewed: '2025-06-01',
    notes: 'City Gas Engineers to attend — booking urgent',
  },
  {
    id: 'comp-004',
    item: 'PAT Testing – Kitchen Equipment',
    site: 'The Copper Kettle',
    category: 'Electrical',
    dueDate: '2026-05-30',
    status: 'critical',
    assignee: 'Tom Bradley',
    lastReviewed: '2025-05-29',
    notes: 'Apex Electrical to conduct full kitchen sweep',
  },
  {
    id: 'comp-005',
    item: 'EICR Certificate Renewal',
    site: 'Skyline Suites',
    category: 'Electrical',
    dueDate: '2026-07-10',
    status: 'warning',
    assignee: 'Priya Sharma',
    lastReviewed: '2021-07-08',
    notes: 'Full 5-yearly inspection due — Apex Electrical booked',
  },
  {
    id: 'comp-006',
    item: 'Food Hygiene Inspection',
    site: 'Brasserie Lumière',
    category: 'Food Hygiene',
    dueDate: '2028-03-22',
    status: 'ok',
    assignee: 'Isabelle Martin',
    lastReviewed: '2025-03-20',
    notes: 'Achieved 5-star rating — next inspection 2028',
  },
  {
    id: 'comp-007',
    item: 'Alcohol Licence Renewal',
    site: 'Vault 42 Bar & Kitchen',
    category: 'Licenses',
    dueDate: '2027-01-31',
    status: 'ok',
    assignee: 'Ewan McAllister',
    lastReviewed: '2025-01-28',
    notes: 'Edinburgh Council licence reference ECC/2025/0042',
  },
  {
    id: 'comp-008',
    item: 'Vehicle Insurance – Van XR22',
    site: 'Harbour View Hotel',
    category: 'Vehicle',
    dueDate: '2026-07-04',
    status: 'warning',
    assignee: 'James Okafor',
    lastReviewed: '2025-07-03',
    notes: 'Commercial fleet policy with Admiral Business',
  },
  {
    id: 'comp-009',
    item: 'DBS Checks – Front of House',
    site: 'The Grand Meridian',
    category: 'HR',
    dueDate: '2026-10-01',
    status: 'ok',
    assignee: 'Sarah Chen',
    lastReviewed: '2025-10-01',
    notes: '12 staff checked — all clear, renewed annually',
  },
  {
    id: 'comp-010',
    item: 'Legionella Risk Assessment',
    site: 'The Copper Kettle',
    category: 'H&S',
    dueDate: '2026-06-15',
    status: 'critical',
    assignee: 'Tom Bradley',
    lastReviewed: '2025-06-14',
    notes: 'Water system assessment overdue — HSE requirement',
  },
];

export const VENDORS: Vendor[] = [
  {
    id: 'vendor-001',
    name: 'CleanSafe Services Ltd',
    category: 'Cleaning',
    sites: ['The Grand Meridian', 'Brasserie Lumière'],
    contractExpiry: '2027-03-31',
    insuranceExpiry: '2026-09-01',
    status: 'ok',
    contact: 'Mark Phillips',
    email: 'mark@cleansafe.co.uk',
    phone: '+44 20 7946 1100',
    value: '£48,000/yr',
  },
  {
    id: 'vendor-002',
    name: 'FireGuard Systems',
    category: 'Fire Safety',
    sites: ['Harbour View Hotel', 'Skyline Suites'],
    contractExpiry: '2026-07-15',
    insuranceExpiry: '2026-06-30',
    status: 'warning',
    contact: 'Donna Walsh',
    email: 'd.walsh@fireguard.co.uk',
    phone: '+44 117 946 2200',
    value: '£12,500/yr',
  },
  {
    id: 'vendor-003',
    name: 'City Gas Engineers',
    category: 'Gas',
    sites: ['The Copper Kettle'],
    contractExpiry: '2026-06-10',
    insuranceExpiry: '2026-05-28',
    status: 'critical',
    contact: 'Steve Nunn',
    email: 'steve@citygas.co.uk',
    phone: '+44 1225 946 330',
    value: '£6,200/yr',
  },
  {
    id: 'vendor-004',
    name: 'Apex Electrical',
    category: 'Electrical',
    sites: ['All Sites'],
    contractExpiry: '2027-12-31',
    insuranceExpiry: '2027-01-15',
    status: 'ok',
    contact: 'Rachel Tong',
    email: 'r.tong@apexelec.co.uk',
    phone: '+44 161 946 4400',
    value: '£32,000/yr',
  },
  {
    id: 'vendor-005',
    name: 'Nordic Food Supply',
    category: 'Food & Beverage',
    sites: ['Brasserie Lumière', 'Vault 42 Bar & Kitchen'],
    contractExpiry: '2026-10-31',
    insuranceExpiry: '2026-10-31',
    status: 'ok',
    contact: 'Lars Eriksen',
    email: 'lars@nordicfood.co.uk',
    phone: '+44 131 946 5500',
    value: '£96,000/yr',
  },
  {
    id: 'vendor-006',
    name: 'SecureNet CCTV',
    category: 'Security',
    sites: ['The Grand Meridian', 'Harbour View Hotel'],
    contractExpiry: '2028-06-01',
    insuranceExpiry: '2027-06-01',
    status: 'ok',
    contact: 'Amir Patel',
    email: 'amir@securenet.co.uk',
    phone: '+44 20 7946 6600',
    value: '£18,400/yr',
  },
];

export const TASKS: Task[] = [
  {
    id: 'task-001',
    title: 'Renew gas safety certificate',
    site: 'The Copper Kettle',
    priority: 'urgent',
    due: '2026-06-02',
    status: 'open',
    assignee: 'Tom Bradley',
    category: 'Gas Safety',
    description: 'Annual gas safety inspection and certificate renewal required by law. Contact City Gas Engineers immediately.',
  },
  {
    id: 'task-002',
    title: 'PAT testing – all kitchen equipment',
    site: 'The Copper Kettle',
    priority: 'urgent',
    due: '2026-05-30',
    status: 'open',
    assignee: 'Tom Bradley',
    category: 'Electrical',
    description: 'Full portable appliance testing of all kitchen equipment. Apex Electrical to attend on-site.',
  },
  {
    id: 'task-003',
    title: 'Book fire risk assessment',
    site: 'Harbour View Hotel',
    priority: 'high',
    due: '2026-06-20',
    status: 'in-progress',
    assignee: 'James Okafor',
    category: 'Fire Safety',
    description: 'Annual FRA required. FireGuard Systems booked — awaiting confirmation of date.',
  },
  {
    id: 'task-004',
    title: 'Upload renewed EICR document',
    site: 'Skyline Suites',
    priority: 'high',
    due: '2026-07-10',
    status: 'open',
    assignee: 'Priya Sharma',
    category: 'Electrical',
    description: 'Upload new EICR certificate to document repository once Apex Electrical inspection complete.',
  },
  {
    id: 'task-005',
    title: 'Legionella assessment – full property',
    site: 'The Copper Kettle',
    priority: 'urgent',
    due: '2026-06-15',
    status: 'open',
    assignee: 'Tom Bradley',
    category: 'H&S',
    description: 'Mandatory water system risk assessment. HSE compliance requirement — third party assessor required.',
  },
  {
    id: 'task-006',
    title: 'Renew vehicle insurance – Van XR22',
    site: 'Harbour View Hotel',
    priority: 'medium',
    due: '2026-07-04',
    status: 'open',
    assignee: 'James Okafor',
    category: 'Vehicle',
    description: 'Commercial fleet policy renewal with Admiral Business. Get 3 comparison quotes.',
  },
  {
    id: 'task-007',
    title: 'Update Health & Safety policy document',
    site: 'Harbour View Hotel',
    priority: 'medium',
    due: '2026-08-01',
    status: 'open',
    assignee: 'James Okafor',
    category: 'H&S',
    description: 'Annual H&S policy review and update. Circulate to all staff for acknowledgement signature.',
  },
  {
    id: 'task-008',
    title: 'Annual supplier insurance review',
    site: 'All Sites',
    priority: 'low',
    due: '2026-09-01',
    status: 'open',
    assignee: 'Group Ops',
    category: 'Insurance',
    description: 'Collect and verify insurance certificates from all contracted suppliers for group compliance records.',
  },
];

export const ALERTS: Alert[] = [
  {
    id: 'alert-001',
    type: 'critical',
    message: 'Gas Safety Record EXPIRED – The Copper Kettle',
    time: 'Today, 08:14',
    site: 'The Copper Kettle',
  },
  {
    id: 'alert-002',
    type: 'critical',
    message: 'PAT Testing overdue – The Copper Kettle',
    time: 'Today, 08:14',
    site: 'The Copper Kettle',
  },
  {
    id: 'alert-003',
    type: 'critical',
    message: 'Legionella assessment overdue – The Copper Kettle',
    time: 'Yesterday, 09:30',
    site: 'The Copper Kettle',
  },
  {
    id: 'alert-004',
    type: 'warning',
    message: 'Fire Safety Certificate expires in 22 days – Harbour View',
    time: '2 days ago',
    site: 'Harbour View Hotel',
  },
  {
    id: 'alert-005',
    type: 'warning',
    message: 'EICR expires in 42 days – Skyline Suites',
    time: '3 days ago',
    site: 'Skyline Suites',
  },
  {
    id: 'alert-006',
    type: 'info',
    message: 'New document uploaded: Lease Agreement – Vault 42',
    time: '4 days ago',
    site: 'Vault 42 Bar & Kitchen',
  },
];

// Reference date for all calculations: 2026-05-29
export const REFERENCE_DATE = '2026-05-29';

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const ref = new Date(REFERENCE_DATE);
  return Math.ceil((target.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDateGB(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' });
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

export const COMPLIANCE_TREND = [
  { week: 'W1 Mar', score: 88, critical: 2, warnings: 4 },
  { week: 'W2 Mar', score: 86, critical: 3, warnings: 3 },
  { week: 'W3 Mar', score: 84, critical: 3, warnings: 5 },
  { week: 'W4 Mar', score: 87, critical: 2, warnings: 4 },
  { week: 'W1 Apr', score: 85, critical: 2, warnings: 4 },
  { week: 'W2 Apr', score: 83, critical: 3, warnings: 5 },
  { week: 'W3 Apr', score: 80, critical: 4, warnings: 4 },
  { week: 'W4 Apr', score: 82, critical: 3, warnings: 4 },
  { week: 'W1 May', score: 79, critical: 4, warnings: 5 },
  { week: 'W2 May', score: 77, critical: 5, warnings: 4 },
  { week: 'W3 May', score: 75, critical: 5, warnings: 4 },
  { week: 'W4 May', score: 73, critical: 6, warnings: 4 },
];

export const MOCK_USERS = [
  {
    role: 'Group Admin',
    email: 'g.admin@samkocentral.co.uk',
    password: 'SamkoCentral2026!',
    name: 'George Ashworth',
    initials: 'GA',
  },
  {
    role: 'Site Manager',
    email: 's.chen@samkocentral.co.uk',
    password: 'SiteManager2026!',
    name: 'Sarah Chen',
    initials: 'SC',
  },
  {
    role: 'Compliance Officer',
    email: 'c.officer@samkocentral.co.uk',
    password: 'Compliance2026!',
    name: 'Claire Oduya',
    initials: 'CO',
  },
];