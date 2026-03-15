<!-- src/modules/dashboard/home/pages/DashboardHome.vue -->
<template>
  <div class="min-h-screen surface-50" dir="rtl">

    <!-- ── Header ─────────────────────────────────────── -->
    <div class="px-4 py-4 surface-card border-bottom-1 border-200">
      <div class="flex align-items-center justify-content-between">
        <div>
          <h1 class="text-lg font-bold text-900 m-0 line-height-1">لوحة التحكم</h1>
          <p class="text-xs text-500 m-0 mt-1">{{ todayDate }}</p>
        </div>
        <Button
          icon="pi pi-refresh"
          text rounded severity="secondary" size="small"
          :loading="loadingStats"
          @click="fetchStats"
        />
      </div>
    </div>

    <main class="px-4 pt-4 pb-6">

      <!-- ── إحصائيات اليوم ─────────────────────────── -->
      <p class="text-xs font-bold text-400 mb-3 m-0">إحصائيات اليوم</p>

      <div class="grid m-0 mb-5">

        <!-- الإيرادات -->
        <div class="col-6 lg:col-3 p-2">
          <div class="stat-card surface-card border-round-xl border-1 border-200 p-3 shadow-1">
            <div class="flex align-items-center justify-content-between mb-3">
              <div class="stat-icon bg-green-50">
                <i class="pi pi-dollar text-green-600" />
              </div>
              <span class="text-xs text-400">اليوم</span>
            </div>
            <div v-if="loadingStats" class="skeleton h-2rem border-round mb-1" />
            <p v-else class="font-bold text-xl text-900 m-0 line-height-1">
              {{ stats.todayRevenue.toLocaleString() }}
              <span class="text-xs font-normal text-400"> د.ع</span>
            </p>
            <span class="text-xs text-500">الإيرادات</span>
          </div>
        </div>

        <!-- الطلبات -->
        <div class="col-6 lg:col-3 p-2">
          <div class="stat-card surface-card border-round-xl border-1 border-200 p-3 shadow-1">
            <div class="flex align-items-center justify-content-between mb-3">
              <div class="stat-icon bg-blue-50">
                <i class="pi pi-receipt text-blue-600" />
              </div>
              <span class="text-xs text-400">اليوم</span>
            </div>
            <div v-if="loadingStats" class="skeleton h-2rem border-round mb-1" />
            <p v-else class="font-bold text-xl text-900 m-0 line-height-1">{{ stats.todayOrders }}</p>
            <span class="text-xs text-500">طلب</span>
          </div>
        </div>

        <!-- الطاولات المشغولة -->
        <div class="col-6 lg:col-3 p-2">
          <div class="stat-card surface-card border-round-xl border-1 border-200 p-3 shadow-1">
            <div class="flex align-items-center justify-content-between mb-3">
              <div class="stat-icon bg-orange-50">
                <i class="pi pi-th-large text-orange-600" />
              </div>
              <span class="text-xs text-400">الآن</span>
            </div>
            <div v-if="loadingStats" class="skeleton h-2rem border-round mb-1" />
            <p v-else class="font-bold text-xl text-900 m-0 line-height-1">
              {{ stats.occupiedTables }}
              <span class="text-xs font-normal text-400"> / {{ stats.totalTables }}</span>
            </p>
            <span class="text-xs text-500">طاولة مشغولة</span>
          </div>
        </div>

        <!-- الطلبات المعلقة -->
        <div class="col-6 lg:col-3 p-2">
          <div
            class="stat-card border-round-xl border-1 p-3 shadow-1 cursor-pointer transition-all"
            :class="stats.pendingOrders > 0
              ? 'bg-red-50 border-red-200'
              : 'surface-card border-200'"
            @click="router.push('/dashboard/orders')"
          >
            <div class="flex align-items-center justify-content-between mb-3">
              <div class="stat-icon" :class="stats.pendingOrders > 0 ? 'bg-red-100' : 'bg-surface-100'">
                <i class="pi pi-clock" :class="stats.pendingOrders > 0 ? 'text-red-600' : 'text-400'" />
              </div>
              <span class="text-xs" :class="stats.pendingOrders > 0 ? 'text-red-400' : 'text-400'">الآن</span>
            </div>
            <div v-if="loadingStats" class="skeleton h-2rem border-round mb-1" />
            <p v-else class="font-bold text-xl m-0 line-height-1" :class="stats.pendingOrders > 0 ? 'text-red-700' : 'text-900'">
              {{ stats.pendingOrders }}
            </p>
            <span class="text-xs" :class="stats.pendingOrders > 0 ? 'text-red-500' : 'text-500'">طلب معلق</span>
          </div>
        </div>

      </div>

      <!-- ── روابط سريعة ────────────────────────────── -->
      <p class="text-xs font-bold text-400 mb-3 m-0">روابط سريعة</p>

      <div class="grid m-0">

        <div class="col-12 sm:col-6 lg:col-4 p-2">
          <div class="nav-card surface-card border-round-xl border-1 border-200 p-4 shadow-1 cursor-pointer"
            @click="router.push('/dashboard/waiter')">
            <div class="flex align-items-center gap-3 mb-3">
              <div class="nav-icon bg-primary-50">
                <i class="pi pi-th-large text-primary text-xl" />
              </div>
              <div>
                <p class="font-bold text-900 text-sm m-0">الطاولات والطلبات</p>
                <span class="text-xs text-500">صفحة الويتر</span>
              </div>
            </div>
            <div class="flex align-items-center justify-content-between">
              <span class="text-xs text-400">{{ stats.occupiedTables }} طاولة مشغولة</span>
              <i class="pi pi-arrow-left text-primary text-xs" />
            </div>
          </div>
        </div>

        <div class="col-12 sm:col-6 lg:col-4 p-2">
          <div class="nav-card surface-card border-round-xl border-1 border-200 p-4 shadow-1 cursor-pointer"
            @click="router.push('/dashboard/cashier')">
            <div class="flex align-items-center gap-3 mb-3">
              <div class="nav-icon bg-green-50">
                <i class="pi pi-wallet text-green-600 text-xl" />
              </div>
              <div>
                <p class="font-bold text-900 text-sm m-0">الكاشير</p>
                <span class="text-xs text-500">إتمام المدفوعات</span>
              </div>
            </div>
            <div class="flex align-items-center justify-content-between">
              <span class="text-xs text-400">{{ stats.todayRevenue.toLocaleString() }} د.ع اليوم</span>
              <i class="pi pi-arrow-left text-green-600 text-xs" />
            </div>
          </div>
        </div>

        <div class="col-12 sm:col-6 lg:col-4 p-2">
          <div class="nav-card surface-card border-round-xl border-1 border-200 p-4 shadow-1 cursor-pointer"
            @click="router.push('/dashboard/menu')">
            <div class="flex align-items-center gap-3 mb-3">
              <div class="nav-icon bg-orange-50">
                <i class="pi pi-list text-orange-500 text-xl" />
              </div>
              <div>
                <p class="font-bold text-900 text-sm m-0">إدارة المنيو</p>
                <span class="text-xs text-500">الفئات والأصناف</span>
              </div>
            </div>
            <div class="flex align-items-center justify-content-between">
              <span class="text-xs text-400">{{ stats.menuItems }} صنف</span>
              <i class="pi pi-arrow-left text-orange-500 text-xs" />
            </div>
          </div>
        </div>

        <div class="col-12 sm:col-6 lg:col-4 p-2">
          <div class="nav-card surface-card border-round-xl border-1 border-200 p-4 shadow-1 cursor-pointer"
            @click="router.push('/dashboard/orders')">
            <div class="flex align-items-center gap-3 mb-3">
              <div class="nav-icon bg-blue-50">
                <i class="pi pi-history text-blue-600 text-xl" />
              </div>
              <div>
                <p class="font-bold text-900 text-sm m-0">سجل الطلبات</p>
                <span class="text-xs text-500">جميع الفواتير</span>
              </div>
            </div>
            <div class="flex align-items-center justify-content-between">
              <span class="text-xs text-400">{{ stats.todayOrders }} طلب اليوم</span>
              <i class="pi pi-arrow-left text-blue-600 text-xs" />
            </div>
          </div>
        </div>

        <div class="col-12 sm:col-6 lg:col-4 p-2">
          <div class="nav-card surface-card border-round-xl border-1 border-200 p-4 shadow-1 cursor-pointer"
            @click="router.push('/dashboard/tables')">
            <div class="flex align-items-center gap-3 mb-3">
              <div class="nav-icon bg-purple-50">
                <i class="pi pi-building text-purple-600 text-xl" />
              </div>
              <div>
                <p class="font-bold text-900 text-sm m-0">إدارة الطاولات</p>
                <span class="text-xs text-500">الطوابق والطاولات</span>
              </div>
            </div>
            <div class="flex align-items-center justify-content-between">
              <span class="text-xs text-400">{{ stats.totalTables }} طاولة</span>
              <i class="pi pi-arrow-left text-purple-600 text-xs" />
            </div>
          </div>
        </div>

        <div class="col-12 sm:col-6 lg:col-4 p-2">
          <div class="nav-card surface-card border-round-xl border-1 border-200 p-4 shadow-1 cursor-pointer"
            @click="router.push('/dashboard/printers')">
            <div class="flex align-items-center gap-3 mb-3">
              <div class="nav-icon bg-surface-100">
                <i class="pi pi-print text-700 text-xl" />
              </div>
              <div>
                <p class="font-bold text-900 text-sm m-0">الطابعات</p>
                <span class="text-xs text-500">إدارة الطابعات</span>
              </div>
            </div>
            <div class="flex align-items-center justify-content-between">
              <span class="text-xs text-400">{{ stats.printers }} طابعة</span>
              <i class="pi pi-arrow-left text-700 text-xs" />
            </div>
          </div>
        </div>

      </div>

      <!-- ── آخر الطلبات ────────────────────────────── -->
      <div class="mt-5">
        <div class="flex align-items-center justify-content-between mb-3">
          <p class="text-xs font-bold text-400 m-0">آخر الطلبات اليوم</p>
          <Button
            label="عرض الكل"
            text size="small" severity="secondary"
            @click="router.push('/dashboard/orders')"
          />
        </div>

        <div v-if="loadingOrders" class="flex justify-content-center py-4">
          <ProgressSpinner style="width:32px;height:32px" />
        </div>

        <div v-else-if="recentOrders.length === 0" class="surface-card border-round-xl border-1 border-200 p-4 text-center">
          <i class="pi pi-inbox text-3xl text-300 mb-2 block" />
          <p class="text-500 text-sm m-0">لا توجد طلبات اليوم</p>
        </div>

        <div v-else class="surface-card border-round-xl border-1 border-200 overflow-hidden shadow-1">
          <div
            v-for="(order, idx) in recentOrders"
            :key="order.id"
            class="flex align-items-center justify-content-between px-4 py-3 cursor-pointer hover:surface-50 transition-all"
            :class="idx < recentOrders.length - 1 ? 'border-bottom-1 border-100' : ''"
            @click="router.push('/dashboard/orders')"
          >
            <div class="flex align-items-center gap-3">
              <div
                class="w-2rem h-2rem border-round-lg flex align-items-center justify-content-center flex-shrink-0"
                :class="statusBg(order.invoiceStatus)"
              >
                <i class="pi pi-receipt text-xs" :class="statusIconColor(order.invoiceStatus)" />
              </div>
              <div>
                <p class="m-0 text-sm font-medium text-900">طاولة {{ order.tableId }}</p>
                <span class="text-xs text-400">#{{ order.id }} · {{ formatTime(order.createdAt) }}</span>
              </div>
            </div>
            <div class="flex align-items-center gap-2">
              <Tag :severity="statusSeverity(order.invoiceStatus)" rounded>
                <span class="text-xs font-bold">{{ statusLabel(order.invoiceStatus) }}</span>
              </Tag>
              <span class="font-bold text-sm text-primary">{{ order.finalPrice?.toLocaleString() }} د.ع</span>
            </div>
          </div>
        </div>
      </div>

    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button          from 'primevue/button'
