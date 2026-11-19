export type HealthCheckResponse = {
  status: 'ok';
  source: 'mock' | 'real';
  timestamp: string;
};

export type Gender = 'female' | 'male';

export type FarmerRegistrationRequest = {
  fullName: string;
  gender: Gender;
  age: number; // 18–100
  phone: string; // +2547XXXXXXXX or +2541XXXXXXXX
  email?: string;
  county: string;
  subCounty: string;
  ward: string;
  village: string;
  gps?: { lat: number; lng: number };
};

export type Farmer = FarmerRegistrationRequest & {
  id: string;
  registeredAt: string; // ISO 8601
  syncStatus: 'pending' | 'synced';
};

export type FarmerRegistrationResponse = {
  farmer: Farmer;
  source: 'mock' | 'real';
};

export type SyncStatus = 'synced' | 'pending' | 'offline';

export type HomeActiveBatch = {
  batchCode: string;
  varietyLabel: string;
  bagCount: number;
  temperatureC: number;
  cycleEyebrow: string;
  statusLabel: string;
  dayCurrent: number;
  dayTotal: number;
  colonizedPercent: number;
};

export type HomeSummary = {
  farmerDisplayName: string;
  farmerId: string;
  farmUnitLabel: string;
  lastSyncedDisplay: string;
  syncStatus: SyncStatus;
  pendingCount: number;
  activeBatch: HomeActiveBatch | null;
  agronomistTip: string | null;
  todayReminder: {
    id: string;
    title: string;
    cycleStage: string;
    dueEyebrow: string;
    instruction: string;
    humidityTargetLabel: string;
    humidityRange: string;
  } | null;
};

export type HomeSummaryResponse = {
  summary: HomeSummary;
  source: 'mock' | 'real';
};

export type DarkroomMaterial = {
  id: string;
  label: string;
  checked: boolean;
  statusLine?: string;
};

export type DarkroomStep = {
  id: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  instruction: string;
  imagePlaceholderLabel: string;
  phaseEyebrow?: string;
  moduleLabel?: string;
  stepPhaseTitle?: string;
  imageTitle?: string;
  imageFigureRef?: string;
  imageCaption?: string;
  cautionTitle?: string | null;
  cautionBody?: string | null;
  materialsHeading?: string;
  sitePhotoSlots?: number;
  sitePhotoCount?: number;
  materials: DarkroomMaterial[];
};

export type DarkroomGuideResponse = {
  steps: DarkroomStep[];
  source: 'mock' | 'real';
};

export type ProductionStage = {
  id: string;
  order: number;
  title: string;
  summary: string;
};

export type PlantHealthCard = {
  id: string;
  label: string;
  kind: 'healthy' | 'problem';
  note: string;
  imagePlaceholderLabel: string;
};

export type ProductionGuideResponse = {
  stages: ProductionStage[];
  healthCards: PlantHealthCard[];
  source: 'mock' | 'real';
};

export type SupportIssueCategory =
  | 'contamination'
  | 'pests'
  | 'humidity'
  | 'temperature'
  | 'other';

export type SupportTicketRequest = {
  farmerId: string;
  category: SupportIssueCategory;
  description: string;
  hasPhoto: boolean;
};

export type SupportTicket = SupportTicketRequest & {
  id: string;
  createdAt: string;
  status: 'pending_sync' | 'submitted';
};

export type SupportTicketResponse = {
  ticket: SupportTicket;
  source: 'mock' | 'real';
};
