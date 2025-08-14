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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <SettingsIcon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-2">
            Settings
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            Customize your compliment and haiku experience
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Defaults Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bubble-card p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Sliders className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-semibold">Default Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Default Style */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                  Default Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {styles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => updatePreferences({ defaultStyle: style.value })}
                      className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                        preferences.defaultStyle === style.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-surface-200 dark:border-surface-600 hover:border-surface-300 dark:hover:border-surface-500'
                      }`}
                    >
                      <div className={`font-medium text-sm ${
                        preferences.defaultStyle === style.value
                          ? 'text-primary-700 dark:text-primary-300'
                          : 'text-surface-700 dark:text-surface-300'
                      }`}>
                        {style.label}
                      </div>
                      <div className={`text-xs ${
                        preferences.defaultStyle === style.value
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-surface-500 dark:text-surface-400'
                      }`}>
                        {style.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Specificity */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                  Default Specificity
                </label>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => updatePreferences({ defaultSpecificity: value })}
                      className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                        preferences.defaultSpecificity === value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'border-surface-200 dark:border-surface-600 hover:border-surface-300 dark:hover:border-surface-500 text-surface-700 dark:text-surface-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Level {value}</span>
                        <span className="text-sm opacity-70">
                          {value === 1 && 'General'}
                          {value === 2 && 'Light'}
                          {value === 3 && 'Balanced'}
                          {value === 4 && 'Specific'}
                          {value === 5 && 'Precise'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Audio & Motion Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bubble-card p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Volume2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-semibold">Audio & Motion</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sound Toggle */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                  Sound Effects
                </label>
                <button
                  onClick={toggleSound}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-3 ${
                    preferences.soundOn
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'border-surface-300 dark:border-surface-600 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                  }`}
                >
                  {preferences.soundOn ? (
                    <Volume2 className="w-6 h-6" />
                  ) : (
                    <VolumeX className="w-6 h-6" />
                  )}
                  <span className="font-medium">
                    {preferences.soundOn ? 'Sound On' : 'Sound Off'}
                  </span>
                </button>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-2">
                  Play sounds for interactions like copying and favoriting
                </p>
              </div>

              {/* Motion Toggle */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                  Motion Effects
                </label>
                <button
                  onClick={toggleMotion}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-3 ${
                    !preferences.reducedMotion
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-surface-300 dark:border-surface-600 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                  </div>
                  <span className="font-medium">
                    {!preferences.reducedMotion ? 'Motion On' : 'Motion Off'}
                  </span>
                </button>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-2">
                  {preferences.reducedMotion 
                    ? 'Respects system preference for reduced motion'
                    : 'Shows animations and transitions'
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Privacy Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bubble-card p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-semibold">Privacy</h2>
            </div>

            <div className="space-y-4">
              {/* Name Privacy */}
              <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <div>
                  <h3 className="font-medium text-surface-900 dark:text-surface-100">
                    Don't store names in history
                  </h3>
                  <p className="text-sm text-surface-600 dark:text-surface-400">
                    When enabled, names won't be sent to the server or saved locally
                  </p>
                </div>
                <button
                  onClick={() => updatePreferences({ privacyNoName: !preferences.privacyNoName })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    preferences.privacyNoName
                      ? 'bg-primary-500'
                      : 'bg-surface-300 dark:bg-surface-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      preferences.privacyNoName ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Privacy Notice */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Your privacy matters</p>
                    <p>
                      We never share your data with third parties. All compliments are generated 
                      using your developer token and stored locally on your device.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bubble-card p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-semibold">About</h2>
            </div>

            <div className="space-y-4 text-sm text-surface-600 dark:text-surface-400">
              <div className="flex justify-between">
                <span>Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Model</span>
                <span className="font-medium">GPT-5</span>
              </div>
              <div className="flex justify-between">
                <span>API Endpoint</span>
                <span className="font-medium">/api/compliment</span>
              </div>
              <div className="flex justify-between">
                <span>Rate Limit</span>
                <span className="font-medium">20/min per IP</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-600">
              <p className="text-xs text-surface-500 dark:text-surface-400 text-center">
                Made with ❤️ for spreading kindness, positivity & poetry
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
