<template>
  <div class="grid m-0">
    <div v-for="cat in categories" :key="cat.id" class="col-12 sm:col-6 lg:col-4 p-2">
      <CategoryCard
        :category="cat"
        :toggling="togglingId === cat.id"
        @select="emit('select', cat)"
        @edit="emit('edit', cat)"
        @delete="emit('delete', cat)"
        @toggle="emit('toggle', cat)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CategoryCard from './CategoryCard.vue'
import type { MenuCategory } from '../../../../types/menu.types'

defineProps<{ categories: MenuCategory[]; togglingId?: number | null }>()
const emit = defineEmits<{
  select: [cat: MenuCategory]
  edit:   [cat: MenuCategory]
  delete: [cat: MenuCategory]
  toggle: [cat: MenuCategory]
}>()
</script>