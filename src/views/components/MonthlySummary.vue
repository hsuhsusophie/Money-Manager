<template>
  <div class="monthly-summary">
    <div class="summary-card">
      <div class="summary-item">
        <span class="label">收入</span>
        <span class="amount income">${{ totalIncome.toLocaleString() }}</span>
      </div>
      <div class="summary-item">
        <span class="label">支出</span>
        <span class="amount expense">${{ totalExpense.toLocaleString() }}</span>
      </div>
      <div class="summary-item">
        <span class="label">結餘</span>
        <span class="amount balance" :class="{ negative: balance < 0 }">
          ${{ balance.toLocaleString() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalIncome: number
  totalExpense: number
  balance: number
}>()
</script>

<style scoped>
.monthly-summary {
  margin-bottom: 16px;
}

.summary-card {
  background: var(--card-background);
  border-radius: var(--mobile-border-radius);
  padding: 16px;
  box-shadow: var(--card-shadow);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.summary-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 14px;
  color: var(--text-color);
  font-weight: 500;
}

.amount {
  font-size: 16px;
  font-weight: 600;
}

.income {
  color: var(--primary-color);
}

.expense {
  color: #ff6b6b;
}

.balance {
  color: var(--text-color);
}

.balance.negative {
  color: #ff6b6b;
}

@media (max-width: 480px) {
  .summary-card {
    padding: 12px;
  }
  
  .label {
    font-size: 13px;
  }
  
  .amount {
    font-size: 15px;
  }
}
</style> 