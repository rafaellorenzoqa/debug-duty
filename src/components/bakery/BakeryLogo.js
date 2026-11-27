// The 1Up Bakery logo: a two-tier cake with a candle and a round green "1UP" badge.
// Original artwork, drawn as inline SVG (no image file, sharp at any size).
export default function BakeryLogo({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" aria-hidden="true" focusable="false">
      {/* plate */}
      <ellipse cx="34" cy="62" rx="26" ry="4" fill="#B9DDF2" />
      {/* bottom tier */}
      <rect x="12" y="40" width="44" height="20" rx="6" fill="#FFFFFF" stroke="#17405C" strokeWidth="2" />
      <path d="M12 47 q5.5 5 11 0 t11 0 t11 0 t11 0" fill="none" stroke="#3B9AD9" strokeWidth="3" strokeLinecap="round" />
      {/* top tier */}
      <rect x="20" y="24" width="28" height="17" rx="5" fill="#FFFFFF" stroke="#17405C" strokeWidth="2" />
      <path d="M20 30 q4.7 4 9.3 0 t9.3 0 t9.4 0" fill="none" stroke="#3B9AD9" strokeWidth="3" strokeLinecap="round" />
      {/* candle and flame */}
      <rect x="32" y="13" width="4" height="11" rx="1.5" fill="#1F7A4D" />
      <path d="M34 4 q4 5 0 8 q-4 -3 0 -8z" fill="#F5A623" />
      {/* 1UP badge */}
      <circle cx="56" cy="20" r="13" fill="#1F7A4D" stroke="#FFFFFF" strokeWidth="2.5" />
      <text
        x="56"
        y="24.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="800"
        fontFamily="Arial, sans-serif"
        fill="#FFFFFF"
      >
        1UP
      </text>
    </svg>
  );
}
