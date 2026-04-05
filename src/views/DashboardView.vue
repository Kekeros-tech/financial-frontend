<!-- src/views/DashboardView.vue -->
<template>
  <div>
    <!-- Period Selector -->
    <PeriodSelector v-model:current-month="currentMonth" />

    <!-- Budget Overview Section -->
    <BudgetOverview :total-balance="balance" :total-income="income" :total-expenses="expenses" />

    <AccountsList
      :accounts="accounts"
      title="My accounts"
      compact
      @show-all="setActivePage('accounts')"
    />
    <RecentTransactions
      :transactions="transactions"
      title="Recent Transactions"
      :max-items="5"
      @show-all="setActivePage('operations')"
    />

    <!-- Budget Limits Section -->
    <BudgetLimitsList
      :budgets="budgetLimits"
      title="Budget Limits"
      :format-currency="formatCurrency"
      @show-all="setActivePage('budgets')"
    />

    <!-- Quick Actions -->
    <QuickActionsList
      :actions="[
        {
          title: 'Add New Transaction',
          description: 'Record your income or expenses quickly',
          buttonText: 'Add Transaction',
          color: 'blue',
        },
        {
          title: 'Set Budget Goals',
          description: 'Plan your monthly spending and savings',
          buttonText: 'Create Budget',
          color: 'green',
        },
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigationStore'
import { useFinancialData } from '@/composables/useFinancialData'
import BudgetOverview from '@/components/layout/BudgetOverview.vue'
import RecentTransactions from '@/components/layout/RecentTransactions.vue'
import AccountsList from '@/components/layout/AccountsList.vue'
import BudgetLimitsList from '@/components/layout/BudgetLimitsList.vue'
import QuickActionsList from '@/components/layout/QuickActionsList.vue'
import PeriodSelector from '@/components/layout/PeriodSelector.vue'

const navigationStore = useNavigationStore()

// Используем данные из composables
const {
  currentMonth,
  balance,
  income,
  expenses,
  transactions,
  accounts,
  budgetLimits,
  formatCurrency,
} = useFinancialData()

const setActivePage = (pageId: string) => {
  navigationStore.setActivePage(pageId)
}
</script>

<style scoped>
/* ========== Общие стили карточек ========== */
.card {
  background: white;
  border-radius: 1rem; /* rounded-2xl */
  padding: 1.5rem; /* p-6 */
  border: 1px solid #e5e7eb; /* border-gray-100 */
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
}

/* ========== Заголовки и навигация ========== */

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem; /* mb-6 */
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.25rem;
}

/* ========== Кнопки ========== */
.btn-analytics,
.btn-view-all,
.btn-manage {
  padding: 0.5rem 1rem; /* px-4 py-2 */
  background: #2563eb; /* bg-blue-600 */
  color: white;
  border: none;
  border-radius: 0.5rem; /* rounded-lg */
  cursor: pointer;
  font-weight: 500; /* font-medium */
  transition: background 0.2s ease; /* transition-colors */
}

.btn-analytics:hover,
.btn-view-all:hover,
.btn-manage:hover {
  background: #1d4ed8; /* hover:bg-blue-700 */
}

.btn-analytics {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* space-x-2 */
}

.btn-icon {
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
}

/* ========== Сетка баланса ========== */
.balance-grid {
  display: grid;
  grid-template-columns: 1fr; /* grid-cols-1 */
  gap: 1.5rem; /* gap-6 */
}

@media (min-width: 768px) {
  .balance-grid {
    grid-template-columns: repeat(3, 1fr); /* md:grid-cols-3 */
  }
}

.balance-card {
  border-radius: 0.75rem; /* rounded-xl */
  padding: 1.5rem; /* p-6 */
  transition: box-shadow 0.2s ease; /* transition-shadow */
}

.balance-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* hover:shadow-md */
}

.balance-card-header {
  margin-bottom: 1rem; /* mb-4 */
}

.balance-card-icon-container {
  display: flex;
  align-items: center;
  gap: 0.75rem; /* space-x-3 */
}

.balance-card-icon-bg {
  padding: 0.75rem; /* p-3 */
  border-radius: 0.75rem; /* rounded-xl */
}

.balance-card-icon {
  width: 1.5rem; /* w-6 */
  height: 1.5rem; /* h-6 */
}

.balance-card-label {
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  margin: 0 0 0.25rem; /* mb-1 */
}

.balance-card-value {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700; /* font-bold */
  color: #1f2937; /* text-gray-800 */
  margin: 0;
}

