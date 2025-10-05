<template>
  <div class="transaction-list-preview">
    <div v-if="loading && !isInitialized" class="loading">
      <div class="spinner"></div>
      Загрузка...
    </div>

    <div v-else-if="hasError" class="error">
      <p>{{ error }}</p>
      <button @click="retryLoading" class="retry-btn">Повторить</button>
    </div>

    <div v-else-if="recentTransactions.length === 0" class="empty-state">
      <p>Нет операций</p>
    </div>

    <div v-else class="transactions">
      <div
        v-for="transaction in recentTransactions"
        :key="transaction.id"
        :class="['transaction-item', transaction.type]"
      >
        <div class="transaction-info">
          <div class="transaction-main">
            <span class="category">{{ transaction.category }}</span>
            <span class="amount" :class="transaction.type">
              {{ transaction.type === 'income' ? '+' : '-' }}
              {{ formatCurrency(transaction.amount) }}
            </span>
          </div>
          <div class="transaction-details">
            <p class="description">{{ transaction.description || 'Без описания' }}</p>
            <span class="date">{{ formatDate(transaction.date) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasMoreTransactions" class="view-more">
      <router-link to="/history" class="view-more-link">
        Показать все {{ totalTransactions }} операций
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useFinancialStore } from '@/stores/financialStore'

export default defineComponent({
  name: 'TransactionListPreview',

  setup() {
    const financialStore = useFinancialStore()

    const recentTransactions = computed(() => {
      const transactions = financialStore.transactions || []
      // Показываем только последние 5 операций
      return transactions.slice(0, 5)
    })

    const totalTransactions = computed(() => financialStore.transactions?.length || 0)
    const hasMoreTransactions = computed(() => totalTransactions.value > 5)

    const loading = computed(() => financialStore.isLoading)
    const hasError = computed(() => financialStore.hasError)
    const error = computed(() => financialStore.error)
    const isInitialized = computed(() => financialStore.isInitialized)

    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
      }).format(amount)
    }

    const formatDate = (dateString: string): string => {
      try {
        return new Date(dateString).toLocaleDateString('ru-RU')
      } catch (error) {
        return 'Неверная дата'
      }
    }

    const retryLoading = async (): Promise<void> => {
      await financialStore.loadTransactions()
    }

    return {
      recentTransactions,
      totalTransactions,
      hasMoreTransactions,
      loading,
      hasError,
      error,
      isInitialized,
      formatCurrency,
      formatDate,
      retryLoading,
    }
  },
})
</script>

<style scoped>
.transaction-list-preview {
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

.transactions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  overflow-y: auto;
}

.transaction-item {
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid;
  transition: all 0.2s ease;
}

.transaction-item:hover {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.transaction-item.income {
  border-left-color: #10b981;
}

.transaction-item.expense {
  border-left-color: #ef4444;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.transaction-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.amount {
  font-weight: bold;
  font-size: 0.9rem;
}

.amount.income {
  color: #10b981;
}

.amount.expense {
  color: #ef4444;
}

.transaction-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.description {
  color: #6b7280;
  margin: 0;
  font-size: 0.8rem;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date {
  color: #9ca3af;
  font-size: 0.75rem;
}

.view-more {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.view-more-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.view-more-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.error {
  color: #dc2626;
}

.retry-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.retry-btn:hover {
  background: #b91c1c;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 0.5rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
