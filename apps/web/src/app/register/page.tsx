// Mockup-alignment pass v3 (register.png, five-screen pass 1/5):
// - flat column: offline banner + module header on background; fields in one form stack
// - colour substitutions vs PNG: background #F8F6F1 (not mint); brand-primary #BC6C25 (not darker brown)
// - CTA label "Register farmer" (ADR-015); mock shows "Register Farm"
// - demo prefill + offline-by-default + Simulate online are demo-only

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
import {
  CalendarGlyph,
  CheckCircleGlyph,
  CheckboxGlyph,
  CloudOffGlyph,
  ExclamationCircleGlyph,
  ExpandMoreGlyph,
  GpsGlyph,
  InfoGlyph,
  MailGlyph,
  LockGlyph,
  MapPinGlyph,
  RegisterGlyph,
} from '@/components/register-glyphs';
import { registerFarmer } from '@/lib/data-client';
import { useDebugQuery } from '@/lib/use-debug-query';

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
type UiState = 'idle' | 'validating' | 'submitting' | 'success' | 'error' | 'offline';

const PLACEHOLDER_LOCATION =
  'Placeholder — full list coming from project team';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_LOCAL_PATTERN = /^\d{9}$/;

const DEMO_PREFILL: FormValues = {
  fullName: 'Mary Achieng Ouma',
  gender: 'female',
  ageOrYear: '34',
  phoneLocal: '712345678',
  email: '',
  county: 'Kiambu',
  subCounty: 'Gatundu South',
  ward: 'Kiamwangi',
  village: 'Kiganjo Village',
};

const FIELD_LABELS: Record<FieldKey, string> = {
  fullName: 'Full name',
  gender: 'Gender',
  ageOrYear: 'Age or year of birth',
  phoneLocal: 'Phone number',
  email: 'Email',
  county: 'County',
  subCounty: 'Sub-county',
  ward: 'Ward',
  village: 'Village',
};

const COUNTY_OPTIONS = [PLACEHOLDER_LOCATION, 'Kiambu', "Murang'a", 'Nyeri', 'Nyandarua'];
const SUB_COUNTY_OPTIONS = [
  PLACEHOLDER_LOCATION,
  'Gatundu South',
  'Gatundu North',
  'Juja',
  'Thika Town',
];
const WARD_OPTIONS = [
  PLACEHOLDER_LOCATION,
  'Kiamwangi',
  'Ngenda',
  'Kiganjo',
  'Ndumberi',
];

const DEMO_GPS = { lat: -0.0917, lng: 34.7679 };

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
        return 'Please enter 9 digits after +254 (e.g. 712 345 678) so we can send weekly yield SMS and M-PESA links.';
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

const controlBase =
  'min-h-12 h-12 w-full rounded-md border bg-surface px-4 text-body text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60';

function fieldControlClass(hasError: boolean, tinted = true): string {
  const fill = hasError || !tinted ? 'bg-surface' : 'bg-accent/15';
  const border = hasError ? 'border-error' : 'border-border';
  return `${controlBase} ${fill} ${border}`;
}

function FieldErrorCallout({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mt-1 flex items-start gap-2 rounded-md border border-error/40 bg-error/10 p-3 text-body-small text-error"
    >
      <ExclamationCircleGlyph className="mt-0.5 shrink-0 text-error" />
      <p>{message}</p>
    </div>
  );
}

function InputIconSlot({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
      {children}
    </span>
  );
}

