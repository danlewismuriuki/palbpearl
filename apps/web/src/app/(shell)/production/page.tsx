'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type {
  CropCycleProgress,
  PlantDoctorIntro,
  PlantDoctorPanel,
  PlantHealthCard,
  ProductionStage,
} from '@palbpearl/api-contract';
import { FormErrorBanner } from '@/components/FormErrorBanner';
import { WarningGlyph } from '@/components/WarningGlyph';
import { getProductionGuide } from '@/lib/data-client';
import { useDebugQuery } from '@/lib/use-debug-query';

type LoadState = 'loading' | 'success' | 'error';
type TabId = 'sops' | 'doctor';

export default function ProductionGuidePage() {
  const { forceLoadError } = useDebugQuery();
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [stages, setStages] = useState<ProductionStage[]>([]);
  const [healthCards, setHealthCards] = useState<PlantHealthCard[]>([]);
  const [intro, setIntro] = useState<PlantDoctorIntro | null>(null);
  const [cropProgress, setCropProgress] = useState<CropCycleProgress | null>(
    null
  );
  const [doctorPanel, setDoctorPanel] = useState<PlantDoctorPanel | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('doctor');
  const [phase2Photo, setPhase2Photo] = useState(false);
  const [phase2Call, setPhase2Call] = useState(false);

  const load = useCallback(async () => {
    if (forceLoadError) {
      setStages([]);
      setHealthCards([]);
      setIntro(null);
      setCropProgress(null);
      setDoctorPanel(null);
      setLoadState('error');
      return;
    }
    setLoadState('loading');
    setPhase2Photo(false);
    setPhase2Call(false);
    try {
      const result = await getProductionGuide();
      setStages(result.stages);
      setHealthCards(result.healthCards);
      setIntro(result.plantDoctorIntro ?? null);
      setCropProgress(result.cropCycleProgress ?? null);
      setDoctorPanel(result.plantDoctorPanel ?? null);
      setLoadState('success');
    } catch {
      setStages([]);
      setHealthCards([]);
      setIntro(null);
      setCropProgress(null);
      setDoctorPanel(null);
      setLoadState('error');
    }
  }, [forceLoadError]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="flex min-w-0 flex-col gap-3 overflow-x-hidden">
      {loadState === 'error' ? (
        <FormErrorBanner
          heading="Could not load"
          onRetry={() => void load()}
          retryLabel="Retry"
        >
          Could not load the guide. Please try again.
        </FormErrorBanner>
      ) : null}

      {loadState === 'loading' ? <ProductionSkeleton /> : null}

      {loadState === 'success' ? (
        <>
          <ProductionTabBar activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'sops' ? (
            <SopsPanel stages={stages} onRetry={() => void load()} />
          ) : (
            <DoctorPanel
              cropProgress={cropProgress}
              intro={intro}
              healthCards={healthCards}
              panel={doctorPanel}
              phase2Photo={phase2Photo}
              phase2Call={phase2Call}
              onPhotoClick={() => setPhase2Photo(true)}
              onCallClick={() => setPhase2Call(true)}
              onRetry={() => void load()}
            />
          )}
        </>
      ) : null}
    </div>
  );
}

