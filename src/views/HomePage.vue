<template>
  <div class="home-page">
    <div class="container">
      <!-- Статистика -->
      <BalanceDisplay />

      <div class="home-content">
        <!-- Форма добавления операции -->
        <div class="form-section">
          <TransactionForm />
        </div>

        <!-- Недавние операции (превью) -->
        <div class="recent-section">
          <div class="section-header">
            <h3>Недавние операции</h3>
            <router-link to="/history" class="view-all-link"> Вся история → </router-link>
          </div>
          <TransactionListPreview />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useFinancialStore } from '@/stores/financialStore'
import BalanceDisplay from '@/components/BalanceDisplay.vue'
import TransactionForm from '@/components/TransactionForm.vue'
import TransactionListPreview from '@/components/TransactionListPreview.vue'

export default defineComponent({
  name: 'HomePage',

  components: {
    BalanceDisplay,
    TransactionForm,
    TransactionListPreview,
  },

  setup() {
    const financialStore = useFinancialStore()

    onMounted(() => {
      if (!financialStore.initialized) {
        financialStore.initialize()
      }
    })

    return {}
  },
})
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 80px);
  background: #f8fafc;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.home-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 2rem;
  margin-top: 2rem;
}

.form-section {
  grid-column: 1;
  grid-row: 1;
}

.recent-section {
  grid-column: 2;
  grid-row: 1;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #e1e5e9;
}

.chart-section {
  grid-column: 1 / -1;
  grid-row: 2;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  margin: 0;
  color: #1a1a1a;
  font-size: 1.25rem;
}

.view-all-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.view-all-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .home-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .form-section {
    grid-column: 1;
    grid-row: 1;
  }

  .recent-section {
    grid-column: 1;
    grid-row: 2;
  }

  .chart-section {
    grid-column: 1;
    grid-row: 3;
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: 1rem 0;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
