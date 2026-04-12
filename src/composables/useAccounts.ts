// src/composables/useAccounts.ts
import { ref, computed } from 'vue'
import { accountsApi } from '@/api/accounts'
import type { Account, AccountType } from '@/types'

const accounts = ref<Account[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

export const useAccounts = () => {
  const fetchAccounts = async () => {
    isLoading.value = true
    error.value = null
    try {
      accounts.value = await accountsApi.getAll()
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Ошибка загрузки аккаунтов'
      error.value = message
      console.error('Failed to fetch accounts:', e)
    } finally {
      isLoading.value = false
    }
  }

  const addAccount = async (data: Omit<Account, 'id'>) => {
    const newAccount = await accountsApi.create(data)
    accounts.value.push(newAccount)
    return newAccount
  }

  const updateAccount = async (id: number, data: Partial<Account>) => {
    const updated = await accountsApi.update(id, data)
    const index = accounts.value.findIndex((a) => a.id === id)
    if (index !== -1) {
      accounts.value[index] = updated
    }
    return updated
  }

  const deleteAccount = async (id: number) => {
    await accountsApi.delete(id)
    accounts.value = accounts.value.filter((a) => a.id !== id)
  }

  // Вычисляемые свойства
  const totalBalance = computed(() =>
    accounts.value.reduce((sum, acc) => sum + acc.balance, 0),
  )

  const accountsByType = (type: AccountType) =>
    computed(() => accounts.value.filter((a) => a.type === type))

  return {
    accounts,
    isLoading,
    error,
    fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    totalBalance,
    accountsByType,
  }
}
