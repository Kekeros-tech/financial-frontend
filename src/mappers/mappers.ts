import { z } from 'zod'
import type { Transaction } from '@/types/api'
import type { TransactionView } from '@/types/index'

// Схема для проверки и парсинга parameters
const TransactionParametersSchema = z
  .object({
    amount: z
      .union([z.string(), z.number()])
      .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
      .refine((val) => !isNaN(val), { message: 'Amount must be a valid number' }),

    type: z.enum(['income', 'expense']),
    category: z.string(),
    date: z
      .union([z.iso.datetime(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.instanceof(Date)])
      .transform((val) => {
        if (val instanceof Date) return val.toISOString()
        if (typeof val === 'string') return val
        return String(val)
      }),
    description: z.string().optional(),
  })
  .catchall(z.any())

// Схема для всей транзакции
const RawTransactionSchema = z.object({
  id: z.string(),
  parameters: TransactionParametersSchema,
})

// Функция преобразования
export function mapToTransactionView(raw: Transaction): TransactionView {
  const parsed = RawTransactionSchema.parse(raw)

  return {
    id: parsed.id,
    amount: parsed.parameters.amount,
    type: parsed.parameters.type,
    category: parsed.parameters.category,
    date: parsed.parameters.date,
    description: parsed.parameters.description,
  }
}
