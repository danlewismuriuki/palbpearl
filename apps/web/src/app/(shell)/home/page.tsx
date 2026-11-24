'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { HomeSummary } from '@palbpearl/api-contract';
import { FormErrorBanner } from '@/components/FormErrorBanner';
import { getHomeSummary } from '@/lib/data-client';
import { useDebugQuery } from '@/lib/use-debug-query';

type LoadState = 'loading' | 'success' | 'error';

export default function HomePage() {
  const { forceLoadError } = useDebugQuery();
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [summary, setSummary] = useState<HomeSummary | null>(null);
  const [browserOffline, setBrowserOffline] = useState(false);
  const [completionToast, setCompletionToast] = useState<string | null>(null);
  const [taskPhase2, setTaskPhase2] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (forceLoadError) {
      setSummary(null);
      setLoadState('error');
      return;
    }
    setLoadState('loading');
    try {
      const result = await getHomeSummary();
      setSummary(result.summary);
      setLoadState('success');
    } catch {
      setSummary(null);
      setLoadState('error');
    }
  }, [forceLoadError]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const update = () => {
      setBrowserOffline(
        typeof navigator !== 'undefined' && navigator.onLine === false
      );
    };
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('completed') === 'darkroom') {
      setCompletionToast('Darkroom guide complete');
      params.delete('completed');
      const next = params.toString();
      const url = `${window.location.pathname}${next ? `?${next}` : ''}`;
      window.history.replaceState({}, '', url);
    }
  }, []);

  const showDashboard = loadState === 'success' && summary;

  return (
    <div className="flex min-w-0 flex-col gap-4 overflow-x-hidden">
      {completionToast ? (
        <p
          className="rounded-lg bg-success/15 px-4 py-3 text-body font-medium text-success"
          role="status"
        >
          {completionToast}
        </p>
      ) : null}
      {loadState === 'error' ? (
        <FormErrorBanner
          heading="Could not load"
          onRetry={() => void load()}
          retryLabel="Retry"
        >
          Could not load your dashboard. Check your connection and try again.
        </FormErrorBanner>
      ) : null}

      {loadState === 'loading' ? <HomeSkeleton /> : null}

      {showDashboard ? (
        <section className="flex min-w-0 flex-col gap-4" aria-live="polite">
          <GreetingBlock summary={summary} />
          <SyncBanner summary={summary} browserOffline={browserOffline} />
          <AskCtaCard card={summary.askCta} />
          {summary.activeBatch ? (
            <ActiveBatchBanner batch={summary.activeBatch} />
          ) : null}
          <section className="grid min-w-0 grid-cols-2 gap-3">
            {summary.navTiles.map((tile) => (
              <TileLink key={tile.id} tile={tile} />
            ))}
          </section>
          <InspectionTaskCard
            reminder={summary.todayReminder}
            phase2Message={taskPhase2}
            onPhase2={(kind) =>
              setTaskPhase2(
                kind === 'done'
                  ? 'Task completion logging is coming in Phase 2'
                  : 'Reading logs are coming in Phase 2'
              )
            }
          />
          {summary.agronomistTip ? (
            <AgronomistTipBanner tip={summary.agronomistTip} />
          ) : null}
          <OfflineExplainerCard explainer={summary.offlineExplainer} />
        </section>
      ) : null}
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
      <div className="h-14 w-4/5 animate-pulse rounded-md bg-divider" />
      <div className="h-10 w-full animate-pulse rounded-lg bg-divider" />
      <div className="h-16 w-full animate-pulse rounded-xl bg-divider" />
      <div className="aspect-[16/10] w-full animate-pulse rounded-xl bg-divider" />
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-square w-full animate-pulse rounded-xl bg-divider"
          />
        ))}
      </div>
      <div className="h-48 w-full animate-pulse rounded-xl bg-divider" />
    </div>
  );
}

function GreetingBlock({ summary }: { summary: HomeSummary }) {
  return (
    <div className="min-w-0 pt-1">
      <h2 className="break-words text-h1 font-bold leading-tight text-text-primary">
        {summary.greetingLine}
      </h2>
      <p className="mt-1 text-body-small text-text-secondary">
        {summary.farmUnitLabel}
      </p>
    </div>
  );
}