export default function RegisterPage() {
  const { forceLoadError, forceFieldErrors } = useDebugQuery();
  const formId = useId();
  const [values, setValues] = useState<FormValues>(DEMO_PREFILL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [uiState, setUiState] = useState<UiState>('offline');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [gpsRecorded, setGpsRecorded] = useState(false);
  const [demoSimulateOnline, setDemoSimulateOnline] = useState(false);
  const [browserOffline, setBrowserOffline] = useState(false);
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const showOfflineBanner = !demoSimulateOnline;
  const effectiveOffline = showOfflineBanner || browserOffline;

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

  useEffect(() => {
    if (!demoSimulateOnline) return;
    setUiState((prev) => (prev === 'offline' ? 'idle' : prev));
  }, [demoSimulateOnline]);

  useEffect(() => {
    if (forceLoadError) {
      setSubmitError(
        'Registration failed. Check your details and try again.'
      );
      setUiState('error');
    }
  }, [forceLoadError]);

  useEffect(() => {
    if (forceFieldErrors) {
      setErrors({
        phoneLocal:
          'Please enter 9 digits after +254 (e.g. 712 345 678) so we can send weekly yield SMS and M-PESA links.',
      });
      setUiState('validating');
    }
  }, [forceFieldErrors]);

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
    setValues(DEMO_PREFILL);
    setErrors({});
    setUiState(effectiveOffline ? 'offline' : 'idle');
    setSubmitError(null);
    setFarmer(null);
    setGpsRecorded(false);
    setDemoSimulateOnline(false);
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
      <main className="min-h-screen w-full overflow-x-hidden bg-background px-4 pb-10 pt-4">
        <Link
          href="/home"
          className="flex min-h-12 w-full items-center justify-center rounded-md bg-brand-primary px-4 text-button font-bold text-text-on-brand shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          Continue to Home →
        </Link>
        <button
          type="button"
          onClick={resetForm}
          className="mt-3 min-h-12 w-full text-label font-semibold text-brand-secondary underline"
        >
          Register another farmer
        </button>
        <section
          className="mt-4 flex flex-col gap-4 rounded-md border border-border bg-surface p-6 shadow-sm"
          aria-live="polite"
        >
          <h1 className="text-h1 font-bold text-text-primary">
            Farmer registered
          </h1>
          <p className="text-body text-text-primary">{farmer.fullName}</p>
          <p className="text-body text-text-secondary">{farmer.phone}</p>
          <p className="inline-flex min-h-12 items-center gap-2 rounded-md bg-brand-secondary/15 px-4 text-label font-medium text-brand-secondary">
            <CheckCircleGlyph className="text-brand-secondary" />
            Registered (pending sync)
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full flex-col gap-4 overflow-x-hidden bg-background px-4 pb-10 pt-4">
      {showOfflineBanner ? (
        <section className="flex flex-col gap-2 rounded-md border border-border bg-accent/15 p-4">
          <div className="flex items-start gap-3">
            <CloudOffGlyph className="shrink-0 text-brand-primary" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-label font-bold text-brand-primary">
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-warning"
                  aria-hidden
                />
                Offline Mode Active
              </p>
              <p className="mt-1 text-body-small text-text-primary">
                This form will save directly to your phone storage and sync
                automatically when internet is detected.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDemoSimulateOnline(true)}
            className="min-h-12 self-start text-label font-semibold text-brand-secondary underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            Simulate online
          </button>
        </section>
      ) : null}

      <header className="flex flex-col gap-2">
        <p className="text-caption font-bold uppercase tracking-wider text-brand-secondary">
          Module 01 • Farmer cooperative
        </p>
        <h1 className="text-h1 font-bold text-text-primary">Farmer Registration</h1>
        <p className="text-body text-text-secondary">
          Register your mushroom farm to receive tailored extension guidance,
          harvest schedules, and market connections.
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        {uiState === 'error' && submitError ? (
          <FieldErrorCallout
            message={`${submitError} Check the form and try again.`}
          />
        ) : null}

        {errorEntries.length > 0 && uiState === 'validating' ? (
          <div className="flex flex-col gap-2 rounded-md border border-error/40 bg-error/10 p-3 text-error">
            <p className="flex items-center gap-2 text-label font-semibold">
              <ExclamationCircleGlyph className="shrink-0" />
              Check the form
            </p>
            <ul className="flex flex-col gap-1 pl-7 text-body-small">
              {errorEntries.map((key) => (
                <li key={key}>
                  <a
                    href={`#${fieldId(key)}`}
                    className="underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    {FIELD_LABELS[key]}: {errors[key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <label
            htmlFor={fieldId('fullName')}
            className="flex items-center justify-between text-label font-bold text-text-primary"
          >
            <span>Full Name</span>
            <span className="font-medium text-text-secondary">Required</span>
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
              className={`${fieldControlClass(Boolean(errors.fullName))} pr-11`}
            />
            {fullNameValid ? (
              <InputIconSlot>
                <CheckCircleGlyph className="h-5 w-5 text-brand-secondary" />
              </InputIconSlot>
            ) : null}
          </div>
          {errors.fullName ? (
            <FieldErrorCallout message={errors.fullName} />
          ) : null}
        </div>

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
                  className={`flex min-h-12 cursor-pointer items-center justify-between rounded-md px-4 text-label font-bold capitalize focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-ring ${
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
                  {option === 'male' ? 'Male' : 'Female'}
                  <CheckboxGlyph checked={selected} />
                </label>
              );
            })}
          </div>
          {errors.gender ? (
            <FieldErrorCallout message={errors.gender} />
          ) : null}
        </fieldset>

        <div className="flex flex-col gap-1">
          <label
            htmlFor={fieldId('ageOrYear')}
            className="text-label font-bold text-text-primary"
          >
            Age or Birth Year
          </label>
          <div className="relative">
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
              className={`${fieldControlClass(Boolean(errors.ageOrYear))} pr-11`}
            />
            <InputIconSlot>
              <CalendarGlyph />
            </InputIconSlot>
          </div>
          {errors.ageOrYear ? (
            <FieldErrorCallout message={errors.ageOrYear} />
          ) : null}
          {!errors.ageOrYear ? (
            <p className="mt-1 flex items-start gap-1 text-body-small text-text-secondary">
              <InfoGlyph className="mt-0.5 shrink-0 text-text-secondary" />
              Enter either your birth year (e.g. 1982) or your current age in
              years.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor={fieldId('phoneLocal')}
            className="flex items-center justify-between text-label font-bold text-text-primary"
          >
            <span>Phone Number (M-PESA / SMS)</span>
            {phoneError ? (
              <span className="font-medium text-error">Action required</span>
            ) : (
              <span className="font-medium text-text-secondary">Required</span>
            )}
          </label>
          <div
            className={`flex min-h-12 h-12 overflow-hidden rounded-md border bg-surface ${
              phoneError ? 'border-error' : 'border-border'
            }`}
          >
            <span className="flex h-full shrink-0 items-center border-r border-border bg-accent/30 px-4 text-label font-bold text-text-primary">
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
              className="h-full w-full border-0 bg-accent/15 px-4 pr-10 text-body font-semibold text-text-primary focus-visible:outline-none disabled:opacity-60"
            />
            {phoneError ? (
              <span className="flex shrink-0 items-center pr-3 text-error">
                <ExclamationCircleGlyph />
              </span>
            ) : null}
          </div>
          {phoneError ? (
            <FieldErrorCallout message={phoneError} />
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor={fieldId('email')}
            className="text-label font-bold text-text-primary"
          >
            Email Address{' '}
            <span className="font-normal text-text-secondary">(Optional)</span>
          </label>
          <div className="relative">
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
              className={`${fieldControlClass(Boolean(errors.email))} pr-11`}
            />
            <InputIconSlot>
              <MailGlyph />
            </InputIconSlot>
          </div>
          {errors.email ? (
            <FieldErrorCallout message={errors.email} />
          ) : null}
          {!errors.email ? (
            <p className="text-body-small text-text-secondary">
              Leave blank if you do not use email; vital alerts are sent via SMS.
            </p>
          ) : null}
        </div>

        <section className="flex flex-col gap-3 border-t border-divider pt-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-label font-bold uppercase tracking-wide text-text-primary">
              Administrative Location
            </h2>
            <span className="text-caption font-medium text-brand-secondary">
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
            <div className="relative">
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
                className={`${fieldControlClass(Boolean(errors.village))} pr-11 font-semibold`}
              />
              <InputIconSlot>
                <MapPinGlyph />
              </InputIconSlot>
            </div>
            {errors.village ? (
              <FieldErrorCallout message={errors.village} />
            ) : null}
          </div>
        </section>

        <section className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            disabled={formDisabled}
            onClick={() => setGpsRecorded(true)}
            className="flex min-h-12 h-12 w-full items-center justify-center gap-2 rounded-md bg-accent/30 text-label font-bold text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60"
          >
            <GpsGlyph />
            Pin My Farm Location (Offline GPS)
          </button>
          {gpsRecorded ? (
            <div className="flex min-h-12 items-start gap-2 rounded-md border border-border bg-success/15 p-3">
              <CheckCircleGlyph className="h-5 w-5 shrink-0 text-success" />
              <p className="text-body-small text-text-primary">
                GPS recorded: {DEMO_GPS.lat}, {DEMO_GPS.lng} • Accurate to 4
                metres • Saved locally
              </p>
            </div>
          ) : null}
        </section>

        <div className="flex flex-col gap-2 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex min-h-12 h-12 w-full items-center justify-center gap-2 rounded-md bg-brand-primary text-button font-bold text-text-on-brand shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-60 active:translate-y-px"
          >
            {isSubmitting ? (
              'Registering…'
            ) : (
              <>
                <RegisterGlyph />
                Register farmer
              </>
            )}
          </button>
          <p className="flex items-center justify-center gap-2 px-2 text-center text-body-small text-text-secondary">
            <LockGlyph className="shrink-0 text-brand-secondary" />
            No internet required to register. Stored safely on this phone.
          </p>
        </div>
        </div>
      </form>
    </main>
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
          className={`${fieldControlClass(Boolean(error))} appearance-none pr-12 font-semibold`}
        >
          <option value="">Select…</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-primary">
          <ExpandMoreGlyph />
        </span>
      </div>
      {error ? <FieldErrorCallout message={error} /> : null}
    </div>
  );
}