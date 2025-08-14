import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePreferences } from '../contexts/PreferencesContext'
import { useCompliments } from '../contexts/ComplimentsContext'
import { Compliment } from '../contexts/ComplimentsContext'
import toast from 'react-hot-toast'
import { Sparkles, RefreshCw } from 'lucide-react'
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
  }, [inputs, preferences.privacyNoName, addToHistory])

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
  }, [inputs, preferences.privacyNoName, addToHistory])

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
        <div className="bubble-card p-6">
          <h2 className="text-2xl font-display font-semibold text-center mb-4">
            Poetry and Praise, On Demand
          </h2>
          <p className="text-center text-surface-600 dark:text-surface-400 mb-6 text-sm">
            Generate a compliment or haiku based on your inputs
          </p>

          <div className="space-y-6">
            {/* Name and Relationship */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={inputs.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter name..."
                  className="w-full px-4 py-3 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-base"
                  disabled={preferences.privacyNoName}
                />
                {preferences.privacyNoName && (
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                    Privacy mode: names not stored
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Relationship
                </label>
                <select
                  value={inputs.relationship}
                  onChange={(e) => handleInputChange('relationship', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-base"
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
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
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
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                  Style
                </label>
                <StyleSelector
                  value={inputs.style}
                  onChange={(style) => handleInputChange('style', style)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                  Specificity
                </label>
                <SpecificitySlider
                  value={inputs.specificity}
                  onChange={(specificity) => handleInputChange('specificity', specificity)}
                />
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-2">
                  How much of your context to weave in. Higher = more specific.
                </p>
              </div>
            </div>

            {/* Generate Buttons */}
            <div className="text-center space-y-4">
              <div className="space-y-3">
                <button
                  onClick={() => handleGenerate('compliment')}
                  disabled={status === 'loading' || inputs.context.length === 0}
                  onKeyPress={handleKeyPress}
                  className="w-full px-6 py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-300 dark:disabled:bg-surface-600 text-white font-medium rounded-lg shadow-soft transition-all duration-200 hover:shadow-soft-lg active:scale-95 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' && inputs.generationType === 'compliment' ? (
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Compliment</span>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => handleGenerate('haiku')}
                  disabled={status === 'loading' || inputs.context.length === 0}
                  className="w-full px-6 py-4 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 dark:disabled:bg-purple-600 text-white font-medium rounded-lg shadow-soft transition-all duration-200 hover:shadow-soft-lg active:scale-95 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' && inputs.generationType === 'haiku' ? (
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl">🌸</span>
                      <span>Generate Haiku</span>
                    </div>
                  )}
                </button>
              </div>
              
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Choose whether to generate a compliment or a haiku based on your inputs
              </p>
            </div>
          </div>
        </div>

        {/* Result Area */}
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
              <ErrorCard
                error={error}
                onRetry={generateCompliment}
              />
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ResultCard
                compliment={result}
                onGenerateAnother={() => {
                  setResult(null)
                  setStatus('idle')
                }}
              />
            </motion.div>
          )}

          {status === 'idle' && !result && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-surface-400 dark:text-surface-500">
                <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Ready when you are—tap Generate.</p>
                <p className="text-sm mt-2">Try adding context like "helped with Q3 deck" or "loves trail runs"</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
