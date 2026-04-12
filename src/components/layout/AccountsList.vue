<!-- src/components/layout/AccountsList.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import type { Account } from '@/types'
import IconButton from '../ui/IconButton.vue'
import AccountCard from '../cards/AccountCard.vue'
import CompactAccountCard from '../cards/CompactAccountCard.vue'

interface Props {
  accounts: Account[]
  title?: string
  collapsed?: boolean
  compact?: boolean
  loading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  compact: false,
  loading: false,
  error: null,
})

const emit = defineEmits<{
  showAll: []
}>()

const isExpanded = ref(!props.collapsed)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const handleShowAll = () => {
  emit('showAll')
}
</script>

<template>
  <div class="accounts-list-card">
    <!-- Заголовок с кнопками -->
    <div class="card-header" :class="{ 'card-header--collapsed': !isExpanded }">
      <h3 class="card-title">
        {{ title || 'Мои счета' }}
      </h3>
      <div class="card-actions">
        <!-- Кнопка "Все счета" -->
        <IconButton icon="arrow-right" variant="ghost" title="Все счета" @click="handleShowAll" />
        <!-- Кнопка показать/скрыть -->
        <IconButton
          :icon="isExpanded ? 'eye-off' : 'eye'"
          variant="filled"
          :title="isExpanded ? 'Скрыть счета' : 'Показать все счета'"
          @click="toggleExpand"
        />
      </div>
    </div>

    <!-- Список счетов -->
    <div v-if="isExpanded" :class="['accounts-list', { 'accounts-list--compact': compact }]">
      <!-- Состояние загрузки -->
      <div v-if="loading" class="accounts-loading">
        <div class="spinner"></div>
        <span>Загрузка счетов...</span>
      </div>

      <!-- Состояние ошибки -->
      <div v-else-if="error" class="accounts-error">
        <p>Ошибка загрузки счетов</p>
        <p class="accounts-error__message">{{ error }}</p>
      </div>

      <!-- Список счетов -->
      <template v-else>
        <template v-if="compact">
          <CompactAccountCard
            v-for="account in accounts"
            :key="account.id"
            :name="account.name"
            :type="account.type"
            :balance="account.balance"
            :currency="account.currency"
            :icon="account.icon"
          />
        </template>
        <template v-else>
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
        </template>

        <div v-if="accounts.length === 0" class="no-accounts">Нет доступных счетов</div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.accounts-list-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 1.5rem;
}

/* Заголовок с кнопкой */
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

.accounts-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.accounts-list--compact {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Состояние загрузки */
.accounts-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1rem;
  color: #6b7280;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Состояние ошибки */
.accounts-error {
  text-align: center;
  padding: 2rem 1rem;
  color: #dc2626;
}

.accounts-error p {
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.accounts-error__message {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 400;
}

.no-accounts {
  text-align: center;
  color: #64748b;
  padding: 2rem 1rem;
}
</style>
