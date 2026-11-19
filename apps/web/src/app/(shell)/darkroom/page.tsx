'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DarkroomStep } from '@palbpearl/api-contract';
import { getDarkroomGuide } from '@/lib/data-client';

type LoadState = 'loading' | 'success' | 'error' | 'empty';

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path
        fill="currentColor"
        d="M9.5 4L7.7 6H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-3.7L14.5 4h-5zm2.5 15a5 5 0 110-10 5 5 0 010 10z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
    </svg>
  );
}

export default function DarkroomGuidePage() {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [steps, setSteps] = useState<DarkroomStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [checkedById, setCheckedById] = useState<Record<string, boolean>>({});
  const [photoComingSoon, setPhotoComingSoon] = useState(false);
  const [guideFinished, setGuideFinished] = useState(false);

  const load = useCallback(async () => {
    setLoadState('loading');
    setGuideFinished(false);
    try {
      const result = await getDarkroomGuide();
      if (result.steps.length === 0) {
        setSteps([]);
        setLoadState('empty');
        return;
      }
      setSteps(result.steps);
      const initial: Record<string, boolean> = {};
      for (const step of result.steps) {
        for (const material of step.materials) {
          initial[material.id] = material.checked;
        }
      }
      setCheckedById(initial);
      setStepIndex(0);
      setLoadState('success');
    } catch {
      setSteps([]);
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const currentStep = steps[stepIndex] ?? null;
  const isLastStep = currentStep
    ? currentStep.stepNumber >= currentStep.totalSteps
    : false;

  const progressPercent = useMemo(() => {
    if (!currentStep) return 0;
    return (currentStep.stepNumber / currentStep.totalSteps) * 100;
  }, [currentStep]);

  const goNext = () => {
    if (!currentStep) return;
    if (isLastStep) {
      setGuideFinished(true);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    setGuideFinished(false);
  };

  const goPrev = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
    setGuideFinished(false);
  };

  const toggleMaterial = (id: string) => {
    setCheckedById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {loadState === 'error' ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-error/30 bg-error/10 p-4"
        >
          <p className="text-body text-text-primary">
            Imeshindikana kupakia mwongozo. Angalia muunganisho na ujaribu tena.
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

      {loadState === 'empty' ? (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
          <p className="text-body text-text-primary">Hakuna hatua zilizopatikana</p>
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
          <div className="h-5 w-3/5 animate-pulse rounded-md bg-divider" />
          <div className="h-1 w-full animate-pulse rounded-full bg-divider" />
          <div className="h-40 w-full animate-pulse rounded-xl bg-divider" />
          <div className="h-7 w-4/5 animate-pulse rounded-md bg-divider" />
          <div className="h-16 w-full animate-pulse rounded-md bg-divider" />
          <div className="h-12 w-full animate-pulse rounded-lg bg-divider" />
          <div className="h-12 w-full animate-pulse rounded-lg bg-divider" />
        </div>
      ) : null}

      {loadState === 'success' && currentStep ? (
        <div className="flex min-w-0 flex-col gap-4">
          <div className="min-w-0 rounded-xl border border-border bg-surface p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-label font-bold text-brand-secondary">
                Hatua {currentStep.stepNumber} kati ya {currentStep.totalSteps}
              </p>
              <span className="text-caption font-semibold text-text-secondary">
                Moduli 02
              </span>
            </div>
            <div
              className="mt-3 h-1 min-h-1 w-full overflow-hidden rounded-full bg-divider"
              role="progressbar"
              aria-valuenow={currentStep.stepNumber}
              aria-valuemin={1}
              aria-valuemax={currentStep.totalSteps}
              aria-label="Maendeleo ya mwongozo"
            >
              <div
                className="h-full rounded-full bg-brand-secondary transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex aspect-video w-full min-w-0 items-center justify-center rounded-xl border border-border bg-surface-elevated p-4">
            <p className="text-center text-body-small text-text-secondary">
              Picha ya hatua
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-border bg-surface p-4 shadow-sm">
            <h2 className="text-h2 font-bold text-text-primary">{currentStep.title}</h2>
            <p className="mt-3 text-body text-text-primary">{currentStep.instruction}</p>
          </div>

          {currentStep.materials.length > 0 ? (
            <section className="rounded-xl border border-border bg-surface p-4 shadow-sm">
              <h3 className="text-h3 font-semibold text-text-primary">
                Vifaa vinavyohitajika
              </h3>
              <ul className="mt-3 flex flex-col gap-1">
                {currentStep.materials.map((material) => {
                  const checked = checkedById[material.id] ?? false;
                  return (
                    <li key={material.id}>
                      <button
                        type="button"
                        onClick={() => toggleMaterial(material.id)}
                        className="flex min-h-12 w-full min-w-0 items-center gap-3 rounded-lg px-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                            checked
                              ? 'border-brand-primary bg-brand-primary text-text-on-brand'
                              : 'border-border bg-surface'
                          }`}
                          aria-hidden
                        >
                          {checked ? <CheckIcon /> : null}
                        </span>
                        <span className="min-w-0 flex-1 text-body text-text-primary">
                          {material.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setPhotoComingSoon(true)}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 text-button font-semibold text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <CameraIcon />
              Hifadhi picha ya chumba
            </button>
            {photoComingSoon ? (
              <p
                className="rounded-lg bg-accent/20 px-4 py-3 text-body text-text-secondary"
                role="status"
              >
                Upigaji picha unakuja katika Awamu ya 2
              </p>
            ) : null}
          </div>

          {guideFinished ? (
            <p
              className="rounded-lg bg-success/15 px-4 py-3 text-body font-medium text-success"
              role="status"
            >
              Umekamilisha mwongozo wa ujenzi wa chumba cha giza.
            </p>
          ) : null}

          <div className="flex flex-col gap-2 pb-2">
            <button
              type="button"
              onClick={goNext}
              className="flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 text-button font-bold text-text-on-brand shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              {isLastStep ? 'Maliza mwongozo' : 'Hatua inayofuata'}
            </button>
            {stepIndex > 0 ? (
              <button
                type="button"
                onClick={goPrev}
                className="min-h-12 w-full text-button font-semibold text-brand-secondary underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                Hatua iliyopita
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}