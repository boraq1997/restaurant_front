<template>
  <div class="p-4" dir="rtl">

    <!-- Header -->
    <div class="flex align-items-center justify-content-between mb-4">
      <div>
        <h1 class="text-2xl font-bold text-900 m-0">إدارة الطابعات</h1>
        <p class="text-500 mt-1 mb-0">إضافة وتعديل طابعات المطعم</p>
      </div>
      <Button label="إضافة طابعة" icon="pi pi-plus" @click="openCreate" />
    </div>

    <!-- Stats -->
    <div class="grid mb-4">
      <div class="col-12 md:col-4">
        <div class="surface-card border-round-lg p-3 border-1 border-200 flex align-items-center gap-3">
          <div class="bg-blue-100 border-round-lg p-2">
            <i class="pi pi-print text-blue-600 text-xl" />
          </div>
          <div>
            <p class="text-500 text-sm m-0">إجمالي الطابعات</p>
            <p class="text-900 text-xl font-bold m-0">{{ printerStore.printers.length }}</p>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-4">
        <div class="surface-card border-round-lg p-3 border-1 border-200 flex align-items-center gap-3">
          <div class="bg-green-100 border-round-lg p-2">
            <i class="pi pi-wifi text-green-600 text-xl" />
          </div>
          <div>
            <p class="text-500 text-sm m-0">طابعات الشبكة</p>
            <p class="text-900 text-xl font-bold m-0">{{ networkCount }}</p>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-4">
        <div class="surface-card border-round-lg p-3 border-1 border-200 flex align-items-center gap-3">
          <div class="bg-orange-100 border-round-lg p-2">
            <i class="pi pi-desktop text-orange-600 text-xl" />
          </div>
          <div>
            <p class="text-500 text-sm m-0">طابعات محلية</p>
            <p class="text-900 text-xl font-bold m-0">{{ localCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="surface-card border-round-lg border-1 border-200">
      <PrinterTable @edit="openEdit" @delete="handleDelete" />
    </div>

    <!-- Form Dialog -->
    <PrinterFormDialog v-model="dialogVisible" :printer="selectedPrinter" />

    <!-- Confirm Delete Dialog -->
    <ConfirmDeleteDialog
      v-model="deleteVisible"
      :message="deleteMessage"
      :loading="deleting"
      @confirm="onDeleteConfirmed"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Button from 'primevue/button'
import { usePrinterStore } from '../store/printerStore'
import PrinterTable from '../components/PrinterTable.vue'
import PrinterFormDialog from '../components/PrinterFormDialog.vue'
import ConfirmDeleteDialog from '../../../../components/shared/ConfirmDeleteDialog.vue'
import type { Printer } from '../types/printers-types'

const printerStore = usePrinterStore()

const dialogVisible   = ref(false)
const selectedPrinter = ref<Printer | null>(null)
const deleteVisible   = ref(false)
const deleteMessage   = ref('')
const deleting        = ref(false)
const pendingId       = ref<number | null>(null)

const networkCount = computed(() => printerStore.printers.filter(p => !!p.ipAddress).length)
const localCount   = computed(() => printerStore.printers.filter(p => !p.ipAddress).length)

function openCreate() {
  selectedPrinter.value = null
  printerStore.fetchDiscovered()
  dialogVisible.value = true
}

function openEdit(printer: Printer) {
  selectedPrinter.value = printer
  dialogVisible.value = true
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

onMounted(() => printerStore.fetchPrinters())
</script>