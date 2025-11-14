<!-- src/views/AnalyticsView.vue -->
<template>
  <div class="card">
    <h2 class="section-title">Analytics</h2>
    <div class="empty-state">
      <BarChart3 class="empty-icon" />
      <p class="empty-text">Analytics dashboard coming soon</p>
      <p class="empty-subtext">Detailed financial insights and reports</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart3 } from 'lucide-vue-next'
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #9ca3af;
  margin: 0 auto 1rem;
}

.empty-text {
  font-size: 1.125rem;
  color: #4b5563;
  margin: 0 0 0.5rem;
}

.empty-subtext {
  color: #6b7280;
  margin: 0;
}
</style>
