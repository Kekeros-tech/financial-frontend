// src/composables/useFinancialData.ts
import { ref, computed, watch } from 'vue'
import { Period, PeriodData, Transaction, BudgetLimit, Account } from '@/types'

const periodData: Record<Period, PeriodData> = {
  week: {
    balance: 8500,
    income: 3200,
    expenses: 1800,
    transactions: [
      {
        id: 1,
        type: 'income',
        amount: 2000,
        category: 'Freelance',
        date: '2024-01-18',
        description: 'Project payment',
      },
      {
        id: 2,
        type: 'expense',
        amount: 450,
        category: 'Groceries',
        date: '2024-01-17',
        description: 'Weekly shopping',
      },
      {
        id: 3,
        type: 'expense',
        amount: 320,
        category: 'Transport',
        date: '2024-01-16',
        description: 'Gas and parking',
      },
    ],
  },
  month: {
    balance: 12500,
    income: 8500,
    expenses: 3200,
    transactions: [
      {
        id: 1,
        type: 'income',
        amount: 5000,
        category: 'Salary',
        date: '2024-01-15',
        description: 'Monthly salary',
      },
      {
        id: 2,
        type: 'expense',
        amount: 1200,
        category: 'Rent',
        date: '2024-01-14',
        description: 'Apartment rent',
      },
      {
        id: 3,
        type: 'expense',
        amount: 450,
        category: 'Groceries',
        date: '2024-01-13',
        description: 'Weekly shopping',
      },
      {
        id: 4,
        type: 'income',
        amount: 2000,
        category: 'Freelance',
        date: '2024-01-12',
        description: 'Project payment',
      },
      {
        id: 5,
        type: 'expense',
        amount: 320,
        category: 'Transport',
        date: '2024-01-11',
        description: 'Gas and parking',
      },
    ],
  },
  year: {
    balance: 85000,
    income: 120000,
    expenses: 35000,
    transactions: [
      {
        id: 1,
        type: 'income',
        amount: 50000,
        category: 'Salary',
        date: '2024-01-15',
        description: 'Annual bonus',
      },
      {
        id: 2,
        type: 'expense',
        amount: 15000,
        category: 'Rent',
        date: '2024-01-14',
        description: 'Annual rent',
      },
      {
        id: 3,
        type: 'expense',
        amount: 8500,
        category: 'Travel',
        date: '2024-01-10',
        description: 'Vacation expenses',
      },
      {
        id: 4,
        type: 'income',
        amount: 30000,
        category: 'Investments',
        date: '2024-01-08',
        description: 'Investment returns',
      },
      {
        id: 5,
        type: 'expense',
        amount: 6500,
        category: 'Insurance',
        date: '2024-01-05',
        description: 'Annual insurance',
      },
    ],
  },
  quarter: {
    balance: 28500,
    income: 32000,
    expenses: 8500,
    transactions: [
      {
        id: 1,
        type: 'income',
        amount: 15000,
        category: 'Salary',
        date: '2024-03-15',
        description: 'Q1 salary',
      },
      {
        id: 2,
        type: 'expense',
        amount: 3600,
        category: 'Rent',
        date: '2024-03-14',
        description: 'Q1 rent',
      },
      {
        id: 3,
        type: 'expense',
        amount: 1200,
        category: 'Utilities',
        date: '2024-02-20',
        description: 'Utilities Q1',
      },
      {
        id: 4,
        type: 'income',
        amount: 10000,
        category: 'Freelance',
        date: '2024-02-10',
        description: 'Q1 freelance',
      },
      {
        id: 5,
        type: 'expense',
        amount: 900,
        category: 'Subscriptions',
        date: '2024-01-25',
        description: 'Q1 subscriptions',
      },
    ],
  },
}

export const useFinancialData = () => {
  const selectedPeriod = ref<Period>('month')
  const balance = ref(12500)
  const income = ref(8500)
  const expenses = ref(3200)
  const transactions = ref<Transaction[]>(periodData.month.transactions)
  const accounts = ref<Account[]>([
    {
      id: 1,
      name: 'Основной счёт',
      type: 'checking',
      balance: 125000,
      currency: '₽',
      status: 'active',
    },
    {
      id: 2,
      name: 'Накопления',
      type: 'savings',
      balance: 500000,
      currency: '₽',
    },
    {
      id: 3,
      name: 'Накопления',
      type: 'investment',
      balance: 500000,
      currency: '₽',
    },
  ])

  const budgetLimits = computed<BudgetLimit[]>(() => {
    const period = selectedPeriod.value
    return [
      {
        id: 1,
        category: 'Groceries',
        limit:
          period === 'week' ? 500 : period === 'month' ? 2000 : period === 'quarter' ? 6000 : 24000,
        spent:
          period === 'week' ? 350 : period === 'month' ? 1450 : period === 'quarter' ? 4200 : 18000,
        color: 'bg-green-500',
      },
      {
        id: 2,
        category: 'Entertainment',
        limit:
          period === 'week' ? 250 : period === 'month' ? 1000 : period === 'quarter' ? 3000 : 12000,
        spent:
          period === 'week' ? 200 : period === 'month' ? 850 : period === 'quarter' ? 2400 : 9500,
        color: 'bg-blue-500',
      },
      {
        id: 3,
        category: 'Transport',
        limit:
          period === 'week' ? 375 : period === 'month' ? 1500 : period === 'quarter' ? 4500 : 18000,
        spent:
          period === 'week' ? 400 : period === 'month' ? 1620 : period === 'quarter' ? 5200 : 20000,
        color: 'bg-red-500',
      },
      {
        id: 4,
        category: 'Dining Out',
        limit:
          period === 'week' ? 625 : period === 'month' ? 2500 : period === 'quarter' ? 7500 : 30000,
        spent:
          period === 'week' ? 450 : period === 'month' ? 1800 : period === 'quarter' ? 5800 : 25000,
        color: 'bg-purple-500',
      },
      {
        id: 5,
        category: 'Shopping',
        limit:
          period === 'week' ? 750 : period === 'month' ? 3000 : period === 'quarter' ? 9000 : 36000,
        spent:
          period === 'week' ? 700 : period === 'month' ? 2800 : period === 'quarter' ? 8500 : 32000,
        color: 'bg-yellow-500',
      },
    ]
  })

  // Обновляем данные при смене периода
  watch(selectedPeriod, (newPeriod) => {
    const data = periodData[newPeriod]
    balance.value = data.balance
    income.value = data.income
    expenses.value = data.expenses
    transactions.value = data.transactions
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return {
    selectedPeriod,
    balance,
    income,
    expenses,
    transactions,
    accounts,
    budgetLimits,
    formatCurrency,
  }
}
