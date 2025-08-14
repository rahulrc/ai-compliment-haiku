export default function Footer() {
  return (
    <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Safety Notice */}
          <div className="text-center md:text-left">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              💝 Compliments & haikus avoid sensitive topics by design.
            </p>
          </div>

          {/* Version & Links */}
          <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400">
            <span>v1.0.0</span>
            <a
              href="#"
              className="hover:text-surface-700 dark:hover:text-surface-300 transition-colors duration-200"
            >
              Privacy Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
