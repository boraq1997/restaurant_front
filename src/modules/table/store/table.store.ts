import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tableApi } from '../api/table.api'
import { TableStatus } from '../../../types/api.types'
import type { Table } from '../../../types/table.types'

export const useTableStore = defineStore('table', () => {
  const tables = ref<Table[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // فلترة حسب الحالة
  const availableTables = computed(() =>
    tables.value.filter(t => t.status === TableStatus.Available)
  )
  const occupiedTables = computed(() =>
    tables.value.filter(t => t.status === TableStatus.Occupied)
  )
  const reservedTables = computed(() =>
    tables.value.filter(t => t.status === TableStatus.Reserved)
  )
  const waitingTables = computed(() =>
    tables.value.filter(t => t.status === TableStatus.Waiting)
  )

  const tableById = (id: number) =>
    computed(() => tables.value.find(t => t.id === id))

  async function fetchTables() {
    loading.value = true
    error.value = null
    try {
      tables.value = await tableApi.getAll()
    } catch (e: any) {
      error.value = e?.message ?? 'فشل تحميل الطاولات'
    } finally {
      loading.value = false
    }
  }

  async function fetchTableInvoices(tableId: number) {
    try {
      return await tableApi.getInvoices(tableId)
    } catch (e: any) {
      error.value = e?.message ?? 'فشل تحميل الفواتير'
      return null
    }
  }

  async function mergeTables(sourceTableId: number, targetTableId: number) {
    try {
      await tableApi.merge({ sourceTableId, targetTableId })
      await fetchTables() // تحديث القائمة
    } catch (e: any) {
      error.value = e?.message ?? 'فشل دمج الطاولات'
    }
  }

  return {
    tables, loading, error,
    availableTables, occupiedTables, reservedTables, waitingTables,
    tableById,
    fetchTables, fetchTableInvoices, mergeTables,
  }
})