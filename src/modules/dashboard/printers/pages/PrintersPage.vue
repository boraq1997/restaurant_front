<!-- src/modules/dashboard/printers/pages/PrintersPage.vue -->
<template>
  <div class="min-h-screen surface-50" dir="rtl">

    <!-- ── Header ─────────────────────────────────────── -->
    <div class="px-4 py-4 surface-card border-bottom-1 border-200">
      <div class="flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 class="text-lg font-bold text-900 m-0 line-height-1">إدارة الطابعات</h1>
          <p class="text-500 text-xs mt-1 mb-0">إضافة وتعديل واختبار طابعات المطعم</p>
        </div>
        <Button label="إضافة طابعة" icon="pi pi-plus" size="small" @click="openCreate" />
      </div>

      <!-- Stats -->
      <div class="flex gap-3 overflow-x-auto pb-1">
        <div class="stat-card flex align-items-center gap-2 px-3 py-2 border-round-xl border-1 surface-card border-200 flex-shrink-0">
          <div class="w-2rem h-2rem border-round-lg bg-blue-100 flex align-items-center justify-content-center">
            <i class="pi pi-print text-blue-600 text-sm" />
          </div>
          <div>
            <p class="text-400 text-xs m-0">الإجمالي</p>
            <p class="text-900 font-bold text-lg m-0 line-height-1">{{ printerStore.printers.length }}</p>
          </div>
        </div>
        <div class="stat-card flex align-items-center gap-2 px-3 py-2 border-round-xl border-1 surface-card border-200 flex-shrink-0">
          <div class="w-2rem h-2rem border-round-lg bg-green-100 flex align-items-center justify-content-center">
            <i class="pi pi-wifi text-green-600 text-sm" />
          </div>
          <div>
            <p class="text-400 text-xs m-0">شبكة</p>
            <p class="text-900 font-bold text-lg m-0 line-height-1">{{ networkCount }}</p>
          </div>
        </div>
        <div class="stat-card flex align-items-center gap-2 px-3 py-2 border-round-xl border-1 surface-card border-200 flex-shrink-0">
          <div class="w-2rem h-2rem border-round-lg bg-orange-100 flex align-items-center justify-content-center">
            <i class="pi pi-desktop text-orange-600 text-sm" />
          </div>
          <div>
            <p class="text-400 text-xs m-0">محلية</p>
            <p class="text-900 font-bold text-lg m-0 line-height-1">{{ localCount }}</p>
          </div>
        </div>
        <div
          class="stat-card flex align-items-center gap-2 px-3 py-2 border-round-xl border-1 flex-shrink-0 cursor-pointer transition-all"
          :class="showDiscovered ? 'bg-purple-100 border-purple-300' : 'surface-card border-200'"
          @click="toggleDiscovered"
        >
          <div class="w-2rem h-2rem border-round-lg bg-purple-100 flex align-items-center justify-content-center">
            <i class="pi pi-search text-purple-600 text-sm" />
          </div>
          <div>
            <p class="text-400 text-xs m-0">مكتشفة</p>
            <p class="text-900 font-bold text-lg m-0 line-height-1">{{ discoveredTotal }}</p>
          </div>
        </div>
      </div>
    </div>

    <main class="px-4 pt-4 pb-6">

      <!-- ── الطابعات المكتشفة ───────────────────────── -->
      <Transition name="slide-down">
        <div v-if="showDiscovered" class="mb-4">
          <div class="surface-card border-round-xl border-1 border-purple-200 overflow-hidden">
            <div class="flex align-items-center justify-content-between px-4 py-3 bg-purple-50 border-bottom-1 border-purple-100">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-search text-purple-600" />
                <span class="font-bold text-purple-800 text-sm">الطابعات المكتشفة على الشبكة</span>
              </div>
              <Button
                icon="pi pi-refresh"
                text rounded size="small"
                severity="secondary"
                :loading="printerStore.loading"
                @click="printerStore.fetchDiscovered()"
              />
            </div>

            <div v-if="printerStore.discoveredPrinters.length === 0" class="flex flex-column align-items-center py-6 gap-2 text-400">
              <i class="pi pi-inbox text-3xl" />
              <span class="text-sm">لم يتم اكتشاف طابعات على الشبكة</span>
            </div>

            <div v-else class="p-3 flex flex-wrap gap-2">
              <template v-for="group in printerStore.discoveredPrinters" :key="group.machineName">
                <div
                  v-for="name in group.printerNames"
                  :key="name"
                  class="discovered-chip"
                  @click="quickAddDiscovered(name)"
                >
                  <i class="pi pi-print text-xs" />
                  {{ name }}
                  <i class="pi pi-plus text-xs opacity-60" />
                </div>
              </template>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ── بحث ────────────────────────────────────── -->
      <div class="mb-4">
        <span class="p-input-icon-right w-full md:w-20rem">
          <i class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            placeholder="ابحث باسم الطابعة أو الموقع..."
            class="w-full"
            size="small"
          />
        </span>
      </div>

      <!-- ── Loading ────────────────────────────────── -->
      <div v-if="printerStore.loading" class="flex justify-content-center py-8">
        <ProgressSpinner />
      </div>

      <!-- ── فارغ ───────────────────────────────────── -->
      <div v-else-if="filteredPrinters.length === 0" class="flex flex-column align-items-center py-8 gap-3">
        <i class="pi pi-print text-5xl text-300" />
        <p class="text-500 m-0">{{ searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد طابعات مضافة' }}</p>
        <Button v-if="!searchQuery" label="إضافة طابعة" icon="pi pi-plus" @click="openCreate" />
        <Button v-else label="مسح البحث" text @click="searchQuery = ''" />
      </div>

      <!-- ── جدول الطابعات ─────────────────────────── -->
      <div v-else class="surface-card border-round-xl border-1 border-200 overflow-hidden shadow-1">
        <DataTable
          :value="filteredPrinters"
          stripedRows
          class="printers-table"
        >
          <!-- الاسم -->
          <Column header="الطابعة" style="min-width: 180px">
            <template #body="{ data }">
              <div class="flex align-items-center gap-3">
                <div
                  class="w-2rem h-2rem border-round-lg flex align-items-center justify-content-center flex-shrink-0"
                  :class="data.ipAddress ? 'bg-green-50' : 'bg-orange-50'"
                >
                  <i class="pi pi-print text-sm" :class="data.ipAddress ? 'text-green-600' : 'text-orange-500'" />
                </div>
                <span class="font-bold text-900 text-sm">{{ data.name }}</span>
              </div>
            </template>
          </Column>

          <!-- النوع -->
          <Column header="النوع" style="width: 110px">
            <template #body="{ data }">
              <Tag
                :value="data.ipAddress ? 'شبكة' : 'محلية'"
                :severity="data.ipAddress ? 'success' : 'warn'"
                class="text-xs"
              />
            </template>
          </Column>

          <!-- عنوان الشبكة -->
          <Column header="عنوان الشبكة" style="min-width: 160px">
            <template #body="{ data }">
              <span
                v-if="data.ipAddress"
                class="font-mono text-sm surface-100 border-round px-2 py-1"
                dir="ltr"
              >
                {{ data.ipAddress }}{{ data.port ? `:${data.port}` : '' }}
              </span>
              <span v-else class="text-400 text-sm">—</span>
            </template>
          </Column>

          <!-- الموقع -->
          <Column header="الموقع" style="width: 130px">
            <template #body="{ data }">
              <Tag v-if="data.location" :value="data.location" severity="info" class="text-xs" />
              <span v-else class="text-400">—</span>
            </template>
          </Column>

          <!-- الوصف -->
          <Column header="الوصف">
            <template #body="{ data }">
              <span class="text-sm text-500">{{ data.description || '—' }}</span>
            </template>
          </Column>

          <!-- الإجراءات -->
          <Column header="" style="width: 120px">
            <template #body="{ data }">
              <div class="flex gap-1 justify-content-end">
                <Button
                  icon="pi pi-play"
                  text rounded size="small"
                  severity="success"
                  v-tooltip.top="'اختبار الطباعة'"
                  :loading="testingId === data.id"
                  @click="testPrint(data)"
                />
                <Button
                  icon="pi pi-pencil"
                  text rounded size="small"
                  severity="secondary"
                  v-tooltip.top="'تعديل'"
                  @click="openEdit(data)"
                />
                <Button
                  icon="pi pi-trash"
                  text rounded size="small"
                  severity="danger"
                  v-tooltip.top="'حذف'"
                  @click="handleDelete(data)"
                />
              </div>
            </template>
          </Column>

        </DataTable>
      </div>

    </main>

    <!-- ── Form Dialog ────────────────────────────────── -->
    <PrinterFormDialog v-model="dialogVisible" :printer="selectedPrinter" />

    <!-- ── Confirm Delete ─────────────────────────────── -->
    <ConfirmDeleteDialog
      v-model="deleteVisible"
      :message="deleteMessage"
      :loading="deleting"
      @confirm="onDeleteConfirmed"
    />

    <!-- ── Test Print Dialog ──────────────────────────── -->
    <Dialog
      v-model:visible="testDialogVisible"
      :modal="true" :draggable="false"
      style="width: 100%; max-width: 380px;"
      dir="rtl"
    >
      <template #container>
        <div class="test-dialog">
          <div class="icon-wrap">
            <div class="icon-ring" :class="testResult === 'success' ? 'icon-ring--green' : testResult === 'error' ? 'icon-ring--red' : 'icon-ring--blue'">
              <i
                :class="testResult === 'success' ? 'pi pi-check' : testResult === 'error' ? 'pi pi-times' : 'pi pi-print'"
              />
            </div>
          </div>

          <p class="dialog-title">
            {{ testResult === 'success' ? 'تم الاختبار بنجاح' : testResult === 'error' ? 'فشل الاختبار' : 'اختبار الطابعة' }}
          </p>
          <p class="dialog-sub">
            {{ testResult === 'success'
              ? 'تم إرسال صفحة اختبار للطابعة بنجاح'
              : testResult === 'error'
              ? 'لم يتمكن النظام من الاتصال بالطابعة'
              : `هل تريد إرسال صفحة اختبار لـ "${testingPrinter?.name}"؟` }}
          </p>

          <div class="dialog-actions">
            <Button
              v-if="!testResult"
              label="إلغاء"
              severity="secondary"
              outlined
              class="flex-1"
              @click="testDialogVisible = false"
            />
            <Button
              v-if="!testResult"
              label="إرسال اختبار"
              icon="pi pi-play"
              severity="success"
              class="flex-1"
              :loading="testingId !== null"
              @click="confirmTestPrint"
            />
            <Button
              v-if="testResult"
              label="إغلاق"
              class="w-full"
              :severity="testResult === 'success' ? 'success' : 'secondary'"
              @click="testDialogVisible = false; testResult = null"
            />
          </div>
        </div>
      </template>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Button          from 'primevue/button'
import Tag             from 'primevue/tag'
import Dialog          from 'primevue/dialog'
import InputText       from 'primevue/inputtext'
import DataTable       from 'primevue/datatable'
import Column          from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast }    from 'primevue/usetoast'
import { usePrinterStore }    from '../store/printerStore'
import PrinterFormDialog      from '../components/PrinterFormDialog.vue'
import ConfirmDeleteDialog    from '../../../../components/shared/ConfirmDeleteDialog.vue'
import type { Printer }       from '../types/printers-types'
import apiClient              from '../../../../services/api-client'

const printerStore = usePrinterStore()
const toast        = useToast()

// ── State ─────────────────────────────────────────────
const searchQuery     = ref('')
const showDiscovered  = ref(false)
const dialogVisible   = ref(false)
const selectedPrinter = ref<Printer | null>(null)
const deleteVisible   = ref(false)
const deleteMessage   = ref('')
const deleting        = ref(false)
const pendingId       = ref<number | null>(null)

// ── Test Print ────────────────────────────────────────
const testDialogVisible = ref(false)
const testingPrinter    = ref<Printer | null>(null)
const testingId         = ref<number | null>(null)
const testResult        = ref<'success' | 'error' | null>(null)

// ── Computed ──────────────────────────────────────────
const networkCount = computed(() => printerStore.printers.filter(p => !!p.ipAddress).length)
const localCount   = computed(() => printerStore.printers.filter(p => !p.ipAddress).length)

const discoveredTotal = computed(() =>
  printerStore.discoveredPrinters.reduce((s, g) => s + g.printerNames.length, 0)
)

const filteredPrinters = computed(() => {
  if (!searchQuery.value.trim()) return printerStore.printers
  const q = searchQuery.value.trim().toLowerCase()
  return printerStore.printers.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.location?.toLowerCase().includes(q) ||
    p.ipAddress?.includes(q)
  )
})

