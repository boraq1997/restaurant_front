<!-- src/modules/cashier/pages/CashierHome.vue -->
<template>
  <div class="min-h-screen surface-50" dir="rtl">

    <!-- Header -->
    <header class="surface-card shadow-1 sticky top-0 z-5 border-bottom-1 border-200" 
            style="transition: all 0.25s ease;">
      <div class="px-3 py-3">

        <!-- يختفي عند السكرول -->
        <Transition name="slide-up">
          <div v-if="!isScrolled" class="flex align-items-center justify-content-between mb-3">
            <div class="flex align-items-center gap-2">
              <div class="w-2rem h-2rem border-round-lg bg-primary flex align-items-center justify-content-center">
                <i class="pi pi-shop text-white text-sm" />
              </div>
              <div>
                <p class="font-bold text-base m-0 text-900 line-height-1">مطعمنا</p>
                <span class="text-xs text-500">الكاشير</span>
              </div>
            </div>

            <div class="flex align-items-center gap-2">
              <div
                class="flex align-items-center gap-1 px-2 py-1 border-round-lg border-1 cursor-pointer transition-all"
                :class="activeSession ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'"
                @click="activeSession ? openCloseSession() : openOpenSession()"
              >
                <div
                  class="w-1rem h-1rem border-round-full"
                  :class="activeSession ? 'bg-green-500' : 'bg-red-400'"
                  style="animation: blink 2s infinite;"
                />
                <span class="text-xs font-bold" :class="activeSession ? 'text-green-700' : 'text-red-600'">
                  {{ activeSession ? 'جلسة مفتوحة' : 'لا توجد جلسة' }}
                </span>
              </div>

              <Button icon="pi pi-history" text rounded severity="secondary" size="small"
                v-tooltip.bottom="'سجل الطلبات'" @click="goToHistory" />

              <div class="flex align-items-center gap-1 surface-100 px-2 py-1 border-round-lg">
                <i class="pi pi-clock text-primary text-xs" />
                <span class="text-xs font-bold text-primary">{{ currentTime }}</span>
                <LogoutButton @before-logout="handleBeforeLogout" />
              </div>
            </div>
          </div>
        </Transition>

        <!-- Stats Bar -->
        <div class="flex gap-2 overflow-x-auto pb-1">
          <div
            class="stats-card flex align-items-center gap-2 border-round-xl border-1 cursor-pointer flex-shrink-0"
            :class="[
              isScrolled ? 'px-2 py-1' : 'px-3 py-2',
              activeFilter === 'unpaid' ? 'bg-red-100 border-red-400' : 'surface-card border-transparent shadow-1'
            ]"
            @click="onFilter('unpaid')"
          >
            <i class="pi pi-times-circle text-red-600" :class="isScrolled ? 'text-sm' : ''" />
            <div class="flex flex-column">
              <span v-if="!isScrolled" class="text-xs text-500">غير مدفوع</span>
              <span :class="isScrolled ? 'text-sm font-bold text-900' : 'text-lg font-bold text-900 line-height-1'">
                {{ unpaidCount }}
              </span>
            </div>
          </div>

          <div
            class="stats-card flex align-items-center gap-2 border-round-xl border-1 cursor-pointer flex-shrink-0"
            :class="[
              isScrolled ? 'px-2 py-1' : 'px-3 py-2',
              activeFilter === 'paid' ? 'bg-green-100 border-green-400' : 'surface-card border-transparent shadow-1'
            ]"
            @click="onFilter('paid')"
          >
            <i class="pi pi-check-circle text-green-600" :class="isScrolled ? 'text-sm' : ''" />
            <div class="flex flex-column">
              <span v-if="!isScrolled" class="text-xs text-500">مدفوع</span>
              <span :class="isScrolled ? 'text-sm font-bold text-900' : 'text-lg font-bold text-900 line-height-1'">
                {{ paidCount }}
              </span>
            </div>
          </div>

          <div
            class="stats-card flex align-items-center gap-2 border-round-xl border-1 cursor-pointer flex-shrink-0"
            :class="[
              isScrolled ? 'px-2 py-1' : 'px-3 py-2',
              activeFilter === 'empty' ? 'bg-blue-100 border-blue-400' : 'surface-card border-transparent shadow-1'
            ]"
            @click="onFilter('empty')"
          >
            <i class="pi pi-th-large text-blue-600" :class="isScrolled ? 'text-sm' : ''" />
            <div class="flex flex-column">
              <span v-if="!isScrolled" class="text-xs text-500">فارغة</span>
              <span :class="isScrolled ? 'text-sm font-bold text-900' : 'text-lg font-bold text-900 line-height-1'">
                {{ emptyCount }}
              </span>
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

    <!-- تنبيه لا توجد جلسة مفتوحة -->
    <Transition name="fade">
      <div
        v-if="!activeSession && !loading"
        class="mx-3 mt-3 p-3 bg-orange-50 border-1 border-orange-300 border-round-xl flex align-items-center gap-3"
      >
        <i class="pi pi-exclamation-triangle text-orange-500 text-xl flex-shrink-0" />
        <div class="flex-1">
          <p class="m-0 font-bold text-orange-800 text-sm">لا توجد جلسة مفتوحة</p>
          <p class="m-0 text-orange-600 text-xs mt-1">يجب فتح جلسة لتتمكن من إتمام عمليات الدفع</p>
        </div>
        <Button label="فتح جلسة" icon="pi pi-lock-open" severity="warning" size="small" @click="openOpenSession" />
      </div>
    </Transition>

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
        <Button icon="pi pi-refresh" :loading="isRefreshing" severity="secondary" text rounded size="small" @click="refresh" />
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-content-center align-items-center py-8">
        <ProgressSpinner />
      </div>

      <template v-else>

        <!-- عرض بطوابق -->
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

        <!-- عرض بدون طوابق -->
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
          <Button label="إتمام الدفع" icon="pi pi-wallet" class="w-full" :disabled="!activeSession" @click="openInvoice" />
          <p v-if="!activeSession" class="text-xs text-center text-orange-500 mt-2 m-0">
            <i class="pi pi-exclamation-triangle ml-1" />
            افتح جلسة كاشير أولاً لإتمام الدفع
          </p>
        </div>
        <div v-else-if="selectedTable?.paymentStatus === 'paid'" class="w-full flex flex-column gap-2">
          <div class="p-3 bg-green-50 border-1 border-green-200 border-round-xl flex align-items-center gap-2">
            <i class="pi pi-check-circle text-green-600 text-xl" />
            <div>
              <p class="m-0 font-bold text-green-800 text-sm">تم الدفع بنجاح</p>
              <p class="m-0 text-green-600 text-xs">في انتظار مغادرة الزبون</p>
            </div>
          </div>
          <Button
            label="مغادرة الزبون - تفريغ الطاولة"
            icon="pi pi-sign-out"
            severity="secondary"
            class="w-full"
            :loading="clearingTable"
            @click="confirmClearTable"
          />
        </div>
      </template>
    </Drawer>

    <!-- Invoice Dialog -->
    <InvoiceDialog v-model="invoiceVisible" :table="selectedTable" @confirm="onPaymentConfirm" />

    <!-- CashBox Session Dialogs -->
    <CashboxSessionDialog v-model="openSessionDialogVisible" mode="open" :loading="sessionLoading" @confirm="handleOpenSession" />
    <CashboxSessionDialog v-model="closeSessionDialogVisible" mode="close" :loading="sessionLoading" :session-info="activeSession" @confirm="handleCloseSession" />

    <!-- Close Session Before Logout Dialog -->
    <Dialog v-model:visible="logoutSessionDialogVisible" :modal="true" :draggable="false" :closable="false" style="width: 100%; max-width: 360px;" dir="rtl">
      <template #container>
        <div class="logout-session-dialog">
          <div class="icon-wrap">
            <div class="icon-ring"><i class="pi pi-sign-out" /></div>
          </div>
          <p class="dialog-title">تسجيل الخروج</p>
          <p class="dialog-sub">لديك جلسة مفتوحة. هل تريد إغلاقها قبل الخروج؟</p>
          <div class="dialog-actions">
            <Button label="إغلاق الجلسة والخروج" severity="danger" class="w-full" :loading="sessionLoading" @click="closeSessionThenLogout" />
            <Button label="خروج بدون إغلاق" severity="secondary" outlined class="w-full" @click="proceedLogout" />
            <Button label="إلغاء" text class="w-full" @click="logoutSessionDialogVisible = false" />
          </div>
        </div>
      </template>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { tableApi, orderApi, cashBoxApi } from '../../../services/api.service'
