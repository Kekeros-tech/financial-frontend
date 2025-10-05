import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import HistoryPage from '@/views/HistoryPage.vue'
import StatisticPage from '@/views/StatisticPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'Главная - Учёт финансов' },
  },
  {
    path: '/history',
    name: 'History',
    component: HistoryPage,
    meta: { title: 'История операций - Учёт финансов' },
  },
  {
    path: '/statistic',
    name: 'Statistic',
    component: StatisticPage,
    meta: { title: 'История операций - Учёт финансов' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Динамическое изменение title страницы
router.beforeEach((to, from, next) => {
  const title = (to.meta?.title as string) || 'Учёт финансов'
  document.title = title
  next()
})

export default router
