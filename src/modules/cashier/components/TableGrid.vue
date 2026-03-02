<template>
  <div class="grid m-0">
    <div
      v-for="table in tables"
      :key="table.id"
      class="col-12 sm:col-6 lg:col-4 xl:col-2 p-2"
    >
      <TableCard :table="table" @click="emit('select', table)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TableCard from './TableCard.vue'
import type { CashierTable } from '../types/cashier.types'

defineProps<{ tables: CashierTable[] }>()
const emit = defineEmits<{ select: [table: CashierTable] }>()
</script>