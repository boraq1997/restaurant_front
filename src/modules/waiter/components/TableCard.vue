<!-- src/modules/waiter/components/TableCard.vue -->
<template>
  <Card
    class="cursor-pointer w-full border-1 transition-all overflow-hidden"
    :class="cardClass"
    :pt="{ root: { class: cardBgClass }, content: { class: 'p-2' }, header: { class: 'pb-0' } }"
    @click="emit('click', table)"
  >
    <template #header>
      <div class="flex align-items-center justify-content-between px-3 pt-3">
        <!-- Status tag -->
        <Tag :severity="statusSeverity" rounded>
          <span class="font-bold text-xs">{{ statusLabel }}</span>
        </Tag>

        <div class="flex align-items-center gap-1">
          <span v-if="isUrgent"
            class="flex align-items-center justify-content-center w-2rem h-2rem border-round-full bg-red-500 urgent-bell">
            <i class="fa-solid fa-bell-concierge text-white" />
          </span>
          <span v-else-if="hasAlerts"
            class="flex align-items-center justify-content-center w-2rem h-2rem border-round-full bg-orange-400">
            <i class="pi pi-exclamation-triangle text-white text-xs" />
          </span>
          <span class="text-xs font-bold surface-100 px-2 py-1 border-round">#{{ table.number }}</span>
        </div>
      </div>
    </template>

    <template #content>

      <!-- ══════════════════════════════════════
           الطاولة الرئيسية المدمجة
           ══════════════════════════════════════ -->
      <div v-if="isMergedPrimary" class="merged-primary-body">

        <!-- أيقونة الدمج مع عدد الطاولات -->
        <div class="mp-icon-row">
          <div class="mp-icon-wrap">
            <!-- مجموعة مربعات صغيرة تمثل الطاولات -->
            <div class="mp-squares">
              <div class="mp-sq mp-sq--main" />
              <div
                v-for="i in Math.min(table.mergedTables?.length ?? 0, 3)"
                :key="i"
                class="mp-sq mp-sq--sub"
              />
            </div>
            <i class="pi pi-link mp-link-icon" />
          </div>
          <div class="mp-counts">
            <span class="mp-count-num">{{ (table.mergedTables?.length ?? 0) + 1 }}</span>
            <span class="mp-count-label">طاولات</span>
          </div>
          <div class="mp-counts">
            <span class="mp-count-num">{{ totalMergedCapacity }}</span>
            <span class="mp-count-label">كرسي</span>
          </div>
        </div>

        <!-- اسم الطاولة الرئيسية -->
        <p class="mp-name">
          <i class="pi pi-flag-fill mp-flag" />
          {{ table.name }}
        </p>

        <div class="mp-divider" />

        <!-- الطاولات المدمجة معها -->
        <div class="mp-subs-label">مدمجة مع:</div>
        <div class="mp-subs">
          <div
            v-for="mt in table.mergedTables"
            :key="mt.id"
            class="mp-sub-item"
          >
            <span class="mp-sub-num">#{{ mt.number }}</span>
            <span class="mp-sub-name">{{ mt.name?.trim() ? mt.name : `طاولة ${mt.number}` }}</span>
            <span class="mp-sub-cap">{{ mt.capacity }}<i class="pi pi-user" style="font-size:0.5rem" /></span>
          </div>
        </div>

      </div>

      <!-- ══════════════════════════════════════
           الطاولة الثانوية (مدمجة مع رئيسية)
           ══════════════════════════════════════ -->
      <div v-else-if="isMergedSecondary" class="merged-secondary-body">

        <!-- شكل الطاولة مع سهم يشير للرئيسية -->
        <div class="ms-visual">
          <div class="ms-table-icon">
            <i class="pi pi-th-large" />
          </div>
          <div class="ms-arrow">
            <i class="pi pi-arrow-left" />
          </div>
          <div class="ms-primary-icon">
            <i class="pi pi-flag-fill" />
          </div>
        </div>

        <p class="ms-name">{{ table.name }}</p>

        <div class="ms-linked-to">
          <i class="pi pi-link ms-link-icon" />
          <span class="ms-linked-label">مدمجة مع</span>
          <span class="ms-primary-name">
            {{ `طاولة ${table.primaryTableNumber}` }}
          </span>
        </div>

      </div>

      <!-- ══════════════════════════════════════
           الطاولة العادية
           ══════════════════════════════════════ -->
      <div v-else>
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

        <p class="text-center font-bold text-sm m-0 mb-2"
          :class="isUrgent || table.status === 'occupied' ? 'text-white' : 'text-900'">
          {{ table.name }}
        </p>

        <Divider class="my-1"
          :class="(isUrgent || table.status === 'occupied') ? 'border-white-alpha-30' : ''" />

        <div style="min-height:2.5rem">
          <!-- حجز -->
          <div v-if="table.reservation" class="flex align-items-center gap-2">
            <Avatar icon="pi pi-user" shape="circle" size="small"
              :class="isUrgent || table.status === 'occupied' ? 'bg-white-alpha-20 text-white' : ''" />
            <div class="flex flex-column overflow-hidden flex-1">
              <span class="text-xs font-semibold white-space-nowrap overflow-hidden text-overflow-ellipsis"
                :class="isUrgent || table.status === 'occupied' ? 'text-white' : 'text-900'">
                {{ table.reservation.guestName }}
              </span>
              <span class="text-xs"
                :class="isUrgent || table.status === 'occupied' ? 'text-white-alpha-70' : 'text-500'">
                {{ table.reservation.time }}
              </span>
            </div>
          </div>
          <!-- متاحة -->
          <div v-else class="flex align-items-center justify-content-center gap-1 py-1 border-round"
            :class="table.status === 'occupied' ? 'bg-white-alpha-20' : 'bg-green-50'">
            <i class="pi pi-check-circle text-xs"
              :class="table.status === 'occupied' ? 'text-white' : 'text-green-500'" />
            <span class="text-xs font-semibold"
              :class="table.status === 'occupied' ? 'text-white' : 'text-green-700'">متاحة</span>
          </div>
        </div>

        <!-- تنبيهات -->
        <div v-if="hasAlerts && !isUrgent" class="flex flex-column gap-1 mt-2">
          <div
            v-for="alert in table.alerts" :key="alert"
            class="flex align-items-center gap-1 border-round px-2 py-1 border-1 text-xs font-medium"
            :class="alertClass(alert)"
          >
            <i :class="alertIcon(alert)" style="font-size:0.65rem" />
            <span>{{ alertLabel(alert) }}</span>
          </div>
        </div>
      </div>

    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card    from 'primevue/card'
