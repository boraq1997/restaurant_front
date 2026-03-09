<!-- src/modules/cashier/pages/CashierHome.vue -->
<template>
  <div class="min-h-screen surface-50" dir="rtl">

    <!-- Header -->
    <header class="surface-card shadow-1 sticky top-0 z-5 border-bottom-1 border-200">
      <div class="px-3 py-3">

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
            :class="activeFilter === 'unpaid' ? 'bg-red-100 border-red-400' : 'surface-card border-transparent shadow-1'"
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
            :class="activeFilter === 'paid' ? 'bg-green-100 border-green-400' : 'surface-card border-transparent shadow-1'"
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
            :class="activeFilter === 'empty' ? 'bg-blue-100 border-blue-400' : 'surface-card border-transparent shadow-1'"
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

        <!-- Floors Tab Bar -->
        <div v-if="hasFloors" class="flex gap-2 overflow-x-auto pt-3 pb-1" style="scrollbar-width: none;">
          <button
            class="floor-tab"
            :class="{ active: selectedFloorId === null }"
            @click="selectedFloorId = null"
          >
            الكل
          </button>
          <button
            v-for="floor in floors"
            :key="floor.id"
            class="floor-tab"
            :class="{ active: selectedFloorId === floor.id }"
            @click="selectedFloorId = floor.id"
          >
            {{ floor.name }}
          </button>
        </div>

      </div>
    </header>

    <!-- Main -->
    <main class="px-3 pt-3 pb-6">

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
          text rounded size="small"
          @click="refresh"
        />
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-content-center align-items-center py-8">
        <ProgressSpinner />
      </div>

      <template v-else>

        <!-- ── عرض بطوابق ── -->
        <template v-if="hasFloors">
          <template v-for="floor in visibleFloors" :key="floor.id">
            <div v-if="tablesForFloor(floor.id).length > 0" class="mb-5">
              <div class="flex align-items-center gap-2 mb-3">
                <div class="w-2rem h-2rem border-round bg-primary flex align-items-center justify-content-center flex-shrink-0">
                  <i class="pi pi-building text-white text-xs" />
                </div>
                <span class="font-bold text-800">{{ floor.name }}</span>
                <Tag :value="String(tablesForFloor(floor.id).length)" severity="secondary" rounded class="text-xs" />
              </div>
              <TableGrid :tables="tablesForFloor(floor.id)" @select="onTableSelect" />
            </div>
          </template>

          <div
            v-if="visibleFloors.every(f => tablesForFloor(f.id).length === 0)"
            class="flex flex-column align-items-center justify-content-center py-8 gap-3"
          >
            <i class="pi pi-inbox text-4xl text-300" />
            <p class="text-500 m-0">لا توجد طاولات</p>
            <Button label="عرض الكل" text size="small" @click="activeFilter = null; selectedFloorId = null" />
          </div>
        </template>

        <!-- ── عرض بدون طوابق ── -->
        <template v-else>
          <Transition name="fade" mode="out-in">
            <div
              v-if="allFilteredTables.length === 0"
              class="flex flex-column align-items-center justify-content-center py-8 gap-3"
            >
              <i class="pi pi-inbox text-4xl text-300" />
              <p class="text-500 m-0">لا توجد طاولات</p>
              <Button label="عرض الكل" text size="small" @click="activeFilter = null" />
            </div>
            <TableGrid v-else :tables="allFilteredTables" @select="onTableSelect" />
          </Transition>
        </template>

      </template>
    </main>

    <!-- Drawer تفاصيل الطاولة -->
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
          <span class="font-bold text-lg">طاولة {{ selectedTable?.number }}</span>
        </div>
      </template>

      <div v-if="loadingInvoice" class="flex justify-content-center py-8">
        <ProgressSpinner style="width:32px;height:32px" />
      </div>

      <template v-else-if="selectedTable">
        <OrderSummary v-if="selectedTable.order" :table="selectedTable" />
        <div v-else class="flex flex-column align-items-center justify-content-center py-8 gap-3">
          <i class="pi pi-inbox text-4xl text-300" />
          <p class="text-500 m-0 text-sm">لا يوجد طلب نشط لهذه الطاولة</p>
        </div>
      </template>

      <template #footer>
        <div v-if="selectedTable?.order && selectedTable.paymentStatus === 'unpaid'" class="w-full">
          <Button label="إتمام الدفع" icon="pi pi-wallet" class="w-full" @click="openInvoice" />
        </div>
        <div v-else-if="selectedTable?.paymentStatus === 'paid'" class="w-full">
          <Button label="تم الدفع مسبقاً" icon="pi pi-check" severity="success" class="w-full" disabled />
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
import { tableApi, orderApi } from '../../../services/api.service'
import { tablesAdminApi } from '../../dashboard/tables/api/tables-admin.api'
import { PaymentMethod, InvoiceStatus } from '../../../types/api.types'
import type { CashierTable, PaymentMethod as CashierPaymentMethod } from '../types/cashier.types'
import type { Floor } from '../../dashboard/tables/types/tables-admin.types'
import TableGrid from '../components/TableGrid.vue'
import OrderSummary from '../components/OrderSummary.vue'
import InvoiceDialog from '../components/InvoiceDialog.vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import ProgressSpinner from 'primevue/progressspinner'
import LogoutButton from '../../../components/shared/Logoutbutton.vue'

