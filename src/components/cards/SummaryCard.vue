<!-- src/components/dashboard/SummaryCard.vue -->
<script setup lang="ts">
import { IconName } from '@/types'
import AppIcon from '../ui/AppIcon.vue'

interface Props {
  title: string
  value: number | string
  icon: IconName
  color: 'blue' | 'green' | 'red' | 'purple'
  prefix?: string
}

const props = defineProps<Props>()

const getBgColor = () => {
  const map: Record<string, string> = {
    blue: '#dbeafe',
    green: '#dcfce7',
    red: '#fee2e2',
    purple: '#ede9fe',
  }
  return map[props.color]
}

const getIconColor = () => {
  const map: Record<string, string> = {
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
    purple: '#8b5cf6',
  }
  return map[props.color]
}
</script>

<template>
  <div class="summary-card">
    <div class="summary-content">
      <div>
        <p class="summary-label">{{ title }}</p>
        <p
          class="summary-value"
          :class="{
            income: color === 'green',
            expense: color === 'red',
          }"
        >
          {{ prefix || '' }}{{ value }}
        </p>
      </div>
      <div class="summary-icon-bg" :style="{ backgroundColor: getBgColor() }">
        <AppIcon :name="icon" :color="getIconColor()" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  height: 100%;
}

.summary-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* hover:shadow-md */
}

.summary-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.summary-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.income {
  color: #10b981;
}
.expense {
  color: #ef4444;
}

.summary-icon-bg {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