import Tag     from 'primevue/tag'
import Avatar  from 'primevue/avatar'
import Divider from 'primevue/divider'
import type { Table, TableAlert } from '../types/waiter.types'

const props = defineProps<{ table: Table }>()
const emit  = defineEmits<{ click: [table: Table] }>()

// ── حالة الدمج ──────────────────────────────────────
const isMergedPrimary   = computed(() =>
  props.table.status === 'merged' && props.table.primaryTableId === null
)
const isMergedSecondary = computed(() =>
  props.table.status === 'merged' && props.table.primaryTableId !== null
)

const totalMergedCapacity = computed(() =>
  props.table.capacity +
  (props.table.mergedTables?.reduce((s, m) => s + (m.capacity ?? 0), 0) ?? 0)
)

// ── عام ─────────────────────────────────────────────
const topChairs    = computed(() => Math.ceil(props.table.capacity / 2))
const bottomChairs = computed(() => Math.floor(props.table.capacity / 2))
const isUrgent     = computed(() => !!props.table.alerts?.includes('need_waiter'))
const hasAlerts    = computed(() => !!props.table.alerts?.length)

const cardClass = computed(() => {
  if (isMergedPrimary.value)   return 'border-purple-500 shadow-3 merged-primary-card'
  if (isMergedSecondary.value) return 'border-purple-300 shadow-1 merged-secondary-card'
  if (isUrgent.value)          return 'border-red-500 urgent-card'
  if (props.table.status === 'occupied') return 'border-primary shadow-2'
  if (hasAlerts.value)                   return 'border-orange-400 shadow-2'
  return 'border-200 shadow-1'
})

const cardBgClass = computed(() => {
  if (isMergedPrimary.value)   return 'bg-purple-600'
  if (isMergedSecondary.value) return 'bg-purple-100'
  if (isUrgent.value)          return 'bg-red-500'
  if (props.table.status === 'occupied') return 'bg-primary'
  if (hasAlerts.value)                   return 'bg-orange-50'
  return ''
})

const chairClass = computed(() =>
  isUrgent.value || props.table.status === 'occupied'
    ? 'bg-white-alpha-30 border-white-alpha-40'
    : 'surface-100 surface-border'
)
const tableBodyClass = computed(() => {
  if (isUrgent.value)                        return 'border-white bg-white-alpha-20'
  if (props.table.status === 'occupied')     return 'border-white bg-white-alpha-20'
  if (props.table.status === 'available')    return 'border-green-400 bg-green-50'
  return 'border-orange-400 bg-orange-50'
})
const tableIconClass = computed(() => {
  if (isUrgent.value || props.table.status === 'occupied') return 'text-white'
  if (props.table.status === 'available') return 'text-green-600'
  return 'text-orange-600'
})

