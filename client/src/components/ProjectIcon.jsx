// Original, simple SVG icons standing in for project screenshots.
// Each icon is abstract line-art rather than a photo, so it loads
// instantly with no external image dependency.
const ICONS = {
  orbit: (
    <>
      <circle cx="50" cy="50" r="6" fill="#c98a3e" />
      <ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#2f4d3a" strokeWidth="2" />
      <ellipse
        cx="50"
        cy="50"
        rx="36"
        ry="16"
        fill="none"
        stroke="#2f4d3a"
        strokeWidth="2"
        transform="rotate(60 50 50)"
      />
      <ellipse
        cx="50"
        cy="50"
        rx="36"
        ry="16"
        fill="none"
        stroke="#2f4d3a"
        strokeWidth="2"
        transform="rotate(120 50 50)"
      />
    </>
  ),
  prism: (
    <>
      <polygon points="50,18 82,72 18,72" fill="none" stroke="#2f4d3a" strokeWidth="2.5" />
      <line x1="10" y1="50" x2="35" y2="50" stroke="#c98a3e" strokeWidth="2" />
      <line x1="65" y1="45" x2="90" y2="30" stroke="#e05f5f" strokeWidth="2" />
      <line x1="65" y1="52" x2="90" y2="52" stroke="#5f9de0" strokeWidth="2" />
      <line x1="65" y1="59" x2="90" y2="74" stroke="#7bbf6a" strokeWidth="2" />
    </>
  ),
  ledger: (
    <>
      <rect x="22" y="16" width="56" height="68" rx="3" fill="none" stroke="#2f4d3a" strokeWidth="2.5" />
      <line x1="30" y1="32" x2="70" y2="32" stroke="#c98a3e" strokeWidth="2" />
      <line x1="30" y1="44" x2="70" y2="44" stroke="#c98a3e" strokeWidth="2" />
      <line x1="30" y1="56" x2="58" y2="56" stroke="#c98a3e" strokeWidth="2" />
      <line x1="30" y1="68" x2="64" y2="68" stroke="#c98a3e" strokeWidth="2" />
    </>
  ),
}

function ProjectIcon({ name, size = 100 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="project-icon"
      role="img"
      aria-label={`${name} project icon`}
    >
      {ICONS[name] || ICONS.orbit}
    </svg>
  )
}

export default ProjectIcon
