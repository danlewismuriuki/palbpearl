'use client';

import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type {
  SupportCategoryOption,
  SupportDemoAttachment,
  SupportDeskMeta,
  SupportDeskResponse,
  SupportFarmerContext,
  SupportIssueCategory,
  SupportTicketResponse,
  SupportTicketSuccessMeta,
} from '@palbpearl/api-contract';
import { FieldError, inputBorderClass } from '@/components/FieldError';
import { FormErrorBanner } from '@/components/FormErrorBanner';
import { WarningGlyph } from '@/components/WarningGlyph';
import { getSupportDesk, submitSupportTicket } from '@/lib/data-client';
import { useDebugQuery } from '@/lib/use-debug-query';

type FormValues = {
  category: SupportIssueCategory | '';
  description: string;
};

type FieldKey = 'category' | 'description';
type FieldErrors = Partial<Record<FieldKey, string>>;
type UiState = 'idle' | 'validating' | 'submitting' | 'success' | 'error';
type DeskLoadState = 'loading' | 'success' | 'error';

const EMPTY_FORM: FormValues = {
  category: '',
  description: '',
};

const FIELD_LABELS: Record<FieldKey, string> = {
  category: 'Issue category',
  description: 'Describe the problem',
};

const DESCRIPTION_MIN = 10;
const DESCRIPTION_MAX = 500;

function validateField(key: FieldKey, values: FormValues): string | undefined {
  switch (key) {
    case 'category':
      if (!values.category) return 'Choose an issue category';
      return undefined;
    case 'description': {
      const len = values.description.trim().length;
      if (len === 0) {
        return 'Describe the issue in one or two sentences (10–500 characters)';
      }
      if (len < DESCRIPTION_MIN) {
        return 'Add more detail — at least 10 characters required';
      }
      if (len > DESCRIPTION_MAX) {
        return 'Shorten the description — maximum 500 characters';
      }
      return undefined;
    }
    default:
      return undefined;
  }
}

function validateAll(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  (['category', 'description'] as const).forEach((key) => {
    const message = validateField(key, values);
    if (message) errors[key] = message;
  });
  return errors;
}

const controlBase =
  'min-h-12 w-full min-w-0 max-w-full rounded-lg border bg-accent/15 px-4 text-body text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60';

