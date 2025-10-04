<template>
  <div class="balance-display">
    <!-- Показываем loading только при первой загрузке -->
    <div v-if="loading && !isInitialized" class="loading">
      <div class="spinner"></div>
      Загрузка финансовых данных...
    </div>

    <div v-else-if="hasError" class="error">
      <h4>Ошибка загрузки</h4>
      <p>{{ error }}</p>
      <button @click="retryLoading" class="retry-btn">Повторить попытку</button>
    </div>

    <div v-else class="balance-cards">
      <div class="balance-card total">
        <h3>Общий баланс</h3>
        <p :class="{ positive: totalBalance >= 0, negative: totalBalance < 0 }">
          {{ formatCurrency(totalBalance) }}
        </p>
        <small v-if="!isInitialized">(локальные данные)</small>
      </div>

      <div class="balance-card income">
        <h3>Доходы</h3>
        <p class="positive">{{ formatCurrency(income) }}</p>
      </div>

      <div class="balance-card expense">
        <h3>Расходы</h3>
        <p class="negative">{{ formatCurrency(expenses) }}</p>
      </div>
    </div>

    <!-- Индикатор фоновой загрузки -->
    <div v-if="loading && isInitialized" class="loading-indicator">Обновление данных...</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useFinancialStore } from '@/stores/financialStore'
import { formatCurrency } from '@/utils/utils'

export default defineComponent({
  name: 'BalanceDisplay',

  setup() {
    const financialStore = useFinancialStore()

    const totalBalance = computed(() => financialStore.totalBalance)
    const income = computed(() => financialStore.income)
    const expenses = computed(() => financialStore.expenses)
    const loading = computed(() => financialStore.isLoading)
    const hasError = computed(() => financialStore.hasError)
    const error = computed(() => financialStore.error)
    const isInitialized = computed(() => financialStore.isInitialized)

    const retryLoading = async (): Promise<void> => {
      await financialStore.loadTransactions()
    }

    onMounted(() => {
      // Используем initialize вместо loadTransactions для однократной загрузки
      financialStore.initialize()
    })

    return {
      totalBalance,
      income,
      expenses,
      loading,
      hasError,
      error,
      isInitialized,
      formatCurrency,
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
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
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

.error h4 {
  margin: 0 0 0.5rem 0;
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

.loading-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #007bff;
  color: white;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.balance-card small {
  font-size: 0.7rem;
  opacity: 0.7;
  display: block;
  margin-top: 0.5rem;
}
</style>
