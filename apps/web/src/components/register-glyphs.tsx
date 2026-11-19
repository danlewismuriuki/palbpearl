export function BackArrowGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      />
    </svg>
  );
}

export function CheckCircleGlyph({ className = '' }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.4 14.4L6 12.8l1.4-1.4 3.6 3.6 7-7L19.4 9l-8.8 8.4z"
      />
    </svg>
  );
}

export function CheckboxGlyph({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-8 13l-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z"
        />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="text-text-secondary">
      <path
        fill="currentColor"
        d="M19 5v14H5V5h14m0-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"
      />
    </svg>
  );
}

export function InfoGlyph({ className = '' }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v3z"
      />
    </svg>
  );
}

export function ExpandMoreGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  );
}

export function GpsGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 8a4 4 0 104 4 4 4 0 00-4-4zm9.5 3.5c.3 0 .5.2.5.5 0 6.1-5.4 11-12 11S-2 17.1-2 11s5.4-11 12-11c.3 0 .5.2.5.5v4.9l2.2-2.2c.2-.2.5-.2.7 0l1.4 1.4c.2.2.2.5 0 .7l-4.9 4.9c-.2.2-.5.2-.7 0l-1.4-1.4c-.2-.2-.2-.5 0-.7l2.2-2.2H12v-.5z"
      />
    </svg>
  );
}

export function RegisterGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M15 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm-9-1V8H4v3H1v2h3v3h2v-3h3v-2H6zm9 6c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"
      />
    </svg>
  );
}

export function OfflinePinGlyph({ className = '' }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 112.5-2.5A2.5 2.5 0 0112 11.5z"
      />
    </svg>
  );
}

export function CalendarGlyph({ className = '' }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V10h14v10z"
      />
    </svg>
  );
}

export function MailGlyph({ className = '' }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
      />
    </svg>
  );
}

export function MapPinGlyph({ className = '' }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
      />
    </svg>
  );
}

export function ExclamationCircleGlyph({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
      />
    </svg>
  );
}

export function LockGlyph({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M18 8h-1V6a5 5 0 00-10 0v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zm-6 9a2 2 0 110-4 2 2 0 010 4zm3-7H9V6a3 3 0 116 0v4z"
      />
    </svg>
  );
}

export function CloudOffGlyph({ className = '' }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M19.35 10.04A7.49 7.49 0 0012 4C9.1 4 6.58 5.78 5.35 8.09A5 5 0 002 14h.17l-1.8-1.8-.7.7L2.83 16h18.34l3.31-3.31-.7-.7L19 14.17A5 5 0 0019.35 10.04zM4.69 12.5l12.66-12.66 1.41 1.41L6.1 13.91 4.69 12.5z"
      />
    </svg>
  );
}