import { useEffect, useState } from 'react'
import { SunRegular, MoonRegular } from '@fluentui/react-icons'

import styles from './ThemeToggle.module.css'

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null

    if (storedTheme) {
      // Use stored preference
      setTheme(storedTheme)
      applyTheme(storedTheme)
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const systemTheme = prefersDark ? 'dark' : 'light'
      setTheme(systemTheme)
      applyTheme(systemTheme)
    }
  }, [])

  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <MoonRegular className={styles.themeIcon} />
      ) : (
        <SunRegular className={styles.themeIcon} />
      )}
    </button>
  )
}

export default ThemeToggle
