<template>
  <div
    class="surface-card border-round-xl border-1 overflow-hidden transition-all transition-duration-200 hover:shadow-3"
    :class="item.isAvailable ? 'border-200' : 'border-300'"
  >
    <div class="relative" style="height:110px; background:var(--p-surface-100)">
      <img v-if="item.image" :src="item.image" :alt="item.name"
        class="w-full h-full" style="object-fit:cover" />
      <div v-else class="w-full h-full flex align-items-center justify-content-center">
        <i class="pi pi-image text-4xl text-300" />
      </div>
      <div class="absolute top-0 left-0 m-2">
        <Tag :value="item.isAvailable ? 'متاح' : 'غير متاح'"
          :severity="item.isAvailable ? 'success' : 'secondary'" class="text-xs" />
      </div>
    </div>

    <div class="px-3 py-2">
      <div class="flex align-items-start justify-content-between gap-2 mb-1">
        <span class="font-bold text-900 text-sm">{{ item.name }}</span>
        <div class="flex gap-1 flex-shrink-0">
          <Button icon="pi pi-pencil" severity="secondary" text rounded size="small"
            v-tooltip="'تعديل'" @click="emit('edit', item)" />
          <Button icon="pi pi-cog" severity="info" text rounded size="small"
            v-tooltip="'الخيارات'" @click="emit('options', item)" />
        </div>
      </div>
      <p v-if="item.description" class="text-xs text-500 m-0 mb-2"
        style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
        {{ item.description }}
      </p>
      <div class="flex align-items-center justify-content-between">
        <span class="font-bold text-primary text-sm">{{ item.price?.toLocaleString() }} د.ع</span>
        <span v-if="item.cost" class="text-xs text-500">
          تكلفة: {{ item.cost?.toLocaleString() }}
        </span>
      </div>
      <div v-if="item.menuOptions?.length" class="mt-1">
        <span class="text-xs text-500">
          <i class="pi pi-list ml-1" />{{ item.menuOptions.length }} خيار
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import type { MenuItem } from '../../../../types/menu.types'

defineProps<{ item: MenuItem }>()
const emit = defineEmits<{
  edit:    [item: MenuItem]
  options: [item: MenuItem]
}>()
</script>