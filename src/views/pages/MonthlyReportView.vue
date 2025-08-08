<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLedgerStore } from '@/stores/ledger'
import MonthSelector from '@/views/components/MonthSelector.vue'
import MonthlySummary from '@/views/components/MonthlySummary.vue'
import DailyExpenseChart from '@/views/components/DailyExpenseChart.vue'
import CategoryPieChart from '@/views/components/CategoryPieChart.vue'

const store = useLedgerStore()

// 當前選中的月份 (YYYY-MM 格式)
const selectedMonth = ref(new Date().toISOString().slice(0, 7))

// 獲取指定月份的數據
const monthlyTransactions = computed(() => {
  return store.transactions.filter(t => t.date.startsWith(selectedMonth.value))
})

// 總收入
const totalIncome = computed(() => {
  return monthlyTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
})

// 總支出
const totalExpense = computed(() => {
  return monthlyTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

// 結餘
const balance = computed(() => {
  return totalIncome.value - totalExpense.value
})

// 每日支出數據
const dailyExpenses = computed(() => {
  const expenses: Record<string, number> = {}
  
  monthlyTransactions.value
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const day = t.date.split('-')[2]
      expenses[day] = (expenses[day] || 0) + t.amount
    })
  
  return expenses
})

// 分類統計
const categoryStats = computed(() => {
  const stats: Record<string, { amount: number, name: string, color: string }> = {}
  
  monthlyTransactions.value
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const category = store.categories.find(c => c.id === t.category)
      if (!stats[t.category]) {
        stats[t.category] = {
          amount: 0,
          name: category?.name || t.category,
          color: category?.color || '#ccc'
        }
      }
      stats[t.category].amount += t.amount
    })
  
  const total = totalExpense.value
  
  return Object.keys(stats).map(category => ({
    category,
    name: stats[category].name,
    amount: stats[category].amount,
    color: stats[category].color,
    percentage: total > 0 ? Math.round((stats[category].amount / total) * 100) : 0
  })).sort((a, b) => b.amount - a.amount)
})
</script>

<template>
  <div class="monthly-report-page">
    <!-- 1. 月份選擇器 -->
    <MonthSelector v-model="selectedMonth" />
    
    <!-- 2. 月度財務總結 -->
    <MonthlySummary 
      :total-income="totalIncome"
      :total-expense="totalExpense"
      :balance="balance"
    />    
    
    <!-- 3. 分類圓餅圖 -->
    <CategoryPieChart 
      :category-stats="categoryStats"
      :total-expense="totalExpense"
    />
  </div>
</template>

<style scoped>
.monthly-report-page {
  padding: var(--mobile-padding);
  background-color: var(--background-color);
  min-height: 100vh;
}

@media (max-width: 480px) {
  .monthly-report-page {
    padding: 12px;
  }
}
</style>