.balance-card-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* space-x-2 */
  font-size: 0.875rem; /* text-sm */
}

.trend-icon {
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
}

.trend-value {
  font-weight: 500; /* font-medium */
}

.trend-label {
  color: #6b7280; /* text-gray-500 */
}

/* ========== Список транзакций ========== */
.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
}

.transaction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem; /* p-4 */
  border-radius: 0.75rem; /* rounded-xl */
  border: 1px solid #e5e7eb; /* border border-gray-100 */
  transition: background 0.2s ease; /* transition-colors */
}

.transaction-item:hover {
  background: #f9fafb; /* hover:bg-gray-50 */
}

.transaction-left {
  display: flex;
  align-items: center;
  gap: 1rem; /* space-x-4 */
}

.transaction-icon {
  padding: 0.75rem; /* p-3 */
  border-radius: 0.75rem; /* rounded-xl */
}

.transaction-icon-svg {
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
}

.transaction-desc {
  font-weight: 500; /* font-medium */
  color: #1f2937; /* text-gray-800 */
  margin: 0 0 0.25rem; /* mb-1 */
}

.transaction-meta {
  display: flex;
  gap: 0.5rem; /* space-x-2 */
  font-size: 0.875rem; /* text-sm */
  color: #6b7280; /* text-gray-500 */
}

.transaction-cat {
  color: #6b7280; /* text-gray-500 */
}

.transaction-dot {
  color: #9ca3af; /* text-gray-400 */
}

.transaction-date {
  color: #6b7280; /* text-gray-500 */
}

.transaction-right {
  text-align: right;
}

.transaction-amount {
  font-weight: 700; /* font-bold */
  font-size: 1.125rem; /* text-lg */
}

.text-green-600 {
  color: #16a34a;
}

.text-red-600 {
  color: #dc2626;
}

/* ========== Список бюджетов ========== */
.budget-limits-list {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
}

.budget-limit-item {
  border: 1px solid #e5e7eb; /* border border-gray-200 */
  border-radius: 0.75rem; /* rounded-xl */
  padding: 1rem; /* p-4 */
  transition: box-shadow 0.2s ease; /* transition-shadow */
}

.budget-limit-item:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); /* hover:shadow-md */
}

.budget-limit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem; /* mb-3 */
}

.budget-limit-category {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* space-x-2 */
}

.budget-limit-icon {
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
}

.budget-limit-name {
  font-weight: 600; /* font-semibold */
  color: #1f2937; /* text-gray-800 */
  margin: 0;
}

.budget-limit-amounts {
  text-align: right;
}

.budget-limit-spent {
  font-weight: 700; /* font-bold */
  margin: 0 0 0.25rem; /* mb-1 */
}

.budget-limit-limit {
  font-size: 0.875rem; /* text-sm */
  color: #6b7280; /* text-gray-500 */
  margin: 0;
}

.budget-progress {
  position: relative;
}

.progress-bg {
  width: 100%;
  background-color: #e5e7eb; /* bg-gray-200 */
  border-radius: 0.75rem; /* rounded-full */
  height: 0.75rem; /* h-3 */
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  border-radius: 0.75rem; /* rounded-full */
  transition: width 0.5s ease; /* transition-all */
}

.progress-over-indicator {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}

.progress-over-icon {
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
  color: #dc2626; /* text-red-500 */
}

.progress-text {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem; /* mt-2 */
  font-size: 0.875rem; /* text-sm */
  color: #6b7280; /* text-gray-500 */
}

.progress-over {
  color: #dc2626; /* text-red-600 */
  font-weight: 500; /* font-medium */
}

/* ========== Блок быстрых действий ========== */

/* ========== Цвета ========== */
.text-blue-700 {
  color: #1d4ed8;
}
.text-green-700 {
  color: #15803d;
}
.text-red-700 {
  color: #b91c1c;
}
.text-gray-800 {
  color: #1f2937;
}
.text-gray-600 {
  color: #4b5563;
}
.text-gray-500 {
  color: #6b7280;
}
.text-gray-400 {
  color: #9ca3af;
}

.bg-green-500 {
  background-color: #22c55e;
}
.bg-blue-500 {
  background-color: #3b82f6;
}
.bg-red-500 {
  background-color: #ef4444;
}
.bg-purple-500 {
  background-color: #a855f7;
}
.bg-yellow-500 {
  background-color: #eab308;
}

.bg-gradient-to-br {
  background: linear-gradient(to bottom right, var(--from), var(--to));
}
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--from), var(--to));
}
</style>
