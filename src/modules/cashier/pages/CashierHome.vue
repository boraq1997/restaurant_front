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

      <Transition v-else name="fade" mode="out-in">
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

      <!-- Loading فاتورة -->
      <div v-if="loadingInvoice" class="flex justify-content-center py-8">
        <ProgressSpinner style="width:32px;height:32px" />
      </div>

      <template v-else-if="selectedTable">
        <OrderSummary
          v-if="selectedTable.order"
          :table="selectedTable"
        />
        <div v-else class="flex flex-column align-items-center justify-content-center py-8 gap-3">
          <i class="pi pi-inbox text-4xl text-300" />
          <p class="text-500 m-0 text-sm">لا يوجد طلب نشط لهذه الطاولة</p>
        </div>
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
import { tableApi, orderApi } from '../../../services/api.service'
import { PaymentMethod, InvoiceStatus } from '../../../types/api.types'
import type { CashierTable, PaymentMethod as CashierPaymentMethod } from '../types/cashier.types'
import TableGrid from '../components/TableGrid.vue'
import OrderSummary from '../components/OrderSummary.vue'
import InvoiceDialog from '../components/InvoiceDialog.vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import ProgressSpinner from 'primevue/progressspinner'
import LogoutButton from '../../../components/shared/Logoutbutton.vue'

const toast          = useToast()
const currentTime    = ref('')
const activeFilter   = ref<'unpaid' | 'paid' | 'empty' | null>(null)
const isRefreshing   = ref(false)
const loading        = ref(true)
const loadingInvoice = ref(false)
const drawerVisible  = ref(false)
const invoiceVisible = ref(false)
const selectedTable  = ref<CashierTable | null>(null)
const tables         = ref<CashierTable[]>([])

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

// ── جلب الطاولات ──────────────────────────────────────
async function loadTables() {
  loading.value = true
  try {
    const res = await tableApi.getAll()
    // بناء قائمة الطاولات بدون فواتير أولاً
    tables.value = res.map((t: any) => ({
      id:            t.id,
      name:          `طاولة ${t.number}`,
      number:        t.number,
      capacity:      t.capacity,
      paymentStatus: 'unpaid' as const,
      order:         null,
    }))
    // جلب الفواتير لكل الطاولات بالتوازي
    await loadAllInvoices()
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل الطاولات', life: 3000 })
  } finally {
    loading.value = false
  }
}

async function loadAllInvoices() {
  await Promise.allSettled(
    tables.value.map(async (table) => {
      try {
        const invoices = await tableApi.getInvoices(table.id)
        const raw = Array.isArray(invoices) ? invoices : []

        // البحث عن الفاتورة المفتوحة فقط
        const openInvoice = raw.find((inv: any) =>
          (inv.invoiceStatus ?? inv.status ?? 0) === InvoiceStatus.Open
        )

        if (openInvoice) {
          const items = (openInvoice.invoiceItemsDto ?? openInvoice.items ?? []).map((item: any) => ({
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

          table.order = {
            id:            openInvoice.id,
            tableId:       table.id,
            items,
            totalPrice:    openInvoice.finalPrice ?? openInvoice.totalPrice ?? 0,
            createdAt:     openInvoice.createdAt ?? '',
            paymentStatus: 'unpaid',
          }
          table.paymentStatus = 'unpaid'
        }

        // التحقق من وجود فاتورة مدفوعة إذا لم تكن مفتوحة
        if (!openInvoice) {
          const paidInvoice = raw.find((inv: any) =>
            (inv.invoiceStatus ?? inv.status ?? 0) === InvoiceStatus.Paid
          )
          if (paidInvoice) {
            table.paymentStatus = 'paid'
          }
        }

      } catch {
        // تجاهل — الطاولة ستبقى فارغة
      }
    })
  )
  // force reactivity
  tables.value = [...tables.value]
}

async function refresh() {
  isRefreshing.value = true
  await loadTables()
  isRefreshing.value = false
}

// ── Computed ──────────────────────────────────────────
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

// ── Actions ───────────────────────────────────────────
function onFilter(filter: 'unpaid' | 'paid' | 'empty') {
  activeFilter.value = activeFilter.value === filter ? null : filter
}

async function onTableSelect(table: CashierTable) {
  selectedTable.value = table
  drawerVisible.value = true

  // إذا ما في طلب — نحاول جلب الفاتورة مجدداً عند الفتح
  if (!table.order) {
    loadingInvoice.value = true
    try {
      const invoices = await tableApi.getInvoices(table.id)
      const raw = Array.isArray(invoices) ? invoices : []
      const openInvoice = raw.find((inv: any) =>
        (inv.invoiceStatus ?? inv.status ?? 0) === InvoiceStatus.Open
      )
      if (openInvoice) {
        const items = (openInvoice.invoiceItemsDto ?? openInvoice.items ?? []).map((item: any) => ({
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

        selectedTable.value = {
          ...table,
          order: {
            id:            openInvoice.id,
            tableId:       table.id,
            items,
            totalPrice:    openInvoice.finalPrice ?? openInvoice.totalPrice ?? 0,
            createdAt:     openInvoice.createdAt ?? '',
            paymentStatus: 'unpaid',
          },
          paymentStatus: 'unpaid',
        }
        // تحديث الطاولة في القائمة أيضاً
        const idx = tables.value.findIndex(t => t.id === table.id)
        if (idx !== -1) tables.value[idx] = { ...selectedTable.value }
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

    // تحديث محلي
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
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل إتمام الدفع، حاول مرة أخرى',
      life: 3000,
    })
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>