// ErrorBanner.jsx
// Displays a non-blocking warning when a widget encounters a fetch error
// Props:
//   message — string describing what went wrong

import { FiAlertCircle } from 'react-icons/fi'

export default function ErrorBanner({ message }) {
  if (!message) return null

  return (
    <div role="alert" className="flex items-center gap-3 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}
