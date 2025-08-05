<script setup lang="ts">
import DateSelector from '../components/DateSelector.vue'
import CategoryList from '../components/CategoryList.vue'
import NumericKeypad from '../components/NumericKeypad.vue'
import CategoryEditor from '../components/CategoryEditor.vue'
</script>

<template>
  <div class="home-page">
    <!-- 日期選擇器 -->
    <DateSelector />
    
    <!-- 分類列表 -->
    <CategoryList />
    
    <!-- 計算機 -->
    <NumericKeypad />
    
    <!-- 分類編輯器 -->
    <CategoryEditor />
  </div>
</template>

<style scoped>
.home-page {
  padding: 16px;
  min-height: 80vh;
  background-color: #f5f5f5;
}

@media (max-width: 480px) {
  .home-page {
    padding: 12px;
  }
}
</style>