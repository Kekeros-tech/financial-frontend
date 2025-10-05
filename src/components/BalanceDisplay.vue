<template>
  <div class="balance-display">
    <!-- Загрузка -->
    <div v-if="loading && !isInitialized" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Загрузка финансовых данных...</p>
    </div>

    <!-- Ошибка -->
    <div v-else-if="hasError" class="error-state">
      <div class="error-icon">⚠️</div>
      <div class="error-content">
        <h4>Ошибка загрузки</h4>
        <p>{{ error }}</p>
      </div>
      <button @click="retryLoading" class="retry-btn">
        <span class="retry-icon">↻</span>
        Попробовать снова
      </button>
    </div>

    <!-- Основной контент -->
    <div v-else class="balance-cards">
      <!-- Общий баланс -->
      <div class="balance-card total-balance" :class="balanceCardClass">
        <div class="card-header">
          <div class="card-icon">💰</div>
          <div class="card-info">
            <h3 class="card-title">Общий баланс</h3>
            <p class="card-subtitle">Ваш текущий баланс</p>
          </div>
        </div>

        <div class="card-content">
          <p class="balance-amount" :class="amountClass">
            {{ formatCurrency(totalBalance) }}
          </p>
          <div class="balance-trend" v-if="trend !== 0">
            <span class="trend-icon" :class="trend > 0 ? 'trend-up' : 'trend-down'">
              {{ trend > 0 ? '↗' : '↘' }}
            </span>
            <span class="trend-text" :class="trend > 0 ? 'trend-up' : 'trend-down'">
              {{ Math.abs(trend) }}% за месяц
            </span>
          </div>
        </div>

        <div class="card-footer">
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Операций</span>
              <span class="stat-value">{{ transactionsCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Активно</span>
              <span class="stat-value">{{ activeDays }} дн.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Доходы -->
      <div class="balance-card income-card">
        <div class="card-header">
          <div class="card-icon income-icon">📈</div>
          <div class="card-info">
            <h3 class="card-title">Доходы</h3>
            <p class="card-subtitle">Все поступления</p>
          </div>
        </div>

        <div class="card-content">
          <p class="balance-amount positive">+{{ formatCurrency(income) }}</p>
          <div class="progress-container">
            <div class="progress-bar">
              <div
                class="progress-fill income-fill"
                :style="{ width: incomePercentage + '%' }"
              ></div>
            </div>
            <span class="progress-text">{{ Math.round(incomePercentage) }}% от общего оборота</span>
          </div>
        </div>

        <div class="card-footer">
          <div class="income-stats">
            <div class="income-stat">
              <span class="stat-icon">🔄</span>
              <span class="stat-text">{{ incomeTransactions }} операций</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Расходы -->
      <div class="balance-card expense-card">
        <div class="card-header">
          <div class="card-icon expense-icon">📉</div>
          <div class="card-info">
            <h3 class="card-title">Расходы</h3>
            <p class="card-subtitle">Все траты</p>
          </div>
        </div>

        <div class="card-content">
          <p class="balance-amount negative">-{{ formatCurrency(expenses) }}</p>
          <div class="progress-container">
            <div class="progress-bar">
              <div
                class="progress-fill expense-fill"
                :style="{ width: expensePercentage + '%' }"
              ></div>
            </div>
            <span class="progress-text"
              >{{ Math.round(expensePercentage) }}% от общего оборота</span
            >
          </div>
        </div>

        <div class="card-footer">
          <div class="expense-stats">
            <div class="expense-stat">
              <span class="stat-icon">🔄</span>
              <span class="stat-text">{{ expenseTransactions }} операций</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Индикатор фоновой загрузки -->
    <div v-if="loading && isInitialized" class="loading-indicator">
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      Обновление данных...
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useFinancialStore } from '@/stores/financialStore'

export default defineComponent({
  name: 'BalanceDisplay',

  setup() {
    const financialStore = useFinancialStore()

    // Основные данные
    const totalBalance = computed(() => financialStore.totalBalance)
    const income = computed(() => financialStore.income)
    const expenses = computed(() => financialStore.expenses)
    const transactionsCount = computed(() => financialStore.transactionsCount)

    // Состояние
    const loading = computed(() => financialStore.isLoading)
    const hasError = computed(() => financialStore.hasError)
    const error = computed(() => financialStore.error)
    const isInitialized = computed(() => financialStore.isInitialized)

    // Дополнительные вычисляемые данные
    const incomePercentage = computed(() => {
      const total = income.value + expenses.value
      return total > 0 ? (income.value / total) * 100 : 0
    })

    const expensePercentage = computed(() => {
      const total = income.value + expenses.value
      return total > 0 ? (expenses.value / total) * 100 : 0
    })

    // Временные данные для демонстрации (в реальном приложении брать из API)
    const trend = computed(() => {
      // Простая логика для демонстрации
      return totalBalance.value > 5000 ? 12.5 : totalBalance.value > 0 ? 5.2 : -8.7
    })

    const activeDays = computed(() => {
      // В реальном приложении вычислять на основе дат транзакций
      return Math.min(transactionsCount.value * 2, 30)
    })

    const incomeTransactions = computed(() => {
      const transactions = financialStore.transactions || []
      return transactions.filter((t) => t.type === 'income').length
    })

    const expenseTransactions = computed(() => {
      const transactions = financialStore.transactions || []
      return transactions.filter((t) => t.type === 'expense').length
    })

    const monthlyForecast = computed(() => {
      // Простой прогноз на основе текущих данных
      const daysInMonth = 30
      const dailyIncome = income.value / activeDays.value
      const dailyExpense = expenses.value / activeDays.value
      return totalBalance.value + (dailyIncome - dailyExpense) * (daysInMonth - activeDays.value)
    })

    const forecastTrend = computed(() => {
      return monthlyForecast.value - totalBalance.value
    })

    // Классы для стилизации
    const amountClass = computed(() => ({
      positive: totalBalance.value >= 0,
      negative: totalBalance.value < 0,
    }))

    const balanceCardClass = computed(() => ({
      'positive-balance': totalBalance.value >= 0,
      'negative-balance': totalBalance.value < 0,
    }))

    const forecastAmountClass = computed(() => ({
      positive: monthlyForecast.value >= totalBalance.value,
      negative: monthlyForecast.value < totalBalance.value,
    }))

    const forecastTrendClass = computed(() => ({
      positive: forecastTrend.value > 0,
      negative: forecastTrend.value < 0,
      neutral: forecastTrend.value === 0,
    }))

    const forecastText = computed(() => {
      if (forecastTrend.value > 0) return `+${formatCurrency(forecastTrend.value)}`
      if (forecastTrend.value < 0) return `${formatCurrency(forecastTrend.value)}`
      return 'Без изменений'
    })

    // Методы
    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
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
      // Данные
      totalBalance,
      income,
      expenses,
      transactionsCount,
      incomePercentage,
      expensePercentage,
      monthlyForecast,
      forecastTrend,
      forecastText,
      trend,
      activeDays,
      incomeTransactions,
      expenseTransactions,

      // Состояние
      loading,
      hasError,
      error,
      isInitialized,

      // Классы
      amountClass,
      balanceCardClass,
      forecastAmountClass,
      forecastTrendClass,

      // Методы
      formatCurrency,
      retryLoading,
    }
  },
})
</script>

