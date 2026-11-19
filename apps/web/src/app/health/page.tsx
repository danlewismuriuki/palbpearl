import Link from 'next/link';
import { healthCheck } from '@/lib/data-client';

export default async function HealthPage() {
  const result = await healthCheck();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-layout-content flex-col gap-4 overflow-x-hidden p-4">
      <h1 className="text-h1 font-bold text-text-primary">PalBpearl</h1>
      <section className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <p className="text-body text-text-primary">
          <span className="font-medium">status:</span> {result.status}
        </p>
        <p className="text-body text-text-primary">
          <span className="font-medium">source:</span> {result.source}
        </p>
        <p className="text-body-small text-text-secondary">
          <span className="font-medium">timestamp:</span> {result.timestamp}
        </p>
      </section>
      <Link
        href="/home"
        className="inline-flex min-h-12 items-center text-body font-medium text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Go to Home →
      </Link>
    </main>
  );
}