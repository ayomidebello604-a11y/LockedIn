// Navbar.jsx
// Top navigation bar rendered at the top of the entire app
// Contains: app logo, global search input, today's date, theme toggle, settings, user profile
// Reads and updates theme from AppContext

import { useState, useCallback } from 'react'
import { useAppContext } from '../context/AppContext'
import IconButton from './IconButton'
import { FiSearch, FiMoon, FiSun, FiSettings, FiLogOut } from 'react-icons/fi'
import { HiOutlineRectangleStack } from 'react-icons/hi2'

export default function Navbar({ userInfo, onLogout }) {
  const { state, dispatch } = useAppContext()
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const formattedDate = new Date().toLocaleDateString('en-UK', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
  })

  function handleThemeToggle() {
    dispatch({ type: 'TOGGLE_THEME' })
  }

  const handleLogout = () => {
    setProfileOpen(false)
    onLogout()
  }

  const handleSearch = useCallback((e) => {
    const query = e.target.value
    setSearchQuery(query)
    // Search functionality can be extended here to filter content
    if (query.length > 0) {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
    }
  }, [dispatch])

  // Get first letter of username for avatar
  const avatarLetter = userInfo?.username?.charAt(0)?.toUpperCase() || 'U'

  return (
    <nav className="flex items-center justify-between px-3 md:px-6 lg:px-8 py-2 bg-white border-b border-gray-200 gap-2 md:gap-4 sticky top-0 z-40">

      {/* Left side — logo and search */}
      <div className="flex items-center gap-2 md:gap-6 min-w-0 flex-1">

        <div className="flex items-center gap-2 flex-shrink-0">
          <HiOutlineRectangleStack className="w-5 h-5 text-blue-600" />
          <span className="text-xs md:text-sm font-semibold text-gray-900 inline">
            ProductivityOS
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 flex-1 max-w-md">
          <FiSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="bg-transparent text-xs outline-none flex-1 text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right side — date, controls, user profile */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">

        <span className="text-xs text-gray-600 hidden lg:inline">{formattedDate}</span>

        {/* Theme toggle */}
        <IconButton onClick={handleThemeToggle} title={state.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          {state.theme === 'light' ? (
            <FiMoon className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
          ) : (
            <FiSun className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
          )}
        </IconButton>

        {/* Settings */}
        <IconButton title="Settings">
          <FiSettings className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
        </IconButton>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            title="Profile menu"
          >
            {avatarLetter}
          </button>

          {/* Dropdown menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{userInfo?.username}</p>
                <p className="text-xs text-gray-600 truncate">{userInfo?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Close dropdown when clicking outside */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileOpen(false)}
        />
      )}

    </nav>
  )
}
