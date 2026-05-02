// AppContext.jsx
// Manages global app state: theme (light/dark), user city, active news category
// Used by Navbar (theme toggle), WeatherWidget (city), NewsWidget (category)

import { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext(null)

const startingState = {
  theme: 'light',
  city: null, // Will be set by geolocation
  newsCategory: 'Technology',
  searchQuery: '',
  locationError: null,
}

function reducer(state, action) {
  switch (action.type) {

    case 'TOGGLE_THEME':
      const nextTheme = state.theme === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', nextTheme)
      return { ...state, theme: nextTheme }

    case 'SET_CITY':
      return { ...state, city: action.payload }

    case 'SET_NEWS_CATEGORY':
      return { ...state, newsCategory: action.payload }

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, startingState)

  // Fetch user's geolocation on mount
  useEffect(() => {
    const getLocationFromGeolocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            console.log('Geolocation found:', latitude, longitude)
            
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              )
              const data = await response.json()
              const address = data.address || {}
              
              const city = address.city || address.town || address.village || 'London'
              console.log('City fetched from geolocation:', city)
              dispatch({ type: 'SET_CITY', payload: city })
            } catch (error) {
              console.error('Reverse geocoding error:', error)
              // Try fallback with IP-based geolocation
              getLocationFromIP()
            }
          },
          (error) => {
            console.warn('Geolocation permission denied or unavailable:', error.message)
            // Fallback to IP-based geolocation
            getLocationFromIP()
          },
          { enableHighAccuracy: false, timeout: 10000 }
        )
      } else {
        console.warn('Geolocation not supported')
        getLocationFromIP()
      }
    }

    const getLocationFromIP = async () => {
      try {
        // Try IP-based geolocation service
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        const city = data.city || data.region || 'London'
        console.log('City fetched from IP:', city)
        dispatch({ type: 'SET_CITY', payload: city })
      } catch (error) {
        console.error('IP geolocation error:', error)
        dispatch({ type: 'SET_CITY', payload: 'London' })
      }
    }

    getLocationFromGeolocation()
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook so any component can read/update global state
export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be called inside <AppProvider>')
  }
  return context
}
