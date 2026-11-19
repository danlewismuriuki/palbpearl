import type {
  DarkroomGuideResponse,
  FarmerRegistrationRequest,
  FarmerRegistrationResponse,
  HealthCheckResponse,
  HomeSummaryResponse,
  ProductionGuideResponse,
  SupportTicketRequest,
  SupportTicketResponse,
} from '@palbpearl/api-contract';

const DARKROOM_TOTAL = 8;

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
      farmUnitLabel: 'Kiambu Oyster Mushroom Unit #1',
      lastSyncedDisplay: 'Today 08:30 AM',
      syncStatus: 'synced',
      pendingCount: 0,
      activeBatch: {
        batchCode: '084',
        varietyLabel: 'Grey Oyster (Pleurotus ostreatus)',
        bagCount: 140,
        temperatureC: 24.2,
        cycleEyebrow: 'Running cycle • Spawn run',
        statusLabel: 'Normal',
        dayCurrent: 14,
        dayTotal: 21,
        colonizedPercent: 65,
      },
      agronomistTip:
        'If spawn bags smell sour or alcoholic, open vents for 10 minutes and note the smell in your log.',
      todayReminder: {
        id: 'rem-001',
        title: "Today's inspection",
        cycleStage: 'Fruiting — Day 12',
        dueEyebrow: 'Day 14 incubation • Due by 12:00 PM',
        instruction:
          'Open the darkroom, check bag surfaces for pinning, and confirm humidity stays in range before noon.',
        humidityTargetLabel: 'Target darkroom humidity',
        humidityRange: '85%–90%',
      },
    },
    source: 'mock',
  };
}

export function getDarkroomGuideMock(): DarkroomGuideResponse {
  const steps: DarkroomGuideResponse['steps'] = [
    {
      id: 'dr-step-1',
      stepNumber: 1,
      totalSteps: DARKROOM_TOTAL,
      title: 'Choose a shaded site',
      instruction:
        'Choose a spot with enough shade, away from harsh midday sun. Make sure the ground drains well for water.',
      imagePlaceholderLabel: 'Step illustration',
      materials: [
        { id: 'mat-poles', label: 'Treated timber poles', checked: false },
        { id: 'mat-shade', label: 'Farm shade netting', checked: false },
        { id: 'mat-gunny', label: 'Heavy-duty sacks', checked: false },
      ],
    },
    {
      id: 'dr-step-2',
      stepNumber: 2,
      totalSteps: DARKROOM_TOTAL,
      title: 'Mark out and dig pole holes',
      instruction:
        'Mark the room outline with string. Dig pole holes at least 1.5 metres deep and make sure each pole stands straight.',
      imagePlaceholderLabel: 'Step illustration',
      materials: [
        { id: 'mat-jembe', label: 'Hoe or mattock', checked: false },
        { id: 'mat-rope', label: 'Reinforcement rope', checked: false },
      ],
    },
    {
      id: 'dr-step-3',
      stepNumber: 3,
      totalSteps: DARKROOM_TOTAL,
      title: 'Build the pole frame',
      instruction:
        'Set poles in the holes and brace with sand and water. Join the tops with timber beams to form a sturdy frame.',
      imagePlaceholderLabel: 'Step illustration',
      materials: [{ id: 'mat-timber', label: 'Timber beams', checked: false }],
    },
    {
      id: 'dr-step-4',
      stepNumber: 4,
      totalSteps: DARKROOM_TOTAL,
      title: 'Build sack walls',
      instruction:
        'Line the corners with boards, then build walls from sacks filled with dry soil. Leave one doorway on the windward side.',
      imagePlaceholderLabel: 'Step illustration',
      materials: [
        { id: 'mat-gunny-wall', label: 'Wall sacks', checked: false },
        { id: 'mat-soil', label: 'Dry soil fill', checked: false },
      ],
    },
    {
      id: 'dr-step-5',
      stepNumber: 5,
      totalSteps: DARKROOM_TOTAL,
      title: 'Cover the roof',
      instruction:
        'Fit roof boards and fix them to the beams. Slope the roof so water does not pool on top.',
      imagePlaceholderLabel: 'Step illustration',
      materials: [{ id: 'mat-roof', label: 'Roof boards', checked: false }],
    },
    {
      id: 'dr-step-6',
      stepNumber: 6,
      totalSteps: DARKROOM_TOTAL,
      title: 'Install shade netting',
      instruction:
        'Cover the roof and sunny side with 70% shade net. Tie the net with rope so it can be opened for maintenance.',
      imagePlaceholderLabel: 'Step illustration',
      materials: [{ id: 'mat-net', label: '70% shade net', checked: false }],
    },
    {
      id: 'dr-step-7',
      stepNumber: 7,
      totalSteps: DARKROOM_TOTAL,
      title: 'Add ventilation',
      instruction:
        'Cut small openings below the walls and above the door for airflow. Avoid gaps that let in direct sunlight.',
      imagePlaceholderLabel: 'Step illustration',
      materials: [],
    },
    {
      id: 'dr-step-8',
      stepNumber: 8,
      totalSteps: DARKROOM_TOTAL,
      title: 'Prepare floor and shelves',
      instruction:
        'Clear the floor and lay a gravel or stone base. Install wooden shelves for bags and tools — at least 40 cm off the floor.',
      imagePlaceholderLabel: 'Step illustration',
      materials: [
        { id: 'mat-gravel', label: 'Gravel or stone', checked: false },
        { id: 'mat-shelves', label: 'Wooden shelves', checked: false },
      ],
    },
  ];

  return { steps, source: 'mock' };
}

