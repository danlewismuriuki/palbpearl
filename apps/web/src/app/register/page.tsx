'use client';

import Link from 'next/link';
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
  Farmer,
  FarmerRegistrationRequest,
  Gender,
} from '@palbpearl/api-contract';
import { registerFarmer } from '@/lib/data-client';

type FormValues = {
  fullName: string;
  gender: Gender | '';
  age: string;
  phone: string;
  email: string;
  county: string;
  subCounty: string;
  ward: string;
  village: string;
};

type FieldKey = keyof FormValues;

type FieldErrors = Partial<Record<FieldKey, string>>;

type UiState = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

const EMPTY_FORM: FormValues = {
  fullName: '',
  gender: '',
  age: '',
  phone: '',
  email: '',
  county: '',
  subCounty: '',
  ward: '',
  village: '',
};

const PHONE_PATTERN = /^\+254\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_LABELS: Record<FieldKey, string> = {
  fullName: 'Full name',
  gender: 'Gender',
  age: 'Age',
  phone: 'Phone number',
  email: 'Email',
  county: 'County',
  subCounty: 'Sub-county',
  ward: 'Ward',
  village: 'Village',
};

const LOCATION_KEYS: FieldKey[] = ['county', 'subCounty', 'ward', 'village'];

function validateField(key: FieldKey, values: FormValues): string | undefined {
  switch (key) {
    case 'fullName':
      if (!values.fullName.trim()) return "Enter the farmer's full name.";
      return undefined;
    case 'gender':
      if (values.gender !== 'female' && values.gender !== 'male') {
        return 'Choose Female or Male.';
      }
      return undefined;
    case 'age': {
      const age = Number(values.age);
      if (!values.age.trim() || Number.isNaN(age) || age < 18 || age > 100) {
        return 'Enter an age between 18 and 100.';
      }
      return undefined;
    }
    case 'phone':
      if (!PHONE_PATTERN.test(values.phone.trim())) {
        return 'Enter a phone number starting with +254, then 9 digits (e.g. +254712345678).';
      }
      return undefined;
    case 'email':
      if (values.email.trim() && !EMAIL_PATTERN.test(values.email.trim())) {
        return 'Enter a valid email address, or leave this blank.';
      }
      return undefined;
    case 'county':
    case 'subCounty':
    case 'ward':
    case 'village':
      if (!values[key]) {
        return "Choose the farmer's county, sub-county, ward, and village.";
      }
      return undefined;
    default:
      return undefined;
  }
}

function validateAll(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  (Object.keys(FIELD_LABELS) as FieldKey[]).forEach((key) => {
    const message = validateField(key, values);
    if (message) errors[key] = message;
  });
  return errors;
}

const inputClassName =
  'min-h-12 w-full rounded-md border border-border bg-surface px-4 text-body text-text-primary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60';

const selectClassName = inputClassName;

