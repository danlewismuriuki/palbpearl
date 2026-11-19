'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { HomeSummary } from '@palbpearl/api-contract';
import { getHomeSummary } from '@/lib/data-client';

type LoadState = 'loading' | 'success' | 'error';

function syncStatusLine(summary: HomeSummary, browserOffline: boolean): string {
  if (browserOffline) return 'Offline — changes will sync later';
  if (summary.syncStatus === 'offline') return 'Offline — changes will sync later';
  if (summary.pendingCount > 0) {
    return `${summary.pendingCount} changes pending sync`;
  }
  return 'All changes synced';
}

function TileGlyph({ kind }: { kind: 'farm' | 'learn' | 'help' | 'market' }) {
  const common = 'h-10 w-10 text-brand-secondary';
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
    case 'market':
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

export default function HomePage() {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [summary, setSummary] = useState<HomeSummary | null>(null);
  const [browserOffline, setBrowserOffline] = useState(false);

  const load = useCallback(async () => {
    setLoadState('loading');
    try {
      const result = await getHomeSummary();
      setSummary(result.summary);
      setLoadState('success');
    } catch {
      setSummary(null);
      setLoadState('error');
    }
  }, []);

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

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {loadState === 'error' ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-error/30 bg-error/10 p-4"
        >
          <p className="text-body text-text-primary">
            Could not load your dashboard. Check your connection and try again.
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
          <div className="h-8 w-4/5 animate-pulse rounded-md bg-divider" />
          <div className="h-5 w-3/5 animate-pulse rounded-md bg-divider" />
          <div className="h-24 w-full animate-pulse rounded-xl bg-divider" />
        </div>
      ) : null}

      {loadState === 'success' && summary ? (
        <section className="flex min-w-0 flex-col gap-4" aria-live="polite">
          <div className="flex min-h-12 items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="break-words text-h1 font-bold text-text-primary">
                Hello, {summary.farmerDisplayName}
              </h2>
              <p className="mt-1 text-body text-text-secondary">
                {syncStatusLine(summary, browserOffline)}
              </p>
            </div>
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated text-caption font-bold text-text-secondary"
              aria-hidden
            >
              DL
            </span>
          </div>

          <article className="rounded-xl border border-border bg-surface p-4 shadow-sm">
            <h3 className="text-label font-semibold text-text-secondary">
              Today&apos;s task
            </h3>
            {summary.todayReminder ? (
              <>
                <p className="mt-2 text-label font-semibold text-brand-secondary">
                  {summary.todayReminder.cycleStage}
                </p>
                <p className="mt-1 text-h3 font-bold text-text-primary">
                  {summary.todayReminder.title}
                </p>
              </>
            ) : (
              <p className="mt-2 text-body text-text-secondary">
                No task scheduled for today
              </p>
            )}
          </article>
        </section>
      ) : null}

      <section className="grid min-w-0 grid-cols-2 gap-3">
        <TileLink href="/darkroom" label="My Farm" kind="farm" />
        <TileLink href="/production" label="Learn" kind="learn" />
        <TileLink href="/support" label="Get Help" kind="help" />
        <MarketTile />
      </section>

      <Link
        href="/support"
        className="flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 text-button font-bold text-text-on-brand shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Ask a question
      </Link>
    </div>
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
      className="flex min-h-28 min-w-0 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface p-4 text-center shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      <TileGlyph kind={kind} />
      <span className="text-body font-semibold text-text-primary">{label}</span>
    </Link>
  );
}

function MarketTile() {
  return (
    <span
      aria-disabled="true"
      className="flex min-h-28 min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-surface-elevated p-4 text-center opacity-80"
    >
      <TileGlyph kind="market" />
      <span className="text-body font-semibold text-text-primary">Market</span>
      <span className="text-caption text-text-secondary">Coming soon</span>
    </span>
  );
}