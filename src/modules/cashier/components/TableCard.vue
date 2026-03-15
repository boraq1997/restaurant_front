<!-- src/modules/cashier/components/TableCard.vue -->
<template>
  <Card
    class="w-full border-1 transition-all transition-duration-300 overflow-hidden cursor-pointer"
    :class="cardClass"
    :pt="{ root: { class: cardBgClass }, content: { class: 'p-2' }, header: { class: 'pb-0' } }"
    @click="emit('click', table)"
  >
    <template #header>
      <div class="flex align-items-center justify-content-between px-3 pt-3">
        <Tag :severity="paymentSeverity" rounded>
          <span class="font-bold text-xs">{{ paymentLabel }}</span>
        </Tag>
        <div class="flex align-items-center gap-1">
          <!-- badge الدمج -->
          <span v-if="isMergedPrimary" class="merged-badge merged-badge--primary">
            <i class="pi pi-link" style="font-size:0.55rem" /> رئيسية
          </span>
          <span v-else-if="isMergedSecondary" class="merged-badge merged-badge--secondary">
            <i class="pi pi-link" style="font-size:0.55rem" /> ثانوية
          </span>
          <span class="text-xs font-bold surface-100 px-2 py-1 border-round">#{{ table.number }}</span>
        </div>
      </div>
    </template>

    <template #content>

      <!-- ══════════════════════════════════════
           الطاولة الرئيسية المدمجة
           ══════════════════════════════════════ -->
      <template v-if="isMergedPrimary">
        <div class="merged-primary-body">

          <!-- أيقونة + عدد الطاولات -->
          <div class="mp-icon-row">
            <div class="mp-icon-wrap">
              <div class="mp-squares">
                <div class="mp-sq mp-sq--main" />
                <div v-for="i in Math.min((table as any).mergedTables?.length ?? 0, 3)" :key="i" class="mp-sq mp-sq--sub" />
              </div>
              <i class="pi pi-link mp-link-icon" />
            </div>
            <div class="mp-counts">
              <span class="mp-count-num">{{ ((table as any).mergedTables?.length ?? 0) + 1 }}</span>
              <span class="mp-count-label">طاولات</span>
            </div>
            <div class="mp-counts">
              <span class="mp-count-num">{{ totalMergedCapacity }}</span>
              <span class="mp-count-label">كرسي</span>
            </div>
          </div>

          <!-- اسم الطاولة -->
          <p class="mp-name">
            <i class="pi pi-flag-fill mp-flag" />
            {{ table.name }}
          </p>

          <div class="mp-divider" />

          <!-- الطاولات المدمجة معها -->
          <div class="mp-subs-label">مدمجة مع:</div>
          <div class="mp-subs">
            <div v-for="mt in (table as any).mergedTables" :key="mt.id" class="mp-sub-item">
              <span class="mp-sub-num">#{{ mt.number }}</span>
              <span class="mp-sub-name">{{ mt.name?.trim() ? mt.name : `طاولة ${mt.number}` }}</span>
              <span class="mp-sub-cap">{{ mt.capacity }}<i class="pi pi-user" style="font-size:0.5rem" /></span>
            </div>
          </div>

          <div class="mp-divider mt-2" />

          <!-- المبلغ -->
          <div v-if="table.order" class="flex align-items-center justify-content-between mt-2">
            <span class="text-xs text-white-alpha-70">المبلغ الكلي</span>
            <span class="font-bold text-sm text-white">{{ table.order.totalPrice.toLocaleString() }} د.ع</span>
          </div>
          <div v-else class="flex align-items-center justify-content-center gap-1 mt-2">
            <i class="pi pi-minus-circle text-xs text-white-alpha-40" />
            <span class="text-xs text-white-alpha-50">لا يوجد طلب</span>
          </div>

        </div>
      </template>

      <!-- ══════════════════════════════════════
           الطاولة الثانوية المدمجة
           ══════════════════════════════════════ -->
      <template v-else-if="isMergedSecondary">
        <div class="merged-secondary-body">

          <div class="ms-visual">
            <div class="ms-table-icon"><i class="pi pi-th-large" /></div>
            <div class="ms-arrow"><i class="pi pi-arrow-left" /></div>
            <div class="ms-primary-icon"><i class="pi pi-flag-fill" /></div>
          </div>

          <p class="ms-name">{{ table.name }}</p>

          <div class="ms-linked-to">
            <i class="pi pi-link ms-link-icon" />
            <span class="ms-linked-label">مدمجة مع</span>
            <span class="ms-primary-name">طاولة {{ (table as any).primaryTableNumber }}</span>
          </div>

          <Divider class="my-2" />

          <!-- المبلغ -->
          <div v-if="table.order" class="flex align-items-center justify-content-between">
            <span class="text-xs text-500">المبلغ الكلي</span>
            <span class="font-bold text-sm text-primary">{{ table.order.totalPrice.toLocaleString() }} د.ع</span>
          </div>
          <div v-else class="flex align-items-center justify-content-center gap-1 py-1">
            <i class="pi pi-minus-circle text-xs text-400" />
            <span class="text-xs text-400">لا يوجد طلب</span>
          </div>

        </div>
      </template>

      <!-- ══════════════════════════════════════
           الطاولة العادية
           ══════════════════════════════════════ -->
      <template v-else>

        <!-- شكل الطاولة -->
        <div class="flex justify-content-center my-2">
          <div class="flex flex-column align-items-center gap-1">
            <div class="flex gap-1">
              <div v-for="i in topChairs" :key="'t'+i" class="border-round-top-md border-1" :class="chairClass" style="width:1rem; height:0.5rem;" />
            </div>
            <div class="flex align-items-center justify-content-center border-round-lg border-2" :class="tableBodyClass" style="width:5.5rem; height:3rem;">
              <div class="flex flex-column align-items-center gap-1">
                <i class="pi pi-th-large text-lg" :class="tableIconClass" />
                <span class="text-xs font-bold" :class="tableIconClass">{{ table.name }}</span>
              </div>
            </div>
            <div class="flex gap-1">
              <div v-for="i in bottomChairs" :key="'b'+i" class="border-round-bottom-md border-1" :class="chairClass" style="width:1rem; height:0.5rem;" />
            </div>
          </div>
        </div>

        <p class="text-center font-bold text-sm m-0 mb-2" :class="hasUnpaidOrder ? 'text-white' : 'text-900'">
          {{ table.name }}
        </p>

        <Divider class="my-1" :class="hasUnpaidOrder ? 'border-white-alpha-30' : ''" />

        <div style="min-height: 2.5rem;">
          <div v-if="table.order" class="flex flex-column gap-1">
            <div class="flex align-items-center justify-content-between">
              <span class="text-xs" :class="hasUnpaidOrder ? 'text-white-alpha-70' : 'text-500'">المبلغ الكلي</span>
              <span class="font-bold text-sm" :class="hasUnpaidOrder ? 'text-white' : 'text-primary'">
                {{ table.order.totalPrice.toLocaleString() }} د.ع
              </span>
            </div>
            <div class="flex align-items-center justify-content-between">
              <span class="text-xs" :class="hasUnpaidOrder ? 'text-white-alpha-70' : 'text-500'">عدد الأصناف</span>
              <span class="text-xs font-medium" :class="hasUnpaidOrder ? 'text-white-alpha-70' : 'text-700'">
                {{ table.order.items.length }} صنف
              </span>
            </div>
          </div>
          <div v-else class="flex align-items-center justify-content-center gap-1 py-1 border-round bg-surface-100">
            <i class="pi pi-minus-circle text-xs text-400" />
            <span class="text-xs font-semibold text-400">لا يوجد طلب</span>
          </div>
        </div>

      </template>

    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card    from 'primevue/card'
