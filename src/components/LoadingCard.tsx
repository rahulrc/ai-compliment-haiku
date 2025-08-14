import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function LoadingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bubble-card p-8"
    >
      <div className="text-center space-y-6">
        {/* Loading Icon */}
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-12 h-12 text-primary-400" />
          </motion.div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <motion.div
            className="h-6 bg-surface-200 dark:bg-surface-600 rounded-lg mx-auto"
            style={{ width: '200px' }}
            animate={{
              background: [
                'linear-gradient(90deg, var(--tw-bg-surface-200) 25%, var(--tw-bg-surface-300) 50%, var(--tw-bg-surface-200) 75%)',
                'linear-gradient(90deg, var(--tw-bg-surface-200) 0%, var(--tw-bg-surface-300) 25%, var(--tw-bg-surface-200) 50%)',
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="h-4 bg-surface-200 dark:bg-surface-600 rounded-lg mx-auto"
            style={{ width: '150px' }}
            animate={{
              background: [
                'linear-gradient(90deg, var(--tw-bg-surface-200) 25%, var(--tw-bg-surface-300) 50%, var(--tw-bg-surface-200) 75%)',
                'linear-gradient(90deg, var(--tw-bg-surface-200) 0%, var(--tw-bg-surface-300) 25%, var(--tw-bg-surface-200) 50%)',
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </div>

        {/* Typing Dots */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary-400 rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <p className="text-surface-500 dark:text-surface-400 text-sm">
          Crafting your perfect compliment...
        </p>
      </div>
    </motion.div>
  )
}
