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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && context.length < maxCount) {
      onAdd(inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <div className="space-y-4">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add context hint..."
          className="flex-1 px-4 py-3 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-base"
          disabled={context.length >= maxCount}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || context.length >= maxCount}
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-300 dark:disabled:bg-surface-600 text-white font-medium rounded-lg shadow-soft transition-all duration-200 hover:shadow-soft-lg active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          Add
        </button>
      </form>

      {/* Chips Display */}
      {context.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {context.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 px-3 py-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm"
            >
              <span className="max-w-[120px] truncate">{item}</span>
              <button
                onClick={() => onRemove(index)}
                className="text-primary-500 hover:text-primary-700 dark:hover:text-primary-200 transition-colors duration-200 flex-shrink-0"
                aria-label={`Remove ${item}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Counter */}
      <p className="text-xs text-surface-500 dark:text-surface-400">
        {context.length}/{maxCount} context hints
      </p>
    </div>
  )
}
