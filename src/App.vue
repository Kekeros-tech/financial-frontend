<template>
  <div id="app">
    <header class="header">
      <h1>💰 Учёт финансов</h1>
    </header>

    <main class="main-content">
      <div class="container">
        <BalanceDisplay />

        <div class="grid">
          <div class="column">
            <TransactionForm />
            <TransactionList />
          </div>

          <div class="column">
            <CategoryChart />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BalanceDisplay from './components/BalanceDisplay.vue'
import TransactionForm from './components/TransactionForm.vue'
import TransactionList from './components/TransactionList.vue'
import CategoryChart from './components/CategoryChart.vue'

export default defineComponent({
  name: 'App',
  components: {
    BalanceDisplay,
    TransactionForm,
    TransactionList,
    CategoryChart,
  },
})
</script>

<style>
/* Стили остаются такими же */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.main-content {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.column {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
