<!-- src/components/layout/QuickActionsList.vue -->
<template>
  <div class="quick-actions-list">
    <QuickActionCard
      v-for="(action, index) in actions"
      :key="index"
      :title="action.title"
      :description="action.description"
      :button-text="action.buttonText"
      :color="action.color"
    />
  </div>
</template>

<script setup lang="ts">
import QuickActionCard from '../cards/QuickActionCard.vue'

interface QuickAction {
  title: string
  description: string
  buttonText: string
  color?: 'blue' | 'green' | 'purple' | 'red'
}

interface Props {
  actions: QuickAction[]
}

defineProps<Props>()
</script>

<style scoped>
.quick-actions-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
}

@media (min-width: 768px) {
  .quick-actions-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
