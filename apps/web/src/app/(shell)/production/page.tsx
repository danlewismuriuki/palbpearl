'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { PlantHealthCard, ProductionStage } from '@palbpearl/api-contract';
import { getProductionGuide } from '@/lib/data-client';

type LoadState = 'loading' | 'success' | 'error';
type TabId = 'sops' | 'doctor';

function CheckGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
    </svg>
  );
}

function WarningGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path
        fill="currentColor"
        d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"
      />
    </svg>
  );
}

export default function ProductionGuidePage() {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [stages, setStages] = useState<ProductionStage[]>([]);
  const [healthCards, setHealthCards] = useState<PlantHealthCard[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>('sops');

  const load = useCallback(async () => {
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
  }, []);

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
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-error/30 bg-error/10 p-4"
        >
          <p className="text-body text-text-primary">
            Could not load the guide. Please try again.
          </p>
          <button
            type="button"
            onClick={() => void load()}
            className="min-h-12 self-start rounded-lg bg-brand-primary px-4 text-button font-bold text-text-on-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            Try again
          </button>
        </div>
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
            className="flex min-h-12 border-b border-divider"
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
                  className={`flex min-h-12 flex-1 items-center justify-center border-b-2 px-2 text-button font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                    selected
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-text-secondary'
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
                        <div className="flex aspect-square w-full min-w-0 items-center justify-center bg-surface-elevated p-2">
                          <span className="text-center text-caption text-text-secondary">
                            {card.imagePlaceholderLabel}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-2 p-3">
                          <h3 className="break-words text-label font-bold text-text-primary">
                            {card.label}
                          </h3>
                          <p className="break-words text-body-small text-text-secondary">
                            {card.note}
                          </p>
                          <StatusBadge kind={card.kind} />
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

function StatusBadge({ kind }: { kind: 'healthy' | 'problem' }) {
  const isHealthy = kind === 'healthy';
  return (
    <span
      className={`inline-flex min-h-8 max-w-full flex-wrap items-center gap-1 rounded-full px-2 py-1 text-caption font-semibold ${
        isHealthy ? 'bg-success/15 text-success' : 'bg-error/15 text-error'
      }`}
    >
      {isHealthy ? <CheckGlyph /> : <WarningGlyph />}
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