export default function RegisterPage() {
  const formId = useId();
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [uiState, setUiState] = useState<UiState>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [gpsComingSoon, setGpsComingSoon] = useState(false);
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

  const fieldId = useCallback(
    (key: FieldKey) => `${formId}-${key}`,
    [formId]
  );

  const setValue = <K extends FieldKey>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

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
    setFarmer(null);
    setGpsComingSoon(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateAll(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setUiState('validating');
      setSubmitError(null);
      const firstKey = (Object.keys(nextErrors) as FieldKey[])[0];
      if (firstKey) {
        document.getElementById(fieldId(firstKey))?.focus();
      }
      return;
    }

    const request: FarmerRegistrationRequest = {
      fullName: values.fullName.trim(),
      gender: values.gender as Gender,
      age: Number(values.age),
      phone: values.phone.trim(),
      county: values.county,
      subCounty: values.subCounty,
      ward: values.ward,
      village: values.village,
    };
    if (values.email.trim()) {
      request.email = values.email.trim();
    }

    setUiState('submitting');
    setSubmitError(null);

    try {
      const response = await registerFarmer(request);
      setFarmer(response.farmer);
      setUiState('success');
    } catch (err) {
      setUiState('error');
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Check your details and try again.'
      );
    }
  };

  const isSubmitting = uiState === 'submitting';
  const formDisabled = isSubmitting;
  const errorEntries = (Object.keys(errors) as FieldKey[]).filter(
    (key) => errors[key]
  );

  if (uiState === 'success' && farmer) {
    return (
      <main className="mx-auto flex min-h-screen max-w-layout-content flex-col gap-6 p-4 md:p-6">
        {isOffline && <OfflineBadge />}
        <section
          className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 shadow-sm"
          aria-live="polite"
        >
          <h1 className="text-h1 font-bold text-text-primary">
            Farmer registered
          </h1>
          <p className="text-body text-text-primary">{farmer.fullName}</p>
          <p className="text-body text-text-secondary">{farmer.phone}</p>
          <p className="inline-flex min-h-12 items-center gap-2 self-start rounded-md border border-border bg-surface-elevated px-4 text-label font-medium text-text-primary">
            <span className="text-success" aria-hidden="true">
              ✓
            </span>
            Registered (pending sync)
          </p>
          <button
            type="button"
            onClick={resetForm}
            className="min-h-12 rounded-md border border-border bg-surface px-4 text-button font-semibold text-text-primary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            Register another farmer
          </button>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center text-body font-medium text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            ← Home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-layout-content flex-col p-4 pb-24 md:p-6 md:pb-28">
      {isOffline && <OfflineBadge />}

      <header className="mb-6 flex flex-col gap-2">
        <p className="text-label font-medium uppercase tracking-wide text-brand-secondary">
          Module 01 · Ushirika wa Wakulima
        </p>
        <h1 className="text-h1 font-bold text-text-primary">
          Farmer Registration
        </h1>
        <p className="text-body text-text-secondary">
          Register a mushroom farm to receive tailored extension guidance,
          harvest forecasting, and local market linkages.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-6"
        aria-busy={isSubmitting}
      >
        {uiState === 'error' && submitError && (
          <div
            role="alert"
            className="rounded-md border border-error bg-surface p-4 text-body text-error shadow-sm"
          >
            {submitError} Check the form and try again.
          </div>
        )}

        {errorEntries.length > 0 && uiState === 'validating' && (
          <div
            role="alert"
            className="rounded-md border border-error bg-surface p-4 shadow-sm"
          >
            <p className="mb-2 text-label font-medium text-error">
              Please fix the following:
            </p>
            <ul className="flex flex-col gap-1">
              {errorEntries.map((key) => (
                <li key={key}>
                  <a
                    href={`#${fieldId(key)}`}
                    className="text-body text-error underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    {FIELD_LABELS[key]}: {errors[key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <FieldGroup
          id={fieldId('fullName')}
          label="Full name"
          error={errors.fullName}
          required
        >
          <input
            id={fieldId('fullName')}
            name="fullName"
            type="text"
            autoComplete="name"
            value={values.fullName}
            disabled={formDisabled}
            onChange={(e) => setValue('fullName', e.target.value)}
            onBlur={() => handleBlur('fullName')}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={
              errors.fullName ? `${fieldId('fullName')}-error` : undefined
            }
            className={inputClassName}
          />
        </FieldGroup>

        <fieldset className="flex flex-col gap-2" disabled={formDisabled}>
          <legend className="mb-1 text-label font-medium text-text-primary">
            Gender <span className="text-error">*</span>
          </legend>
          <p className="text-caption text-text-secondary">
            Required for M&amp;E reporting
          </p>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-required="true">
            {(['female', 'male'] as const).map((option) => {
              const selected = values.gender === option;
              return (
                <label
                  key={option}
                  className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md border px-4 text-button font-semibold focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-ring ${
                    selected
                      ? 'border-brand-secondary bg-brand-secondary text-text-on-brand'
                      : 'border-border bg-surface text-text-primary'
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={selected}
                    onChange={() => setValue('gender', option)}
                    onBlur={() => handleBlur('gender')}
                    className="sr-only"
                    id={option === 'female' ? fieldId('gender') : undefined}
                  />
                  <span aria-hidden="true">{selected ? '✓' : '○'}</span>
                  {option === 'female' ? 'Female' : 'Male'}
                </label>
              );
            })}
          </div>
          {errors.gender && (
            <p id={`${fieldId('gender')}-error`} className="text-body-small text-error">
              {errors.gender}
            </p>
          )}
        </fieldset>

        <FieldGroup
          id={fieldId('age')}
          label="Age"
          error={errors.age}
          required
          hint="Enter the farmer's age in years (18–100)."
        >
          <input
            id={fieldId('age')}
            name="age"
            type="number"
            inputMode="numeric"
            min={18}
            max={100}
            value={values.age}
            disabled={formDisabled}
            onChange={(e) => setValue('age', e.target.value)}
            onBlur={() => handleBlur('age')}
            aria-invalid={Boolean(errors.age)}
            aria-describedby={
              errors.age ? `${fieldId('age')}-error` : undefined
            }
            className={inputClassName}
          />
        </FieldGroup>

        <FieldGroup
          id={fieldId('phone')}
          label="Phone number"
          error={errors.phone}
          required
          hint="M-PESA / SMS — use +254 followed by 9 digits."
        >
          <input
            id={fieldId('phone')}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+254712345678"
            value={values.phone}
            disabled={formDisabled}
            onChange={(e) => setValue('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={
              errors.phone ? `${fieldId('phone')}-error` : undefined
            }
            className={inputClassName}
          />
        </FieldGroup>

        <FieldGroup
          id={fieldId('email')}
          label="Email"
          error={errors.email}
          hint="Optional. Leave blank if the farmer does not use email."
        >
          <input
            id={fieldId('email')}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            disabled={formDisabled}
            onChange={(e) => setValue('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? `${fieldId('email')}-error` : undefined
            }
            className={inputClassName}
          />
        </FieldGroup>

        <section className="flex flex-col gap-4">
          <h2 className="text-h2 font-semibold text-text-primary">
            Farm location
          </h2>
          {LOCATION_KEYS.map((key) => (
            <FieldGroup
              key={key}
              id={fieldId(key)}
              label={FIELD_LABELS[key]}
              error={errors[key]}
              required
            >
              <select
                id={fieldId(key)}
                name={key}
                value={values[key]}
                disabled={formDisabled}
                onChange={(e) => setValue(key, e.target.value)}
                onBlur={() => handleBlur(key)}
                aria-invalid={Boolean(errors[key])}
                aria-describedby={
                  errors[key] ? `${fieldId(key)}-error` : undefined
                }
                className={selectClassName}
              >
                <option value="">Select…</option>
                <option value="pending-list">
                  Placeholder — full list coming from project team
                </option>
              </select>
            </FieldGroup>
          ))}
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h2 font-semibold text-text-primary">
            Farm GPS
          </h2>
          <button
            type="button"
            disabled={formDisabled || gpsComingSoon}
            onClick={() => setGpsComingSoon(true)}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-button font-semibold text-text-primary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60"
          >
            {gpsComingSoon
              ? 'GPS capture coming in Phase 2'
              : 'Pin My Farm GPS'}
          </button>
          <p className="text-caption text-text-secondary">
            Visual only for this demo — no GPS API is called.
          </p>
        </section>

        <div className="fixed bottom-0 left-0 right-0 border-t border-divider bg-surface shadow-md">
          <div className="mx-auto flex max-w-layout-content items-center gap-3 p-4 md:px-6">
            <Link
              href="/"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-md border border-border bg-surface px-4 text-button font-semibold text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              ← Home
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 grow items-center justify-center gap-2 rounded-md bg-brand-primary px-4 text-button font-semibold text-text-on-brand shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-text-on-brand border-t-transparent"
                    aria-hidden="true"
                  />
                  Registering…
                </>
              ) : (
                'Register farmer'
              )}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

function OfflineBadge() {
  return (
    <p
      role="status"
      className="mb-4 inline-flex min-h-12 items-center self-start rounded-md border border-border bg-surface-elevated px-4 text-label font-medium text-text-primary"
    >
      Offline — will sync when connected
    </p>
  );
}

function FieldGroup({
  id,
  label,
  error,
  required,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-label font-medium text-text-primary">
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </label>
      {hint ? <p className="text-caption text-text-secondary">{hint}</p> : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-body-small text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
