'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { MarketPlaceholderContent } from '@palbpearl/api-contract';
import { FormErrorBanner } from '@/components/FormErrorBanner';
import { getMarketPage } from '@/lib/data-client';
import { useDebugQuery } from '@/lib/use-debug-query';

type LoadState = 'loading' | 'success' | 'error';

export default function MarketPage() {
  const { forceLoadError } = useDebugQuery();
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [content, setContent] = useState<MarketPlaceholderContent | null>(null);

  const load = useCallback(async () => {
    if (forceLoadError) {
      setContent(null);
      setLoadState('error');
      return;
    }
    setLoadState('loading');
    try {
      const result = await getMarketPage();
      setContent(result.content);
      setLoadState('success');
    } catch {
      setContent(null);
      setLoadState('error');
    }
  }, [forceLoadError]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loadState === 'loading') {
    return (
      <div className="flex min-w-0 flex-col gap-3" aria-busy="true">
        <div className="h-8 w-3/4 animate-pulse rounded-md bg-divider" />
        <div className="h-24 w-full animate-pulse rounded-lg bg-divider" />
      </div>
    );
  }

  if (loadState === 'error' || !content) {
    return (
      <FormErrorBanner
        heading="Could not load"
        onRetry={() => void load()}
        retryLabel="Retry"
      >
        Could not load the market page. Please try again.
      </FormErrorBanner>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 overflow-x-hidden">
      <header>
        <h2 className="text-h2 font-bold text-text-primary">
          {content.pageTitle}
        </h2>
        <p className="mt-2 rounded-lg border border-border bg-accent/15 px-3 py-2 text-label font-semibold text-brand-secondary">
          Coming soon
        </p>
      </header>
      <p className="text-body text-text-secondary">{content.body}</p>
      <Link
        href="/home"
        className="inline-flex min-h-12 items-center text-body font-semibold text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        {content.backLabel}
      </Link>
    </div>
  );
}