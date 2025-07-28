<script setup lang="ts">
import { useLedgerStore } from '@/stores/ledger'
import { computed } from 'vue'

const store = useLedgerStore()

// 選中的分類
const selectedCategory = computed({
  get: () => store.selectedCategory,
  set: (value) => store.setSelectedCategory(value)
})

// 分類統計
const categoryTotals = computed(() => store.categoryTotals)

// 選擇分類
const selectCategory = (categoryId: string) => {
  if (selectedCategory.value === categoryId) {
    selectedCategory.value = ''
  } else {
    selectedCategory.value = categoryId
  }
}

// 編輯分類
const editCategory = (category: any) => {
  store.setEditingCategory(category)
  store.setEditingCategories(true)
}

// 新增分類
const addNewCategory = () => {
  store.setEditingCategory(null)
  store.setEditingCategories(true)
}
</script>

<template>
  <div class="category-list">
    <div class="category-header">
      <h3>選擇分類</h3>
      <div class="header-actions">
        <button class="add-btn" @click="addNewCategory">+ 新增</button>
      </div>
    </div>
    
    <div class="categories-grid">
      <div
        v-for="category in store.categories"
        :key="category.id"
        class="category-item"
        :class="{ active: selectedCategory === category.id }"
        @click="selectCategory(category.id)"
      >
        <div class="category-icon" :style="{ backgroundColor: category.color }">
          {{ category.icon }}
        </div>
        <div class="category-info">
          <div class="category-name">{{ category.name }}</div>
          <div class="category-amount">
            ${{ (categoryTotals[category.id] || 0).toFixed(0) }}
          </div>
        </div>
        <div class="category-check" v-if="selectedCategory === category.id">
          ✓
        </div>
        <button class="edit-btn" @click.stop="editCategory(category)">
          ✏️
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-list {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.category-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.category-hint {
  font-size: 12px;
  color: #999;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  text-align: center;
  min-height: 80px;
}

.category-item:hover {
  background-color: #f8f8f8;
  transform: translateY(-1px);
}

.category-item.active {
  border-color: #007aff;
  background-color: #f0f8ff;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
  min-width: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
  text-align: center;
}

.category-amount {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.category-check {
  position: absolute;
  top: 8px;
  right: 2px;
  width: 20px;
  height: 20px;
  background-color: #007aff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.edit-btn {
  position: absolute;
  top: 8px;
  right: 50px;
  width: 20px;
  height: 20px;
  background-color: #f0f0f0;
  color: #666;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.category-item:hover .edit-btn {
  opacity: 1;
}

.edit-btn:hover {
  background-color: #e0e0e0;
}

.header-actions {
  display: flex;
  gap: 2px;
}

.add-btn {
  padding: 6px 12px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background-color: #0056cc;
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  
  .category-item {
    padding: 8px;
  }
  
  .category-icon {
    width: 32px;
    height: 32px;
    font-size: 16px;
    margin-right: 8px;
  }
  
  .category-name {
    font-size: 12px;
  }
  
  .category-amount {
    font-size: 10px;
  }
}
</style> 