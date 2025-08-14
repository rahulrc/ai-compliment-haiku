import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { PreferencesProvider } from './contexts/PreferencesContext'
import { ComplimentsProvider } from './contexts/ComplimentsContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Generator from './pages/Generator'
import Favorites from './pages/Favorites'
import History from './pages/History'
import Settings from './pages/Settings'

// Mobile-optimized app with responsive design
export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
    
    // Check localStorage
    const savedTheme = localStorage.getItem('cg_theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('cg_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <PreferencesProvider>
      <ComplimentsProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header theme={theme} onThemeToggle={toggleTheme} />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Generator />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--tw-bg-white)',
                  color: 'var(--tw-text-surface-900)',
                  borderRadius: '14px',
                  boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)',
                },
              }}
            />
          </div>
        </Router>
      </ComplimentsProvider>
    </PreferencesProvider>
  )
}
