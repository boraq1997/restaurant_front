<template>
  <div
    class="surface-card border-round-xl border-1 surface-border overflow-hidden cursor-pointer"
    style="box-shadow: 0 2px 8px rgba(0,0,0,0.06);"
    @click="$emit('open', item)"
  >
    <div class="flex gap-0">
      <div class="flex-shrink-0 relative" style="width: 110px; height: 110px;">
        <img
          :src="item.image ?? '/defaultImages/defaultFood.jpeg'"
          :alt="item.name"
          class="w-full h-full"
          style="object-fit: cover;"
          @error="onImageError"
        />
        <div
          v-if="!item.isAvailable"
          class="absolute top-0 left-0 w-full h-full flex align-items-center justify-content-center"
          style="background: rgba(0,0,0,0.5);"
        >
          <Tag value="غير متاح" severity="secondary" class="text-xs" />
        </div>
      </div>
      <div class="flex-1 flex flex-column justify-content-between p-3">
        <div>
          <span class="font-bold text-base block mb-1">{{ item.name }}</span>
          <p class="text-color-secondary text-xs m-0 line-height-3">{{ item.description }}</p>
        </div>
        <div class="flex align-items-center justify-content-between mt-2">
          <span class="text-primary font-bold text-base">{{ item.price }} د.ع</span>
          <Button
            icon="pi pi-plus"
            rounded
            size="small"
            :disabled="!item.isAvailable"
            @click.stop="$emit('open', item)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import type { MenuItem } from '../../../types/menu.types'

defineProps<{
  item: MenuItem
}>()

defineEmits<{
  open: [item: MenuItem]
}>()

function onImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = 'https://placehold.co/110x110?text=صورة'
}
</script>