// src/modules/dashboard/orders/store/orders.store.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { orderApi } from '../../../../services/api.service'
import type { OrderDto, OrderFilters, OrderStats } from '../types/orders.types'

export const useOrdersStore = defineStore('dashboard-orders', () => {

  // ── State ────────────────────────────────────────────
  const orders       = ref<OrderDto[]>([])
  const loading      = ref(false)
  const totalRecords = ref(0)
  const totalPages   = ref(1)
  const currentPage  = ref(1)
  const pageSize     = ref(15)

  const stats = ref<OrderStats>({
    total: 0, pending: 0, paid: 0, cancelled: 0,
  })

  const filters = ref<OrderFilters>({
    startDate: null,
    endDate:   null,
    status:    null,
    tableId:   null,
  })

  // ── Pagination computed ───────────────────────────────
  const visiblePages = computed(() => {
    const total   = totalPages.value
    const current = currentPage.value
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const pages: (number | string)[] = [1]
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
    return pages
  })

  // ── Fetch Orders ──────────────────────────────────────
  async function fetchOrders(page: number = 1) {
    loading.value     = true
    currentPage.value = page
    try {
      const params: Record<string, any> = {
        PageNumber: page,
        PageSize:   pageSize.value,
      }
      if (filters.value.startDate) params.StartDate = toDateStr(filters.value.startDate)
      if (filters.value.endDate)   params.EndDate   = toDateStr(filters.value.endDate)
      if (filters.value.status)    params.Status    = filters.value.status
      if (filters.value.tableId)   params.TableId   = filters.value.tableId

      const res = await orderApi.getHistory(params)

      orders.value       = res?.items       ?? []
      totalRecords.value = res?.totalCount  ?? orders.value.length
      totalPages.value   = res?.totalPages  ?? Math.max(1, Math.ceil(totalRecords.value / pageSize.value))
      currentPage.value  = res?.currentPage ?? page
    } catch {
      orders.value = []
    } finally {
      loading.value = false
    }
  }

  // ── Fetch Stats ───────────────────────────────────────
  async function fetchStats() {
    try {
      const [allRes, pendingRes, paidRes, cancelledRes] = await Promise.all([
        orderApi.getHistory({ PageSize: 1 }),
        orderApi.getHistory({ PageSize: 1, Status: 'Pending'   }),
        orderApi.getHistory({ PageSize: 1, Status: 'Paid'      }),
        orderApi.getHistory({ PageSize: 1, Status: 'Cancelled' }),
      ])
      stats.value = {
        total:     allRes?.totalCount       ?? 0,
        pending:   pendingRes?.totalCount   ?? 0,
        paid:      paidRes?.totalCount      ?? 0,
        cancelled: cancelledRes?.totalCount ?? 0,
      }
    } catch { /* تجاهل */ }
  }

  // ── Actions ───────────────────────────────────────────
  function resetFilters() {
    filters.value = { startDate: null, endDate: null, status: null, tableId: null }
    fetchOrders(1)
  }

  function toggleStatusFilter(value: string | null) {
    filters.value.status = filters.value.status === value ? null : value
    fetchOrders(1)
  }

  function setPageSize(size: number) {
    pageSize.value = size
    fetchOrders(1)
  }

  // ── Helper ────────────────────────────────────────────
  function toDateStr(d: Date) {
    return d.toISOString().split('T')[0]
  }

  return {
    // state
    orders, loading, totalRecords, totalPages, currentPage, pageSize, stats, filters,
    // computed
    visiblePages,
    // actions
    fetchOrders, fetchStats, resetFilters, toggleStatusFilter, setPageSize,
  }
})