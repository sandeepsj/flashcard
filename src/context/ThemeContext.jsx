import React, { createContext, useContext, useEffect, useState } from 'react'
import { useData } from './DataContext'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const { data, updateSettings } = useData()
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Sync from Drive settings on load
  useEffect(() => {
    if (data.settings?.theme) {
      setTheme(data.settings.theme)
    }
  }, [data.settings?.theme])

  // Apply class to <html>
  useEffect(() => {
    const html = document.documentElement
    if (theme === 'dark') html.classList.add('dark')
    else html.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    updateSettings({ theme: next })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
