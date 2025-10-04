<template>
  <div class="transaction-form">
    <h3 class="form-title">Добавить операцию</h3>

    <!-- Сообщения об ошибках -->
    <div v-if="hasError" class="error-message">
      <span class="error-icon">⚠</span>
      <div class="error-content">
        <strong>Ошибка:</strong>
        <p>{{ error }}</p>
      </div>
    </div>

    <!-- Форма -->
    <form
      @submit.prevent="submitForm"
      class="transaction-form__form"
      :class="{ 'form-loading': loading }"
    >
      <!-- Тип операции -->
      <div class="form-group">
        <label class="form-label">Тип операции:</label>
        <div class="radio-group">
          <label class="radio-option" :class="{ 'radio-selected': form.type === 'income' }">
            <input
              type="radio"
              v-model="form.type"
              value="income"
              class="radio-input"
              :disabled="loading"
            />
            <span class="radio-custom income-radio"></span>
            <span class="radio-label">Доход</span>
          </label>
          <label class="radio-option" :class="{ 'radio-selected': form.type === 'expense' }">
            <input
              type="radio"
              v-model="form.type"
              value="expense"
              class="radio-input"
              :disabled="loading"
            />
            <span class="radio-custom expense-radio"></span>
            <span class="radio-label">Расход</span>
          </label>
        </div>
      </div>

      <!-- Сумма -->
      <div class="form-group">
        <label for="amount" class="form-label">Сумма:</label>
        <div class="input-with-icon">
          <span class="input-icon">₽</span>
          <input
            id="amount"
            type="number"
            v-model.number="form.amount"
            placeholder="0.00"
            class="form-input"
            required
            min="0"
            step="0.01"
            :disabled="loading"
          />
        </div>
      </div>

      <!-- Категория -->
      <div class="form-group">
        <label for="category" class="form-label">Категория:</label>
        <div class="select-wrapper">
          <select
            id="category"
            v-model="form.category"
            class="form-select"
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

      <!-- Описание -->
      <div class="form-group">
        <label for="description" class="form-label">Описание:</label>
        <textarea
          id="description"
          v-model="form.description"
          placeholder="Введите описание операции..."
          rows="3"
          class="form-textarea"
          :disabled="loading"
        ></textarea>
        <div class="char-counter" v-if="form.description.length > 0">
          {{ form.description.length }}/200
        </div>
      </div>

      <!-- Дата -->
      <div class="form-group">
        <label for="date" class="form-label">Дата:</label>
        <input
          id="date"
          type="date"
          v-model="form.date"
          class="form-input"
          required
          :disabled="loading"
        />
      </div>

      <!-- Кнопка отправки -->
      <button
        type="submit"
        class="submit-button"
        :disabled="loading || !isFormValid"
        :class="{
          'button-loading': loading,
          'button-disabled': !isFormValid,
        }"
      >
        <span v-if="!loading" class="button-content">
          <span class="button-icon">+</span>
          Добавить операцию
        </span>
        <span v-else class="button-content">
          <span class="loading-spinner"></span>
          Добавление...
        </span>
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue'
import { useFinancialStore } from '@/stores/financialStore'
import { TransactionParameters } from '@/types/api'

export default defineComponent({
  name: 'TransactionForm',

  setup() {
    const financialStore = useFinancialStore()

    const form = reactive<TransactionParameters>({
      type: 'expense',
      amount: 0,
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    })

    const categories = computed(() => financialStore.categories)
    const loading = computed(() => financialStore.isLoading)
    const hasError = computed(() => financialStore.hasError)
    const error = computed(() => financialStore.error)

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
      } catch (error) {
        console.error('Error in form submission:', error)
      }
    }

    return {
      form,
      categories,
      loading,
      hasError,
      error,
      isFormValid,
      submitForm,
    }
  },
})
</script>

<style scoped>
.transaction-form {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e1e5e9;
}

.form-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
}

/* Сообщения об ошибках */
.error-message {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  color: #dc2626;
}

.error-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.error-content {
  flex: 1;
}

.error-content strong {
  display: block;
  margin-bottom: 0.25rem;
}

.error-content p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Группы формы */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

/* Радио кнопки */
.radio-group {
  display: flex;
  gap: 1rem;
  background: #f8fafc;
  padding: 0.5rem;
  border-radius: 8px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  border: 2px solid transparent;
}

.radio-option:hover {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.radio-selected {
  background: white;
  border-color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

.income-radio.radio-custom {
  border-color: #10b981;
}

.expense-radio.radio-custom {
  border-color: #ef4444;
}

.radio-selected .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.radio-selected .income-radio::after {
  background: #10b981;
}

.radio-selected .expense-radio::after {
  background: #ef4444;
}

.radio-label {
  font-weight: 500;
  color: #374151;
}

/* Поля ввода */
.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  color: #1a1a1a;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #9ca3af;
}

/* Поле с иконкой */
.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-weight: 500;
}

.input-with-icon .form-input {
  padding-left: 2.5rem;
}

/* Выпадающий список */
.select-wrapper {
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

/* Текстовое поле */
.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.char-counter {
  text-align: right;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Кнопка отправки */
.submit-button {
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-button:hover:not(.button-disabled):not(.button-loading) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-button:active:not(.button-disabled):not(.button-loading) {
  transform: translateY(0);
}

.button-disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.button-loading {
  background: #9ca3af;
  cursor: wait;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-icon {
  font-size: 1.2rem;
  font-weight: 300;
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

.form-loading .form-input,
.form-loading .form-select,
.form-loading .form-textarea,
.form-loading .radio-option {
  cursor: wait;
}

/* Адаптивность */
@media (max-width: 768px) {
  .transaction-form {
    padding: 1rem;
  }

  .radio-group {
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-title {
    font-size: 1.1rem;
  }
}

/* Темная тема (опционально) */
@media (prefers-color-scheme: dark) {
  .transaction-form {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;
  }

  .form-title {
    color: #f9fafb;
  }

  .form-label {
    color: #d1d5db;
  }

  .form-input,
  .form-select,
  .form-textarea {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .radio-group {
    background: #374151;
  }

  .radio-option {
    color: #d1d5db;
  }

  .radio-selected {
    background: #4b5563;
  }
}
</style>
