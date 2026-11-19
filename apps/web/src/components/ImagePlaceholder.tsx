function ImageSceneGlyph({ className = '' }: { className?: string }) {
  return (
    <svg
      width={40}
      height={40}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 16l5-5 4 4 3-3 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

type ImagePlaceholderProps = {
  label: string;
  aspect?: '16/9' | '4/3';
  className?: string;
};

export function ImagePlaceholder({
  label,
  aspect = '16/9',
  className = '',
}: ImagePlaceholderProps) {
  const aspectClass = aspect === '4/3' ? 'aspect-[4/3]' : 'aspect-[16/9]';

  return (
    <div
      className={`relative w-full min-w-0 overflow-hidden rounded-xl border border-border bg-surface-elevated ${aspectClass} ${className}`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
        <ImageSceneGlyph className="text-text-secondary opacity-60" />
        <p className="text-center text-caption text-text-secondary">{label}</p>
      </div>
    </div>
  );
}