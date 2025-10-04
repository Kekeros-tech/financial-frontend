export interface TransactionView {
  id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  description?: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  status: string
}

export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}