import Tag             from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import { orderApi, tableApi } from '../../../../services/api.service'
import apiClient from '../../../../services/api-client'

const router = useRouter()

// ── State ─────────────────────────────────────────────
const loadingStats  = ref(false)
const loadingOrders = ref(false)

const stats = ref({
  todayRevenue:   0,
  todayOrders:    0,
  pendingOrders:  0,
  occupiedTables: 0,
  totalTables:    0,
  menuItems:      0,
  printers:       0,
})

const recentOrders = ref<any[]>([])

// ── Today date ────────────────────────────────────────
const todayDate = new Date().toLocaleDateString('ar-IQ', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
})

// ── Fetch ─────────────────────────────────────────────
async function fetchStats() {
  loadingStats.value = true
  try {
    const today = new Date().toISOString().split('T')[0]

    const [ordersRes, pendingRes, tablesRes, menuRes, printersRes] = await Promise.allSettled([
      orderApi.getHistory({ StartDate: today, EndDate: today, PageSize: 100 }),
      orderApi.getHistory({ Status: 'Pending', PageSize: 1 }),
      tableApi.getAll(),
      apiClient.get('/menu/all'),
      apiClient.get('/printers'),
    ])

    // الإيرادات واﻟﻄﻠﺒﺎت
    if (ordersRes.status === 'fulfilled') {
      const orders = ordersRes.value?.items ?? []
      stats.value.todayOrders  = ordersRes.value?.totalCount ?? orders.length
      stats.value.todayRevenue = orders
        .filter((o: any) => o.invoiceStatus === 'Paid')
        .reduce((s: number, o: any) => s + (o.finalPrice ?? 0), 0)
    }

    // الطلبات المعلقة
    if (pendingRes.status === 'fulfilled') {
      stats.value.pendingOrders = pendingRes.value?.totalCount ?? 0
    }

    // الطاولات
    if (tablesRes.status === 'fulfilled') {
      const tables = Array.isArray(tablesRes.value)
        ? tablesRes.value
        : (tablesRes.value as any)?.items ?? []
      stats.value.totalTables    = tables.length
      stats.value.occupiedTables = tables.filter((t: any) =>
        t.status === 'Occupied' || t.status === 1
      ).length
    }

    // المنيو
    if (menuRes.status === 'fulfilled') {
      const categories = Array.isArray(menuRes.value) ? menuRes.value : []
      stats.value.menuItems = categories.reduce(
        (s: number, c: any) => s + (c.menuItems?.length ?? 0), 0
      )
    }

    // الطابعات
    if (printersRes.status === 'fulfilled') {
      stats.value.printers = Array.isArray(printersRes.value) ? printersRes.value.length : 0
    }

  } catch { /* تجاهل */ }
  finally {
    loadingStats.value = false
  }
}

