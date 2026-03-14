<!-- src/modules/waiter/components/TableCardLarge.vue -->
<template>
  <div
    class="tcl-card border-round-xl border-1 cursor-pointer overflow-hidden"
    :class="cardClass"
    @click="emit('click', table)"
  >

    <!-- ══════════════════════════════════════
         الطاولة الرئيسية المدمجة
         ══════════════════════════════════════ -->
    <template v-if="isMergedPrimary">
      <div class="tcl-row">

        <!-- أيقونة -->
        <div class="tcl-icon tcl-icon--primary">
          <div class="mp-squares-sm">
            <div class="mp-sq-sm mp-sq-sm--main" />
            <div v-for="i in Math.min(table.mergedTables?.length ?? 0, 3)" :key="i"
              class="mp-sq-sm mp-sq-sm--sub" />
          </div>
          <i class="pi pi-link mp-link-sm" />
        </div>

        <!-- معلومات -->
        <div class="tcl-info flex-1">
          <div class="tcl-name-row">
            <i class="pi pi-flag-fill" style="font-size:0.65rem; color:#fde68a" />
            <span class="tcl-name tcl-name--white">{{ table.name }}</span>
            <Tag severity="secondary" rounded>
              <span class="text-xs font-bold">رئيسية</span>
            </Tag>
          </div>

          <!-- الطاولات الفرعية مضمنة أفقياً -->
          <div class="tcl-subs-row">
            <span class="tcl-subs-prefix">مع:</span>
            <div class="tcl-subs-chips">
              <span v-for="mt in table.mergedTables" :key="mt.id" class="tcl-sub-chip">
                #{{ mt.number }}
                <span class="tcl-sub-chip-cap">{{ mt.capacity }}<i class="pi pi-user" style="font-size:0.45rem"/></span>
              </span>
            </div>
          </div>

          <!-- إجمالي -->
          <div class="tcl-meta-row">
            <span class="tcl-meta-item">
              <i class="pi pi-clone" style="font-size:0.6rem" />
              {{ (table.mergedTables?.length ?? 0) + 1 }} طاولات
            </span>
            <span class="tcl-meta-item">
              <i class="pi pi-users" style="font-size:0.6rem" />
              {{ totalMergedCapacity }} كرسي
            </span>
          </div>
        </div>

        <!-- يمين -->
        <div class="tcl-right">
          <i v-if="isUrgent" class="fa-solid fa-bell text-white text-xl ringing-bell" />
          <i v-else class="pi pi-chevron-left text-white-alpha-40" />
        </div>
      </div>
    </template>

    <!-- ══════════════════════════════════════
         الطاولة الثانوية (مدمجة مع رئيسية)
         ══════════════════════════════════════ -->
    <template v-else-if="isMergedSecondary">
      <div class="tcl-row">

        <!-- أيقونة -->
        <div class="tcl-icon tcl-icon--secondary">
          <i class="pi pi-th-large" style="font-size:1rem; color:#7c3aed" />
        </div>

        <!-- معلومات -->
        <div class="tcl-info flex-1">
          <div class="tcl-name-row">
            <span class="tcl-name tcl-name--dark">{{ table.name }}</span>
            <Tag severity="secondary" rounded>
              <span class="text-xs font-bold">ثانوية</span>
            </Tag>
          </div>

          <!-- مدمجة مع -->
          <div class="tcl-linked-badge">
            <i class="pi pi-link" style="font-size:0.6rem" />
            <span>مدمجة مع</span>
            <strong>{{ table.primaryTableName ?? `طاولة ${table.primaryTableNumber}` }}</strong>
          </div>

          <div class="tcl-meta-row">
            <span class="tcl-meta-item tcl-meta-item--dark">
              <i class="pi pi-users" style="font-size:0.6rem" />
              {{ table.capacity }} كرسي
            </span>
          </div>
        </div>

        <!-- يمين -->
        <div class="tcl-right">
          <i class="pi pi-chevron-left" style="color:#a78bfa" />
        </div>
      </div>
    </template>

    <!-- ══════════════════════════════════════
         طاولة عادية
         ══════════════════════════════════════ -->
    <template v-else>
      <div class="tcl-row">

        <!-- أيقونة -->
        <div class="tcl-icon" :class="normalIconClass">
          <i class="pi pi-th-large text-xl" :class="tableIconClass" />
        </div>

        <!-- معلومات -->
        <div class="tcl-info flex-1">
          <div class="tcl-name-row">
            <span class="tcl-name" :class="isColored ? 'tcl-name--white' : 'tcl-name--dark'">
              {{ table.name }}
            </span>
            <Tag :severity="statusSeverity" rounded>
              <span class="text-xs font-bold">{{ statusLabel }}</span>
            </Tag>
          </div>

          <div class="tcl-meta-row">
            <span class="tcl-meta-item" :class="isColored ? '' : 'tcl-meta-item--dark'">
              <i class="pi pi-users" style="font-size:0.6rem" />
              {{ table.capacity }} كرسي
            </span>
            <span v-if="table.reservation" class="tcl-meta-item" :class="isColored ? '' : 'tcl-meta-item--dark'">
              <i class="pi pi-user" style="font-size:0.6rem" />
              {{ table.reservation.guestName }}
            </span>
          </div>

          <!-- تنبيهات -->
          <div v-if="hasAlerts && !isUrgent" class="tcl-alerts-row">
            <span v-for="alert in table.alerts" :key="alert"
              class="tcl-alert-chip" :class="alertClass(alert)">
              {{ alertLabel(alert) }}
            </span>
          </div>
        </div>

        <!-- يمين -->
        <div class="tcl-right">
          <i v-if="isUrgent" class="fa-solid fa-bell text-white text-xl ringing-bell" />
          <i v-else class="pi pi-chevron-left" :class="isColored ? 'text-white-alpha-40' : 'text-300'" />
        </div>

      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Tag from 'primevue/tag'
