import { healthCheckMock } from '@palbpearl/mocks';
import type { HealthCheckResponse } from '@palbpearl/api-contract';

const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE ?? 'mock';

export async function healthCheck(): Promise<HealthCheckResponse> {
  if (DATA_SOURCE === 'mock') return healthCheckMock();
  throw new Error('Real API not implemented yet');
}