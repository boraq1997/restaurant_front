<template>
  <div
    class="border-round-xl border-1 p-4 cursor-pointer transition-all transition-duration-200 overflow-hidden"
    :class="cardClass"
    @click="emit('click', table)"
  >
    <div class="flex align-items-center justify-content-between">

      <!-- يسار: رقم + اسم + حجز -->
      <div class="flex align-items-center gap-3">

        <!-- أيقونة الطاولة -->
        <div
          class="flex align-items-center justify-content-center border-round-xl border-2 flex-shrink-0"
          :class="tableBodyClass"
          style="width: 3.5rem; height: 3.5rem;"
        >
          <i class="pi pi-th-large text-xl" :class="tableIconClass" />
        </div>

        <div>
          <div class="flex align-items-center gap-2 mb-1">
            <span class="font-bold text-base" :class="isColored ? 'text-white' : 'text-900'">{{ table.name }}</span>
            <Tag :severity="statusSeverity" rounded>
              <span class="text-xs font-bold">{{ statusLabel }}</span>
            </Tag>
          </div>
          <div class="flex align-items-center gap-3">
            <div class="flex align-items-center gap-1">
              <i class="pi pi-users text-xs" :class="isColored ? 'text-white-alpha-70' : 'text-500'" />
              <span class="text-xs" :class="isColored ? 'text-white-alpha-70' : 'text-500'">{{ table.capacity }} أشخاص</span>
            </div>
            <div v-if="table.reservation" class="flex align-items-center gap-1">
              <i class="pi pi-user text-xs" :class="isColored ? 'text-white-alpha-70' : 'text-500'" />
              <span class="text-xs" :class="isColored ? 'text-white-alpha-70' : 'text-500'">{{ table.reservation.guestName }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- يمين: تنبيهات أو سهم -->
      <div class="flex flex-column align-items-end gap-1">
        <i
          v-if="isUrgent"
          class="fa-solid fa-bell text-white text-xl ringing-bell"
        />
        <div v-else-if="table.alerts?.length" class="flex flex-column gap-1">
          <span
            v-for="alert in table.alerts"
            :key="alert"
            class="text-xs px-2 py-1 border-round font-medium"
            :class="alertClass(alert)"
          >
            {{ alertLabel(alert) }}
          </span>
        </div>
        <i v-else class="pi pi-chevron-left text-400" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Tag from 'primevue/tag'
import type { Table, TableAlert } from '../types/waiter.types'

const props = defineProps<{ table: Table }>()
const emit = defineEmits<{ click: [table: Table] }>()

const isUrgent  = computed(() => !!props.table.alerts?.includes('need_waiter'))
const hasAlerts = computed(() => !!props.table.alerts?.length)
const isColored = computed(() => isUrgent.value || props.table.status === 'occupied')

const cardClass = computed(() => {
  if (isUrgent.value)                     return 'bg-red-500 border-red-400 urgent-card'
  if (props.table.status === 'occupied')  return 'bg-primary border-primary shadow-2'
  if (hasAlerts.value)                    return 'bg-orange-50 border-orange-300 shadow-1'
  if (props.table.status === 'reserved')  return 'surface-card border-orange-200'
  return 'surface-card border-200'
})

const tableBodyClass = computed(() => {
  if (isUrgent.value || props.table.status === 'occupied') return 'border-white bg-white-alpha-20'
  if (props.table.status === 'available') return 'border-green-400 bg-green-50'
  return 'border-orange-400 bg-orange-50'
})

const tableIconClass = computed(() => {
  if (isColored.value) return 'text-white'
  if (props.table.status === 'available') return 'text-green-600'
  return 'text-orange-600'
})

const statusSeverity = computed(() => {
  switch (props.table.status) {
    case 'available': return 'success'
    case 'occupied':  return 'danger'
    case 'reserved':  return 'warn'
    default: return 'info'
  }
})

const statusLabel = computed(() => {
  switch (props.table.status) {
    case 'available': return 'متاحة'
    case 'occupied':  return 'مشغولة'
    case 'reserved':  return 'محجوزة'
    default: return ''
  }
})

function alertLabel(alert: TableAlert) {
  switch (alert) {
    case 'confirm_order': return 'تأكيد الطلب'
    case 'new_order':     return 'طلب جديد'
    case 'need_waiter':   return 'يحتاج ويتر'
  }
}

function alertClass(alert: TableAlert) {
  switch (alert) {
    case 'confirm_order': return 'bg-blue-100 text-blue-700'
    case 'new_order':     return 'bg-orange-100 text-orange-700'
    case 'need_waiter':   return 'bg-red-100 text-red-700'
  }
}
</script>

<style scoped>
.urgent-card {
  animation: urgent-pulse 1.5s infinite;
}
@keyframes urgent-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.5); }
  50%  { box-shadow: 0 0 16px 6px rgba(220, 38, 38, 0); }
  100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
}
.ringing-bell {
  display: inline-block;
  transform-origin: top center;
  animation: bell-ring 1.2s ease-in-out infinite;
}
@keyframes bell-ring {
  0%, 100% { transform: rotate(0deg); }
  20%       { transform: rotate(18deg); }
  40%       { transform: rotate(-18deg); }
  60%       { transform: rotate(10deg); }
  80%       { transform: rotate(-10deg); }
}
</style>