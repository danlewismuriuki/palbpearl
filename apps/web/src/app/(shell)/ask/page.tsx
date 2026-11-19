'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useId, useState } from 'react';
import type { AskAgronomistPanel } from '@palbpearl/api-contract';
import { FormErrorBanner } from '@/components/FormErrorBanner';
import { askAgronomist, getAskDesk } from '@/lib/data-client';
import { useDebugQuery } from '@/lib/use-debug-query';

type LoadState = 'loading' | 'success' | 'error';
type AskState = 'idle' | 'asking' | 'answered' | 'error';

export default function AskPage() {
  const { forceLoadError } = useDebugQuery();
  const formId = useId();
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [panel, setPanel] = useState<AskAgronomistPanel | null>(null);
  const [question, setQuestion] = useState('');
  const [askState, setAskState] = useState<AskState>('idle');
  const [answer, setAnswer] = useState<string | null>(null);
  const [phase2Voice, setPhase2Voice] = useState(false);

  const load = useCallback(async () => {
    if (forceLoadError) {
      setPanel(null);
      setLoadState('error');
      return;
    }
    setLoadState('loading');
    try {
      const result = await getAskDesk();
      setPanel(result.panel);
      setLoadState('success');
    } catch {
      setPanel(null);
      setLoadState('error');
    }
  }, [forceLoadError]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAsk = async () => {
    const trimmed = question.trim();
    if (trimmed.length < 5) {
      setAnswer('Add at least 5 characters so we can show a demo answer.');
      setAskState('answered');
      return;
    }
    setAskState('asking');
    setAnswer(null);
    try {
      const result = await askAgronomist({ question: trimmed });
      setAnswer(result.answer);
      setAskState('answered');
    } catch {
      setAskState('error');
    }
  };

  const handleAsk = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runAsk();
  };

  if (loadState === 'loading') {
    return (
      <div className="flex min-w-0 flex-col gap-3" aria-busy="true">
        <div className="h-10 w-full animate-pulse rounded-md bg-divider" />
        <div className="h-32 w-full animate-pulse rounded-lg bg-divider" />
      </div>
    );
  }

  if (loadState === 'error' || !panel) {
    return (
      <FormErrorBanner
        heading="Could not load"
        onRetry={() => void load()}
        retryLabel="Retry"
      >
        Could not load the ask screen. Please try again.
      </FormErrorBanner>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 overflow-x-hidden">
      <header>
        <h2 className="text-h2 font-bold text-text-primary">{panel.pageTitle}</h2>
        <p className="mt-1 text-body text-text-secondary">{panel.pageSubtitle}</p>
      </header>

      <form onSubmit={handleAsk} className="flex min-w-0 flex-col gap-3">
        <label
          htmlFor={`${formId}-question`}
          className="text-label font-medium text-text-primary"
        >
          {panel.inputLabel}
        </label>
        <textarea
          id={`${formId}-question`}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          placeholder={panel.inputPlaceholder}
          className="min-h-24 w-full min-w-0 max-w-full resize-y rounded-lg border border-border bg-accent/15 px-4 py-3 text-body text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        <button
          type="submit"
          disabled={askState === 'asking'}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 text-button font-bold text-text-on-brand shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60"
        >
          {askState === 'asking' ? 'Thinking…' : panel.submitLabel}
        </button>
      </form>

      {askState === 'error' ? (
        <FormErrorBanner
          heading="Could not ask"
          onRetry={() => void runAsk()}
          retryLabel="Retry"
        >
          Could not get an answer. Try again.
        </FormErrorBanner>
      ) : null}

      {answer ? (
        <section
          className="rounded-lg border border-border bg-surface p-3 shadow-sm"
          aria-live="polite"
        >
          <p className="text-label font-bold text-text-primary">Answer</p>
          <p className="mt-2 text-body text-text-secondary">{answer}</p>
        </section>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setPhase2Voice(true)}
          className="flex min-h-12 items-center justify-center gap-1 rounded-md bg-brand-primary px-2 text-label font-bold text-text-on-brand shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          Record voice
        </button>
        <Link
          href="/support"
          className="flex min-h-12 items-center justify-center gap-1 rounded-md bg-accent/30 px-2 text-label font-bold text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          Write message
        </Link>
      </div>
      {phase2Voice ? (
        <p
          className="rounded-md bg-accent/20 px-3 py-2 text-body text-text-secondary"
          role="status"
        >
          Voice recording is coming in Phase 2
        </p>
      ) : null}

      <p className="text-body-small text-text-secondary">{panel.offlineFootnote}</p>

      <Link
        href="/home"
        className="inline-flex min-h-12 items-center text-body font-semibold text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Back to Home →
      </Link>
    </div>
  );
}