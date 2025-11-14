<!-- src/components/ui/Icon.vue -->
<script setup lang="ts">
import { computed, h } from 'vue'
import type { IconName } from '@/types'
import * as Lucide from 'lucide-vue-next'

// Преобразует kebab-case в PascalCase: 'trending-up' → 'TrendingUp'
function kebabToPascalCase(str: string): string {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

interface Props {
  name: IconName
  size?: number | string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  color: 'currentColor',
})

const iconSize = computed(() => {
  if (typeof props.size === 'number') return props.size
  return parseInt(props.size, 10) || 20
})

// Рендерим иконку напрямую через h()

const renderIcon = () => {
  const iconName = kebabToPascalCase(props.name) as keyof typeof Lucide
  const IconComponent = Lucide[iconName] || Lucide.HelpCircle
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return h(IconComponent as any, {
    size: iconSize.value,
    color: props.color,
    strokeWidth: 2,
  })
}
</script>

<template>
  <component :is="renderIcon()" />
</template>
