<template>
  <div class="month-selector">
    <div class="month-display">
      <button class="nav-btn" @click="previousMonth">
        <span>‹</span>
      </button>
      <div class="month-text">{{ currentMonthText }}</div>
      <button class="nav-btn" @click="nextMonth" :disabled="isCurrentMonth">
        <span>›</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: string // YYYY-MM 格式
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const currentMonth = ref(props.modelValue)

const currentMonthText = computed(() => {
  const [year, month] = currentMonth.value.split('-')
  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ]
  return `${year}年${monthNames[parseInt(month) - 1]}`
})

// 檢查是否為當前月份
const isCurrentMonth = computed(() => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonthNum = now.getMonth() + 1
  const [year, month] = currentMonth.value.split('-')
  
  return parseInt(year) === currentYear && parseInt(month) === currentMonthNum
})

const previousMonth = () => {
  const [year, month] = currentMonth.value.split('-')
  let newYear = parseInt(year)
  let newMonth = parseInt(month) - 1
  
  if (newMonth === 0) {
    newMonth = 12
    newYear -= 1
  }
  
  const newMonthStr = String(newMonth).padStart(2, '0')
  const newValue = `${newYear}-${newMonthStr}`
  currentMonth.value = newValue
  emit('update:modelValue', newValue)
}

const nextMonth = () => {
  // 如果是當前月份，不允許前進到下個月
  if (isCurrentMonth.value) {
    return
  }
  
  const [year, month] = currentMonth.value.split('-')
  let newYear = parseInt(year)
  let newMonth = parseInt(month) + 1
  
  if (newMonth === 13) {
    newMonth = 1
    newYear += 1
  }
  
  const newMonthStr = String(newMonth).padStart(2, '0')
  const newValue = `${newYear}-${newMonthStr}`
  currentMonth.value = newValue
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
.month-selector {
  background: var(--primary-color);
  border-radius: var(--mobile-border-radius);
  padding: 12px 16px;
  margin-bottom: 16px;
}

.month-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.month-text {
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  text-align: center;
}

@media (max-width: 480px) {
  .month-selector {
    padding: 10px 12px;
    margin-bottom: 12px;
  }
  
  .month-text {
    font-size: 14px;
  }
  
  .nav-btn {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }
}
</style> 