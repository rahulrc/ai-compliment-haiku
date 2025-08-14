import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'

interface SpecificitySliderProps {
  value: number
  onChange: (value: number) => void
}

const specificityLevels = [
  { value: 1, label: 'General', description: 'Broad and universal' },
  { value: 2, label: 'Light', description: 'Slightly contextual' },
  { value: 3, label: 'Balanced', description: 'Mix of general and specific' },
  { value: 4, label: 'Specific', description: 'Heavily contextual' },
  { value: 5, label: 'Precise', description: 'Highly tailored to context' },
]

export default function SpecificitySlider({ value, onChange }: SpecificitySliderProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    const newValue = Math.round(percentage * 4) + 1
    onChange(newValue)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      const slider = document.querySelector('[data-slider-track]') as HTMLElement
      if (slider) {
        const rect = slider.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percentage = Math.max(0, Math.min(1, x / rect.width))
        const newValue = Math.round(percentage * 4) + 1
        onChange(newValue)
      }
    }
    
    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      
      const slider = document.querySelector('[data-slider-track]') as HTMLElement
      if (slider) {
        const rect = slider.getBoundingClientRect()
        const touch = e.touches[0]
        const x = touch.clientX - rect.left
        const percentage = Math.max(0, Math.min(1, x / rect.width))
        const newValue = Math.round(percentage * 4) + 1
        onChange(newValue)
      }
    }
    
    const handleTouchEnd = () => {
      setIsDragging(false)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
    
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

  return (
    <div className="space-y-3">
      {/* Slider */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-surface-500 dark:text-surface-400">1</span>
          <span className="text-xs text-surface-500 dark:text-surface-400">5</span>
        </div>
        
        <div 
          className="relative h-2 bg-surface-200 dark:bg-surface-600 rounded-full cursor-pointer"
          data-slider-track
          onClick={handleSliderClick}
        >
          <motion.div
            className="absolute h-2 bg-primary-500 rounded-full"
            initial={{ width: `${(value / 5) * 100}%` }}
            animate={{ width: `${(value / 5) * 100}%` }}
            transition={{ duration: 0.2 }}
          />
          
          <motion.div
            className="absolute w-6 h-6 bg-primary-500 rounded-full shadow-lg cursor-pointer -top-2 hover:scale-110 transition-transform duration-200"
            style={{ left: `${((value - 1) / 4) * 100}%` }}
            initial={false}
            animate={{ left: `${((value - 1) / 4) * 100}%` }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />
        </div>
      </div>

      {/* Value Display */}
      <div className="text-center">
        <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
          {specificityLevels[value - 1]?.label}
        </span>
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
          {specificityLevels[value - 1]?.description}
        </p>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-10 px-3 py-2 bg-surface-800 dark:bg-surface-200 text-white dark:text-surface-800 text-sm rounded-lg shadow-lg"
            style={{
              left: `${((value - 1) / 4) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-center">
              <div className="font-medium">{value}</div>
              <div className="text-xs opacity-80">
                {specificityLevels[value - 1]?.description}
              </div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-surface-800 dark:border-t-surface-200" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
