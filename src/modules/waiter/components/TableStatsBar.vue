<template>
  <div class="flex gap-2 overflow-x-auto pb-1">

    <div
      class="flex align-items-center gap-2 px-3 py-2 border-round-xl border-1 transition-all transition-duration-200 cursor-pointer flex-shrink-0"
      :class="activeFilter === 'available'
        ? 'bg-green-100 border-green-400'
        : 'surface-card border-transparent shadow-1'"
      @click="emit('filter', 'available')"
    >
      <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width:2rem; height:2rem">
        <i class="pi pi-check-circle text-green-600"></i>
      </div>
      <div class="flex flex-column">
        <span class="text-2xs text-500">متاحة</span>
        <span class="text-lg font-bold text-900 line-height-1">{{ available }}</span>
      </div>
    </div>

    <div
      class="flex align-items-center gap-2 px-3 py-2 border-round-xl border-1 transition-all transition-duration-200 cursor-pointer flex-shrink-0"
      :class="activeFilter === 'occupied'
        ? 'bg-red-100 border-red-400'
        : 'surface-card border-transparent shadow-1'"
      @click="emit('filter', 'occupied')"
    >
      <div class="flex align-items-center justify-content-center bg-red-100 border-round" style="width:2rem; height:2rem">
        <i class="pi pi-users text-red-600"></i>
      </div>
      <div class="flex flex-column">
        <span class="text-2xs text-500">مشغولة</span>
        <span class="text-lg font-bold text-900 line-height-1">{{ occupied }}</span>
      </div>
    </div>

    <div
      class="flex align-items-center gap-2 px-3 py-2 border-round-xl border-1 transition-all transition-duration-200 cursor-pointer flex-shrink-0"
      :class="activeFilter === 'reserved'
        ? 'bg-orange-100 border-orange-400'
        : 'surface-card border-transparent shadow-1'"
      @click="emit('filter', 'reserved')"
    >
      <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2rem; height:2rem">
        <i class="pi pi-calendar text-orange-600"></i>
      </div>
      <div class="flex flex-column">
        <span class="text-2xs text-500">محجوزة</span>
        <span class="text-lg font-bold text-900 line-height-1">{{ reserved }}</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Table } from '../types/waiter.types'

defineProps<{
  available: number
  occupied: number
  reserved: number
  activeFilter: Table['status'] | null
}>()

const emit = defineEmits<{ filter: [status: Table['status']] }>()
</script>