import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { initTheme, watchSystemTheme } from './composables/useTheme'
import { initLanguage } from './composables/useI18n'
import './style.css'
import './index.css'
import './global.css'
import './assets/demo.css'
import App from './App.vue'

// Initialize theme and language
initTheme()
initLanguage()

// Watch for system theme changes
watchSystemTheme()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')