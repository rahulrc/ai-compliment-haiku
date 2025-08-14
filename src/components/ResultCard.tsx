import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, Copy, RefreshCw, Sparkles, Shield } from 'lucide-react'
import { useCompliments } from '../contexts/ComplimentsContext'
import { usePreferences } from '../contexts/PreferencesContext'
import { Compliment } from '../contexts/ComplimentsContext'
import toast from 'react-hot-toast'
import Confetti from 'react-confetti'

interface ResultCardProps {
  compliment: Compliment
  onGenerateAnother: () => void
}

export default function ResultCard({ compliment, onGenerateAnother }: ResultCardProps) {
  const { toggleFavorite } = useCompliments()
  const { preferences } = usePreferences()
  const [showConfetti, setShowConfetti] = useState(false)
  const [copied, setCopied] = useState(false)

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
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Sparkle sound: ascending notes
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.15)
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3)
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn('Sound playback failed:', error)
    }
  }, [preferences.soundOn])

  const handleFavorite = () => {
    toggleFavorite(compliment)
    if (preferences.soundOn) {
      playSparkle()
    }
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 700)
    
    // Telemetry
    console.log('compliment_favorited', { id: compliment.id })
    
    toast.success(compliment.isFavorite ? 'Removed from favorites' : 'Added to favorites!')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(compliment.text)
      setCopied(true)
      if (preferences.soundOn) {
        playPop()
      }
      
      // Telemetry
      console.log('compliment_copied', { id: compliment.id })
      
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = compliment.text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleGenerateAnother = () => {
    if (preferences.soundOn) {
      playPop()
    }
    onGenerateAnother()
  }

  const renderSparkles = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Sparkles
        key={i}
        className={`w-5 h-5 ${
          i < score ? 'sparkle' : 'text-surface-300 dark:text-surface-600'
        }`}
      />
    ))
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={50}
          gravity={0.3}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bubble-card p-8"
        aria-live="polite"
      >
        {/* Safety Shield */}
        {compliment.tags.includes('safety-coerced') && (
          <div className="flex items-center justify-center mb-4 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
            <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2" />
            <span className="text-sm text-amber-700 dark:text-amber-300">
              Adjusted to keep things friendly and private
            </span>
          </div>
        )}

        {/* Compliment/Haiku Text */}
        <div className="text-center mb-6">
          {compliment.tags.includes('haiku') ? (
            // Render haiku with proper line breaks
            <div className="text-2xl md:text-3xl font-medium text-surface-900 dark:text-surface-100 leading-relaxed">
              {compliment.text.split('\n').map((line, index) => (
                <div key={index} className="mb-2 last:mb-0">
                  {line}
                </div>
              ))}
            </div>
          ) : (
            // Render regular compliment
            <blockquote className="text-2xl md:text-3xl font-medium text-surface-900 dark:text-surface-100 leading-relaxed text-balance">
              "{compliment.text}"
            </blockquote>
          )}
        </div>

        {/* Tags */}
        {compliment.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {compliment.tags.map((tag) => (
              <span
                key={tag}
                className="chip text-xs px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Sparkle Meter */}
        <div className="flex justify-center items-center mb-6">
          <div className="flex items-center space-x-1">
            {renderSparkles(compliment.sparkleScore)}
          </div>
          <span className="ml-3 text-sm text-surface-600 dark:text-surface-400">
            Sparkle level {compliment.sparkleScore}/5
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleFavorite}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              compliment.isFavorite
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300'
            }`}
            aria-label={compliment.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-5 h-5 ${compliment.isFavorite ? 'fill-current' : ''}`} />
            <span>{compliment.isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              copied
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300'
            }`}
            aria-label="Copy compliment"
          >
            <Copy className="w-5 h-5" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleGenerateAnother}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all duration-200"
            aria-label="Generate another compliment"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Another</span>
          </button>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-6 text-center text-xs text-surface-500 dark:text-surface-400">
          <p>Keyboard shortcuts: F = Favorite, C = Copy, Enter = Another</p>
        </div>
      </motion.div>
    </>
  )
}
