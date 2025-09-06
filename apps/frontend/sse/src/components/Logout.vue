<template>
  <div>
    <n-card :title="t('logout.title')">
      <n-result status="info" :title="t('logout.confirm')" :description="t('logout.description')">
        <template #footer>
          <n-space>
            <n-button @click="handleCancel">{{ t('logout.cancel') }}</n-button>
            <n-button type="primary" @click="handleLogout">{{ t('logout.logout') }}</n-button>
          </n-space>
        </template>
      </n-result>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NCard, NResult, NSpace, NButton } from 'naive-ui'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
const router = useRouter()

const handleCancel = () => {
  router.back()
}

const handleLogout = () => {
  // In a real application, you would clear user session here
  console.log(t('logout.success'))
  // Redirect to login page or home page
  router.push('/')
}
</script>