// IconButton.jsx
// A reusable accessible icon-only button used throughout the dashboard
// Props:
//   onClick   — click handler
//   title     — tooltip text (also used as aria-label)
//   active    — boolean, true applies active colour highlight
//   disabled  — boolean, disables the button
//   children  — SVG icon element

export default function IconButton({ onClick, title, active = false, disabled = false, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}
