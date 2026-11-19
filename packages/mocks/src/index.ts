import type {
  FarmerRegistrationRequest,
  FarmerRegistrationResponse,
  HealthCheckResponse,
  HomeSummaryResponse,
} from '@palbpearl/api-contract';

export function healthCheckMock(): HealthCheckResponse {
  return {
    status: 'ok',
    source: 'mock',
    timestamp: new Date().toISOString(),
  };
}

export function registerFarmerMock(
  req: FarmerRegistrationRequest
): FarmerRegistrationResponse {
  return {
    farmer: {
      ...req,
      id: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      registeredAt: new Date().toISOString(),
      syncStatus: 'pending',
    },
    source: 'mock',
  };
}

export function getHomeSummaryMock(): HomeSummaryResponse {
  return {
    summary: {
      farmerDisplayName: 'Wanjiku Kamau',
      farmerId: 'mock-farmer-001',
      syncStatus: 'synced',
      pendingCount: 0,
      todayReminder: {
        id: 'rem-001',
        title: 'Check substrate moisture',
        cycleStage: 'Fruiting — Day 12',
      },
    },
    source: 'mock',
  };
}