async function fetchRecentOrders() {
  loadingOrders.value = true
  try {
    const today = new Date().toISOString().split('T')[0]
    const res   = await orderApi.getHistory({ StartDate: today, EndDate: today, PageSize: 5 })
    recentOrders.value = res?.items ?? []
  } catch {
    recentOrders.value = []
  } finally {
    loadingOrders.value = false
  }
}

onMounted(() => {
  fetchStats()
  fetchRecentOrders()
})

// ── Helpers ───────────────────────────────────────────
function formatTime(str: string) {
  if (!str) return ''
  return new Date(str).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })
}

function statusLabel(s: any) {
  if (s === 'Pending'   || s === 0) return 'معلق'
  if (s === 'Paid'      || s === 1) return 'مدفوع'
  if (s === 'Cancelled' || s === 2) return 'ملغى'
  return 'غير معروف'
}

function statusSeverity(s: any): 'info' | 'success' | 'danger' | 'secondary' {
  if (s === 'Pending'   || s === 0) return 'info'
  if (s === 'Paid'      || s === 1) return 'success'
  if (s === 'Cancelled' || s === 2) return 'danger'
  return 'secondary'
}

function statusBg(s: any) {
  if (s === 'Pending'   || s === 0) return 'bg-blue-50'
  if (s === 'Paid'      || s === 1) return 'bg-green-50'
  if (s === 'Cancelled' || s === 2) return 'bg-red-50'
  return 'bg-surface-100'
}

function statusIconColor(s: any) {
  if (s === 'Pending'   || s === 0) return 'text-blue-500'
  if (s === 'Paid'      || s === 1) return 'text-green-500'
  if (s === 'Cancelled' || s === 2) return 'text-red-500'
  return 'text-400'
}
</script>

<style scoped>
/* Stats */
.stat-icon {
  width: 2.25rem; height: 2.25rem; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.stat-card {
  transition: transform 0.15s, box-shadow 0.15s;
}
.stat-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
}

/* Nav cards */
.nav-icon {
  width: 2.75rem; height: 2.75rem; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.nav-card {
  transition: transform 0.15s, box-shadow 0.15s;
}
.nav-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1) !important;
}

/* Skeleton */
.skeleton {
  background: linear-gradient(90deg, var(--p-surface-200) 25%, var(--p-surface-100) 50%, var(--p-surface-200) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>