// QuoteTag.jsx
// A small pill label used to show the category tags on a quote
// Props:
//   label — the tag string e.g. "motivation"

export default function QuoteTag({ label }) {
  return (
    <span className="px-2 md:px-3 py-0.5 md:py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
      #{label}
    </span>
  )
}