function ProductionTabBar({
  activeTab,
  onChange,
}: {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}) {
  const tabs: { id: TabId; label: string }[] = [
    { id: 'sops', label: 'SOP guides' },
    { id: 'doctor', label: 'Plant Doctor' },
  ];

  return (
    <div
      role="tablist"
      aria-label="Production guide"
      className="flex min-h-12 gap-1 rounded-lg border border-border bg-accent/15 p-1"
    >
      {tabs.map((tab) => {
        const selected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`flex min-h-12 min-w-0 flex-1 items-center justify-center gap-1 rounded-md px-2 text-button font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
              selected
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary'
            }`}
          >
            {tab.id === 'sops' ? (
              <SopTabGlyph className="h-4 w-4 shrink-0" />
            ) : (
              <DoctorTabGlyph className="h-4 w-4 shrink-0" />
            )}
            <span className="truncate">{tab.label}</span>
            {tab.id === 'doctor' && selected ? (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary"
                aria-hidden
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function SopsPanel({
  stages,
  onRetry,
}: {
  stages: ProductionStage[];
  onRetry: () => void;
}) {
  return (
    <div
      id="panel-sops"
      role="tabpanel"
      aria-labelledby="tab-sops"
      className="flex min-w-0 flex-col gap-3"
    >
      {stages.length === 0 ? (
        <EmptyTab message="No stages available" onRetry={onRetry} />
      ) : (
        <ul className="flex flex-col gap-3">
          {stages.map((stage) => (
            <li key={stage.id}>
              <Link
                href="#"
                className="flex min-h-12 w-full min-w-0 items-center gap-3 rounded-lg border border-border bg-surface p-3 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/20 text-label font-bold text-brand-secondary">
                  {stage.order}
                </span>
                <span className="min-w-0 flex-1">
                  <h3 className="text-h3 font-bold text-text-primary">
                    {stage.title}
                  </h3>
                  <p className="mt-1 text-body text-text-secondary">
                    {stage.summary}
                  </p>
                </span>
                <ChevronGlyph className="h-5 w-5 shrink-0 text-text-secondary" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DoctorPanel({
  cropProgress,
  intro,
  healthCards,
  panel,
  phase2Photo,
  phase2Call,
  onPhotoClick,
  onCallClick,
  onRetry,
}: {
  cropProgress: CropCycleProgress | null;
  intro: PlantDoctorIntro | null;
  healthCards: PlantHealthCard[];
  panel: PlantDoctorPanel | null;
  phase2Photo: boolean;
  phase2Call: boolean;
  onPhotoClick: () => void;
  onCallClick: () => void;
  onRetry: () => void;
}) {
  return (
    <div
      id="panel-doctor"
      role="tabpanel"
      aria-labelledby="tab-doctor"
      className="flex min-w-0 flex-col gap-3"
    >
      {cropProgress ? <CropProgressStrip progress={cropProgress} /> : null}
      {intro ? <PlantDoctorIntroCard intro={intro} /> : null}

      {healthCards.length === 0 ? (
        <EmptyTab
          message="No diagnostic images available"
          onRetry={onRetry}
        />
      ) : (
        <ul className="flex min-w-0 flex-col gap-3">
          {healthCards.map((card) => (
            <li key={card.id} className="min-w-0">
              <DiagnosticCard card={card} />
            </li>
          ))}
        </ul>
      )}

      {panel ? (
        <>
          <RapidDiagnosticBlock panel={panel} />
          <button
            type="button"
            onClick={onPhotoClick}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-brand-secondary px-3 text-button font-bold text-text-on-brand shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            <CameraGlyph className="h-5 w-5 shrink-0" />
            {panel.photoCtaLabel}
          </button>
          {phase2Photo ? (
            <p
              className="rounded-md bg-accent/20 px-3 py-2 text-body text-text-secondary"
              role="status"
            >
              Camera capture is coming in Phase 2
            </p>
          ) : null}

          <button
            type="button"
            onClick={onCallClick}
            className="flex min-h-12 w-full items-start gap-3 rounded-lg border border-border bg-surface p-3 text-left shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-brand-secondary">
              <PhoneGlyph className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-label font-bold text-text-primary">
                {panel.urgentCallTitle}
              </span>
              <span className="mt-0.5 block text-body-small text-text-secondary">
                {panel.urgentCallSubtitle}
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-label font-semibold text-brand-secondary">
                {panel.urgentCallAction}
                <ChevronGlyph className="h-4 w-4" />
              </span>
            </span>
          </button>
          {phase2Call ? (
            <p
              className="rounded-md bg-accent/20 px-3 py-2 text-body text-text-secondary"
              role="status"
            >
              Outbound calls are coming in Phase 2
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function CropProgressStrip({ progress }: { progress: CropCycleProgress }) {
  return (
    <section className="min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1 text-caption font-bold uppercase tracking-wider text-brand-secondary">
          <TargetGlyph className="h-4 w-4 shrink-0" />
          {progress.heading}
        </p>
        <span className="shrink-0 rounded-full bg-accent/20 px-2 py-0.5 text-caption font-bold uppercase text-brand-secondary">
          {progress.stageLabel}
        </span>
      </div>
      <ul className="mt-2 flex min-w-0 gap-2 overflow-x-auto pb-1">
        {progress.steps.map((step) => (
          <li key={step.id} className="shrink-0">
            <span
              className={`inline-flex min-h-8 items-center gap-1 rounded-full border px-2 py-1 text-caption font-semibold ${
                step.state === 'completed'
                  ? 'border-brand-secondary/40 bg-success/15 text-success'
                  : step.state === 'current'
                    ? 'border-brand-secondary bg-accent/25 text-brand-secondary'
                    : 'border-border bg-surface text-text-secondary'
              }`}
            >
              {step.state === 'completed' ? (
                <CheckGlyph className="h-3.5 w-3.5" />
              ) : null}
              {step.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PlantDoctorIntroCard({ intro }: { intro: PlantDoctorIntro }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-3 shadow-sm">
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-brand-secondary">
          <ShieldGlyph className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-h3 font-bold text-text-primary">{intro.title}</h2>
          <p className="mt-1 text-body text-text-secondary">{intro.body}</p>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-2 rounded-md bg-accent/15 px-3 py-2 text-body-small font-medium text-brand-secondary">
        <CloudGlyph className="h-4 w-4 shrink-0" />
        {intro.offlineNote}
      </p>
    </article>
  );
}

function DiagnosticCard({ card }: { card: PlantHealthCard }) {
  const isHealthy = card.kind === 'healthy';

  return (
    <article className="min-w-0 overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
      <div className="relative aspect-[16/10] w-full min-w-0 bg-surface-elevated">
        <BagVisual visual={card.visual} />
        <StatusBadgeOverlay kind={card.kind} label={card.statusBadge} />
        <span
          className={`absolute bottom-2 right-2 max-w-[calc(100%-0.5rem)] truncate rounded-md px-1.5 py-0.5 text-caption font-bold uppercase shadow-sm ${
            isHealthy
              ? 'bg-text-primary/85 text-text-on-brand'
              : 'bg-warning/90 text-text-primary'
          }`}
        >
          {card.batchOverlay}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-h3 font-bold text-text-primary">{card.title}</h3>
          <span
            className={`rounded-full px-2 py-0.5 text-caption font-bold uppercase ${
              isHealthy
                ? 'bg-success/15 text-success'
                : 'bg-error/15 text-error'
            }`}
          >
            {card.severityPill}
          </span>
        </div>
        <p className="text-body text-text-secondary">{card.note}</p>
        <ul className="flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <li key={tag.id}>
              <span
                className={`inline-flex min-h-8 items-center rounded-full px-2 py-1 text-caption font-medium ${
                  isHealthy
                    ? 'bg-accent/15 text-brand-secondary'
                    : 'bg-error/10 text-error'
                }`}
              >
                {tag.label}
              </span>
            </li>
          ))}
        </ul>
        <aside
          className={`flex gap-2 rounded-md border p-3 ${
            isHealthy
              ? 'border-success/30 bg-success/10'
              : 'border-error/40 bg-error/10'
          }`}
        >
          {isHealthy ? (
            <CheckGlyph className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          ) : (
            <WarningGlyph className="mt-0.5 h-5 w-5 shrink-0 text-error" size={20} />
          )}
          <div>
            <p
              className={`text-label font-bold ${
                isHealthy ? 'text-success' : 'text-error'
              }`}
            >
              {card.actionTitle}
            </p>
            <p className="mt-1 text-body-small text-text-primary">
              {card.actionBody}
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}

function StatusBadgeOverlay({
  kind,
  label,
}: {
  kind: 'healthy' | 'problem';
  label: string;
}) {
  const isHealthy = kind === 'healthy';
  return (
    <span
      className={`absolute left-2 top-2 z-10 inline-flex max-w-[calc(100%-1rem)] flex-wrap items-center gap-1 rounded-full px-2 py-1 text-caption font-bold uppercase shadow-md ${
        isHealthy
          ? 'bg-success text-text-on-brand'
          : 'bg-error text-text-on-brand'
      }`}
    >
      {isHealthy ? (
        <CheckGlyph className="h-3.5 w-3.5" />
      ) : (
        <WarningGlyph className="text-text-on-brand" size={14} />
      )}
      <span>{label}</span>
    </span>
  );
}

function RapidDiagnosticBlock({ panel }: { panel: PlantDoctorPanel }) {
  return (
    <section className="rounded-lg border border-border bg-accent/15 p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="flex items-center gap-2 text-label font-bold text-text-primary">
          <SlidersGlyph className="h-4 w-4 shrink-0 text-brand-secondary" />
          {panel.rapidDiagnosticTitle}
        </p>
        <span className="text-caption text-text-secondary">
          {panel.rapidDiagnosticAside}
        </span>
      </div>
      <p className="mt-2 text-body-small text-text-secondary">
        {panel.rapidDiagnosticPrompt}
      </p>
      <ul className="mt-2 flex flex-col gap-2">
        {panel.rapidDiagnosticOptions.map((opt) => (
          <li key={opt.id}>
            <button
              type="button"
              className="flex min-h-12 w-full items-center gap-3 rounded-md border border-border bg-surface px-3 text-left text-body text-text-primary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <ToneDot tone={opt.tone} />
              {opt.label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ToneDot({ tone }: { tone: 'success' | 'error' | 'warning' }) {
  const toneClass =
    tone === 'success'
      ? 'text-success'
      : tone === 'error'
        ? 'text-error'
        : 'text-warning';
  return (
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-current ${toneClass}`}
      aria-hidden
    >
      <span className={`h-2.5 w-2.5 rounded-full bg-current`} />
    </span>
  );
}

function BagVisual({ visual }: { visual: PlantHealthCard['visual'] }) {
  switch (visual) {
    case 'healthy_mycelium':
      return <HealthyMyceliumBagSvg className="h-full w-full" />;
    case 'green_mold':
      return <GreenMoldBagSvg className="h-full w-full" />;
    case 'harvest_ready':
      return <HarvestReadyBagSvg className="h-full w-full" />;
    case 'substrate_rot':
      return <SubstrateRotBagSvg className="h-full w-full" />;
  }
}

function HealthyMyceliumBagSvg({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 200" role="img" aria-hidden>
      <BagRackBackdrop />
      <rect x="108" y="48" width="104" height="118" rx="8" className="text-surface" fill="currentColor" opacity="0.9" />
      <rect x="114" y="62" width="92" height="88" rx="4" className="text-brand-primary" fill="currentColor" opacity="0.2" />
      <g className="text-surface" fill="currentColor" opacity="0.95">
        <ellipse cx="145" cy="88" rx="18" ry="14" />
        <ellipse cx="172" cy="78" rx="22" ry="16" />
        <ellipse cx="198" cy="92" rx="20" ry="15" />
        <ellipse cx="160" cy="108" rx="24" ry="18" />
        <ellipse cx="188" cy="118" rx="21" ry="16" />
      </g>
    </svg>
  );
}

function GreenMoldBagSvg({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 200" role="img" aria-hidden>
      <BagRackBackdrop />
      <rect x="108" y="48" width="104" height="118" rx="8" className="text-surface" fill="currentColor" opacity="0.9" />
      <rect x="114" y="62" width="92" height="88" rx="4" className="text-brand-primary" fill="currentColor" opacity="0.2" />
      <g className="text-surface" fill="currentColor" opacity="0.8">
        <ellipse cx="150" cy="95" rx="20" ry="14" />
        <ellipse cx="185" cy="105" rx="22" ry="16" />
      </g>
      <g className="text-error" fill="currentColor" opacity="0.7">
        <circle cx="168" cy="90" r="16" />
        <circle cx="192" cy="102" r="11" />
        <circle cx="178" cy="118" r="9" />
      </g>
      <path
        d="M218 120 L252 95"
        className="text-info"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

function HarvestReadyBagSvg({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 200" role="img" aria-hidden>
      <BagRackBackdrop />
      <rect x="108" y="48" width="104" height="118" rx="8" className="text-surface" fill="currentColor" opacity="0.9" />
      <g className="text-brand-secondary" fill="currentColor" opacity="0.5">
        <ellipse cx="160" cy="108" rx="34" ry="26" />
      </g>
      <g className="text-surface-elevated" fill="currentColor">
        <ellipse cx="148" cy="98" rx="8" ry="12" />
        <ellipse cx="162" cy="94" rx="7" ry="11" />
        <ellipse cx="176" cy="100" rx="8" ry="12" />
      </g>
    </svg>
  );
}

function SubstrateRotBagSvg({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 200" role="img" aria-hidden>
      <BagRackBackdrop />
      <rect x="108" y="48" width="104" height="118" rx="8" className="text-surface" fill="currentColor" opacity="0.9" />
      <rect x="114" y="62" width="92" height="88" rx="4" className="text-brand-primary" fill="currentColor" opacity="0.25" />
      <g className="text-warning" fill="currentColor" opacity="0.55">
        <ellipse cx="162" cy="145" rx="28" ry="10" />
      </g>
      <g className="text-text-primary" fill="currentColor" opacity="0.35">
        <ellipse cx="155" cy="130" rx="22" ry="14" />
      </g>
    </svg>
  );
}

function BagRackBackdrop() {
  return (
  <>
      <rect width="320" height="200" className="text-accent" fill="currentColor" opacity="0.08" />
      <path
        d="M88 170 H232"
        className="text-text-secondary"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.25"
      />
      <path d="M96 170 V140 M224 170 V140" className="text-text-secondary" stroke="currentColor" strokeWidth="2" opacity="0.35" />
    </>
  );
}

function ProductionSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-live="polite">
      <div className="flex min-h-12 gap-1 rounded-lg bg-divider p-1">
        <div className="h-10 flex-1 animate-pulse rounded-md bg-surface" />
        <div className="h-10 flex-1 animate-pulse rounded-md bg-surface" />
      </div>
      <div className="h-14 w-full animate-pulse rounded-lg bg-divider" />
      <div className="h-24 w-full animate-pulse rounded-lg bg-divider" />
      <div className="h-56 w-full animate-pulse rounded-lg bg-divider" />
      <div className="h-40 w-full animate-pulse rounded-lg bg-divider" />
    </div>
  );
}

function EmptyTab({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <p className="text-body text-text-primary">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="min-h-12 self-start rounded-md bg-brand-primary px-4 text-button font-bold text-text-on-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Try again
      </button>
    </div>
  );
}

function CheckGlyph({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
    </svg>
  );
}

function SopTabGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h10v2H4v-2z" />
    </svg>
  );
}

function DoctorTabGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l.66-1.73C7.5 18.5 9.5 17 12 17s4.5 1.5 5.63 3.27l.66 1.73 1.89-.66C18.1 16.17 16 10 17 8zM12 2a5 5 0 00-5 5c0 4 5 11 5 11s5-7 5-11a5 5 0 00-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z"
      />
    </svg>
  );
}

function ChevronGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M9.3 6.7 7.9 8.1 12.8 13l-4.9 4.9 1.4 1.4L15.6 13 9.3 6.7z" />
    </svg>
  );
}

function ShieldGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5l-8-3zm-1 14-3.5-3.5 1.4-1.4L11 13.2l4.6-4.6 1.4 1.4L11 16z"
      />
    </svg>
  );
}

function CloudGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.99 5.99 0 000 14h7v-2H6a3 3 0 01-.34-6 1 1 0 00.2-1.33A5 5 0 0112 6a5 5 0 015 5h2a3 3 0 010 6z"
      />
    </svg>
  );
}

function TargetGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 16a6 6 0 110-12 6 6 0 010 12zm0-10a4 4 0 100 8 4 4 0 000-8z"
      />
    </svg>
  );
}

function CameraGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M9.5 4L7.7 6H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-3.7L14.5 4h-5zm2.5 15a5 5 0 110-10 5 5 0 010 10z"
      />
    </svg>
  );
}

function PhoneGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.01l-2.2 2.22z"
      />
    </svg>
  );
}

function SlidersGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M4 6h10v2H4V6zm12 0h4v2h-4V6zM4 11h6v2H4v-2zm8 0h8v2h-8v-2zm-8 5h12v2H4v-2zm14 0h2v2h-2v-2z"
      />
    </svg>
  );
}