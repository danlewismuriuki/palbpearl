'use client';

import { FormEvent, useCallback, useEffect, useId, useRef, useState } from 'react';
import type {
  SupportIssueCategory,
  SupportTicket,
} from '@palbpearl/api-contract';
import { FieldError, inputBorderClass } from '@/components/FieldError';
import { FormErrorBanner } from '@/components/FormErrorBanner';
import { WarningGlyph } from '@/components/WarningGlyph';
import { submitSupportTicket } from '@/lib/data-client';
import { useDebugQuery } from '@/lib/use-debug-query';

// TODO: wire farmerId from HomeSummary in a later pass
const FARMER_ID = 'mock-farmer-001';

type FormValues = {
  category: SupportIssueCategory | '';
  description: string;
  hasPhoto: boolean;
};

type FieldKey = 'category' | 'description';
type FieldErrors = Partial<Record<FieldKey, string>>;
type UiState = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

const EMPTY_FORM: FormValues = {
  category: '',
  description: '',
  hasPhoto: false,
};

const CATEGORY_OPTIONS: { value: SupportIssueCategory; label: string }[] = [
  { value: 'contamination', label: 'Contamination' },
  { value: 'pests', label: 'Pests' },
  { value: 'humidity', label: 'Humidity' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'other', label: 'Other' },
];

const CATEGORY_LABELS: Record<SupportIssueCategory, string> = {
  contamination: 'Contamination',
  pests: 'Pests',
  humidity: 'Humidity',
  temperature: 'Temperature',
  other: 'Other',
};

const FIELD_LABELS: Record<FieldKey, string> = {
  category: 'Issue category',
  description: 'Issue description',
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

function CheckGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
    </svg>
  );
}

const controlBase =
  'min-h-12 w-full max-w-full rounded-lg border bg-surface px-4 text-body text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60';

