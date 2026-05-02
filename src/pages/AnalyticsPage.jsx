// AnalyticsPage.jsx
// A summary analytics view computed from live task and journal data
// Shows: task completion rate, tasks by priority breakdown,
//        total reflections written, and most-used quote tags
// All numbers are derived live from TaskContext and JournalContext

import { useTaskContext }   from '../context/TaskContext'
import { useJournalContext } from '../context/JournalContext'

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 text-center">
      <div className="text-3xl md:text-4xl font-bold text-blue-600">{value}</div>
      <div className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">{label}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  )
}

function HorizontalBar({ label, value, max, color = 'currentColor' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="mb-4 md:mb-6">
      <div className="flex justify-between items-center text-xs md:text-sm mb-2">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-600">{value}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-300 rounded-full"
          style={{ width: `${pct}%`, background: color }} 
        />
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const { tasks, completedCount, totalCount, progressPct } = useTaskContext()
  const { entries, favourites } = useJournalContext()

  const highCount   = tasks.filter(t => t.priority === 'high').length
  const medCount    = tasks.filter(t => t.priority === 'medium').length
  const lowCount    = tasks.filter(t => t.priority === 'low').length

  // Count how many times each tag appears across all journal entries
  const tagCounts = entries.reduce((acc, entry) => {
    // Tags are stored on the quote object, not the entry — collect from favourites as proxy
    return acc
  }, {})

  // Count tags from favourited quotes
  const favouriteTagCounts = favourites.reduce((acc, quote) => {
    (quote.tags || []).forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {})

  const topTags = Object.entries(favouriteTagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <main role="main" aria-label="Analytics" className="p-8">
      <div className="max-w-6xl">

        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-sm md:text-base text-gray-600">A live summary of your productivity data</p>
        </header>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
          <StatCard
            label="Tasks Completed"
            value={completedCount}
            sub={`of ${totalCount} total`}
          />
          <StatCard
            label="Completion Rate"
            value={`${progressPct}%`}
            sub="based on all tasks"
          />
          <StatCard
            label="Journal Entries"
            value={entries.length}
            sub="reflections written"
          />
          <StatCard
            label="Saved Quotes"
            value={favourites.length}
            sub="in your favourites"
          />
        </div>

        {/* Tasks by priority */}
        <section className="mb-8 md:mb-12 bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Tasks by Priority</h2>
          <HorizontalBar label="High Priority"   value={highCount} max={totalCount} color="#dc2626" />
          <HorizontalBar label="Medium Priority" value={medCount}  max={totalCount} color="#f97316" />
          <HorizontalBar label="Low Priority"    value={lowCount}  max={totalCount} color="#16a34a" />
        </section>

        {/* Task completion breakdown */}
        <section className="mb-8 md:mb-12 bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Completion Breakdown</h2>
          <HorizontalBar label="Completed" value={completedCount}             max={totalCount} color="#16a34a" />
          <HorizontalBar label="Remaining" value={totalCount - completedCount} max={totalCount} color="#9ca3af" />
        </section>

        {/* Top quote tags from favourites */}
        {topTags.length > 0 && (
          <section className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Top Quote Themes</h2>
            {topTags.map(([tag, count]) => (
              <HorizontalBar key={tag} label={`#${tag}`} value={count} max={topTags[0][1]} color="#3b82f6" />
            ))}
          </section>
        )}

        {totalCount === 0 && entries.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No data yet — start adding tasks and writing journal entries from the dashboard!
            </p>
          </div>
        )}

      </div>
    </main>
  )
}
