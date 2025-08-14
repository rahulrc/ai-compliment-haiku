import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Copy, Clock, Trash2, AlertTriangle } from 'lucide-react'
import { useCompliments } from '../contexts/ComplimentsContext'
import { usePreferences } from '../contexts/PreferencesContext'
import { Compliment } from '../contexts/ComplimentsContext'
import toast from 'react-hot-toast'

export default function History() {
  const { history, clearHistory, toggleFavorite } = useCompliments()
  const { preferences } = usePreferences()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Sound effects using Web Audio API
  const playPop = useCallback(() => {
    if (!preferences.soundOn) return
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.warn('Sound playback failed:', error)
    }
  }, [preferences.soundOn])

  const handleCopy = async (compliment: Compliment) => {
    try {
      await navigator.clipboard.writeText(compliment.text)
      if (preferences.soundOn) {
        playPop()
      }
      toast.success('Copied to clipboard!')
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = compliment.text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('Copied to clipboard!')
    }
  }

  const handleFavorite = (compliment: Compliment) => {
    toggleFavorite(compliment)
    toast.success(compliment.isFavorite ? 'Removed from favorites' : 'Added to favorites!')
  }

  const handleClearHistory = () => {
    clearHistory()
    setShowClearConfirm(false)
    toast.success('History cleared!')
  }

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 sm:space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-surface-100 mb-2">
            Generation History
          </h1>
          <p className="text-surface-600 dark:text-surface-400 text-sm sm:text-base">
            Your recent compliments and haikus
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            {history.length} recent generation{history.length !== 1 ? 's' : ''}
          </p>
          
          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Clear History
            </button>
          )}
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="bubble-card p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              No history yet
            </h3>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Generate some compliments or haikus to see them here!
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bubble-button"
            >
              Start Generating
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {history.map((compliment, index) => (
              <motion.div
                key={compliment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bubble-card p-4 sm:p-6"
              >
                {/* Content */}
                <div className="mb-4">
                  {compliment.tags.includes('haiku') ? (
                    <div className="text-lg sm:text-xl font-medium text-surface-900 dark:text-surface-100 leading-relaxed">
                      {compliment.text.split('\n').map((line, index) => (
                        <div key={index} className="mb-1 last:mb-0">
                          {line}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <blockquote className="text-lg sm:text-xl font-medium text-surface-900 dark:text-surface-100 leading-relaxed">
                      "{compliment.text}"
                    </blockquote>
                  )}
                </div>

                {/* Tags and Sparkle */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {compliment.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  <div className="flex items-center space-x-1 ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < compliment.sparkleScore 
                            ? 'bg-yellow-400' 
                            : 'bg-surface-200 dark:bg-surface-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Actions and Date */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleCopy(compliment)}
                      className="flex items-center justify-center space-x-2 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      <span>📋</span>
                      <span>Copy</span>
                    </button>
                    
                    <button
                      onClick={() => handleFavorite(compliment)}
                      className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        compliment.isFavorite 
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                          : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300'
                      }`}
                    >
                      <span className="text-lg">
                        {compliment.isFavorite ? '★' : '☆'}
                      </span>
                      <span>{compliment.isFavorite ? 'Favorited' : 'Favorite'}</span>
                    </button>
                  </div>
                  
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    {new Date(compliment.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bubble-card p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                Clear History?
              </h3>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                This will permanently remove all your generation history. This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleClearHistory}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Yes, Clear All
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
