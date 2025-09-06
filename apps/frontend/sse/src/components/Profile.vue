<template>
  <div>
    <n-card :title="t('profile.title')">
      <n-form :model="formValue" :rules="rules" ref="formRef">
        <n-form-item :label="t('profile.username')" path="username">
          <n-input v-model:value="formValue.username" :placeholder="t('profile.username')" />
        </n-form-item>
        <n-form-item :label="t('profile.email')" path="email">
          <n-input v-model:value="formValue.email" :placeholder="t('profile.email')" />
        </n-form-item>
        <n-form-item :label="t('profile.fullName')" path="fullName">
          <n-input v-model:value="formValue.fullName" :placeholder="t('profile.fullName')" />
        </n-form-item>
        <n-form-item :label="t('profile.bio')" path="bio">
          <n-input v-model:value="formValue.bio" type="textarea" :placeholder="t('profile.bio')" />
        </n-form-item>
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: flex-end">
              <n-button round type="primary" @click="handleSave">
                {{ t('profile.saveChanges') }}
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
  NRow, 
  NCol, 
  NButton 
} from 'naive-ui'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const formRef = ref()

const formValue = ref({
  username: 'john_doe',
  email: 'john@example.com',
  fullName: 'John Doe',
  bio: 'Software developer interested in AI technologies'
})

const rules = {
  username: {
    required: true,
    message: t('profile.username') + t('profile.required'),
    trigger: 'blur'
  },
  email: {
    required: true,
    message: t('profile.email') + t('profile.required'),
    trigger: ['input', 'blur']
  },
  fullName: {
    required: true,
    message: t('profile.fullName') + t('profile.required'),
    trigger: 'blur'
  }
}

function handleSave(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      console.log(t('profile.savedSuccessfully'))
    } else {
      console.log(t('profile.validationFailed'))
    }
  })
}
</script>