const toast           = useToast()
const currentTime     = ref('')
const activeFilter    = ref<'unpaid' | 'paid' | 'empty' | null>(null)
const selectedFloorId = ref<number | null>(null)
const isRefreshing    = ref(false)
const loading         = ref(true)
const loadingInvoice  = ref(false)
const drawerVisible   = ref(false)
const invoiceVisible  = ref(false)
const selectedTable   = ref<CashierTable | null>(null)
const tables          = ref<CashierTable[]>([])
const floors          = ref<Floor[]>([])

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  loadTables()
})
onUnmounted(() => clearInterval(timer))

function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('ar-IQ', {
    hour: '2-digit', minute: '2-digit',
  })
}

// ── جلب البيانات ──────────────────────────────────────
async function loadTables() {
  loading.value = true
  try {
    const [floorsRes, tablesRes] = await Promise.all([
      tablesAdminApi.getAllFloors().catch(() => []),
      tableApi.getAll(),
    ])

    floors.value = Array.isArray(floorsRes) ? floorsRes : (floorsRes as any)?.items ?? []

    // الـ API يرجع { items: [...] } وليس مصفوفة مباشرة
    const tableItems: any[] = Array.isArray(tablesRes) ? tablesRes : (tablesRes as any)?.items ?? []

    tables.value = tableItems.map((t: any) => ({
      id:            t.id,
      name:          t.name?.trim() ? t.name : `طاولة ${t.number}`,
      number:        t.number,
      capacity:      t.capacity,
      floorId:       t.floorId ?? null,
      paymentStatus: 'unpaid' as const,
      order:         null,
    }))

    // استخدام الفواتير المضمنة في الرد مباشرة (بدون طلبات إضافية)
    tableItems.forEach((t: any) => {
      const invoices: any[] = Array.isArray(t.invoices) ? t.invoices : []
      const tableRef = tables.value.find(tb => tb.id === t.id)
      if (!tableRef) return

      const openInvoice = invoices.find(inv =>
        (inv.invoiceStatus ?? inv.status ?? 0) === InvoiceStatus.Open
      )

      if (openInvoice) {
        tableRef.order = buildOrder(t.id, openInvoice)
        tableRef.paymentStatus = 'unpaid'
      } else {
        const paidInvoice = invoices.find(inv =>
          (inv.invoiceStatus ?? inv.status ?? 0) === InvoiceStatus.Paid
        )
        if (paidInvoice) tableRef.paymentStatus = 'paid'
      }
    })

    tables.value = [...tables.value]
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل الطاولات', life: 3000 })
  } finally {
    loading.value = false
  }
}

function buildOrder(tableId: number, inv: any) {
  const items = (inv.invoiceItemsDto ?? inv.items ?? []).map((item: any) => ({
    menuItem: {
      id:          item.menuItemId ?? 0,
      name:        item.menuItemName,
      price:       item.price ?? item.unitPrice ?? 0,
      isAvailable: true,
      categoryId:  0,
      image:       null,
      menuOptions: [],
    },
    quantity:        item.quantity,
    selectedOptions: item.selectedOptionsDto ?? [],
    note:            item.notes ?? '',
  }))

  return {
    id:            inv.id,
    tableId,
    items,
    totalPrice:    inv.finalPrice ?? inv.totalPrice ?? 0,
    createdAt:     inv.createdAt ?? '',
    paymentStatus: 'unpaid' as const,
  }
}

