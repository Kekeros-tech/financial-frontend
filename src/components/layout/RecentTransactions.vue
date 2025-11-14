<!-- src/components/dashboard/RecentTransactions.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Transaction } from '@/types'
import IconButton from '../ui/IconButton.vue'
import TransactionCard from '../cards/TransactionCard.vue'

interface Props {
  transactions: Transaction[]
  title?: string
  maxItems?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  showAll: []
}>()

const isExpanded = ref(true)

const displayTransactions = computed(() => {
  if (!isExpanded.value) return []
  return props.maxItems ? props.transactions.slice(0, props.maxItems) : props.transactions
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const handleShowAll = () => {
  emit('showAll')
}
</script>

<template>
  <div class="recent-transactions-card">
    <!-- Заголовок с кнопками -->
    <div class="card-header" :class="{ 'card-header--collapsed': !isExpanded }">
      <h3 class="card-title">
        {{ title || 'Последние транзакции' }}
      </h3>
      <div class="card-actions">
        <!-- Кнопка "Все операции" -->
        <IconButton
          icon="arrow-right"
          variant="ghost"
          title="Все операции"
          @click="handleShowAll"
        />
        <!-- Кнопка показать/скрыть -->
        <IconButton
          :icon="isExpanded ? 'eye-off' : 'eye'"
          variant="filled"
          :title="isExpanded ? 'Скрыть операции' : 'Показать все операции'"
          @click="toggleExpand"
        />
      </div>
    </div>

    <!-- Список транзакций -->
    <div v-if="isExpanded" class="transactions-list">
      <TransactionCard
        v-for="t in displayTransactions"
        :key="t.id"
        :description="t.description"
        :category="t.category"
        :amount="t.amount"
        :date="t.date"
        :type="t.type"
      />

      <div v-if="displayTransactions.length === 0" class="no-transactions">
        Нет транзакций за выбранный период
      </div>
    </div>
  </div>
</template>

<style scoped>
.recent-transactions-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 2rem;
}

/* Заголовок с кнопками */
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

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.no-transactions {
  text-align: center;
  color: #64748b;
  padding: 1.5rem;
}
</style>
