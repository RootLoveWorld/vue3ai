<template>
  <div>
    <n-card :title="t('documents.title')">
      <n-empty :description="t('documents.noDocuments')">
        <template #extra>
          <n-button size="small">{{ t('documents.createDocument') }}</n-button>
        </template>
      </n-empty>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NEmpty, NButton } from 'naive-ui'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>