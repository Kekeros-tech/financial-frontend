<template>
  <nav class="app-navigation">
    <div class="nav-container">
      <router-link to="/" class="nav-brand"> 💰 Учёт финансов </router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link" :class="{ 'nav-link-active': $route.path === '/' }">
          <span class="nav-icon">🏠</span>
          Главная
        </router-link>

        <router-link
          to="/history"
          class="nav-link"
          :class="{ 'nav-link-active': $route.path === '/history' }"
        >
          <span class="nav-icon">📅</span>
          История операций
        </router-link>

        <router-link
          to="/statistic"
          class="nav-link"
          :class="{ 'nav-link-active': $route.path === '/statistic' }"
        >
          <span class="nav-icon">📊</span>
          Статистика
        </router-link>
      </div>

      <div class="nav-stats" v-if="financialStore.isInitialized">
        <span
          class="balance"
          :class="{
            positive: financialStore.totalBalance >= 0,
            negative: financialStore.totalBalance < 0,
          }"
        >
          {{ formatCurrency(financialStore.totalBalance) }}
        </span>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useFinancialStore } from '@/stores/financialStore'
import { formatCurrency } from '@/utils/utils'

export default defineComponent({
  name: 'AppNavigation',

  setup() {
    const financialStore = useFinancialStore()

    return {
      financialStore,
      formatCurrency,
    }
  },
})
</script>

<style scoped>
.app-navigation {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-link-active {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

.nav-icon {
  font-size: 1.2rem;
}

.nav-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.balance {
  font-weight: bold;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.balance.positive {
  color: #10b981;
}

.balance.negative {
  color: #ef4444;
}

/* Адаптивность */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .nav-brand {
    font-size: 1.3rem;
  }

  .balance {
    font-size: 1rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
