<!-- src/modules/dashboard/tables/pages/TablesPage.vue -->
<template>
  <div class="min-h-screen surface-50" dir="rtl">

    <!-- ── Toolbar ─────────────────────────────────────── -->
    <div class="px-3 py-3 surface-card border-bottom-1 border-200">

      <!-- الصف الأول: العنوان + الأزرار -->
      <div class="flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div class="flex align-items-center gap-2">
          <span class="font-bold text-800">الطاولات</span>
          <Tag :value="String(filteredTotal)" severity="secondary" rounded />
          <Tag v-if="hasActiveFilter" value="فلتر مفعّل" severity="warn" rounded class="text-xs" />
        </div>
        <div class="flex gap-2 flex-wrap">
          <Button
            icon="pi pi-qrcode"
            label="تهيئة QR للكل"
            severity="secondary"
            size="small"
            :loading="initializingQr"
            v-tooltip.bottom="'إنشاء QR لجميع الطاولات التي لا تملك رمزاً'"
            @click="handleInitializeQr"
          />
          <Button
            :icon="filtersOpen ? 'pi pi-filter-slash' : 'pi pi-filter'"
            :severity="hasActiveFilter ? 'warn' : 'secondary'"
            text rounded size="small"
            v-tooltip.bottom="'الفلاتر'"
            @click="filtersOpen = !filtersOpen"
          />
          <Button icon="pi pi-refresh" severity="secondary" text rounded size="small"
            :loading="isRefreshing" @click="refresh" />
          <Button label="طابق جديد" icon="pi pi-building" size="small" severity="secondary"
            @click="openCreateFloor" />
          <Button label="طاولة جديدة" icon="pi pi-plus" size="small"
            @click="openCreateTable" />
        </div>
      </div>

      <!-- بحث -->
      <div class="mb-3">
        <span class="p-input-icon-right w-full">
          <i class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            placeholder="ابحث باسم الطاولة أو رقمها..."
            class="w-full"
            size="small"
          />
        </span>
      </div>

      <!-- فلاتر Collapsible -->
      <Transition name="slide-down">
        <div v-if="filtersOpen" class="flex flex-column gap-2">

          <div class="flex align-items-center gap-2 overflow-x-auto py-1">
            <span class="text-xs text-500 flex-shrink-0 font-medium">الطابق:</span>
            <button class="filter-chip" :class="{ active: filterFloor === null }" @click="filterFloor = null">الكل</button>
            <button
              v-for="floor in floors" :key="floor.id"
              class="filter-chip" :class="{ active: filterFloor === floor.id }"
              @click="filterFloor = filterFloor === floor.id ? null : floor.id"
            >{{ floor.name }}</button>
          </div>

          <div class="flex align-items-center gap-2 overflow-x-auto py-1">
            <span class="text-xs text-500 flex-shrink-0 font-medium">الكراسي:</span>
            <button class="filter-chip" :class="{ active: filterCapacity === null }" @click="filterCapacity = null">الكل</button>
            <button
              v-for="range in capacityRanges" :key="range.label"
              class="filter-chip" :class="{ active: filterCapacity === range.label }"
              @click="filterCapacity = filterCapacity === range.label ? null : range.label"
            >{{ range.label }}</button>
          </div>

          <div class="flex align-items-center gap-2 overflow-x-auto py-1">
            <span class="text-xs text-500 flex-shrink-0 font-medium">الحالة:</span>
            <button class="filter-chip" :class="{ active: filterStatus === null }" @click="filterStatus = null">الكل</button>
            <button
              v-for="s in statusOptions" :key="s.value"
              class="filter-chip" :class="[{ active: filterStatus === s.value }, `status-${s.value}`]"
              @click="filterStatus = filterStatus === s.value ? null : s.value"
            >
              <span class="status-dot" :class="`dot-${s.value}`" />
              {{ s.label }}
            </button>
          </div>

          <div class="flex justify-content-end pb-1">
            <button class="clear-btn" :disabled="!hasActiveFilter" @click="clearFilters">
              <i class="pi pi-times text-xs" /> مسح الفلاتر
            </button>
          </div>

        </div>
      </Transition>

    </div>

    <!-- ── Loading ────────────────────────────────────── -->
    <div v-if="loading" class="flex justify-content-center align-items-center py-8">
      <ProgressSpinner style="width:40px;height:40px" />
    </div>

    <template v-else>

      <!-- لا توجد طوابق -->
      <div v-if="floors.length === 0"
        class="flex flex-column align-items-center justify-content-center py-8 gap-3">
        <i class="pi pi-building text-5xl text-300" />
        <p class="text-500 m-0">لا توجد طوابق مضافة</p>
        <Button label="إضافة طابق" icon="pi pi-plus" @click="openCreateFloor" />
      </div>

      <!-- لا نتائج للفلتر -->
      <div v-else-if="filteredTotal === 0 && (hasActiveFilter || searchQuery)"
        class="flex flex-column align-items-center justify-content-center py-8 gap-3">
        <i class="pi pi-search text-5xl text-300" />
        <p class="text-500 m-0">لا توجد نتائج</p>
        <Button label="مسح البحث والفلاتر" text size="small" @click="clearAll" />
      </div>

      <!-- Grid -->
      <main v-else class="px-3 pb-6">
        <div v-for="floor in visibleFloors" :key="floor.id" class="mb-5 pt-4">

          <!-- عنوان الطابق -->
          <div class="flex align-items-center justify-content-between mb-3">
            <div class="flex align-items-center gap-2">
              <div class="w-2rem h-2rem border-round bg-primary flex align-items-center justify-content-center flex-shrink-0">
                <i class="pi pi-building text-white text-xs" />
              </div>
              <span class="font-bold text-800">{{ floor.name }}</span>
              <Tag :value="String(tablesForFloor(floor.id).length)" severity="secondary" rounded class="text-xs" />
              <Tag v-if="!floor.isActive" value="معطّل" severity="secondary" rounded class="text-xs" />
            </div>
            <div class="flex gap-1">
              <Button
                icon="pi pi-arrow-right-arrow-left"
                severity="info" text rounded size="small"
                v-tooltip.top="'نقل طاولات لهذا الطابق'"
                @click="openMoveToFloor(floor)"
              />
              <Button icon="pi pi-pencil" severity="secondary" text rounded size="small"
                v-tooltip.top="'تعديل الطابق'" @click="openEditFloor(floor)" />
              <Button icon="pi pi-trash" severity="danger" text rounded size="small"
                v-tooltip.top="'حذف الطابق'" @click="handleDeleteFloor(floor)" />
            </div>
          </div>

          <!-- كروت الطاولات -->
          <div class="grid m-0">
            <div
              v-for="table in tablesForFloor(floor.id)" :key="table.id"
              class="col-6 sm:col-4 lg:col-3 xl:col-2 p-2"
            >
              <TableCard :table="table" @edit="openEditTable" @delete="handleDeleteTable" @qr="showQr" />
            </div>

            <!-- طابق فارغ -->
            <div v-if="tablesForFloor(floor.id).length === 0" class="col-12">
              <div class="flex flex-column align-items-center justify-content-center py-4 gap-2 border-1 border-dashed border-300 border-round-xl">
                <i class="pi pi-th-large text-3xl text-300" />
                <p class="text-500 text-sm m-0">لا توجد طاولات في هذا الطابق</p>
                <Button label="إضافة طاولة" icon="pi pi-plus" size="small" text
                  @click="openCreateTableInFloor(floor.id)" />
              </div>
            </div>
          </div>

        </div>
      </main>

    </template>

    <!-- ── Dialogs ─────────────────────────────────────── -->

    <!-- طاولة -->
    <TableDialog
      v-model="tableDialogVisible"
      :table="editingTable"
      :floors="floors"
      :default-floor-id="defaultFloorId"
      :loading="savingTable"
      @save="handleSaveTable"
    />

    <!-- طابق -->
    <FloorDialog
      v-model="floorDialogVisible"
      :floor="editingFloor"
      :loading="savingFloor"
      @save="handleSaveFloor"
    />

    <!-- QR -->
    <TableQrDialog v-model="qrVisible" :table="qrTable" />

    <!-- حذف -->
    <ConfirmDeleteDialog
      v-model="deleteDialogVisible"
      :message="deleteMessage"
      :loading="deleting"
      @confirm="onDeleteConfirmed"
    />

    <!-- ── Dialog نقل طاولات لطابق ──────────────────── -->
    <Dialog
      v-model:visible="moveDialogVisible"
      :modal="true" :draggable="false"
      style="width: 100%; max-width: 480px;"
      dir="rtl"
    >
      <template #header>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-arrow-right-arrow-left text-primary" />
          <span class="font-bold">نقل طاولات إلى: {{ moveTargetFloor?.name }}</span>
        </div>
      </template>

      <div class="flex flex-column gap-3">
        <p class="text-sm text-500 m-0">اختر الطاولات التي تريد نقلها إلى هذا الطابق:</p>

        <!-- الطوابق الأخرى -->
        <div v-for="floor in otherFloors" :key="floor.id" class="mb-2">
          <p class="text-xs font-bold text-400 mb-2 m-0">{{ floor.name }}</p>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="table in floor.tables" :key="table.id"
              class="move-table-chip"
              :class="{ selected: selectedTableIds.includes(table.id) }"
              @click="toggleTableSelection(table.id)"
            >
              <i class="pi pi-th-large text-xs" />
              {{ table.name || `طاولة ${table.number}` }}
            </div>
          </div>
        </div>

        <div v-if="otherFloors.every(f => f.tables.length === 0)" class="text-center text-400 text-sm py-3">
          لا توجد طاولات في الطوابق الأخرى
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 justify-content-end">
          <Button label="إلغاء" severity="secondary" outlined @click="moveDialogVisible = false" />
          <Button
            label="نقل"
            icon="pi pi-check"
            :disabled="selectedTableIds.length === 0"
            :loading="movingTables"
            @click="handleMoveTables"
          />
        </div>
      </template>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { tablesAdminApi } from '../api/tables-admin.api'
