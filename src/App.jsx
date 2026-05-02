// App.jsx
// Root component — wires all context providers together and controls page routing
// Routing is handled manually with a simple activePage string (no react-router needed)
// Login system: shows LoginPage initially, then main app after authentication
// Layout: fixed Navbar at the top, bottom/side navigation, and page content

import { useState, useEffect }  from 'react'
import { AppProvider }          from './context/AppContext'
import { TaskProvider }         from './context/TaskContext'
import { JournalProvider }      from './context/JournalContext'
import Navbar                   from './components/Navbar'
import Sidebar                  from './components/Sidebar'
import LoginPage                from './pages/LoginPage'
import RegisterPage             from './pages/RegisterPage'
import DashboardPage            from './pages/DashboardPage'
import JournalPage              from './pages/JournalPage'
import TasksPage                from './pages/TasksPage'
import AnalyticsPage            from './pages/AnalyticsPage'

// Map page id strings to their page components
const PAGE_MAP = {
  dashboard: DashboardPage,
  journal:   JournalPage,
  tasks:     TasksPage,
  analytics: AnalyticsPage,
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [activePage, setActivePage] = useState('dashboard')
  const [showRegister, setShowRegister] = useState(false)

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setUserInfo(user)
        setIsLoggedIn(true)
      } catch (error) {
        console.error('Failed to parse stored user info:', error)
        localStorage.removeItem('userInfo')
      }
    }
  }, [])

  const handleLogin = (formData) => {
    // Extract username from email or use a default
    const username = formData.username || formData.email.split('@')[0]
    setUserInfo({
      username: username,
      email: formData.email,
    })
    setIsLoggedIn(true)
  }

  const handleRegister = (formData) => {
    setUserInfo({
      username: formData.username,
      email: formData.email,
    })
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserInfo(null)
    setActivePage('dashboard')
    setShowRegister(false)
    localStorage.removeItem('userInfo')
  }

  // Show login/register pages if not logged in
  if (!isLoggedIn) {
    return showRegister ? (
      <RegisterPage onRegister={handleRegister} onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginPage onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />
    )
  }

  const ActivePageComponent = PAGE_MAP[activePage] || DashboardPage

  return (
    <AppProvider>
      <TaskProvider>
        <JournalProvider>

          <div className="flex flex-col h-screen bg-gray-50">

            {/* Top navigation bar — spans full width */}
            <Navbar userInfo={userInfo} onLogout={handleLogout} />

            {/* Body layout — responsive: mobile bottom nav, desktop side nav */}
            <div className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden">

              {/* Sidebar — responsive positioning: bottom on mobile, left on desktop */}
              <Sidebar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} userInfo={userInfo} />

              {/* Active page fills remaining space and scrolls independently */}
              {/* On mobile, account for fixed bottom nav with pb-20 */}
              <div className="flex-1 overflow-auto pb-20 md:pb-0">
                <ActivePageComponent />
              </div>

            </div>
          </div>

        </JournalProvider>
      </TaskProvider>
    </AppProvider>
  )
}
