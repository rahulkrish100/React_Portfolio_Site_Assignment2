// Original, simplified illustrated portrait (not a photograph of any real
// or copyrighted likeness) used as the placeholder profile image.
function Portrait({ size = 220 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustrated portrait placeholder"
    >
      <circle cx="100" cy="100" r="98" fill="#eee3cf" stroke="#c98a3e" strokeWidth="2" />
      <ellipse cx="100" cy="120" rx="46" ry="55" fill="#f1d9b8" />
      <path
        d="M55 95 C50 40 150 40 145 95 C150 70 150 30 100 22 C50 30 50 70 55 95 Z"
        fill="#e7e7e7"
      />
      <path
        d="M100 22 C60 26 52 55 55 90 C60 60 75 45 100 44 C125 45 140 60 145 90 C148 55 140 26 100 22 Z"
        fill="#f4f4f4"
      />
      <circle cx="82" cy="110" r="4" fill="#3a3a3a" />
      <circle cx="118" cy="110" r="4" fill="#3a3a3a" />
      <path d="M85 132 Q100 142 115 132" stroke="#8a5a3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path
        d="M40 190 C40 150 70 165 100 165 C130 165 160 150 160 190 Z"
        fill="#2f4d3a"
      />
    </svg>
  )
}

export default Portrait
