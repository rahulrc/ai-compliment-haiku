import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePreferences } from './PreferencesContext'

export interface Compliment {
  id: string
  text: string
  sparkleScore: number
  tags: string[]
  style: 'classic' | 'goofy' | 'poetic' | 'professional'
  specificity: number
  relationship?: string
  context?: string[]
  timestamp: number
  isFavorite: boolean
}

interface ComplimentsContextType {
  favorites: Compliment[]
  history: Compliment[]
  addToFavorites: (compliment: Compliment) => void
  removeFromFavorites: (id: string) => void
  addToHistory: (compliment: Compliment) => void
  clearHistory: () => void
  toggleFavorite: (compliment: Compliment) => void
}

const ComplimentsContext = createContext<ComplimentsContextType | undefined>(undefined)

export function ComplimentsProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Compliment[]>([])
  const [history, setHistory] = useState<Compliment[]>([])
  const { preferences } = usePreferences()

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('cg_favorites')
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites)
        setFavorites(parsed)
      } catch (error) {
        console.warn('Failed to parse saved favorites:', error)
      }
    }

    // Load history from localStorage
    const savedHistory = localStorage.getItem('cg_history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setHistory(parsed)
      } catch (error) {
        console.warn('Failed to parse saved history:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Save favorites to localStorage
    localStorage.setItem('cg_favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    // Save history to localStorage (respect privacy setting)
    const historyToSave = preferences.privacyNoName 
      ? history.map(({ relationship, context, ...rest }) => rest)
      : history
    localStorage.setItem('cg_history', JSON.stringify(historyToSave))
  }, [history, preferences.privacyNoName])

  const addToFavorites = (compliment: Compliment) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === compliment.id)
      if (exists) return prev
      return [...prev, { ...compliment, isFavorite: true }]
    })
  }

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id))
  }

  const addToHistory = (compliment: Compliment) => {
    setHistory(prev => {
      const newHistory = [{ ...compliment, isFavorite: false }, ...prev]
      // Keep only last 10
      return newHistory.slice(0, 10)
    })
  }

  const clearHistory = () => {
    setHistory([])
  }

  const toggleFavorite = (compliment: Compliment) => {
    if (compliment.isFavorite) {
      removeFromFavorites(compliment.id)
      // Update history item
      setHistory(prev => 
        prev.map(h => 
          h.id === compliment.id ? { ...h, isFavorite: false } : h
        )
      )
    } else {
      addToFavorites(compliment)
      // Update history item
      setHistory(prev => 
        prev.map(h => 
          h.id === compliment.id ? { ...h, isFavorite: true } : h
        )
      )
    }
  }

  return (
    <ComplimentsContext.Provider value={{
      favorites,
      history,
      addToFavorites,
      removeFromFavorites,
      addToHistory,
      clearHistory,
      toggleFavorite,
    }}>
      {children}
    </ComplimentsContext.Provider>
  )
}

export function useCompliments() {
  const context = useContext(ComplimentsContext)
  if (context === undefined) {
    throw new Error('useCompliments must be used within a ComplimentsProvider')
  }
  return context
}