<style scoped>
.balance-display {
  position: relative;
}

/* Состояния загрузки и ошибок */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  border: 1px solid #fecaca;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-content {
  margin-bottom: 1.5rem;
}

.error-content h4 {
  margin: 0 0 0.5rem 0;
  color: #dc2626;
  font-size: 1.25rem;
}

.error-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.retry-icon {
  transition: transform 0.3s ease;
}

.retry-btn:hover .retry-icon {
  transform: rotate(180deg);
}

/* Основные карточки */
.balance-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.balance-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.balance-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.balance-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.total-balance.positive-balance::before {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.total-balance.negative-balance::before {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.income-card::before {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.expense-card::before {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.forecast-card::before {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

/* Заголовок карточки */
.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.income-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.expense-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.forecast-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.card-info {
  flex: 1;
}

.card-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.card-subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

/* Контент карточки */
.card-content {
  margin-bottom: 1.5rem;
}

.balance-amount {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1;
}

.balance-amount.positive {
  color: #10b981;
}

.balance-amount.negative {
  color: #ef4444;
}

/* Тренд и прогресс */
.balance-trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.trend-icon {
  font-size: 1.2rem;
}

.trend-icon.trend-up {
  color: #10b981;
}

.trend-icon.trend-down {
  color: #ef4444;
}

.trend-text {
  font-size: 0.85rem;
  font-weight: 500;
}

.trend-text.trend-up {
  color: #10b981;
}

.trend-text.trend-down {
  color: #ef4444;
}

.progress-container {
  margin-top: 1rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.income-fill {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.expense-fill {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.progress-text {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Прогноз */
.forecast-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
}

.forecast-indicator.positive {
  background: #d1fae5;
  color: #065f46;
}

.forecast-indicator.negative {
  background: #fee2e2;
  color: #991b1b;
}

.forecast-indicator.neutral {
  background: #f3f4f6;
  color: #374151;
}

/* Футер карточки */
.card-footer {
  border-top: 1px solid #f3f4f6;
  padding-top: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.income-stats,
.expense-stats,
.forecast-details {
  display: flex;
  justify-content: center;
}

.income-stat,
.expense-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.forecast-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.forecast-label {
  font-size: 0.85rem;
  color: #6b7280;
}

.forecast-value {
  font-size: 0.85rem;
  font-weight: 600;
}

.forecast-value.positive {
  color: #10b981;
}

.forecast-value.negative {
  color: #ef4444;
}

.forecast-value.neutral {
  color: #6b7280;
}

/* Индикатор загрузки */
.loading-indicator {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  font-size: 0.9rem;
  color: #6b7280;
  z-index: 1000;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #667eea;
  animation: bounce 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}
.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

/* Анимации */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Адаптивность */
@media (max-width: 1200px) {
  .balance-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .balance-cards {
    grid-template-columns: 1fr;
  }

  .balance-amount {
    font-size: 1.75rem;
  }

  .card-header {
    gap: 0.75rem;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .balance-card {
    padding: 1.25rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .balance-amount {
    font-size: 1.5rem;
  }
}
</style>
