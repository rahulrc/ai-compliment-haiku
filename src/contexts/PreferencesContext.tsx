import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface Preferences {
  soundOn: boolean
  reducedMotion: boolean
  defaultStyle: 'classic' | 'goofy' | 'poetic' | 'professional'
  defaultSpecificity: number
  privacyNoName: boolean
}

interface PreferencesContextType {
  preferences: Preferences
  updatePreferences: (updates: Partial<Preferences>) => void
  toggleSound: () => void
  toggleMotion: () => void
}

const defaultPreferences: Preferences = {
  soundOn: true,
  reducedMotion: false,
  defaultStyle: 'classic',
  defaultSpecificity: 3,
  privacyNoName: false,
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)

  useEffect(() => {
    // Load preferences from localStorage
    const saved = localStorage.getItem('cg_prefs')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setPreferences({ ...defaultPreferences, ...parsed })
      } catch (error) {
        console.warn('Failed to parse saved preferences:', error)
      }
    }

    // Check system reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      setPreferences(prev => ({ ...prev, reducedMotion: true }))
    }

    // Listen for system preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ ...prev, reducedMotion: e.matches }))
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    // Save preferences to localStorage
    localStorage.setItem('cg_prefs', JSON.stringify(preferences))
  }, [preferences])

  const updatePreferences = (updates: Partial<Preferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }))
  }

  const toggleSound = () => {
    setPreferences(prev => ({ ...prev, soundOn: !prev.soundOn }))
  }

  const toggleMotion = () => {
    setPreferences(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }))
  }

  return (
    <PreferencesContext.Provider value={{
      preferences,
      updatePreferences,
      toggleSound,
      toggleMotion,
    }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}
