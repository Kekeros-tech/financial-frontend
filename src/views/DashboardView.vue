<!-- src/views/DashboardView.vue -->
<template>
  <div>
    <!-- Period Selector -->
    <div class="card card--overview mb-8">
      <div class="overview-header">
        <h2 class="overview-title">Financial Overview</h2>
        <PeriodSelector v-model:selected-period="selectedPeriod" />
      </div>
    </div>

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
    <div class="card card--budget-limits mb-8">
      <div class="section-header">
        <h2 class="section-title">Budget Limits</h2>
        <button class="btn-manage">Manage Budgets</button>
      </div>
      <div class="budget-limits-list">
        <div v-for="budget in budgetLimits" :key="budget.id" class="budget-limit-item">
          <div class="budget-limit-header">
            <div class="budget-limit-category">
              <component
                :is="isOverLimit(budget) ? AlertTriangle : Goal"
                class="budget-limit-icon"
                :class="isOverLimit(budget) ? 'text-red-500' : 'text-gray-500'"
              />
              <h3 class="budget-limit-name">{{ budget.category }}</h3>
            </div>
            <div class="budget-limit-amounts">
              <p
                :class="[
                  'budget-limit-spent',
                  isOverLimit(budget) ? 'text-red-600' : 'text-gray-800',
                ]"
              >
                {{ formatCurrency(budget.spent) }}
              </p>
              <p class="budget-limit-limit">of {{ formatCurrency(budget.limit) }}</p>
            </div>
          </div>
          <div class="budget-progress">
            <div class="progress-bg">
              <div
                class="progress-bar"
                :class="budget.color"
                :style="{ width: `${getPercentage(budget)}%` }"
              ></div>
              <div v-if="isOverLimit(budget)" class="progress-over-indicator">
                <AlertTriangle class="progress-over-icon" />
              </div>
            </div>
            <div class="progress-text">
              <span class="progress-percent">{{ Math.round(getPercentage(budget)) }}% used</span>
              <span v-if="isOverLimit(budget)" class="progress-over">Over limit!</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-grid">
      <div class="quick-action bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <h3 class="quick-action-title">Add New Transaction</h3>
        <p class="quick-action-desc">Record your income or expenses quickly</p>
        <button class="btn-quick-action text-blue-600">Add Transaction</button>
      </div>
      <div class="quick-action bg-gradient-to-r from-green-500 to-green-600 text-white">
        <h3 class="quick-action-title">Set Budget Goals</h3>
        <p class="quick-action-desc">Plan your monthly spending and savings</p>
        <button class="btn-quick-action text-green-600">Create Budget</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigationStore'
import { useFinancialData } from '@/composables/useFinancialData'
import { BudgetLimit } from '@/types'
import BudgetOverview from '@/components/layout/BudgetOverview.vue'
import RecentTransactions from '@/components/layout/RecentTransactions.vue'
import AccountsList from '@/components/layout/AccountsList.vue'
import { AlertTriangle, Goal } from 'lucide-vue-next'
import PeriodSelector from '@/components/ui/PeriodSelector.vue'

const navigationStore = useNavigationStore()

// Используем данные из composables
const {
  selectedPeriod,
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

const getPercentage = (budget: BudgetLimit) => {
  return Math.min((budget.spent / budget.limit) * 100, 100)
}

const isOverLimit = (budget: BudgetLimit) => {
  return budget.spent > budget.limit
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

.mb-8 {
  margin-bottom: 2rem;
}

/* ========== Заголовки и навигация ========== */
.overview-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .overview-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.overview-title {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700; /* font-bold */
  color: #1f2937; /* text-gray-800 */
  margin: 0;
}

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
.quick-actions-grid {
  display: grid;
  grid-template-columns: 1fr; /* grid-cols-1 */
  gap: 1.5rem; /* gap-6 */
  margin-top: 2rem; /* mt-8 */
}

@media (min-width: 768px) {
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr); /* md:grid-cols-2 */
  }
}

.quick-action {
  border-radius: 1rem; /* rounded-2xl */
  padding: 1.5rem; /* p-6 */
  color: white;
}

.quick-action-title {
  font-size: 1.25rem; /* text-xl */
  font-weight: 700; /* font-bold */
  margin: 0 0 0.5rem; /* mb-2 */
}

.quick-action-desc {
  color: rgba(255, 255, 255, 0.8); /* text-blue-100 или text-green-100 */
  margin: 0 0 1rem; /* mb-4 */
}

.btn-quick-action {
  padding: 0.5rem 1rem; /* px-4 py-2 */
  background: white;
  color: #2563eb; /* text-blue-600 */
  border: none;
  border-radius: 0.5rem; /* rounded-lg */
  font-weight: 500; /* font-medium */
  cursor: pointer;
  transition: background 0.2s ease; /* transition-colors */
}

.btn-quick-action:hover {
  background: #dbeafe; /* hover:bg-blue-50 */
}

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
