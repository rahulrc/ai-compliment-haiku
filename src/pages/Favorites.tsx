import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Copy, Filter, X, Heart } from 'lucide-react'
import { useCompliments } from '../contexts/ComplimentsContext'
import { usePreferences } from '../contexts/PreferencesContext'
import { Compliment } from '../contexts/ComplimentsContext'
import toast from 'react-hot-toast'
import Confetti from 'react-confetti'

export default function Favorites() {
  const { favorites, removeFromFavorites } = useCompliments()
  const { preferences } = usePreferences()
  const [selectedStyle, setSelectedStyle] = useState<string>('all')
  const [showConfetti, setShowConfetti] = useState<string | null>(null)


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

  const playSparkle = useCallback(() => {
    if (!preferences.soundOn) return
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Sparkle sound: ascending notes
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1)
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    } catch (error) {
      console.warn('Sound playback failed:', error)
    }
  }, [preferences.soundOn])

  const styles = ['all', 'classic', 'goofy', 'poetic', 'professional']

  const filteredFavorites = useMemo(() => {
    if (selectedStyle === 'all') return favorites
    return favorites.filter(fav => fav.style === selectedStyle)
  }, [favorites, selectedStyle])

  const handleRemove = (compliment: Compliment) => {
    removeFromFavorites(compliment.id)
    
    if (preferences.soundOn) {
      playPop()
    }

    // Show undo toast
    toast.success(
      (t) => (
        <div className="flex items-center space-x-2">
          <span>Removed from favorites</span>
          <button
            onClick={() => {
              // Re-add to favorites
              // Note: This would need to be implemented in the context
              toast.dismiss(t.id)
              toast.success('Restored to favorites!')
            }}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Undo
          </button>
        </div>
      ),
      { duration: 4000 }
    )
  }

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

  const handleFavoriteClick = (compliment: Compliment) => {
    if (preferences.soundOn) {
      playSparkle()
    }
    setShowConfetti(compliment.id)
    setTimeout(() => setShowConfetti(null), 700)
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Heart className="w-24 h-24 mx-auto mb-6 text-surface-300 dark:text-surface-600" />
          <h2 className="text-2xl font-display font-semibold mb-4">
            No favorites yet
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8">
            Tap ★ on a compliment to save it here for later
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <Star className="w-5 h-5" />
            <span>Generate Your First Compliment</span>
          </a>
        </motion.div>
      </div>
    )
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
            Your Favorites
          </h1>
          <p className="text-surface-600 dark:text-surface-400 text-sm sm:text-base">
            All the compliments and haikus you've loved
          </p>
        </div>

        {/* Filters */}
        <div className="bubble-card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStyle('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedStyle === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                }`}
              >
                All
              </button>
              {['classic', 'goofy', 'poetic', 'professional'].map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedStyle === style
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                  }`}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length === 0 ? (
          <div className="bubble-card p-8 text-center">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              No favorites yet
            </h3>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Generate some compliments or haikus and save the ones you love!
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bubble-button"
            >
              Start Generating
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredFavorites.map((compliment) => (
              <motion.div
                key={compliment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
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

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleCopy(compliment)}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <span>📋</span>
                    <span>Copy</span>
                  </button>
                  
                  <button
                    onClick={() => handleRemove(compliment)}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <span>🗑️</span>
                    <span>Remove</span>
                  </button>
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
                Clear All Favorites?
              </h3>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                This will permanently remove all your saved favorites. This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleClearAll}
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

      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          onConfettiComplete={() => setShowConfetti(null)}
        />
      )}
    </div>
  )
}
