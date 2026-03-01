<template>
  <Card
    class="cursor-pointer w-full border-1 transition-all transition-duration-300 overflow-hidden"
    :class="cardClass"
    :pt="{ root: { class: cardBgClass }, content: { class: 'p-2' }, header: { class: 'pb-0' } }"
    @click="emit('click', table)"
  >
    <template #header>
      <div class="flex align-items-center justify-content-between px-3 pt-3">
        <Tag :severity="statusSeverity" rounded>
          <span class="font-bold text-xs">{{ statusLabel }}</span>
        </Tag>
        <div class="flex align-items-center gap-1">
          <!-- أيقونة التنبيه فوق الكارد -->
          <span v-if="isUrgent" class="flex align-items-center justify-content-center w-2rem h-2rem border-round-full bg-red-500 urgent-bell">
            <i class="fa-solid fa-bell-concierge text-white"></i>
          </span>
          <span v-else-if="hasAlerts" class="flex align-items-center justify-content-center w-2rem h-2rem border-round-full bg-orange-400">
            <i class="pi pi-exclamation-triangle text-white text-xs" />
          </span>
          <span class="text-xs font-bold surface-100 px-2 py-1 border-round">#{{ table.number }}</span>
        </div>
      </div>
    </template>

    <template #content>

      <!-- شكل الطاولة -->
      <div class="flex justify-content-center my-2">
        <div class="flex flex-column align-items-center gap-1">
          <div class="flex gap-1">
            <div
              v-for="i in topChairs" :key="'t'+i"
              class="border-round-top-md border-1"
              :class="chairClass"
              style="width:1rem; height:0.5rem;"
            />
          </div>
          <div
            class="flex align-items-center justify-content-center border-round-lg border-2"
            :class="tableBodyClass"
            style="width:5.5rem; height:3rem;"
          >
            <div class="flex flex-column align-items-center gap-1">
              <i class="pi pi-th-large text-lg" :class="tableIconClass" />
              <span class="text-xs font-bold" :class="tableIconClass">{{ table.name }}</span>
            </div>
          </div>
          <div class="flex gap-1">
            <div
              v-for="i in bottomChairs" :key="'b'+i"
              class="border-round-bottom-md border-1"
              :class="chairClass"
              style="width:1rem; height:0.5rem;"
            />
          </div>
        </div>
      </div>

      <!-- اسم الطاولة -->
      <p class="text-center font-bold text-sm m-0 mb-2" :class="isUrgent || table.status === 'occupied' ? 'text-white' : 'text-900'">
        {{ table.name }}
      </p>

      <Divider class="my-1" :class="isUrgent || table.status === 'occupied' ? 'border-white-alpha-30' : ''" />

      <!-- حجز / متاحة -->
      <div style="min-height: 2.5rem;">
        <div v-if="table.reservation" class="flex align-items-center gap-2">
          <Avatar icon="pi pi-user" shape="circle" size="small"
            :class="isUrgent || table.status === 'occupied' ? 'bg-white-alpha-20 text-white' : ''"
          />
          <div class="flex flex-column overflow-hidden flex-1">
            <span class="text-xs font-semibold white-space-nowrap overflow-hidden text-overflow-ellipsis"
              :class="isUrgent || table.status === 'occupied' ? 'text-white' : 'text-900'">
              {{ table.reservation.guestName }}
            </span>
            <span class="text-xs" :class="isUrgent || table.status === 'occupied' ? 'text-white-alpha-70' : 'text-500'">
              {{ table.reservation.time }}
            </span>
          </div>
        </div>
        <div v-else class="flex align-items-center justify-content-center gap-1 py-1 border-round"
          :class="table.status === 'occupied' ? 'bg-white-alpha-20' : 'bg-green-50'"
        >
          <i class="pi pi-check-circle text-xs" :class="table.status === 'occupied' ? 'text-white' : 'text-green-500'" />
          <span class="text-xs font-semibold" :class="table.status === 'occupied' ? 'text-white' : 'text-green-700'">متاحة</span>
        </div>
      </div>

      <!-- تنبيهات -->
      <div v-if="hasAlerts && !isUrgent" class="flex flex-column gap-1 mt-2">
        <div
          v-for="alert in table.alerts"
          :key="alert"
          class="flex align-items-center gap-1 border-round px-2 py-1 border-1 text-xs font-medium"
          :class="alertClass(alert)"
        >
          <i :class="alertIcon(alert)" style="font-size:0.65rem" />
          <span>{{ alertLabel(alert) }}</span>
        </div>
      </div>

    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Divider from 'primevue/divider'
import type { Table, TableAlert } from '../types/waiter.types'

const props = defineProps<{ table: Table }>()
const emit = defineEmits<{ click: [table: Table] }>()

const topChairs    = computed(() => Math.ceil(props.table.capacity / 2))
const bottomChairs = computed(() => Math.floor(props.table.capacity / 2))
const isUrgent     = computed(() => !!props.table.alerts?.includes('need_waiter'))
const hasAlerts    = computed(() => !!props.table.alerts?.length)

// لون الكارد الكامل
const cardClass = computed(() => {
  if (isUrgent.value) return 'border-red-500 urgent-card'
  if (props.table.status === 'occupied') return 'border-primary shadow-2'
  if (hasAlerts.value) return 'border-orange-400 shadow-2'
  return 'border-200 shadow-1'
})

const cardBgClass = computed(() => {
  if (isUrgent.value) return 'bg-red-500'
  if (props.table.status === 'occupied') return 'bg-primary'
  if (hasAlerts.value) return 'bg-orange-50'
  return ''
})

const chairClass = computed(() => {
  if (isUrgent.value || props.table.status === 'occupied') return 'bg-white-alpha-30 border-white-alpha-40'
  return 'surface-100 surface-border'
})

const tableBodyClass = computed(() => {
  if (isUrgent.value) return 'border-white bg-white-alpha-20'
  if (props.table.status === 'occupied') return 'border-white bg-white-alpha-20'
  if (props.table.status === 'available') return 'border-green-400 bg-green-50'
  return 'border-orange-400 bg-orange-50'
})

const tableIconClass = computed(() => {
  if (isUrgent.value || props.table.status === 'occupied') return 'text-white'
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

function alertIcon(alert: TableAlert) {
  switch (alert) {
    case 'confirm_order': return 'pi pi-check-square text-blue-500'
    case 'new_order':     return 'pi pi-plus-circle text-orange-500'
    case 'need_waiter':   return 'pi pi-bell text-red-500'
  }
}

function alertClass(alert: TableAlert) {
  switch (alert) {
    case 'confirm_order': return 'bg-blue-100 border-blue-200 text-blue-700'
    case 'new_order':     return 'bg-orange-100 border-orange-200 text-orange-700'
    case 'need_waiter':   return 'bg-red-100 border-red-200 text-red-700'
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
.urgent-bell {
  animation: bell-shake 0.5s infinite alternate;
}
@keyframes bell-shake {
  from { transform: rotate(-15deg); }
  to   { transform: rotate(15deg); }
}
</style>