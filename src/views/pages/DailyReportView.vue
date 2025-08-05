<script setup lang="ts">
import { useLedgerStore } from '@/stores/ledger'

const store = useLedgerStore()

// 生成當月1號到今天的日期
const getDateRange = () => {
  const dates = []
  const now = new Date()
  
  // 獲取當月1號
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  console.log('當前日期:', now)
  console.log('當月1號:', firstDayOfMonth)
  console.log('今天:', today)
  
  // 從當月1號到今天的日期
  let currentDay = new Date(firstDayOfMonth) 
  
  while (currentDay <= today) {
    // 格式化為 YYYY-MM-DD
    const year = currentDay.getFullYear()
    const month = String(currentDay.getMonth() + 1).padStart(2, '0')
    const day = String(currentDay.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    dates.push(dateStr)
    
    // 移到下一天
    currentDay.setDate(currentDay.getDate() + 1)
  }
  
  console.log('日期範圍:', dates) // 調試信息
  return dates
}

// 獲取指定日期的交易
const getTransactionsByDate = (date: string) => {
  const transactions = store.transactions.filter(t => t.date === date && t.type === 'expense')
  console.log(`日期 ${date} 的交易:`, transactions) // 調試信息
  return transactions
}

// 獲取指定日期的總支出
const getTotalExpenseByDate = (date: string) => {
  const transactions = getTransactionsByDate(date)
  return transactions.reduce((sum, t) => sum + t.amount, 0)
}

// 獲取指定日期的總收入
const getTotalIncomeByDate = (date: string) => {
  const transactions = store.transactions.filter(t => t.date === date && t.type === 'income')
  return transactions.reduce((sum, t) => sum + t.amount, 0)
}

// 獲取指定日期的分類統計
const getCategoryStatsByDate = (date: string) => {
  const transactions = getTransactionsByDate(date)
  const stats: Record<string, { amount: number, count: number }> = {}
  
  transactions.forEach(t => {
    if (!stats[t.category]) {
      stats[t.category] = { amount: 0, count: 0 }
    }
    stats[t.category].amount += t.amount
    stats[t.category].count += 1
  })
  
  const result = Object.keys(stats).map(category => ({
    category,
    amount: stats[category].amount,
    count: stats[category].count,
    categoryInfo: store.categories.find(c => c.id === category)
  })).sort((a, b) => b.amount - a.amount)
  
  // 調試信息
  //if (date === '2025-08-01') {
  //console.log('8/1的交易:', transactions)
  //console.log('8/1的分類統計:', result)
  //}
  
  return result
}

// 生成圓餅圖的SVG路徑
const generatePieChart = (categoryStats: any[], total: number, size: number = 80) => {
  if (total === 0) return []
  
  const center = size / 2
  const radius = size / 2 - 5
  let currentAngle = -90 // 從12點鐘方向開始
  
  return categoryStats.map((stat, index) => {
    const percentage = stat.amount / total
    const angle = percentage * 360
    const endAngle = currentAngle + angle
    
    // 計算圓弧的起點和終點
    const startX = center + radius * Math.cos(currentAngle * Math.PI / 180)
    const startY = center + radius * Math.sin(currentAngle * Math.PI / 180)
    const endX = center + radius * Math.cos(endAngle * Math.PI / 180)
    const endY = center + radius * Math.sin(endAngle * Math.PI / 180)
    
    // 判斷是否需要繪製大圓弧
    const largeArcFlag = angle > 180 ? 1 : 0
    
    // 修正SVG路徑，確保圓形不會歪斜
    let pathData
    if (percentage >= 1) {
      // 如果是100%，繪製完整圓形
      pathData = `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${radius * 2} 0 a ${radius} ${radius} 0 1 1 -${radius * 2} 0`
    } else {
      // 正常繪製扇形
      pathData = [
        `M ${center} ${center}`,
        `L ${startX} ${startY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        'Z'
      ].join(' ')
    }
    
    currentAngle = endAngle
    
    return {
      path: pathData,
      color: stat.categoryInfo?.color || '#ccc',
      percentage: (percentage * 100).toFixed(1)
    }
  })
}

// 格式化日期顯示
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today.getTime())
  yesterday.setDate(yesterday.getDate() - 1)
  const tomorrow = new Date(today.getTime())
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (dateStr === today.toISOString().split('T')[0]) {
    return '今天'
  } else if (dateStr === yesterday.toISOString().split('T')[0]) {
    return '昨天'
  } else if (dateStr === tomorrow.toISOString().split('T')[0]) {
    return '明天'
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}

// 獲取日期範圍
const dateRange = getDateRange()
const today = new Date().toISOString().split('T')[0]

// 計算圖標在圓餅圖中的位置
const getIconPosition = (index: number, categoryStats: any[], size: number) => {
  const center = size / 2
  const radius = size / 2 - 30 // 更往內，確保在扇形中心
  
  // 如果只有一個分類，圖標放在正中間
  if (categoryStats.length === 1) {
    return { x: center, y: center }
  }
  
  // 計算到當前扇形為止的累積角度
  let cumulativeAngle = -90 // 從12點鐘方向開始
  
  for (let i = 0; i < index; i++) {
    const percentage = categoryStats[i].amount / categoryStats.reduce((sum, stat) => sum + stat.amount, 0)
    cumulativeAngle += percentage * 360
  }
  
  // 當前扇形的中心角度
  const currentPercentage = categoryStats[index].amount / categoryStats.reduce((sum, stat) => sum + stat.amount, 0)
  const centerAngle = cumulativeAngle + (currentPercentage * 360) / 2
  
  const x = center + radius * Math.cos(centerAngle * Math.PI / 180)
  const y = center + radius * Math.sin(centerAngle * Math.PI / 180)
  
  return { x, y }
}
</script>

<template>
  <div class="daily-report-page">
    <div class="report-header">
      <h2>日報</h2>
      <div class="total-summary">
        <span class="total-label">總計</span>
        <span class="total-amount">${{ dateRange.reduce((sum, date) => sum + getTotalExpenseByDate(date), 0).toLocaleString() }}</span>
      </div>
    </div>
    
    <div class="daily-cards">
      <div 
        v-for="date in dateRange" 
        :key="date"
        class="daily-card"
        :class="{ 'today': date === today }"
      >
        <div class="card-header">
          <span class="date-label">{{ formatDate(date) }}</span>
          <span v-if="getTotalIncomeByDate(date) > 0" class="daily-income">${{ getTotalIncomeByDate(date).toLocaleString() }}</span>
          <span class="daily-total">${{ getTotalExpenseByDate(date).toLocaleString() }}</span>
        </div>
        
        <div class="card-content">
          <!-- 左邊：圓餅圖 -->
          <div class="chart-section">
            <svg 
              v-if="getTotalExpenseByDate(date) > 0"
              :width="120" 
              :height="120" 
              class="pie-chart"
              viewBox="0 0 120 120"
            >
              <g v-for="(slice, index) in generatePieChart(getCategoryStatsByDate(date), getTotalExpenseByDate(date), 120)" :key="index">
                <path 
                  :d="slice.path" 
                  :fill="slice.color"
                  class="pie-slice"
                />
              </g>
              
              <!-- 在圓餅圖中心顯示圖標 -->
              <g v-for="(stat, index) in getCategoryStatsByDate(date).slice(0, 3)" :key="`icon-${stat.category}`">
                <text 
                  :x="getIconPosition(index, getCategoryStatsByDate(date), 120).x" 
                  :y="getIconPosition(index, getCategoryStatsByDate(date), 120).y" 
                  class="chart-icon-text"
                  :fill="stat.categoryInfo?.color || '#333'"
                >
                  {{ stat.categoryInfo?.icon || '📝' }}
                </text>
              </g>
            </svg>
            <div v-else class="no-data">無資料</div>
          </div>
          
          <!-- 右邊：支出明細列表 -->
          <div class="expense-list">
            <div 
              v-if="getCategoryStatsByDate(date).length > 0"
              v-for="stat in getCategoryStatsByDate(date)" 
              :key="stat.category"
              class="expense-item"
            >
              <span class="category-icon">{{ stat.categoryInfo?.icon || '📝' }}</span>
              <span class="category-name">{{ stat.categoryInfo?.name || stat.category }}</span>
              <span class="expense-amount">${{ stat.amount.toLocaleString() }}</span>
            </div>
            <div v-else class="no-expense">
              無支出記錄
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.daily-report-page {
  padding: 16px;
  background-color: #f5f5f5;
  min-height: 100vh;
  /* 禁用雙擊放大 */
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.report-header h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.total-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.total-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.total-amount {
  font-size: 18px;
  font-weight: 600;
  color: #ff6b6b;
}

.daily-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.daily-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  /* 禁用雙擊放大 */
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.daily-card:hover {
  transform: translateY(-2px);
}

.daily-card.today {
  border: 2px solid #4ecdc4;
  background: linear-gradient(135deg, #fff 0%, #f8fffe 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.date-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.daily-income {
  font-size: 16px;
  font-weight: 600;
  color: #51cf66; /* 綠色 */
}

.daily-total {
  font-size: 18px;
  font-weight: 600;
  color: #ff6b6b;
}

.card-content {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.chart-section {
  flex: 0 0 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
}

.pie-chart {
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 120px;
  height: 120px;
  display: block;
}

.pie-slice {
  transition: opacity 0.2s ease;
  stroke: none;
}

.pie-slice:hover {
  opacity: 0.8;
}

.no-data {
  font-size: 12px;
  color: #999;
  text-align: center;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 50%;
  border: 2px dashed #dee2e6;
}

.expense-list {
  flex: 0 0 55%; /* 增加右邊寬度 */
  display: flex;
  flex-direction: column;
  gap: 6px; /* 減少項目間距 */
  padding-right: 4px; /* 添加右邊距 */
}

.expense-item {
  display: flex;
  align-items: center;
  gap: 6px; /* 減少元素間距 */
  padding: 2px 0; /* 減少上下間距 */
  font-size: 13px; /* 稍微縮小字體 */
}

.category-icon {
  font-size: 14px; /* 縮小圖標 */
  width: 16px; /* 減少圖標寬度 */
  text-align: center;
  flex-shrink: 0; /* 防止圖標被壓縮 */
}

.category-name {
  flex: 1;
  font-size: 13px;
  color: #333;
  white-space: nowrap; /* 防止文字換行 */
  overflow: hidden; /* 隱藏溢出文字 */
  text-overflow: ellipsis; /* 顯示省略號 */
}

.expense-amount {
  font-size: 13px;
  font-weight: 600;
  color: #ff6b6b;
  flex-shrink: 0; /* 防止金額被壓縮 */
  min-width: fit-content; /* 確保金額完整顯示 */
}

.no-expense {
  font-size: 12px;
  color: #999;
  text-align: center;
  padding: 20px 0;
}

.chart-icon-text {
  font-size: 20px; /* 調整圖標大小 */
  font-weight: bold;
  text-anchor: middle; /* 水平居中 */
  dominant-baseline: middle; /* 垂直居中 */
  pointer-events: none; /* 防止圖標影響點擊 */
  user-select: none; /* 防止選中 */
}

@media (max-width: 480px) {
  .daily-report-page {
    padding: 12px;
  }
  
  .report-header {
    padding: 12px;
  }
  
  .daily-card {
    padding: 12px;
  }
  
  .card-content {
    flex-direction: row;
    gap: 8px; /* 手機上進一步減少間距 */
  }
  
  .chart-section {
    flex: 0 0 35%; /* 手機上左邊更窄 */
    width: 80px; /* 手機上更小 */
    height: 80px;
  }
  
  .pie-chart {
    width: 80px;
    height: 80px;
  }
  
  .no-data {
    width: 80px;
    height: 80px;
  }
  
  .expense-list {
    flex: 0 0 60%; /* 手機上右邊更寬 */
    gap: 4px; /* 手機上間距更小 */
    padding-right: 2px;
  }
  
  .expense-item {
    gap: 4px;
    padding: 1px 0;
    font-size: 12px;
  }
  
  .category-icon {
    font-size: 12px;
    width: 14px;
  }
  
  .category-name {
    font-size: 12px;
  }
  
  .expense-amount {
    font-size: 12px;
  }
  
  .chart-icon-text {
    font-size: 16px; /* 手機上圖標更小 */
  }
}
</style>