async function refresh() {
  isRefreshing.value = true
  await loadTables()
  isRefreshing.value = false
}

// ── Computed ──────────────────────────────────────────
const hasFloors = computed(() => floors.value.length > 0)

const visibleFloors = computed(() =>
  selectedFloorId.value !== null
    ? floors.value.filter(f => f.id === selectedFloorId.value)
    : floors.value
)

function tablesForFloor(floorId: number): CashierTable[] {
  return applyFilter(tables.value.filter(t => (t as any).floorId === floorId))
}

const allFilteredTables = computed(() => applyFilter(tables.value))

function applyFilter(list: CashierTable[]): CashierTable[] {
  if (!activeFilter.value) return list
  if (activeFilter.value === 'unpaid') return list.filter(t => t.order && t.paymentStatus === 'unpaid')
  if (activeFilter.value === 'paid')   return list.filter(t => t.paymentStatus === 'paid')
  if (activeFilter.value === 'empty')  return list.filter(t => !t.order)
  return list
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

const filterLabel = computed(() => {
  switch (activeFilter.value) {
    case 'unpaid': return 'غير مدفوع'
    case 'paid':   return 'مدفوع'
    case 'empty':  return 'فارغة'
    default: return ''
  }
})

// ── Actions ───────────────────────────────────────────
function onFilter(filter: 'unpaid' | 'paid' | 'empty') {
  activeFilter.value = activeFilter.value === filter ? null : filter
}

async function onTableSelect(table: CashierTable) {
  selectedTable.value = table
  drawerVisible.value = true

  if (!table.order) {
    loadingInvoice.value = true
    try {
      const invoices = await tableApi.getInvoices(table.id)
      const raw = Array.isArray(invoices) ? invoices : (invoices as any)?.items ?? []
      const openInvoice = raw.find((inv: any) =>
        (inv.invoiceStatus ?? inv.status ?? 0) === InvoiceStatus.Open
      )
      if (openInvoice) {
        const updated: CashierTable = {
          ...table,
          order:         buildOrder(table.id, openInvoice),
          paymentStatus: 'unpaid',
        }
        selectedTable.value = updated
        const idx = tables.value.findIndex(t => t.id === table.id)
        if (idx !== -1) tables.value[idx] = updated
      }
    } catch { /* تجاهل */ }
    finally { loadingInvoice.value = false }
  }
}

function openInvoice() {
  invoiceVisible.value = true
}

async function onPaymentConfirm(method: CashierPaymentMethod) {
  if (!selectedTable.value?.order) return

  const methodMap: Record<CashierPaymentMethod, number> = {
    cash:   PaymentMethod.Cash,
    card:   PaymentMethod.Card,
    online: PaymentMethod.Online,
  }

  try {
    await orderApi.checkout({
      invoiceId:        selectedTable.value.order.id,
      paymentMethod:    methodMap[method],
      amountPaid:       selectedTable.value.order.totalPrice,
      cashBoxSessionId: null,
    })

    const idx = tables.value.findIndex(t => t.id === selectedTable.value!.id)
    if (idx !== -1) {
      tables.value[idx].paymentStatus        = 'paid'
      tables.value[idx].order!.paymentStatus = 'paid'
      tables.value[idx].order!.paymentMethod = method
    }

    drawerVisible.value = false
    toast.add({
      severity: 'success',
      summary: 'تم الدفع',
      detail: `تم استلام دفع طاولة ${selectedTable.value.number} بنجاح`,
      life: 3000,
    })
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل إتمام الدفع', life: 3000 })
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.floor-tab {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--p-surface-300);
  background: var(--p-surface-0);
  color: var(--p-text-color-secondary);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.floor-tab:hover {
  background: var(--p-surface-100);
  color: var(--p-text-color);
}
.floor-tab.active {
  background: var(--p-primary-color);
  border-color: var(--p-primary-color);
  color: #fff;
}
</style>