<template>
  <div class="p-6">
    <n-card :title="t('demo.title')">
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">{{ t('demo.themeDemo') }}</h3>
        <div class="flex items-center gap-4">
          <n-button @click="toggleTheme">
            {{ t('demo.toggleTheme') }}
          </n-button>
          <span>{{ t('demo.currentTheme') }}: {{ theme }}</span>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">{{ t('demo.languageDemo') }}</h3>
        <div class="flex items-center gap-4">
          <n-button @click="switchToChinese">
            {{ t('language.chinese') }}
          </n-button>
          <n-button @click="switchToEnglish">
            {{ t('language.english') }}
          </n-button>
          <span>{{ t('demo.currentLanguage') }}: {{ currentLang }}</span>
        </div>
      </div>
      
      <div>
        <h3 class="text-lg font-semibold mb-3">{{ t('demo.colorDemo') }}</h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="p-4 rounded bg-primary text-white">
            {{ t('demo.primaryColor') }}
          </div>
          <div class="p-4 rounded bg-secondary text-white">
            {{ t('demo.secondaryColor') }}
          </div>
          <div class="p-4 rounded bg-accent text-white">
            {{ t('demo.accentColor') }}
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { useI18n } from '../composables/useI18n'
import { NCard, NButton } from 'naive-ui'

const { theme, toggleTheme } = useTheme()
const { t, currentLang, setLanguage } = useI18n()

const switchToChinese = () => {
  setLanguage('zh-CN')
}

const switchToEnglish = () => {
  setLanguage('en-US')
}
</script>

<style scoped>
.bg-primary {
  background-color: var(--color-primary);
}

.bg-secondary {
  background-color: var(--color-secondary);
}

.bg-accent {
  background-color: var(--color-accent);
}
</style>