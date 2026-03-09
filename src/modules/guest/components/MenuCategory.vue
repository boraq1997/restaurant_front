<template>
  <div
    class="flex gap-2 overflow-x-auto py-1"
    style="scrollbar-width: none; -webkit-overflow-scrolling: touch;"
  >
    <button
      v-for="category in categories"
      :key="category.id"
      class="category-btn flex-shrink-0 flex flex-column align-items-center gap-1 border-none cursor-pointer transition-all"
      :class="selectedId === category.id ? 'category-btn--active' : 'category-btn--inactive'"
      style="min-width: 64px; max-width: 80px; padding: 8px 6px; border-radius: 14px; background: transparent;"
      @click="$emit('select', category.id)"
    >
      <!-- الصورة الدائرية -->
      <div
        class="flex align-items-center justify-content-center border-round-full overflow-hidden"
        :class="selectedId === category.id ? 'ring-active' : 'ring-inactive'"
        style="width: 48px; height: 48px; flex-shrink: 0;"
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
        class="text-center line-height-1 font-medium"
        :class="selectedId === category.id ? 'text-primary' : 'text-color-secondary'"
        style="font-size: 11px; max-width: 72px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
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

<style scoped>
.category-btn { -webkit-tap-highlight-color: transparent; }

.category-btn--active  { opacity: 1; }
.category-btn--inactive { opacity: 0.65; }
.category-btn--inactive:active { opacity: 1; transform: scale(0.95); }

.ring-active {
  outline: 2.5px solid var(--primary-color);
  outline-offset: 2px;
}
.ring-inactive {
  outline: 2px solid transparent;
}
</style>