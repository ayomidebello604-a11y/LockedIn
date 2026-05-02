// Sidebar.jsx
// Responsive navigation: fixed bottom bar on mobile, left sidebar on desktop
// Receives activePage and onNavigate as props from App.jsx
// Highlights the currently active nav link

import { HiOutlineRectangleStack } from 'react-icons/hi2'
import { FiGrid, FiBookOpen, FiCheckCircle,  FiPlus, FiHelpCircle, FiLogOut, FiBarChart2 } from 'react-icons/fi'

const NAV_LINKS = [
  { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
  { id: 'journal', label: 'Journal', icon: FiBookOpen },
  { id: 'tasks', label: 'Tasks', icon: FiCheckCircle },
  { id: 'analytics', label: 'Analytics', icon: FiBarChart2},
]

export default function Sidebar({ activePage, onNavigate, onLogout, userInfo }) {
  return (
    <aside
      aria-label="Main navigation"
      className="w-full md:w-64 bg-white dark:bg-gray-900 flex flex-row md:flex-col border-t md:border-t-0 md:border-r border-gray-200 dark:border-gray-700 fixed md:static bottom-0 left-0 right-0 z-50 md:z-auto md:overflow-y-auto"
    >

      {/* Brand block — desktop only */}
      <div className="hidden md:block px-4 py-5 border-b border-gray-200 dark:border-gray-700 w-full bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-gray-800 dark:to-gray-800">
        <div className='flex flex-row gap-3 items-start mb-4'>
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
            <HiOutlineRectangleStack className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white">Personal</h1>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Workspace</h2>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Logged in as</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{userInfo?.username || 'User'}</p>
        </div>
      </div>

      {/* Main nav links */}
      <nav className="flex-1 flex flex-row md:flex-col px-0 md:px-3 py-0 md:py-4 space-x-0 md:space-x-0 md:space-y-2 w-full md:w-auto">
        {NAV_LINKS.map(link => {
          const IconComponent = link.icon
          const isActive = activePage === link.id
          return (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-2 md:px-4 py-2 md:py-2.5 rounded-none md:rounded-lg font-medium text-xs md:text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-t-2 md:border-t-0'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <IconComponent className="w-5 h-5 md:w-5 md:h-5" />
              <span className="hidden md:inline text-xs">{link.label}</span>
            </button>
          )
        })}
      </nav>

      {/* New Entry CTA — hidden on mobile */}
      <div className="hidden md:block px-3 py-3 border-t border-gray-200 dark:border-gray-700 w-full md:border-t md:border-t-gray-200 dark:border-t-gray-700">
        <button onClick={() => onNavigate('journal')} className="w-full flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-600 text-white rounded-lg px-3 py-2 font-semibold text-xs hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors">
          <FiPlus className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Footer links — hidden on mobile */}
      <div className="hidden md:flex md:flex-col px-3 py-2 border-t border-gray-200 dark:border-gray-700 space-y-2 w-full">
        <button className="w-full flex items-center gap-3 px-4 py-1.5 text-xs text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
          <FiHelpCircle className="w-4 h-4" />
          <span>Help</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-1.5 text-xs text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
          <FiLogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  )
}
