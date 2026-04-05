// src/composables/useFinancialData.ts
import { ref, computed } from 'vue'
import { Transaction, BudgetLimit, Account } from '@/types'

interface MonthData {
  balance: number
  income: number
  expenses: number
  transactions: Transaction[]
  budgetLimits: BudgetLimit[]
}

// Тестовые данные для месяцев: январь — апрель 2026
const monthData: Record<number, MonthData> = {
  0: {
    balance: 45000,
    income: 85000,
    expenses: 40000,
    transactions: [
      {
        id: 1,
        type: 'income',
        amount: 75000,
        category: 'Зарплата',
        date: '2026-01-15',
        description: 'Январская зарплата',
      },
      {
        id: 2,
        type: 'income',
        amount: 10000,
        category: 'Фриланс',
        date: '2026-01-20',
        description: 'Проект для клиента',
      },
      {
        id: 3,
        type: 'expense',
        amount: 25000,
        category: 'Аренда',
        date: '2026-01-10',
        description: 'Аренда квартиры',
      },
      {
        id: 4,
        type: 'expense',
        amount: 8000,
        category: 'Продукты',
        date: '2026-01-18',
        description: 'Еженедельные покупки',
      },
      {
        id: 5,
        type: 'expense',
        amount: 5000,
        category: 'Транспорт',
        date: '2026-01-12',
        description: 'Бензин и парковка',
      },
      {
        id: 6,
        type: 'expense',
        amount: 2000,
        category: 'Развлечения',
        date: '2026-01-25',
        description: 'Кино и рестораны',
      },
    ],
    budgetLimits: [
      { id: 1, category: 'Продукты', limit: 15000, spent: 8000, color: 'bg-green-500' },
      { id: 2, category: 'Развлечения', limit: 5000, spent: 2000, color: 'bg-blue-500' },
      { id: 3, category: 'Транспорт', limit: 8000, spent: 5000, color: 'bg-red-500' },
      { id: 4, category: 'Рестораны', limit: 10000, spent: 4500, color: 'bg-purple-500' },
      { id: 5, category: 'Покупки', limit: 20000, spent: 12000, color: 'bg-yellow-500' },
    ],
  },
  1: {
    balance: 52000,
    income: 90000,
    expenses: 38000,
    transactions: [
      {
        id: 1,
        type: 'income',
        amount: 75000,
        category: 'Зарплата',
        date: '2026-02-15',
        description: 'Февральская зарплата',
      },
      {
        id: 2,
        type: 'income',
        amount: 15000,
        category: 'Фриланс',
        date: '2026-02-22',
        description: 'Дизайн сайта',
      },
      {
        id: 3,
        type: 'expense',
        amount: 25000,
        category: 'Аренда',
        date: '2026-02-10',
        description: 'Аренда квартиры',
      },
      {
        id: 4,
        type: 'expense',
        amount: 6500,
        category: 'Продукты',
        date: '2026-02-17',
        description: 'Еженедельные покупки',
      },
      {
        id: 5,
        type: 'expense',
        amount: 4000,
        category: 'Транспорт',
        date: '2026-02-14',
        description: 'Бензин и парковка',
      },
      {
        id: 6,
        type: 'expense',
        amount: 2500,
        category: 'Развлечения',
        date: '2026-02-20',
        description: 'Подписки и сервисы',
      },
    ],
    budgetLimits: [
      { id: 1, category: 'Продукты', limit: 15000, spent: 6500, color: 'bg-green-500' },
      { id: 2, category: 'Развлечения', limit: 5000, spent: 2500, color: 'bg-blue-500' },
      { id: 3, category: 'Транспорт', limit: 8000, spent: 4000, color: 'bg-red-500' },
      { id: 4, category: 'Рестораны', limit: 10000, spent: 7200, color: 'bg-purple-500' },
      { id: 5, category: 'Покупки', limit: 20000, spent: 15000, color: 'bg-yellow-500' },
    ],
  },
  2: {
    balance: 68000,
    income: 95000,
    expenses: 27000,
    transactions: [
      {
        id: 1,
        type: 'income',
        amount: 75000,
        category: 'Зарплата',
        date: '2026-03-15',
        description: 'Мартовская зарплата',
      },
      {
        id: 2,
        type: 'income',
        amount: 20000,
        category: 'Инвестиции',
        date: '2026-03-20',
        description: 'Дивиденды',
      },
      {
        id: 3,
        type: 'expense',
        amount: 25000,
        category: 'Аренда',
        date: '2026-03-10',
        description: 'Аренда квартиры',
      },
      {
        id: 4,
        type: 'expense',
        amount: 1200,
        category: 'Транспорт',
        date: '2026-03-08',
        description: 'Общественный транспорт',
      },
    ],
    budgetLimits: [
      { id: 1, category: 'Продукты', limit: 15000, spent: 0, color: 'bg-green-500' },
      { id: 2, category: 'Развлечения', limit: 5000, spent: 0, color: 'bg-blue-500' },
      { id: 3, category: 'Транспорт', limit: 8000, spent: 1200, color: 'bg-red-500' },
      { id: 4, category: 'Рестораны', limit: 10000, spent: 3500, color: 'bg-purple-500' },
      { id: 5, category: 'Покупки', limit: 20000, spent: 18000, color: 'bg-yellow-500' },
    ],
  },
  3: {
    balance: 75000,
    income: 105000,
    expenses: 30000,
    transactions: [
      {
        id: 1,
        type: 'income',
        amount: 75000,
        category: 'Зарплата',
        date: '2026-04-15',
        description: 'Апрельская зарплата',
      },
      {
        id: 2,
        type: 'income',
        amount: 30000,
        category: 'Фриланс',
        date: '2026-04-22',
        description: 'Разработка приложения',
      },
      {
        id: 3,
        type: 'expense',
        amount: 25000,
        category: 'Аренда',
        date: '2026-04-10',
        description: 'Аренда квартиры',
      },
      {
        id: 4,
        type: 'expense',
        amount: 3500,
        category: 'Продукты',
        date: '2026-04-18',
        description: 'Еженедельные покупки',
      },
      {
        id: 5,
        type: 'expense',
        amount: 1500,
        category: 'Развлечения',
        date: '2026-04-20',
        description: 'Подписки',
      },
    ],
    budgetLimits: [
      { id: 1, category: 'Продукты', limit: 15000, spent: 3500, color: 'bg-green-500' },
      { id: 2, category: 'Развлечения', limit: 5000, spent: 1500, color: 'bg-blue-500' },
      { id: 3, category: 'Транспорт', limit: 8000, spent: 0, color: 'bg-red-500' },
      { id: 4, category: 'Рестораны', limit: 10000, spent: 6200, color: 'bg-purple-500' },
      { id: 5, category: 'Покупки', limit: 20000, spent: 19500, color: 'bg-yellow-500' },
    ],
  },
}

export const useFinancialData = () => {
  const currentMonth = ref(3) // Апрель (индекс 3)

  const accounts = ref<Account[]>([
    { id: 1, name: 'Основной счёт', type: 'checking', balance: 125000, currency: '₽' },
    { id: 2, name: 'Накопления', type: 'savings', balance: 500000, currency: '₽' },
    { id: 3, name: 'Инвестиции', type: 'investment', balance: 350000, currency: '₽' },
  ])

  const monthDataForCurrentMonth = computed(() => monthData[currentMonth.value])

  const balance = computed(() => monthDataForCurrentMonth.value.balance)
  const income = computed(() => monthDataForCurrentMonth.value.income)
  const expenses = computed(() => monthDataForCurrentMonth.value.expenses)
  const transactions = computed(() => monthDataForCurrentMonth.value.transactions)
  const budgetLimits = computed(() => monthDataForCurrentMonth.value.budgetLimits)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return {
    currentMonth,
    balance,
    income,
    expenses,
    transactions,
    accounts,
    budgetLimits,
    formatCurrency,
  }
}
