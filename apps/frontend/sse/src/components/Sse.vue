
<template>
  <div class="sse-container">
    <h2>SSE实时数据监控</h2>
    <div class="status">连接状态: {{ status }}</div>
    <div class="data-box">
      <div v-if="data">
        <p>时间: {{ data.timestamp }}</p>
        <p>随机值: {{ data.value.toFixed(2) }}</p>
      </div>
      <div v-else>等待数据...</div>
    </div>
    <button @click="reconnect" v-if="status === 'CLOSED'">重新连接</button>
  </div>
</template>

<script lang="ts" setup>
import { useSSE } from '../utils/sse';

const { data, status, close } = useSSE({
  url: 'http://localhost:3000/sse',
  autoReconnect: true,
  retryInterval: 3000,
  onMessage: (newData) => {
    console.log('收到新数据:', newData);
  },
  onError: (err) => {
    console.error('SSE连接错误:', err);
  }
});

const reconnect = () => {
  close();
  useSSE({
    url: 'http://localhost:3000/sse',
    autoReconnect: false
  });
};
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
