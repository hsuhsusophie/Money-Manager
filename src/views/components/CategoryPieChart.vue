<template>
  <div class="category-pie-chart">
    <div class="chart-header">
      <h3>支出分類</h3>
    </div>
    
    <div class="chart-container">
      <svg 
        v-if="totalExpense > 0"
        :width="200" 
        :height="200" 
        class="pie-chart"
        viewBox="0 0 200 200"
        style="overflow: visible;"
      >
        <g v-for="(slice, index) in pieSlices" :key="index">
          <path
            :d="slice.path"
            :fill="slice.color"
            class="pie-slice"
            stroke="none"
          />
        </g>
        
        <!-- 在圓餅圖中心顯示圖標 -->
        <g v-for="(category, index) in categoryStats.slice(0, 3)" :key="`icon-${category.category}`">
          <text
            :x="getIconPosition(index, categoryStats, 200).x"
            :y="getIconPosition(index, categoryStats, 200).y"
            class="chart-icon-text"
            :fill="category.color"
          >
            {{ getCategoryIcon(category.category) }}
          </text>
        </g>
      </svg>
      
      <div v-else class="no-data">
        無支出數據
      </div>
    </div>
    
    <!-- 圖例 -->
    <div class="legend">
      <div 
        v-for="(category, index) in categoryStats" 
        :key="category.category"
        class="legend-item"
      >
        <div class="legend-color" :style="{ backgroundColor: category.color }"></div>
        <span class="legend-label">{{ category.name }}</span>
        <span class="legend-percentage">{{ category.percentage }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface CategoryStat {
  category: string
  name: string
  amount: number
  color: string
  percentage: number
}

const props = defineProps<{
  categoryStats: CategoryStat[]
  totalExpense: number
}>()

const pieSlices = computed(() => {
  if (props.totalExpense === 0) return []
  
  const center = 100
  const radius = 100 // 使用完整半徑
  let currentAngle = -90 // 從12點鐘方向開始
  
  return props.categoryStats.map((stat) => {
    const percentage = stat.amount / props.totalExpense
    const angle = percentage * 360
    const endAngle = currentAngle + angle
    
    // 計算圓弧的起點和終點
    const startX = center + radius * Math.cos(currentAngle * Math.PI / 180)
    const startY = center + radius * Math.sin(currentAngle * Math.PI / 180)
    const endX = center + radius * Math.cos(endAngle * Math.PI / 180)
    const endY = center + radius * Math.sin(endAngle * Math.PI / 180)
    
    // 判斷是否需要繪製大圓弧
    const largeArcFlag = angle > 180 ? 1 : 0
    
    const pathData = [
      `M ${center} ${center}`,
      `L ${startX} ${startY}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      'Z'
    ].join(' ')
    
    currentAngle = endAngle
    
    return {
      path: pathData,
      color: stat.color
    }
  })
})

const getIconPosition = (index: number, categories: CategoryStat[], size: number) => {
  const center = size / 2
  const radius = size / 2 - 30 // 更往內，確保在扇形中心

  // 如果只有一個分類，圖標放在正中間
  if (categories.length === 1) {
    return { x: center, y: center }
  }

  // 計算到當前扇形為止的累積角度
  let cumulativeAngle = -90 // 從12點鐘方向開始

  for (let i = 0; i < index; i++) {
    const percentage = categories[i].amount / categories.reduce((sum, stat) => sum + stat.amount, 0)
    cumulativeAngle += percentage * 360
  }

  // 當前扇形的中心角度
  const currentPercentage = categories[index].amount / categories.reduce((sum, stat) => sum + stat.amount, 0)
  const centerAngle = cumulativeAngle + (currentPercentage * 360) / 2

  const x = center + radius * Math.cos(centerAngle * Math.PI / 180)
  const y = center + radius * Math.sin(centerAngle * Math.PI / 180)

  return { x, y }
}

const getCategoryIcon = (category: string) => {
  // 根據分類ID返回對應的圖標
  const iconMap: Record<string, string> = {
    'food': '🍽️',
    'drinks': '🥤',
    'transportation': '🚗',
    'shopping': '🛍️',
    'entertainment': '🎮',
    'medical': '💊',
    'education': '📚',
    'income': '💰',
    'utilities': '⚡',
    'health': '⚕️',
    'other': '💡'
  }
  
  return iconMap[category] || '📊'
}
</script>

<style scoped>
.category-pie-chart {
  background: var(--card-background);
  border-radius: var(--mobile-border-radius);
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: var(--card-shadow);
}

.chart-header {
  margin-bottom: 16px;
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--text-color);
  font-weight: 600;
}

.chart-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.pie-chart {
  border-radius: 50%;
  box-shadow: var(--card-shadow);
  background: transparent;
  display: block;
}

.pie-slice {
  transition: opacity 0.2s ease;
  stroke: none;
}

.pie-slice:hover {
  opacity: 0.8;
}

.center-text {
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: var(--text-color);
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-light);
  font-size: 14px;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-label {
  font-size: 14px;
  color: var(--text-color);
  flex: 1;
}

.legend-percentage {
  font-size: 14px;
  color: var(--text-light);
  font-weight: 500;
}

.chart-icon-text {
  font-size: 24px; /* 調整圖標大小 */
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: middle;
}

@media (max-width: 480px) {
  .category-pie-chart {
    padding: 12px;
  }
  
  .chart-header h3 {
    font-size: 14px;
  }
  
  .legend-label,
  .legend-percentage {
    font-size: 13px;
  }
}
</style> 