import type { AdminTable, Floor, CreateTableDto, CreateFloorDto } from '../types/tables-admin.types'
import TableCard        from '../components/TableCard.vue'
import TableDialog      from '../components/TableDialog.vue'
import FloorDialog      from '../components/FloorDialog.vue'
import TableQrDialog    from '../components/TableQrDialog.vue'
import ConfirmDeleteDialog from '../../../../components/shared/ConfirmDeleteDialog.vue'
import Button          from 'primevue/button'
import Tag             from 'primevue/tag'
import InputText       from 'primevue/inputtext'
import Dialog          from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import apiClient       from '../../../../services/api-client'

const toast = useToast()

// ── State ──────────────────────────────────────────────
const floors        = ref<Floor[]>([])
const loading       = ref(true)
const isRefreshing  = ref(false)
const savingTable   = ref(false)
const savingFloor   = ref(false)
const deleting      = ref(false)
const initializingQr = ref(false)

// ── Search & Filters ───────────────────────────────────
const searchQuery    = ref('')
const filtersOpen    = ref(false)
const filterFloor    = ref<number | null>(null)
const filterCapacity = ref<string | null>(null)
const filterStatus   = ref<number | null>(null)

const statusOptions = [
  { value: 0, label: 'متاحة'  },
  { value: 1, label: 'مشغولة' },
  { value: 2, label: 'محجوزة' },
  { value: 3, label: 'مدمجة'  },
]
const capacityRanges = [
  { label: '1-2', min: 1, max: 2   },
  { label: '3-4', min: 3, max: 4   },
  { label: '5-8', min: 5, max: 8   },
  { label: '9+',  min: 9, max: 999 },
]

