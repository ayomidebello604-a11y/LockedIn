// DashboardPage.jsx
// The main page rendered inside the app body
// Lays out all four widgets in a 2x2 responsive grid
// On smaller screens the grid collapses to a single column
// Each widget is fully independent — they only share state through context

import WeatherWidget from '../widgets/WeatherWidget'
import TaskWidget    from '../widgets/TaskWidget'
import NewsWidget    from '../widgets/NewsWidget'
import QuoteWidget   from '../widgets/QuoteWidget'

export default function DashboardPage() {
  return (
    <main
      role="main"
      aria-label="Dashboard"
      className="p-4 md:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 auto-rows-max"
    >
      <WeatherWidget />
      <TaskWidget    />
      <NewsWidget    />
      <QuoteWidget   />
    </main>
  )
}
