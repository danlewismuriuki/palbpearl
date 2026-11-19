'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { HomeSummary } from '@palbpearl/api-contract';
import { FormErrorBanner } from '@/components/FormErrorBanner';
import { getHomeSummary } from '@/lib/data-client';
import { useDebugQuery } from '@/lib/use-debug-query';

type LoadState = 'loading' | 'success' | 'error';

function syncStatusLine(summary: HomeSummary, browserOffline: boolean): string {
  if (browserOffline) return 'Offline — changes will sync later';
  if (summary.syncStatus === 'offline') return 'Offline — changes will sync later';
  if (summary.pendingCount > 0) {
    return `${summary.pendingCount} changes pending sync`;
  }
  return 'All changes synced';
}

function farmerInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
  }
  return displayName.slice(0, 2).toUpperCase();
}

const TILE_CAPTIONS: Record<'farm' | 'learn' | 'help' | 'market', string> = {
  farm: 'Batches & darkroom',
  learn: 'SOPs & guides',
  help: 'Support & tickets',
  market: 'Prices & buyers',
};

export default function HomePage() {
  const { forceLoadError } = useDebugQuery();
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [summary, setSummary] = useState<HomeSummary | null>(null);
  const [browserOffline, setBrowserOffline] = useState(false);

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

  const showDashboard = loadState === 'success' && summary;

  return (
    <div className="flex min-w-0 flex-col gap-3">
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
        <section className="flex min-w-0 flex-col gap-3" aria-live="polite">
          <SyncBanner summary={summary} browserOffline={browserOffline} />
          <GreetingBlock summary={summary} browserOffline={browserOffline} />
          <AiAgronomistCard />
          {summary.activeBatch ? (
            <ActiveBatchCard batch={summary.activeBatch} />
          ) : null}
        </section>
      ) : null}

      {loadState !== 'loading' ? (
        <section className="grid min-w-0 grid-cols-2 gap-3">
          <TileLink href="/darkroom" label="My Farm" kind="farm" />
          <TileLink href="/production" label="Learn" kind="learn" />
          <TileLink href="/support" label="Get Help" kind="help" />
          <MarketTile />
        </section>
      ) : null}

      {showDashboard ? (
        <>
          <InspectionTaskCard reminder={summary.todayReminder} />
          {summary.agronomistTip ? (
            <AgronomistTipBanner tip={summary.agronomistTip} />
          ) : null}
          <OfflineExplainerCard />
        </>
      ) : null}
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-live="polite">
      <div className="h-14 w-full animate-pulse rounded-lg bg-divider" />
      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-7 w-4/5 animate-pulse rounded-md bg-divider" />
          <div className="h-4 w-3/5 animate-pulse rounded-md bg-divider" />
          <div className="h-4 w-full animate-pulse rounded-md bg-divider" />
        </div>
        <div className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-divider" />
      </div>
      <div className="h-36 w-full animate-pulse rounded-lg bg-divider" />
      <div className="h-40 w-full animate-pulse rounded-lg bg-divider" />
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-square w-full animate-pulse rounded-lg bg-divider"
          />
        ))}
      </div>
      <div className="h-44 w-full animate-pulse rounded-lg bg-divider" />
      <div className="h-24 w-full animate-pulse rounded-lg bg-divider" />
      <div className="h-20 w-full animate-pulse rounded-lg bg-divider" />
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

  const eyebrow = offline
    ? 'Offline'
    : pending
      ? 'Sync pending'
      : 'Sync active';

  const detail = offline
    ? 'Changes save on this phone and sync when you are back online.'
    : pending
      ? `${summary.pendingCount} changes pending sync`
      : `All data synced (${summary.lastSyncedDisplay})`;

  return (
    <article className="flex min-h-12 items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2 shadow-sm">
      <CheckCircleGlyph
        className={`h-6 w-6 shrink-0 ${offline ? 'text-warning' : 'text-success'}`}
      />
      <div className="min-w-0 flex-1">
        <p
          className={`text-caption font-bold uppercase tracking-wide ${
            offline ? 'text-warning' : 'text-success'
          }`}
        >
          {eyebrow}
        </p>
        <p className="text-body-small text-text-primary">{detail}</p>
      </div>
      {!offline ? (
        <CloudDoneGlyph className="h-6 w-6 shrink-0 text-brand-secondary" />
      ) : null}
    </article>
  );
}

function GreetingBlock({
  summary,
  browserOffline,
}: {
  summary: HomeSummary;
  browserOffline: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <h2 className="break-words text-h1 font-bold leading-tight text-text-primary">
          Hello, {summary.farmerDisplayName}
        </h2>
        <p className="mt-1 text-body-small text-text-secondary">
          {syncStatusLine(summary, browserOffline)}
        </p>
        <p className="mt-1 flex items-start gap-1 text-body-small text-text-secondary">
          <MapPinGlyph className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" />
          <span>{summary.farmUnitLabel}</span>
        </p>
      </div>
      <span
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated text-label font-bold text-brand-secondary shadow-sm"
        aria-hidden
      >
        {farmerInitials(summary.farmerDisplayName)}
      </span>
    </div>
  );
}