function SyncBanner({
  summary,
  browserOffline,
}: {
  summary: HomeSummary;
  browserOffline: boolean;
}) {
  const offline = browserOffline || summary.syncStatus === 'offline';
  const pending = !offline && summary.pendingCount > 0;
  const detail = offline
    ? 'Offline — changes will sync later'
    : pending
      ? `${summary.pendingCount} changes pending sync`
      : `All data synced (Last sync: ${summary.lastSyncedDisplay})`;

  return (
    <article
      className={`flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 ${
        offline ? 'bg-warning/15' : 'bg-accent/20'
      }`}
    >
      <CheckCircleGlyph
        className={`h-5 w-5 shrink-0 ${offline ? 'text-warning' : 'text-success'}`}
      />
      <p className="min-w-0 text-body-small font-medium text-text-primary">
        {detail}
      </p>
    </article>
  );
}

function AskCtaCard({ card }: { card: HomeSummary['askCta'] }) {
  return (
    <Link
      href="/ask"
      className="flex min-h-16 min-w-0 items-center gap-3 rounded-xl bg-brand-secondary px-4 py-3 text-text-on-brand shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface/15">
        <MicGlyph className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-label font-bold leading-tight">
          {card.title}
        </span>
        <span className="mt-0.5 block text-caption opacity-90">
          {card.subtitle}
        </span>
      </span>
      <ChevronGlyph className="h-5 w-5 shrink-0 opacity-90" />
    </Link>
  );
}

function ActiveBatchBanner({
  batch,
}: {
  batch: NonNullable<HomeSummary['activeBatch']>;
}) {
  return (
    <article className="relative min-w-0 overflow-hidden rounded-xl shadow-sm">
      <img
        src={batch.bannerAssetPath}
        alt=""
        className="aspect-[16/10] w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-text-primary/85 via-text-primary/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <span className="inline-flex rounded-full bg-surface px-2.5 py-1 text-caption font-bold uppercase tracking-wide text-brand-secondary">
          {batch.badgeLabel}
        </span>
        <p className="mt-2 text-h3 font-bold text-text-on-brand">
          {batch.bannerHeadline}
        </p>
      </div>
    </article>
  );
}

function InspectionTaskCard({
  reminder,
  phase2Message,
  onPhase2,
}: {
  reminder: HomeSummary['todayReminder'];
  phase2Message: string | null;
  onPhase2: (kind: 'done' | 'log') => void;
}) {
  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
      {reminder ? (
        <>
          <p className="flex items-center gap-1.5 text-caption font-bold uppercase tracking-wide text-warning">
            <DropGlyph className="h-4 w-4 shrink-0" />
            {reminder.dueEyebrow}
          </p>
          <h3 className="text-h3 font-bold text-text-primary">{reminder.title}</h3>
          <p className="text-body-small text-text-secondary">
            {reminder.instruction}
          </p>
          <div className="grid min-w-0 grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => onPhase2('done')}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-3 text-button font-bold text-text-on-brand shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <CheckCircleGlyph className="h-5 w-5 shrink-0" />
              Mark Completed
            </button>
            <button
              type="button"
              onClick={() => onPhase2('log')}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent/25 px-3 text-button font-bold text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <TempGlyph className="h-5 w-5 shrink-0" />
              Log Readings
            </button>
          </div>
          {phase2Message ? (
            <p
              className="rounded-md bg-accent/20 px-3 py-2 text-body text-text-secondary"
              role="status"
            >
              {phase2Message}
            </p>
          ) : null}
        </>
      ) : (
        <p className="text-body text-text-secondary">
          No task scheduled for today
        </p>
      )}
    </article>
  );
}

function AgronomistTipBanner({ tip }: { tip: string }) {
  return (
    <aside className="flex min-w-0 items-start gap-3 rounded-xl bg-accent/20 p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-text-on-brand">
        <BulbGlyph className="h-5 w-5" />
      </span>
      <p className="min-w-0 pt-1 text-body-small text-text-secondary">{tip}</p>
    </aside>
  );
}

