<!-- src/components/cards/QuickActionCard.vue -->
<template>
  <div class="quick-action-card" :class="`quick-action-card--${color}`">
    <div class="quick-action-card__content">
      <h3 class="quick-action-card__title">{{ title }}</h3>
      <p class="quick-action-card__description">{{ description }}</p>
    </div>
    <button class="quick-action-card__button" :class="`quick-action-card__button--${color}`">
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  buttonText: string
  color?: 'blue' | 'green' | 'purple' | 'red'
}

withDefaults(defineProps<Props>(), {
  color: 'blue',
})
</script>

<style scoped>
.quick-action-card {
  border-radius: 1rem;
  padding: 1.5rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.quick-action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* Цветовые варианты */
.quick-action-card--blue {
  background: linear-gradient(to bottom right, #3b82f6, #2563eb);
}

.quick-action-card--green {
  background: linear-gradient(to bottom right, #22c55e, #16a34a);
}

.quick-action-card--purple {
  background: linear-gradient(to bottom right, #8b5cf6, #7c3aed);
}

.quick-action-card--red {
  background: linear-gradient(to bottom right, #ef4444, #dc2626);
}

.quick-action-card__content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quick-action-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.quick-action-card__description {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.quick-action-card__button {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.875rem;
}

.quick-action-card__button--blue {
  background: white;
  color: #2563eb;
}

.quick-action-card__button--blue:hover {
  background: #dbeafe;
}

.quick-action-card__button--green {
  background: white;
  color: #16a34a;
}

.quick-action-card__button--green:hover {
  background: #dcfce7;
}

.quick-action-card__button--purple {
  background: white;
  color: #7c3aed;
}

.quick-action-card__button--purple:hover {
  background: #ede9fe;
}

.quick-action-card__button--red {
  background: white;
  color: #dc2626;
}

.quick-action-card__button--red:hover {
  background: #fee2e2;
}
</style>
