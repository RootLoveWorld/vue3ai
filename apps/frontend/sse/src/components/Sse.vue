
<template>
  <div>
    <n-card :title="t('sse.title')">
      <n-input v-model:value="message" type="textarea" :placeholder="t('sse.enterMessage')" />
      <n-button @click="sendMessage" style="margin-top: 10px">{{ t('sse.send') }}</n-button>
      <div style="margin-top: 20px">
        <n-card v-for="msg in messages" :key="msg.id" :title="msg.sender">
          {{ msg.content }}
        </n-card>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NInput, NButton } from 'naive-ui'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const message = ref('')
const messages = ref([
  { id: 1, sender: 'User', content: 'Hello!' },
  { id: 2, sender: 'AI', content: 'Hi there! How can I help you today?' }
])

const sendMessage = () => {
  if (message.value.trim()) {
    messages.value.push({
      id: messages.value.length + 1,
      sender: 'User',
      content: message.value
    })
    message.value = ''
  }
}
</script>

<style scoped>
.sse-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
}
.status {
  color: #666;
  margin-bottom: 1rem;
}
.data-box {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
}
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
