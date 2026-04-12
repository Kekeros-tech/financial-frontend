// src/api/accounts.ts
import apiClient from './client'
import type { Account } from '@/types'

export const accountsApi = {
  // GET /accounts — получить список всех аккаунтов
  async getAll(): Promise<Account[]> {
    const response = await apiClient.get<Account[]>('/accounts')
    return response.data
  },

  // GET /accounts/:id — получить один аккаунт
  async getById(id: number): Promise<Account> {
    const response = await apiClient.get<Account>(`/accounts/${id}`)
    return response.data
  },

  // POST /accounts — создать новый аккаунт
  async create(data: Omit<Account, 'id'>): Promise<Account> {
    const response = await apiClient.post<Account>('/accounts', data)
    return response.data
  },

  // PUT /accounts/:id — обновить аккаунт
  async update(id: number, data: Partial<Account>): Promise<Account> {
    const response = await apiClient.put<Account>(`/accounts/${id}`, data)
    return response.data
  },

  // DELETE /accounts/:id — удалить аккаунт
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/accounts/${id}`)
  },
}
