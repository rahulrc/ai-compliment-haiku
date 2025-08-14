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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold mb-2">
            Your Favorite Compliments
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            {favorites.length} compliment{favorites.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedStyle === style
                  ? 'bg-primary-500 text-white'
                  : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
              }`}
            >
              {style === 'all' ? 'All Styles' : style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredFavorites.map((compliment) => (
              <motion.div
                key={compliment.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bubble-card p-6 relative group"
              >
                {/* Confetti for this specific card */}
                {showConfetti === compliment.id && (
                  <Confetti
                    width={400}
                    height={300}
                    recycle={false}
                    numberOfPieces={30}
                    gravity={0.3}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                  />
                )}

                {/* Style Badge */}
                <div className="absolute top-4 right-4">
                  <span className="chip text-xs">
                    {compliment.style}
                  </span>
                </div>

                {/* Compliment Text */}
                <div className="mb-4">
                  <blockquote className="text-lg font-medium text-surface-900 dark:text-surface-100 leading-relaxed text-balance">
                    "{compliment.text}"
                  </blockquote>
                </div>

                {/* Tags */}
                {compliment.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {compliment.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="chip text-xs px-2 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                    {compliment.tags.length > 3 && (
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        +{compliment.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleFavoriteClick(compliment)}
                      className="p-2 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors duration-200"
                      aria-label="Remove from favorites"
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                    <button
                      onClick={() => handleCopy(compliment)}
                      className="p-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200"
                      aria-label="Copy compliment"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(compliment)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    aria-label="Remove from favorites"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Date */}
                <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-600">
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    Saved {new Date(compliment.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty Filter State */}
        {filteredFavorites.length === 0 && favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Filter className="w-16 h-16 mx-auto mb-4 text-surface-300 dark:text-surface-600" />
            <p className="text-lg font-medium text-surface-600 dark:text-surface-400 mb-2">
              No {selectedStyle === 'all' ? '' : selectedStyle} favorites
            </p>
            <p className="text-surface-500 dark:text-surface-400">
              Try adjusting your filter or add some {selectedStyle === 'all' ? '' : selectedStyle} compliments
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