export default function SupportTicketPage() {
  const { forceLoadError, forceFieldErrors } = useDebugQuery();
  const formId = useId();
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [uiState, setUiState] = useState<UiState>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [successWasOffline, setSuccessWasOffline] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const valuesRef = useRef(values);
  valuesRef.current = values;

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

  const handleBlur = (key: FieldKey) => {
    touchField(key);
  };

  const setCategory = (category: FormValues['category']) => {
    setValues((prev) => {
      const next = { ...prev, category };
      valuesRef.current = next;
      return next;
    });
    setSubmitError(null);
    setUiState((prev) =>
      prev === 'submitting' || prev === 'success'
        ? prev
        : prev === 'error'
          ? 'idle'
          : prev
    );
    setErrors((prev) => {
      if (!prev.category && uiState !== 'validating') return prev;
      const message = validateField('category', {
        ...valuesRef.current,
        category,
      });
      const next = { ...prev };
      if (message) next.category = message;
      else delete next.category;
      return next;
    });
  };

  const setDescription = (description: string) => {
    setValues((prev) => {
      const next = { ...prev, description };
      valuesRef.current = next;
      return next;
    });
    setSubmitError(null);
    setUiState((prev) =>
      prev === 'submitting' || prev === 'success'
        ? prev
        : prev === 'error'
          ? 'idle'
          : prev
    );
    setErrors((prev) => {
      if (!prev.description && uiState !== 'validating') return prev;
      const message = validateField('description', {
        ...valuesRef.current,
        description,
      });
      const next = { ...prev };
      if (message) next.description = message;
      else delete next.description;
      return next;
    });
  };

  const resetForm = () => {
    setValues(EMPTY_FORM);
    setErrors({});
    setUiState('idle');
    setSubmitError(null);
    setTicket(null);
    setSuccessWasOffline(false);
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
      const response = await submitSupportTicket({
        farmerId: FARMER_ID,
        category: values.category as SupportIssueCategory,
        description: values.description.trim(),
        hasPhoto: values.hasPhoto,
      });
      setSuccessWasOffline(
        typeof navigator !== 'undefined' && navigator.onLine === false
      );
      setTicket(response.ticket);
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
  const formDisabled = isSubmitting;
  const descriptionLength = values.description.length;
  const errorEntries = (Object.keys(errors) as FieldKey[]).filter(
    (key) => errors[key]
  );

  if (uiState === 'success' && ticket) {
    const statusLabel = successWasOffline
      ? 'Saved — it will be sent when you have network'
      : 'Submitted — we will reply here';

    return (
      <div className="flex min-w-0 flex-col gap-4">
        <section
          className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm"
          aria-live="polite"
        >
          <h2 className="text-h2 font-bold text-text-primary">
            Ticket created
          </h2>
          <p className="text-body text-text-secondary">
            <span className="font-medium text-text-primary">Number:</span>{' '}
            {ticket.id}
          </p>
          <p className="text-body text-text-secondary">
            <span className="font-medium text-text-primary">Category:</span>{' '}
            {CATEGORY_LABELS[ticket.category]}
          </p>
          <p className="break-words text-body text-text-primary">
            {ticket.description}
          </p>
          <p className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-brand-secondary/15 px-4 text-label font-semibold text-brand-secondary">
            <CheckGlyph />
            {statusLabel}
          </p>
        </section>
        <button
          type="button"
          onClick={resetForm}
          className="min-h-12 w-full rounded-lg border border-border bg-surface px-4 text-button font-semibold text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          Submit another ticket
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      {isOffline ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/15 p-4"
        >
          <WarningGlyph />
          <p className="text-body font-medium text-text-primary">
            You are offline. Your ticket will be saved and sent when you have
            network.
          </p>
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

      <form
        onSubmit={handleSubmit}
        className="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm"
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

        <div className="flex flex-col gap-1">
          <span className="text-label font-medium text-text-secondary">
            Farmer ID
          </span>
          <p className="min-h-12 rounded-lg border border-border bg-surface-elevated px-4 py-3 text-body font-medium text-text-secondary">
            {FARMER_ID}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={fieldId('category')} className="text-label font-medium text-text-primary">
            Issue category
          </label>
          <select
            id={fieldId('category')}
            name="category"
            value={values.category}
            disabled={formDisabled}
            onChange={(e) =>
              setCategory(e.target.value as FormValues['category'])
            }
            onBlur={() => handleBlur('category')}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={
              errors.category ? `${fieldId('category')}-error` : undefined
            }
            className={`${controlBase} h-14 ${inputBorderClass(Boolean(errors.category))}`}
          >
            <option value="">Select…</option>
            {CATEGORY_OPTIONS.map((opt) => (
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
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <label
            htmlFor={fieldId('description')}
            className="text-label font-medium text-text-primary"
          >
            Issue description
          </label>
          <textarea
            id={fieldId('description')}
            name="description"
            value={values.description}
            disabled={formDisabled}
            rows={5}
            maxLength={DESCRIPTION_MAX}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleBlur('description')}
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
          ) : (
            <div className="flex min-w-0 items-center justify-between gap-2">
              <span className="text-body-small text-text-secondary">
                Describe in one or two sentences
              </span>
              <span
                className="shrink-0 text-body-small text-text-secondary"
                aria-live="polite"
              >
                {descriptionLength}/{DESCRIPTION_MAX}
              </span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <button
            type="button"
            disabled={formDisabled}
            onClick={() => {
              if (!values.hasPhoto) {
                setValues((prev) => ({ ...prev, hasPhoto: true }));
              }
            }}
            className="flex min-h-12 w-full max-w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 text-button font-semibold text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60"
          >
            {values.hasPhoto ? (
              <>
                <CheckGlyph />
                Photo added
              </>
            ) : (
              <>
                <CameraGlyph />
                Add photo
              </>
            )}
          </button>
          {values.hasPhoto ? (
            <button
              type="button"
              disabled={formDisabled}
              onClick={() =>
                setValues((prev) => ({ ...prev, hasPhoto: false }))
              }
              className="min-h-12 self-start text-label font-semibold text-brand-secondary underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              Remove
            </button>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-12 w-full max-w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 text-button font-bold text-text-on-brand shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting…' : 'Submit ticket'}
        </button>
        <p className="text-center text-body-small text-text-secondary">
          All tickets are reviewed by a mushroom specialist.
        </p>
      </form>
    </div>
  );
}