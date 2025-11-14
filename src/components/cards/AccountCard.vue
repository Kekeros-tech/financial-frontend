<!-- src/components/cards/AccountCard.vue -->
<template>
  <div class="account-card">
    <div class="account-card__header">
      <div class="account-card__icon" :class="iconClass">
        <AppIcon :name="iconName" :size="20" :color="iconColor" />
      </div>
      <div v-if="status" class="account-card__status" :class="statusClass">
        {{ statusLabel }}
      </div>
    </div>
    <div class="account-card__body">
      <h4 class="account-card__name">{{ name }}</h4>
      <p class="account-card__type">{{ typeLabel }}</p>
    </div>
    <div class="account-card__footer">
      <span class="account-card__balance">{{ formattedBalance }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import type { AccountType, AccountStatus, IconName } from '@/types'

interface Props {
  name: string
  type: AccountType
  balance: number
  currency?: string
  status?: AccountStatus
  icon?: IconName
}

const props = withDefaults(defineProps<Props>(), {
  currency: '₽',
  status: 'active',
})

const iconName = computed(() => {
  if (props.icon) return props.icon

  const icons: Record<AccountType, IconName> = {
    checking: 'wallet',
    savings: 'piggy-bank',
    credit: 'credit-card',
    investment: 'trending-up',
  }
  return icons[props.type]
})

const iconColor = computed(() => {
  const colors: Record<AccountType, string> = {
    checking: '#3b82f6',
    savings: '#10b981',
    credit: '#ef4444',
    investment: '#8b5cf6',
  }
  return colors[props.type]
})

const iconClass = computed(() => `account-card__icon--${props.type}`)

const typeLabel = computed(() => {
  const labels: Record<AccountType, string> = {
    checking: 'Расчётный',
    savings: 'Накопительный',
    credit: 'Кредитный',
    investment: 'Инвестиционный',
  }
  return labels[props.type]
})

const statusLabel = computed(() => {
  const labels: Record<AccountStatus, string> = {
    active: 'Активен',
    frozen: 'Заморожен',
    closed: 'Закрыт',
  }
  return labels[props.status!]
})

const statusClass = computed(() => `account-card__status--${props.status}`)

const formattedBalance = computed(() => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: props.currency === '₽' ? 'RUB' : props.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(props.balance)
})
</script>

<style scoped>
.account-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  transition: all 0.2s;
}

.account-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.account-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.account-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.account-card__icon--checking {
  background: #dbeafe;
}

.account-card__icon--savings {
  background: #dcfce7;
}

.account-card__icon--credit {
  background: #fee2e2;
}

.account-card__icon--investment {
  background: #ede9fe;
}

.account-card__status {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.account-card__status--active {
  background: #dcfce7;
  color: #16a34a;
}

.account-card__status--frozen {
  background: #fef3c7;
  color: #d97706;
}

.account-card__status--closed {
  background: #f3f4f6;
  color: #6b7280;
}

.account-card__body {
  margin-bottom: 1rem;
}

.account-card__name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem;
}

.account-card__type {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.account-card__footer {
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
}

.account-card__balance {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}
</style>