// ── Actions ───────────────────────────────────────────
function openCreate() {
  selectedPrinter.value = null
  printerStore.fetchDiscovered()
  dialogVisible.value = true
}

function openEdit(printer: Printer) {
  selectedPrinter.value = printer
  dialogVisible.value   = true
}

function handleDelete(printer: Printer) {
  pendingId.value     = printer.id
  deleteMessage.value = `هل تريد حذف الطابعة "${printer.name}"؟`
  deleteVisible.value = true
}

async function onDeleteConfirmed() {
  if (!pendingId.value) return
  deleting.value = true
  await printerStore.deletePrinter(pendingId.value)
  deleting.value      = false
  deleteVisible.value = false
  pendingId.value     = null
}

function toggleDiscovered() {
  showDiscovered.value = !showDiscovered.value
  if (showDiscovered.value) printerStore.fetchDiscovered()
}

// ── Quick Add من الطابعات المكتشفة ────────────────────
function quickAddDiscovered(name: string) {
  selectedPrinter.value = null
  dialogVisible.value   = true
  // سيتم تعبئة الاسم تلقائياً عبر الـ PrinterFormDialog
  toast.add({ severity: 'info', summary: 'تلميح', detail: `اختر "${name}" من قائمة الطابعات المكتشفة في النموذج`, life: 3000 })
}

