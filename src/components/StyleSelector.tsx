import { motion } from 'framer-motion'

interface StyleSelectorProps {
  value: 'classic' | 'goofy' | 'poetic' | 'professional'
  onChange: (style: 'classic' | 'goofy' | 'poetic' | 'professional') => void
}

export default function StyleSelector({ value, onChange }: StyleSelectorProps) {
  const styles = [
    {
      value: 'classic' as const,
      label: 'Classic',
      description: 'Warm & sincere',
      icon: '💝'
    },
    {
      value: 'goofy' as const,
      label: 'Goofy',
      description: 'Playful & fun',
      icon: '😄'
    },
    {
      value: 'poetic' as const,
      label: 'Poetic',
      description: 'Elegant & artistic',
      icon: '✨'
    },
    {
      value: 'professional' as const,
      label: 'Professional',
      description: 'Polished & formal',
      icon: '💼'
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {styles.map((style) => (
        <button
          key={style.value}
          onClick={() => onChange(style.value)}
          className={`p-3 sm:p-4 rounded-lg border-2 text-left transition-all duration-200 ${
            value === style.value
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-surface-200 dark:border-surface-600 hover:border-surface-300 dark:hover:border-surface-500'
          }`}
        >
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg sm:text-xl">{style.icon}</span>
            <span className={`font-medium text-sm sm:text-base ${
              value === style.value
                ? 'text-primary-700 dark:text-primary-300'
                : 'text-surface-700 dark:text-surface-300'
            }`}>
              {style.label}
            </span>
          </div>
          <div className={`text-xs sm:text-sm ${
            value === style.value
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-surface-500 dark:text-surface-400'
          }`}>
            {style.description}
          </div>
        </button>
      ))}
    </div>
  )
}
