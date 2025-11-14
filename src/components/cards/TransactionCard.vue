<!-- src/components/cards/TransactionCard.vue -->
<template>
  <div class="transaction-card">
    <div class="transaction-card__info">
      <div class="transaction-card__icon" :class="iconClass">
        <AppIcon :name="iconName" :size="16" :color="iconColor" />
      </div>
      <div class="transaction-card__content">
        <p class="transaction-card__description">{{ description }}</p>
        <p class="transaction-card__meta">{{ category }} • {{ formattedDate }}</p>
      </div>
    </div>
    <p class="transaction-card__amount" :class="amountClass">
      {{ formattedAmount }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import type { TransactionType, IconName } from '@/types'

type TransactionCategory = 'income' | 'expense' | 'transfer'

interface Props {
  description: string
  category: string
  amount: number
  date: string
  type?: TransactionCategory
}

const props = withDefaults(defineProps<Props>(), {
  type: 'expense',
})

const iconName = computed(() => {
  const icons: Record<TransactionCategory, IconName> = {
    income: 'trending-up',
    expense: 'trending-down',
    transfer: 'arrow-right-left',
  }
  return icons[props.type]
})

const iconColor = computed(() => {
  const colors: Record<TransactionType, string> = {
    income: '#10b981',
    expense: '#ef4444',
    transfer: '#6b7280',
  }
  return colors[props.type]
})

const iconClass = computed(() => `transaction-card__icon--${props.type}`)

const amountClass = computed(() => `transaction-card__amount--${props.type}`)

const formattedAmount = computed(() => {
  const sign = props.type === 'income' ? '+' : props.type === 'transfer' ? '' : '-'
  const absAmount = Math.abs(props.amount).toLocaleString('ru-RU')
  return `${sign}${absAmount} ₽`
})

const formattedDate = computed(() => {
  return new Date(props.date).toLocaleDateString('ru-RU')
})
</script>

<style scoped>
.transaction-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
  transition: all 0.2s;
}

.transaction-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.transaction-card__info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.transaction-card__icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.transaction-card__icon--income {
  background: #dcfce7;
}

.transaction-card__icon--expense {
  background: #fee2e2;
}

.transaction-card__icon--transfer {
  background: #e0e7ff;
}

.transaction-card__description {
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem;
}

.transaction-card__meta {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.transaction-card__amount {
  font-weight: 600;
  font-size: 1.125rem;
}

.transaction-card__amount--income {
  color: #10b981;
}

.transaction-card__amount--expense {
  color: #ef4444;
}

.transaction-card__amount--transfer {
  color: #6b7280;
}
</style>