import type { Table, TableAlert } from '../types/waiter.types'

const props = defineProps<{ table: Table }>()
const emit  = defineEmits<{ click: [table: Table] }>()

const isUrgent          = computed(() => !!props.table.alerts?.includes('need_waiter'))
const hasAlerts         = computed(() => !!props.table.alerts?.length)
const isMergedPrimary   = computed(() => props.table.status === 'merged' && props.table.primaryTableId === null)
const isMergedSecondary = computed(() => props.table.status === 'merged' && props.table.primaryTableId !== null)
const isColored         = computed(() => isUrgent.value || props.table.status === 'occupied')

const totalMergedCapacity = computed(() =>
  props.table.capacity + (props.table.mergedTables?.reduce((s, m) => s + (m.capacity ?? 0), 0) ?? 0)
)

const cardClass = computed(() => {
  if (isMergedPrimary.value)   return 'bg-purple-600 border-purple-500 merged-primary-card'
  if (isMergedSecondary.value) return 'bg-purple-50 border-purple-200 merged-secondary-card'
  if (isUrgent.value)          return 'bg-red-500 border-red-400 urgent-card'
  if (props.table.status === 'occupied') return 'bg-primary border-primary shadow-2'
  if (hasAlerts.value)                   return 'bg-orange-50 border-orange-300'
  return 'surface-card border-200'
})

const normalIconClass = computed(() => {
  if (isColored.value)                       return 'tcl-icon--occupied'
  if (props.table.status === 'available')    return 'tcl-icon--available'
  return 'tcl-icon--reserved'
})
const tableIconClass = computed(() => {
  if (isColored.value)                       return 'text-white'
  if (props.table.status === 'available')    return 'text-green-600'
  return 'text-orange-600'
})