// ── Dialogs ────────────────────────────────────────────
const tableDialogVisible = ref(false)
const floorDialogVisible = ref(false)
const editingTable       = ref<AdminTable | null>(null)
const editingFloor       = ref<Floor | null>(null)
const defaultFloorId     = ref<number | null>(null)
const qrVisible          = ref(false)
const qrTable            = ref<AdminTable | null>(null)
const deleteDialogVisible = ref(false)
const deleteMessage       = ref('')
const pendingDelete       = ref<{ type: 'table' | 'floor'; id: number } | null>(null)

// ── Move Dialog ────────────────────────────────────────
const moveDialogVisible  = ref(false)
const moveTargetFloor    = ref<Floor | null>(null)
const selectedTableIds   = ref<number[]>([])
const movingTables       = ref(false)

onMounted(() => loadAll())

async function loadAll() {
  loading.value = true
  try {
    floors.value = await tablesAdminApi.getAllFloors()
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل البيانات', life: 3000 })
  } finally {
    loading.value = false
  }
}

async function refresh() {
  isRefreshing.value = true
  await loadAll()
  isRefreshing.value = false
}

// ── Computed ───────────────────────────────────────────
const visibleFloors = computed(() => {
  if (filterFloor.value !== null) {
    return floors.value.filter(f => f.id === filterFloor.value)
  }
  return floors.value
})

