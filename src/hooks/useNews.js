// useNews.js
// Custom hook that fetches top news headlines from NewsAPI
// Supports: category switching, keyword search, load-more pagination

import { useState, useEffect, useCallback } from 'react'

// Add VITE_NEWS_KEY=your_key to .env in the project root
const NEWS_API_KEY = import.meta.env.VITE_NEWS_KEY || ''

const ARTICLES_PER_PAGE = 3

export function useNews(category, searchQuery = '') {
  const [allArticles, setAllArticles] = useState([])
  const [isLoading,   setIsLoading]   = useState(true)
  const [errorMsg,    setErrorMsg]     = useState(null)
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE)

  const loadArticles = useCallback(async () => {
    setIsLoading(true)
    setErrorMsg(null)
    setVisibleCount(ARTICLES_PER_PAGE)

    if (!NEWS_API_KEY) {
      setAllArticles([])
      setErrorMsg('No API key configured')
      setIsLoading(false)
      return
    }

    try {
      const query    = searchQuery || category
      const endpoint = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}`
      const response = await fetch(endpoint)

      if (!response.ok) throw new Error('News API request failed')

      const json = await response.json()

      const mapped = json.articles.map((article, index) => ({
        id:     `live-${index}`,
        title:  article.title,
        source: article.source.name,
        time:   new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        url:    article.url,
        image:  article.urlToImage,
      }))

      setAllArticles(mapped)
    } catch (err) {
      setErrorMsg(err.message)
      setAllArticles([])
    } finally {
      setIsLoading(false)
    }
  }, [category, searchQuery])

  useEffect(() => {
    loadArticles()
  }, [loadArticles])

  // Filter articles by search query locally (for instant feedback)
  const filteredArticles = searchQuery
    ? allArticles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.source.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allArticles

  const visibleArticles = filteredArticles.slice(0, visibleCount)
  const canLoadMore     = visibleCount < filteredArticles.length

  function loadMore() {
    setVisibleCount(prev => prev + ARTICLES_PER_PAGE)
  }

  return { visibleArticles, isLoading, errorMsg, canLoadMore, loadMore }
}