import { tablesAdminApi } from '../../dashboard/tables/api/tables-admin.api'
import { PaymentMethod } from '../../../types/api.types'
import type { CashierTable, PaymentMethod as CashierPaymentMethod } from '../types/cashier.types'
import type { Floor } from '../../dashboard/tables/types/tables-admin.types'
import TableGrid from '../components/TableGrid.vue'
import OrderSummary from '../components/OrderSummary.vue'
import InvoiceDialog from '../components/InvoiceDialog.vue'
import CashboxSessionDialog from '../components/CashboxSessionDialog.vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import LogoutButton from '../../../components/shared/Logoutbutton.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../auth/store/auth.store'

const router          = useRouter()
const toast           = useToast()
const auth            = useAuthStore()
const currentTime     = ref('')
const isScrolled      = ref(false)
const activeFilter    = ref<'unpaid' | 'paid' | 'empty' | null>(null)
const selectedFloorId = ref<number | null>(null)
const isRefreshing    = ref(false)
const loading         = ref(true)
const loadingInvoice  = ref(false)
const drawerVisible   = ref(false)
const invoiceVisible  = ref(false)
const clearingTable   = ref(false)
const selectedTable   = ref<CashierTable | null>(null)
const tables          = ref<CashierTable[]>([])
const floors          = ref<Floor[]>([])

