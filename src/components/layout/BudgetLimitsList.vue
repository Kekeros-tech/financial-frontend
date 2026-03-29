<!-- src/components/layout/BudgetLimitsList.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import type { BudgetLimit } from '@/types'
import IconButton from '../ui/IconButton.vue'
import BudgetLimitCard from '../cards/BudgetLimitCard.vue'

interface Props {
  budgets: BudgetLimit[]
  title?: string
  formatCurrency?: (amount: number) => string
}

defineProps<Props>()

const emit = defineEmits<{
  showAll: []
}>()

const isExpanded = ref(true)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const handleShowAll = () => {
  emit('showAll')
}
</script>

<template>
  <div class="budget-limits-card">
    <div class="card-header" :class="{ 'card-header--collapsed': !isExpanded }">
      <h3 class="card-title">{{ title || 'Budget Limits' }}</h3>
      <div class="card-actions">
        <IconButton icon="arrow-right" variant="ghost" title="Все бюджеты" @click="handleShowAll" />
        <IconButton
          :icon="isExpanded ? 'eye-off' : 'eye'"
          variant="filled"
          :title="isExpanded ? 'Скрыть бюджеты' : 'Показать бюджеты'"
          @click="toggleExpand"
        />
      </div>
    </div>
    <div v-if="isExpanded" class="budget-limits-list">
      <BudgetLimitCard
        v-for="budget in budgets"
        :key="budget.id"
        :category="budget.category"
        :limit="budget.limit"
        :spent="budget.spent"
        :color="budget.color"
        :format-currency="formatCurrency"
      />

      <div v-if="budgets.length === 0" class="no-budgets">Нет лимитов за выбранный период</div>
    </div>
  </div>
</template>

<style scoped>
.budget-limits-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  transition: margin-bottom 0.3s;
}

.card-header--collapsed {
  margin-bottom: 0;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.budget-limits-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.no-budgets {
  text-align: center;
  color: #64748b;
  padding: 2rem 1rem;
}
</style>
