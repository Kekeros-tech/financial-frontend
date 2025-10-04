<template>
  <div class="category-chart">
    <h3>Статистика по категориям</h3>

    <div v-if="Object.keys(chartData).length === 0" class="empty-state">
      <p>Нет данных для отображения</p>
    </div>

    <div v-else class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue'
import { useFinancialStore } from '@/stores/financialStore'
import { Chart, registerables, ChartType, ChartData, ChartOptions } from 'chart.js'

Chart.register(...registerables)

export default defineComponent({
  name: 'CategoryChart',

  setup() {
    const financialStore = useFinancialStore()
    const chartCanvas = ref<HTMLCanvasElement | null>(null)
    let chart: Chart | null = null

    const chartData = computed(() => financialStore.transactionsByCategory)

    const createChart = (): void => {
      if (chart) {
        chart.destroy()
      }

      if (chartCanvas.value && Object.keys(chartData.value).length > 0) {
        const ctx = chartCanvas.value.getContext('2d')
        if (!ctx) return

        const data: ChartData<'pie'> = {
          labels: Object.keys(chartData.value),
          datasets: [
            {
              data: Object.values(chartData.value),
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#FF6384',
                '#C9CBCF',
              ],
              borderWidth: 1,
            },
          ],
        }

        const options: ChartOptions<'pie'> = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                  }).format(context.raw as number)
                },
              },
            },
          },
        }

        chart = new Chart(ctx, {
          type: 'pie' as ChartType,
          data: data,
          options: options,
        })
      }
    }

    onMounted(() => {
      createChart()
    })

    watch(
      chartData,
      () => {
        createChart()
      },
      { deep: true },
    )

    return {
      chartCanvas,
      chartData,
    }
  },
})
</script>

<style scoped>
.category-chart {
  height: 400px;
}

.chart-container {
  height: 350px;
  position: relative;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
