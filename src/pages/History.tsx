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

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Clock className="w-24 h-24 mx-auto mb-6 text-surface-300 dark:text-surface-600" />
          <h2 className="text-2xl font-display font-semibold mb-4">
            No history yet
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8">
            Generate your first compliment to see it here
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <span>Generate Compliment</span>
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-display font-bold mb-2">
              Recent Compliments
            </h1>
            <p className="text-surface-600 dark:text-surface-400">
              Last {history.length} generated
            </p>
          </div>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>

        {/* History List */}
        <div className="space-y-4">
          <AnimatePresence>
            {history.map((compliment, index) => (
              <motion.div
                key={compliment.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="bubble-card p-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Main Content */}
                  <div className="flex-1">
                    {/* Style and Time */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="chip text-xs">
                        {compliment.style}
                      </span>
                      <span className="text-sm text-surface-500 dark:text-surface-400">
                        {formatTimestamp(compliment.timestamp)}
                      </span>
                    </div>

                    {/* Compliment Text */}
                    <blockquote className="text-lg font-medium text-surface-900 dark:text-surface-100 leading-relaxed text-balance mb-3">
                      "{compliment.text}"
                    </blockquote>

                    {/* Tags */}
                    {compliment.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {compliment.tags.map((tag) => (
                          <span
                            key={tag}
                            className="chip text-xs px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Context */}
                    {compliment.context && compliment.context.length > 0 && (
                      <div className="text-sm text-surface-600 dark:text-surface-400">
                        <span className="font-medium">Context:</span>{' '}
                        {compliment.context.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center sm:flex-col gap-2">
                    <button
                      onClick={() => handleFavorite(compliment)}
                      className={`p-3 rounded-lg transition-colors duration-200 ${
                        compliment.isFavorite
                          ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                          : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                      }`}
                      aria-label={compliment.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-5 h-5 ${compliment.isFavorite ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleCopy(compliment)}
                      className="p-3 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200"
                      aria-label="Copy compliment"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Clear History Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bubble-card p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                
                <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                  Clear History?
                </h3>
                
                <p className="text-surface-600 dark:text-surface-400">
                  This will permanently remove all {history.length} compliments from your history. This action cannot be undone.
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-4 py-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
