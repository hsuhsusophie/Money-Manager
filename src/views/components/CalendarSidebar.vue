<script setup lang="ts">
import { ref, computed } from 'vue'

// 當前日期
const currentDate = ref(new Date())

// 生成日曆數據
const calendarData = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const currentDay = new Date(startDate)
  
  for (let i = 0; i < 42; i++) {
    days.push({
      date: new Date(currentDay),
      isCurrentMonth: currentDay.getMonth() === month,
      isToday: currentDay.toDateString() === new Date().toDateString(),
      isSelected: false
    })
    currentDay.setDate(currentDay.getDate() + 1)
  }
  
  return days
})

// 月份名稱
const monthName = computed(() => {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', 
                 '七月', '八月', '九月', '十月', '十一月', '十二月']
  return months[currentDate.value.getMonth()]
})

// 年份
const year = computed(() => currentDate.value.getFullYear())

// 選擇日期
const selectDate = (date: Date) => {
  console.log('選擇日期:', date)
}
</script>

<template>
  <div class="calendar-sidebar">
    <div class="calendar-header">
      <h3>{{ monthName }} {{ year }}</h3>
    </div>
    
    <div class="calendar-grid">
      <!-- 星期標題 -->
      <div class="weekday-header">
        <div class="weekday" v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day">
          {{ day }}
        </div>
      </div>
      
      <!-- 日期網格 -->
      <div class="days-grid">
        <div
          v-for="day in calendarData"
          :key="day.date.toISOString()"
          class="day-cell"
          :class="{
            'other-month': !day.isCurrentMonth,
            'today': day.isToday,
            'selected': day.isSelected
          }"
          @click="selectDate(day.date)"
        >
          {{ day.date.getDate() }}
        </div>
      </div>
    </div>
    
    <div class="calendar-footer">
      <div class="quick-actions">
        <button class="action-btn">今日</button>
        <button class="action-btn">本月</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-sidebar {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  margin-bottom: 16px;
  text-align: center;
}

.calendar-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.calendar-grid {
  margin-bottom: 16px;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 12px;
  color: #666;
  font-weight: 500;
  padding: 4px;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  position: relative;
}

.day-cell:hover {
  background-color: #f0f0f0;
}

.day-cell.other-month {
  color: #ccc;
}

.day-cell.today {
  background-color: #007aff;
  color: white;
  font-weight: 600;
}

.day-cell.selected {
  background-color: #e3f2fd;
  color: #007aff;
  font-weight: 600;
}

.calendar-footer {
  border-top: 1px solid #eee;
  padding-top: 12px;
}

.quick-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  padding: 6px 12px;
  background-color: #f0f0f0;
  color: #666;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #e0e0e0;
}

@media (max-width: 480px) {
  .calendar-sidebar {
    padding: 12px;
  }
  
  .day-cell {
    font-size: 12px;
  }
  
  .weekday {
    font-size: 10px;
  }
}
</style> 