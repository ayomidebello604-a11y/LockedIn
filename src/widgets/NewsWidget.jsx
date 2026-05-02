// NewsWidget.jsx
import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useNews } from '../hooks/useNews'
import WidgetCard from '../components/WidgetCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import { FiSearch, FiX, FiImage, FiRss } from 'react-icons/fi'

const CATEGORY_OPTIONS = ['Tech', 'Business', 'Health', 'Sports']

const CATEGORY_COLORS = {
  'Tech': 'bg-blue-100 text-blue-700',
  'Business': 'bg-purple-100 text-purple-700',
  'Health': 'bg-green-100 text-green-700',
  'Sports': 'bg-orange-100 text-orange-700',
}

function CategoryTabs({ active, onSelect }) {
  return (
    <div className="flex gap-1 md:gap-2 mb-3 md:mb-4 overflow-x-auto pb-2">
      {CATEGORY_OPTIONS.map(cat => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          onClick={() => onSelect(cat)}
          className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-semibold transition-colors flex-shrink-0 ${
            active === cat
              ? CATEGORY_COLORS[cat]
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

function ArticleThumbnail({ src, alt }) {
  const [broken, setBroken] = useState(false)

  if (src && !broken) {
    return (
      <img
        src={src}
        alt={alt}
        className="w-12 h-12 md:w-16 md:h-16 object-cover rounded flex-shrink-0"
        onError={() => setBroken(true)}
      />
    )
  }

  return (
    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0" aria-hidden="true">
      <FiImage className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
    </div>
  )
}

function ArticleItem({ article }) {
  const url = article.url === '#' ? undefined : article.url

  function handleClick() {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      className="flex gap-2 md:gap-3 p-2 md:p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <ArticleThumbnail src={article.image} alt={article.title} />
      <div className="flex-1 min-w-0">
        <p className="text-xs md:text-sm font-medium text-gray-900 line-clamp-2">{article.title}</p>
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
          <span className="hidden sm:inline">{article.source}</span>
          <span className="hidden sm:inline">·</span>
          <span>{article.time}</span>
        </div>
      </div>
    </div>
  )
}

export default function NewsWidget() {
  const { state, dispatch } = useAppContext()
  const [searchQuery, setSearchQuery] = useState('')
  const { visibleArticles, isLoading, errorMsg, canLoadMore, loadMore } = useNews(state.newsCategory, searchQuery)

  function handleCategorySelect(cat) {
    dispatch({ type: 'SET_NEWS_CATEGORY', payload: cat })
    setSearchQuery('')
  }

  return (
    <WidgetCard title="Global Feed" icon={<FiRss className="w-5 h-5" />}>
      <ErrorBanner message={errorMsg} />

      <CategoryTabs active={state.newsCategory} onSelect={handleCategorySelect} />

      <div className="relative mb-3 md:mb-4">
        <div className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <FiSearch size={14} />
        </div>
        <input
          type="search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search headlines..."
          aria-label="Search news articles"
          className="w-full pl-7 md:pl-9 pr-8 py-1.5 md:py-2 text-xs md:text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX size={16} />
          </button>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading news articles" />
      ) : (
        <div className="space-y-1">
          {visibleArticles.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No articles found for "{searchQuery}"</p>
          ) : (
            <div role="list" className="divide-y divide-gray-100">
              {visibleArticles.map(article => (
                <div role="listitem" key={article.id}>
                  <ArticleItem article={article} />
                </div>
              ))}
            </div>
          )}

          {canLoadMore && (
            <button
              onClick={loadMore}
              className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Load more stories
            </button>
          )}
        </div>
      )}
    </WidgetCard>
  )
}