export function getProductionGuideMock(): ProductionGuideResponse {
  return {
    stages: [
      {
        id: 'prod-stage-1',
        order: 1,
        title: 'Substrate preparation',
        summary:
          'Mix straw, cotton husks, and rice bran. Add water until moisture is right for pasteurisation.',
      },
      {
        id: 'prod-stage-2',
        order: 2,
        title: 'Misting',
        summary:
          'Mist with cool water daily under shade. Avoid water pooling on bags.',
      },
      {
        id: 'prod-stage-3',
        order: 3,
        title: 'Pinning',
        summary:
          'Watch for small pins. Add fresh air and keep humidity steady.',
      },
      {
        id: 'prod-stage-4',
        order: 4,
        title: 'Harvesting',
        summary:
          'Harvest while caps are still curved. Twist gently to avoid damaging the block.',
      },
      {
        id: 'prod-stage-5',
        order: 5,
        title: 'Solar drying',
        summary:
          'Dry in morning shade or well-ventilated air. Avoid harsh midday sun.',
      },
    ],
    healthCards: [
      {
        id: 'health-1',
        label: 'Healthy mycelium',
        kind: 'healthy',
        note: 'White, even network. Fresh soil smell.',
        imagePlaceholderLabel: 'Sample image',
      },
      {
        id: 'health-2',
        label: 'Mushroom ready to harvest',
        kind: 'healthy',
        note: 'Even cap colour, no yellow spots.',
        imagePlaceholderLabel: 'Sample image',
      },
      {
        id: 'health-3',
        label: 'Green mold',
        kind: 'problem',
        note: 'Bright green surface with powder. Unpleasant smell.',
        imagePlaceholderLabel: 'Sample image',
      },
      {
        id: 'health-4',
        label: 'Substrate rot',
        kind: 'problem',
        note: 'Dark wet patches. Substrate smells rotten.',
        imagePlaceholderLabel: 'Sample image',
      },
    ],
    source: 'mock',
  };
}

export function submitSupportTicketMock(
  req: SupportTicketRequest
): SupportTicketResponse {
  return {
    ticket: {
      ...req,
      id: `mock-ticket-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending_sync',
    },
    source: 'mock',
  };
}