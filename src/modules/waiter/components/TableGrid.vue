<template>
  <div class="flex flex-column gap-3">

    <!-- تبديل العرض -->
    <div class="flex justify-content-end gap-2">
      <Button
        icon="pi pi-th-large"
        :severity="viewMode === 'grid' ? 'primary' : 'secondary'"
        text
        rounded
        size="small"
        @click="viewMode = 'grid'"
        v-tooltip="'عرض شبكة'"
      />
      <Button
        icon="pi pi-list"
        :severity="viewMode === 'list' ? 'primary' : 'secondary'"
        text
        rounded
        size="small"
        @click="viewMode = 'list'"
        v-tooltip="'عرض مربعات كبيرة'"
      />
    </div>

    <!-- Grid: عرض صغير عمودين -->
    <div v-if="viewMode === 'grid'" class="grid m-0">
      <div
        v-for="table in tables"
        :key="table.id"
        class="col-12 sm:col-4 lg:col-3 p-2"
      >
        <TableCard :table="table" @click="emit('select', table)" />
      </div>
    </div>

    <!-- List: مربعات كبيرة عمود واحد -->
    <div v-else class="flex flex-column gap-3">
      <TableCardLarge
        v-for="table in tables"
        :key="table.id"
        :table="table"
        @click="emit('select', table)"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import TableCard from './TableCard.vue'
import TableCardLarge from './TableCardLarge.vue'
import type { Table } from '../types/waiter.types'

defineProps<{ tables: Table[] }>()
const emit = defineEmits<{ select: [table: Table] }>()

const viewMode = ref<'grid' | 'list'>('grid')
</script>