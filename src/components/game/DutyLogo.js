// The Debug Duty logo: a caution-yellow badge with a magnifying glass.
// Inline SVG, so no image file is needed.
export default function DutyLogo({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="60" height="60" rx="16" fill="#ffd60a" />
      <circle cx="28" cy="28" r="12" fill="none" stroke="#111318" strokeWidth="6" />
      <line x1="37" y1="37" x2="50" y2="50" stroke="#111318" strokeWidth="7" strokeLinecap="round" />
      <circle cx="28" cy="28" r="4" fill="#111318" />
    </svg>
  );
}
