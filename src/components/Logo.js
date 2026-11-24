// The Sole Mate logo: two overlapping circles, a "sole" and its "mate".
// It is inline SVG, so it needs no image file and stays sharp at any size.
export default function Logo({ size = 56 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="32" cy="32" r="32" fill="#fff" />
      <circle cx="25" cy="32" r="15" fill="#1f5fd1" />
      <circle cx="39" cy="32" r="15" fill="#ff7a1a" fillOpacity="0.85" />
    </svg>
  );
}
