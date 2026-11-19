import { WarningGlyph } from '@/components/WarningGlyph';

type FieldErrorProps = {
  id?: string;
  message: string;
};

export function FieldError({ id, message }: FieldErrorProps) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-1 flex items-start gap-1 text-label text-error"
    >
      <WarningGlyph size={14} className="mt-0.5 text-error" />
      <span>{message}</span>
    </p>
  );
}

export function inputBorderClass(hasError: boolean): string {
  return hasError ? 'border-error' : 'border-border';
}