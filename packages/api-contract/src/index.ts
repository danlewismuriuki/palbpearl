export type HealthCheckResponse = {
  status: 'ok';
  source: 'mock' | 'real';
  timestamp: string;
};