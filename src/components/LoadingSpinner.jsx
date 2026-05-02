// LoadingSpinner.jsx
// A simple animated SVG spinner shown while data is being fetched
// Props:
//   size  — diameter in pixels (default 28)
//   label — screen-reader accessible label (default "Loading...")

export default function LoadingSpinner({ size = 28, label = 'Loading...' }) {
  return (
    <div role="status" aria-label={label} className="flex justify-center py-8">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin text-blue-600"
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.15" />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