function OfflineExplainerCard({
  explainer,
}: {
  explainer: HomeSummary['offlineExplainer'];
}) {
  return (
    <article className="flex min-w-0 items-start gap-3 rounded-xl bg-accent/10 p-3">
      <OfflineGlyph className="mt-0.5 h-7 w-7 shrink-0 text-text-secondary" />
      <div className="min-w-0">
        <p className="text-label font-bold text-text-primary">{explainer.title}</p>
        <p className="mt-1 text-body-small text-text-secondary">{explainer.body}</p>
      </div>
    </article>
  );
}

function TileLink({ tile }: { tile: HomeSummary['navTiles'][number] }) {
  const tone =
    tile.id === 'learn'
      ? 'bg-warning/20 text-warning'
      : tile.id === 'help'
        ? 'bg-error/10 text-error'
        : 'bg-accent/20 text-brand-secondary';

  return (
    <Link
      href={tile.href}
      className="flex min-h-[132px] min-w-0 flex-col items-start justify-between rounded-xl border border-border bg-surface p-3 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full ${tone}`}
      >
        <TileGlyph kind={tile.id} />
      </span>
      <span className="mt-3 w-full text-left">
        <span className="block text-label font-bold text-text-primary">
          {tile.title}
        </span>
        <span className="mt-0.5 block text-caption leading-snug text-text-secondary">
          {tile.caption}
        </span>
      </span>
    </Link>
  );
}

function TileGlyph({ kind }: { kind: 'farm' | 'learn' | 'help' | 'market' }) {
  const common = 'h-6 w-6';
  switch (kind) {
    case 'farm':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M12 3c-1.5 3-4 5-4 8a4 4 0 008 0c0-3-2.5-5-4-8zm-1 14.9V21h2v-3.1A6.97 6.97 0 0112 17c-.34 0-.67.04-1 .1z"
          />
        </svg>
      );
    case 'learn':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M4 4h9a2 2 0 012 2v12l-3-2-3 2V6H4v12H2V6a2 2 0 012-2zm11 2h3a2 2 0 012 2v12h-2V8h-3V6z"
          />
        </svg>
      );
    case 'help':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M12 1a5 5 0 00-5 5v2.1A5.5 5.5 0 003 13.5V16h2v-2.5A3.5 3.5 0 018.5 10h7A3.5 3.5 0 0119 13.5V16h2v-2.5A5.5 5.5 0 0017 8.1V6a5 5 0 00-5-5zm-2 18h4v2h-4v-2z"
          />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M3 9l2-4h14l2 4v2H3V9zm1 3h16v8H4v-8zm3 2v4h2v-4H7zm4 0v4h2v-4h-2zm4 0v4h2v-4h-2z"
          />
        </svg>
      );
  }
}

function CheckCircleGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.1 13.39L7.1 11.5l1.41-1.41 2.49 2.49 5.49-5.49 1.41 1.41-6.9 6.9z"
      />
    </svg>
  );
}

function MicGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 14a3 3 0 003-3V6a3 3 0 00-6 0v5a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zm-5 7a7 7 0 006.06-3.5H4.94A7 7 0 0012 18z"
      />
    </svg>
  );
}

function ChevronGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M9.29 6.71L13.58 11l-4.29 4.29L10.71 17l6-6-6-6-1.42 1.71z"
      />
    </svg>
  );
}

function DropGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.69l5.66 5.66a7 7 0 11-9.9 0L12 2.69z"
      />
    </svg>
  );
}

function TempGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M15 13V5a3 3 0 00-6 0v8a4 4 0 106 0zm-2 0a2 2 0 11-4 0V5a1 1 0 012 0v8z"
      />
    </svg>
  );
}

function BulbGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M9 21h6v-1H9v1zm3-19a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"
      />
    </svg>
  );
}

function OfflineGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M1 9l2 2a12.9 12.9 0 0118 0l2-2A15.7 15.7 0 0012 5 15.7 15.7 0 001 9zm4 4l2 2a7.1 7.1 0 0110 0l2-2a9.9 9.9 0 00-14 0zm4 4l3 3 3-3a4.2 4.2 0 00-6 0zM3.3 3L2 4.3 19.7 22 21 20.7 3.3 3z"
      />
    </svg>
  );
}
