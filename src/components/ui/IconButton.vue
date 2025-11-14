<!-- src/components/ui/IconButton.vue -->
<template>
  <button
    class="icon-btn"
    :class="buttonClasses"
    :title="title"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <AppIcon v-if="icon" :name="icon" :size="iconSize" :color="iconColor" />
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import type { IconName } from '@/types'

type IconButtonVariant = 'ghost' | 'filled' | 'outline' | 'danger'
type IconButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  icon?: IconName
  title?: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  iconColor?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'ghost',
  size: 'md',
  disabled: false,
})

const iconSize = computed(() => {
  const sizes: Record<IconButtonSize, number> = {
    sm: 16,
    md: 18,
    lg: 22,
  }
  return sizes[props.size]
})

const iconColor = computed(() => {
  if (props.iconColor) return props.iconColor

  const colors: Record<IconButtonVariant, string> = {
    ghost: '#6b7280',
    filled: '#2563eb',
    outline: '#374151',
    danger: '#ef4444',
  }
  return colors[props.variant]
})

const buttonClasses = computed(() => [
  `icon-btn--${props.variant}`,
  `icon-btn--${props.size}`,
  {
    'icon-btn--disabled': props.disabled,
  },
])
</script>

<style scoped>
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  background: none;
}

.icon-btn:disabled,
.icon-btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* ========== РАЗМЕРЫ ========== */
.icon-btn--sm {
  padding: 0.25rem;
}

.icon-btn--md {
  padding: 0.375rem;
}

.icon-btn--lg {
  padding: 0.5rem;
}

/* ========== ВАРИАНТЫ ========== */
.icon-btn--ghost {
  color: #6b7280;
}

.icon-btn--ghost:hover {
  background-color: #f3f4f6;
}

.icon-btn--filled {
  color: #2563eb;
}

.icon-btn--filled:hover {
  background-color: #dbeafe;
}

.icon-btn--outline {
  color: #374151;
  border: 1px solid #e5e7eb;
}

.icon-btn--outline:hover {
  background-color: #f9fafb;
}

.icon-btn--danger {
  color: #ef4444;
}

.icon-btn--danger:hover {
  background-color: #fee2e2;
}
</style>
