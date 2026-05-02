// JournalContext.jsx
// Manages two things:
//   1. Journal entries — reflections the user writes about a quote
//   2. Favourite quotes — quotes the user has starred
// Both are saved to localStorage

import { createContext, useContext, useState, useEffect } from 'react'

const JournalContext = createContext(null)

const JOURNAL_KEY    = 'productivity_journal'
const FAVOURITES_KEY = 'productivity_favourites'

function loadFromStorage(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function JournalProvider({ children }) {
  const [entries,    setEntries]    = useState(() => loadFromStorage(JOURNAL_KEY))
  const [favourites, setFavourites] = useState(() => loadFromStorage(FAVOURITES_KEY))

  useEffect(() => {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries))
  }, [entries])

  useEffect(() => {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites))
  }, [favourites])

  // Add a new journal entry linked to a quote
  function saveJournalEntry(quoteText, author, reflection) {
    const entry = {
      id:         `entry-${Date.now()}`,
      quoteText,
      author,
      reflection,
      createdAt:  new Date().toISOString(),
    }
    setEntries(prev => [entry, ...prev])
  }

  // Remove a journal entry by id
  function removeJournalEntry(id) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  // Toggle a quote in/out of favourites
  function toggleFavourite(quote) {
    setFavourites(prev => {
      const alreadySaved = prev.some(q => q.text === quote.text)
      return alreadySaved
        ? prev.filter(q => q.text !== quote.text)
        : [quote, ...prev]
    })
  }

  // Check if a quote is already favourited
  function isQuoteFavourited(quoteText) {
    return favourites.some(q => q.text === quoteText)
  }

  return (
    <JournalContext.Provider value={{
      entries,
      favourites,
      saveJournalEntry,
      removeJournalEntry,
      toggleFavourite,
      isQuoteFavourited,
    }}>
      {children}
    </JournalContext.Provider>
  )
}

export function useJournalContext() {
  const context = useContext(JournalContext)
  if (!context) {
    throw new Error('useJournalContext must be called inside <JournalProvider>')
  }
  return context
}
