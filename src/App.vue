<!-- src/App.vue -->
<template>
  <AppLayout />
</template>

<script setup lang="ts">
import AppLayout from './components/layout/AppLayout.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  background: linear-gradient(to bottom right, #f8fafc, #e0f2fe);
  min-height: 100vh;
  padding-bottom: 5rem; /* для мобильного навигационного меню */
}

@media (min-width: 768px) {
  body {
    padding-bottom: 0;
  }
}
</style>
