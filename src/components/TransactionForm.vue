<template>
  <div class="transaction-form-vertical">
    <form @submit.prevent="submitForm" class="vertical-form" :class="{ 'form-loading': loading }">
      <!-- Тип операции -->
      <div class="form-group vertical">
        <label class="form-label">Тип операции</label>
        <div class="radio-group vertical">
          <label
            class="radio-option vertical"
            :class="{ 'radio-selected': form.type === 'income' }"
          >
            <input
              type="radio"
              v-model="form.type"
              value="income"
              class="radio-input"
              :disabled="loading"
            />
            <span class="radio-custom"></span>
            <span class="radio-text">Доход</span>
          </label>
          <label
            class="radio-option vertical"
            :class="{ 'radio-selected': form.type === 'expense' }"
          >
            <input
              type="radio"
              v-model="form.type"
              value="expense"
              class="radio-input"
              :disabled="loading"
            />
            <span class="radio-custom"></span>
            <span class="radio-text">Расход</span>
          </label>
        </div>
      </div>

      <!-- Сумма -->
      <div class="form-group vertical">
        <label for="amount" class="form-label">Сумма</label>
        <div class="input-with-icon vertical">
          <span class="input-icon">₽</span>
          <input
            id="amount"
            type="number"
            v-model.number="form.amount"
            placeholder="0.00"
            class="form-input vertical"
            required
            min="0"
            step="0.01"
            :disabled="loading"
          />
        </div>
      </div>

      <!-- Категория -->
      <div class="form-group vertical">
        <label for="category" class="form-label">Категория</label>
        <div class="select-wrapper vertical">
          <select
            id="category"
            v-model="form.category"
            class="form-select vertical"
            required
            :disabled="loading"
          >
            <option value="" disabled>Выберите категорию</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <span class="select-arrow">▼</span>
        </div>
      </div>

      <!-- Дата -->
      <div class="form-group vertical">
        <label for="date" class="form-label">Дата</label>
        <input
          id="date"
          type="date"
          v-model="form.date"
          class="form-input vertical"
          required
          :disabled="loading"
        />
      </div>

      <!-- Описание -->
      <div class="form-group vertical">
        <label for="description" class="form-label">Описание</label>
        <input
          id="description"
          type="text"
          v-model="form.description"
          placeholder="Введите описание операции..."
          class="form-input vertical"
          :disabled="loading"
        />
      </div>

      <!-- Кнопки -->
      <div class="form-actions vertical">
        <button
          type="button"
          @click="handleCancel"
          class="cancel-button vertical"
          :disabled="loading"
        >
          Отмена
        </button>
        <button
          type="submit"
          class="submit-button vertical"
          :disabled="loading || !isFormValid"
          :class="{
            'button-loading': loading,
            'button-disabled': !isFormValid,
          }"
        >
          <span v-if="!loading" class="button-content"> Добавить операцию </span>
          <span v-else class="button-content">
            <span class="loading-spinner"></span>
            Добавление...
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue'
import { useFinancialStore } from '@/stores/financialStore'
import { TransactionFormData } from '@/types'

export default defineComponent({
  name: 'TransactionForm',

  emits: ['success', 'cancel'],

  setup(props, { emit }) {
    const financialStore = useFinancialStore()

    const form = reactive<TransactionFormData>({
      type: 'expense',
      amount: 0,
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    })

    const categories = computed(() => financialStore.categories)
    const loading = computed(() => financialStore.isLoading)

    const isFormValid = computed(() => {
      return form.amount > 0 && form.category !== '' && form.date !== ''
    })

    const submitForm = async (): Promise<void> => {
      if (!isFormValid.value) return

      try {
        await financialStore.addTransaction({ ...form })

        // Сброс формы
        form.type = 'expense'
        form.amount = 0
        form.category = ''
        form.description = ''
        form.date = new Date().toISOString().split('T')[0]

        // Отправляем событие успеха
        emit('success')
      } catch (error) {
        console.error('Error in form submission:', error)
      }
    }

    const handleCancel = (): void => {
      emit('cancel')
    }

    return {
      form,
      categories,
      loading,
      isFormValid,
      submitForm,
      handleCancel,
    }
  },
})
</script>

<style scoped>
.transaction-form-vertical {
  width: 100%;
}

.vertical-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Вертикальные группы формы */
.form-group.vertical {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

/* Вертикальные радио-кнопки */
.radio-group.vertical {
  display: flex;
  gap: 0.75rem;
}

.radio-option.vertical {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  background: white;
}

.radio-option.vertical:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.radio-option.vertical.radio-selected {
  border-color: #667eea;
  background: #f0f4ff;
}

.radio-option.vertical.radio-selected .radio-text {
  color: #667eea;
  font-weight: 600;
}

.radio-input {
  display: none;
}

.radio-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s ease;
}

.radio-option.vertical.radio-selected .radio-custom {
  border-color: #667eea;
  background: #667eea;
}

.radio-option.vertical.radio-selected .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: white;
}

.radio-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #4b5563;
  transition: color 0.2s ease;
}

/* Вертикальные поля ввода */
.form-input.vertical,
.form-select.vertical {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.2s ease;
  color: #1a1a1a;
}

.form-input.vertical:focus,
.form-select.vertical:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.vertical::placeholder {
  color: #9ca3af;
}

/* Поле с иконкой */
.input-with-icon.vertical {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-weight: 600;
  font-size: 1rem;
}

.input-with-icon.vertical .form-input.vertical {
  padding-left: 2.5rem;
}

/* Выпадающий список */
.select-wrapper.vertical {
  position: relative;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
  font-size: 0.8rem;
}

/* Вертикальные кнопки */
.form-actions.vertical {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.cancel-button.vertical {
  flex: 1;
  padding: 0.875rem 1rem;
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button.vertical:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.cancel-button.vertical:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-button.vertical {
  flex: 2;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-button.vertical:hover:not(.button-disabled):not(.button-loading) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.submit-button.vertical:active:not(.button-disabled):not(.button-loading) {
  transform: translateY(0);
}

.button-disabled {
  background: #9ca3af !important;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.button-loading {
  background: #9ca3af !important;
  cursor: wait;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Состояние загрузки формы */
.form-loading {
  opacity: 0.7;
  pointer-events: none;
}

.form-loading .form-input.vertical,
.form-loading .form-select.vertical,
.form-loading .radio-option.vertical {
  cursor: wait;
}

/* Адаптивность */
@media (max-width: 480px) {
  .vertical-form {
    gap: 1rem;
  }

  .form-group.vertical {
    gap: 0.5rem;
  }

  .radio-group.vertical {
    gap: 0.5rem;
  }

  .radio-option.vertical {
    padding: 0.6rem 0.75rem;
  }

  .form-input.vertical,
  .form-select.vertical {
    padding: 0.6rem 0.75rem;
    font-size: 0.9rem;
  }

  .input-with-icon.vertical .form-input.vertical {
    padding-left: 2.25rem;
  }

  .input-icon {
    left: 0.75rem;
  }

  .select-arrow {
    right: 0.75rem;
  }

  .form-actions.vertical {
    flex-direction: column;
    gap: 0.5rem;
  }

  .cancel-button.vertical,
  .submit-button.vertical {
    flex: none;
    width: 100%;
    padding: 0.75rem 1rem;
  }
}
</style>
