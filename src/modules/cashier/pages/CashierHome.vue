<!-- src/modules/cashier/pages/CashierHome.vue -->

<template>
  <div class="min-h-screen surface-50" dir="rtl">

    <!-- Header -->
    <header class="surface-card shadow-1 sticky top-0 z-5 border-bottom-1 border-200">
      <div class="px-3 py-3">

        <!-- Row 1: Logo + Time -->
        <div class="flex align-items-center justify-content-between mb-3">
          <div class="flex align-items-center gap-2">
            <div class="w-2rem h-2rem border-round-lg bg-primary flex align-items-center justify-content-center">
              <i class="pi pi-shop text-white text-sm" />
            </div>
            <div>
              <p class="font-bold text-base m-0 text-900 line-height-1">مطعمنا</p>
              <span class="text-xs text-500">الكاشير</span>
            </div>
          </div>

          <div class="flex align-items-center gap-1 surface-100 px-2 py-1 border-round-lg">
            <i class="pi pi-clock text-primary text-xs" />
            <span class="text-xs font-bold text-primary">{{ currentTime }}</span>
            <LogoutButton />
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="flex gap-2 overflow-x-auto pb-1">

          <div
            class="flex align-items-center gap-2 px-3 py-2 border-round-xl border-1 cursor-pointer flex-shrink-0 transition-all transition-duration-200"
            :class="activeFilter === 'unpaid'
              ? 'bg-red-100 border-red-400'
              : 'surface-card border-transparent shadow-1'"
            @click="onFilter('unpaid')"
          >
            <div class="flex align-items-center justify-content-center bg-red-100 border-round" style="width:2rem; height:2rem">
              <i class="pi pi-times-circle text-red-600" />
            </div>
            <div class="flex flex-column">
              <span class="text-xs text-500">غير مدفوع</span>
              <span class="text-lg font-bold text-900 line-height-1">{{ unpaidCount }}</span>
            </div>
          </div>

          <div
            class="flex align-items-center gap-2 px-3 py-2 border-round-xl border-1 cursor-pointer flex-shrink-0 transition-all transition-duration-200"
            :class="activeFilter === 'paid'
              ? 'bg-green-100 border-green-400'
              : 'surface-card border-transparent shadow-1'"
            @click="onFilter('paid')"
          >
            <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width:2rem; height:2rem">
              <i class="pi pi-check-circle text-green-600" />
            </div>
            <div class="flex flex-column">
              <span class="text-xs text-500">مدفوع</span>
              <span class="text-lg font-bold text-900 line-height-1">{{ paidCount }}</span>
            </div>
          </div>

          <div
            class="flex align-items-center gap-2 px-3 py-2 border-round-xl border-1 cursor-pointer flex-shrink-0 transition-all transition-duration-200"
            :class="activeFilter === 'empty'
              ? 'bg-blue-100 border-blue-400'
              : 'surface-card border-transparent shadow-1'"
            @click="onFilter('empty')"
          >
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2rem; height:2rem">
              <i class="pi pi-th-large text-blue-600" />
            </div>
            <div class="flex flex-column">
              <span class="text-xs text-500">فارغة</span>
              <span class="text-lg font-bold text-900 line-height-1">{{ emptyCount }}</span>
            </div>
          </div>

        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="px-3 pt-3 pb-6">

      <!-- Toolbar -->
      <div class="flex align-items-center justify-content-between mb-3">
        <div class="flex align-items-center gap-2">
          <span class="font-bold text-800 text-sm">الطاولات</span>
          <Tag
            v-if="activeFilter"
            severity="secondary"
            rounded
            class="cursor-pointer"
            @click="activeFilter = null"
          >
            <div class="flex align-items-center gap-1 text-xs">
              <span>{{ filterLabel }}</span>
              <i class="pi pi-times" style="font-size: 0.6rem" />
            </div>
          </Tag>
        </div>
        <Button
          icon="pi pi-refresh"
          :loading="isRefreshing"
          severity="secondary"
          text
          rounded
          size="small"
          @click="refresh"
        />
      </div>

      <!-- Empty State -->
      <Transition name="fade" mode="out-in">
        <div
          v-if="filteredTables.length === 0"
          class="flex flex-column align-items-center justify-content-center py-8 gap-3"
        >
          <i class="pi pi-inbox text-4xl text-300" />
          <p class="text-500 m-0">لا توجد طاولات</p>
          <Button label="عرض الكل" text size="small" @click="activeFilter = null" />
        </div>

        <TableGrid v-else :tables="filteredTables" @select="onTableSelect" />
      </Transition>

    </main>

    <!-- Order Detail Drawer -->
    <Drawer
      v-model:visible="drawerVisible"
      position="left"
      style="width: 100%; max-width: 480px;"
      :modal="true"
      dir="rtl"
    >
      <template #header>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-th-large text-primary" />
          <span class="font-bold text-lg">{{ selectedTable?.name }}</span>
        </div>
      </template>

      <template v-if="selectedTable">
        <OrderSummary :table="selectedTable" />
      </template>

      <template #footer>
        <div v-if="selectedTable?.order && selectedTable.paymentStatus === 'unpaid'" class="w-full">
          <Button
            label="إتمام الدفع"
            icon="pi pi-wallet"
            class="w-full"
            @click="openInvoice"
          />
        </div>
        <div v-else-if="selectedTable?.paymentStatus === 'paid'" class="w-full">
          <Button
            label="تم الدفع مسبقاً"
            icon="pi pi-check"
            severity="success"
            class="w-full"
            disabled
          />
        </div>
      </template>

    </Drawer>

    <!-- Invoice Dialog -->
    <InvoiceDialog
      v-model="invoiceVisible"
      :table="selectedTable"
      @confirm="onPaymentConfirm"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { cashierTables } from '../../../mock/cashier.mock'
