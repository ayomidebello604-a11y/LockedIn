// WidgetCard.jsx
// Wrapper component used by all four dashboard widgets
// Provides a consistent card shell with a title, optional icon, and content area
// Props:
//   title     — string shown in the widget header
//   icon      — optional JSX icon element
//   children  — the widget's inner content
//   actions   — optional JSX buttons shown on the right of the header

export default function WidgetCard({ title, icon, children, actions }) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 md:gap-3">
          {icon && <span aria-hidden="true" className="text-base md:text-lg">{icon}</span>}
          <h2 className="text-sm md:text-lg font-semibold text-gray-900">
            {title}
          </h2>
        </div>
        {actions && (
          <div className="flex items-center gap-1 md:gap-2">
            {actions}
          </div>
        )}
      </header>
      <div className="px-4 md:px-6 py-3 md:py-4">
        {children}
      </div>
    </article>
  )
}
