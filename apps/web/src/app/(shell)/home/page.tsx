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
    <div className="flex flex-col gap-6">
      {loadState === 'error' ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-error/30 bg-error/10 p-4"
        >
          <p className="text-body text-text-primary">
            Imeshindikana kupakia dashibodi. Angalia muunganisho na ujaribu tena.
          </p>
          <button
            type="button"
            onClick={() => void load()}
            className="min-h-12 self-start rounded-lg bg-brand-primary px-4 text-button font-bold text-text-on-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            Jaribu tena
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
        <section className="flex flex-col gap-4" aria-live="polite">
          <div className="min-w-0">
            <h2 className="break-words text-h1 font-bold text-text-primary">
              Habari, {summary.farmerDisplayName}
            </h2>
            <p className="mt-1 text-body text-text-secondary">
              {syncStatusLine(summary, browserOffline)}
            </p>
          </div>

          {summary.todayReminder ? (
            <article className="rounded-xl border border-border bg-surface p-4 shadow-sm">
              <p className="text-label font-semibold text-brand-secondary">
                {summary.todayReminder.cycleStage}
              </p>
              <h3 className="mt-1 text-h3 font-bold text-text-primary">
                {summary.todayReminder.title}
              </h3>
            </article>
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-surface-elevated p-4 text-body text-text-secondary">
              No task scheduled for today
            </p>
          )}
        </section>
      ) : null}

      <section className="grid grid-cols-2 gap-3">
        <TileLink href="/darkroom" label="Shamba Yangu (My Farm)" />
        <TileLink href="/production" label="Jifunze (Learn)" />
        <TileLink href="/support" label="Msaada (Get Help)" />
        {/* TODO: Market → /market */}
        <TileLink href="#" label="Soko (Market)" />
      </section>

      <Link
        href="#"
        className="flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 text-button font-bold text-text-on-brand shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Ask a question
      </Link>
    </div>
  );
}

function TileLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-24 min-w-0 items-center justify-center rounded-xl border border-border bg-surface p-4 text-center text-body font-semibold text-text-primary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      {label}
    </Link>
  );
}