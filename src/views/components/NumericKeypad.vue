<script setup lang="ts">
import { useLedgerStore } from '@/stores/ledger'
import { computed, ref } from 'vue'

const store = useLedgerStore()

// 顯示值
const displayValue = computed({
  get: () => store.currentAmount,
  set: (value) => store.setCurrentAmount(value)
})

// 數字按鈕點擊
const inputDigit = (digit: string) => {
  if (displayValue.value === '0') {
    store.setCurrentAmount(digit)
  } else {
    store.setCurrentAmount(displayValue.value + digit)
  }
}

// 小數點
const inputDecimal = () => {
  if (displayValue.value.indexOf('.') === -1) {
    store.setCurrentAmount(displayValue.value + '.')
  }
}

// 清除
const clear = () => {
  store.setCurrentAmount('0')
}

// 刪除最後一位
const backspace = () => {
  if (displayValue.value.length > 1) {
    store.setCurrentAmount(displayValue.value.slice(0, -1))
  } else {
    store.setCurrentAmount('0')
  }
}

// 確認按鈕 - 新增交易
const confirm = () => {
  if (!store.selectedCategory) {
    alert('請先選擇分類')
    return
  }
  
  const amount = parseFloat(displayValue.value)
  if (amount <= 0) {
    alert('請輸入有效金額')
    return
  }
  
  // 新增支出記錄
  store.addTransaction({
    amount: amount,
    category: store.selectedCategory,
    date: store.selectedDate,
    note: store.note,
    type: 'expense'
  })
  
  // 清除表單
  store.clearForm()
}
</script>

<template>
  <div class="numeric-keypad">
    <!-- 顯示區域 -->
    <div class="display">
      <div class="display-value">{{ displayValue }}</div>
      <div class="display-info" v-if="store.selectedCategory">
        分類: {{ store.categories.find(c => c.id === store.selectedCategory)?.name }}
      </div>
    </div>
    
    <!-- 按鈕區域 -->
    <div class="keypad">
      <!-- 第一行 -->
      <div class="keypad-row">
        <button class="keypad-btn function" @click="clear">C</button>
        <button class="keypad-btn function" @click="backspace">⌫</button>
        <button class="keypad-btn function" @click="inputDecimal">.</button>
        <button class="keypad-btn confirm" @click="confirm">✓</button>
      </div>
      
      <!-- 第二行 -->
      <div class="keypad-row">
        <button class="keypad-btn number" @click="inputDigit('7')">7</button>
        <button class="keypad-btn number" @click="inputDigit('8')">8</button>
        <button class="keypad-btn number" @click="inputDigit('9')">9</button>
        <button class="keypad-btn number" @click="inputDigit('0')">0</button>
      </div>
      
      <!-- 第三行 -->
      <div class="keypad-row">
        <button class="keypad-btn number" @click="inputDigit('4')">4</button>
        <button class="keypad-btn number" @click="inputDigit('5')">5</button>
        <button class="keypad-btn number" @click="inputDigit('6')">6</button>
        <button class="keypad-btn number" @click="inputDigit('1')">1</button>
      </div>
      
      <!-- 第四行 -->
      <div class="keypad-row">
        <button class="keypad-btn number" @click="inputDigit('2')">2</button>
        <button class="keypad-btn number" @click="inputDigit('3')">3</button>
        <button class="keypad-btn number" @click="inputDigit('0')">0</button>
        <button class="keypad-btn function" @click="backspace">⌫</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.numeric-keypad {
  background-color: #f8f8f8;
  border-radius: 12px;
  padding: 16px;
  /* margin-bottom: 100px; */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.display {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  text-align: right;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.display-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  font-family: 'Courier New', monospace;
  margin-bottom: 4px;
}

.display-info {
  font-size: 12px;
  color: #666;
}

.keypad {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.keypad-row {
  display: flex;
  gap: 8px;
}

.keypad-btn {
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.keypad-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.keypad-btn:active {
  transform: translateY(0);
}

/* 數字按鈕 */
.keypad-btn.number {
  background-color: white;
  color: #333;
}

.keypad-btn.number:hover {
  background-color: #f0f0f0;
}

/* 功能按鈕 */
.keypad-btn.function {
  background-color: #e0e0e0;
  color: #666;
}

.keypad-btn.function:hover {
  background-color: #d0d0d0;
}

/* 確認按鈕 */
.keypad-btn.confirm {
  background-color: #34c759;
  color: white;
}

.keypad-btn.confirm:hover {
  background-color: #28a745;
}

/* 響應式設計 */
@media (max-width: 480px) {
  .numeric-keypad {
    padding: 12px;
  }
  
  .keypad-btn {
    height: 44px;
    font-size: 16px;
  }
  
  .display-value {
    font-size: 20px;
  }
}
</style> 