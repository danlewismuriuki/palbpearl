import type {
  FarmerRegistrationRequest,
  FarmerRegistrationResponse,
  HealthCheckResponse,
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
