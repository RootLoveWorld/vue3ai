import { ref, computed } from 'vue'
import { translations } from '../i18n'

// Create a reactive reference for the current language
const currentLanguage = ref('zh-CN')

// Function to set the current language
export const setLanguage = (language: string) => {
  currentLanguage.value = language
  // Save to localStorage
  localStorage.setItem('language', language)
}

// Function to get translated text
export const t = (key: string) => {
  const language = currentLanguage.value
  const translation = translations[language as keyof typeof translations]
  
  if (translation && translation[key as keyof typeof translation]) {
    return translation[key as keyof typeof translation]
  }
  
  // Fallback to English if translation not found
  const englishTranslation = translations['en-US']
  return englishTranslation[key as keyof typeof englishTranslation] || key
}

// Computed property for current language
export const currentLang = computed(() => currentLanguage.value)

// Initialize language from localStorage or default to Chinese
export const initLanguage = () => {
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage && (savedLanguage === 'zh-CN' || savedLanguage === 'en-US')) {
    currentLanguage.value = savedLanguage
  }
}

// Export the composable
export const useI18n = () => {
  return {
    t,
    currentLang,
    setLanguage
  }
}