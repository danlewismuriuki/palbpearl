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
  bannerAssetPath: string;
  bannerHeadline: string;
  badgeLabel: string;
};

export type HomeAskCta = {
  title: string;
  subtitle: string;
};

export type HomeTimelineMilestone = {
  id: string;
  label: string;
  detail: string;
  state: 'done' | 'current' | 'upcoming';
};

export type HomeIncubationTimeline = {
  title: string;
  progressLabel: string;
  percent: number;
  milestones: HomeTimelineMilestone[];
};

export type HomeMicroClimate = {
  eyebrow: string;
  statusLabel: string;
  temperatureC: number;
  temperatureTarget: string;
  temperatureStatus: string;
  humidityPercent: number;
  humidityLabel: string;
  humidityTarget: string;
  chartLabels: string[];
};

export type HomeNavTile = {
  id: 'farm' | 'learn' | 'help' | 'market';
  href: string;
  title: string;
  caption: string;
};

export type HomeSummary = {
  farmerDisplayName: string;
  greetingLine: string;
  farmerId: string;
  farmUnitLabel: string;
  lastSyncedDisplay: string;
  syncStatus: SyncStatus;
  pendingCount: number;
  askCta: HomeAskCta;
  activeBatch: HomeActiveBatch | null;
  incubationTimeline: HomeIncubationTimeline | null;
  microClimate: HomeMicroClimate | null;
  navTiles: HomeNavTile[];
  agronomistTip: string | null;
  offlineExplainer: { title: string; body: string };
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

export type SupportAttachmentVisual = 'green_mold_bag';

export type SupportDemoAttachment = {
  id: string;
  fileName: string;
  sizeLabel: string;
  storedOffline: boolean;
  visual: SupportAttachmentVisual;
};

export type SupportFarmerContext = {
  verifiedLabel: string;
  accountId: string;
  farmerName: string;
  locationLine: string;
};

export type SupportCategoryOption = {
  value: SupportIssueCategory;
  label: string;
};

export type SupportDeskMeta = {
  moduleLabel: string;
  storageBadgeLabel: string;
  pageTitle: string;
  pageSubtitle: string;
  categoryAside: string;
  descriptionHint: string;
  photoSectionLabel: string;
  photoMaxCount: number;
  voiceSectionLabel: string;
  voiceAside: string;
  voicePrompt: string;
  voiceRecordLabel: string;
  submitLabel: string;
  submitFootnote: string;
  offlineBannerTitle: string;
  offlineBannerBody: string;
};

export type SupportDeskDefaults = {
  category: SupportIssueCategory;
  description: string;
  attachments: SupportDemoAttachment[];
};

export type SupportDeskResponse = {
  meta: SupportDeskMeta;
  farmer: SupportFarmerContext;
  categories: SupportCategoryOption[];
  defaults: SupportDeskDefaults;
  source: 'mock' | 'real';
};

export type SupportEmergencyTip = {
  title: string;
  body: string;
};

export type SupportTicketSuccessMeta = {
  displayTicketId: string;
  statusBadge: string;
  replyMessage: string;
  smsDispatchPrefix: string;
  smsOfficerName: string;
  emergencyTip?: SupportEmergencyTip;
};

export type SupportTicketRequest = {
  farmerId: string;
  category: SupportIssueCategory;
  description: string;
  hasPhoto: boolean;
};

export type SupportTicket = SupportTicketRequest & {
  id: string;
  displayId?: string;
  createdAt: string;
  status: 'pending_sync' | 'submitted';
};

export type SupportTicketResponse = {
  ticket: SupportTicket;
  successMeta?: SupportTicketSuccessMeta;
  source: 'mock' | 'real';
};

export type AskAgronomistPanel = {
  pageTitle: string;
  pageSubtitle: string;
  inputLabel: string;
  inputPlaceholder: string;
  submitLabel: string;
  offlineFootnote: string;
};

export type AskAgronomistRequest = {
  question: string;
};

export type AskAgronomistResponse = {
  answer: string;
  source: 'mock' | 'real';
};

export type AskDeskResponse = {
  panel: AskAgronomistPanel;
  source: 'mock' | 'real';
};

export type MarketPlaceholderContent = {
  pageTitle: string;
  body: string;
  backLabel: string;
};

export type MarketPageResponse = {
  content: MarketPlaceholderContent;
  source: 'mock' | 'real';
};
