<!-- src/components/cards/BudgetLimitCard.vue -->
<template>
  <div class="budget-limit-card">
    <div class="budget-limit-card__header">
      <div class="budget-limit-card__category">
        <AppIcon :name="iconName" :size="16" :color="iconColor" />
        <h4 class="budget-limit-card__name">{{ category }}</h4>
      </div>
      <div class="budget-limit-card__amounts">
        <p class="budget-limit-card__spent" :class="{ 'budget-limit-card__spent--over': isOver }">
          {{ formatCurrency(spent) }}
          <span class="budget-limit-card__limit">of {{ formatCurrency(limit) }}</span>
        </p>
        <p v-if="!isOver" class="budget-limit-card__percent">{{ percentage }}% used</p>
        <p v-else class="budget-limit-card__percent budget-limit-card__percent--over">
          Over limit!
        </p>
      </div>
    </div>
    <div class="budget-limit-card__progress">
      <div class="budget-limit-card__progress-bg">
        <div
          class="budget-limit-card__progress-bar"
          :class="colorClass"
          :style="{ width: `${percentage}%` }"
        ></div>
        <div v-if="isOver" class="budget-limit-card__progress-over">
          <AppIcon name="alert-triangle" :size="14" color="#dc2626" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '../ui/AppIcon.vue'

interface Props {
  category: string
  limit: number
  spent: number
  color: string
  formatCurrency?: (amount: number) => string
}

const props = withDefaults(defineProps<Props>(), {
  formatCurrency: (amount: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount),
})

const isOver = computed(() => props.spent > props.limit)

const percentage = computed(() => {
  return Math.min(Math.round((props.spent / props.limit) * 100), 100)
})

const iconName = computed(() => (isOver.value ? 'alert-triangle' : 'goal'))

const iconColor = computed(() => (isOver.value ? '#dc2626' : '#6b7280'))

const colorClass = computed(() => props.color)
</script>

<style scoped>
.budget-limit-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  transition: box-shadow 0.2s;
}

.budget-limit-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.budget-limit-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.budget-limit-card__category {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.budget-limit-card__name {
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.budget-limit-card__amounts {
  text-align: right;
}

.budget-limit-card__spent {
  font-weight: 700;
  margin: 0;
  color: #1f2937;
}

.budget-limit-card__spent--over {
  color: #dc2626;
}

.budget-limit-card__limit {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 400;
}

.budget-limit-card__percent {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.25rem 0 0;
}

.budget-limit-card__percent--over {
  color: #dc2626;
  font-weight: 500;
}

.budget-limit-card__progress {
  position: relative;
}

.budget-limit-card__progress-bg {
  width: 100%;
  background-color: #e5e7eb;
  border-radius: 0.75rem;
  height: 0.75rem;
  overflow: hidden;
  position: relative;
}

.budget-limit-card__progress-bar {
  height: 100%;
  border-radius: 0.75rem;
  transition: width 0.5s ease;
}

/* Цвета прогресс-баров */
.budget-limit-card__progress-bar.bg-green-500 {
  background-color: #22c55e;
}

.budget-limit-card__progress-bar.bg-blue-500 {
  background-color: #3b82f6;
}

.budget-limit-card__progress-bar.bg-red-500 {
  background-color: #ef4444;
}

.budget-limit-card__progress-bar.bg-purple-500 {
  background-color: #8b5cf6;
}

.budget-limit-card__progress-bar.bg-yellow-500 {
  background-color: #eab308;
}

.budget-limit-card__progress-over {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}
</style>
