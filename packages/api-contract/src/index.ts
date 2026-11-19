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

export type CropCycleStepChip = {
  id: string;
  label: string;
  state: 'completed' | 'current' | 'upcoming';
};

export type CropCycleProgress = {
  heading: string;
  stageLabel: string;
  steps: CropCycleStepChip[];
};

export type PlantHealthTag = {
  id: string;
  label: string;
};

export type PlantHealthVisual =
  | 'healthy_mycelium'
  | 'green_mold'
  | 'harvest_ready'
  | 'substrate_rot';

export type PlantHealthCard = {
  id: string;
  kind: 'healthy' | 'problem';
  visual: PlantHealthVisual;
  statusBadge: string;
  batchOverlay: string;
  title: string;
  severityPill: string;
  note: string;
  tags: PlantHealthTag[];
  actionTitle: string;
  actionBody: string;
  imagePlaceholderLabel: string;
};

export type PlantDoctorIntro = {
  title: string;
  body: string;
  offlineNote: string;
};

export type RapidDiagnosticOption = {
  id: string;
  tone: 'success' | 'error' | 'warning';
  label: string;
};

export type PlantDoctorPanel = {
  rapidDiagnosticTitle: string;
  rapidDiagnosticHint: string;
  rapidDiagnosticAside: string;
  rapidDiagnosticPrompt: string;
  rapidDiagnosticOptions: RapidDiagnosticOption[];
  photoCtaLabel: string;
  urgentCallTitle: string;
  urgentCallSubtitle: string;
  urgentCallAction: string;
};

export type ProductionGuideResponse = {
  stages: ProductionStage[];
  healthCards: PlantHealthCard[];
  plantDoctorIntro?: PlantDoctorIntro;
  cropCycleProgress?: CropCycleProgress;
  plantDoctorPanel?: PlantDoctorPanel;
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