function AiAgronomistCard() {
  return (
    <article className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-3 shadow-sm">
      <div className="flex items-start gap-2">
        <AgronomistGlyph className="h-8 w-8 shrink-0 text-brand-secondary" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-h3 font-bold text-text-primary">
              Ask a farming question
            </h3>
            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-caption font-bold uppercase tracking-wide text-brand-secondary">
              AI agronomist
            </span>
          </div>
          <p className="mt-1 text-body-small text-text-secondary">
            Get guidance on substrate, pests, or harvest timing without leaving
            the farm.
          </p>
        </div>
      </div>
      <Link
        href="#"
        data-cta="ask"
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-3 text-button font-bold text-text-on-brand shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        {/* TODO: wire agronomist chat route when available */}
        <MicGlyph className="h-5 w-5" />
        Ask a question
      </Link>
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="#"
          className="flex min-h-12 items-center justify-center gap-1 rounded-md bg-brand-primary px-2 text-label font-bold text-text-on-brand shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          <MicGlyph className="h-5 w-5 shrink-0" />
          Record voice
        </Link>
        <Link
          href="#"
          className="flex min-h-12 items-center justify-center gap-1 rounded-md bg-accent/30 px-2 text-label font-bold text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          <MessageGlyph className="h-5 w-5 shrink-0" />
          Write message
        </Link>
      </div>
    </article>
  );
}

function ActiveBatchCard({
  batch,
}: {
  batch: NonNullable<HomeSummary['activeBatch']>;
}) {
  return (
    <article className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-caption font-bold uppercase tracking-wide text-text-secondary">
          {batch.cycleEyebrow}
        </p>
        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-caption font-semibold text-success">
          <span aria-hidden>●</span>
          {batch.statusLabel}
        </span>
      </div>
      <BatchRow
        batchCode={batch.batchCode}
        varietyLabel={batch.varietyLabel}
        bagCount={batch.bagCount}
        temperatureC={batch.temperatureC}
      />
      <div className="h-2 w-full overflow-hidden rounded-full bg-accent/20">
        <div
          className="h-full rounded-full bg-brand-secondary"
          style={{ width: `${batch.colonizedPercent}%` }}
          role="progressbar"
          aria-valuenow={batch.colonizedPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="flex justify-between text-caption font-medium text-text-secondary">
        <span>
          Day {batch.dayCurrent} of {batch.dayTotal}
        </span>
        <span>{batch.colonizedPercent}% colonized</span>
      </div>
    </article>
  );
}

function BatchRow({
  batchCode,
  varietyLabel,
  bagCount,
  temperatureC,
}: {
  batchCode: string;
  varietyLabel: string;
  bagCount: number;
  temperatureC: number;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-md border border-border bg-surface-elevated">
        <BagGlyph className="h-7 w-7 text-brand-secondary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-label font-bold text-text-primary">
          Active batch #{batchCode}
        </p>
        <p className="text-body-small text-text-secondary">{varietyLabel}</p>
        <div className="mt-1 flex flex-wrap gap-3 text-caption font-semibold text-text-secondary">
          <span className="inline-flex items-center gap-1">
            <BagGlyph className="h-4 w-4 text-brand-secondary" />
            {bagCount} bags
          </span>
          <span className="inline-flex items-center gap-1">
            <TempGlyph className="h-4 w-4 text-brand-secondary" />
            {temperatureC}°C
          </span>
        </div>
      </div>
    </div>
  );
}

function InspectionTaskCard({
  reminder,
}: {
  reminder: HomeSummary['todayReminder'];
}) {
  return (
    <article className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-3 shadow-sm">
      {reminder ? (
        <>
          <p className="text-caption font-bold uppercase tracking-wide text-warning">
            {reminder.dueEyebrow}
          </p>
          <h3 className="text-h3 font-bold text-text-primary">
            {reminder.title}
          </h3>
          <p className="text-body-small text-text-secondary">
            {reminder.instruction}
          </p>
          <div className="rounded-md border border-border bg-accent/15 p-3">
            <p className="text-caption font-bold text-brand-secondary">
              {reminder.humidityTargetLabel}
            </p>
            <p className="text-label font-bold text-text-primary">
              {reminder.humidityRange}
            </p>
          </div>
          <TaskActionButtons />
        </>
      ) : (
        <p className="text-body text-text-secondary">
          No task scheduled for today
        </p>
      )}
    </article>
  );
}

function TaskActionButtons() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        className="flex min-h-12 items-center justify-center gap-1 rounded-md bg-brand-primary px-2 text-label font-bold text-text-on-brand shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        <CheckCircleGlyph className="h-5 w-5" />
        Mark done
      </button>
      <button
        type="button"
        className="flex min-h-12 items-center justify-center gap-1 rounded-md bg-accent/30 px-2 text-label font-bold text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        <ListGlyph className="h-5 w-5" />
        Log readings
      </button>
    </div>
  );
}

