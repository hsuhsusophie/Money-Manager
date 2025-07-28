<script setup lang="ts">
import { ref, computed } from 'vue'

// 當前日期
const currentDate = ref(new Date())

// 格式化日期顯示
const formattedDate = computed(() => {
  const date = currentDate.value
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
  
  return `${year}年${month}月${day}日 星期${weekday}`
})

// 格式化時間顯示
const formattedTime = computed(() => {
  const date = currentDate.value
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  
  return `${hours}:${minutes}`
})
</script>

<template>
  <div class="date-display">
    <div class="date-info">
      <div class="current-time">{{ formattedTime }}</div>
      <div class="current-date">{{ formattedDate }}</div>
    </div>
    <div class="date-summary">
      <div class="summary-item">
        <span class="summary-label">今日支出</span>
        <span class="summary-value">$0</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">本月支出</span>
        <span class="summary-value">$0</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.date-display {
  flex: 1;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.date-info {
  margin-bottom: 16px;
}

.current-time {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
}

.current-date {
  font-size: 14px;
  opacity: 0.9;
}

.date-summary {
  display: flex;
  gap: 16px;
}

.summary-item {
  flex: 1;
  text-align: center;
}

.summary-label {
  display: block;
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
}

.summary-value {
  display: block;
  font-size: 16px;
  font-weight: 600;
}

@media (max-width: 480px) {
  .current-time {
    font-size: 28px;
  }
  
  .date-summary {
    gap: 12px;
  }
}
</style> 