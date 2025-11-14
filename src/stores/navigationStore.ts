// src/stores/navigationStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNavigationStore = defineStore('navigation', () => {
  const activePage = ref('dashboard')

  function setActivePage(pageId: string) {
    activePage.value = pageId
  }

  return {
    activePage,
    setActivePage,
  }
})
