<template>
  <div class="surface-card border-round-xl border-1 border-200 p-3 flex flex-column gap-3 shadow-1 hover:shadow-3 transition-all transition-duration-200">

    <!-- Header -->
    <div class="flex align-items-center justify-content-between">
      <div class="w-2rem h-2rem border-round-lg bg-primary-50 flex align-items-center justify-content-center">
        <i class="pi pi-th-large text-primary text-sm" />
      </div>
      <Tag
        :value="statusLabel"
        :severity="statusSeverity"
        rounded
        class="text-xs"
      />
    </div>

    <!-- رقم الطاولة -->
    <!-- رقم الطاولة -->
    <div class="text-center">
      <p class="text-2xl font-bold text-900 m-0 line-height-1">{{ table.number }}</p>
      <span class="text-sm font-medium text-700">{{ table.name }}</span>
      <br>
      <span class="text-xs text-500">رقم الطاولة</span>
    </div>

    <!-- السعة -->
    <div class="flex align-items-center justify-content-center gap-1">
      <i class="pi pi-users text-xs text-500" />
      <span class="text-xs text-500">{{ table.capacity }} كرسي</span>
    </div>

    <!-- معاينة الكراسي -->
    <div class="flex gap-1 flex-wrap justify-content-center">
      <div
        v-for="i in Math.min(table.capacity, 8)" :key="i"
        class="w-1rem h-1rem border-round-sm border-1"
        :class="table.status === 1 ? 'bg-orange-100 border-orange-300' : 'bg-surface-100 border-200'"
      />
      <span v-if="table.capacity > 8" class="text-xs text-500">+{{ table.capacity - 8 }}</span>
    </div>

    <!-- أزرار -->
    <div class="flex gap-1 justify-content-center">
      <Button
        icon="pi pi-pencil"
        severity="secondary"
        text rounded size="small"
        v-tooltip.top="'تعديل'"
        @click="emit('edit', table)"
      />
      <Button
        icon="pi pi-qrcode"
        severity="info"
        text rounded size="small"
        v-tooltip.top="'عرض QR'"
        @click="emit('qr', table)"
      />
      <Button
        icon="pi pi-trash"
        severity="danger"
        text rounded size="small"
        v-tooltip.top="'حذف'"
        @click="emit('delete', table)"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import type { AdminTable } from '../types/tables-admin.types'

const props = defineProps<{ table: AdminTable }>()
const emit  = defineEmits<{
  edit:   [table: AdminTable]
  delete: [table: AdminTable]
  qr:     [table: AdminTable]
}>()

const statusLabel = computed(() => {
  switch (props.table.status) {
    case 0: return 'متاحة'
    case 1: return 'مشغولة'
    case 2: return 'محجوزة'
    case 3: return 'مدمجة'
    default: return 'غير معروف'
  }
})

const statusSeverity = computed((): 'success' | 'warn' | 'info' | 'secondary' => {
  switch (props.table.status) {
    case 0: return 'success'
    case 1: return 'warn'
    case 2: return 'info'
    default: return 'secondary'
  }
})
</script>