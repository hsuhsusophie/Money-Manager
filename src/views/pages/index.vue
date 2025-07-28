<script setup lang="ts">
import DateDisplay from '@/views/components/DateDisplay.vue'
import CalendarSidebar from '@/views/components/CalendarSidebar.vue'
</script>

<template>
  <div class="mobile-page">
    <!-- 狀態欄 -->
    <div class="status-bar">
      <div class="status-left">
        <span class="time">4:51</span>
        <span class="bell">🔔</span>
      </div>
      <div class="status-right">
        <span class="signal">📶</span>
        <span class="network">5G</span>
        <span class="battery">🔋 94%</span>
      </div>
    </div>

    <!-- 主要內容區域 -->
    <div class="main-content">
      <div class="content-card">
        <DateDisplay />
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-page {
  max-width: 100%;
  margin: 0 auto;
  background-color: #f5f5f5;
  min-height: 100vh;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 1px solid #e0e0e0;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.time {
  font-weight: 600;
}

.battery {
  color: #4CAF50;
}

.main-content {
  padding: 16px;
  flex: 1;
}

.content-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 480px) {
  .content-card {
    flex-direction: column;
  }
}

@media (max-width: 375px) {
  .main-content {
    padding: 12px;
  }

  .content-card {
    padding: 16px;
  }
}
</style>