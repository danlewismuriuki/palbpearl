import {
  getHomeSummaryMock,
  healthCheckMock,
  registerFarmerMock,
} from '@palbpearl/mocks';
import type {
  FarmerRegistrationRequest,
  FarmerRegistrationResponse,
  HealthCheckResponse,
  HomeSummaryResponse,
} from '@palbpearl/api-contract';

const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE ?? 'mock';

export async function healthCheck(): Promise<HealthCheckResponse> {
  if (DATA_SOURCE === 'mock') return healthCheckMock();
  throw new Error('Real API not implemented yet');
}

export async function registerFarmer(
  req: FarmerRegistrationRequest
): Promise<FarmerRegistrationResponse> {
  if (DATA_SOURCE === 'mock') {
    await new Promise((r) => setTimeout(r, 400)); // simulate latency
    return registerFarmerMock(req);
  }
  throw new Error('Real API not implemented yet');
}

export async function getHomeSummary(): Promise<HomeSummaryResponse> {
  if (DATA_SOURCE === 'mock') {
    await new Promise((r) => setTimeout(r, 300));
    return getHomeSummaryMock();
  }
  throw new Error('Real API not implemented yet');
}
