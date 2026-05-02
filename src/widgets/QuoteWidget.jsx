// QuoteWidget.jsx
// The inspiration widget — carries over everything from the previous quote app
// Features:
//   - Displays a daily quote with author and category tags
//   - Refresh button fetches a new random quote
//   - Pin button locks the current quote so refresh doesn't replace it
//   - Favourite (star) button saves a quote to localStorage via JournalContext
//   - Journal button opens a slide-in drawer to write a reflection
//   - Share button copies/shares the quote text
//   - Search bar to find quotes by keyword or author name

import { useState, useEffect }    from 'react'
import { useQuote }               from '../hooks/useQuote'
import { useJournalContext }      from '../context/JournalContext'
import WidgetCard                 from '../components/WidgetCard'
import QuoteTag                   from '../components/QuoteTag'
import LoadingSpinner             from '../components/LoadingSpinner'
import IconButton                 from '../components/IconButton'
import ErrorBanner                from '../components/ErrorBanner'
import { FiSearch, FiX, FiRotateCw, FiShare2, FiBook, FiCheck,FiStar } from 'react-icons/fi'
import { MdOutlineBookmark, MdBookmark } from 'react-icons/md'
import { AiOutlineStar, AiFillStar } from 'react-icons/ai'

// ── Journal Drawer ──────────────

function JournalDrawer({ quote, isOpen, onClose }) {
  const { saveJournalEntry } = useJournalContext()
  const [text,  setText]   = useState('')
  const [saved, setSaved]  = useState(false)

  function handleSave() {
    if (!text.trim()) return
    saveJournalEntry(quote.text, quote.author, text.trim())
    setSaved(true)
    setText('')
    setTimeout(() => { setSaved(false); onClose() }, 1400)
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Journal reflection"
      className="border-t border-gray-200 pt-3 md:pt-4 mt-3 md:mt-4"
    >
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-sm md:text-base font-semibold text-gray-900">Write a reflection</h3>
        <button onClick={onClose} aria-label="Close journal drawer" className="text-gray-400 hover:text-gray-600">
          <FiX size={16} />
        </button>
      </div>

      <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 italic">
        "{quote.text}" — {quote.author}
      </p>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="How does this quote apply to your life right now?"
        rows={4}
        aria-label="Reflection text"
        className="w-full p-2 md:p-3 text-xs md:text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />

      <button
        onClick={handleSave}
        disabled={!text.trim()}
        className="w-full mt-2 md:mt-3 py-1.5 md:py-2 text-xs md:text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saved ? <><FiCheck className="w-4 h-4 inline mr-1" /> Saved!</> : 'Save Reflection'}
      </button>
    </div>
  )
}

// ── Quote Search Panel ─────────────────────────────────────────────────────────

