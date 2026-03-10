<!-- src/modules/cashier/pages/OrderHistoryPage.vue -->
<template>
  <div class="min-h-screen surface-50" dir="rtl">

    <!-- Header -->
    <header class="surface-card shadow-1 sticky top-0 z-5 border-bottom-1 border-200">
      <div class="px-3 pt-3 pb-2">

        <div class="flex align-items-center gap-2 mb-3">
          <Button icon="pi pi-arrow-right" text rounded severity="secondary" @click="$router.back()" />
          <div class="flex-1">
            <p class="font-bold text-base m-0 text-900 line-height-1">سجل الطلبات</p>
            <span class="text-xs text-500">{{ totalRecords }} طلب إجمالي</span>
          </div>
          <Button icon="pi pi-filter-slash" text rounded severity="secondary" v-tooltip="'مسح الفلاتر'" @click="resetFilters" />
        </div>

        <!-- فلتر التاريخ -->
        <div class="flex gap-2 mb-2">
          <div class="flex-1">
            <DatePicker v-model="filters.startDate" dateFormat="yy-mm-dd" placeholder="من تاريخ" class="w-full" showIcon :manualInput="false" />
          </div>
          <div class="flex-1">
            <DatePicker v-model="filters.endDate" dateFormat="yy-mm-dd" placeholder="إلى تاريخ" class="w-full" showIcon :manualInput="false" />
          </div>
        </div>

        <!-- فلتر الحالة -->
        <div class="flex gap-2 overflow-x-auto pb-2" style="scrollbar-width:none">
          <button
            v-for="s in statusOptions"
            :key="String(s.value)"
            class="status-chip"
            :class="{ active: filters.status === s.value }"
            @click="filters.status = filters.status === s.value ? null : s.value"
          >
            <i :class="s.icon" />{{ s.label }}
          </button>
        </div>

        <Button label="بحث" icon="pi pi-search" size="small" class="w-full" :loading="loading" @click="fetchHistory(1)" />
      </div>
    </header>

    <!-- Content -->
    <main class="px-3 pt-3 pb-6">

      <div v-if="loading" class="flex justify-content-center py-8">
        <ProgressSpinner />
      </div>

      <template v-else>

        <!-- فارغ -->
        <div v-if="orders.length === 0" class="flex flex-column align-items-center py-8 gap-3">
          <div class="w-5rem h-5rem border-round-full surface-100 flex align-items-center justify-content-center">
            <i class="pi pi-inbox text-4xl text-300" />
          </div>
          <p class="text-500 m-0 font-medium">لا توجد طلبات</p>
          <Button label="مسح الفلاتر" text size="small" @click="resetFilters" />
        </div>

        <!-- الشبكة -->
        <div v-else class="orders-grid">
          <div
            v-for="order in orders"
            :key="order.id"
            class="order-card surface-card border-round-xl overflow-hidden cursor-pointer flex flex-column"
            @click="openDetail(order)"
          >
            <!-- شريط ملون أعلى البطاقة -->
            <div class="status-bar" :class="statusBarClass(order.invoiceStatus)" />

            <!-- المحتوى -->
            <div class="p-3 flex flex-column gap-2 flex-1">

              <!-- الطاولة + الحالة -->
              <div class="flex align-items-center justify-content-between">
                <div class="flex align-items-center gap-1">
                  <div class="w-1rem h-1rem border-round flex align-items-center justify-content-center flex-shrink-0" :class="statusBgClass(order.invoiceStatus)">
                    <i class="pi pi-receipt" style="font-size:0.55rem" :class="statusIconClass(order.invoiceStatus)" />
                  </div>
                  <span class="font-bold text-xs text-900">طاولة {{ order.tableId }}</span>
                </div>
                <Tag :severity="statusSeverity(order.invoiceStatus)" rounded>
                  <span style="font-size:0.65rem" class="font-bold">{{ statusLabel(order.invoiceStatus) }}</span>
                </Tag>
              </div>

              <!-- رقم الفاتورة -->
              <p class="m-0 text-400 text-xs">#{{ order.id }}</p>

              <!-- السعر -->
              <p class="m-0 font-bold text-lg text-primary line-height-1">
                {{ order.finalPrice?.toLocaleString() }}
                <span class="text-xs font-normal text-500">د.ع</span>
              </p>

              <!-- المواد -->
              <div class="flex flex-wrap gap-1 mt-auto pt-2 border-top-1 surface-border">
                <template v-if="validItems(order).length > 0">
                  <span v-for="item in validItems(order).slice(0, 2)" :key="item.id" class="item-chip">
                    {{ item.menuItemName }} ×{{ item.quantity }}
                  </span>
                  <span v-if="validItems(order).length > 2" class="item-chip item-chip--more">
                    +{{ validItems(order).length - 2 }}
                  </span>
                </template>
                <span v-else class="text-xs text-400 italic">—</span>
              </div>

              <!-- التاريخ -->
              <span class="text-400" style="font-size:0.7rem">{{ formatDate(order.createdAt) }}</span>

            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex flex-column align-items-center gap-2 mt-5">
          <div class="flex align-items-center gap-2">
            <Button icon="pi pi-angle-double-right" text rounded severity="secondary" size="small" :disabled="currentPage === 1" @click="fetchHistory(1)" />
            <Button icon="pi pi-angle-right" text rounded severity="secondary" size="small" :disabled="currentPage === 1" @click="fetchHistory(currentPage - 1)" />

            <div class="flex gap-1">
              <button
                v-for="(page, i) in visiblePages"
                :key="i"
                class="page-btn"
                :class="{ active: page === currentPage, dots: page === '...' }"
                :disabled="page === '...'"
                @click="page !== '...' && fetchHistory(Number(page))"
              >
                {{ page }}
              </button>
            </div>

            <Button icon="pi pi-angle-left" text rounded severity="secondary" size="small" :disabled="currentPage === totalPages" @click="fetchHistory(currentPage + 1)" />
            <Button icon="pi pi-angle-double-left" text rounded severity="secondary" size="small" :disabled="currentPage === totalPages" @click="fetchHistory(totalPages)" />
          </div>
          <p class="text-xs text-400 m-0">صفحة {{ currentPage }} من {{ totalPages }} · {{ totalRecords }} طلب</p>
        </div>

      </template>
    </main>

    <!-- Detail Drawer -->
    <Drawer v-model:visible="detailVisible" position="left" style="width:100%; max-width:460px;" :modal="true" dir="rtl">
      <template #header>
        <div class="flex align-items-center gap-2">
          <div class="w-2rem h-2rem border-round-lg flex align-items-center justify-content-center" :class="statusBgClass(selectedOrder?.invoiceStatus)">
            <i class="pi pi-receipt text-xs" :class="statusIconClass(selectedOrder?.invoiceStatus)" />
          </div>
          <div>
            <p class="font-bold m-0 text-sm text-900">فاتورة #{{ selectedOrder?.id }}</p>
            <span class="text-xs text-500">طاولة {{ selectedOrder?.tableId }}</span>
          </div>
        </div>
      </template>

      <div v-if="selectedOrder" class="flex flex-column gap-3 pb-3">

        <!-- معلومات عامة -->
        <div class="surface-50 border-round-xl p-3 border-1 surface-border flex flex-column gap-2">
          <div class="flex justify-content-between align-items-center">
            <span class="text-xs text-500">رقم الطاولة</span>
            <span class="text-sm font-bold text-900">طاولة {{ selectedOrder.tableId }}</span>
          </div>
          <Divider class="my-1" />
          <div class="flex justify-content-between align-items-center">
            <span class="text-xs text-500">الحالة</span>
            <Tag :severity="statusSeverity(selectedOrder.invoiceStatus)" rounded>
              <span class="text-xs font-bold">{{ statusLabel(selectedOrder.invoiceStatus) }}</span>
            </Tag>
          </div>
          <div class="flex justify-content-between align-items-center">
            <span class="text-xs text-500">طريقة الدفع</span>
            <div class="flex align-items-center gap-1">
              <i :class="paymentIcon(selectedOrder.paymentMethod)" class="text-xs text-500" />
              <span class="text-sm font-bold text-900">{{ paymentMethodLabel(selectedOrder.paymentMethod) }}</span>
            </div>
          </div>
          <div class="flex justify-content-between align-items-center">
            <span class="text-xs text-500">نوع الطلب</span>
            <span class="text-sm font-bold text-900">{{ orderTypeLabel(selectedOrder.orderType) }}</span>
          </div>
          <div class="flex justify-content-between align-items-center">
            <span class="text-xs text-500">التاريخ والوقت</span>
            <span class="text-sm font-bold text-900">{{ formatDate(selectedOrder.createdAt) }}</span>
          </div>
        </div>

        <!-- المواد -->
        <div>
          <p class="font-bold text-sm text-900 mb-2 m-0">المواد المطلوبة</p>
          <div class="flex flex-column gap-2">
            <div
              v-for="item in selectedOrder.invoiceItemsDto"
              :key="item.id"
              class="flex justify-content-between align-items-start p-2 surface-50 border-round-lg border-1 surface-border"
            >
              <div class="flex-1 min-w-0 ml-2">
                <p class="m-0 text-sm font-medium text-900">
                  {{ item.menuItemName || 'صنف غير معروف' }}
                </p>
                <div v-if="item.selectedOptionsDto?.length" class="flex flex-wrap gap-1 mt-1">
                  <span v-for="opt in item.selectedOptionsDto" :key="opt.id" class="text-xs text-500 surface-100 px-1 border-round">
                    {{ opt.name || 'إضافة' }} +{{ opt.price?.toLocaleString() }}
                  </span>
                </div>
              </div>
              <div class="flex align-items-center gap-2 flex-shrink-0">
                <span class="text-xs text-400 surface-100 px-2 py-1 border-round">×{{ item.quantity }}</span>
                <span class="text-sm font-bold text-primary white-space-nowrap">{{ item.totalPrice?.toLocaleString() }} د.ع</span>
              </div>
            </div>
          </div>
        </div>

        <!-- الإجمالي -->
        <div class="surface-50 border-round-xl p-3 border-1 surface-border flex flex-column gap-2">
          <div class="flex justify-content-between align-items-center">
            <span class="text-sm text-500">المجموع الجزئي</span>
            <span class="text-sm font-medium text-700">{{ selectedOrder.subTotalPrice?.toLocaleString() }} د.ع</span>
          </div>
          <div v-if="selectedOrder.discountPrice > 0" class="flex justify-content-between align-items-center">
            <span class="text-sm text-500">الخصم</span>
            <span class="text-sm font-medium text-orange-600">- {{ selectedOrder.discountPrice?.toLocaleString() }} د.ع</span>
          </div>
          <Divider class="my-1" />
          <div class="flex justify-content-between align-items-center">
            <span class="font-bold text-base text-900">الإجمالي النهائي</span>
            <span class="font-bold text-xl text-primary">{{ selectedOrder.finalPrice?.toLocaleString() }} د.ع</span>
          </div>
        </div>

      </div>
    </Drawer>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'
