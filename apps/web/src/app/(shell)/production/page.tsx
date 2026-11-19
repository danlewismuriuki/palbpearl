'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { PlantHealthCard, ProductionStage } from '@palbpearl/api-contract';
import { FormErrorBanner } from '@/components/FormErrorBanner';
import { ImagePlaceholder } from '@/components/ImagePlaceholder';
import { WarningGlyph } from '@/components/WarningGlyph';
import { getProductionGuide } from '@/lib/data-client';
import { useDebugQuery } from '@/lib/use-debug-query';

type LoadState = 'loading' | 'success' | 'error';
type TabId = 'sops' | 'doctor';

function CheckGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
    </svg>
  );
}

export default function ProductionGuidePage() {
  const { forceLoadError } = useDebugQuery();
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [stages, setStages] = useState<ProductionStage[]>([]);
  const [healthCards, setHealthCards] = useState<PlantHealthCard[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>('sops');

  const load = useCallback(async () => {
    if (forceLoadError) {
      setStages([]);
      setHealthCards([]);
      setLoadState('error');
      return;
    }
    setLoadState('loading');
    try {
      const result = await getProductionGuide();
      setStages(result.stages);
      setHealthCards(result.healthCards);
      setLoadState('success');
    } catch {
      setStages([]);
      setHealthCards([]);
      setLoadState('error');
    }
  }, [forceLoadError]);

  useEffect(() => {
    void load();
  }, [load]);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'sops', label: 'SOPs' },
    { id: 'doctor', label: 'Plant Doctor' },
  ];

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {loadState === 'error' ? (
        <FormErrorBanner
          heading="Could not load"
          onRetry={() => void load()}
          retryLabel="Retry"
        >
          Could not load the guide. Please try again.
        </FormErrorBanner>
      ) : null}

      {loadState === 'loading' ? (
        <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
          <div className="flex gap-2">
            <div className="h-12 flex-1 animate-pulse rounded-lg bg-divider" />
            <div className="h-12 flex-1 animate-pulse rounded-lg bg-divider" />
          </div>
          <div className="h-20 w-full animate-pulse rounded-xl bg-divider" />
          <div className="h-20 w-full animate-pulse rounded-xl bg-divider" />
          <div className="h-20 w-full animate-pulse rounded-xl bg-divider" />
        </div>
      ) : null}

      {loadState === 'success' ? (
        <>
          <div
            role="tablist"
            aria-label="Production guide"
            className="flex min-h-12 gap-1 rounded-xl border border-border bg-surface-elevated p-1"
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
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-12 flex-1 items-center justify-center rounded-lg px-2 text-button font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                    selected
                      ? 'bg-surface text-brand-primary shadow-sm'
                      : 'text-text-secondary'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'sops' ? (
            <div
              id="panel-sops"
              role="tabpanel"
              aria-labelledby="tab-sops"
              className="flex min-w-0 flex-col gap-3"
            >
              {stages.length === 0 ? (
                <EmptyTab message="No stages available" onRetry={() => void load()} />
              ) : (
                <ul className="flex flex-col gap-3">
                  {stages.map((stage) => (
                    <li key={stage.id}>
                      {/* TODO: replace href with /production/sop/[id] when route exists */}
                      <Link
                        href="#"
                        className="flex min-h-12 w-full min-w-0 gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                      >
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-secondary/15 text-label font-bold text-brand-secondary"
                          aria-hidden
                        >
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
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          {activeTab === 'doctor' ? (
            <div
              id="panel-doctor"
              role="tabpanel"
              aria-labelledby="tab-doctor"
              className="min-w-0"
            >
              {healthCards.length === 0 ? (
                <EmptyTab
                  message="No diagnostic images available"
                  onRetry={() => void load()}
                />
              ) : (
                <ul className="grid min-w-0 grid-cols-2 gap-3">
                  {healthCards.map((card) => (
                    <li key={card.id} className="min-w-0">
                      <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                        <div className="relative pb-3">
                          <ImagePlaceholder
                            label={card.imagePlaceholderLabel}
                            aspect="4/3"
                            className="rounded-b-none rounded-t-xl"
                          />
                          <StatusBadge kind={card.kind} overlap />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
                          <h3 className="break-words text-label font-bold text-text-primary">
                            {card.label}
                          </h3>
                          <p className="break-words text-body-small text-text-secondary">
                            {card.note}
                          </p>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function StatusBadge({
  kind,
  overlap = false,
}: {
  kind: 'healthy' | 'problem';
  overlap?: boolean;
}) {
  const isHealthy = kind === 'healthy';
  return (
    <span
      className={`inline-flex min-h-8 max-w-full flex-wrap items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-caption font-semibold shadow-sm ${
        isHealthy ? 'text-success' : 'text-error'
      } ${overlap ? 'absolute bottom-0 right-2 translate-y-1/2' : ''}`}
    >
      {isHealthy ? <CheckGlyph /> : <WarningGlyph size={14} />}
      <span>{isHealthy ? 'Healthy' : 'Problem'}</span>
    </span>
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
        className="min-h-12 self-start rounded-lg bg-brand-primary px-4 text-button font-bold text-text-on-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Try again
      </button>
    </div>
  );
}