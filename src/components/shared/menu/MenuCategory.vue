<template>
  <div class="flex gap-2 overflow-x-auto pb-1" style="scrollbar-width: none;">
    <Button
      v-for="category in categories"
      :key="category.id"
      :outlined="selectedId !== category.id"
      rounded
      size="small"
      @click="$emit('select', category.id)"
      style="white-space: nowrap; flex-shrink: 0;"
    >
      <template #default>
        <span class="flex align-items-center gap-1">
          <span>{{ category.icon }}</span>
          <span class="text-sm">{{ category.name }}</span>
        </span>
      </template>
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import type { MenuCategory } from '../../../types/menu.types'

defineProps<{
  categories: MenuCategory[]
  selectedId: number
}>()

defineEmits<{
  select: [id: number]
}>()
</script>