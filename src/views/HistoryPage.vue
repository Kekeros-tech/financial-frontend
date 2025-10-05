<template>
  <div class="history-page">
    <div class="container">
      <div class="page-header">
        <h1>История операций</h1>
        <div class="header-actions">
          <div class="add-transaction-container">
            <button @click="toggleAddForm" class="page-header-btn" :class="{ active: showAddForm }">
              <span>{{ showAddForm ? '−' : '+' }}</span>
              {{ showAddForm ? 'Скрыть форму' : 'Добавить операцию' }}
            </button>

            <!-- Выпадающая форма -->
            <transition name="slide-down">
              <div v-if="showAddForm" class="dropdown-form">
                <div class="form-container">
                  <TransactionForm @success="handleFormSuccess" @cancel="hideAddForm" />
                </div>
              </div>
            </transition>
          </div>

          <button @click="refreshData" class="page-header-btn" :disabled="loading">
            <span :class="{ refreshing: loading }">↻</span>
            Обновить
          </button>
        </div>
      </div>

      <!-- Фильтры и статистика -->
      <div class="history-controls">
        <div class="filters">
          <div class="filter-group">
            <label for="typeFilter" class="filter-label">Тип:</label>
            <select id="typeFilter" v-model="filters.type" class="filter-select">
              <option value="">Все</option>
              <option value="income">Доходы</option>
              <option value="expense">Расходы</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="categoryFilter" class="filter-label">Категория:</label>
            <select id="categoryFilter" v-model="filters.category" class="filter-select">
              <option value="">Все</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="dateFrom" class="filter-label">С:</label>
            <input id="dateFrom" type="date" v-model="filters.dateFrom" class="filter-input" />
          </div>

          <div class="filter-group">
            <label for="dateTo" class="filter-label">По:</label>
            <input id="dateTo" type="date" v-model="filters.dateTo" class="filter-input" />
          </div>

          <button @click="clearFilters" class="clear-filters-btn" v-if="hasActiveFilters">
            Сбросить фильтры
          </button>
        </div>

        <div class="history-stats">
          <div class="stat-item">
            <span class="stat-label">Всего операций:</span>
            <span class="stat-value">{{ filteredTransactions.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Сумма:</span>
            <span
              class="stat-value"
              :class="{
                positive: filteredTotal >= 0,
                negative: filteredTotal < 0,
              }"
            >
              {{ formatCurrency(filteredTotal) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Список операций -->
      <div class="history-content">
        <TransactionListFull
          :transactions="filteredTransactions"
          :loading="loading"
          :hasError="hasError"
          :error="error"
          @refresh="refreshData"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted, ref } from 'vue'
import { useFinancialStore } from '@/stores/financialStore'
import TransactionListFull from '@/components/TransactionListFull.vue'
import TransactionForm from '@/components/TransactionForm.vue'

interface Filters {
  type: string
  category: string
  dateFrom: string
  dateTo: string
}

export default defineComponent({
  name: 'HistoryPage',

  components: {
    TransactionListFull,
    TransactionForm,
  },

  setup() {
    const financialStore = useFinancialStore()
    const showAddForm = ref(false)

    const filters = reactive<Filters>({
      type: '',
      category: '',
      dateFrom: '',
      dateTo: '',
    })

    const categories = computed(() => financialStore.categories)
    const loading = computed(() => financialStore.isLoading)
    const hasError = computed(() => financialStore.hasError)
    const error = computed(() => financialStore.error)

    // Фильтрация транзакций
    const filteredTransactions = computed(() => {
      let transactions = financialStore.transactions || []

      if (filters.type) {
        transactions = transactions.filter((t) => t.type === filters.type)
      }

      if (filters.category) {
        transactions = transactions.filter((t) => t.category === filters.category)
      }

      if (filters.dateFrom) {
        transactions = transactions.filter((t) => t.date >= filters.dateFrom)
      }

      if (filters.dateTo) {
        transactions = transactions.filter((t) => t.date <= filters.dateTo)
      }

      return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    })

    const filteredTotal = computed(() => {
      return filteredTransactions.value.reduce((total, t) => {
        return t.type === 'income' ? total + t.amount : total - t.amount
      }, 0)
    })

    const hasActiveFilters = computed(() => {
      return (
        filters.type !== '' ||
        filters.category !== '' ||
        filters.dateFrom !== '' ||
        filters.dateTo !== ''
      )
    })

    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
      }).format(amount)
    }

    const refreshData = async (): Promise<void> => {
      await financialStore.loadTransactions()
    }

    const clearFilters = (): void => {
      filters.type = ''
      filters.category = ''
      filters.dateFrom = ''
      filters.dateTo = ''
    }

    const toggleAddForm = (): void => {
      showAddForm.value = !showAddForm.value
    }

    const hideAddForm = (): void => {
      showAddForm.value = false
    }

    const handleFormSuccess = (): void => {
      hideAddForm()
      refreshData() // Обновляем список после добавления
    }

    onMounted(() => {
      if (!financialStore.initialized) {
        financialStore.initialize()
      }
    })

    return {
      filters,
      categories,
      filteredTransactions,
      filteredTotal,
      hasActiveFilters,
      loading,
      hasError,
      error,
      showAddForm,
      formatCurrency,
      refreshData,
      clearFilters,
      toggleAddForm,
      hideAddForm,
      handleFormSuccess,
    }
  },
})
</script>

<style scoped>
.history-page {
  min-height: calc(100vh - 80px);
  background: #f8fafc;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  position: relative;
}

.page-header h1 {
  margin: 0;
  color: #1a1a1a;
  font-size: 2rem;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

/* Контейнер для кнопки и выпадающей формы */
.add-transaction-container {
  position: relative;
}

.page-header-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  position: relative;
  z-index: 10;
}

.page-header-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.page-header-btn.active {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  border-radius: 10px 10px 0 0;
}

.btn-icon {
  font-size: 1.2rem;
  font-weight: 300;
  transition: transform 0.3s ease;
}

.page-header-btn.active .btn-icon {
  transform: rotate(180deg);
}

/* Выпадающая форма */
.dropdown-form {
  position: absolute;
  top: 100%;
  right: 0;
  width: 400px;
  background: white;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid #e1e5e9;
  border-top: none;
  z-index: 5;
  overflow: hidden;
}

.form-container {
  padding: 1.5rem;
  background: white;
}

/* Анимация появления формы */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  transform-origin: top center;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.slide-down-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  transition: transform 0.3s ease;
}

.refreshing {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.history-controls {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #e1e5e9;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-select,
.filter-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  min-width: 120px;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-filters-btn {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-end;
}

.clear-filters-btn:hover {
  background: #dc2626;
}

.history-stats {
  display: flex;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-value {
  font-weight: 600;
  font-size: 1.125rem;
  color: #1a1a1a;
}

.stat-value.positive {
  color: #10b981;
}

.stat-value.negative {
  color: #ef4444;
}

.history-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #e1e5e9;
  overflow: hidden;
}

/* Адаптивность */
@media (max-width: 768px) {
  .history-page {
    padding: 1rem 0;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
    gap: 1rem;
  }

  .add-transaction-container {
    width: 100%;
  }

  .dropdown-form {
    width: 100%;
    right: auto;
    left: 0;
  }

  .page-header-btn,
  .refresh-btn {
    width: 100%;
    justify-content: center;
  }

  .filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-group {
    width: 100%;
  }

  .filter-select,
  .filter-input {
    min-width: 100%;
  }

  .history-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .clear-filters-btn {
    align-self: stretch;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.5rem;
  }

  .form-container {
    padding: 1rem;
  }
}
</style>
