import { NavLink } from 'react-router-dom'
import { Volume2, VolumeX, Sun, Moon, Sparkles, Menu, X } from 'lucide-react'
import { usePreferences } from '../contexts/PreferencesContext'
import { useState } from 'react'

interface HeaderProps {
  theme: 'light' | 'dark'
  onThemeToggle: () => void
}

export default function Header({ theme, onThemeToggle }: HeaderProps) {
  const { preferences, toggleSound } = usePreferences()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Generator' },
    { path: '/favorites', label: 'Favorites' },
    { path: '/history', label: 'History' },
    { path: '/settings', label: 'Settings' },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-display font-semibold text-surface-900 dark:text-surface-100">
                Haikudos
              </h1>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Poetry and Praise, On Demand
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-sm font-display font-semibold text-surface-900 dark:text-surface-100">
                Haikudos
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-700'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-surface-200 dark:border-surface-700">
            <nav className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-700'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              
              {/* Sound and Theme Controls in Mobile Menu */}
              <div className="border-t border-surface-200 dark:border-surface-700 pt-4 mt-2">
                <button
                  onClick={toggleSound}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <div className="flex items-center space-x-3">
                    {preferences.soundOn ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                    <span>{preferences.soundOn ? 'Sound On' : 'Sound Off'}</span>
                  </div>
                </button>
                
                <button
                  onClick={onThemeToggle}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <div className="flex items-center space-x-3">
                    {theme === 'light' ? (
                      <Moon className="w-4 h-4" />
                    ) : (
                      <Sun className="w-4 h-4" />
                    )}
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
