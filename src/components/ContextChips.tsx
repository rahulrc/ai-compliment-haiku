import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus } from 'lucide-react'

interface ContextChipsProps {
  context: string[]
  onAdd: (context: string) => void
  onRemove: (index: number) => void
  maxCount: number
}

export default function ContextChips({ context, onAdd, onRemove, maxCount }: ContextChipsProps) {
  const [inputValue, setInputValue] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && context.length < maxCount) {
      onAdd(inputValue.trim())
      setInputValue('')
      setIsAdding(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsAdding(false)
      setInputValue('')
    }
  }

  if (context.length === 0 && !isAdding) {
    return (
      <div className="flex items-center justify-center">
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-lg text-surface-500 dark:text-surface-400 hover:border-primary-400 hover:text-primary-600 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add context</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Existing Chips */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {context.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-2 rounded-full"
            >
              <span className="text-sm font-medium">{item}</span>
              <button
                onClick={() => onRemove(index)}
                className="text-primary-500 hover:text-primary-700 dark:hover:text-primary-200 transition-colors duration-200"
                aria-label={`Remove ${item}`}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add New Context */}
      {isAdding && context.length < maxCount && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          onSubmit={handleSubmit}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter context hint..."
            className="flex-1 bubble-input text-sm"
            autoFocus
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-300 dark:disabled:bg-surface-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false)
              setInputValue('')
            }}
            className="px-4 py-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Cancel
          </button>
        </motion.form>
      )}

      {/* Add More Button */}
      {!isAdding && context.length < maxCount && (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add more context</span>
        </button>
      )}

      {/* Count Display */}
      <div className="text-xs text-surface-500 dark:text-surface-400">
        {context.length} of {maxCount} context hints
      </div>
    </div>
  )
}
