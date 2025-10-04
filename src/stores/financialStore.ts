import { defineStore } from 'pinia'
import { Transaction, TransactionParameters } from '@/types/api'
import { TransactionView } from '@/types/index'
import { transactionService } from '@/services/api'

interface FinancialState {
  transactions: TransactionView[]
  categories: string[]
  loading: boolean
  error: string | null
  initialized: boolean
}

export const useFinancialStore = defineStore('financial', {
  state: (): FinancialState => ({
    transactions: [],
    categories: [
      'Продукты',
      'Транспорт',
      'Жильё',
      'Развлечения',
      'Здоровье',
      'Одежда',
      'Образование',
      'Другое',
    ],
    loading: false,
    error: null,
    initialized: false,
  }),

  actions: {
    async initialize() {
      if (this.initialized) return

      this.loading = true
      this.error = null

      try {
        this.transactions = await transactionService.getAllTransactions()
        console.info('Received transactions from API:', this.transactions)
        this.initialized = true
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Ошибка загрузки транзакций'
        console.error('Error loading transactions:', error)
      } finally {
        this.loading = false
      }
    },

    async loadTransactions() {
      this.loading = true
      this.error = null

      try {
        this.transactions = await transactionService.getAllTransactions()
        console.info('Received transactions from API:', this.transactions)
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Ошибка загрузки транзакций'
        console.error('Error loading transactions:', error)
        // Можно добавить fallback на локальное хранилище
        this.loadFromLocalStorage()
      } finally {
        this.loading = false
      }
    },

    async addTransaction(transactionData: TransactionParameters) {
      this.loading = true
      this.error = null

      try {
        const newTransaction = await transactionService.createTransaction(transactionData)
        this.transactions.push(newTransaction)
        this.saveToLocalStorage() // Бэкап в localStorage
        return newTransaction
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Ошибка создания транзакции'
        console.error('Error creating transaction:', error)
      } finally {
        this.loading = false
      }
    },

    async deleteTransaction(id: string) {
      this.loading = true
      this.error = null

      try {
        await transactionService.deleteTransaction(id)
        this.transactions = this.transactions.filter((t) => t.id !== id)
        this.saveToLocalStorage()
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Ошибка удаления транзакции'
        console.error('Error deleting transaction:', error)

        // Fallback: удаляем локально
        this.transactions = this.transactions.filter((t) => t.id !== id)
        this.saveToLocalStorage()
      } finally {
        this.loading = false
      }
    },

    // Методы для работы с localStorage как fallback
    saveToLocalStorage() {
      localStorage.setItem('transactions', JSON.stringify(this.transactions))
    },

    loadFromLocalStorage() {
      try {
        const stored = localStorage.getItem('transactions')
        if (stored) {
          this.transactions = JSON.parse(stored)
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
      }
    },

    clearError() {
      this.error = null
    },
  },

  getters: {
    totalBalance: (state): number => {
      if (!state.transactions || state.transactions.length === 0) return 0
      return state.transactions.reduce((total, t) => {
        return t.type === 'income' ? total + t.amount : total - t.amount
      }, 0)
    },

    income: (state): number => {
      if (!state.transactions || state.transactions.length === 0) return 0
      return state.transactions
        .filter((t) => t.type === 'income')
        .reduce((total, t) => total + t.amount, 0)
    },

    expenses: (state): number => {
      if (!state.transactions || state.transactions.length === 0) return 0
      return state.transactions
        .filter((t) => t.type === 'expense')
        .reduce((total, t) => total + t.amount, 0)
    },

    transactionsByCategory: (state): Record<string, number> => {
      if (!state.transactions || state.transactions.length === 0) return {}

      const categories: Record<string, number> = {}
      state.transactions.forEach((t) => {
        if (!categories[t.category]) {
          categories[t.category] = 0
        }
        categories[t.category] += t.type === 'income' ? t.amount : -t.amount
      })
      return categories
    },

    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    isInitialized: (state) => state.initialized,
  },
})
