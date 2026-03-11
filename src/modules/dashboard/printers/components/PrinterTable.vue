<template>
  <DataTable
    :value="printerStore.printers"
    :loading="printerStore.loading"
    striped-rows
    responsive-layout="scroll"
    :rows="10"
    paginator
    empty-message="لا توجد طابعات مضافة"
    class="p-datatable-sm"
  >
    <Column field="id" header="#" style="width: 60px" />

    <Column field="name" header="اسم الطابعة" sortable>
      <template #body="{ data }">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-print text-400" />
          <span class="font-medium">{{ data.name }}</span>
        </div>
      </template>
    </Column>

    <Column header="عنوان الشبكة">
      <template #body="{ data }">
        <span
          v-if="data.ipAddress"
          class="font-mono text-sm surface-100 border-round px-2 py-1"
          dir="ltr"
        >
          {{ data.ipAddress }}{{ data.port ? `:${data.port}` : '' }}
        </span>
        <span v-else class="text-400">—</span>
      </template>
    </Column>

    <Column field="location" header="الموقع">
      <template #body="{ data }">
        <Tag v-if="data.location" :value="data.location" severity="info" />
        <span v-else class="text-400">—</span>
      </template>
    </Column>

    <Column field="description" header="الوصف">
      <template #body="{ data }">
        <span class="text-600 text-sm">{{ data.description || '—' }}</span>
      </template>
    </Column>

    <Column header="الإجراءات" style="width: 100px">
      <template #body="{ data }">
        <div class="flex gap-1">
          <Button
            icon="pi pi-pencil"
            text rounded size="small" severity="info"
            v-tooltip.top="'تعديل'"
            @click="emit('edit', data)"
          />
          <Button
            icon="pi pi-trash"
            text rounded size="small" severity="danger"
            v-tooltip.top="'حذف'"
            @click="emit('delete', data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { usePrinterStore } from '../store/printerStore'
import type { Printer } from '../types/printers-types'

const printerStore = usePrinterStore()

const emit = defineEmits<{
  edit:   [printer: Printer]
  delete: [printer: Printer]
}>()
</script>