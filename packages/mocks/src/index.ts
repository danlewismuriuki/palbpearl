import type {
  DarkroomGuideResponse,
  FarmerRegistrationRequest,
  FarmerRegistrationResponse,
  HealthCheckResponse,
  HomeSummaryResponse,
  ProductionGuideResponse,
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

export function getDarkroomGuideMock(): DarkroomGuideResponse {
  const steps: DarkroomGuideResponse['steps'] = [
    {
      id: 'dr-step-1',
      stepNumber: 1,
      totalSteps: DARKROOM_TOTAL,
      title: 'Chagua eneo lenye kivuli',
      instruction:
        'Chagua mahali penye kivuli cha kutosha, mbali na jua kali la mchana. Hakikisha udongo umeelekea vizuri kwa maji.',
      imagePlaceholderLabel: 'Picha ya hatua',
      materials: [
        { id: 'mat-poles', label: 'Nguzo za mbao zilizochakatwa', checked: false },
        { id: 'mat-shade', label: 'Wavu wa kivuli wa kilimo', checked: false },
        { id: 'mat-gunny', label: 'Magunia mazito', checked: false },
      ],
    },
    {
      id: 'dr-step-2',
      stepNumber: 2,
      totalSteps: DARKROOM_TOTAL,
      title: 'Weka alama na chimba mashimo',
      instruction:
        'Piga mistari ya mstari wa chumba. Chimba mashimo ya nguzo kina cha angalau mita moja na nusu, na uhakikishe nguzo zimesimama wima.',
      imagePlaceholderLabel: 'Picha ya hatua',
      materials: [
        { id: 'mat-jembe', label: 'Jembe au punje', checked: false },
        { id: 'mat-rope', label: 'Kamba ya kuimarisha', checked: false },
      ],
    },
    {
      id: 'dr-step-3',
      stepNumber: 3,
      totalSteps: DARKROOM_TOTAL,
      title: 'Tengeneza fremu ya nguzo',
      instruction:
        'Weka nguzo kwenye mashimo na shikilia kwa mchanga na maji. Unganisha nguzo za juu kwa boriti za mbao ili kuunda fremu imara.',
      imagePlaceholderLabel: 'Picha ya hatua',
      materials: [{ id: 'mat-timber', label: 'Boriti za mbao', checked: false }],
    },
    {
      id: 'dr-step-4',
      stepNumber: 4,
      totalSteps: DARKROOM_TOTAL,
      title: 'Jenga kuta za magunia',
      instruction:
        'Funika upande wa pembe na mbao, kisha jenga kuta kwa magunia yaliyojazwa udongo uliokauka. Acha mlango mmoja upande wa upepo.',
      imagePlaceholderLabel: 'Picha ya hatua',
      materials: [
        { id: 'mat-gunny-wall', label: 'Magunia ya kuta', checked: false },
        { id: 'mat-soil', label: 'Udongo uliokauka', checked: false },
      ],
    },
    {
      id: 'dr-step-5',
      stepNumber: 5,
      totalSteps: DARKROOM_TOTAL,
      title: 'Funika paa',
      instruction:
        'Tengeneza mbao za paa na ambatanisha kwa boriti. Paa liwe na mteremko wa chini kwa upande mmoja ili maji yasikae juu.',
      imagePlaceholderLabel: 'Picha ya hatua',
      materials: [{ id: 'mat-roof', label: 'Mbao za paa', checked: false }],
    },
    {
      id: 'dr-step-6',
      stepNumber: 6,
      totalSteps: DARKROOM_TOTAL,
      title: 'Weka wavu wa kivuli',
      instruction:
        'Funika paa na upande wa jua kwa wavu wa asilimia sabini. Siga wavu kwa kamba ili uweze kufunguliwa kwa matengenezo.',
      imagePlaceholderLabel: 'Picha ya hatua',
      materials: [{ id: 'mat-net', label: 'Wavu wa kivuli 70%', checked: false }],
    },
    {
      id: 'dr-step-7',
      stepNumber: 7,
      totalSteps: DARKROOM_TOTAL,
      title: 'Ongeza uingizaji hewa',
      instruction:
        'Kata mianya midogo chini ya kuta na juu ya mlango ili hewa iingie na kutoka. Epuka mianya inayoingiza mwanga wa moja kwa moja.',
      imagePlaceholderLabel: 'Picha ya hatua',
      materials: [],
    },
    {
      id: 'dr-step-8',
      stepNumber: 8,
      totalSteps: DARKROOM_TOTAL,
      title: 'Andaa sakafu na rafu',
      instruction:
        'Safisha sakafu na weka mpukuto wa changarawe au zege. Weka rafu za mbao kwa mkebe na chombo — rafu ziwe angalau sentimita arobaini juu ya sakafu.',
      imagePlaceholderLabel: 'Picha ya hatua',
      materials: [
        { id: 'mat-gravel', label: 'Changarawe au zege', checked: false },
        { id: 'mat-shelves', label: 'Rafu za mbao', checked: false },
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
        title: 'Maandalizi ya substrate',
        summary:
          'Changanya nyasi, kifusi cha nta, na magamba ya mpunga. Ongeza kiasi cha maji ili kufikia unyevunyevu unaofaa.',
      },
      {
        id: 'prod-stage-2',
        order: 2,
        title: 'Kunyunyizia maji',
        summary:
          'Nyunyiza maji ya uvuguvugu kila siku chini ya kivuli. Epuka maji kuacha kwenye pakiti.',
      },
      {
        id: 'prod-stage-3',
        order: 3,
        title: 'Kuchomoza (pinning)',
        summary:
          'Angalia vichomozo vidogo. Ongeza hewa safi kidogo na dumisha unyevu sawa.',
      },
      {
        id: 'prod-stage-4',
        order: 4,
        title: 'Kuvuna',
        summary:
          'Vuna uyoga wakati ubonyeo bado umebaki. Geuza kidole kwa upole ili usiumize.',
      },
      {
        id: 'prod-stage-5',
        order: 5,
        title: 'Kukausha kwa jua',
        summary:
          'Kausha kwa kivuli ya jua ya asubuhi au hewa ya kutosha. Usiweke kwenye jua kali la mchana.',
      },
    ],
    healthCards: [
      {
        id: 'health-1',
        label: 'Mycelium yenye afya',
        kind: 'healthy',
        note: 'Mtando mweupe na kamili. Harufu ya udongo mbichi.',
        imagePlaceholderLabel: 'Picha ya mfano',
      },
      {
        id: 'health-2',
        label: 'Uyoga mzuri tayari kuvunwa',
        kind: 'healthy',
        note: 'Kofia zenye rangi sawa, bila madoa ya manjano.',
        imagePlaceholderLabel: 'Picha ya mfano',
      },
      {
        id: 'health-3',
        label: 'Ukungu wa kijani',
        kind: 'problem',
        note: 'Uso wa kijani kibichi wenye mavumbi. Harufu ya kusisimua.',
        imagePlaceholderLabel: 'Picha ya mfano',
      },
      {
        id: 'health-4',
        label: 'Kuoza kwa substrate',
        kind: 'problem',
        note: 'Sehemu nyeusi zenye maji mengi. Substrate inanuka uoza.',
        imagePlaceholderLabel: 'Picha ya mfano',
      },
    ],
    source: 'mock',
  };
}