import Drawer from 'primevue/drawer'
import ProgressSpinner from 'primevue/progressspinner'
import DatePicker from 'primevue/datepicker'
import { orderApi } from '../../../services/api.service'

const loading      = ref(false)
const orders       = ref<any[]>([])
const totalRecords = ref(0)
const totalPages   = ref(1)
const currentPage  = ref(1)
const PAGE_SIZE    = 15

const detailVisible = ref(false)
const selectedOrder = ref<any | null>(null)

const filters = ref({
  startDate: null as Date | null,
  endDate:   null as Date | null,
  status:    null as number | null,
})

const statusOptions = [
  { value: null, label: 'الكل',  icon: 'pi pi-list text-xs ml-1' },
  { value: 0,    label: 'مفتوح', icon: 'pi pi-clock text-xs ml-1' },
  { value: 1,    label: 'مدفوع', icon: 'pi pi-wallet text-xs ml-1' },
  { value: 2,    label: 'ملغى',  icon: 'pi pi-times-circle text-xs ml-1' },
]

onMounted(() => fetchHistory(1))

async function fetchHistory(page: number) {
  loading.value     = true
  currentPage.value = page
  try {
    const params: Record<string, any> = { PageNumber: page, PageSize: PAGE_SIZE }
    if (filters.value.startDate) params.StartDate = toDateStr(filters.value.startDate)
    if (filters.value.endDate)   params.EndDate   = toDateStr(filters.value.endDate)
    if (filters.value.status !== null) params.Status = filters.value.status

    const res          = await orderApi.getHistory(params)
    orders.value       = res?.items ?? []
    totalRecords.value = res?.totalCount ?? orders.value.length
    totalPages.value   = res?.totalPages ?? Math.max(1, Math.ceil(totalRecords.value / PAGE_SIZE))
    currentPage.value  = res?.currentPage ?? page
  } catch {
    orders.value = []
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  filters.value = { startDate: null, endDate: null, status: null }
  fetchHistory(1)
}

function openDetail(order: any) {
  selectedOrder.value = order
  detailVisible.value = true
}

// ── Pagination ────────────────────────────────────────
const visiblePages = computed(() => {
  const total   = totalPages.value
  const current = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = [1]
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

// ── Helpers ───────────────────────────────────────────
function validItems(order: any) {
  return (order.invoiceItemsDto ?? []).filter((i: any) => i.menuItemName?.trim())
}

function toDateStr(d: Date) { return d.toISOString().split('T')[0] }

function formatDate(str: string) {
  if (!str) return ''
  return new Date(str).toLocaleString('ar-IQ', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function statusLabel(s: number)    { return ['مفتوح', 'مدفوع', 'ملغى', 'معلق'][s] ?? 'غير معروف' }
function statusSeverity(s: number) { return (['info', 'success', 'danger', 'warn'] as const)[s] ?? 'secondary' }
function statusBgClass(s: number)  { return ['bg-blue-50', 'bg-green-50', 'bg-red-50', 'bg-orange-50'][s] ?? 'surface-100' }
function statusIconClass(s: number){ return ['text-blue-500', 'text-green-500', 'text-red-500', 'text-orange-500'][s] ?? 'text-400' }
function statusBarClass(s: number) { return ['bg-blue-300', 'bg-green-400', 'bg-red-400', 'bg-orange-300'][s] ?? 'surface-200' }

function paymentMethodLabel(m: number) { return ['نقدي', 'بطاقة', 'إلكتروني', 'غير محدد'][m] ?? '-' }
function paymentIcon(m: number)        { return ['pi pi-wallet', 'pi pi-credit-card', 'pi pi-mobile', 'pi pi-question'][m] ?? 'pi pi-question' }
function orderTypeLabel(t: number)     { return ['طلب داخلي', 'طلب خارجي'][t] ?? 'غير معروف' }
</script>

<style scoped>
.status-chip {
  display: inline-flex; align-items: center; gap: 0.25rem;
  padding: 0.3rem 0.85rem; border-radius: 999px;
  border: 1.5px solid var(--p-surface-300);
  background: var(--p-surface-0); color: var(--p-text-color-secondary);
  font-size: 0.78rem; font-weight: 500; cursor: pointer;
  white-space: nowrap; flex-shrink: 0; transition: all 0.15s;
}
.status-chip:hover { background: var(--p-surface-100); }
.status-chip.active { background: var(--p-primary-color); border-color: var(--p-primary-color); color: #fff; }

.order-card { box-shadow: 0 1px 4px rgba(0,0,0,0.06); transition: transform 0.15s, box-shadow 0.15s; }
.order-card:active { transform: scale(0.99); }

.status-bar { height: 3px; }

.item-chip {
  display: inline-flex; align-items: center;
  padding: 0.2rem 0.6rem; border-radius: 6px;
  background: var(--p-surface-100); color: var(--p-text-color-secondary);
  font-size: 0.75rem; white-space: nowrap;
}
.item-chip--more { background: var(--p-primary-50, #eff6ff); color: var(--p-primary-color); font-weight: 600; }

.page-btn {
  min-width: 2rem; height: 2rem; border-radius: 8px;
  border: 1.5px solid var(--p-surface-300);
  background: var(--p-surface-0); color: var(--p-text-color-secondary);
  font-size: 0.8rem; font-weight: 500; cursor: pointer;
  transition: all 0.15s; padding: 0 0.35rem;
}
.page-btn:hover:not(.dots):not(.active) { background: var(--p-surface-100); }
.page-btn.active { background: var(--p-primary-color); border-color: var(--p-primary-color); color: #fff; font-weight: 700; }
.page-btn.dots { border-color: transparent; background: transparent; cursor: default; }

/* Grid */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 0.75rem;
}
@media (min-width: 640px) {
  .orders-grid { grid-template-columns: repeat(5, 1fr); }
}
</style>