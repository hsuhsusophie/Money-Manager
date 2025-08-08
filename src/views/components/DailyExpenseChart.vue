<template>
  <div class="daily-expense-chart">
    <div class="chart-header">
      <h3>每日支出</h3>
      <div class="chart-info">
        <span class="highest-info">最高: ${{ highestExpense.toLocaleString() }}</span>
        <span class="average-info">平均: ${{ averageExpense.toFixed(2) }}</span>
      </div>
    </div>
    
    <div class="chart-container">
      <div class="chart-bars">
        <div 
          v-for="(expense, day) in filteredDailyExpenses" 
          :key="day"
          class="bar-container"
        >
          <div 
            class="bar" 
            :style="{ height: getBarHeight(expense) + '%' }"
            :title="`${day}日: $${expense.toLocaleString()}`"
          ></div>
          <span class="day-label">{{ day }}日</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  dailyExpenses: Record<string, number> // 格式: { "1": 100, "2": 200, ... }
  selectedMonth: string // YYYY-MM 格式
}>()

// 過濾出有數據的日期，每5天為一個單位
const filteredDailyExpenses = computed(() => {
  const expenses = { ...props.dailyExpenses }
  const result: Record<string, number> = {}
  
  // 只保留有數據的日期
  Object.keys(expenses).forEach(day => {
    if (expenses[day] > 0) {
      result[day] = expenses[day]
    }
  })
  
  return result
})

const highestExpense = computed(() => {
  const values = Object.values(props.dailyExpenses)
  return Math.max(...values, 0)
})

const averageExpense = computed(() => {
  const values = Object.values(props.dailyExpenses)
  if (values.length === 0) return 0
  
  // 計算選中月份的總天數
  const totalDays = getDaysInMonth(props.selectedMonth)
  
  // 總支出除以當月天數
  const totalExpense = values.reduce((sum, value) => sum + value, 0)
  return totalExpense / totalDays
})

const maxExpense = computed(() => {
  const values = Object.values(props.dailyExpenses)
  const max = Math.max(...values, 1) // 避免除以0
  console.log('最大支出:', max, '支出數據:', props.dailyExpenses)
  return max
})

const getBarHeight = (expense: number) => {
  if (maxExpense.value === 0) return 0
  return (expense / maxExpense.value) * 100
}

// 獲取指定月份的天數
const getDaysInMonth = (monthStr: string) => {
  const [year, month] = monthStr.split('-')
  return new Date(parseInt(year), parseInt(month), 0).getDate()
}
</script>

<style scoped>
.daily-expense-chart {
  background: var(--card-background);
  border-radius: var(--mobile-border-radius);
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: var(--card-shadow);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--text-color);
  font-weight: 600;
}

.chart-info {
  display: flex;
  gap: 12px;
}

.highest-info,
.average-info {
  font-size: 14px;
  color: var(--text-light);
  background: var(--background-color);
  padding: 4px 8px;
  border-radius: 12px;
}

.chart-container {
  height: 200px;
  position: relative;
  background: linear-gradient(135deg, #f0f8ff, #e6f3ff);
  border-radius: 8px;
  padding: 16px;
}

.chart-bars {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 100%;
  padding: 0 8px;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin: 0 2px;
}

.bar {
  width: 100%;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  border-radius: 2px 2px 0 0;
  min-height: 4px;
  transition: height 0.3s ease;
}

.bar:hover {
  opacity: 0.8;
}

.day-label {
  font-size: 10px;
  color: var(--text-light);
  margin-top: 4px;
  text-align: center;
}

@media (max-width: 480px) {
  .daily-expense-chart {
    padding: 12px;
  }
  
  .chart-container {
    height: 160px;
  }
  
  .chart-header h3 {
    font-size: 14px;
  }
  
  .highest-info,
  .average-info {
    font-size: 12px;
  }
  
  .day-label {
    font-size: 9px;
  }
}
</style> 