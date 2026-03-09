<template>
  <div
    class="flex gap-2 overflow-x-auto pb-1"
    style="scrollbar-width: none; -webkit-overflow-scrolling: touch;"
  >
    <button
      v-for="category in categories"
      :key="category.id"
      class="flex-shrink-0 flex flex-column align-items-center gap-1 border-none cursor-pointer p-0"
      style="-webkit-tap-highlight-color: transparent; background: transparent;"
      @click="$emit('select', category.id)"
    >
      <!-- المربع -->
      <div
        style="width: 60px; height: 60px; border-radius: 12px; overflow: hidden; transition: outline 0.15s;"
        :style="selectedId === category.id
          ? 'outline: 2.5px solid var(--primary-color);'
          : 'outline: 2px solid #e2e8f0;'"
      >
        <img
          :src="getImage(category.image)"
          :alt="category.name"
          style="width: 100%; height: 100%; object-fit: cover; display: block;"
          @error="(e) => ((e.target as HTMLImageElement).src = DEFAULT_IMAGE)"
        />
      </div>

      <!-- الاسم -->
      <span
        style="font-size: 11px; max-width: 64px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        :style="selectedId === category.id ? 'color: var(--primary-color); font-weight: 600;' : 'color: #64748b;'"
      >
        {{ category.name }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { MenuCategoryApi } from '../../../types/api.types'

defineProps<{
  categories: MenuCategoryApi[]
  selectedId: number | null
}>()

defineEmits<{
  select: [id: number]
}>()

const DEFAULT_IMAGE = '/defaultImages/defaultFood.jpeg'

function getImage(image: string | null | undefined): string {
  if (!image || image.trim() === '') return DEFAULT_IMAGE
  return image
}
</script>