// Original logo: a hand-drawn "MJ" monogram inside a rounded shield,
// created specifically for this project. No third-party or
// organizational logo is used or referenced.
function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="MJ monogram logo"
    >
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="16"
        fill="var(--logo-bg, #2f4d3a)"
      />
      <path
        d="M14 44V20h5.5l6.5 14 6.5-14H38v24h-5V28.5L27 42h-3l-6-13.5V44z"
        fill="var(--logo-fill, #f4ead2)"
      />
      <path
        d="M42 20h5v18c0 4-2.5 6.5-7 6.5-2 0-3.6-.5-4.8-1.3l1.6-3.9c.8.6 1.7 1 2.7 1 1.6 0 2.5-.9 2.5-2.8z"
        fill="var(--logo-accent, #c98a3e)"
      />
    </svg>
  )
}

export default Logo
