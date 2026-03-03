import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import WaiterApi from '../api/waiter.api'
import { mapTable } from '../types/waiter.types'
import type { Table, TableStatusUI } from '../types/waiter.types'

export const useWaiterStore = defineStore('waiter', () => {
  const tables  = ref<Table[]>([])
  const loading = ref(false)
  const error   = ref<string | null>(null)

  // ── جلب الطاولات ──────────────────────────────────
  async function fetchTables() {
    loading.value = true
    error.value   = null
    try {
      const data = await WaiterApi.getTables()
      tables.value = data.map(mapTable)
    } catch (e: any) {
      error.value = e?.response?.data?.message || 'فشل تحميل الطاولات'
    } finally {
      loading.value = false
    }
  }

  // ── Computed ───────────────────────────────────────
  const availableCount = computed(
    () => tables.value.filter(t => t.status === 'available').length
  )
  const occupiedCount = computed(
    () => tables.value.filter(t => t.status === 'occupied').length
  )
  const reservedCount = computed(
    () => tables.value.filter(t => t.status === 'reserved').length
  )

  function filteredTables(filter: TableStatusUI | null): Table[] {
    return filter ? tables.value.filter(t => t.status === filter) : tables.value
  }

  return {
    tables,
    loading,
    error,
    fetchTables,
    availableCount,
    occupiedCount,
    reservedCount,
    filteredTables,
  }
})