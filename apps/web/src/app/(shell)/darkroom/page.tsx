'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DarkroomStep } from '@palbpearl/api-contract';
import { FormErrorBanner } from '@/components/FormErrorBanner';
import { getDarkroomGuide } from '@/lib/data-client';
import { useDebugQuery } from '@/lib/use-debug-query';

type LoadState = 'loading' | 'success' | 'error' | 'empty';

export default function DarkroomGuidePage() {
  const router = useRouter();
  const { forceLoadError } = useDebugQuery();
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [steps, setSteps] = useState<DarkroomStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [checkedById, setCheckedById] = useState<Record<string, boolean>>({});
  const [photoComingSoon, setPhotoComingSoon] = useState(false);

  const load = useCallback(async () => {
    if (forceLoadError) {
      setSteps([]);
      setLoadState('error');
      return;
    }
    setLoadState('loading');
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
  }, [forceLoadError]);

  useEffect(() => {
    void load();
  }, [load]);

  const currentStep = steps[stepIndex] ?? null;
  const nextStep = steps[stepIndex + 1] ?? null;
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
      router.push('/home?completed=darkroom');
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const goPrev = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const toggleMaterial = (id: string) => {
    setCheckedById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const materialsReadyCount = useMemo(() => {
    if (!currentStep) return 0;
    return currentStep.materials.filter(
      (m) => checkedById[m.id] ?? m.checked
    ).length;
  }, [checkedById, currentStep]);

  const primaryLabel = useMemo(() => {
    if (!currentStep) return 'Next step';
    if (isLastStep) return 'Finish guide';
    const preview =
      nextStep?.stepPhaseTitle ?? nextStep?.title ?? 'Next step';
    return `Next step: ${preview}`;
  }, [currentStep, isLastStep, nextStep]);

  return (
    <div className="flex min-w-0 flex-col gap-3 overflow-x-hidden">
      {loadState === 'error' ? (
        <FormErrorBanner
          heading="Could not load"
          onRetry={() => void load()}
          retryLabel="Retry"
        >
          Could not load the guide. Check your connection and try again.
        </FormErrorBanner>
      ) : null}

      {loadState === 'empty' ? (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
          <p className="text-body text-text-primary">No steps available</p>
          <button
            type="button"
            onClick={() => void load()}
            className="min-h-12 self-start rounded-md bg-brand-primary px-4 text-button font-bold text-text-on-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            Try again
          </button>
        </div>
      ) : null}

      {loadState === 'loading' ? <DarkroomSkeleton /> : null}

      {loadState === 'success' && currentStep ? (
        <div className="flex min-w-0 flex-col gap-3">
          <GuideProgress step={currentStep} progressPercent={progressPercent} />

          <article className="rounded-lg border border-border bg-surface p-3 shadow-sm">
            <p className="flex items-center gap-2 text-caption font-bold uppercase tracking-wider text-brand-secondary">
              <PhaseGlyph className="h-4 w-4 shrink-0" />
              {currentStep.phaseEyebrow ?? 'Darkroom build'}
            </p>
            <h2 className="mt-2 text-h2 font-bold text-text-primary">
              {currentStep.title}
            </h2>
            <p className="mt-2 text-body text-text-primary">
              {currentStep.instruction}
            </p>
          </article>

          <figure className="min-w-0 rounded-lg border border-border bg-surface p-3 shadow-sm">
            <FigHeader
              title={
                currentStep.imageTitle ?? currentStep.imagePlaceholderLabel
              }
              figureRef={currentStep.imageFigureRef}
            />
            <div className="relative mt-2 aspect-[16/9] w-full min-w-0 overflow-hidden rounded-md border border-border bg-accent/10">
              <DarkroomStepImage step={currentStep} />
            </div>
            {currentStep.imageCaption ? (
              <figcaption className="mt-2 flex items-start gap-2 text-body-small text-text-secondary">
                <SunGlyph className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <span>{currentStep.imageCaption}</span>
              </figcaption>
            ) : null}
          </figure>

          {currentStep.cautionTitle && currentStep.cautionBody ? (
            <aside className="flex gap-3 rounded-lg border border-warning/40 bg-warning/15 p-3">
              <WarningGlyph className="h-6 w-6 shrink-0 text-warning" />
              <div className="min-w-0">
                <p className="text-label font-bold uppercase tracking-wide text-warning">
                  {currentStep.cautionTitle}
                </p>
                <p className="mt-1 text-body-small text-text-primary">
                  {currentStep.cautionBody}
                </p>
              </div>
            </aside>
          ) : null}

          {currentStep.materials.length > 0 ? (
            <section className="rounded-lg border border-border bg-surface p-3 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-label font-bold uppercase tracking-wide text-text-primary">
                  {currentStep.materialsHeading ?? 'Materials checklist'}
                </h3>
                <span className="rounded-full bg-success/15 px-2 py-0.5 text-caption font-semibold text-success">
                  {materialsReadyCount} of {currentStep.materials.length} ready
                </span>
              </div>
              <ul className="mt-2 flex flex-col gap-2">
                {currentStep.materials.map((material) => {
                  const checked = checkedById[material.id] ?? material.checked;
                  return (
                    <li key={material.id}>
                      <button
                        type="button"
                        onClick={() => toggleMaterial(material.id)}
                        className="flex min-h-12 w-full min-w-0 items-center gap-3 rounded-md bg-surface-elevated px-3 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 ${
                            checked
                              ? 'border-brand-secondary bg-brand-secondary text-text-on-brand'
                              : 'border-border bg-surface'
                          }`}
                          aria-hidden
                        >
                          {checked ? <CheckIcon /> : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-body font-semibold text-text-primary">
                            {material.label}
                          </span>
                          {material.statusLine ? (
                            <span className="mt-0.5 flex items-center gap-1 text-caption text-text-secondary">
                              <StatusDotGlyph className="h-3 w-3 shrink-0 text-brand-secondary" />
                              {material.statusLine}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <section className="rounded-lg border border-border bg-surface p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-label font-bold text-text-primary">
                Site record
              </h3>
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-caption font-bold uppercase tracking-wide text-brand-secondary">
                {(currentStep.sitePhotoCount ?? 0).toString()} photos local
              </span>
            </div>
            <PhotoGrid
              slots={currentStep.sitePhotoSlots ?? 4}
              filled={currentStep.sitePhotoCount ?? 0}
            />
            <button
              type="button"
              onClick={() => setPhotoComingSoon(true)}
              className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface-elevated px-3 text-button font-semibold text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <CameraIcon />
              Save photo of darkroom
            </button>
            {photoComingSoon ? (
              <p
                className="mt-2 rounded-md bg-accent/20 px-3 py-2 text-body text-text-secondary"
                role="status"
              >
                Camera capture is coming in Phase 2
              </p>
            ) : null}
          </section>

          <div className="flex min-w-0 flex-col gap-2 pb-1">
            <button
              type="button"
              onClick={goNext}
              className="flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-md bg-brand-primary px-3 text-button font-bold text-text-on-brand shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              {primaryLabel}
              {!isLastStep ? (
                <ArrowForwardGlyph className="h-5 w-5 shrink-0" />
              ) : null}
            </button>
            {stepIndex > 0 ? (
              <button
                type="button"
                onClick={goPrev}
                className="min-h-12 w-full text-button font-semibold text-brand-secondary underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                Previous step
              </button>
            ) : null}
          </div>

          <p className="flex items-center justify-center gap-2 px-2 pb-2 text-center text-caption text-text-secondary">
            <OfflineGlyph className="h-4 w-4 shrink-0 text-brand-secondary" />
            Downloaded guide • Available 100% offline in browser
          </p>
        </div>
      ) : null}
    </div>
  );
}

function GuideProgress({
  step,
  progressPercent,
}: {
  step: DarkroomStep;
  progressPercent: number;
}) {
  return (
    <header className="min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-label font-bold uppercase tracking-wide text-text-primary">
          Step {step.stepNumber} of {step.totalSteps}
        </p>
        <span className="text-caption font-semibold text-text-secondary">
          {step.moduleLabel ?? 'Module 2'}
        </span>
      </div>
      <div
        className="mt-2 h-2 min-h-2 w-full min-w-0 overflow-hidden rounded-full bg-divider"
        role="progressbar"
        aria-valuenow={step.stepNumber}
        aria-valuemin={1}
        aria-valuemax={step.totalSteps}
        aria-label="Guide progress"
      >
        <div
          className="h-full max-w-full rounded-full bg-brand-secondary transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="mt-2 text-body-small font-medium text-text-secondary">
        {step.stepPhaseTitle ?? step.title}
      </p>
    </header>
  );
}

function FigHeader({
  title,
  figureRef,
}: {
  title: string;
  figureRef?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <p className="text-label font-bold text-text-primary">{title}</p>
      {figureRef ? (
        <span className="shrink-0 rounded-md bg-surface-elevated px-2 py-0.5 text-caption font-semibold text-text-secondary">
          {figureRef}
        </span>
      ) : null}
    </div>
  );
}

function PhotoGrid({ slots, filled }: { slots: number; filled: number }) {
  const count = Math.min(Math.max(slots, 1), 4);
  return (
    <div className="mt-2 grid min-w-0 grid-cols-4 gap-2">
      {Array.from({ length: count }, (_, i) => {
        const hasPhoto = i < filled;
        return (
          <div
            key={i}
            className={`flex aspect-square min-w-0 items-center justify-center rounded-md border text-caption font-semibold ${
              hasPhoto
                ? 'border-brand-secondary/40 bg-accent/15 text-brand-secondary'
                : 'border-border bg-surface-elevated text-text-secondary'
            }`}
          >
            {hasPhoto ? `#${i + 1}` : i + 1}
          </div>
        );
      })}
    </div>
  );
}

function DarkroomSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-live="polite">
      <div className="h-4 w-1/2 animate-pulse rounded-md bg-divider" />
      <div className="h-2 w-full animate-pulse rounded-full bg-divider" />
      <div className="h-4 w-3/5 animate-pulse rounded-md bg-divider" />
      <div className="h-28 w-full animate-pulse rounded-lg bg-divider" />
      <div className="aspect-[16/9] w-full animate-pulse rounded-lg bg-divider" />
      <div className="h-20 w-full animate-pulse rounded-lg bg-divider" />
      <div className="h-32 w-full animate-pulse rounded-lg bg-divider" />
      <div className="h-28 w-full animate-pulse rounded-lg bg-divider" />
      <div className="h-12 w-full animate-pulse rounded-md bg-divider" />
    </div>
  );
}

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

function PhaseGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 3L1 9l4 2v8h14v-8l4-2-11-6zm0 4.2l6.3 3.4v2.4H5.7V10.6L12 7.2z"
      />
    </svg>
  );
}

function SunGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10 0l1.79-1.8 1.41 1.41-1.8 1.79-1.4-1.4zM12 4V1h-2v3h2zm0 19v-3h-2v3h2zm8-8h3v-2h-3v2zM1 14h3v-2H1v2zm16.24 7.16l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM4.22 18.16l-1.79 1.8 1.41 1.41 1.8-1.79-1.42-1.42zM12 18a6 6 0 110-12 6 6 0 010 12z"
      />
    </svg>
  );
}

function WarningGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  );
}

function StatusDotGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="6" fill="currentColor" />
    </svg>
  );
}

function ArrowForwardGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
      />
    </svg>
  );
}

function OfflineGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.99 5.99 0 000 14c0 3.31 2.69 6 6 6h13v-2H6c-2.66 0-4.77-2.24-4.88-5 .08-2.51 2.19-4.51 4.88-4.51.86 0 1.68.22 2.4.61z"
      />
    </svg>
  );
}

function DarkroomStepImage({ step }: { step: DarkroomStep }) {
  const src = `/assets/darkroom/step-${step.stepNumber}.png`;
  const alt =
    step.imageTitle ?? step.imagePlaceholderLabel ?? `Step ${step.stepNumber}`;
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <StepBuildIllustration className="h-full w-full p-3 text-brand-secondary" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

/** Fallback when a step image fails to load. */
function StepBuildIllustration({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 180" role="img" aria-hidden>
      <g className="text-brand-primary" fill="currentColor">
        <path d="M88 88 L160 48 L248 88 L242 98 L94 98 Z" opacity="0.8" />
        <rect x="98" y="98" width="8" height="58" opacity="0.65" />
        <rect x="150" y="98" width="8" height="58" opacity="0.65" />
        <rect x="202" y="98" width="8" height="58" opacity="0.65" />
      </g>
      <g className="text-brand-secondary" fill="currentColor" opacity="0.25">
        <rect x="106" y="98" width="136" height="58" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  );
}