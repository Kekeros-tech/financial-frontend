<!-- src/components/cards/CompactAccountCard.vue -->
<template>
  <div class="compact-account-card">
    <div class="compact-account-card__info">
      <div class="compact-account-card__icon" :class="iconClass">
        <AppIcon :name="iconName" :size="16" :color="iconColor" />
      </div>
      <div class="compact-account-card__content">
        <h4 class="compact-account-card__name">{{ name }}</h4>
        <p class="compact-account-card__type">{{ typeLabel }}</p>
      </div>
    </div>
    <div class="compact-account-card__balance">{{ formattedBalance }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import type { AccountType, IconName } from '@/types'

interface Props {
  name: string
  type: AccountType
  balance: number
  currency?: string
  icon?: IconName
}

const props = withDefaults(defineProps<Props>(), {
  currency: '₽',
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

const iconClass = computed(() => `compact-account-card__icon--${props.type}`)

const typeLabel = computed(() => {
  const labels: Record<AccountType, string> = {
    checking: 'Расчётный',
    savings: 'Накопительный',
    credit: 'Кредитный',
    investment: 'Инвестиционный',
  }
  return labels[props.type]
})

const formattedBalance = computed(() => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: props.currency === '₽' ? 'RUB' : props.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(props.balance)
})
</script>

<style scoped>
.compact-account-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
  transition: all 0.2s;
}

.compact-account-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.compact-account-card__info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.compact-account-card__icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.compact-account-card__icon--checking {
  background: #dbeafe;
}

.compact-account-card__icon--savings {
  background: #dcfce7;
}

.compact-account-card__icon--credit {
  background: #fee2e2;
}

.compact-account-card__icon--investment {
  background: #ede9fe;
}

.compact-account-card__name {
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem;
}

.compact-account-card__type {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.compact-account-card__balance {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
}
</style>
