<!-- src/modules/dashboard/inventory/pages/InventoryPage.vue -->
<template>
  <div class="min-h-screen surface-50" dir="rtl">

    <!-- Header -->
    <div class="px-4 py-4 surface-card border-bottom-1 border-200">
      <div class="flex align-items-center justify-content-between flex-wrap gap-3">
        <div class="flex align-items-center gap-3">
          <div class="w-2rem h-2rem border-round-lg bg-primary flex align-items-center justify-content-center">
            <i class="pi pi-box text-white text-sm" />
          </div>
          <div>
            <h1 class="font-bold text-900 text-lg m-0 line-height-1">المخزون</h1>
            <span class="text-xs text-500">إدارة المواد والفئات ووحدات القياس</span>
          </div>
        </div>

        <!-- زر الإضافة حسب التبويب الحالي -->
        <Button
          :label="addLabel"
          icon="pi pi-plus"
          size="small"
          @click="openAddDialog"
        />
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mt-4 overflow-x-auto" style="scrollbar-width: none;">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <i :class="tab.icon" />
          {{ tab.label }}
          <span v-if="tab.count !== null" class="tab-count">{{ tab.count }}</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <main class="px-4 pt-4 pb-6">

      <!-- ── المواد ── -->
      <div v-if="activeTab === 'items'">

        <!-- Loading -->
        <div v-if="loadingItems" class="flex justify-content-center py-8">
          <ProgressSpinner />
        </div>

        <!-- فارغ -->
        <div v-else-if="items.length === 0" class="empty-state">
          <i class="pi pi-box text-4xl text-300 mb-3 block" />
          <p class="text-500 m-0 font-medium">لا توجد مواد مخزنية</p>
          <Button label="إضافة مادة" icon="pi pi-plus" size="small" text class="mt-3" @click="openAddDialog" />
        </div>

        <!-- الجدول Desktop -->
        <div v-else class="hidden md:block surface-card border-round-xl border-1 border-200 overflow-hidden shadow-1">
          <DataTable :value="items" stripedRows class="inventory-table">
            <Column header="المادة" style="min-width: 180px">
              <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                  <div class="item-icon">
                    <i class="pi pi-box text-primary text-xs" />
                  </div>
                  <span class="font-medium text-900 text-sm">{{ data.name }}</span>
                </div>
              </template>
            </Column>
            <Column header="الفئة" style="width: 140px">
              <template #body="{ data }">
                <Tag :value="getCategoryName(data.categoryId)" severity="info" class="text-xs" />
              </template>
            </Column>
            <Column header="الكمية الحالية" style="width: 130px">
              <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                  <span
                    class="font-bold text-sm"
                    :class="isLowStock(data) ? 'text-red-500' : 'text-900'"
                  >
                    {{ data.currentStock ?? data.initialStock ?? 0 }}
                  </span>
                  <span class="text-xs text-400">{{ getUnitName(data.unitOfMeasurementId) }}</span>
                  <Tag v-if="isLowStock(data)" value="منخفض" severity="danger" class="text-xs" />
                </div>
              </template>
            </Column>
            <Column header="حد إعادة الطلب" style="width: 140px">
              <template #body="{ data }">
                <span class="text-sm text-600">{{ data.reorderLevel ?? '—' }}</span>
              </template>
            </Column>
            <Column header="التكلفة/وحدة" style="width: 120px">
              <template #body="{ data }">
                <span class="text-sm font-medium text-primary">{{ data.costPerUnit?.toLocaleString() ?? '—' }} د.ع</span>
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- كروت Mobile -->
        <div class="md:hidden flex flex-column gap-3">
          <div
            v-for="item in items"
            :key="item.id"
            class="surface-card border-round-xl border-1 border-200 p-3 shadow-1"
          >
            <div class="flex align-items-start justify-content-between mb-2">
              <div class="flex align-items-center gap-2">
                <div class="item-icon"><i class="pi pi-box text-primary text-xs" /></div>
                <span class="font-bold text-900 text-sm">{{ item.name }}</span>
              </div>
              <Tag v-if="isLowStock(item)" value="منخفض" severity="danger" class="text-xs" />
            </div>
            <div class="grid m-0 gap-2">
              <div class="col-6 p-0">
                <span class="text-xs text-400 block">الفئة</span>
                <span class="text-sm font-medium text-700">{{ getCategoryName(item.categoryId) }}</span>
              </div>
              <div class="col-6 p-0">
                <span class="text-xs text-400 block">الكمية</span>
                <span class="text-sm font-bold" :class="isLowStock(item) ? 'text-red-500' : 'text-900'">
                  {{ item.currentStock ?? item.initialStock ?? 0 }} {{ getUnitName(item.unitOfMeasurementId) }}
                </span>
              </div>
              <div class="col-6 p-0">
                <span class="text-xs text-400 block">حد إعادة الطلب</span>
                <span class="text-sm text-700">{{ item.reorderLevel ?? '—' }}</span>
              </div>
              <div class="col-6 p-0">
                <span class="text-xs text-400 block">التكلفة/وحدة</span>
                <span class="text-sm font-medium text-primary">{{ item.costPerUnit?.toLocaleString() ?? '—' }} د.ع</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ── الفئات ── -->
      <div v-else-if="activeTab === 'categories'">
        <div v-if="loadingCategories" class="flex justify-content-center py-8">
          <ProgressSpinner />
        </div>
        <div v-else-if="categories.length === 0" class="empty-state">
          <i class="pi pi-tag text-4xl text-300 mb-3 block" />
          <p class="text-500 m-0 font-medium">لا توجد فئات</p>
          <Button label="إضافة فئة" icon="pi pi-plus" size="small" text class="mt-3" @click="openAddDialog" />
        </div>
        <div v-else class="grid m-0">
          <div v-for="cat in categories" :key="cat.id" class="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
            <div class="surface-card border-round-xl border-1 border-200 p-4 shadow-1 flex align-items-center gap-3">
              <div class="w-3rem h-3rem border-round-lg bg-primary-50 flex align-items-center justify-content-center flex-shrink-0">
                <i class="pi pi-tag text-primary text-lg" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-900 m-0 text-sm">{{ cat.name }}</p>
                <span class="text-xs text-400">
                  {{ items.filter(i => i.categoryId === cat.id).length }} مادة
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── وحدات القياس ── -->
      <div v-else-if="activeTab === 'units'">
        <div v-if="loadingUnits" class="flex justify-content-center py-8">
          <ProgressSpinner />
        </div>
        <div v-else-if="units.length === 0" class="empty-state">
          <i class="pi pi-cog text-4xl text-300 mb-3 block" />
          <p class="text-500 m-0 font-medium">لا توجد وحدات قياس</p>
          <Button label="إضافة وحدة" icon="pi pi-plus" size="small" text class="mt-3" @click="openAddDialog" />
        </div>
        <div v-else class="grid m-0">
          <div v-for="unit in units" :key="unit.id" class="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
            <div class="surface-card border-round-xl border-1 border-200 p-4 shadow-1 flex align-items-center gap-3">
              <div class="w-3rem h-3rem border-round-lg bg-orange-50 flex align-items-center justify-content-center flex-shrink-0">
                <i class="pi pi-cog text-orange-500 text-lg" />
              </div>
              <div>
                <p class="font-bold text-900 m-0 text-sm">{{ unit.name }}</p>
                <span v-if="unit.abbreviation" class="text-xs text-400">{{ unit.abbreviation }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- ── Dialog إضافة مادة ── -->
    <Dialog
      v-model:visible="addItemVisible"
      header="إضافة مادة جديدة"
      :modal="true" :draggable="false"
      style="width: 100%; max-width: 460px;"
      dir="rtl"
    >
      <div class="flex flex-column gap-3 pt-2">
        <div class="flex flex-column gap-2">
          <label class="font-medium text-sm">الاسم <span class="text-red-500">*</span></label>
          <InputText v-model="itemForm.name" placeholder="مثال: دقيق" fluid />
        </div>
        <div class="flex flex-column gap-2">
          <label class="font-medium text-sm">الفئة <span class="text-red-500">*</span></label>
          <Select v-model="itemForm.categoryId" :options="categories" option-label="name" option-value="id" placeholder="اختر فئة" fluid />
        </div>
        <div class="flex flex-column gap-2">
          <label class="font-medium text-sm">وحدة القياس <span class="text-red-500">*</span></label>
          <Select v-model="itemForm.unitOfMeasurementId" :options="units" option-label="name" option-value="id" placeholder="اختر وحدة" fluid />
        </div>
        <div class="grid m-0 gap-2">
          <div class="col p-0 flex flex-column gap-2">
            <label class="font-medium text-sm">الكمية الابتدائية</label>
            <InputNumber v-model="itemForm.initialStock" :min="0" fluid />
          </div>
          <div class="col p-0 flex flex-column gap-2">
            <label class="font-medium text-sm">حد إعادة الطلب</label>
            <InputNumber v-model="itemForm.reorderLevel" :min="0" fluid />
          </div>
        </div>
        <div class="flex flex-column gap-2">
          <label class="font-medium text-sm">التكلفة لكل وحدة</label>
          <InputNumber v-model="itemForm.costPerUnit" :min="0" suffix=" د.ع" fluid />
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2 justify-content-end">
          <Button label="إلغاء" severity="secondary" outlined @click="addItemVisible = false" />
          <Button label="إضافة" icon="pi pi-check" :loading="saving" @click="saveItem" />
        </div>
      </template>
    </Dialog>

    <!-- ── Dialog إضافة فئة ── -->
    <Dialog
      v-model:visible="addCategoryVisible"
      header="إضافة فئة جديدة"
      :modal="true" :draggable="false"
      style="width: 100%; max-width: 380px;"
      dir="rtl"
    >
      <div class="flex flex-column gap-3 pt-2">
        <div class="flex flex-column gap-2">
          <label class="font-medium text-sm">اسم الفئة <span class="text-red-500">*</span></label>
          <InputText v-model="categoryForm.name" placeholder="مثال: مواد جافة" fluid />
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2 justify-content-end">
          <Button label="إلغاء" severity="secondary" outlined @click="addCategoryVisible = false" />
          <Button label="إضافة" icon="pi pi-check" :loading="saving" @click="saveCategory" />
        </div>
      </template>
    </Dialog>

    <!-- ── Dialog إضافة وحدة قياس ── -->
    <Dialog
      v-model:visible="addUnitVisible"
      header="إضافة وحدة قياس جديدة"
      :modal="true" :draggable="false"
      style="width: 100%; max-width: 380px;"
      dir="rtl"
    >
      <div class="flex flex-column gap-3 pt-2">
        <div class="flex flex-column gap-2">
          <label class="font-medium text-sm">الاسم <span class="text-red-500">*</span></label>
          <InputText v-model="unitForm.name" placeholder="مثال: كيلوغرام" fluid />
        </div>
        <div class="flex flex-column gap-2">
          <label class="font-medium text-sm">الاختصار</label>
          <InputText v-model="unitForm.abbreviation" placeholder="مثال: كغ" fluid />
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2 justify-content-end">
          <Button label="إلغاء" severity="secondary" outlined @click="addUnitVisible = false" />
          <Button label="إضافة" icon="pi pi-check" :loading="saving" @click="saveUnit" />
        </div>
      </template>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button        from 'primevue/button'
import Tag           from 'primevue/tag'
import Dialog        from 'primevue/dialog'
import InputText     from 'primevue/inputtext'
import InputNumber   from 'primevue/inputnumber'
import Select        from 'primevue/select'
import DataTable     from 'primevue/datatable'
import Column        from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import apiClient from '../../../services/api-client'

const toast = useToast()

// ── State ─────────────────────────────────────────────
const activeTab = ref<'items' | 'categories' | 'units'>('items')

const items      = ref<any[]>([])
const categories = ref<any[]>([])
const units      = ref<any[]>([])

const loadingItems      = ref(false)
const loadingCategories = ref(false)
const loadingUnits      = ref(false)
const saving            = ref(false)

const addItemVisible     = ref(false)
const addCategoryVisible = ref(false)
const addUnitVisible     = ref(false)

const itemForm = ref({
  name: '', categoryId: null as number | null,
  unitOfMeasurementId: null as number | null,
  initialStock: 0, reorderLevel: 0, costPerUnit: 0,
})

const categoryForm = ref({ name: '' })
const unitForm     = ref({ name: '', abbreviation: '' })

// ── Tabs ──────────────────────────────────────────────
const tabs = computed(() => [
  { key: 'items'      as const, label: 'المواد',         icon: 'pi pi-box',    count: items.value.length },
  { key: 'categories' as const, label: 'الفئات',         icon: 'pi pi-tag',    count: categories.value.length },
  { key: 'units'      as const, label: 'وحدات القياس',   icon: 'pi pi-cog',    count: units.value.length },
])

const addLabel = computed(() => {
  if (activeTab.value === 'items')      return 'إضافة مادة'
  if (activeTab.value === 'categories') return 'إضافة فئة'
  return 'إضافة وحدة'
})

// ── Helpers ───────────────────────────────────────────
function getCategoryName(id: number) {
  return categories.value.find(c => c.id === id)?.name ?? '—'
}

function getUnitName(id: number) {
  return units.value.find(u => u.id === id)?.abbreviation ?? units.value.find(u => u.id === id)?.name ?? ''
}

function isLowStock(item: any): boolean {
  const stock = item.currentStock ?? item.initialStock ?? 0
  return item.reorderLevel && stock <= item.reorderLevel
}

// ── Fetch ─────────────────────────────────────────────
async function fetchItems() {
  loadingItems.value = true
  try {
    const res = await apiClient.get('/Inventory/get-all-inventory-items')
    items.value = Array.isArray(res) ? res : res?.items ?? res?.data ?? []
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل المواد', life: 3000 })
  } finally {
    loadingItems.value = false
  }
}

async function fetchCategories() {
  loadingCategories.value = true
  try {
    const res = await apiClient.get('/Inventory/get-all-inventory-categories')
    categories.value = Array.isArray(res) ? res : res?.items ?? res?.data ?? []
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل الفئات', life: 3000 })
  } finally {
    loadingCategories.value = false
  }
}

async function fetchUnits() {
  loadingUnits.value = true
  try {
    const res = await apiClient.get('/Inventory/get-all-units-of-measurement')
    units.value = Array.isArray(res) ? res : res?.items ?? res?.data ?? []
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل وحدات القياس', life: 3000 })
  } finally {
    loadingUnits.value = false
  }
}

onMounted(() => {
  fetchItems()
  fetchCategories()
  fetchUnits()
})

// ── Add Dialog ────────────────────────────────────────
function openAddDialog() {
  if (activeTab.value === 'items') {
    itemForm.value = { name: '', categoryId: null, unitOfMeasurementId: null, initialStock: 0, reorderLevel: 0, costPerUnit: 0 }
    addItemVisible.value = true
  } else if (activeTab.value === 'categories') {
    categoryForm.value = { name: '' }
    addCategoryVisible.value = true
  } else {
    unitForm.value = { name: '', abbreviation: '' }
    addUnitVisible.value = true
  }
}

// ── Save ──────────────────────────────────────────────
async function saveItem() {
  if (!itemForm.value.name.trim() || !itemForm.value.categoryId || !itemForm.value.unitOfMeasurementId) {
    toast.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى تعبئة الحقول المطلوبة', life: 3000 })
    return
  }
  saving.value = true
  try {
    await apiClient.post('/Inventory/create-inventory-item', {
      name:                itemForm.value.name.trim(),
      categoryId:          itemForm.value.categoryId,
      unitOfMeasurementId: itemForm.value.unitOfMeasurementId,
      initialStock:        itemForm.value.initialStock,
      reorderLevel:        itemForm.value.reorderLevel,
      costPerUnit:         itemForm.value.costPerUnit,
    })
    toast.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة المادة', life: 2000 })
    addItemVisible.value = false
    await fetchItems()
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشلت الإضافة', life: 3000 })
  } finally {
    saving.value = false
  }
}

async function saveCategory() {
  if (!categoryForm.value.name.trim()) {
    toast.add({ severity: 'warn', summary: 'تنبيه', detail: 'اسم الفئة مطلوب', life: 3000 })
    return
  }
  saving.value = true
  try {
    await apiClient.post('/Inventory/create-inventory-category', { name: categoryForm.value.name.trim() })
    toast.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الفئة', life: 2000 })
    addCategoryVisible.value = false
    await fetchCategories()
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشلت الإضافة', life: 3000 })
  } finally {
    saving.value = false
  }
}

async function saveUnit() {
  if (!unitForm.value.name.trim()) {
    toast.add({ severity: 'warn', summary: 'تنبيه', detail: 'اسم الوحدة مطلوب', life: 3000 })
    return
  }
  saving.value = true
  try {
    await apiClient.post('/Inventory/create-unit-of-measurement', {
      name:         unitForm.value.name.trim(),
      abbreviation: unitForm.value.abbreviation.trim() || undefined,
    })
    toast.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة وحدة القياس', life: 2000 })
    addUnitVisible.value = false
    await fetchUnits()
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشلت الإضافة', life: 3000 })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* Tabs */
.tab-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1.25rem; border-radius: 999px;
  border: 1.5px solid var(--p-surface-300);
  background: var(--p-surface-0); color: var(--p-text-color-secondary);
  font-size: 0.82rem; font-weight: 500; cursor: pointer;
  white-space: nowrap; flex-shrink: 0; transition: all 0.15s ease;
}
.tab-btn:hover { background: var(--p-surface-100); color: var(--p-text-color); }
.tab-btn.active {
  background: var(--p-primary-color); border-color: var(--p-primary-color);
  color: #fff; font-weight: 600;
}
.tab-count {
  background: rgba(255,255,255,0.25); color: inherit;
  font-size: 0.7rem; font-weight: 700;
  padding: 1px 6px; border-radius: 20px;
}
.tab-btn:not(.active) .tab-count {
  background: var(--p-surface-200); color: var(--p-text-muted-color);
}

/* Item icon */
.item-icon {
  width: 28px; height: 28px; border-radius: 8px;
  background: var(--p-primary-50, #fff7ed);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* Empty state */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 4rem 0; text-align: center;
}

/* Table */
.inventory-table :deep(th) {
  background: var(--p-surface-50) !important;
  font-size: 0.8rem; font-weight: 600;
  color: var(--p-text-color-secondary);
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--p-surface-200);
}
.inventory-table :deep(td) {
  padding: 0.65rem 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid var(--p-surface-100);
}
.inventory-table :deep(tr:hover td) {
  background: var(--p-surface-50) !important;
}
</style>