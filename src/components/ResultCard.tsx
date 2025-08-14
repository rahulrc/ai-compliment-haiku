import React, { useState, useCallback } from 'react'
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
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bubble-card p-4 sm:p-6 lg:p-8"
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

        {/* Sparkle Meter */}
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: i < compliment.sparkleScore ? 1 : 0.3 }}
                transition={{ delay: i * 0.1 }}
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${
                  i < compliment.sparkleScore 
                    ? 'bg-yellow-400 animate-pulse' 
                    : 'bg-surface-200 dark:bg-surface-600'
                }`}
              />
            ))}
          </div>
          <span className="ml-3 text-sm sm:text-base text-surface-600 dark:text-surface-400">
            Sparkle Level {compliment.sparkleScore}/5
          </span>
        </div>

        {/* Compliment Text */}
        <div className="text-center mb-6 sm:mb-8">
          {compliment.tags.includes('haiku') ? (
            <div className="text-xl sm:text-2xl md:text-3xl font-medium text-surface-900 dark:text-surface-100 leading-relaxed">
              {compliment.text.split('\n').map((line, index) => (
                <div key={index} className="mb-2 last:mb-0">
                  {line}
                </div>
              ))}
            </div>
          ) : (
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-medium text-surface-900 dark:text-surface-100 leading-relaxed text-balance">
              "{compliment.text}"
            </blockquote>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
          {compliment.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={handleFavorite}
            className={`bubble-button ${
              compliment.isFavorite 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
            } text-surface-700 dark:text-surface-300 px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg sm:text-xl">
                {compliment.isFavorite ? '★' : '☆'}
              </span>
              <span className="text-sm sm:text-base">
                {compliment.isFavorite ? 'Favorited' : 'Favorite'}
              </span>
            </div>
          </button>

          <button
            onClick={handleCopy}
            className="bubble-button bg-primary-500 hover:bg-primary-600 text-white px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg sm:text-xl">📋</span>
              <span className="text-sm sm:text-base">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </div>
          </button>

          <button
            onClick={handleGenerateAnother}
            className="bubble-button bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg sm:text-xl">🔄</span>
              <span className="text-sm sm:text-base">Another</span>
            </div>
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
