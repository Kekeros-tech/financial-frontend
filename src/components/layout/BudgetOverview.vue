<!-- src/components/dashboard/BudgetOverview.vue -->
<script setup lang="ts">
import SummaryCard from '../cards/SummaryCard.vue'
import IconButton from '../ui/IconButton.vue'

interface Props {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
}

defineProps<Props>()
</script>

<template>
  <div class="budget-overview-card">
    <div class="card-header">
      <h3 class="card-title">Budget Overview</h3>
      <IconButton icon="bar-chart-3" variant="filled" title="Аналитика" />
    </div>
    <div class="budget-overview">
      <SummaryCard
        title="Total Balance"
        :value="totalBalance.toLocaleString('ru-RU') + ' ₽'"
        icon="wallet"
        color="blue"
      />
      <SummaryCard
        title="Income"
        :value="totalIncome.toLocaleString('ru-RU') + ' ₽'"
        icon="trending-up"
        color="green"
      />
      <SummaryCard
        title="Expenses"
        :value="totalExpenses.toLocaleString('ru-RU') + ' ₽'"
        icon="trending-down"
        color="red"
      />
    </div>
  </div>
</template>

<style scoped>
.budget-overview-card {
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
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.analytics-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.analytics-btn:hover {
  background: #dbeafe;
}

.budget-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}
</style>
