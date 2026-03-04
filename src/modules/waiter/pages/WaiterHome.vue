<template>
  <div class="min-h-screen surface-50" dir="rtl">

    <!-- Header -->
    <header class="surface-card shadow-1 sticky top-0 z-5 border-bottom-1 border-200">
      <div class="px-3 py-3">

        <div class="flex align-items-center justify-content-between mb-3">
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
              text
              rounded
              @click="showAlerts = true"
            />
            <div class="flex align-items-center gap-1 surface-100 px-2 py-1 border-round-lg">
              <i class="pi pi-clock text-primary text-xs"></i>
              <span class="text-xs font-bold text-primary">{{ currentTime }}</span>
              <LogoutButton />
            </div>
          </div>
        </div>

        <TableStatsBar
          :available="availableCount"
          :occupied="occupiedCount"
          :reserved="reservedCount"
          :active-filter="activeFilter"
          @filter="onFilter"
        />
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
import type { Table, TableAlert } from '../types/waiter.types'
import TableGrid from '../components/TableGrid.vue'
import TableStatsBar from '../components/TableStatsBar.vue'
import LogoutButton from '../../../components/shared/Logoutbutton.vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'

const router = useRouter()
const toast  = useToast()

const currentTime  = ref('')
const activeFilter = ref<Table['status'] | null>(null)
const isRefreshing = ref(false)
const showAlerts   = ref(false)
const loading      = ref(true)
const tables       = ref<Table[]>([])

let timer: ReturnType<typeof setInterval>

onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  await loadTables()
})
onUnmounted(() => clearInterval(timer))

async function loadTables() {
  loading.value = true
  try {
    const res = await tableApi.getAll()
    tables.value = res.map((t: any) => ({
      id:          t.id,
      name:        `طاولة ${t.number}`,
      number:      t.number,
      capacity:    t.capacity,
      status:      mapStatus(t.status),
      reservation: null,
      alerts:      [],
    }))
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل الطاولات', life: 3000 })
  } finally {
    loading.value = false
  }
}

function mapStatus(status: number): Table['status'] {
  switch (status) {
    case 1:  return 'occupied'
    case 2:  return 'reserved'
    default: return 'available'
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

const availableCount = computed(() => tables.value.filter(t => t.status === 'available').length)
const occupiedCount  = computed(() => tables.value.filter(t => t.status === 'occupied').length)
const reservedCount  = computed(() => tables.value.filter(t => t.status === 'reserved').length)

const filteredTables = computed(() =>
  activeFilter.value
    ? tables.value.filter(t => t.status === activeFilter.value)
    : tables.value
)

const tablesWithAlerts = computed(() =>
  tables.value.filter(t => t.alerts && t.alerts.length > 0)
)
const alertsCount = computed(() =>
  tables.value.reduce((sum, t) => sum + (t.alerts?.length ?? 0), 0)
)

const filterLabel = computed(() => {
  switch (activeFilter.value) {
    case 'available': return 'متاحة'
    case 'occupied':  return 'مشغولة'
    case 'reserved':  return 'محجوزة'
    default: return ''
  }
})

function onFilter(status: Table['status']) {
  activeFilter.value = activeFilter.value === status ? null : status
}

function onTableSelect(table: Table) {
  router.push(`/waiter/table/${table.id}`)
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
</style>