const statusSeverity = computed(() => {
  switch (props.table.status) {
    case 'available': return 'success' as const
    case 'occupied':  return 'danger'  as const
    case 'reserved':  return 'warn'    as const
    default:          return 'info'    as const
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

function alertLabel(a: TableAlert) {
  switch (a) {
    case 'confirm_order': return 'تأكيد الطلب'
    case 'new_order':     return 'طلب جديد'
    case 'need_waiter':   return 'يحتاج ويتر'
  }
}
function alertClass(a: TableAlert) {
  switch (a) {
    case 'confirm_order': return 'tcl-alert--blue'
    case 'new_order':     return 'tcl-alert--orange'
    case 'need_waiter':   return 'tcl-alert--red'
  }
}
</script>

<style scoped>
.tcl-card {
  transition: opacity .08s;
  -webkit-tap-highlight-color: transparent;
}
.tcl-card:active { opacity: 0.82; }

/* Row layout */
.tcl-row {
  display: flex; align-items: center; gap: 0.85rem;
  padding: 0.85rem 1rem;
}

/* Icons */
.tcl-icon {
  position: relative;
  width: 50px; height: 50px; border-radius: 14px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid transparent;
}
.tcl-icon--primary   { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.25); }
.tcl-icon--secondary { background: rgba(147,51,234,0.12);  border-color: rgba(147,51,234,0.2); }
.tcl-icon--available { background: #f0fdf4; border-color: #86efac; }
.tcl-icon--occupied  { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.3); }
.tcl-icon--reserved  { background: #fff7ed; border-color: #fed7aa; }

/* Primary merged icon squares */
.mp-squares-sm {
  display: grid; grid-template-columns: 1fr 1fr; gap: 3px;
  width: 26px; height: 26px;
}
.mp-sq-sm         { border-radius: 3px; }
.mp-sq-sm--main   { background: rgba(255,255,255,0.55); }
.mp-sq-sm--sub    { background: rgba(255,255,255,0.25); }
.mp-link-sm {
  position: absolute; bottom: -4px; left: -4px;
  font-size: 0.55rem; color: #fff;
  background: rgba(109,40,217,.8); border-radius: 50%;
  width: 14px; height: 14px;
  display: flex; align-items: center; justify-content: center;
}

/* Info section */
.tcl-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; }

.tcl-name-row {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
}
.tcl-name       { font-size: 0.9rem; font-weight: 800; line-height: 1; }
.tcl-name--white { color: #fff; }
.tcl-name--dark  { color: var(--p-text-color); }

/* Sub tables row (primary merged) */
.tcl-subs-row {
  display: flex; align-items: center; gap: 5px; flex-wrap: wrap;
}
.tcl-subs-prefix {
  font-size: 0.65rem; color: rgba(255,255,255,.6); font-weight: 600; flex-shrink: 0;
}
.tcl-subs-chips { display: flex; flex-wrap: wrap; gap: 3px; }
.tcl-sub-chip {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 0.65rem; font-weight: 700;
  background: rgba(255,255,255,.18); color: #fff;
  border-radius: 20px; padding: 2px 7px;
}
.tcl-sub-chip-cap {
  display: flex; align-items: center; gap: 2px;
  opacity: 0.65; font-weight: 400;
}

/* Linked badge (secondary merged) */
.tcl-linked-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 0.7rem; color: #6d28d9;
  background: rgba(147,51,234,.1);
  border: 1px solid rgba(147,51,234,.2);
  border-radius: 20px; padding: 2px 10px;
  width: fit-content;
}
.tcl-linked-badge strong { font-weight: 800; }

/* Meta row */
.tcl-meta-row { display: flex; align-items: center; gap: 10px; }
.tcl-meta-item {
  display: flex; align-items: center; gap: 4px;
  font-size: 0.7rem; color: rgba(255,255,255,.65);
}
.tcl-meta-item--dark { color: var(--p-text-muted-color); }

/* Alerts */
.tcl-alerts-row { display: flex; flex-wrap: wrap; gap: 4px; }
.tcl-alert-chip {
  font-size: 0.65rem; font-weight: 600;
  border-radius: 6px; padding: 2px 7px;
}
.tcl-alert--blue   { background: #dbeafe; color: #1d4ed8; }
.tcl-alert--orange { background: #ffedd5; color: #c2410c; }
.tcl-alert--red    { background: #fee2e2; color: #b91c1c; }

/* Right section */
.tcl-right {
  flex-shrink: 0;
  display: flex; align-items: center;
}

/* Animations */
.merged-primary-card   { animation: primary-pulse 2.5s ease-in-out infinite; }
.merged-secondary-card { opacity: 0.9; }
@keyframes primary-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(147,51,234,.35); }
  50%     { box-shadow: 0 0 14px 5px rgba(147,51,234,0); }
}
.urgent-card { animation: urgent-pulse 1.5s infinite; }
@keyframes urgent-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(220,38,38,.5); }
  50%  { box-shadow: 0 0 16px 6px rgba(220,38,38,0); }
  100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); }
}
.ringing-bell {
  transform-origin: top center;
  animation: bell-ring 1.2s ease-in-out infinite;
}
@keyframes bell-ring {
  0%,100% { transform: rotate(0); }
  20%     { transform: rotate(18deg); }
  40%     { transform: rotate(-18deg); }
  60%     { transform: rotate(10deg); }
  80%     { transform: rotate(-10deg); }
}
</style>