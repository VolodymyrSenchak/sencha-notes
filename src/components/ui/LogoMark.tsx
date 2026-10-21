// The SenNotes "stack" mark (same drawing as public/favicon.svg), coloured from the theme so it
// follows the chosen accent: accent tile, on-accent cards, accent S.
export const LogoMark: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="vn-logo">
    <rect width="64" height="64" rx="16" fill="var(--vn-accent)" />
    <rect
      x="21"
      y="11"
      width="29"
      height="36"
      rx="5"
      fill="var(--vn-on-accent)"
      fillOpacity="0.4"
      transform="rotate(9 35.5 29)"
    />
    <rect
      x="18"
      y="14"
      width="29"
      height="36"
      rx="5"
      fill="var(--vn-on-accent)"
      fillOpacity="0.72"
      transform="rotate(-3 32.5 32)"
    />
    <rect x="15" y="18" width="29" height="36" rx="5" fill="var(--vn-on-accent)" />
    <path
      transform="translate(11.4 18) scale(1.5)"
      fill="none"
      stroke="var(--vn-accent)"
      strokeWidth="2.7"
      strokeLinecap="round"
      d={
        "M16.5 7.6C15.7 6.3 14.1 5.5 12 5.5c-2.6 0-4.3 1.3-4.3 3.1 0 4.2 8.8 2.6 8.8 6.8 " +
        "0 1.9-1.8 3.1-4.4 3.1-2.2 0-3.9-.9-4.6-2.3"
      }
    />
  </svg>
);
