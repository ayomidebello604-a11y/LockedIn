// PriorityBadge.jsx
// Renders a small coloured label for task priority levels
// Props:
//   level — 'low' | 'medium' | 'high'
//   onChange — optional callback when priority is changed

const PRIORITY_CONFIG = {
  low:    { label: 'Low',  bgColor: 'bg-green-100', textColor: 'text-green-700', hoverBg: 'hover:bg-green-200' },
  medium: { label: 'Med',  bgColor: 'bg-orange-100', textColor: 'text-orange-700', hoverBg: 'hover:bg-orange-200' },
  high:   { label: 'High', bgColor: 'bg-red-100', textColor: 'text-red-700', hoverBg: 'hover:bg-red-200' },
}

export default function PriorityBadge({ level, onChange }) {
  const config = PRIORITY_CONFIG[level] || PRIORITY_CONFIG.medium

  if (onChange) {
    return (
      <select
        value={level}
        onChange={(e) => onChange(e.target.value)}
        className={`${config.bgColor} ${config.textColor} px-2 md:px-2.5 py-0.5 md:py-1 rounded-md text-xs font-semibold cursor-pointer border-0 outline-none transition-colors ${config.hoverBg}`}
      >
        <option value="low">Low</option>
        <option value="medium">Med</option>
        <option value="high">High</option>
      </select>
    )
  }

  return (
    <span className={`${config.bgColor} ${config.textColor} px-2 md:px-2.5 py-0.5 md:py-1 rounded-md text-xs font-semibold`}>
      {config.label}
    </span>
  )
}
