<template>
  <div class="transaction-list-full">
    <div v-if="loading && !isInitialized" class="loading-state">
      <div class="spinner-large"></div>
      <p>Загрузка истории операций...</p>
    </div>

    <div v-else-if="hasError" class="error-state">
      <div class="error-icon">⚠</div>
      <h3>Ошибка загрузки</h3>
      <p>{{ error }}</p>
      <button @click="$emit('refresh')" class="retry-btn-large">Повторить попытку</button>
    </div>

    <div v-else-if="transactions.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>Операций не найдено</h3>
      <p>Попробуйте изменить параметры фильтрации</p>
      <router-link to="/" class="add-transaction-link"> Добавить первую операцию </router-link>
    </div>

    <div v-else class="transactions-container">
      <div class="transactions-header">
        <div class="header-cell category">Категория</div>
        <div class="header-cell description">Описание</div>
        <div class="header-cell amount">Сумма</div>
        <div class="header-cell date">Дата</div>
        <div class="header-cell actions">Действия</div>
      </div>

      <div class="transactions-list">
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          :class="['transaction-row', transaction.type]"
        >
          <div class="row-cell category">
            <span class="category-badge">{{ transaction.category }}</span>
          </div>
          <div class="row-cell description">
            {{ transaction.description || '—' }}
          </div>
          <div class="row-cell amount">
            <span class="amount-value" :class="transaction.type">
              {{ transaction.type === 'income' ? '+' : '-' }}
              {{ formatCurrency(transaction.amount) }}
            </span>
          </div>
          <div class="row-cell date">
            {{ formatDate(transaction.date) }}
          </div>
          <div class="row-cell actions">
            <button
              @click="deleteTransaction(transaction.id!)"
              class="action-btn delete-btn"
              title="Удалить"
              :disabled="loading"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading && isInitialized" class="loading-bottom">
      <div class="spinner-small"></div>
      Обновление данных...
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useFinancialStore } from '@/stores/financialStore'

export default defineComponent({
  name: 'TransactionListFull',

  props: {
    transactions: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
  },

  emits: ['refresh'],

  setup(props, { emit }) {
    const financialStore = useFinancialStore()

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

    const deleteTransaction = async (id: number): Promise<void> => {
      if (confirm('Вы уверены, что хотите удалить эту операцию?')) {
        try {
          await financialStore.deleteTransaction(id)
          emit('refresh')
        } catch (error) {
          console.error('Error deleting transaction:', error)
        }
      }
    }

    return {
      isInitialized,
      formatCurrency,
      formatDate,
      deleteTransaction,
    }
  },
})
</script>

<style scoped>
.transaction-list-full {
  min-height: 400px;
}

/* Состояния загрузки и ошибок */
.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.spinner-large {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-icon,
.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h3,
.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;
}

.error-state p,
.empty-state p {
  margin: 0 0 1.5rem 0;
  color: #6b7280;
  max-width: 400px;
}

.retry-btn-large {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn-large:hover {
  background: #5a6fd8;
}

.add-transaction-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border: 2px solid #667eea;
  border-radius: 8px;
  transition: all 0.2s;
}

.add-transaction-link:hover {
  background: #667eea;
  color: white;
}

/* Таблица операций */
.transactions-container {
  overflow-x: auto;
}

.transactions-header {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.transactions-list {
  max-height: 600px;
  overflow-y: auto;
}

.transaction-row {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
  align-items: center;
}

.transaction-row:hover {
  background: #f9fafb;
}

.transaction-row.income {
  border-left: 4px solid #10b981;
}

.transaction-row.expense {
  border-left: 4px solid #ef4444;
}

.row-cell {
  display: flex;
  align-items: center;
}

.category-badge {
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.description {
  color: #6b7280;
  font-size: 0.9rem;
}

.amount-value {
  font-weight: 600;
  font-size: 0.95rem;
}

.amount-value.income {
  color: #10b981;
}

.amount-value.expense {
  color: #ef4444;
}

.date {
  color: #9ca3af;
  font-size: 0.875rem;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  font-size: 1rem;
}

.delete-btn:hover:not(:disabled) {
  background: #fef2f2;
  color: #dc2626;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8fafc;
  color: #6b7280;
  font-size: 0.875rem;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
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

/* Адаптивность */
@media (max-width: 768px) {
  .transactions-header {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'category amount'
      'description description'
      'date actions';
    gap: 0.5rem;
  }

  .header-cell.category {
    grid-area: category;
  }
  .header-cell.amount {
    grid-area: amount;
  }
  .header-cell.description {
    grid-area: description;
  }
  .header-cell.date {
    grid-area: date;
  }
  .header-cell.actions {
    grid-area: actions;
  }

  .transaction-row {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'category amount'
      'description description'
      'date actions';
    gap: 0.5rem;
    padding: 1rem;
  }

  .row-cell.category {
    grid-area: category;
  }
  .row-cell.amount {
    grid-area: amount;
  }
  .row-cell.description {
    grid-area: description;
  }
  .row-cell.date {
    grid-area: date;
  }
  .row-cell.actions {
    grid-area: actions;
  }

  .transactions-header,
  .transaction-row {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
