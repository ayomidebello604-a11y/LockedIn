// FavouritesPage.jsx
// Shows all the quotes the user has starred from the Quote Widget
// Each favourite displays the quote text, author, and category tags
// Users can un-favourite individual quotes from this page
// Data is read from JournalContext (favourites array) which is localStorage-backed

import { useJournalContext } from '../context/JournalContext'
import QuoteTag              from '../components/QuoteTag'
import { FiStar } from 'react-icons/fi'

function FavouriteCard({ quote, onRemove }) {
  return (
    <article
      style={{
        padding:      20,
        borderRadius: 12,
        marginBottom: 14,
        position:     'relative',
      }}
    >
      <button
        onClick={() => onRemove(quote)}
        aria-label="Remove from favourites"
        title="Remove from favourites"
        style={{
          position:   'absolute',
          top:        14,
          right:      14,
          background: 'none',
          border:     'none',
          cursor:     'pointer',
          display:    'flex',
          alignItems: 'center',
          color:      '#fbbf24',
        }}
      >
        <FiStar size={16} fill="currentColor" />
      </button>

      {/* Quote text */}
      <blockquote style={{ margin: '0 0 10px', padding: 0 }}>
        <p style={{ margin: '0 0 8px', fontSize: 15, fontStyle: 'italic', lineHeight: 1.65, fontFamily: 'Georgia, serif', paddingRight: 28 }}>
          "{quote.text}"
        </p>
        <footer style={{ fontSize: 13, fontWeight: 600 }}>
          — {quote.author}
        </footer>
      </blockquote>

      {/* Tags */}
      {quote.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
          {quote.tags.map(tag => (
            <QuoteTag key={tag} label={tag} />
          ))}
        </div>
      )}
    </article>
  )
}

export default function FavouritesPage() {
  const { favourites, toggleFavourite } = useJournalContext()

  return (
    <main
      role="main"
      aria-label="Favourite quotes"
      style={{ flex: 1, padding: 24, overflowY: 'auto', maxWidth: 720 }}
    >
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>Favourites</h1>
        <p style={{ margin: 0, fontSize: 14 }}>
          {favourites.length === 0
            ? 'No favourites yet.'
            : `${favourites.length} quote${favourites.length > 1 ? 's' : ''} saved`}
        </p>
      </div>

      {favourites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', fontSize: 14 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>
            <FiStar size={40} style={{margin: '0 auto', color: '#fbbf24', marginBottom: 12}} />
          </div>
          <p>Your favourites list is empty.</p>
          <p>Star a quote on the dashboard to save it here.</p>
        </div>
      ) : (
        <div>
          {favourites.map((quote, index) => (
            <FavouriteCard
              key={`${quote.text}-${index}`}
              quote={quote}
              onRemove={toggleFavourite}
            />
          ))}
        </div>
      )}
    </main>
  )
}
