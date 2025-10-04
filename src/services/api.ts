import axios from 'axios'
import { Transaction, TransactionParameters } from '@/types/api'
import { TransactionView, ApiResponse, PageResponse } from '@/types/index'
import { mapToTransactionView } from '@/mappers/mappers'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Добавляем интерцептор для авторизации (если нужно)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Перенаправление на страницу логина
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export const transactionService = {
  // Получить все транзакции
  async getAllTransactions(): Promise<TransactionView[]> {
    try {
      const response = await api.get<Transaction[]>('/transactions')
      return response.data.map(mapToTransactionView)
    } catch (error: any) {
      throw error
    }
  },

  // Получить транзакции с пагинацией
  async getTransactionsPage(
    page: number = 0,
    size: number = 20,
  ): Promise<PageResponse<Transaction>> {
    const response = await api.get<ApiResponse<PageResponse<Transaction>>>(
      `/transactions?page=${page}&size=${size}`,
    )
    return response.data.data
  },

  // Получить транзакцию по ID
  async getTransactionById(id: number): Promise<Transaction> {
    const response = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`)
    return response.data.data
  },

  // Создать новую транзакцию
  async createTransaction(transaction: TransactionParameters): Promise<TransactionView> {
    const response = await api.post<Transaction>('/transactions', transaction)
    return mapToTransactionView(response.data)
  },

  // Обновить транзакцию
  async updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction> {
    const response = await api.put<ApiResponse<Transaction>>(`/transactions/${id}`, transaction)
    return response.data.data
  },

  // Удалить транзакцию
  async deleteTransaction(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/transactions/${id}`)
  },

  // Получить статистику
  async getStatistics(): Promise<{
    totalBalance: number
    totalIncome: number
    totalExpenses: number
    byCategory: Record<string, number>
  }> {
    const response = await api.get<ApiResponse<any>>('/transactions/statistics')
    return response.data.data
  },
}

export default api
