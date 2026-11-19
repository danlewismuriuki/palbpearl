import {
  getDarkroomGuideMock,
  getHomeSummaryMock,
  getProductionGuideMock,
  healthCheckMock,
  registerFarmerMock,
} from '@palbpearl/mocks';
import type {
  DarkroomGuideResponse,
  FarmerRegistrationRequest,
  FarmerRegistrationResponse,
  HealthCheckResponse,
  HomeSummaryResponse,
  ProductionGuideResponse,
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

export async function getDarkroomGuide(): Promise<DarkroomGuideResponse> {
  if (DATA_SOURCE === 'mock') {
    await new Promise((r) => setTimeout(r, 300));
    return getDarkroomGuideMock();
  }
  throw new Error('Real API not implemented yet');
}

export async function getProductionGuide(): Promise<ProductionGuideResponse> {
  if (DATA_SOURCE === 'mock') {
    await new Promise((r) => setTimeout(r, 300));
    return getProductionGuideMock();
  }
  throw new Error('Real API not implemented yet');
}