function AgronomistTipBanner({ tip }: { tip: string }) {
  return (
    <aside className="flex gap-3 rounded-lg border border-border bg-accent/15 p-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-text-on-brand">
        <BulbGlyph className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-label font-bold text-text-primary">
          Agronomist tip
        </p>
        <p className="mt-1 text-body-small text-text-secondary">{tip}</p>
      </div>
    </aside>
  );
}

function OfflineExplainerCard() {
  return (
    <article className="flex gap-3 rounded-lg border border-border bg-surface p-3 shadow-sm">
      <StorageGlyph className="h-8 w-8 shrink-0 text-text-secondary" />
      <div>
        <p className="text-label font-bold text-text-primary">
          Working offline?
        </p>
        <p className="mt-1 text-body-small text-text-secondary">
          Forms and photos save on this phone. They upload automatically when
          you are back online.
        </p>
      </div>
    </article>
  );
}

function TileLink({
  href,
  label,
  kind,
}: {
  href: string;
  label: string;
  kind: 'farm' | 'learn' | 'help';
}) {
  return (
    <Link
      href={href}
      className="flex aspect-square min-w-0 flex-col items-center justify-center gap-1 rounded-lg border border-border bg-surface p-2 text-center shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15">
        <TileGlyph kind={kind} />
      </span>
      <span className="text-label font-bold text-text-primary">{label}</span>
      <span className="text-caption leading-tight text-text-secondary">
        {TILE_CAPTIONS[kind]}
      </span>
    </Link>
  );
}

function MarketTile() {
  return (
    <span
      aria-disabled="true"
      className="flex aspect-square min-w-0 flex-col items-center justify-center gap-1 rounded-lg border border-border bg-surface p-2 text-center opacity-75 shadow-sm"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10">
        <TileGlyph kind="market" />
      </span>
      <span className="text-label font-bold text-text-primary">Market</span>
      <span className="text-caption font-semibold text-text-secondary">
        Coming soon
      </span>
    </span>
  );
}

function TileGlyph({ kind }: { kind: 'farm' | 'learn' | 'help' | 'market' }) {
  const common = 'h-6 w-6 text-brand-secondary';
  switch (kind) {
    case 'farm':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M4 20h16v-2H4v2zm2-8h4v6H6v-6zm6 0h4v6h-4v-6zM3 10l3-6h12l3 6v2H3v-2z"
          />
        </svg>
      );
    case 'learn':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 13.5L4 12v5l8 4.5 8-4.5v-5l-8 4.5z"
          />
        </svg>
      );
    case 'help':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V9.5c0-1.66 3-1.54 3 0V13z"
          />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7.17 14h9.66l2.5-7H4.67l2.5 7zM6 6h15l-1 4H7L6 6z"
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

function CloudDoneGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.99 5.99 0 000 14c0 3.31 2.69 6 6 6h11c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17l5.59-5.59L17 10l-7 7z"
      />
    </svg>
  );
}

function MapPinGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 11.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5zm7.43 2.08l-4.77 8.18A2 2 0 0013 22h-2a2 2 0 00-1.66-.92l-4.77-8.18A7 7 0 0112 5a7 7 0 017.43 8.58z"
      />
    </svg>
  );
}

function AgronomistGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19a7 7 0 00-5.6 11.1l.9.9H6v3h12v-3h-1.3l.9-.9A7 7 0 0012 2zm0 4a3 3 0 013 3h-2a1 1 0 00-2 0H9a3 3 0 013-3z"
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

function MessageGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M20 2H4a2 2 0 00-2 2v14l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm0 12H6.83L4 16.83V4h16v10z"
      />
    </svg>
  );
}

function BagGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M6 7V5a6 6 0 1112 0v2h2v14H4V7h2zm2 0h8V5a4 4 0 00-8 0v2z"
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

function ListGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M3 6h2v2H3V6zm0 5h2v2H3v-2zm0 5h2v2H3v-2zm4-10h14v2H7V6zm0 5h14v2H7v-2zm0 5h14v2H7v-2z"
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

function StorageGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M2 20h20v-4H2v4zm2-6h16V6H4v8zm2-6h4v2H6V8zm0 3h6v2H6v-2z"
      />
    </svg>
  );
}