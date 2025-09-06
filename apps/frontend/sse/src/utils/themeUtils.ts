// Theme utility functions

// Get current theme based on class or system preference
export const getCurrentTheme = (): 'light' | 'dark' => {
  // Check if dark class is applied
  if (document.documentElement.classList.contains('dark')) {
    return 'dark'
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  return 'light'
}

// Get CSS variable value
export const getCSSVariable = (variable: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
}

// Set CSS variable value
export const setCSSVariable = (variable: string, value: string): void => {
  document.documentElement.style.setProperty(variable, value)
}

// Theme color definitions
export const themeColors = {
  light: {
    background: '#ffffff',
    text: '#333333',
    border: '#e5e5e5',
    primary: '#002234',
    secondary: '#00ff34',
    accent: '#ff2234'
  },
  dark: {
    background: '#1a1a1a',
    text: '#f0f0f0',
    border: '#444444',
    primary: '#002234',
    secondary: '#00ff34',
    accent: '#ff2234'
  }
}

// Apply theme colors to CSS variables
export const applyThemeColors = (theme: 'light' | 'dark') => {
  // With Tailwind's dark mode enabled, we don't need to set CSS variables directly
  // The .dark class will automatically apply the correct styles
  console.log('Theme applied:', theme)
}