// ── اختبار الطابعة ────────────────────────────────────
function testPrint(printer: Printer) {
  testingPrinter.value  = printer
  testResult.value      = null
  testDialogVisible.value = true
}

async function confirmTestPrint() {
  if (!testingPrinter.value) return
  testingId.value = testingPrinter.value.id
  try {
    await apiClient.post('/printers/confirm-print-job', {
      invoiceId:    0,
      printerName:  testingPrinter.value.name,
      isSuccess:    true,
      errorMessage: null,
    })
    testResult.value = 'success'
  } catch {
    testResult.value = 'error'
  } finally {
    testingId.value = null
  }
}

onMounted(() => {
  printerStore.fetchPrinters()
  printerStore.fetchDiscovered()
})
</script>

<style scoped>
/* ── Discovered chip ──────────────────────────────── */
.discovered-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 0.4rem 0.85rem; border-radius: 10px;
  border: 1.5px solid var(--p-purple-200);
  background: var(--p-surface-0); color: var(--p-purple-700);
  font-size: 0.8rem; font-weight: 500; cursor: pointer;
  transition: all 0.15s;
}
.discovered-chip:hover {
  background: var(--p-purple-50);
  border-color: var(--p-purple-400);
}

/* ── Table ────────────────────────────────────────── */
.printers-table :deep(th) {
  background: var(--p-surface-50) !important;
  font-size: 0.8rem; font-weight: 600;
  color: var(--p-text-color-secondary);
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--p-surface-200);
}
.printers-table :deep(td) {
  padding: 0.65rem 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid var(--p-surface-100);
}
.printers-table :deep(tr:hover td) {
  background: var(--p-surface-50) !important;
}

