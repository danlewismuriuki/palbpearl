import {
  getDarkroomGuideMock,
  getHomeSummaryMock,
  getProductionGuideMock,
  askAgronomistMock,
  getAskDeskMock,
  getMarketPageMock,
  getSupportDeskMock,
  healthCheckMock,
  registerFarmerMock,
  submitSupportTicketMock,
} from '@palbpearl/mocks';
import type {
  AskAgronomistRequest,
  AskAgronomistResponse,
  AskDeskResponse,
  DarkroomGuideResponse,
  FarmerRegistrationRequest,
  FarmerRegistrationResponse,
  HealthCheckResponse,
  HomeSummaryResponse,
  MarketPageResponse,
  ProductionGuideResponse,
  SupportDeskResponse,
  SupportTicketRequest,
  SupportTicketResponse,
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

export async function getSupportDesk(): Promise<SupportDeskResponse> {
  if (DATA_SOURCE === 'mock') {
    await new Promise((r) => setTimeout(r, 300));
    return getSupportDeskMock();
  }
  throw new Error('Real API not implemented yet');
}

export async function getAskDesk(): Promise<AskDeskResponse> {
  if (DATA_SOURCE === 'mock') {
    await new Promise((r) => setTimeout(r, 250));
    return getAskDeskMock();
  }
  throw new Error('Real API not implemented yet');
}

export async function askAgronomist(
  req: AskAgronomistRequest
): Promise<AskAgronomistResponse> {
  if (DATA_SOURCE === 'mock') {
    await new Promise((r) => setTimeout(r, 400));
    return askAgronomistMock(req);
  }
  throw new Error('Real API not implemented yet');
}

export async function getMarketPage(): Promise<MarketPageResponse> {
  if (DATA_SOURCE === 'mock') {
    await new Promise((r) => setTimeout(r, 200));
    return getMarketPageMock();
  }
  throw new Error('Real API not implemented yet');
}

export async function submitSupportTicket(
  req: SupportTicketRequest
): Promise<SupportTicketResponse> {
  if (DATA_SOURCE === 'mock') {
    await new Promise((r) => setTimeout(r, 500));
    return submitSupportTicketMock(req);
  }
  throw new Error('Real API not implemented yet');
}
