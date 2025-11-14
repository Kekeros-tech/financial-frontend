<!-- src/components/ui/AppButton.vue -->
<template>
  <button class="btn" :class="buttonClasses" :disabled="disabled" v-bind="$attrs">
    <Icon v-if="icon && iconPosition === 'left'" :name="icon" class="btn__icon" />
    <slot />
    <Icon v-if="icon && iconPosition === 'right'" :name="icon" class="btn__icon" />
    <span v-if="loading" class="btn__loader"></span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IconName } from '@/types'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: IconName
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  iconPosition: 'left',
  disabled: false,
  loading: false,
  fullWidth: false,
})

const buttonClasses = computed(() => [
  `btn--${props.variant}`,
  `btn--${props.size}`,
  {
    'btn--full': props.fullWidth,
    'btn--loading': props.loading,
    'btn--disabled': props.disabled,
  },
])
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  position: relative;
}

.btn:disabled,
.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* ========== РАЗМЕРЫ ========== */
.btn--sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.btn--md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  line-height: 1.5rem;
}

.btn--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
}

/* ========== ВАРИАНТЫ ========== */
.btn--primary {
  background-color: #2563eb;
  color: white;
}

.btn--primary:hover {
  background-color: #1d4ed8;
}

.btn--secondary {
  background-color: #6b7280;
  color: white;
}

.btn--secondary:hover {
  background-color: #4b5563;
}

.btn--outline {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn--outline:hover {
  background-color: #f3f4f6;
}

.btn--ghost {
  background-color: transparent;
  color: #374151;
}

.btn--ghost:hover {
  background-color: #f3f4f6;
}

.btn--danger {
  background-color: #ef4444;
  color: white;
}

.btn--danger:hover {
  background-color: #dc2626;
}

/* ========== ИКОНКИ ========== */
.btn__icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

/* ========== LOADING ========== */
.btn--loading {
  pointer-events: none;
}

.btn__loader {
  position: absolute;
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ========== FULL WIDTH ========== */
.btn--full {
  width: 100%;
}
</style>
