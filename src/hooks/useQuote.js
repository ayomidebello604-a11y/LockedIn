// useQuote.js
// Custom hook that manages the current quote displayed in the Quote Widget
// Fetches quotes from dummyjson API: https://dummyjson.com/quotes?limit=150
// Supports: fetch a random quote, search by keyword or author, select from results

import { useState, useCallback, useRef } from 'react'

const API_URL = 'https://dummyjson.com/quotes?limit=150'

export function useQuote() {
  const [currentQuote,   setCurrentQuote]   = useState(null)
  const [isFetching,     setIsFetching]     = useState(false)
  const [isSearching,    setIsSearching]    = useState(false)
  const [searchResults,  setSearchResults]  = useState([])
  const [fetchError,     setFetchError]     = useState(null)
  const quotesCacheRef = useRef(null)

  // Fetch quotes from API (cached after first fetch)
  const fetchQuotesFromAPI = useCallback(async () => {
    if (quotesCacheRef.current) {
      return quotesCacheRef.current
    }
    
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Failed to fetch quotes')
      const data = await response.json()
      // Transform API response to match our format
      const transformedQuotes = data.quotes.map(q => ({
        text: q.quote,
        author: q.author
      }))
      quotesCacheRef.current = transformedQuotes
      return transformedQuotes
    } catch (err) {
      throw new Error(`Failed to fetch quotes: ${err.message}`)
    }
  }, [])

  // Fetch a fresh random quote from the API
  const fetchRandomQuote = useCallback(async () => {
    setIsFetching(true)
    setFetchError(null)
    try {
      const quotes = await fetchQuotesFromAPI()
      const randomIndex = Math.floor(Math.random() * quotes.length)
      setCurrentQuote(quotes[randomIndex])
    } catch (err) {
      setFetchError(err.message)
      setCurrentQuote(null)
    } finally {
      setIsFetching(false)
    }
  }, [fetchQuotesFromAPI])

  // Search quotes by keyword or author name from API
  const searchQuotes = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    try {
      const quotes = await fetchQuotesFromAPI()
      const lowerQuery = query.toLowerCase()
      const results = quotes.filter(q => 
        q.text.toLowerCase().includes(lowerQuery) || 
        q.author.toLowerCase().includes(lowerQuery)
      )
      setSearchResults(results)
    } catch (err) {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [fetchQuotesFromAPI])

  // Select a quote from search results and clear the results panel
  function pickQuoteFromResults(quote) {
    setCurrentQuote(quote)
    setSearchResults([])
  }

  // Clear search results without changing the current quote
  function clearSearchResults() {
    setSearchResults([])
  }

  return {
    currentQuote,
    isFetching,
    isSearching,
    searchResults,
    fetchError,
    fetchRandomQuote,
    searchQuotes,
    pickQuoteFromResults,
    clearSearchResults,
  }
}
