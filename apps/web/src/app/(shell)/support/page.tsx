'use client';

import { FormEvent, useCallback, useEffect, useId, useRef, useState } from 'react';
import type {
  SupportIssueCategory,
  SupportTicket,
} from '@palbpearl/api-contract';
import { submitSupportTicket } from '@/lib/data-client';

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
  { value: 'contamination', label: 'Uchafuzi' },
  { value: 'pests', label: 'Wadudu' },
  { value: 'humidity', label: 'Unyevu' },
  { value: 'temperature', label: 'Joto' },
  { value: 'other', label: 'Nyingine' },
];

const CATEGORY_LABELS: Record<SupportIssueCategory, string> = {
  contamination: 'Uchafuzi',
  pests: 'Wadudu',
  humidity: 'Unyevu',
  temperature: 'Joto',
  other: 'Nyingine',
};

const DESCRIPTION_MIN = 10;
const DESCRIPTION_MAX = 500;

function validateField(key: FieldKey, values: FormValues): string | undefined {
  switch (key) {
    case 'category':
      if (!values.category) return 'Chagua aina ya tatizo';
      return undefined;
    case 'description': {
      const len = values.description.trim().length;
      if (len < DESCRIPTION_MIN || len > DESCRIPTION_MAX) {
        return 'Eleza tatizo kwa sentensi moja au mbili (herufi 10–500)';
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

function WarningGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path
        fill="currentColor"
        d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"
      />
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

function CheckGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
    </svg>
  );
}

function SpinnerGlyph() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden
      className="shrink-0 animate-spin"
    >
      <path
        fill="currentColor"
        d="M12 4a8 8 0 108 8h-2a6 6 0 11-6-6V4z"
        opacity="0.3"
      />
      <path fill="currentColor" d="M12 2v4a6 6 0 016 6h-4a2 2 0 00-2-2V2z" />
    </svg>
  );
}

const controlBase =
  'min-h-12 w-full max-w-full rounded-lg border border-border bg-surface px-4 text-body text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60';

export default function SupportTicketPage() {
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

  const fieldId = useCallback((key: FieldKey) => `${formId}-${key}`, [formId]);

  const handleBlur = (key: FieldKey) => {
    setUiState((prev) =>
      prev === 'submitting' || prev === 'success' ? prev : 'validating'
    );
    setErrors((prev) => {
      const next = { ...prev };
      const message = validateField(key, valuesRef.current);
      if (message) next[key] = message;
      else delete next[key];
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
        'Imeshindikana kutuma tiketi. Angalia muunganisho na ujaribu tena.'
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

  if (uiState === 'success' && ticket) {
    const statusLabel = successWasOffline
      ? 'Imehifadhiwa — itatumwa mtakapokuwa na mtandao'
      : 'Imetumwa — tutakujibu hapa';

    return (
      <div className="flex min-w-0 flex-col gap-4">
        <section
          className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm"
          aria-live="polite"
        >
          <h2 className="text-h2 font-bold text-text-primary">
            Tiketi imeundwa
          </h2>
          <p className="text-body text-text-secondary">
            <span className="font-medium text-text-primary">Nambari:</span>{' '}
            {ticket.id}
          </p>
          <p className="text-body text-text-secondary">
            <span className="font-medium text-text-primary">Aina:</span>{' '}
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
          Tuma tiketi nyingine
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {isOffline ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl bg-warning/15 p-4 text-warning"
        >
          <WarningGlyph />
          <p className="text-body font-medium text-warning">
            Uko nje ya mtandao. Tiketi yako itahifadhiwa na kutumwa ukiwa na
            muunganisho.
          </p>
        </div>
      ) : null}

      {submitError ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-error/30 bg-error/10 p-4"
        >
          <p className="text-body text-text-primary">{submitError}</p>
          <button
            type="button"
            onClick={() => void runSubmit()}
            className="min-h-12 self-start rounded-lg bg-brand-primary px-4 text-button font-bold text-text-on-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            Jaribu tena
          </button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1">
          <span className="text-label font-medium text-text-secondary">
            Kitambulisho cha mkulima
          </span>
          <p className="min-h-12 rounded-lg bg-surface-elevated px-4 py-3 text-body text-text-secondary">
            {FARMER_ID}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={fieldId('category')} className="text-label font-medium text-text-primary">
            Aina ya tatizo
          </label>
          <select
            id={fieldId('category')}
            name="category"
            value={values.category}
            disabled={formDisabled}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                category: e.target.value as FormValues['category'],
              }))
            }
            onBlur={() => handleBlur('category')}
            aria-invalid={Boolean(errors.category)}
            className={`${controlBase} h-14`}
          >
            <option value="">Chagua…</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.category ? (
            <p className="text-body-small text-error">{errors.category}</p>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <label
            htmlFor={fieldId('description')}
            className="text-label font-medium text-text-primary"
          >
            Maelezo ya tatizo
          </label>
          <textarea
            id={fieldId('description')}
            name="description"
            value={values.description}
            disabled={formDisabled}
            rows={5}
            maxLength={DESCRIPTION_MAX}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, description: e.target.value }))
            }
            onBlur={() => handleBlur('description')}
            aria-invalid={Boolean(errors.description)}
            className={`${controlBase} min-h-24 resize-y py-3`}
          />
          <div className="flex min-w-0 items-center justify-between gap-2">
            {errors.description ? (
              <p className="min-w-0 flex-1 text-body-small text-error">
                {errors.description}
              </p>
            ) : (
              <span className="text-body-small text-text-secondary">
                Eleza kwa sentensi moja au mbili
              </span>
            )}
            <span
              className="shrink-0 text-body-small text-text-secondary"
              aria-live="polite"
            >
              {descriptionLength}/{DESCRIPTION_MAX}
            </span>
          </div>
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
                Picha imeongezwa
              </>
            ) : (
              <>
                <CameraGlyph />
                Ongeza picha
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
              Ondoa
            </button>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-12 w-full max-w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 text-button font-bold text-text-on-brand shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <SpinnerGlyph />
              Inatuma…
            </>
          ) : (
            'Tuma tiketi'
          )}
        </button>
        <p className="text-center text-body-small text-text-secondary">
          Tiketi zote hupitiwa na mtaalamu wa uyoga.
        </p>
      </form>
    </div>
  );
}