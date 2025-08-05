<script setup lang="ts">
import { useLedgerStore } from '@/stores/ledger'
import { computed, ref } from 'vue'

const store = useLedgerStore()
const showDatePicker = ref(false)

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

// 打開日期選擇器
const openDatePicker = () => {
  showDatePicker.value = true
}

// 關閉日期選擇器
const closeDatePicker = () => {
  showDatePicker.value = false
}

// 選擇日期
const selectDate = (year: number, month: number, day: number) => {
  const selectedDate = new Date(year, month - 1, day)
  store.setSelectedDate(selectedDate.toISOString().split('T')[0])
  closeDatePicker()
}

// 生成日曆數據
const calendarData = computed(() => {
  const date = new Date(store.selectedDate)
  const year = date.getFullYear()
  const month = date.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const currentDate = new Date(startDate)
  
  for (let i = 0; i < 42; i++) {
    days.push({
      date: new Date(currentDate),
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: currentDate.toDateString() === new Date().toDateString(),
      isSelected: currentDate.toDateString() === date.toDateString()
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return days
})

// 月份名稱
const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                   '七月', '八月', '九月', '十月', '十一月', '十二月']

// 切換月份
const changeMonth = (direction: 'prev' | 'next') => {
  const date = new Date(store.selectedDate)
  if (direction === 'prev') {
    date.setMonth(date.getMonth() - 1)
  } else {
    date.setMonth(date.getMonth() + 1)
  }
  store.setSelectedDate(date.toISOString().split('T')[0])
}
</script>

<template>
  <div class="date-selector">
    <div class="date-header">
      <button class="date-btn" @click="changeDate('prev')">‹</button>
      <div class="date-display" @click="openDatePicker">
        <div class="date-text">{{ formattedDate }}</div>
        <div class="date-hint">點擊選擇日期</div>
      </div>
      <button class="date-btn" @click="changeDate('next')">›</button>
    </div>
    
    <div class="date-summary">
      <div class="summary-item">
        <span class="summary-label">支出</span>
        <span class="summary-value expense">${{ store.monthlyExpense.toFixed(0) }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">收入</span>
        <span class="summary-value income">${{ store.monthlyIncome.toFixed(0) }}</span>
      </div>
    </div>

    <!-- 日期選擇器彈窗 -->
    <div v-if="showDatePicker" class="date-picker-overlay" @click="closeDatePicker">
      <div class="date-picker-modal" @click.stop>
        <div class="date-picker-header">
          <button class="month-btn" @click="changeMonth('prev')">‹</button>
          <div class="month-display">
            {{ currentDate.year }}年 {{ monthNames[currentDate.month - 1] }}
          </div>
          <button class="month-btn" @click="changeMonth('next')">›</button>
        </div>
        
        <div class="calendar">
          <div class="weekdays">
            <div class="weekday" v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day">
              {{ day }}
            </div>
          </div>
          
          <div class="days">
            <div 
              v-for="day in calendarData" 
              :key="day.date.toISOString()"
              class="day"
              :class="{
                'other-month': !day.isCurrentMonth,
                'today': day.isToday,
                'selected': day.isSelected
              }"
              @click="selectDate(day.date.getFullYear(), day.date.getMonth() + 1, day.date.getDate())"
            >
              {{ day.date.getDate() }}
            </div>
          </div>
        </div>
        
        <div class="date-picker-footer">
          <button class="today-btn" @click="goToToday">今天</button>
          <button class="close-btn" @click="closeDatePicker">關閉</button>
        </div>
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

/* 日期選擇器彈窗樣式 */
.date-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.date-picker-modal {
  background: white;
  border-radius: 16px;
  padding: 20px;
  width: 90%;
  max-width: 350px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.date-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.month-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #f0f0f0;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.month-btn:hover {
  background: #e0e0e0;
  transform: scale(1.05);
}

.month-display {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.calendar {
  margin-bottom: 20px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 8px 4px;
  font-weight: 500;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.day:hover {
  background: #f0f0f0;
}

.day.other-month {
  color: #ccc;
}

.day.today {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 600;
}

.day.selected {
  background: #1976d2;
  color: white;
  font-weight: 600;
}

.day.selected:hover {
  background: #1565c0;
}

.date-picker-footer {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.today-btn, .close-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.today-btn {
  background: #51cf66;
  color: white;
}

.today-btn:hover {
  background: #40c057;
}

.close-btn {
  background: #f0f0f0;
  color: #666;
}

.close-btn:hover {
  background: #e0e0e0;
}

@media (max-width: 480px) {
  .date-picker-modal {
    width: 95%;
    padding: 16px;
  }
  
  .day {
    font-size: 12px;
  }
  
  .month-display {
    font-size: 14px;
  }
}
</style> 