function QuoteSearchPanel({ searchQuotes, searchResults, isSearching, onSelect, onClose }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (query.length < 2) return
    const timer = setTimeout(() => searchQuotes(query), 400)
    return () => clearTimeout(timer)
  }, [query, searchQuotes])

  return (
    <div className="border-b border-gray-200 pb-3 md:pb-4 mb-3 md:mb-4">
      <div className="relative mb-2 md:mb-3">
        <FiSearch className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by author or keyword..."
          autoFocus
          aria-label="Search quotes"
          className="w-full pl-7 md:pl-9 pr-8 py-1.5 md:py-2 text-xs md:text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button onClick={onClose} aria-label="Close search" className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <FiX size={14} />
          </button>
        )}
      </div>

      {isSearching && <LoadingSpinner size={16} label="Searching quotes" />}

      {searchResults.length > 0 && (
        <ul className="space-y-1 md:space-y-2 max-h-48 overflow-y-auto">
          {searchResults.map((q, i) => (
            <li key={i}>
              <button
                onClick={() => { onSelect(q); onClose() }}
                className="w-full text-left p-1.5 md:p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="text-xs md:text-sm text-gray-900">"{q.text.slice(0, 70)}{q.text.length > 70 ? '…' : ''}"</p>
                <p className="text-xs text-gray-600 mt-0.5 md:mt-1">— {q.author}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ── Widget ─────────────────────────────────────────────────────────────────────

export default function QuoteWidget() {
  const {
    currentQuote,
    isFetching,
    fetchRandomQuote,
    searchQuotes,
    searchResults,
    isSearching,
    pickQuoteFromResults,
    clearSearchResults,
  } = useQuote()

  const { toggleFavourite, isQuoteFavourited } = useJournalContext()

  const [pinnedQuote,   setPinnedQuote]   = useState(null)
  const [drawerOpen,    setDrawerOpen]    = useState(false)
  const [searchOpen,    setSearchOpen]    = useState(false)

  // Fetch a quote on component mount
  useEffect(() => {
    fetchRandomQuote()
  }, [fetchRandomQuote])

  // The displayed quote is the pinned one if set, otherwise the fetched one
  const displayedQuote = pinnedQuote || currentQuote

  function handleRefresh() {
    if (pinnedQuote) return   // pinned = locked, don't refresh
    fetchRandomQuote()
  }

  function handlePin() {
    setPinnedQuote(pinnedQuote ? null : displayedQuote)
  }

  function handleFavourite() {
    toggleFavourite(displayedQuote)
  }

  function handleShare() {
    const text = `"${displayedQuote.text}" — ${displayedQuote.author}`
    if (navigator.share) {
      navigator.share({ title: 'Quote', text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).catch(() => {})
    }
  }

  function handleSearchClose() {
    setSearchOpen(false)
    clearSearchResults()
  }

  const isFavourited = isQuoteFavourited(displayedQuote?.text)

  const headerActions = (
    <>
      <IconButton onClick={() => setSearchOpen(o => !o)} title="Search quotes" active={searchOpen}>
        <FiSearch className="w-4 h-4 text-gray-700" />
      </IconButton>
      <IconButton onClick={handlePin} title={pinnedQuote ? 'Unpin quote' : 'Pin this quote'} active={!!pinnedQuote}>
        {pinnedQuote ? <MdBookmark className="w-4 h-4 text-blue-600" /> : <MdOutlineBookmark className="w-4 h-4 text-gray-700" />}
      </IconButton>
      <IconButton onClick={handleRefresh} title="New quote" disabled={!!pinnedQuote}>
        <FiRotateCw className="w-4 h-4 text-gray-700" />
      </IconButton>
    </>
  )

  return (
    <WidgetCard title="Inspiration" icon={<FiStar className="w-5 h-5" />} actions={headerActions}>

      {/* Search panel — shown when search is toggled */}
      {searchOpen && (
        <QuoteSearchPanel
          searchQuotes={searchQuotes}
          searchResults={searchResults}
          isSearching={isSearching}
          onSelect={pickQuoteFromResults}
          onClose={handleSearchClose}
        />
      )}

      {/* Quote body */}
      {isFetching ? (
        <LoadingSpinner label="Fetching a new quote" />
      ) : !currentQuote ? (
        <>
          <ErrorBanner message="" />
          <p>Unable to fetch quote. Please check your API connection.</p>
        </>
      ) : (
        <blockquote className="my-6">
          <p className="text-lg italic font-medium text-gray-900 leading-relaxed">
            "{displayedQuote.text}"
          </p>
          <footer className="mt-4 text-sm font-medium text-gray-600">
            — {displayedQuote.author}
          </footer>
        </blockquote>
      )}

      {/* Category tags */}
      {displayedQuote?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-200">
          {displayedQuote.tags.map((tag, i) => (
            <QuoteTag key={i} label={tag} />
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleFavourite}
          aria-pressed={isFavourited}
          aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-colors bg-gray-50 hover:bg-gray-100 text-gray-700"
        >
          {isFavourited ? <AiFillStar className="w-4 h-4 text-yellow-500" /> : <AiOutlineStar className="w-4 h-4" />}
          {isFavourited ? 'Favorited' : 'Favorite'}
        </button>

        <button
          onClick={() => setDrawerOpen(o => !o)}
          aria-expanded={drawerOpen}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-colors bg-gray-50 hover:bg-gray-100 text-gray-700"
        >
          <FiBook className="w-4 h-4" /> Journal
        </button>

        <button
          onClick={handleShare}
          aria-label="Share this quote"
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-colors bg-gray-50 hover:bg-gray-100 text-gray-700"
        >
          <FiShare2 className="w-4 h-4" /> Share
        </button>
      </div>

      {/* Journal drawer — slides in below the actions */}
      <JournalDrawer
        quote={displayedQuote}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

    </WidgetCard>
  )
}
