<!-- src/components/layout/PeriodSelector.vue -->
<template>
  <div class="period-selector">
    <button
      class="period-selector__arrow"
      :class="{ 'period-selector__arrow--disabled': !canGoPrev }"
      :disabled="!canGoPrev"
      @click="goPrev"
    >
      <AppIcon name="chevron-left" :size="20" :color="canGoPrev ? '#1e293b' : '#9ca3af'" />
    </button>
    <span class="period-selector__month">{{ currentMonthName }}</span>
    <button
      class="period-selector__arrow"
      :class="{ 'period-selector__arrow--disabled': !canGoNext }"
      :disabled="!canGoNext"
      @click="goNext"
    >
      <AppIcon name="chevron-right" :size="20" :color="canGoNext ? '#1e293b' : '#9ca3af'" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '../ui/AppIcon.vue'

interface Props {
  currentMonth: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:currentMonth': [value: number]
}>()

// Текущий месяц (апрель 2026) — нельзя перейти дальше него
const maxMonth = 3 // Апрель (индекс)
const minMonth = 0 // Январь (индекс)

const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

const currentMonthName = computed(() => {
  return monthNames[props.currentMonth]
})

const canGoPrev = computed(() => {
  return props.currentMonth > minMonth
})

const canGoNext = computed(() => {
  return props.currentMonth < maxMonth
})

const goPrev = () => {
  if (!canGoPrev.value) return
  emit('update:currentMonth', props.currentMonth - 1)
}

const goNext = () => {
  if (!canGoNext.value) return
  emit('update:currentMonth', props.currentMonth + 1)
}
</script>

<style scoped>
.period-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 1rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.period-selector__month {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
}

.period-selector__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.period-selector__arrow:hover:not(.period-selector__arrow--disabled) {
  background: #f3f4f6;
}

.period-selector__arrow--disabled {
  cursor: not-allowed;
}
</style>