/* ── Slide Transition ─────────────────────────────── */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.25s ease; overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; max-height: 0; }
.slide-down-enter-to, .slide-down-leave-from { opacity: 1; max-height: 400px; }

/* ── Test Dialog ──────────────────────────────────── */
.test-dialog {
  display: flex; flex-direction: column; align-items: center;
  padding: 2rem 1.5rem 1.5rem; border-radius: 16px;
  background: var(--p-surface-0); text-align: center;
}
.icon-wrap { margin-bottom: 1.25rem; }
.icon-ring {
  width: 72px; height: 72px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}
.icon-ring--blue  { background: var(--p-blue-100);  }
.icon-ring--blue  i { font-size: 1.75rem; color: var(--p-blue-500); }
.icon-ring--green { background: var(--p-green-100); }
.icon-ring--green i { font-size: 1.75rem; color: var(--p-green-500); }
.icon-ring--red   { background: var(--p-red-100);   }
.icon-ring--red   i { font-size: 1.75rem; color: var(--p-red-500); }

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.1); }
  50%       { box-shadow: 0 0 0 10px rgba(0,0,0,0); }
}

.dialog-title { font-size: 1.1rem; font-weight: 700; color: var(--p-text-color); margin: 0 0 0.4rem; }
.dialog-sub   { font-size: 0.875rem; color: var(--p-text-muted-color); margin: 0 0 1.5rem; line-height: 1.6; }
.dialog-actions { display: flex; gap: 0.75rem; width: 100%; }
</style>