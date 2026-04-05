// src/types/index.ts
export type IconName =
  | 'wallet'
  | 'trending-up'
  | 'trending-down'
  | 'bar-chart-3'
  | 'credit-card'
  | 'dollar-sign'
  | 'plus'
  | 'filter'
  | 'home'
  | 'activity'
  | 'building'
  | 'pie-chart'
  | 'pencil'
  | 'trash-2'
  | 'eye'
  | 'eye-off'
  | 'arrow-right-left'
  | 'arrow-right'
  | 'piggy-bank'
  | 'help-circle'
  | 'landmark'
  | 'alert-triangle'
  | 'goal'
  | 'calendar'
  | 'chevron-left'
  | 'chevron-right'

export type AccountType = 'checking' | 'savings' | 'credit' | 'investment'
export type TransactionType = 'income' | 'expense' | 'transfer'
export type Period = 'week' | 'month' | 'quarter' | 'year'
export type AccountStatus = 'active' | 'frozen' | 'closed'

export interface Transaction {
  id: number
  date: string // ISO format
  description: string
  amount: number
  type: TransactionType
  category: string
}

export interface BudgetLimit {
  id: number
  category: string
  limit: number
  spent: number
  color: string // например 'bg-green-500'
}

export interface Account {
  id: number
  name: string
  type: AccountType
  balance: number
  currency: string
  status?: AccountStatus
  icon?: IconName
}

export interface PeriodData {
  balance: number
  income: number
  expenses: number
  transactions: Transaction[]
}
