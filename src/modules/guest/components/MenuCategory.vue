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
          <img
            :src="category.image ?? '/defaultImages/defaultFood.jpeg'"
            :alt="category.name"
            style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover;"
            @error="(e) => ((e.target as HTMLImageElement).src = '/defaultImages/defaultFood.jpeg')"
          />
          <span class="text-sm">{{ category.name }}</span>
        </span>
      </template>
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import type { MenuCategoryApi } from '../../../types/api.types'

defineProps<{
  categories: MenuCategoryApi[]
  selectedId: number | null
}>()

defineEmits<{
  select: [id: number]
}>()
</script>