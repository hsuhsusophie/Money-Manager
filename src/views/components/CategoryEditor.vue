<script setup lang="ts">
import { useLedgerStore } from '@/stores/ledger'
import { ref, computed, watch } from 'vue'
import { showError } from '@/utils/toast'

const store = useLedgerStore()

// 表單數據
const formData = ref({
  name: '',
  icon: '📁',
  color: '#007aff'
})

// 是否為編輯模式
const isEditMode = computed(() => !!store.editingCategory)

// 圖標選項
const iconOptions = [
  '💰', '🍽️', '🥤', '🚗', '🛍️', '🎮', '💊', '📚',
  '🏠', '👕', '🎵', '🎬', '✈️', '🏥', '💡', '🎁'
]

// 顏色選項
const colorOptions = [
  '#007aff', '#51cf66', '#ff6b6b', '#ffd43b', '#339af0',
  '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
]

// 初始化表單
const initForm = () => {
  if (store.editingCategory) {
    formData.value = {
      name: store.editingCategory.name,
      icon: store.editingCategory.icon,
      color: store.editingCategory.color
    }
  } else {
    formData.value = {
      name: '',
      icon: '📁',
      color: '#007aff'
    }
  }
}

// 保存分類
const saveCategory = async () => {
  if (!formData.value.name.trim()) {
    showError('請輸入分類名稱')
    return
  }

  try {
    if (isEditMode.value) {
      // 更新分類
      store.updateCategory(store.editingCategory!.id, {
        name: formData.value.name,
        icon: formData.value.icon,
        color: formData.value.color
      })
    } else {
      // 新增分類
      store.addCategory({
        name: formData.value.name,
        icon: formData.value.icon,
        color: formData.value.color
      })
    }
    
    // 關閉編輯模式
    store.setEditingCategories(false)
    store.setEditingCategory(null)
  } catch (error) {
    showError(error instanceof Error ? error.message : '操作失敗')
  }
}

// 取消編輯
const cancelEdit = () => {
  store.setEditingCategories(false)
  store.setEditingCategory(null)
}

// 刪除分類
const deleteCategory = () => {
  if (!store.editingCategory) return
  
  if (confirm('確定要刪除此分類嗎？')) {
    try {
      store.deleteCategory(store.editingCategory.id)
      store.setEditingCategories(false)
      store.setEditingCategory(null)
    } catch (error) {
      showError(error instanceof Error ? error.message : '刪除失敗')
    }
  }
}

// 監聽編輯狀態變化
watch(() => store.isEditingCategories, (newValue) => {
  if (newValue) {
    initForm()
  }
})
</script>

<template>
  <div class="category-editor" v-if="store.isEditingCategories">
    <div class="editor-header">
      <h3>{{ isEditMode ? '編輯分類' : '新增分類' }}</h3>
      <button class="close-btn" @click="cancelEdit">×</button>
    </div>
    
    <div class="editor-form">
      <!-- 分類名稱 -->
      <div class="form-group">
        <label>分類名稱</label>
        <input 
          v-model="formData.name" 
          type="text" 
          placeholder="輸入分類名稱"
          class="form-input"
        />
      </div>
      
      <!-- 圖標選擇 -->
      <div class="form-group">
        <label>選擇圖標</label>
        <div class="icon-grid">
          <button
            v-for="icon in iconOptions"
            :key="icon"
            class="icon-btn"
            :class="{ active: formData.icon === icon }"
            @click="formData.icon = icon"
          >
            {{ icon }}
          </button>
        </div>
      </div>
      
      <!-- 顏色選擇 -->
      <div class="form-group">
        <label>選擇顏色</label>
        <div class="color-grid">
          <button
            v-for="color in colorOptions"
            :key="color"
            class="color-btn"
            :class="{ active: formData.color === color }"
            :style="{ backgroundColor: color }"
            @click="formData.color = color"
          />
        </div>
      </div>
      
      <!-- 按鈕區域 -->
      <div class="editor-actions">
        <button class="btn btn-secondary" @click="cancelEdit">取消</button>
        <button 
          v-if="isEditMode" 
          class="btn btn-danger" 
          @click="deleteCategory"
        >
          刪除
        </button>
        <button class="btn btn-primary" @click="saveCategory">
          {{ isEditMode ? '更新' : '新增' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-editor {
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

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.editor-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #f0f0f0;
  color: #666;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #e0e0e0;
}

.editor-form {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  overflow-y: auto;
  position: absolute;
  top: 5%;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.form-input:focus {
  outline: none;
  border-color: #007aff;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  border-color: #007aff;
}

.icon-btn.active {
  border-color: #007aff;
  background: #f0f8ff;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.color-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.active {
  border-color: #333;
  transform: scale(1.1);
}

.preview-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f8f8f8;
}

.preview-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: 12px;
}

.preview-name {
  font-size: 14px;
  color: #333;
}

.editor-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-primary {
  background: #007aff;
  color: white;
}

.btn-primary:hover {
  background: #0056cc;
}

.btn-danger {
  background: #ff3b30;
  color: white;
}

.btn-danger:hover {
  background: #d70015;
}

@media (max-width: 480px) {
  .category-editor {
    padding: 10px;
  }

  .editor-form {
    width: 85%;
    padding: 20px;
  }
  
  .icon-grid {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .color-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style> 