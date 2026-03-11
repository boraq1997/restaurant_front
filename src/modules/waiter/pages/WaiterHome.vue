<template>
  <div class="min-h-screen surface-50" dir="rtl">

    <!-- Header -->
    <header class="surface-card shadow-1 sticky top-0 z-5 border-bottom-1 border-200" style="transition: all 0.25s ease;">
  <div class="px-3 py-3">

    <!-- يختفي عند السكرول -->
    <Transition name="slide-up">
      <div v-if="!isScrolled" class="flex align-items-center justify-content-between mb-3">
        <div class="flex align-items-center gap-2">
          <div class="w-2rem h-2rem border-round-lg bg-primary flex align-items-center justify-content-center">
            <i class="pi pi-shop text-white text-sm"></i>
          </div>
          <div>
            <p class="font-bold text-base m-0 text-900 line-height-1">مطعمنا</p>
            <span class="text-xs text-500">الويتر</span>
          </div>
        </div>

        <div class="flex align-items-center gap-2">
          <Button
            v-if="alertsCount > 0"
            icon="pi pi-bell"
            :badge="String(alertsCount)"
            badge-severity="danger"
            severity="danger"
            text rounded
            @click="showAlerts = true"
          />
          <div class="flex align-items-center gap-1 surface-100 px-2 py-1 border-round-lg">
            <i class="pi pi-clock text-primary text-xs"></i>
            <span class="text-xs font-bold text-primary">{{ currentTime }}</span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </Transition>

    <TableStatsBar
      :available="availableCount"
      :occupied="occupiedCount"
      :reserved="reservedCount"
      :active-filter="activeFilter"
      :compact="isScrolled"
      @filter="onFilter"
    />

    <!-- Floors Tab Bar -->
    <div v-if="hasFloors" class="flex gap-2 overflow-x-auto pt-3 pb-1" style="scrollbar-width: none;">
      <button class="floor-tab" :class="{ active: selectedFloorId === null }" @click="selectedFloorId = null">
        الكل
      </button>
      <button
        v-for="floor in floors" :key="floor.id"
        class="floor-tab" :class="{ active: selectedFloorId === floor.id }"
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
              <i class="pi pi-times" style="font-size: 0.6rem"></i>
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

      <!-- Loading -->
      <div v-if="loading" class="flex justify-content-center align-items-center py-8">
        <ProgressSpinner />
      </div>

      <template v-else>

        <!-- ── عرض بطوابق ── -->
        <template v-if="hasFloors">
          <template v-for="floor in visibleFloors" :key="floor.id">
            <div v-if="tablesForFloor(floor.id).length > 0" class="mb-5">
              <!-- عنوان الطابق -->
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

          <!-- لا توجد طاولات بعد الفلتر -->
          <div
            v-if="visibleFloors.every(f => tablesForFloor(f.id).length === 0)"
            class="flex flex-column align-items-center justify-content-center py-8 gap-3"
          >
            <i class="pi pi-inbox text-4xl text-300" />
            <p class="text-500 m-0">لا توجد طاولات</p>
            <Button label="عرض الكل" text size="small" @click="activeFilter = null; selectedFloorId = null" />
          </div>
        </template>

        <!-- ── عرض بدون طوابق (عادي) ── -->
        <template v-else>
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
        </template>

      </template>
    </main>

    <!-- Alerts Dialog -->
    <Dialog
      v-model:visible="showAlerts"
      header="التنبيهات"
      :modal="true"
      :draggable="false"
      position="bottom"
      style="width: 100%; max-width: 480px;"
      dir="rtl"
    >
      <div class="flex flex-column gap-3">
        <div
          v-for="table in tablesWithAlerts"
          :key="table.id"
          class="surface-50 border-round-lg p-3 border-1 surface-border cursor-pointer hover:surface-100 transition-all transition-duration-200"
          @click="onTableSelect(table); showAlerts = false"
        >
          <div class="flex align-items-center justify-content-between mb-2">
            <span class="font-bold text-900 text-sm">{{ table.name }}</span>
            <i class="pi pi-chevron-left text-400 text-xs" />
          </div>
          <div class="flex flex-column gap-1">
            <div
              v-for="alert in table.alerts"
              :key="alert"
              class="flex align-items-center gap-2 text-xs font-medium"
              :class="alertTextClass(alert)"
            >
              <i :class="alertIcon(alert)" />
              <span>{{ alertLabel(alert) }}</span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { tableApi } from '../../../services/api.service'
import { tablesAdminApi } from '../../dashboard/tables/api/tables-admin.api'
import type { Table, TableAlert } from '../types/waiter.types'
import type { Floor } from '../../dashboard/tables/types/tables-admin.types'
import TableGrid from '../components/TableGrid.vue'
import TableStatsBar from '../components/TableStatsBar.vue'
import LogoutButton from '../../../components/shared/Logoutbutton.vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import { useAuthStore } from '../../auth/store/auth.store'

