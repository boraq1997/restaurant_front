<!-- src/modules/dashboard/orders/components/OrdersHeader.vue -->
<template>
  <div class="surface-card border-bottom-1 border-200 px-4 py-3 sticky top-0 z-5 shadow-1">
    <div class="flex align-items-center justify-content-between flex-wrap gap-3">

      <!-- العنوان -->
      <div class="flex align-items-center gap-3">
        <div class="w-2rem h-2rem border-round-lg bg-primary flex align-items-center justify-content-center flex-shrink-0">
          <i class="pi pi-history text-white text-sm" />
        </div>
        <div>
          <h1 class="font-bold text-900 text-lg m-0 line-height-1">سجل الطلبات</h1>
          <span class="text-xs text-500">
            {{ totalRecords > 0 ? `${totalRecords.toLocaleString()} فاتورة إجمالاً` : 'جارٍ التحميل...' }}
          </span>
        </div>
      </div>

      <!-- إحصائيات سريعة -->
      <div class="flex gap-2 overflow-x-auto" style="scrollbar-width:none">
        <div
          v-for="stat in quickStats"
          :key="stat.key"
          class="stat-card flex align-items-center gap-2 px-3 py-2 border-round-xl border-1 flex-shrink-0 cursor-pointer transition-all transition-duration-200"
          :class="activeStatus === stat.statusValue
            ? `${stat.activeBg} ${stat.activeBorder}`
            : 'surface-card border-200 hover:surface-100'"
          @click="$emit('filterStatus', stat.statusValue)"
        >
          <i :class="[stat.icon, stat.iconColor]" style="font-size: 0.85rem" />
          <div class="flex flex-column">
            <span class="text-xs text-500">{{ stat.label }}</span>
            <span class="font-bold text-sm text-900 line-height-1">{{ stat.count.toLocaleString() }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStats } from '../types/orders.types'

const props = defineProps<{
  totalRecords: number
  stats:        OrderStats
  activeStatus: string | null
}>()

defineEmits<{
  filterStatus: [value: string | null]
}>()

const quickStats = computed(() => [
  {
    key: 'pending', label: 'مفتوح', statusValue: 'Pending',
    count: props.stats.pending,
    icon: 'pi pi-clock', iconColor: 'text-blue-500',
    activeBg: 'bg-blue-50', activeBorder: 'border-blue-300',
  },
  {
    key: 'paid', label: 'مدفوع', statusValue: 'Paid',
    count: props.stats.paid,
    icon: 'pi pi-check-circle', iconColor: 'text-green-500',
    activeBg: 'bg-green-50', activeBorder: 'border-green-300',
  },
  {
    key: 'cancelled', label: 'ملغى', statusValue: 'Cancelled',
    count: props.stats.cancelled,
    icon: 'pi pi-times-circle', iconColor: 'text-red-500',
    activeBg: 'bg-red-50', activeBorder: 'border-red-300',
  },
  {
    key: 'total', label: 'الكل', statusValue: null,
    count: props.stats.total,
    icon: 'pi pi-chart-bar', iconColor: 'text-primary',
    activeBg: 'bg-primary-50', activeBorder: 'border-primary-300',
  },
])
</script>

<style scoped>
.stat-card { transition: all 0.2s ease; }
</style>