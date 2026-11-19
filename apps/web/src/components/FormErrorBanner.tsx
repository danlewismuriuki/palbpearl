import { ReactNode } from 'react';
import { WarningGlyph } from '@/components/WarningGlyph';

type FormErrorBannerProps = {
  heading: string;
  onRetry?: () => void;
  retryLabel?: string;
  children: ReactNode;
};

export function FormErrorBanner({
  heading,
  onRetry,
  retryLabel = 'Retry',
  children,
}: FormErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex min-w-0 items-start gap-3 rounded-lg border border-error/40 bg-surface px-4 py-3"
    >
      <WarningGlyph size={20} className="text-error" />
      <div className="min-w-0 flex-1">
        <p className="text-label font-semibold text-error">{heading}</p>
        <div className="mt-1 text-body text-text-primary">{children}</div>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 self-center text-button font-semibold text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}