function tablesForFloor(floorId: number): AdminTable[] {
  let result = floors.value.find(f => f.id === floorId)?.tables ?? []

  // فلتر البحث
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(t =>
      t.name?.toLowerCase().includes(q) ||
      String(t.number).includes(q)
    )
  }

  // فلتر الكراسي
  if (filterCapacity.value !== null) {
    const range = capacityRanges.find(r => r.label === filterCapacity.value)
    if (range) result = result.filter(t => t.capacity >= range.min && t.capacity <= range.max)
  }

  // فلتر الحالة
  if (filterStatus.value !== null) {
    result = result.filter(t => t.status === filterStatus.value)
  }

  return result.slice().sort((a, b) => a.number - b.number)
}

const filteredTotal = computed(() =>
  visibleFloors.value.reduce((s, f) => s + tablesForFloor(f.id).length, 0)
)

const hasActiveFilter = computed(() =>
  filterFloor.value !== null || filterCapacity.value !== null || filterStatus.value !== null
)

function clearFilters() {
  filterFloor.value    = null
  filterCapacity.value = null
  filterStatus.value   = null
}

function clearAll() {
  clearFilters()
  searchQuery.value = ''
}

// ── طاولات CRUD ────────────────────────────────────────
function openCreateTable() {
  editingTable.value       = null
  defaultFloorId.value     = null
  tableDialogVisible.value = true
}

function openCreateTableInFloor(floorId: number) {
  editingTable.value       = null
  defaultFloorId.value     = floorId
  tableDialogVisible.value = true
}

function openEditTable(t: AdminTable) {
  editingTable.value       = t
  tableDialogVisible.value = true
}

async function handleSaveTable(data: CreateTableDto) {
  savingTable.value = true
  try {
    if (editingTable.value) {
      await tablesAdminApi.edit(editingTable.value.id, data)
      toast.add({ severity: 'success', summary: 'تم', detail: 'تم تعديل الطاولة', life: 2000 })
    } else {
      await tablesAdminApi.create(data)
      toast.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الطاولة', life: 2000 })
    }
    tableDialogVisible.value = false
    await loadAll()
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشلت العملية', life: 3000 })
  } finally {
    savingTable.value = false
  }
}

function handleDeleteTable(t: AdminTable) {
  pendingDelete.value       = { type: 'table', id: t.id }
  deleteMessage.value       = `هل تريد حذف طاولة رقم ${t.number}؟`
  deleteDialogVisible.value = true
}

// ── طوابق CRUD ─────────────────────────────────────────
function openCreateFloor() {
  editingFloor.value       = null
  floorDialogVisible.value = true
}

function openEditFloor(f: Floor) {
  editingFloor.value       = f
  floorDialogVisible.value = true
}

async function handleSaveFloor(data: CreateFloorDto) {
  savingFloor.value = true
  try {
    if (editingFloor.value) {
      await tablesAdminApi.editFloor(editingFloor.value.id, data)
      toast.add({ severity: 'success', summary: 'تم', detail: 'تم تعديل الطابق', life: 2000 })
    } else {
      await tablesAdminApi.createFloor(data)
      toast.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الطابق', life: 2000 })
    }
    floorDialogVisible.value = false
    await loadAll()
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشلت العملية', life: 3000 })
  } finally {
    savingFloor.value = false
  }
}

function handleDeleteFloor(f: Floor) {
  pendingDelete.value       = { type: 'floor', id: f.id }
  deleteMessage.value       = f.tables.length > 0
    ? `الطابق "${f.name}" يحتوي على ${f.tables.length} طاولة. هل تريد حذفه؟`
    : `هل تريد حذف الطابق "${f.name}"؟`
  deleteDialogVisible.value = true
}

async function onDeleteConfirmed() {
  if (!pendingDelete.value) return
  deleting.value = true
  try {
    if (pendingDelete.value.type === 'table') {
      await tablesAdminApi.delete(pendingDelete.value.id)
      toast.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الطاولة', life: 2000 })
    } else {
      await tablesAdminApi.deleteFloor(pendingDelete.value.id)
      toast.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الطابق', life: 2000 })
    }
    deleteDialogVisible.value = false
    await loadAll()
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل الحذف', life: 3000 })
  } finally {
    deleting.value      = false
    pendingDelete.value = null
  }
}

