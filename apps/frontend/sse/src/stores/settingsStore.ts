import { defineStore } from 'pinia'
import { setLanguage as setAppLanguage } from '../composables/useI18n'
import { setTheme as setAppTheme } from '../composables/useTheme'
import { useRouter } from 'vue-router'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: 'light',
    language: 'zh-CN',
    themes: [
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' },
      { label: 'System', value: 'system' }
    ],
    languages: [
      { label: '中文', value: 'zh-CN' },
      { label: 'English', value: 'en-US' }
    ]
  }),
  actions: {
    setTheme(theme: string) {
      this.theme = theme
      setAppTheme(theme)
    },
    setLanguage(language: string) {
      this.language = language
      setAppLanguage(language)
    },
    navigateToProfile() {
      const router = useRouter()
      router.push('/profile')
    }
  },
  hydrate(store) {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
      store.theme = savedTheme
      // Apply the theme immediately
      setAppTheme(savedTheme)
    }
    
    // Initialize language from localStorage
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && (savedLanguage === 'zh-CN' || savedLanguage === 'en-US')) {
      store.language = savedLanguage
      setAppLanguage(savedLanguage)
    }
  }
})