const auth   = useAuthStore()
const router = useRouter()
const toast  = useToast()

const currentTime    = ref('')
const activeFilter   = ref<Table['status'] | null>(null)
const isRefreshing   = ref(false)
const showAlerts     = ref(false)
const loading        = ref(true)
const tables         = ref<Table[]>([])
const floors         = ref<Floor[]>([])
const selectedFloorId = ref<number | null>(null)
const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 80
}

let timer: ReturnType<typeof setInterval>

onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  window.addEventListener('scroll', handleScroll)
  await loadTables()
})

onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('scroll', handleScroll)
})

async function loadTables() {
  loading.value = true
  try {
    const [floorsRes, tablesRes] = await Promise.all([
      tablesAdminApi.getAllFloors().catch(() => []),
      tableApi.getAll(),
    ])

    floors.value = Array.isArray(floorsRes) ? floorsRes : (floorsRes as any)?.items ?? []

    const items = (tablesRes as any).items ?? tablesRes
    tables.value = items.map((t: any) => ({
      id:       t.id,
      name:     `طاولة ${t.number}`,
      number:   t.number,
      capacity: t.capacity,
      floorId:  t.floorId ?? null,
      status:   mapStatus(t.status),
      reservation: null,
      alerts:   [],
    }))
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل الطاولات', life: 3000 })
  } finally {
    loading.value = false
  }
}

function mapStatus(status: string | number): Table['status'] {
  const s = typeof status === 'string' ? status.toLowerCase() : status
  switch (s) {
    case 'occupied': case 1: return 'occupied'
    case 'reserved': case 2: return 'reserved'
    case 'merged':            return 'occupied' // merged تعتبر مشغولة
    default:                  return 'available'
  }
}

async function refresh() {
  isRefreshing.value = true
  await loadTables()
  isRefreshing.value = false
  toast.add({ severity: 'success', summary: 'تم التحديث', life: 1500 })
}

function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('ar-IQ', {
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Floors ────────────────────────────────────────────
const hasFloors = computed(() => floors.value.length > 0)

const visibleFloors = computed(() =>
  selectedFloorId.value !== null
    ? floors.value.filter(f => f.id === selectedFloorId.value)
    : floors.value
)

function tablesForFloor(floorId: number): Table[] {
  return applyFilter(tables.value.filter(t => (t as any).floorId === floorId))
}

// ── Filters ───────────────────────────────────────────
function applyFilter(list: Table[]): Table[] {
  return activeFilter.value
    ? list.filter(t => t.status === activeFilter.value)
    : list
}

const filteredTables = computed(() => applyFilter(tables.value))

// ── Stats ─────────────────────────────────────────────
const availableCount = computed(() => tables.value.filter(t => t.status === 'available').length)
const occupiedCount  = computed(() => tables.value.filter(t => t.status === 'occupied').length)
const reservedCount  = computed(() => tables.value.filter(t => t.status === 'reserved').length)

const tablesWithAlerts = computed(() => tables.value.filter(t => t.alerts && t.alerts.length > 0))
const alertsCount      = computed(() => tables.value.reduce((sum, t) => sum + (t.alerts?.length ?? 0), 0))

const filterLabel = computed(() => {
  switch (activeFilter.value) {
    case 'available': return 'متاحة'
    case 'occupied':  return 'مشغولة'
    case 'reserved':  return 'محجوزة'
    default: return ''
  }
})

// ── Actions ───────────────────────────────────────────
function onFilter(status: Table['status']) {
  activeFilter.value = activeFilter.value === status ? null : status
}

function onTableSelect(table: Table) {
  const isAdmin = auth.user?.role === 'Admin'
  const base = isAdmin ? '/dashboard/waiter/table' : '/waiter/table'
  router.push(`${base}/${table.id}`)
}

function alertIcon(alert: TableAlert) {
  switch (alert) {
    case 'confirm_order': return 'pi pi-check-circle text-orange-500'
    case 'new_order':     return 'pi pi-bell text-blue-500'
    case 'need_waiter':   return 'pi pi-exclamation-circle text-red-500'
  }
}
function alertLabel(alert: TableAlert) {
  switch (alert) {
    case 'confirm_order': return 'بانتظار التأكيد'
    case 'new_order':     return 'طلب جديد'
    case 'need_waiter':   return 'يحتاج مساعدة'
  }
}
function alertTextClass(alert: TableAlert) {
  switch (alert) {
    case 'confirm_order': return 'text-orange-600'
    case 'new_order':     return 'text-blue-600'
    case 'need_waiter':   return 'text-red-600'
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
.floor-tab:hover  { background: var(--p-surface-100); color: var(--p-text-color); }
.floor-tab.active {
  background: var(--p-primary-color);
  border-color: var(--p-primary-color);
  color: #fff;
}

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
</style>