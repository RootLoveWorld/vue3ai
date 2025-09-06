import { ref, computed } from 'vue'
import { getCurrentTheme, applyThemeColors } from '../utils/themeUtils'

// Create a reactive reference for the current theme
const currentTheme = ref('light')

// Function to set the current theme
export const setTheme = (theme: string) => {
  currentTheme.value = theme
  // Save to localStorage
  localStorage.setItem('theme', theme)
  
  // Apply theme by adding/removing dark class
  if (theme === 'dark' || (theme === 'system' && getCurrentTheme() === 'dark')) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  // Apply theme colors
  if (theme === 'dark' || (theme === 'system' && getCurrentTheme() === 'dark')) {
    applyThemeColors('dark')
  } else {
    applyThemeColors('light')
  }
}

// Function to toggle between light and dark theme
export const toggleTheme = () => {
  setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
}

// Computed property for current theme
export const theme = computed(() => currentTheme.value)

// Initialize theme from localStorage or default to light
export const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
    currentTheme.value = savedTheme
  }
  
  // Apply theme
  if (currentTheme.value === 'dark' || (currentTheme.value === 'system' && getCurrentTheme() === 'dark')) {
    document.documentElement.classList.add('dark')
    applyThemeColors('dark')
  } else {
    document.documentElement.classList.remove('dark')
    applyThemeColors('light')
  }
}

// Watch for system theme changes
export const watchSystemTheme = () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    // Only apply system theme changes if the current theme is set to 'system'
    if (currentTheme.value === 'system') {
      if (e.matches) {
        document.documentElement.classList.add('dark')
        applyThemeColors('dark')
      } else {
        document.documentElement.classList.remove('dark')
        applyThemeColors('light')
      }
    }
  }
  
  mediaQuery.addEventListener('change', handleSystemThemeChange)
  
  // Initial check
  if (currentTheme.value === 'system') {
    if (mediaQuery.matches) {
      document.documentElement.classList.add('dark')
      applyThemeColors('dark')
    } else {
      document.documentElement.classList.remove('dark')
      applyThemeColors('light')
    }
  }
  
  return () => {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }
}

// Export the composable
export const useTheme = () => {
  return {
    theme,
    setTheme,
    toggleTheme,
    watchSystemTheme
  }
}