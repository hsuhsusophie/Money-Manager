<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const navItems = [
  { name: 'home', label: '帳本', icon: 'home', path: '/home' },
  { name: 'daily-report', label: '日報', icon: 'chart-simple', path: '/daily-report' },
  { name: 'monthly-report', label: '月報', icon: 'chart-pie', path: '/monthly-report' },
  { name: 'settings', label: '設定', icon: 'cog', path: '/settings' },
]

const navigateTo = (path: string) => {
  router.push(path)
}

const isActive = (path: string) => {
  return route.path === path
}
</script>

<template>
  <nav class="footer-nav">
    <div
      v-for="item in navItems"
      :key="item.name"
      class="nav-item"
      :class="{ active: isActive(item.path) }"
      @click="navigateTo(item.path)"
    >
      <div class="nav-icon">
        <font-awesome-icon :icon="item.icon" />
      </div>
      <div class="nav-label">
        {{ item.label }}
      </div>
    </div>
  </nav>
</template>

<style scoped>
.footer-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height:60;
  background-color: #fff;
  border-top: 1px solid #e8d5b5;
  display: flex;
  justify-content: space-around;
  align-items: center;
  //padding: 12px 0 20px 0;
  box-shadow: 0 -2px 8px rgba(232, 213, 181, 0.3);
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
  flex: 1;
  padding: 8px 4px;
}

.nav-item:hover {
  opacity: 0.7;
}

.nav-item.active {
  color: #d2691e;
}

.nav-icon {
  position: relative;
  font-size: 18px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b8860b;
}

.nav-item.active .nav-icon {
  color: #d2691e;
}

.nav-label {
  font-size: 10px;
  color: #b8860b;
  text-align: center;
}

.nav-item.active .nav-label {
  color: #d2691e;
  font-weight: 500;
}
</style>