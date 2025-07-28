import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// localStorage 鍵名
const STORAGE_KEYS = {
  TRANSACTIONS: 'ledger_transactions',
  CATEGORIES: 'ledger_categories',
  SELECTED_DATE: 'ledger_selected_date',
  CURRENT_AMOUNT: 'ledger_current_amount',
  SELECTED_CATEGORY: 'ledger_selected_category',
  NOTE: 'ledger_note'
}

// 從 localStorage 讀取資料
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
    return defaultValue
  }
}

// 保存到 localStorage
const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

export interface Transaction {
  id: string
  amount: number
  category: string
  date: string
  note?: string
  type: 'expense' | 'income'
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export const useLedgerStore = defineStore('ledger', () => {
  // 狀態 - 從 localStorage 載入
  const transactions = ref<Transaction[]>(loadFromStorage(STORAGE_KEYS.TRANSACTIONS, []))
  const selectedDate = ref(loadFromStorage(STORAGE_KEYS.SELECTED_DATE, new Date().toISOString().split('T')[0]))
  const currentAmount = ref(loadFromStorage(STORAGE_KEYS.CURRENT_AMOUNT, '0'))
  const selectedCategory = ref(loadFromStorage(STORAGE_KEYS.SELECTED_CATEGORY, ''))
  const note = ref(loadFromStorage(STORAGE_KEYS.NOTE, ''))

  // 預設分類 - 從 localStorage 載入
  const categories = ref<Category[]>(loadFromStorage(STORAGE_KEYS.CATEGORIES, [
    { id: 'income', name: '收入', icon: '💰', color: '#51cf66' },
    { id: 'food', name: '食', icon: '🍽️', color: '#ff6b6b' },
    { id: 'drink', name: '飲料', icon: '🥤', color: '#4ecdc4' },
    { id: 'transport', name: '交通', icon: '🚗', color: '#45b7d1' },
    { id: 'shopping', name: '購物', icon: '🛍️', color: '#96ceb4' },
    { id: 'entertainment', name: '娛樂', icon: '🎮', color: '#feca57' },
    { id: 'health', name: '醫療', icon: '💊', color: '#ff9ff3' },
    { id: 'education', name: '教育', icon: '📚', color: '#54a0ff' },
  ]))

  // 分類管理狀態
  const isEditingCategories = ref(false)
  const editingCategory = ref<Category | null>(null)

  // 計算屬性
  const totalExpense = computed(() => {
    return transactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const totalIncome = computed(() => {
    return transactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const balance = computed(() => {
    return totalIncome.value - totalExpense.value
  })

  const transactionsByDate = computed(() => {
    return transactions.value.filter(t => t.date === selectedDate.value)
  })

  const categoryTotals = computed(() => {
    const totals: Record<string, number> = {}
    transactionsByDate.value.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount
    })
    return totals
  })

  // 方法
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    }
    transactions.value.push(newTransaction)
    
    // 重置表單
    currentAmount.value = '0'
    selectedCategory.value = ''
    note.value = ''
  }

  const deleteTransaction = (id: string) => {
    const index = transactions.value.findIndex(t => t.id === id)
    if (index > -1) {
      transactions.value.splice(index, 1)
    }
  }

  const setSelectedDate = (date: string) => {
    selectedDate.value = date
  }

  const setCurrentAmount = (amount: string) => {
    currentAmount.value = amount
  }

  const setSelectedCategory = (category: string) => {
    selectedCategory.value = category
  }

  const setNote = (newNote: string) => {
    note.value = newNote
  }

  const clearForm = () => {
    currentAmount.value = '0'
    selectedCategory.value = ''
    note.value = ''
  }

  // 分類管理方法
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString()
    }
    categories.value.push(newCategory)
  }

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const index = categories.value.findIndex(c => c.id === id)
    if (index > -1) {
      categories.value[index] = { ...categories.value[index], ...updates }
    }
  }

  const deleteCategory = (id: string) => {
    // 檢查是否有交易使用此分類
    const hasTransactions = transactions.value.some(t => t.category === id)
    if (hasTransactions) {
      throw new Error('無法刪除已使用的分類')
    }
    
    const index = categories.value.findIndex(c => c.id === id)
    if (index > -1) {
      categories.value.splice(index, 1)
    }
  }

  const setEditingCategories = (editing: boolean) => {
    isEditingCategories.value = editing
    if (!editing) {
      editingCategory.value = null
    }
  }

  const setEditingCategory = (category: Category | null) => {
    editingCategory.value = category
  }

  // 監聽資料變化並保存到 localStorage
  watch(transactions, (newTransactions) => {
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, newTransactions)
  }, { deep: true })

  watch(selectedDate, (newDate) => {
    saveToStorage(STORAGE_KEYS.SELECTED_DATE, newDate)
  })

  watch(currentAmount, (newAmount) => {
    saveToStorage(STORAGE_KEYS.CURRENT_AMOUNT, newAmount)
  })

  watch(selectedCategory, (newCategory) => {
    saveToStorage(STORAGE_KEYS.SELECTED_CATEGORY, newCategory)
  })

  watch(note, (newNote) => {
    saveToStorage(STORAGE_KEYS.NOTE, newNote)
  })

  watch(categories, (newCategories) => {
    saveToStorage(STORAGE_KEYS.CATEGORIES, newCategories)
  }, { deep: true })

  return {
    // 狀態
    transactions,
    selectedDate,
    currentAmount,
    selectedCategory,
    note,
    categories,
    isEditingCategories,
    editingCategory,
    
    // 計算屬性
    totalExpense,
    totalIncome,
    balance,
    transactionsByDate,
    categoryTotals,
    
    // 方法
    addTransaction,
    deleteTransaction,
    setSelectedDate,
    setCurrentAmount,
    setSelectedCategory,
    setNote,
    clearForm,
    
    // 分類管理
    addCategory,
    updateCategory,
    deleteCategory,
    setEditingCategories,
    setEditingCategory,
  }
}) 