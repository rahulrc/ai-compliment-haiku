import { motion } from 'framer-motion'

interface StyleSelectorProps {
  value: 'classic' | 'goofy' | 'poetic' | 'professional'
  onChange: (style: 'classic' | 'goofy' | 'poetic' | 'professional') => void
}

const styles = [
  { value: 'classic', label: 'Classic', description: 'Warm and sincere' },
  { value: 'goofy', label: 'Goofy', description: 'Playful and fun' },
  { value: 'poetic', label: 'Poetic', description: 'Elegant and artistic' },
  { value: 'professional', label: 'Professional', description: 'Polished and formal' },
] as const

export default function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {styles.map((style) => (
        <button
          key={style.value}
          onClick={() => onChange(style.value)}
          className={`relative p-3 rounded-lg border-2 transition-all duration-200 text-left ${
            value === style.value
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-surface-200 dark:border-surface-600 hover:border-surface-300 dark:hover:border-surface-500'
          }`}
        >
          {value === style.value && (
            <motion.div
              layoutId="style-selector"
              className="absolute inset-0 border-2 border-primary-500 rounded-lg bg-primary-50 dark:bg-primary-900/20"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          
          <div className="relative z-10">
            <div className={`font-medium text-sm ${
              value === style.value
                ? 'text-primary-700 dark:text-primary-300'
                : 'text-surface-700 dark:text-surface-300'
            }`}>
              {style.label}
            </div>
            <div className={`text-xs ${
              value === style.value
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-surface-500 dark:text-surface-400'
            }`}>
              {style.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
