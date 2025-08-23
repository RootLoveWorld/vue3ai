<script setup lang="ts">
import Sse from './components/Sse.vue'
</script>

<template>
  <!--https://tailwindcss.com/-->
  <div class="miracle-btn miracle-btn-red">I am Miracle</div>
  <Sse/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