// ── CashBox Session ──────────────────────────────────
const activeSession              = ref<any | null>(null)
const sessionLoading             = ref(false)
const openSessionDialogVisible   = ref(false)
const closeSessionDialogVisible  = ref(false)
const logoutSessionDialogVisible = ref(false)

let timer: ReturnType<typeof setInterval>

function handleScroll() {
  isScrolled.value = window.scrollY > 300
}

onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  window.addEventListener('scroll', handleScroll)
  await Promise.all([loadTables(), fetchActiveSession()])
  if (!activeSession.value) {
    openSessionDialogVisible.value = true
  }
})

onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('scroll', handleScroll)
})

function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('ar-IQ', {
    hour: '2-digit', minute: '2-digit',
  })
}

// ── CashBox Session Functions ────────────────────────
async function fetchActiveSession() {
  try {
    const res = await cashBoxApi.getActiveSession()
    activeSession.value = res ?? null
  } catch {
    activeSession.value = null
  }
}

function openOpenSession() {
  openSessionDialogVisible.value = true
}

function openCloseSession() {
  closeSessionDialogVisible.value = true
}

async function handleOpenSession(amount: number) {
  sessionLoading.value = true
  try {
    const res = await cashBoxApi.openSession({ cashBoxId: 1, openingBalance: amount })
    activeSession.value = res
    openSessionDialogVisible.value = false
    toast.add({ severity: 'success', summary: 'تم', detail: 'تم فتح جلسة الكاشير بنجاح', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل فتح الجلسة', life: 3000 })
  } finally {
    sessionLoading.value = false
  }
}

async function handleCloseSession(amount: number) {
  if (!activeSession.value) return
  sessionLoading.value = true
  try {
    await cashBoxApi.closeSession({ cashBoxSessionId: activeSession.value.id, cashAmount: amount })
    activeSession.value = null
    closeSessionDialogVisible.value = false
    toast.add({ severity: 'success', summary: 'تم', detail: 'تم إغلاق الجلسة بنجاح', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل إغلاق الجلسة', life: 3000 })
  } finally {
    sessionLoading.value = false
  }
}

// ── Logout Handling ───────────────────────────────────
function handleBeforeLogout() {
  if (activeSession.value) {
    logoutSessionDialogVisible.value = true
    return false
  }
  return true
}

async function closeSessionThenLogout() {
  if (!activeSession.value) { proceedLogout(); return }
  sessionLoading.value = true
  try {
    await cashBoxApi.closeSession({ cashBoxSessionId: activeSession.value.id, cashAmount: 0 })
    activeSession.value = null
    logoutSessionDialogVisible.value = false
    proceedLogout()
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل إغلاق الجلسة', life: 3000 })
  } finally {
    sessionLoading.value = false
  }
}

function proceedLogout() {
  logoutSessionDialogVisible.value = false
  auth.logout()
}

// ── helpers ───────────────────────────────────────────
function isOpenInvoice(inv: any): boolean {
  return inv.invoiceStatus === 'Pending' || inv.invoiceStatus === 'Open' || inv.status === 0
}

function isPaidInvoice(inv: any): boolean {
  return inv.invoiceStatus === 'Paid' || inv.status === 1
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

    tableItems.forEach((t: any) => {
      const invoices: any[] = Array.isArray(t.invoices) ? t.invoices : []
      const tableRef = tables.value.find(tb => tb.id === t.id)
      if (!tableRef) return

      const openInvoice = invoices.find(isOpenInvoice)
      if (openInvoice) {
        tableRef.order         = buildOrder(t.id, openInvoice)
        tableRef.paymentStatus = 'unpaid'
      } else {
        const paidInvoice = invoices.find(isPaidInvoice)
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
  await Promise.all([loadTables(), fetchActiveSession()])
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

const unpaidCount = computed(() => tables.value.filter(t => t.order && t.paymentStatus === 'unpaid').length)
const paidCount   = computed(() => tables.value.filter(t => t.paymentStatus === 'paid').length)
const emptyCount  = computed(() => tables.value.filter(t => !t.order).length)

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
      const openInvoice = raw.find(isOpenInvoice)
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

function goToHistory() {
  router.push({ name: 'cashier-order-history' })
}

function confirmClearTable() {
  if (!selectedTable.value) return
  clearTable()
}

function clearTable() {
  if (!selectedTable.value) return
  clearingTable.value = true

  const idx = tables.value.findIndex(t => t.id === selectedTable.value!.id)
  if (idx !== -1) {
    tables.value[idx] = { ...tables.value[idx], order: null, paymentStatus: 'unpaid' }
  }

  clearingTable.value = false
  drawerVisible.value = false
  toast.add({ severity: 'info', summary: 'تم التفريغ', detail: `طاولة ${selectedTable.value.number} أصبحت فارغة`, life: 3000 })
}

async function onPaymentConfirm(payload: {
  method: CashierPaymentMethod
  discountType: number
  discountAmount: number | null
  finalPrice: number
}) {
  if (!selectedTable.value?.order) return

  const methodMap: Record<CashierPaymentMethod, number> = {
    cash:   PaymentMethod.Cash,
    card:   PaymentMethod.Card,
    online: PaymentMethod.Online,
  }

  try {
    const hasDiscount = payload.discountAmount !== null && payload.discountAmount > 0
    await orderApi.checkout({
      invoiceId:        selectedTable.value.order.id,
      paymentMethod:    methodMap[payload.method],
      amountPaid:       payload.finalPrice,
      cashBoxSessionId: activeSession.value?.id ?? null,
      ...(hasDiscount && {
        discountType:   payload.discountType,
        discountAmount: payload.discountAmount!,
      }),
    })

    const idx = tables.value.findIndex(t => t.id === selectedTable.value!.id)
    if (idx !== -1) {
      tables.value[idx].paymentStatus        = 'paid'
      tables.value[idx].order!.paymentStatus = 'paid'
      tables.value[idx].order!.paymentMethod = payload.method
    }

    drawerVisible.value = false
    toast.add({ severity: 'success', summary: 'تم الدفع', detail: `تم استلام دفع طاولة ${selectedTable.value.number} بنجاح`, life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل إتمام الدفع', life: 3000 })
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  max-height: 0;
  margin-bottom: 0 !important;
}
.slide-up-enter-to, .slide-up-leave-from {
  opacity: 1;
  max-height: 60px;
}

.stats-card {
  transition: all 0.25s ease;
}

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
.floor-tab:hover  { background: var(--p-surface-100); color: var(--p-text-color); }
.floor-tab.active { background: var(--p-primary-color); border-color: var(--p-primary-color); color: #fff; }

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

.logout-session-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem 1.5rem;
  border-radius: 16px;
  background: var(--p-surface-0);
  text-align: center;
}
.icon-wrap { margin-bottom: 1.25rem; }
.icon-ring {
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--p-red-100);
  display: flex; align-items: center; justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}
.icon-ring i { font-size: 1.75rem; color: var(--p-red-500); }
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.2); }
  50%       { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
}
.dialog-title { font-size: 1.15rem; font-weight: 700; margin: 0 0 0.4rem; color: var(--p-text-color); }
.dialog-sub { font-size: 0.875rem; color: var(--p-text-muted-color); margin: 0 0 1.5rem; line-height: 1.6; }
.dialog-actions { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; }
</style>