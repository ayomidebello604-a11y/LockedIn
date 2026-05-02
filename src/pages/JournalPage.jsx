// JournalPage.jsx
// Displays all journal entries the user has written from the Quote widget
// Each entry shows the quote text, author, the reflection, and the date written
// Entries can be deleted individually
// This page would be navigated to via the Sidebar "Journal" link

import { useJournalContext } from '../context/JournalContext'
import { FiTrash2 } from 'react-icons/fi'

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-GB', {
    weekday: 'short',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  })
}

function JournalEntryCard({ entry, onDelete }) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-gray-200">
        <time dateTime={entry.createdAt} className="text-sm text-gray-500">
          {formatDate(entry.createdAt)}
        </time>
        <button
          onClick={() => onDelete(entry.id)}
          aria-label="Delete journal entry"
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <FiTrash2 size={18} />
        </button>
      </div>

      <blockquote className="mb-6 pl-4 border-l-4 border-blue-300">
        <p className="text-lg italic text-gray-700">"{entry.quoteText}"</p>
        <footer className="text-sm text-gray-500 mt-2">— {entry.author}</footer>
      </blockquote>

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          My Reflection
        </p>
        <p className="text-gray-700 whitespace-pre-wrap">{entry.reflection}</p>
      </div>
    </article>
  )
}

export default function JournalPage() {
  const { entries, removeJournalEntry, favourites } = useJournalContext()

  return (
    <main role="main" aria-label="Journal" className="p-8">
      <div className="max-w-4xl">

        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Journal</h1>
          <p className="text-sm md:text-base text-gray-600">
            {entries.length === 0
              ? 'No entries yet — reflect on a quote from the dashboard.'
              : `${entries.length} reflection${entries.length === 1 ? '' : 's'} saved`}
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { label: 'Total Entries',     value: entries.length    },
            { label: 'Favourited Quotes', value: favourites.length },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">{stat.label}</div>
            </div>
          ))}
        </div>

        {entries.length > 0 && (
          <section aria-label="Journal entries" className="mb-8 md:mb-12">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
              Entries
            </h2>
            <div className="space-y-3 md:space-y-4">
              {entries.map(entry => (
                <JournalEntryCard key={entry.id} entry={entry} onDelete={removeJournalEntry} />
              ))}
            </div>
          </section>
        )}

        {favourites.length > 0 && (
          <section aria-label="Favourite quotes" className="pt-6 md:pt-8 border-t border-gray-200">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
              Favourite Quotes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {favourites.map((quote, i) => (
                <blockquote key={i} className="bg-blue-50 rounded-lg border border-blue-200 p-4 pl-4 border-l-4 border-l-blue-300">
                  <p className="text-sm italic text-blue-900 mb-2">"{quote.text}"</p>
                  <footer className="text-xs text-blue-700">— {quote.author}</footer>
                </blockquote>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  )
}
