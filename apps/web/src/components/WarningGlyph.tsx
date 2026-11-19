type WarningGlyphProps = {
  size?: 14 | 20;
  className?: string;
};

export function WarningGlyph({ size = 20, className = '' }: WarningGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className={`shrink-0 ${className}`}
    >
      <path
        fill="currentColor"
        d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"
      />
    </svg>
  );
}