const statusSeverity = computed(() => {
  if (isMergedPrimary.value)   return 'secondary' as const
  if (isMergedSecondary.value) return 'secondary' as const
  switch (props.table.status) {
    case 'available': return 'success' as const
    case 'occupied':  return 'danger'  as const
    case 'reserved':  return 'warn'    as const
    default:          return 'info'    as const
  }
})
const statusLabel = computed(() => {
  if (isMergedPrimary.value)   return 'رئيسية'
  if (isMergedSecondary.value) return 'ثانوية'
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
/* ── Merged Primary Card ─────────────────────────── */
.merged-primary-card {
  animation: primary-pulse 2.5s ease-in-out infinite;
}
@keyframes primary-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(147,51,234,.35); }
  50%     { box-shadow: 0 0 14px 5px rgba(147,51,234,0); }
}

.merged-primary-body {
  padding: 4px 2px 2px;
}

/* icon row */
.mp-icon-row {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 8px;
}
.mp-icon-wrap {
  position: relative; width: 46px; height: 46px; flex-shrink: 0;
}
.mp-squares {
  display: grid; grid-template-columns: 1fr 1fr; gap: 3px;
  width: 100%; height: 100%;
}
.mp-sq {
  border-radius: 4px;
}
.mp-sq--main { background: rgba(255,255,255,0.5); }
.mp-sq--sub  { background: rgba(255,255,255,0.25); }
.mp-link-icon {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  font-size: 0.7rem; color: #fff;
  background: rgba(147,51,234,.7); border-radius: 50%;
  width: 16px; height: 16px;
  display: flex; align-items: center; justify-content: center;
}
.mp-counts {
  display: flex; flex-direction: column; align-items: center;
  background: rgba(255,255,255,0.15); border-radius: 8px;
  padding: 4px 8px;
}
.mp-count-num   { font-size: 1rem; font-weight: 900; color: #fff; line-height: 1; }
.mp-count-label { font-size: 0.58rem; color: rgba(255,255,255,0.7); font-weight: 600; }

.mp-name {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.82rem; font-weight: 800; color: #fff;
  margin: 0 0 6px;
}
.mp-flag { font-size: 0.62rem; color: #fde68a; }

.mp-divider {
  height: 1px; background: rgba(255,255,255,0.2); margin: 4px 0 6px;
}

.mp-subs-label {
  font-size: 0.62rem; font-weight: 700;
  color: rgba(255,255,255,0.6);
  margin-bottom: 4px; letter-spacing: 0.03em;
}
.mp-subs { display: flex; flex-direction: column; gap: 3px; }
.mp-sub-item {
  display: flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,0.12);
  border-radius: 7px; padding: 4px 8px;
}
.mp-sub-num  { font-size: 0.65rem; font-weight: 800; color: rgba(255,255,255,0.6); min-width: 22px; }
.mp-sub-name { font-size: 0.72rem; font-weight: 600; color: #fff; flex: 1; }
.mp-sub-cap  {
  display: flex; align-items: center; gap: 3px;
  font-size: 0.65rem; color: rgba(255,255,255,0.65);
}

/* ── Merged Secondary Card ───────────────────────── */
.merged-secondary-card {
  opacity: 0.88;
}

.merged-secondary-body {
  padding: 4px 2px;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
}

.ms-visual {
  display: flex; align-items: center; gap: 6px; margin: 6px 0 2px;
}
.ms-table-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(147,51,234,.15);
  display: flex; align-items: center; justify-content: center;
  color: #7c3aed; font-size: 1rem;
}
.ms-arrow { color: #a78bfa; font-size: 0.8rem; }
.ms-primary-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(147,51,234,.3);
  display: flex; align-items: center; justify-content: center;
  color: #6d28d9; font-size: 0.9rem;
}

.ms-name {
  font-size: 0.82rem; font-weight: 800; color: #4c1d95;
  margin: 0; text-align: center;
}

.ms-linked-to {
  display: flex; align-items: center; gap: 4px;
  background: rgba(147,51,234,.12);
  border: 1px solid rgba(147,51,234,.2);
  border-radius: 20px; padding: 3px 10px;
  width: 100%; justify-content: center;
}
.ms-link-icon    { font-size: 0.65rem; color: #7c3aed; }
.ms-linked-label { font-size: 0.65rem; color: #6d28d9; font-weight: 600; }
.ms-primary-name { font-size: 0.72rem; font-weight: 800; color: #4c1d95; }

/* ── Animations ──────────────────────────────────── */
.urgent-card { animation: urgent-pulse 1.5s infinite; }
@keyframes urgent-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(220,38,38,.5); }
  50%  { box-shadow: 0 0 16px 6px rgba(220,38,68,0); }
  100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); }
}
.urgent-bell { animation: bell-shake .5s infinite alternate; }
@keyframes bell-shake {
  from { transform: rotate(-15deg); }
  to   { transform: rotate(15deg); }
}
</style>