import Tag     from 'primevue/tag'
import Divider from 'primevue/divider'
import type { CashierTable } from '../types/cashier.types'

const props = defineProps<{ table: CashierTable }>()
const emit  = defineEmits<{ click: [table: CashierTable] }>()

// ── حالة الدمج ──────────────────────────────────────
const isMergedPrimary = computed(() => {
  const t = props.table as any
  return (t.status === 'Merged' || t.status === 3 || t.isMerged) && !t.primaryTableId
})

const isMergedSecondary = computed(() => {
  const t = props.table as any
  return (t.status === 'Merged' || t.status === 3 || t.isMerged) && !!t.primaryTableId
})

const totalMergedCapacity = computed(() => {
  const t = props.table as any
  return props.table.capacity + (t.mergedTables?.reduce((s: number, m: any) => s + (m.capacity ?? 0), 0) ?? 0)
})

// ── عام ─────────────────────────────────────────────
const topChairs      = computed(() => Math.ceil(props.table.capacity / 2))
const bottomChairs   = computed(() => Math.floor(props.table.capacity / 2))
const hasOrder       = computed(() => !!props.table.order)
const hasUnpaidOrder = computed(() => props.table.order && props.table.paymentStatus === 'unpaid')

const cardClass = computed(() => {
  if (isMergedPrimary.value)   return 'border-purple-500 shadow-3 merged-primary-card'
  if (isMergedSecondary.value) return 'border-purple-300 shadow-1 merged-secondary-card'
  if (!hasOrder.value)         return 'border-200 shadow-1'
  if (hasUnpaidOrder.value)    return 'border-primary shadow-2'
  if (props.table.paymentStatus === 'paid') return 'border-green-400 shadow-1'
  return 'border-200 shadow-1'
})

