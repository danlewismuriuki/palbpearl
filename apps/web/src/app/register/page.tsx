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
  Farmer,
  FarmerRegistrationRequest,
  Gender,
} from '@palbpearl/api-contract';
import { registerFarmer } from '@/lib/data-client';

type FormValues = {
  fullName: string;
  gender: Gender | '';
  ageOrYear: string;
  phoneLocal: string;
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
  ageOrYear: '',
  phoneLocal: '',
  email: '',
  county: '',
  subCounty: '',
  ward: '',
  village: '',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_LOCAL_PATTERN = /^\d{9}$/;

const FIELD_LABELS: Record<FieldKey, string> = {
  fullName: 'Full name',
  gender: 'Gender',
  ageOrYear: 'Age or birth year',
  phoneLocal: 'Phone number',
  email: 'Email',
  county: 'County',
  subCounty: 'Sub-county',
  ward: 'Ward',
  village: 'Village',
};

const COUNTY_OPTIONS = ['Kiambu', "Murang'a", 'Nyeri', 'Nyandarua'];
const SUB_COUNTY_OPTIONS = [
  'Gatundu South',
  'Gatundu North',
  'Juja',
  'Thika Town',
];
const WARD_OPTIONS = ['Kiamwangi', 'Ngenda', 'Kiganjo', 'Ndumberi'];

function resolveAge(ageOrYear: string): number | null {
  const raw = Number(ageOrYear.trim());
  if (!ageOrYear.trim() || Number.isNaN(raw)) return null;
  if (raw >= 18 && raw <= 100) return raw;
  if (raw >= 1920 && raw <= new Date().getFullYear() - 18) {
    return new Date().getFullYear() - raw;
  }
  return null;
}

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
    case 'ageOrYear': {
      const age = resolveAge(values.ageOrYear);
      if (age === null || age < 18 || age > 100) {
        return 'Enter an age between 18 and 100.';
      }
      return undefined;
    }
    case 'phoneLocal':
      if (!PHONE_LOCAL_PATTERN.test(values.phoneLocal.replace(/\s/g, ''))) {
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
      if (!values[key]) {
        return "Choose the farmer's county, sub-county, ward, and village.";
      }
      return undefined;
    case 'village':
      if (!values.village.trim()) {
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

function Icon({
  name,
  className = '',
  filled,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

const controlBase =
  'h-14 min-h-12 w-full rounded-lg border-0 bg-accent/15 px-4 text-body text-text-primary focus-visible:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60';

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
      if (firstKey) document.getElementById(fieldId(firstKey))?.focus();
      return;
    }

    const age = resolveAge(values.ageOrYear);
    if (age === null) return;

    const phoneDigits = values.phoneLocal.replace(/\s/g, '');
    const request: FarmerRegistrationRequest = {
      fullName: values.fullName.trim(),
      gender: values.gender as Gender,
      age,
      phone: `+254${phoneDigits}`,
      county: values.county,
      subCounty: values.subCounty,
      ward: values.ward,
      village: values.village.trim(),
    };
    if (values.email.trim()) request.email = values.email.trim();

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
  const fullNameValid =
    values.fullName.trim().length > 0 && !errors.fullName;
  const phoneError = errors.phoneLocal;

  if (uiState === 'success' && farmer) {
    return (
      <main className="min-h-screen bg-accent/20 px-4 pb-10 pt-4">
        <button
          type="button"
          onClick={resetForm}
          className="text-label font-semibold text-brand-secondary underline"
        >
          ← Register another farmer
        </button>
        <section
          className="mt-4 flex flex-col gap-4 rounded-xl bg-surface p-6 shadow-sm"
          aria-live="polite"
        >
          <h1 className="text-h1 font-bold text-text-primary">
            Farmer registered
          </h1>
          <p className="text-body text-text-primary">{farmer.fullName}</p>
          <p className="text-body text-text-secondary">{farmer.phone}</p>
          <p className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-brand-secondary/15 px-4 text-label font-medium text-brand-secondary">
            <Icon name="check_circle" filled />
            Registered (pending sync)
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-md bg-accent/20 px-4 pb-10 pt-4">
      {/* Offline banner — matches mobile Stitch */}
      <div
        role="status"
        className="mb-4 flex items-start gap-3 rounded-xl bg-accent/30 p-4 shadow-sm"
      >
        <Icon
          name="cloud_off"
          filled
          className="shrink-0 text-lg text-brand-primary"
        />
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-h3 font-semibold text-text-primary">
            Offline Mode Active
            <span
              className="inline-block h-2 w-2 rounded-full bg-brand-primary"
              aria-hidden="true"
            />
          </p>
          <p className="mt-1 text-body text-text-secondary">
            This form will save directly to your phone storage and sync
            automatically when internet is detected.
            {isOffline ? ' You are offline now.' : null}
          </p>
        </div>
      </div>

      {/* Screen header — outside form card */}
      <header className="mb-6 flex flex-col gap-1">
        <p className="text-caption font-bold uppercase tracking-wider text-brand-secondary">
          Module 01 • Ushirika wa Wakulima
        </p>
        <h1 className="text-h1 font-bold text-text-primary">
          Farmer Registration
        </h1>
        <p className="text-body text-text-secondary">
          Register your mushroom farm to receive tailored extension guidance,
          harvest forecasting, and direct local market linkages.
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {uiState === 'error' && submitError ? (
          <div
            role="alert"
            className="rounded-lg border border-error bg-error/10 p-4 text-body text-error"
          >
            {submitError} Check the form and try again.
          </div>
        ) : null}

        {errorEntries.length > 0 && uiState === 'validating' ? (
          <div
            role="alert"
            className="rounded-lg border border-error bg-error/10 p-4"
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
        ) : null}

        {/* Registration card */}
        <RegistrationCard>
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor={fieldId('fullName')}
              className="flex items-center justify-between text-label font-bold text-text-primary"
            >
              <span>Full Name</span>
              <span className="font-medium text-brand-secondary">Required</span>
            </label>
            <div className="relative">
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
                className={`${controlBase} shadow-sm`}
              />
              {fullNameValid ? (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-secondary">
                  <Icon name="check_circle" className="text-h3" />
                </span>
              ) : null}
            </div>
            {errors.fullName ? (
              <p className="text-body-small text-error">{errors.fullName}</p>
            ) : null}
          </div>

          {/* Gender */}
          <fieldset className="flex flex-col gap-1" disabled={formDisabled}>
            <legend className="text-label font-bold text-text-primary">
              Gender
            </legend>
            <div className="grid grid-cols-2 gap-2" role="radiogroup">
              {(['male', 'female'] as const).map((option) => {
                const selected = values.gender === option;
                return (
                  <label
                    key={option}
                    className={`flex h-14 min-h-12 cursor-pointer items-center justify-between rounded-lg px-4 text-label font-bold capitalize focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-ring ${
                      selected
                        ? 'bg-brand-secondary text-text-on-brand shadow-sm'
                        : 'bg-accent/25 text-text-primary'
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
                      id={option === 'male' ? fieldId('gender') : undefined}
                    />
                    {option}
                    <Icon
                      name={selected ? 'check_box' : 'check_box_outline_blank'}
                      filled={selected}
                      className={selected ? '' : 'text-text-secondary'}
                    />
                  </label>
                );
              })}
            </div>
            {errors.gender ? (
              <p className="text-body-small text-error">{errors.gender}</p>
            ) : null}
          </fieldset>

          {/* Age */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor={fieldId('ageOrYear')}
              className="text-label font-bold text-text-primary"
            >
              Age or Birth Year
            </label>
            <input
              id={fieldId('ageOrYear')}
              name="ageOrYear"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 1982 or 42"
              value={values.ageOrYear}
              disabled={formDisabled}
              onChange={(e) => setValue('ageOrYear', e.target.value)}
              onBlur={() => handleBlur('ageOrYear')}
              aria-invalid={Boolean(errors.ageOrYear)}
              className={controlBase}
            />
            <p className="flex items-start gap-1 text-body-small text-text-secondary">
              <Icon name="info" className="shrink-0 text-label" />
              Enter either your birth year (e.g. 1982) or your current age in
              years.
            </p>
            {errors.ageOrYear ? (
              <p className="text-body-small text-error">{errors.ageOrYear}</p>
            ) : null}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor={fieldId('phoneLocal')}
              className="flex items-center justify-between text-label font-bold text-text-primary"
            >
              <span>Phone Number (M-PESA / SMS)</span>
              {phoneError ? (
                <span className="font-medium text-error">Action needed</span>
              ) : null}
            </label>
            <div
              className={`flex h-14 min-h-12 overflow-hidden rounded-lg ${
                phoneError ? 'ring-2 ring-error' : ''
              }`}
            >
              <span className="flex h-full shrink-0 items-center bg-accent/30 px-4 text-label font-bold text-text-primary">
                +254
              </span>
              <input
                id={fieldId('phoneLocal')}
                name="phoneLocal"
                type="tel"
                inputMode="numeric"
                placeholder="712 345 678"
                value={values.phoneLocal}
                disabled={formDisabled}
                onChange={(e) =>
                  setValue(
                    'phoneLocal',
                    e.target.value.replace(/[^\d\s]/g, '').slice(0, 11)
                  )
                }
                onBlur={() => handleBlur('phoneLocal')}
                aria-invalid={Boolean(phoneError)}
                className="h-full w-full border-0 bg-accent/15 px-4 text-body font-semibold text-text-primary focus-visible:outline-none disabled:opacity-60"
              />
              {phoneError ? (
                <span className="flex shrink-0 items-center pr-3 text-error">
                  <Icon name="error" className="text-h3" />
                </span>
              ) : null}
            </div>
            {phoneError ? (
              <div className="mt-1 flex items-start gap-2 rounded-lg bg-error/15 p-3 text-error">
                <Icon name="warning" filled className="mt-0.5 shrink-0 text-label" />
                <p className="text-body-small">
                  Please enter 9 digits after +254 (e.g., 712 345 678) so we can
                  send weekly yield SMS &amp; M-PESA links.
                </p>
              </div>
            ) : null}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor={fieldId('email')}
              className="text-label font-bold text-text-primary"
            >
              Email Address{' '}
              <span className="font-normal text-text-secondary">(Optional)</span>
            </label>
            <input
              id={fieldId('email')}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={values.email}
              disabled={formDisabled}
              onChange={(e) => setValue('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              aria-invalid={Boolean(errors.email)}
              className={controlBase}
            />
            <p className="text-body-small text-text-secondary">
              Leave blank if you do not use email; vital alerts are sent via SMS.
            </p>
            {errors.email ? (
              <p className="text-body-small text-error">{errors.email}</p>
            ) : null}
          </div>

          {/* Administrative Location */}
          <section className="flex flex-col gap-4 pt-1">
            <div className="flex items-center justify-between">
              <h2 className="text-label font-bold uppercase tracking-wide text-text-primary">
                Administrative Location
              </h2>
              <span className="text-label font-medium text-brand-secondary">
                Farm Site
              </span>
            </div>

            <LocSelect
              id={fieldId('county')}
              label="County"
              value={values.county}
              options={COUNTY_OPTIONS}
              disabled={formDisabled}
              error={errors.county}
              onChange={(v) => setValue('county', v)}
              onBlur={() => handleBlur('county')}
            />
            <LocSelect
              id={fieldId('subCounty')}
              label="Sub-County"
              value={values.subCounty}
              options={SUB_COUNTY_OPTIONS}
              disabled={formDisabled}
              error={errors.subCounty}
              onChange={(v) => setValue('subCounty', v)}
              onBlur={() => handleBlur('subCounty')}
            />
            <LocSelect
              id={fieldId('ward')}
              label="Ward"
              value={values.ward}
              options={WARD_OPTIONS}
              disabled={formDisabled}
              error={errors.ward}
              onChange={(v) => setValue('ward', v)}
              onBlur={() => handleBlur('ward')}
            />

            <div className="flex flex-col gap-1">
              <label
                htmlFor={fieldId('village')}
                className="text-label font-medium text-text-secondary"
              >
                Village or Hamlet
              </label>
              <input
                id={fieldId('village')}
                name="village"
                type="text"
                placeholder="e.g. Kiganjo Village"
                value={values.village}
                disabled={formDisabled}
                onChange={(e) => setValue('village', e.target.value)}
                onBlur={() => handleBlur('village')}
                aria-invalid={Boolean(errors.village)}
                className={`${controlBase} font-semibold`}
              />
              {errors.village ? (
                <p className="text-body-small text-error">{errors.village}</p>
              ) : null}
            </div>
          </section>

          {/* GPS */}
          <section className="flex flex-col gap-1 pt-1">
            <p className="text-label font-bold text-text-primary">
              Farm Geo-Coordinates
            </p>
            <button
              type="button"
              disabled={formDisabled || gpsComingSoon}
              onClick={() => setGpsComingSoon(true)}
              className="flex h-14 min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent/30 text-label font-bold text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60"
            >
              <Icon name="my_location" filled className="text-h3" />
              Pin My Farm Location (Offline GPS)
            </button>
            {gpsComingSoon ? (
              <div className="mt-1 flex items-start gap-2 rounded-lg bg-brand-secondary/15 p-3 text-brand-secondary">
                <Icon name="check_circle" filled className="shrink-0 text-label" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-label font-bold text-text-primary">
                    GPS capture coming in Phase 2
                  </span>
                  <span className="text-caption font-bold uppercase tracking-wide text-brand-secondary">
                    Demo — no GPS API is called
                  </span>
                </div>
              </div>
            ) : null}
          </section>
        </RegistrationCard>

        {/* Primary action — outside card, per mobile mockup */}
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-14 min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-primary text-button font-bold text-text-on-brand shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60 active:translate-y-px"
          >
            {isSubmitting ? (
              <>
                <Icon name="progress_activity" className="animate-spin text-h3" />
                Registering…
              </>
            ) : (
              <>
                <Icon name="how_to_reg" className="text-h3" />
                Register Farm
              </>
            )}
          </button>
          <p className="flex items-center justify-center gap-2 px-2 text-center text-body-small text-text-secondary">
            <Icon name="offline_pin" filled className="shrink-0 text-brand-secondary" />
            No internet required to register. Stored safely on this phone.
          </p>
        </div>
      </form>
    </main>
  );
}

function RegistrationCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 rounded-xl bg-surface p-4 shadow-sm">
      {children}
    </div>
  );
}

function LocSelect({
  id,
  label,
  value,
  options,
  disabled,
  error,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-label font-medium text-text-secondary">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          className={`${controlBase} appearance-none pr-12 font-semibold`}
        >
          <option value="">Select…</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-primary">
          <Icon name="expand_more" className="text-h3" />
        </span>
      </div>
      {error ? <p className="text-body-small text-error">{error}</p> : null}
    </div>
  );
}