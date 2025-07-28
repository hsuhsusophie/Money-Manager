<script setup lang="ts">
import { RouterView } from 'vue-router'
import FooterNav from '@/components/FooterNav.vue'
</script>

<template>
  <div id="app">
    <RouterView />
    <FooterNav />
  </div>
</template>

<style>
/* 重置默認樣式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow-x: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f5f5f5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
  overflow-x: hidden;
}

/* 手機自適應設置 */
@media (max-width: 768px) {
  #app {
    padding: 0;
  }
}

/* 防止橫向滾動 */
@media (max-width: 480px) {
  body {
    overflow-x: hidden;
  }
}
</style>
