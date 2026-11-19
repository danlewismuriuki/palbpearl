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

export type HomeSummary = {
  farmerDisplayName: string;
  farmerId: string;
  syncStatus: SyncStatus;
  pendingCount: number;
  todayReminder: {
    id: string;
    title: string;
    cycleStage: string;
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
};

export type DarkroomStep = {
  id: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  instruction: string;
  imagePlaceholderLabel: string;
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
