<!-- src/components/layout/AppLayout.vue -->
<template>
  <div class="app-layout">
    <!-- ========== ДЕСКТОПНАЯ ШАПКА ========== -->
    <header class="desktop-header">
      <div class="header-content">
        <!-- Логотип -->
        <div class="logo">
          <div class="logo-icon-container">
            <Wallet class="logo-icon" />
          </div>
          <h1 class="logo-title">FinanceTracker</h1>
        </div>

        <!-- Навигация на десктопе -->
        <nav v-if="!isMobile" class="desktop-nav">
          <button
            v-for="item in navigationItems"
            :key="item.id"
            @click="setActivePage(item.id)"
            class="nav-btn"
            :class="{ 'nav-btn--active': navigationStore.activePage === item.id }"
          >
            <component :is="item.icon" class="nav-icon" />
            <span>{{ item.label }}</span>
          </button>
        </nav>
      </div>
    </header>

    <!-- ========== ОСНОВНОЙ КОНТЕНТ ========== -->
    <main class="main-content">
      <div class="content-container">
        <!-- Подключаемый контент -->
        <component :is="currentPage?.component" />
      </div>
    </main>

    <!-- ========== МОБИЛЬНАЯ НАВИГАЦИЯ СНИЗУ ========== -->
    <nav v-if="isMobile" class="bottom-nav">
      <button
        v-for="item in navigationItems"
        :key="item.id"
        @click="setActivePage(item.id)"
        class="bottom-nav-item"
        :class="{ 'bottom-nav-item--active': navigationStore.activePage === item.id }"
      >
        <component :is="item.icon" class="bottom-nav-icon" />
        <span class="bottom-nav-label">{{ item.label }}</span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Wallet, Home, BarChart3, Goal, Settings, Activity, Landmark } from 'lucide-vue-next'
import { useNavigationStore } from '@/stores/navigationStore'
import DashboardView from '@/views/DashboardView.vue'
import AnalyticsView from '@/views/AnalyticsView.vue'
import BudgetsView from '@/views/BudgetsView.vue'
import SettingsView from '@/views/SettingsView.vue'
import TransactionsView from '@/views/TransactionsView.vue'
import AccountsView from '@/views/AccountsView.vue'

const navigationStore = useNavigationStore()

interface NavItem {
  id: string
  label: string
  icon: unknown
  component: unknown
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, component: DashboardView },
  { id: 'operations', label: 'Operations', icon: Activity, component: TransactionsView },
  { id: 'accounts', label: 'Accounts', icon: Landmark, component: AccountsView },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, component: AnalyticsView },
  { id: 'budgets', label: 'Budgets', icon: Goal, component: BudgetsView },
  { id: 'settings', label: 'Settings', icon: Settings, component: SettingsView },
]

const isMobileMenuOpen = ref(false)
const isMobile = ref(window.innerWidth < 768)

const currentPage = computed(() => {
  return navigationItems.find((item) => item.id === navigationStore.activePage)
})

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const setActivePage = (id: string) => {
  navigationStore.setActivePage(id)
  if (isMobile.value) {
    closeMobileMenu()
  }
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* ========== ГЛАВНЫЙ КОНТЕЙНЕР ========== */
.app-layout {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f8fafc, #e0f2fe);
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .app-layout {
    padding-bottom: 0;
  }
}

/* ========== ДЕСКТОПНАЯ ШАПКА ========== */
.desktop-header {
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e5e7eb;
  display: block;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon-container {
  padding: 0.5rem;
  background-color: #2563eb;
  border-radius: 0.5rem;
}

.logo-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

.logo-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.desktop-nav {
  display: flex;
  gap: 0.25rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.nav-btn--active {
  background-color: #dbeafe;
  color: #1d4ed8;
}

/* ========== МОБИЛЬНОЕ МЕНЮ (когда открыто) ========== */
.mobile-menu-header {
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e5e7eb;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
}

@media (min-width: 768px) {
  .mobile-menu-header {
    display: none;
  }
}

.mobile-nav-menu {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-btn-mobile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  background: none;
  color: #6b7280;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn-mobile:hover {
  background-color: #f3f4f6;
}

.nav-btn-mobile--active {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.close-btn {
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  color: #6b7280;
}

.close-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* ========== МОБИЛЬНАЯ КНОПКА МЕНЮ ========== */
.mobile-menu-toggle-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 50;
  display: block;
}

@media (min-width: 768px) {
  .mobile-menu-toggle-container {
    display: none;
  }
}

.mobile-menu-toggle {
  padding: 0.75rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.menu-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #6b7280;
}

/* ========== САЙДБАР ========== */
.sidebar {
  width: 256px; /* w-64 */
  height: 100vh;
  background: white;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out;
  transform: translateX(-100%);
}

/* На десктопе - всегда виден */
@media (min-width: 768px) {
  .sidebar {
    position: sticky;
    transform: translateX(0) !important;
    box-shadow: none;
    height: auto;
    min-height: 100vh;
  }

  .mobile-menu-toggle-container,
  .mobile-menu-header,
  .bottom-nav {
    display: none;
  }
}

/* На мобильных - показ/скрытие */
.sidebar--mobile-open {
  transform: translateX(0);
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.sidebar-nav {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-btn-sidebar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  background: none;
  color: #6b7280;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn-sidebar:hover {
  background-color: #f3f4f6;
}

.nav-btn-sidebar--active {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

/* ========== ОСНОВНОЙ КОНТЕНТ ========== */
.main-content {
  flex: 1;
  padding-top: 2rem; /* py-8 */
  padding-bottom: 2rem;
  margin-left: 0;
}

.content-container {
  max-width: 1200px; /* max-w-6xl */
  margin: 0 auto;
  padding: 0 1rem; /* px-4 */
}

.page-header {
  text-align: center;
  margin-bottom: 2rem; /* mb-8 */
}

.page-title {
  font-size: 2.25rem; /* text-4xl */
  font-weight: 700;
  color: #1f2937; /* text-gray-800 */
  margin: 0 0 0.5rem;
}

.page-subtitle {
  color: #6b7280; /* text-gray-600 */
  margin: 0;
}

/* ========== НИЖНЯЯ МОБИЛЬНАЯ НАВИГАЦИЯ ========== */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0;
  z-index: 40;
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  color: #6b7280; /* text-gray-500 */
  font-size: 0.75rem; /* text-xs */
  font-weight: 500;
}

.bottom-nav-item--active {
  color: #2563eb; /* text-blue-600 */
}

.bottom-nav-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.bottom-nav-label {
  font-size: 0.75rem;
  font-weight: 500;
}
</style>
