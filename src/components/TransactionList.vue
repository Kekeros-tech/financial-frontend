<template>
  <div class="transaction-list">
    <h3>История операций</h3>

    <div v-if="loading && !isInitialized" class="loading">
      <div class="spinner"></div>
      Загрузка операций...
    </div>

    <div v-else-if="hasError" class="error">
      <p>{{ error }}</p>
      <button @click="retryLoading" class="retry-btn">Повторить попытку</button>
    </div>

    <div v-else-if="!transactions || transactions.length === 0" class="empty-state">
      <p>Нет операций</p>
      <p v-if="!isInitialized" class="local-data-info">Используются локальные данные</p>
    </div>

    <div v-else class="transactions">
      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        :class="['transaction-item', transaction.type]"
      >
        <div class="transaction-info">
          <div class="transaction-main">
            <span class="category">{{ transaction.category }}</span>
            <span class="amount" :class="transaction.type">
              <!-- {{ transaction.type === 'income' ? '+' : '-' }} -->
              {{ formatCurrency(transaction.amount) }}
            </span>
          </div>
          <div class="transaction-details">
            <p class="description">{{ transaction.description || 'Без описания' }}</p>
            <span class="date">{{ formatDate(transaction.date) }}</span>
          </div>
        </div>

        <button
          @click="deleteTransaction(transaction.id!)"
          class="delete-btn"
          title="Удалить"
          :disabled="loading"
        >
          ×
        </button>
      </div>
    </div>

    <div v-if="loading && isInitialized" class="loading-bottom">Обновление данных...</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useFinancialStore } from '@/stores/financialStore'
import { formatCurrency } from '@/utils/utils'

export default defineComponent({
  name: 'TransactionList',

  setup() {
    const financialStore = useFinancialStore()

    const transactions = computed(() => financialStore.transactions || [])
    const loading = computed(() => financialStore.isLoading)
    const hasError = computed(() => financialStore.hasError)
    const error = computed(() => financialStore.error)
    const isInitialized = computed(() => financialStore.isInitialized)

    const formatDate = (dateString: string): string => {
      try {
        console.info(dateString)
        return new Date(dateString).toLocaleDateString('ru-RU')
      } catch (error) {
        return 'Неверная дата'
      }
    }

    const deleteTransaction = async (id: number): Promise<void> => {
      if (confirm('Вы уверены, что хотите удалить эту операцию?')) {
        try {
          await financialStore.deleteTransaction(id)
        } catch (error) {
          console.error('Error deleting transaction:', error)
        }
      }
    }

    const retryLoading = async (): Promise<void> => {
      await financialStore.loadTransactions()
    }

    onMounted(() => {
      if (!financialStore.initialized) {
        financialStore.initialize()
      }
    })

    return {
      transactions,
      loading,
      hasError,
      error,
      isInitialized,
      formatCurrency,
      formatDate,
      deleteTransaction,
      retryLoading,
    }
  },
})
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 2rem;
  color: #007bff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
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

.error {
  text-align: center;
  padding: 1.5rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #c82333;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.local-data-info {
  font-size: 0.9rem;
  color: #888;
  margin-top: 0.5rem;
}

.loading-bottom {
  text-align: center;
  padding: 1rem;
  color: #007bff;
  font-size: 0.9rem;
}

.transaction-list {
  max-height: 500px;
  overflow-y: auto;
}

.transactions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border-left: 4px solid;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.transaction-item.income {
  border-left-color: #28a745;
}

.transaction-item.expense {
  border-left-color: #dc3545;
}

.transaction-info {
  flex: 1;
}

.transaction-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.category {
  font-weight: bold;
  color: #333;
}

.amount {
  font-weight: bold;
}

.amount.income {
  color: #28a745;
}

.amount.expense {
  color: #dc3545;
}

.transaction-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.description {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
  font-style: italic;
}

.date {
  color: #999;
  font-size: 0.8rem;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
  transition: background-color 0.2s;
}

.delete-btn:hover:not(:disabled) {
  background: #c82333;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
