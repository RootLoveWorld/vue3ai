<template>
  <div>
    <n-card :title="t('settings.title')">
      <n-form :model="formValue" :rules="rules" ref="formRef">
        <n-form-item :label="t('settings.username')" path="user.name">
          <n-input v-model:value="formValue.user.name" :placeholder="t('settings.username')" />
        </n-form-item>
        <n-form-item :label="t('settings.email')" path="user.email">
          <n-input v-model:value="formValue.user.email" :placeholder="t('settings.email')" />
        </n-form-item>
        <n-form-item :label="t('settings.theme')" path="theme">
          <n-select v-model:value="formValue.theme" :options="themeOptions" />
        </n-form-item>
        <n-form-item :label="t('settings.notifications')" path="notifications">
          <n-switch v-model:value="formValue.notifications" />
        </n-form-item>
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: flex-end">
              <n-button round type="primary" @click="handleValidateClick">
                {{ t('settings.saveSettings') }}
              </n-button>
            </div>
          </n-col>
        </n-row>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  NCard, 
  NForm, 
  NFormItem, 
  NInput, 
  NSelect, 
  NSwitch, 
  NRow, 
  NCol, 
  NButton 
} from 'naive-ui'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const formRef = ref()

const formValue = ref({
  user: {
    name: '',
    email: ''
  },
  theme: 'light',
  notifications: false
})

const rules = {
  user: {
    name: {
      required: true,
      message: t('settings.username') + t('settings.required'),
      trigger: 'blur'
    },
    email: {
      required: true,
      message: t('settings.email') + t('settings.required'),
      trigger: ['input', 'blur']
    }
  }
}

const themeOptions = [
  {
    label: t('theme.light'),
    value: 'light'
  },
  {
    label: t('theme.dark'),
    value: 'dark'
  },
  {
    label: t('theme.system'),
    value: 'system'
  }
]

function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      console.log(t('settings.savedSuccessfully'))
    } else {
      console.log(t('settings.validationFailed'))
    }
  })
}
</script>