import type { CashierTable, PaymentMethod } from '../types/cashier.types'
import TableGrid from '../components/TableGrid.vue'
import OrderSummary from '../components/OrderSummary.vue'
import InvoiceDialog from '../components/InvoiceDialog.vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import LogoutButton from '../../../components/shared/LogoutButton.vue'

const toast          = useToast()
const currentTime    = ref('')
const activeFilter   = ref<'unpaid' | 'paid' | 'empty' | null>(null)
const isRefreshing   = ref(false)
const drawerVisible  = ref(false)
const invoiceVisible = ref(false)
const selectedTable  = ref<CashierTable | null>(null)
const tables         = ref<CashierTable[]>(cashierTables)

let timer: ReturnType<typeof setInterval>

onMounted(() => { updateTime(); timer = setInterval(updateTime, 1000) })
onUnmounted(() => clearInterval(timer))

function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('ar-IQ', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function refresh() {
  isRefreshing.value = true
  await new Promise(r => setTimeout(r, 800))
  isRefreshing.value = false
}

const unpaidCount = computed(() =>
  tables.value.filter(t => t.order && t.paymentStatus === 'unpaid').length
)
const paidCount = computed(() =>
  tables.value.filter(t => t.paymentStatus === 'paid').length
)
const emptyCount = computed(() =>
  tables.value.filter(t => !t.order).length
)

const filteredTables = computed(() => {
  if (!activeFilter.value) return tables.value
  if (activeFilter.value === 'unpaid') return tables.value.filter(t => t.order && t.paymentStatus === 'unpaid')
  if (activeFilter.value === 'paid')   return tables.value.filter(t => t.paymentStatus === 'paid')
  if (activeFilter.value === 'empty')  return tables.value.filter(t => !t.order)
  return tables.value
})

const filterLabel = computed(() => {
  switch (activeFilter.value) {
    case 'unpaid': return 'غير مدفوع'
    case 'paid':   return 'مدفوع'
    case 'empty':  return 'فارغة'
    default: return ''
  }
})

function onFilter(filter: 'unpaid' | 'paid' | 'empty') {
  activeFilter.value = activeFilter.value === filter ? null : filter
}

function onTableSelect(table: CashierTable) {
  if (!table.order) return
  selectedTable.value = table
  drawerVisible.value = true
}

function openInvoice() {
  invoiceVisible.value = true
}

function onPaymentConfirm(method: PaymentMethod) {
  if (!selectedTable.value) return

  const index = tables.value.findIndex(t => t.id === selectedTable.value!.id)
  if (index !== -1 && tables.value[index].order) {
    tables.value[index].paymentStatus        = 'paid'
    tables.value[index].order!.paymentStatus = 'paid'
    tables.value[index].order!.paymentMethod = method
  }

  drawerVisible.value = false
  toast.add({
    severity: 'success',
    summary: 'تم الدفع',
    detail: `تم استلام دفع ${selectedTable.value.name} بنجاح`,
    life: 3000,
  })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>