// ── QR ────────────────────────────────────────────────
function showQr(t: AdminTable) {
  qrTable.value   = t
  qrVisible.value = true
}

// ── تهيئة QR للكل ────────────────────────────────────
async function handleInitializeQr() {
  initializingQr.value = true
  try {
    await apiClient.post('/tables/initialize-qr-tokens', {})
    toast.add({ severity: 'success', summary: 'تم', detail: 'تم تهيئة QR لجميع الطاولات', life: 3000 })
    await loadAll()
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تهيئة QR', life: 3000 })
  } finally {
    initializingQr.value = false
  }
}

// ── نقل طاولات لطابق ─────────────────────────────────
const otherFloors = computed(() =>
  moveTargetFloor.value
    ? floors.value.filter(f => f.id !== moveTargetFloor.value!.id && f.tables.length > 0)
    : []
)

function openMoveToFloor(floor: Floor) {
  moveTargetFloor.value  = floor
  selectedTableIds.value = []
  moveDialogVisible.value = true
}

function toggleTableSelection(id: number) {
  const idx = selectedTableIds.value.indexOf(id)
  if (idx === -1) selectedTableIds.value.push(id)
  else            selectedTableIds.value.splice(idx, 1)
}

async function handleMoveTables() {
  if (!moveTargetFloor.value || selectedTableIds.value.length === 0) return
  movingTables.value = true
  try {
    await apiClient.post(`/tables/move/${moveTargetFloor.value.id}`, {
      tableIds: selectedTableIds.value,
    })
    toast.add({
      severity: 'success', summary: 'تم',
      detail: `تم نقل ${selectedTableIds.value.length} طاولة إلى ${moveTargetFloor.value.name}`,
      life: 3000,
    })
    moveDialogVisible.value = false
    await loadAll()
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل نقل الطاولات', life: 3000 })
  } finally {
    movingTables.value = false
  }
}
</script>

<style scoped>
/* ── Slide Transition ─────────────────────────────── */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.2s ease; overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; max-height: 0; }
.slide-down-enter-to, .slide-down-leave-from { opacity: 1; max-height: 300px; }

/* ── Filter Chips ─────────────────────────────────── */
.filter-chip {
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.3rem 0.75rem; border-radius: 999px;
  border: 1px solid var(--p-surface-300); background: var(--p-surface-0);
  color: var(--p-text-color-secondary); font-size: 0.75rem; font-weight: 500;
  cursor: pointer; white-space: nowrap; transition: all 0.15s; flex-shrink: 0;
}
.filter-chip:hover { background: var(--p-surface-100); color: var(--p-text-color); }
.filter-chip.active { background: var(--p-primary-color); border-color: var(--p-primary-color); color: #fff; }
.filter-chip.status-1.active { background: var(--p-orange-500); border-color: var(--p-orange-500); }
.filter-chip.status-2.active { background: var(--p-blue-500);   border-color: var(--p-blue-500);   }
.filter-chip.status-3.active { background: #7c3aed; border-color: #7c3aed; }

.status-dot { width: 0.45rem; height: 0.45rem; border-radius: 50%; flex-shrink: 0; }
.dot-0 { background: var(--p-green-500); }
.dot-1 { background: var(--p-orange-500); }
.dot-2 { background: var(--p-blue-500); }
.dot-3 { background: #7c3aed; }

.clear-btn {
  display: inline-flex; align-items: center; gap: 0.35rem;
  font-size: 0.75rem; color: var(--p-text-color-secondary);
  background: none; border: none; cursor: pointer;
  padding: 0.25rem 0.5rem; border-radius: 6px; transition: color 0.15s;
}
.clear-btn:hover { color: var(--p-red-500); }
.clear-btn:disabled { opacity: 0.4; cursor: default; }

/* ── Move Dialog Chips ────────────────────────────── */
.move-table-chip {
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.4rem 0.85rem; border-radius: 10px;
  border: 1.5px solid var(--p-surface-300);
  background: var(--p-surface-0); color: var(--p-text-color-secondary);
  font-size: 0.8rem; font-weight: 500; cursor: pointer;
  transition: all 0.15s; white-space: nowrap;
}
.move-table-chip:hover { border-color: var(--p-primary-color); color: var(--p-primary-color); }
.move-table-chip.selected {
  background: var(--p-primary-color); border-color: var(--p-primary-color);
  color: #fff;
}
</style>