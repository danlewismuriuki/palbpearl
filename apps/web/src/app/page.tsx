import { healthCheck } from '@/lib/data-client';

export default async function HomePage() {
  const result = await healthCheck();

  return (
    <main className="mx-auto flex min-h-screen max-w-layout-content flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">
        PalBpearl
      </h1>
      <section className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <p className="text-base text-text-primary">
          <span className="font-medium">status:</span> {result.status}
        </p>
        <p className="text-base text-text-primary">
          <span className="font-medium">source:</span> {result.source}
        </p>
        <p className="text-sm text-text-secondary">
          <span className="font-medium">timestamp:</span> {result.timestamp}
        </p>
      </section>
      <button
        type="button"
        className="min-h-12 rounded-md bg-brand-primary px-4 py-3 text-base font-semibold text-text-on-brand shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Primary action
      </button>
      <a
        href="/home"
        className="inline-flex min-h-12 items-center text-base font-medium text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Go to Home →
      </a>
      <a
        href="/register"
        className="inline-flex min-h-12 items-center text-base font-medium text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Go to registration →
      </a>
    </main>
  );
}