export default function SupportTicketPage() {
  const { forceLoadError, forceFieldErrors } = useDebugQuery();
  const formId = useId();
  const [deskLoadState, setDeskLoadState] = useState<DeskLoadState>('loading');
  const [meta, setMeta] = useState<SupportDeskMeta | null>(null);
  const [farmer, setFarmer] = useState<SupportFarmerContext | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<SupportCategoryOption[]>(
    []
  );
  const [photoMax, setPhotoMax] = useState(3);
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [attachments, setAttachments] = useState<SupportDemoAttachment[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [uiState, setUiState] = useState<UiState>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<SupportTicketResponse | null>(
    null
  );
  const [successWasOffline, setSuccessWasOffline] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [phase2Photo, setPhase2Photo] = useState(false);
  const [phase2Voice, setPhase2Voice] = useState(false);
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const farmerIdRef = useRef('mock-farmer-001');

  const loadDesk = useCallback(async () => {
    if (forceLoadError) {
      setDeskLoadState('error');
      setMeta(null);
      setFarmer(null);
      return;
    }
    setDeskLoadState('loading');
    try {
      const desk: SupportDeskResponse = await getSupportDesk();
      setMeta(desk.meta);
      setFarmer(desk.farmer);
      setCategoryOptions(desk.categories);
      setPhotoMax(desk.meta.photoMaxCount);
      setValues({
        category: desk.defaults.category,
        description: desk.defaults.description,
      });
      setAttachments(desk.defaults.attachments);
      farmerIdRef.current = desk.farmer.accountId;
      setDeskLoadState('success');
    } catch {
      setDeskLoadState('error');
    }
  }, [forceLoadError]);

  useEffect(() => {
    void loadDesk();
  }, [loadDesk]);

  useEffect(() => {
    const update = () => {
      setIsOffline(
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
    if (forceLoadError) {
      setSubmitError(
        'Could not submit the ticket. Check your connection and try again.'
      );
      setUiState('error');
    }
  }, [forceLoadError]);

  useEffect(() => {
    if (forceFieldErrors) {
      setErrors({
        category: 'Choose an issue category',
        description:
          'Describe the issue in one or two sentences (10–500 characters)',
      });
      setUiState('validating');
    }
  }, [forceFieldErrors]);

  const fieldId = useCallback((key: FieldKey) => `${formId}-${key}`, [formId]);

  const touchField = (key: FieldKey) => {
    setSubmitError(null);
    setUiState((prev) =>
      prev === 'submitting' || prev === 'success'
        ? prev
        : prev === 'error'
          ? 'idle'
          : 'validating'
    );
    setErrors((prev) => {
      const next = { ...prev };
      const message = validateField(key, valuesRef.current);
      if (message) next[key] = message;
      else delete next[key];
      return next;
    });
  };

  const setCategory = (category: FormValues['category']) => {
    setValues((prev) => {
      const next = { ...prev, category };
      valuesRef.current = next;
      return next;
    });
    setSubmitError(null);
    touchField('category');
  };

  const setDescription = (description: string) => {
    setValues((prev) => {
      const next = { ...prev, description };
      valuesRef.current = next;
      return next;
    });
    setSubmitError(null);
    if (errors.description || uiState === 'validating') {
      touchField('description');
    }
  };

  const resetForm = () => {
    setValues(EMPTY_FORM);
    setAttachments([]);
    setErrors({});
    setUiState('idle');
    setSubmitError(null);
    setSubmitResult(null);
    setSuccessWasOffline(false);
    setPhase2Photo(false);
    setPhase2Voice(false);
    void loadDesk();
  };

  const runSubmit = async () => {
    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setUiState('validating');
      setSubmitError(null);
      const firstKey = (Object.keys(nextErrors) as FieldKey[])[0];
      if (firstKey) document.getElementById(fieldId(firstKey))?.focus();
      return;
    }

    setUiState('submitting');
    setSubmitError(null);

    try {
      const offline =
        typeof navigator !== 'undefined' && navigator.onLine === false;
      const response = await submitSupportTicket({
        farmerId: farmerIdRef.current,
        category: values.category as SupportIssueCategory,
        description: values.description.trim(),
        hasPhoto: attachments.length > 0,
      });
      setSuccessWasOffline(offline);
      setSubmitResult(response);
      setUiState('success');
    } catch {
      setUiState('error');
      setSubmitError(
        'Could not submit the ticket. Check your connection and try again.'
      );
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runSubmit();
  };

  const isSubmitting = uiState === 'submitting';
  const formDisabled = isSubmitting || deskLoadState !== 'success';
  const descriptionLength = values.description.length;
  const errorEntries = (Object.keys(errors) as FieldKey[]).filter(
    (key) => errors[key]
  );

  if (deskLoadState === 'loading') {
    return <SupportSkeleton />;
  }

  if (deskLoadState === 'error') {
    return (
      <FormErrorBanner
        heading="Could not load"
        onRetry={() => void loadDesk()}
        retryLabel="Retry"
      >
        Could not load the support desk. Please try again.
      </FormErrorBanner>
    );
  }

  if (!meta || !farmer) {
    return null;
  }

  if (uiState === 'success' && submitResult) {
    return (
      <SuccessPanel
        meta={submitResult.successMeta}
        successWasOffline={successWasOffline}
        onAnother={resetForm}
      />
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-3 overflow-x-hidden">
      {isOffline ? (
        <div
          role="status"
          className="flex min-w-0 items-start gap-3 rounded-lg border border-warning/40 bg-warning/20 p-3"
        >
          <OfflineQueueGlyph className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div className="min-w-0">
            <p className="text-label font-bold uppercase tracking-wide text-warning">
              {meta.offlineBannerTitle}
            </p>
            <p className="mt-1 text-body text-text-primary">
              {meta.offlineBannerBody}
            </p>
          </div>
        </div>
      ) : null}

      {submitError ? (
        <FormErrorBanner
          heading="Could not save"
          onRetry={() => void runSubmit()}
          retryLabel="Retry"
        >
          {submitError}
        </FormErrorBanner>
      ) : null}

      <ModuleHeader meta={meta} />

      <FarmerAccountCard farmer={farmer} />

      <form
        onSubmit={handleSubmit}
        className="flex min-w-0 flex-col gap-4"
        noValidate
      >
        {errorEntries.length > 0 && uiState === 'validating' ? (
          <FormErrorBanner heading="Check the form">
            <ul className="flex flex-col gap-1">
              {errorEntries.map((key) => (
                <li key={key}>
                  <a
                    href={`#${fieldId(key)}`}
                    className="text-body text-text-primary underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    {FIELD_LABELS[key]}: {errors[key]}
                  </a>
                </li>
              ))}
            </ul>
          </FormErrorBanner>
        ) : null}

        <FieldBlock>
          <LabelRow>
            <label
              htmlFor={fieldId('category')}
              className="text-label font-semibold text-text-primary"
            >
              Issue category <RequiredMark />
            </label>
            <span className="text-caption font-bold uppercase tracking-wide text-text-secondary">
              {meta.categoryAside}
            </span>
          </LabelRow>
          <select
            id={fieldId('category')}
            name="category"
            value={values.category}
            disabled={formDisabled}
            onChange={(e) =>
              setCategory(e.target.value as FormValues['category'])
            }
            onBlur={() => touchField('category')}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={
              errors.category ? `${fieldId('category')}-error` : undefined
            }
            className={`${controlBase} h-14 appearance-none pr-10 ${inputBorderClass(Boolean(errors.category))}`}
          >
            <option value="">Select…</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.category ? (
            <FieldError
              id={`${fieldId('category')}-error`}
              message={errors.category}
            />
          ) : null}
        </FieldBlock>

        <FieldBlock>
          <LabelRow>
            <label
              htmlFor={fieldId('description')}
              className="text-label font-semibold text-text-primary"
            >
              Describe the problem <RequiredMark />
            </label>
            <span
              className="shrink-0 text-caption font-medium text-text-secondary"
              aria-live="polite"
            >
              {descriptionLength}/{DESCRIPTION_MAX}
            </span>
          </LabelRow>
          <p className="text-body-small text-text-secondary">
            {meta.descriptionHint}
          </p>
          <textarea
            id={fieldId('description')}
            name="description"
            value={values.description}
            disabled={formDisabled}
            rows={4}
            maxLength={DESCRIPTION_MAX}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => touchField('description')}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? `${fieldId('description')}-error` : undefined
            }
            className={`${controlBase} min-h-24 resize-y py-3 ${inputBorderClass(Boolean(errors.description))}`}
          />
          {errors.description ? (
            <FieldError
              id={`${fieldId('description')}-error`}
              message={errors.description}
            />
          ) : null}
        </FieldBlock>

        <FieldBlock>
          <LabelRow>
            <span className="text-label font-semibold text-text-primary">
              {meta.photoSectionLabel}
            </span>
            <span className="text-caption font-semibold text-text-secondary">
              {attachments.length}/{photoMax} saved
            </span>
          </LabelRow>
          {attachments.length > 0 ? (
            <ul className="flex min-w-0 flex-col gap-2">
              {attachments.map((att) => (
                <li key={att.id}>
                  <AttachmentRow
                    attachment={att}
                    disabled={formDisabled}
                    onRemove={() =>
                      setAttachments((prev) =>
                        prev.filter((item) => item.id !== att.id)
                      )
                    }
                  />
                </li>
              ))}
            </ul>
          ) : null}
          <button
            type="button"
            disabled={formDisabled || attachments.length >= photoMax}
            onClick={() => setPhase2Photo(true)}
            className="flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-lg border border-brand-secondary/50 bg-surface px-4 text-button font-semibold text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60"
          >
            <CameraGlyph />
            Add photo from camera or gallery
          </button>
          {phase2Photo ? (
            <p
              className="rounded-md bg-accent/20 px-3 py-2 text-body text-text-secondary"
              role="status"
            >
              Camera and gallery uploads are coming in Phase 2
            </p>
          ) : null}
        </FieldBlock>

        <FieldBlock className="rounded-lg border border-border bg-surface p-3 shadow-sm">
          <LabelRow>
            <span className="text-label font-semibold text-text-primary">
              {meta.voiceSectionLabel}
            </span>
            <span className="text-caption font-bold uppercase tracking-wide text-text-secondary">
              {meta.voiceAside}
            </span>
          </LabelRow>
          <div className="flex min-h-12 min-w-0 items-center gap-3 rounded-lg border border-border bg-accent/10 px-3">
            <MicGlyph className="h-5 w-5 shrink-0 text-brand-secondary" />
            <p className="min-w-0 flex-1 text-body-small text-text-secondary">
              {meta.voicePrompt}
            </p>
            <button
              type="button"
              disabled={formDisabled}
              onClick={() => setPhase2Voice(true)}
              className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-full border border-brand-secondary/40 bg-surface px-3 text-caption font-bold text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <span className="text-error" aria-hidden>
                ●
              </span>
              {meta.voiceRecordLabel}
            </button>
          </div>
          {phase2Voice ? (
            <p
              className="mt-2 rounded-md bg-accent/20 px-3 py-2 text-body text-text-secondary"
              role="status"
            >
              Voice recording is coming in Phase 2
            </p>
          ) : null}
        </FieldBlock>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 text-button font-bold text-text-on-brand shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60"
        >
          <SendGlyph />
          {isSubmitting ? 'Submitting…' : meta.submitLabel}
        </button>
        <p className="flex items-center justify-center gap-2 text-center text-body-small text-text-secondary">
          <LockGlyph className="h-4 w-4 shrink-0" />
          {meta.submitFootnote}
        </p>
      </form>
    </div>
  );
}

function SuccessPanel({
  meta,
  successWasOffline,
  onAnother,
}: {
  meta?: SupportTicketSuccessMeta;
  successWasOffline: boolean;
  onAnother: () => void;
}) {
  const statusLabel = successWasOffline
    ? 'Saved — it will be sent when you have network'
    : 'Submitted — we will reply here';

  return (
    <div className="flex min-w-0 flex-col gap-3 overflow-x-hidden">
      <section
        className="min-w-0 overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
        aria-live="polite"
      >
        <div className="flex min-w-0 flex-wrap items-center gap-2 border-b border-border bg-accent/10 px-3 py-3">
          <CheckCircleGlyph className="h-6 w-6 shrink-0 text-brand-secondary" />
          <h2 className="text-h3 font-bold text-text-primary">
            Ticket #{meta?.displayTicketId ?? '—'} created
          </h2>
          {meta?.statusBadge ? (
            <span className="rounded-full bg-warning/25 px-2 py-0.5 text-caption font-bold uppercase text-warning">
              {meta.statusBadge}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 p-3">
          <p className="text-body text-text-secondary">
            {meta?.replyMessage ??
              'Ticket submitted — we will reply here via SMS and web notification once officer reviews.'}
          </p>
          <p className="inline-flex min-h-12 min-w-0 items-center gap-2 rounded-lg bg-brand-secondary/15 px-3 text-label font-semibold text-brand-secondary">
            <CheckGlyph />
            {statusLabel}
          </p>
          {meta ? (
            <p className="flex min-h-12 min-w-0 items-center gap-2 rounded-md bg-accent/20 px-3 text-body-small text-text-primary">
              <SmsGlyph className="h-5 w-5 shrink-0 text-brand-secondary" />
              <span>
                {meta.smsDispatchPrefix}{' '}
                <strong className="font-bold">{meta.smsOfficerName}</strong>
              </span>
            </p>
          ) : null}
        </div>
      </section>

      {meta?.emergencyTip ? (
        <aside className="flex min-w-0 gap-3 rounded-lg border border-warning/40 bg-warning/15 p-3">
          <WarningGlyph className="shrink-0 text-warning" size={20} />
          <div className="min-w-0">
            <p className="text-label font-bold uppercase tracking-wide text-warning">
              {meta.emergencyTip.title}
            </p>
            <p className="mt-1 text-body text-text-primary">
              {meta.emergencyTip.body}
            </p>
          </div>
        </aside>
      ) : null}

      <button
        type="button"
        onClick={onAnother}
        className="min-h-12 w-full min-w-0 rounded-lg border border-border bg-surface px-4 text-button font-semibold text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Submit another ticket
      </button>
    </div>
  );
}

function ModuleHeader({ meta }: { meta: SupportDeskMeta }) {
  return (
    <header className="flex min-w-0 flex-col gap-2">
      <span className="flex flex-wrap items-center gap-2">
        <span className="text-caption font-bold uppercase tracking-wide text-brand-secondary">
          {meta.moduleLabel}
        </span>
        <span className="inline-flex min-h-8 items-center gap-1 rounded-full border border-border bg-surface px-2 text-caption font-semibold text-text-secondary">
          <LockGlyph className="h-3.5 w-3.5" />
          {meta.storageBadgeLabel}
        </span>
      </span>
      <h2 className="text-h2 font-bold text-text-primary">{meta.pageTitle}</h2>
      <p className="text-body text-text-secondary">{meta.pageSubtitle}</p>
    </header>
  );
}

function FarmerAccountCard({ farmer }: { farmer: SupportFarmerContext }) {
  return (
    <article className="min-w-0 rounded-lg border border-border bg-surface p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex min-h-8 items-center gap-1 rounded-full bg-accent/25 px-2 text-caption font-bold text-brand-secondary">
          <CheckGlyph />
          {farmer.verifiedLabel}
        </span>
        <span className="text-caption font-semibold text-text-secondary">
          ID: {farmer.accountId}
        </span>
      </div>
      <div className="mt-3 flex min-w-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/20 text-brand-secondary">
          <TractorGlyph className="h-6 w-6" />
        </span>
        <Stack>
          <span className="text-h3 font-bold text-text-primary">
            {farmer.farmerName}
          </span>
          <span className="flex items-center gap-1 text-body-small text-text-secondary">
            <PinGlyph className="h-4 w-4 shrink-0" />
            {farmer.locationLine}
          </span>
        </Stack>
      </div>
    </article>
  );
}

function AttachmentRow({
  attachment,
  disabled,
  onRemove,
}: {
  attachment: SupportDemoAttachment;
  disabled: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2 shadow-sm">
      <div className="flex h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-surface-elevated">
        <MoldBagThumbSvg className="h-full w-full" />
      </div>
      <Stack className="min-w-0 flex-1">
        <p className="truncate text-label font-semibold text-text-primary">
          {attachment.fileName}
        </p>
        <p className="text-caption text-text-secondary">
          {attachment.sizeLabel}
          {attachment.storedOffline ? ' • ✓ Stored offline' : null}
        </p>
      </Stack>
      <button
        type="button"
        disabled={disabled}
        onClick={onRemove}
        aria-label={`Remove ${attachment.fileName}`}
        className="flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-md text-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60"
      >
        <TrashGlyph />
      </button>
    </div>
  );
}

function MoldBagThumbSvg({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 56 56" role="img" aria-hidden>
      <rect width="56" height="56" className="text-accent" fill="currentColor" opacity="0.15" />
      <rect x="16" y="10" width="24" height="36" rx="4" className="text-surface" fill="currentColor" opacity="0.9" />
      <g className="text-surface" fill="currentColor" opacity="0.85">
        <ellipse cx="26" cy="26" rx="6" ry="5" />
        <ellipse cx="32" cy="30" rx="7" ry="5" />
      </g>
      <g className="text-error" fill="currentColor" opacity="0.75">
        <circle cx="30" cy="24" r="5" />
        <circle cx="34" cy="32" r="4" />
      </g>
    </svg>
  );
}

function FieldBlock({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>{children}</div>
  );
}

function Stack({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`flex min-w-0 flex-col gap-0.5 ${className}`}>{children}</div>;
}

function LabelRow({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 items-center justify-between gap-2 ${className}`}>
      {children}
    </div>
  );
}

function RequiredMark() {
  return (
    <span className="text-error" aria-hidden>
      *
    </span>
  );
}

function SupportSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-3" aria-busy="true" aria-live="polite">
      <div className="h-16 w-full animate-pulse rounded-lg bg-divider" />
      <div className="h-24 w-full animate-pulse rounded-lg bg-divider" />
      <div className="h-12 w-full animate-pulse rounded-lg bg-divider" />
      <div className="h-32 w-full animate-pulse rounded-lg bg-divider" />
    </div>
  );
}

function CheckGlyph({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
    </svg>
  );
}

function CameraGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path
        fill="currentColor"
        d="M9.5 4L7.7 6H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-3.7L14.5 4h-5zm2.5 15a5 5 0 110-10 5 5 0 010 10z"
      />
    </svg>
  );
}

function SendGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path fill="currentColor" d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function LockGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden width="16" height="16">
      <path
        fill="currentColor"
        d="M18 8h-1V6a5 5 0 00-10 0v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zm-6 9a2 2 0 110-4 2 2 0 010 4zm3.1-9H8.9V6a3.1 3.1 0 016.2 0v2z"
      />
    </svg>
  );
}

function MicGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zm-5 9a7 7 0 01-7-7h2a5 5 0 0010 0h2a7 7 0 01-7 7z"
      />
    </svg>
  );
}

function TrashGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
      />
    </svg>
  );
}

function OfflineQueueGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.99 5.99 0 000 14h7v-2H6a3 3 0 01-.34-6 1 1 0 00.2-1.33A5 5 0 0112 6a5 5 0 015 5h2a3 3 0 010 6H8v2h11a3 3 0 001.22-5.96z"
      />
      <path fill="currentColor" d="M3 3l18 18-1.4 1.4L1.6 4.4 3 3z" opacity="0.9" />
    </svg>
  );
}

function CheckCircleGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14-3.5-3.5 1.4-1.4L11 13.2l4.6-4.6 1.4 1.4L11 16z"
      />
    </svg>
  );
}

function SmsGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2z"
      />
    </svg>
  );
}

function TractorGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M5 4v3H3v4h2v9a2 2 0 002 2h1a2 2 0 002-2v-3h6v3a2 2 0 002 2h1a2 2 0 002-2v-9h2V7h-2V4H5zm2 3h6v2H7V7zm11 5H7v2h11v-2z"
      />
    </svg>
  );
}

function PinGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
      />
    </svg>
  );
}