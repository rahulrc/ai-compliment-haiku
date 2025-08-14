export default function Footer() {
  return (
    <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 mt-auto">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="text-center space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">
            💝 Compliments & haikus avoid sensitive topics by design.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-surface-500 dark:text-surface-400">
            <span>v1.0.0</span>
            <span className="hidden sm:inline">•</span>
            <a 
              href="#" 
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