const cardBgClass = computed(() => {
  if (isMergedPrimary.value)   return 'bg-purple-600'
  if (isMergedSecondary.value) return 'bg-purple-50'
  if (!hasOrder.value)         return 'surface-100'
  if (hasUnpaidOrder.value)    return 'bg-primary'
  if (props.table.paymentStatus === 'paid') return 'bg-green-50'
  return ''
})

const chairClass = computed(() => {
  if (hasUnpaidOrder.value) return 'bg-white-alpha-30 border-white-alpha-40'
  return 'surface-100 surface-border'
})

const tableBodyClass = computed(() => {
  if (!hasOrder.value)          return 'border-200 surface-card'
  if (hasUnpaidOrder.value)     return 'border-white bg-white-alpha-20'
  if (props.table.paymentStatus === 'paid') return 'border-green-400 bg-green-50'
  return 'border-200 surface-card'
})

const tableIconClass = computed(() => {
  if (hasUnpaidOrder.value)     return 'text-white'
  if (props.table.paymentStatus === 'paid') return 'text-green-600'
  return 'text-400'
})

const paymentSeverity = computed(() => {
  if (isMergedPrimary.value || isMergedSecondary.value) return 'secondary' as const
  if (!hasOrder.value) return 'secondary' as const
  return props.table.paymentStatus === 'unpaid' ? 'danger' as const : 'success' as const
})

const paymentLabel = computed(() => {
  if (isMergedPrimary.value)   return 'رئيسية'
  if (isMergedSecondary.value) return 'ثانوية'
  if (!hasOrder.value) return 'فارغة'
  return props.table.paymentStatus === 'unpaid' ? 'غير مدفوع' : 'مدفوع'
})
</script>

<style scoped>
/* ── Merged badges ──────────────────────────────── */
.merged-badge {
  display: inline-flex; align-items: center; gap: 3px;
  padding: 2px 7px; border-radius: 20px;
  font-size: 0.65rem; font-weight: 700;
}
.merged-badge--primary  { background: rgba(255,255,255,0.2); color: #fff; }
.merged-badge--secondary { background: rgba(147,51,234,0.12); color: #7c3aed; }

/* ── Merged Primary ─────────────────────────────── */
.merged-primary-card { animation: primary-pulse 2.5s ease-in-out infinite; }
@keyframes primary-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(147,51,234,.35); }
  50%     { box-shadow: 0 0 14px 5px rgba(147,51,234,0); }
}

.merged-primary-body { padding: 4px 2px 2px; }

.mp-icon-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.mp-icon-wrap { position: relative; width: 46px; height: 46px; flex-shrink: 0; }
.mp-squares { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; width: 100%; height: 100%; }
.mp-sq { border-radius: 4px; }
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
  background: rgba(255,255,255,0.15); border-radius: 8px; padding: 4px 8px;
}
.mp-count-num   { font-size: 1rem; font-weight: 900; color: #fff; line-height: 1; }
.mp-count-label { font-size: 0.58rem; color: rgba(255,255,255,0.7); font-weight: 600; }

.mp-name { display: flex; align-items: center; gap: 5px; font-size: 0.82rem; font-weight: 800; color: #fff; margin: 0 0 6px; }
.mp-flag { font-size: 0.62rem; color: #fde68a; }
.mp-divider { height: 1px; background: rgba(255,255,255,0.2); margin: 4px 0 6px; }
.mp-subs-label { font-size: 0.62rem; font-weight: 700; color: rgba(255,255,255,0.6); margin-bottom: 4px; }
.mp-subs { display: flex; flex-direction: column; gap: 3px; }
.mp-sub-item { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.12); border-radius: 7px; padding: 4px 8px; }
.mp-sub-num  { font-size: 0.65rem; font-weight: 800; color: rgba(255,255,255,0.6); min-width: 22px; }
.mp-sub-name { font-size: 0.72rem; font-weight: 600; color: #fff; flex: 1; }
.mp-sub-cap  { display: flex; align-items: center; gap: 3px; font-size: 0.65rem; color: rgba(255,255,255,0.65); }

/* ── Merged Secondary ───────────────────────────── */
.merged-secondary-card { opacity: 0.9; }

.merged-secondary-body { padding: 4px 2px; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.ms-visual { display: flex; align-items: center; gap: 6px; margin: 6px 0 2px; }
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
.ms-name { font-size: 0.82rem; font-weight: 800; color: #4c1d95; margin: 0; text-align: center; }
.ms-linked-to {
  display: flex; align-items: center; gap: 4px;
  background: rgba(147,51,234,.12); border: 1px solid rgba(147,51,234,.2);
  border-radius: 20px; padding: 3px 10px; width: 100%; justify-content: center;
}
.ms-link-icon    { font-size: 0.65rem; color: #7c3aed; }
.ms-linked-label { font-size: 0.65rem; color: #6d28d9; font-weight: 600; }
.ms-primary-name { font-size: 0.72rem; font-weight: 800; color: #4c1d95; }
</style>