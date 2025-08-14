import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Volume2, VolumeX, Shield, Palette, Sliders } from 'lucide-react'
import { usePreferences } from '../contexts/PreferencesContext'

export default function Settings() {
  const { preferences, updatePreferences, toggleSound, toggleMotion } = usePreferences()

  const styles = [
    { value: 'classic', label: 'Classic', description: 'Warm and sincere' },
    { value: 'goofy', label: 'Goofy', description: 'Playful and fun' },
    { value: 'poetic', label: 'Poetic', description: 'Elegant and artistic' },
    { value: 'professional', label: 'Professional', description: 'Polished and formal' },
  ] as const



  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 sm:space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-surface-100 mb-2">
            Settings
          </h1>
          <p className="text-surface-600 dark:text-surface-400 text-sm sm:text-base">
            Customize your compliment and haiku experience
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Defaults Section */}
          <div className="bubble-card p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <Palette className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100">
                Defaults
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Default Style
                </label>
                <select
                  value={preferences.defaultStyle}
                  onChange={(e) => updatePreferences({ defaultStyle: e.target.value as any })}
                  className="bubble-input w-full"
                >
                  {styles.map((style) => (
                    <option key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Default Specificity
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={preferences.defaultSpecificity}
                  onChange={(e) => updatePreferences({ defaultSpecificity: parseInt(e.target.value) })}
                  className="w-full h-2 bg-surface-200 dark:bg-surface-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-surface-500 dark:text-surface-400 mt-1">
                  <span>General</span>
                  <span>Specific</span>
                </div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                  Current: {preferences.defaultSpecificity}/5
                </p>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bubble-card p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <Sliders className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100">
                Preferences
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-surface-700 dark:text-surface-300">
                    Sound Effects
                  </h3>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    Play sounds for interactions
                  </p>
                </div>
                <button
                  onClick={toggleSound}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    preferences.soundOn ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      preferences.soundOn ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-surface-700 dark:text-surface-300">
                    Motion Effects
                  </h3>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    Show animations and transitions
                  </p>
                </div>
                <button
                  onClick={toggleMotion}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    preferences.motionOn ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      preferences.motionOn ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="bubble-card p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100">
                Privacy
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-surface-700 dark:text-surface-300">
                    Don't Store Names
                  </h3>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    Names won't be saved in history
                  </p>
                </div>
                <button
                  onClick={togglePrivacy}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    preferences.privacyNoName ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      preferences.privacyNoName ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bubble-card p-4 sm:p-6">
            <div className="text-center">
              <div className="text-4xl mb-3">💝</div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                About This App
              </h3>
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
                Made with ❤️ for spreading kindness, positivity & poetry
              </p>
              <div className="text-xs text-surface-500 dark:text-surface-400 space-y-1">
                <p>Version 1.0.0</p>
                <p>Built with React & AI</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
