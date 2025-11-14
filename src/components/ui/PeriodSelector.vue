<!-- src/components/ui/PeriodSelector.vue -->
<template>
  <div class="period-selector">
    <button
      v-for="period in periodOptions"
      :key="period.value"
      @click="onSelect(period.value)"
      :class="['period-btn', { active: selectedPeriod === period.value }]"
    >
      {{ period.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { Period } from '@/types'

interface Props {
  selectedPeriod: Period
}

interface Emits {
  (e: 'update:selectedPeriod', value: Period): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const periodOptions = [
  { id: 'week', label: 'Week', value: 'week' as Period },
  { id: 'month', label: 'Month', value: 'month' as Period },
  { id: 'quarter', label: 'Quarter', value: 'quarter' as Period },
  { id: 'year', label: 'Year', value: 'year' as Period },
]

const onSelect = (period: Period) => {
  emit('update:selectedPeriod', period)
}
</script>

<style scoped>
.period-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.period-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.period-btn:not(.active) {
  background-color: #f3f4f6;
  color: #4b5563;
}

.period-btn:not(.active):hover {
  background-color: #e5e7eb;
}

.period-btn.active {
  background-color: #2563eb;
  color: white;
}
</style>
