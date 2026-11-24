import type {
  DarkroomGuideResponse,
  FarmerRegistrationRequest,
  FarmerRegistrationResponse,
  HealthCheckResponse,
  HomeSummaryResponse,
  ProductionGuideResponse,
  AskAgronomistRequest,
  AskAgronomistResponse,
  AskDeskResponse,
  MarketPageResponse,
  SupportDeskResponse,
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
      farmerDisplayName: 'Joy Odhiambo',
      greetingLine: 'Habari, Joy!',
      farmerId: 'mock-farmer-001',
      farmUnitLabel: 'Kisumu Oyster Mushroom Unit #1',
      lastSyncedDisplay: 'Today 08:30 AM',
      syncStatus: 'synced',
      pendingCount: 0,
      askCta: {
        title: 'Ask an Agriculture Question',
        subtitle: 'Swahili au Kiingereza • Voice or Chat',
      },
      activeBatch: {
        batchCode: '084',
        varietyLabel: 'Gray Oyster (Pleurotus ostreatus)',
        bagCount: 140,
        temperatureC: 24.2,
        cycleEyebrow: 'Spawn Run Cycle',
        statusLabel: 'Normal',
        dayCurrent: 14,
        dayTotal: 21,
        colonizedPercent: 66,
        bannerAssetPath: '/assets/home/batch-banner.jpg',
        bannerHeadline: 'Gray Oyster • Spawn Run Cycle',
        badgeLabel: 'Active Batch #084',
      },
      incubationTimeline: null,
      microClimate: null,
      navTiles: [
        {
          id: 'farm',
          href: '/darkroom',
          title: 'My Farm',
          caption: 'Active batches, bags & logs',
        },
        {
          id: 'learn',
          href: '/production',
          title: 'Learn SOPs',
          caption: 'Darkrooms, humidity & timing',
        },
        {
          id: 'help',
          href: '/support',
          title: 'Get Help',
          caption: 'Plant Doctor & agronomist',
        },
        {
          id: 'market',
          href: '/market',
          title: 'Market',
          caption: 'Wholesale prices & direct buyers',
        },
      ],
      agronomistTip:
        'Substrate should smell clean and forest-fresh. Never open bags if green spot mold appears.',
      offlineExplainer: {
        title: 'Working offline?',
        body: 'All mushroom batch records & logs save locally and will sync when network returns.',
      },
      todayReminder: {
        id: 'rem-001',
        title: "Today's Inspection",
        cycleStage: 'Day 14 incubation',
        dueEyebrow: 'Day 14 incubation • Due by 12:00 PM',
        instruction:
          'Check substrate moisture and darkroom temperature (maintain 22°C – 26°C). Spray mist on gunny walls if dry.',
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
      title: 'Select a shaded, well-drained site',
      instruction:
        'Pick land under existing trees or beside a hedge so the darkroom stays cool. Sloped ground lets rainwater run off and avoids damp floors in your bags.',
      imagePlaceholderLabel: 'Shelter orientation diagram',
      phaseEyebrow: 'Site preparation',
      moduleLabel: 'Module 2',
      stepPhaseTitle: 'Site selection & layout',
      imageTitle: 'Shelter orientation diagram',
      imageFigureRef: 'Fig 2.1',
      imageCaption:
        'Face the doorway toward the morning breeze and keep the lowest corner on the drainage side.',
      cautionTitle: 'Caution: flood risk',
      cautionBody:
        'Do not build in a low basin or beside a ditch that fills in heavy rain. Raise the floor line at least 15 cm above the surrounding ground.',
      materialsHeading: 'Required materials',
      sitePhotoSlots: 4,
      sitePhotoCount: 3,
      materials: [
        {
          id: 'mat-poles',
          label: 'Treated timber poles',
          checked: true,
          statusLine: 'Ready on site',
        },
        {
          id: 'mat-shade',
          label: 'Farm shade netting',
          checked: true,
          statusLine: 'Purchased — 6 m roll',
        },
        {
          id: 'mat-gunny',
          label: 'Heavy-duty sacks',
          checked: false,
          statusLine: 'Buy before step 4',
        },
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
      title: 'Hang poles and racks',
      instruction:
        'Fix horizontal poles and wire lines inside the shelter. Hang grow bags from the lines and keep them off the floor.',
      imagePlaceholderLabel: 'Step illustration',
      materials: [],
    },
    {
      id: 'dr-step-8',
      stepNumber: 8,
      totalSteps: DARKROOM_TOTAL,
      title: 'Install misting line',
      instruction:
        'Run a simple overhead drip line with fine nozzles. Mist lightly each day to hold humidity without pooling water.',
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
    cropCycleProgress: {
      heading: 'Crop cycle progress',
      stageLabel: 'Stage 4 of 6',
      steps: [
        { id: 'cyc-1', label: '1. Substrate', state: 'completed' },
        { id: 'cyc-2', label: '2. Inoculate', state: 'completed' },
        { id: 'cyc-3', label: '3. Misting', state: 'completed' },
        { id: 'cyc-4', label: '4. Pinning', state: 'current' },
        { id: 'cyc-5', label: '5. Harvest', state: 'upcoming' },
        { id: 'cyc-6', label: '6. Dry', state: 'upcoming' },
      ],
    },
    plantDoctorIntro: {
      title: 'Mushroom disease & health check',
      body:
        'Compare hanging bags to these reference photos before you open the darkroom. Spot contamination early to protect your full yield.',
      offlineNote:
        'Diagnostic library cached offline • Usable in off-grid darkrooms',
    },
    healthCards: [
      {
        id: 'health-1',
        kind: 'healthy',
        visual: 'healthy_mycelium',
        statusBadge: 'Healthy • Pure white',
        batchOverlay: 'Batch #204 • Pin stage',
        title: 'Normal colonization (Day 14)',
        severityPill: 'Optimal',
        note:
          'Thick, white, cotton-like mycelium thread growth across the full bag face.',
        tags: [
          { id: 't1', label: 'Fresh earth smell' },
          { id: 't2', label: 'Fine bead droplet' },
        ],
        actionTitle: 'Recommended action',
        actionBody:
          'Keep humidity at 85–90% and open vents for 10 minutes each morning.',
        imagePlaceholderLabel: 'Healthy substrate bag on rack',
      },
      {
        id: 'health-2',
        kind: 'healthy',
        visual: 'harvest_ready',
        statusBadge: 'Healthy • Ready harvest',
        batchOverlay: 'Batch #118 • Fruiting',
        title: 'Even pin set forming',
        severityPill: 'Optimal',
        note: 'Caps are opening evenly with no yellowing at the edges.',
        tags: [
          { id: 't3', label: 'Earthy mushroom smell' },
          { id: 't4', label: 'Firm bag texture' },
        ],
        actionTitle: 'Recommended action',
        actionBody: 'Harvest within 24 hours while caps are still curved.',
        imagePlaceholderLabel: 'Fruiting bag on rack',
      },
      {
        id: 'health-3',
        kind: 'problem',
        visual: 'green_mold',
        statusBadge: 'Contamination • Green mold',
        batchOverlay: 'High spore risk',
        title: 'Trichoderma viride alert',
        severityPill: 'Infected',
        note:
          'Powdery olive-green dustings with a sour vinegary odor at the patch edge.',
        tags: [
          { id: 't5', label: 'Sour fermented odor' },
          { id: 't6', label: 'Powdery spores' },
        ],
        actionTitle: 'Urgent quarantine action',
        actionBody:
          'Isolate this bag immediately, seal it in a separate sack, and do not open nearby bags.',
        imagePlaceholderLabel: 'Contaminated bag with green mold',
      },
      {
        id: 'health-4',
        kind: 'problem',
        visual: 'substrate_rot',
        statusBadge: 'Contamination • Wet rot',
        batchOverlay: 'Quarantine advised',
        title: 'Substrate rot detected',
        severityPill: 'Infected',
        note: 'Dark wet patches at the bag base with stagnant liquid pooling.',
        tags: [
          { id: 't7', label: 'Rotten smell' },
          { id: 't8', label: 'Stagnant liquid' },
        ],
        actionTitle: 'Urgent quarantine action',
        actionBody:
          'Remove the bag from the rack, drain standing water, and log the batch code.',
        imagePlaceholderLabel: 'Wet rot on substrate bag',
      },
    ],
    plantDoctorPanel: {
      rapidDiagnosticTitle: 'Rapid visual diagnostic',
      rapidDiagnosticAside: 'Quick triage',
      rapidDiagnosticHint:
        'Tap what you observe on your substrate bag right now…',
      rapidDiagnosticPrompt:
        'Tap what you observe on your substrate bag right now to verify immediate risk:',
      rapidDiagnosticOptions: [
        {
          id: 'rd-1',
          tone: 'success',
          label: 'Pure white, dense webbing with mushroom odor',
        },
        {
          id: 'rd-2',
          tone: 'error',
          label: 'Olive green or emerald patches on surface',
        },
        {
          id: 'rd-3',
          tone: 'warning',
          label: 'Yellow fluid droplets or stagnant liquid at base',
        },
      ],
      photoCtaLabel: 'Take Photo to Ask Agronomist',
      urgentCallTitle: 'Urgent contamination call',
      urgentCallSubtitle: 'Toll-free agricultural extension hotline',
      urgentCallAction: 'Call free',
    },
    source: 'mock',
  };
}

export function getSupportDeskMock(): SupportDeskResponse {
  return {
    meta: {
      moduleLabel: 'Module 5 • Agronomy desk',
      storageBadgeLabel: 'Local SQLite',
      pageTitle: 'Submit technical support ticket',
      pageSubtitle:
        'Get direct advice from an agricultural extension officer.',
      categoryAside: 'Extension priority',
      descriptionHint: 'Explain what you see, smell, and when it started.',
      photoSectionLabel: 'Attach photos (up to 3)',
      photoMaxCount: 3,
      voiceSectionLabel: 'Voice description (Swahili or English)',
      voiceAside: 'Audio memo',
      voicePrompt: 'Speak your problem / Officers listen to voice…',
      voiceRecordLabel: 'Record',
      submitLabel: 'Submit ticket',
      submitFootnote: 'Encrypted & queued in local browser storage',
      offlineBannerTitle: 'Offline queue active',
      offlineBannerBody:
        'You are offline. Your ticket will be saved safely in your browser and sent automatically when you have network.',
    },
    farmer: {
      verifiedLabel: 'Verified farm account',
      accountId: 'KBU-0842',
      farmerName: 'Atieno Joy',
      locationLine: 'Kisumu Unit #1 • Oyster shed A',
    },
    categories: [
      {
        value: 'contamination',
        label: 'Substrate contamination & mold',
      },
      { value: 'pests', label: 'Pests & insects' },
      { value: 'humidity', label: 'Humidity & misting' },
      { value: 'temperature', label: 'Temperature stress' },
      { value: 'other', label: 'Other production issue' },
    ],
    defaults: {
      category: 'contamination',
      description:
        'Green powder appeared on 4 bags in Darkroom 1 after second misting. Bags have sour smell.',
      attachments: [
        {
          id: 'att-1',
          fileName: 'bag_photo_01.jpg',
          sizeLabel: '280 KB',
          storedOffline: true,
          visual: 'green_mold_bag',
        },
      ],
    },
    source: 'mock',
  };
}

export function getAskDeskMock(): AskDeskResponse {
  return {
    panel: {
      pageTitle: 'Ask a farming question',
      pageSubtitle:
        'Type a short question about substrate, pests, humidity, or harvest timing.',
      inputLabel: 'Your question',
      inputPlaceholder:
        'e.g. How often should I mist bags during the pinning stage?',
      submitLabel: 'Ask',
      offlineFootnote:
        'Answers are mocked for the demo — a live agronomist model ships in Phase 2.',
    },
    source: 'mock',
  };
}

export function askAgronomistMock(
  req: AskAgronomistRequest
): AskAgronomistResponse {
  const q = req.question.trim();
  return {
    answer:
      q.length === 0
        ? 'Please enter a question first.'
        : `Demo answer: For "${q.slice(0, 80)}${q.length > 80 ? '…' : ''}", keep humidity at 85–90%, ventilate 10 minutes each morning, and log any sour smell or green patches in the darkroom guide.`,
    source: 'mock',
  };
}

export function getMarketPageMock(): MarketPageResponse {
  return {
    content: {
      pageTitle: 'Market',
      body:
        'Wholesale prices, buyer contacts, and harvest booking will live here. This screen confirms navigation from Home and the bottom bar while the market module is being built.',
      backLabel: 'Back to Home →',
    },
    source: 'mock',
  };
}

export function submitSupportTicketMock(
  req: SupportTicketRequest
): SupportTicketResponse {
  const displayTicketId = 'TK-294';
  const emergencyTip =
    req.category === 'contamination'
      ? {
          title: 'Emergency tip: green mold outbreak',
          body:
            'While waiting for officer review, immediately isolate the affected 4 bags outside the darkroom to prevent spores from spreading.',
        }
      : undefined;

  return {
    ticket: {
      ...req,
      id: `mock-ticket-${Date.now()}`,
      displayId: displayTicketId,
      createdAt: new Date().toISOString(),
      status: 'submitted',
    },
    successMeta: {
      displayTicketId,
      statusBadge: 'Queued',
      replyMessage:
        'Ticket submitted — we will reply here via SMS and web notification once officer reviews.',
      smsDispatchPrefix: 'SMS dispatch assigned to:',
      smsOfficerName: 'Agrono…',
      emergencyTip,
    },
    source: 'mock',
  };
}