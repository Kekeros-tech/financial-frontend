<!-- src/views/AccountsView.vue -->
<template>
  <div class="accounts-page">
    <div class="page-header">
      <h1 class="page-title">Мои счета</h1>
      <p class="page-subtitle">Управление всеми вашими счетами</p>
    </div>

    <div class="accounts-grid">
      <AccountCard
        v-for="account in accounts"
        :key="account.id"
        :name="account.name"
        :type="account.type"
        :balance="account.balance"
        :currency="account.currency"
        :status="account.status"
        :icon="account.icon"
      />

      <button class="add-account-btn">
        <AppIcon name="plus" :size="24" />
        <span>Добавить счёт</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFinancialData } from '@/composables/useFinancialData'
import AccountCard from '@/components/cards/AccountCard.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const { accounts } = useFinancialData()
</script>

<style scoped>
.accounts-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
}

.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.add-account-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  background: white;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
}

.add-account-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #dbeafe;
}
</style>
