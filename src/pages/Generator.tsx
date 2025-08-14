import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePreferences } from '../contexts/PreferencesContext'
import { useCompliments } from '../contexts/ComplimentsContext'
import { Compliment } from '../contexts/ComplimentsContext'
import toast from 'react-hot-toast'
import { Sparkles, RefreshCw, Heart, Star, Zap } from 'lucide-react'
import ContextChips from '../components/ContextChips'
import StyleSelector from '../components/StyleSelector'
import SpecificitySlider from '../components/SpecificitySlider'
import ResultCard from '../components/ResultCard'
import LoadingCard from '../components/LoadingCard'
import ErrorCard from '../components/ErrorCard'
import { generateCompliment as generateComplimentAPI } from '../api/compliment'

interface GeneratorInputs {
  name: string
  relationship: string
  context: string[]
  style: 'classic' | 'goofy' | 'poetic' | 'professional'
  specificity: number
  generationType?: 'compliment' | 'haiku'
}

const relationships = [
  'coworker',
  'manager',
  'teammate',
  'friend',
  'family',
  'other'
]

export default function Generator() {
  const { preferences } = usePreferences()
  const { addToHistory } = useCompliments()
  
  const [inputs, setInputs] = useState<GeneratorInputs>({
    name: '',
    relationship: preferences.defaultStyle === 'professional' ? 'coworker' : 'friend',
    context: [],
    style: preferences.defaultStyle,
    specificity: preferences.defaultSpecificity,
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [result, setResult] = useState<Compliment | null>(null)
  const [error, setError] = useState<string>('')

  // Sound effects using Web Audio API
  const playSuccess = useCallback(() => {
    if (!preferences.soundOn) return
    
    try {
      // Create audio context if it doesn't exist
      let audioContext = (window as any).audioContext
      
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        ;(window as any).audioContext = audioContext
      }
      
      // Resume context if suspended (required by modern browsers)
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
      
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Success sound: ascending notes
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2)
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.4)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.4)
    } catch (error) {
      console.warn('Sound playback failed:', error)
    }
  }, [preferences.soundOn])

  const handleInputChange = (field: keyof GeneratorInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }))
  }

  const handleContextAdd = (context: string) => {
    if (inputs.context.length >= 8) {
      toast.error('Maximum 8 context hints allowed')
      return
    }
    if (context.trim() && !inputs.context.includes(context.trim())) {
      setInputs(prev => ({ ...prev, context: [...prev.context, context.trim()] }))
    }
  }

  const handleContextRemove = (index: number) => {
    setInputs(prev => ({ ...prev, context: prev.context.filter((_, i) => i !== index) }))
  }

  const generateCompliment = useCallback(async () => {
    if (inputs.context.length === 0) {
      toast.error('Please add at least one context hint')
      return
    }

    setStatus('loading')
    setError('')
    setResult(null)

    try {
      // Prepare payload (respect privacy setting)
      const payload = {
        relationship: inputs.relationship,
        context: inputs.context,
        style: inputs.style,
        specificity: inputs.specificity,
        type: 'compliment' as const,
        ...(preferences.privacyNoName ? {} : { name: inputs.name })
      }

      // Use mock API for development
      const data = await generateComplimentAPI(payload)
      
      // Client-side safety check
      if (data.compliment.length > 280) {
        throw new Error('Generated compliment is too long')
      }

      // Check emoji usage
      if (inputs.style !== 'goofy' && /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(data.compliment)) {
        throw new Error('Emojis only allowed in goofy style')
      }

      const compliment: Compliment = {
        id: Date.now().toString(),
        text: data.compliment,
        sparkleScore: data.sparkleScore || 3,
        tags: data.tags || [],
        style: inputs.style,
        specificity: inputs.specificity,
        relationship: inputs.relationship,
        context: inputs.context,
        timestamp: Date.now(),
        isFavorite: false,
      }

      setResult(compliment)
      addToHistory(compliment)
      setStatus('idle')
      
      // Play success sound
      playSuccess()

      // Telemetry
      console.log('compliment_generated', {
        sparkleScore: compliment.sparkleScore,
        tags: compliment.tags,
        style: inputs.style,
        specificity: inputs.specificity,
        contextCount: inputs.context.length
      })

    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate compliment')
      setStatus('error')
      
      // Telemetry
      console.log('compliment_error', { reason: err instanceof Error ? err.message : 'unknown' })
    }
  }, [inputs, preferences.privacyNoName, addToHistory, playSuccess])

  const generateHaiku = useCallback(async () => {
    if (inputs.context.length === 0) {
      toast.error('Please add at least one context hint')
      return
    }

    setStatus('loading')
    setError('')
    setResult(null)

    try {
      // Prepare payload for haiku generation
      const payload = {
        relationship: inputs.relationship,
        context: inputs.context,
        style: inputs.style,
        specificity: inputs.specificity,
        type: 'haiku' as const,
        ...(preferences.privacyNoName ? {} : { name: inputs.name })
      }

      // Use API for haiku generation
      const data = await generateComplimentAPI(payload)
      
      // Create a compliment object for the haiku (reusing existing structure)
      const haiku: Compliment = {
        id: Date.now().toString(),
        text: data.compliment,
        sparkleScore: data.sparkleScore || 3,
        tags: [...data.tags || [], 'haiku'],
        style: inputs.style,
        specificity: inputs.specificity,
        relationship: inputs.relationship,
        context: inputs.context,
        timestamp: Date.now(),
        isFavorite: false,
      }

      setResult(haiku)
      addToHistory(haiku)
      setStatus('idle')
      
      // Play success sound
      playSuccess()

      // Telemetry
      console.log('haiku_generated', {
        sparkleScore: haiku.sparkleScore,
        tags: haiku.tags,
        style: inputs.style,
        specificity: inputs.specificity,
        contextCount: inputs.context.length
      })

    } catch (err) {
      console.error('Haiku generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate haiku')
      setStatus('error')
      
      // Telemetry
      console.log('haiku_error', { reason: err instanceof Error ? err.message : 'unknown' })
    }
  }, [inputs, preferences.privacyNoName, addToHistory, playSuccess])

  const handleGenerate = (type: 'compliment' | 'haiku') => {
    // Set the generation type
    setInputs(prev => ({ ...prev, generationType: type }))
    
    // Telemetry
    console.log(`${type}_generate_clicked`, {
      style: inputs.style,
      specificity: inputs.specificity,
      contextCount: inputs.context.length
    })
    
    if (type === 'compliment') {
      generateCompliment()
    } else {
      generateHaiku()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate('compliment') // Default to compliment on Enter
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Hero Card */}
        <div className="bubble-card p-6 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="floating-orb w-20 h-20 bg-gradient-to-br from-pink-200 to-purple-200 -translate-x-10 -translate-y-10"></div>
          <div className="floating-orb w-16 h-16 bg-gradient-to-br from-blue-200 to-cyan-200 top-4 right-4"></div>
          <div className="floating-orb w-12 h-12 bg-gradient-to-br from-yellow-200 to-orange-200 bottom-4 left-4"></div>
          
          {/* Floating icons */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-6 right-8 text-2xl animate-sparkle"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-6 left-8 text-2xl animate-sparkle"
          >
            🌟
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-6 gradient-text">
            Poetry and Praise, On Demand
          </h2>

          <div className="space-y-6">
            {/* Name and Relationship */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={inputs.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter name..."
                  className="w-full px-4 py-2 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-base shadow-sm hover:shadow-md"
                  disabled={preferences.privacyNoName}
                />
                {preferences.privacyNoName && (
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                    Privacy mode: names not stored
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Relationship
                </label>
                <select
                  value={inputs.relationship}
                  onChange={(e) => handleInputChange('relationship', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-base shadow-sm hover:shadow-md"
                >
                  {relationships.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel.charAt(0).toUpperCase() + rel.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Context Input */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                Context (add up to 8)
              </label>
              <ContextChips
                context={inputs.context}
                onAdd={handleContextAdd}
                onRemove={handleContextRemove}
                maxCount={8}
              />
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-2">
                Add a few context hints… (e.g., fixed the API auth, wrote clear notes)
              </p>
            </div>

            {/* Style and Specificity */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Style
                </label>
                <StyleSelector
                  value={inputs.style}
                  onChange={(style) => handleInputChange('style', style)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-500" />
                  Specificity
                </label>
                <SpecificitySlider
                  value={inputs.specificity}
                  onChange={(value) => handleInputChange('specificity', value)}
                />
              </div>
            </div>

            {/* Generate Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <motion.button
                onClick={() => handleGenerate('compliment')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bubble-button glow text-white px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Generate Compliment</span>
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => handleGenerate('haiku')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bubble-button glow text-white px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Haiku</span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingCard />
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ErrorCard error={error} onRetry={() => handleGenerate(inputs.generationType || 'compliment')} />
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ResultCard
                compliment={result}
                onGenerateAnother={() => handleGenerate(inputs.generationType || 'compliment')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
