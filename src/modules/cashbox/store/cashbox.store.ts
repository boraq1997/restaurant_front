import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cashboxApi } from '../api/cashbox.api'
import { TransactionType } from '../../../types/api.types'
import type { OpenSessionDto, CloseSessionDto } from '../../../types/cashbox.types'

export const useCashboxStore = defineStore('cashbox', () => {
  const activeSession = ref<any | null>(null)
  const transactions = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchActiveSession() {
    try {
      activeSession.value = await cashboxApi.getActiveSession()
    } catch {
      activeSession.value = null
    }
  }

  async function openSession(data: OpenSessionDto) {
    loading.value = true
    try {
      activeSession.value = await cashboxApi.openSession(data)
    } catch (e: any) {
      error.value = e?.message ?? 'فشل فتح الجلسة'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function closeSession(data: CloseSessionDto) {
    loading.value = true
    try {
      await cashboxApi.closeSession(data)
      activeSession.value = null
    } catch (e: any) {
      error.value = e?.message ?? 'فشل إغلاق الجلسة'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchTransactions(sessionId: number) {
    try {
      transactions.value = await cashboxApi.getSessionTransactions(sessionId)
    } catch (e: any) {
      error.value = e?.message ?? 'فشل تحميل المعاملات'
    }
  }

  return {
    activeSession, transactions, loading, error,
    fetchActiveSession, openSession, closeSession, fetchTransactions,
  }
});