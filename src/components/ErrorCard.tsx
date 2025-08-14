import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorCardProps {
  error: string
  onRetry: () => void
}

export default function ErrorCard({ error, onRetry }: ErrorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bubble-card p-8 border-red-200 dark:border-red-700"
    >
      <div className="text-center space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-300">
            That one stumbled
          </h3>
          <p className="text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 mx-auto"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Let's try again</span>
        </button>

        <p className="text-sm text-surface-500 dark:text-surface-400">
          Don't worry, your inputs are still there!
        </p>
      </div>
    </motion.div>
  )
}
