<script setup lang="ts">
import { useLedgerStore } from '@/stores/ledger'
import { computed } from 'vue'

const store = useLedgerStore()

// 當前日期
const currentDate = computed(() => {
  const date = new Date(store.selectedDate)
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekday: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
  }
})

// 格式化日期顯示
const formattedDate = computed(() => {
  const { year, month, day, weekday } = currentDate.value
  return `${year}年${month}月${day}日 星期${weekday}`
})

// 切換日期
const changeDate = (direction: 'prev' | 'next') => {
  const date = new Date(store.selectedDate)
  if (direction === 'prev') {
    date.setDate(date.getDate() - 1)
  } else {
    date.setDate(date.getDate() + 1)
  }
  store.setSelectedDate(date.toISOString().split('T')[0])
}

// 跳轉到今天
const goToToday = () => {
  const today = new Date().toISOString().split('T')[0]
  store.setSelectedDate(today)
}
</script>

<template>
  <div class="date-selector">
    <div class="date-header">
      <button class="date-btn" @click="changeDate('prev')">‹</button>
      <div class="date-display" @click="goToToday">
        <div class="date-text">{{ formattedDate }}</div>
        <div class="date-hint">點擊回到今天</div>
      </div>
      <button class="date-btn" @click="changeDate('next')">›</button>
    </div>
    
    <div class="date-summary">
      <div class="summary-item">
        <span class="summary-label">支出</span>
        <span class="summary-value expense">${{ store.totalExpense.toFixed(0) }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">收入</span>
        <span class="summary-value income">${{ store.totalIncome.toFixed(0) }}</span>
      </div>

    </div>
  </div>
</template>

<style scoped>
.date-selector {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.date-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.date-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #f0f0f0;
  color: #666;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.date-btn:hover {
  background: #e0e0e0;
  transform: scale(1.05);
}

.date-display {
  flex: 1;
  text-align: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.date-display:hover {
  background-color: #f8f8f8;
}

.date-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.date-hint {
  font-size: 12px;
  color: #999;
}

.date-summary {
  display: flex;
  justify-content: space-around;
  gap: 16px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.summary-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
}

.summary-value.expense {
  color: #ff6b6b;
}

.summary-value.income {
  color: #51cf66;
}

.summary-value.positive {
  color: #51cf66;
}

.summary-value.negative {
  color: #ff6b6b;
}

@media (max-width: 480px) {
  .date-text {
    font-size: 14px;
  }
  
  .summary-value {
    font-size: 14px;
  }
}
</style> 