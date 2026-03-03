<template>
  <div
    class="surface-card border-round-xl border-1 overflow-hidden cursor-pointer transition-all transition-duration-200 hover:shadow-3"
    :class="category.isActive ? 'border-200' : 'border-300'"
    @click="emit('select', category)"
  >
    <div class="relative" style="height: 120px; background: var(--p-surface-100)">
      <img v-if="category.image" :src="category.image" :alt="category.name"
        class="w-full h-full" style="object-fit: cover" />
      <div v-else class="w-full h-full flex align-items-center justify-content-center">
        <i class="pi pi-image text-4xl text-300" />
      </div>
      <div class="absolute top-0 left-0 m-2">
        <Tag :value="category.isActive ? 'فعّال' : 'معطّل'"
          :severity="category.isActive ? 'success' : 'secondary'" class="text-xs" />
      </div>
    </div>

    <div class="px-3 py-2">
      <div class="flex align-items-center justify-content-between mb-1">
        <span class="font-bold text-900" :class="{ 'text-400': !category.isActive }">
          {{ category.name }}
        </span>
        <div class="flex gap-1" @click.stop>
          <Button :icon="category.isActive ? 'pi pi-eye-slash' : 'pi pi-eye'"
            :severity="category.isActive ? 'warning' : 'success'"
            text rounded size="small" :loading="toggling"
            v-tooltip="category.isActive ? 'تعطيل' : 'تفعيل'"
            @click="emit('toggle', category)" />
          <Button icon="pi pi-pencil" severity="secondary" text rounded size="small"
            v-tooltip="'تعديل'" @click="emit('edit', category)" />
          <Button icon="pi pi-trash" severity="danger" text rounded size="small"
            v-tooltip="'حذف'" @click="emit('delete', category)" />
        </div>
      </div>
      <div class="flex align-items-center justify-content-between">
        <span class="text-xs text-500">
          <i class="pi pi-list ml-1" />{{ category.menuItems?.length ?? 0 }} مادة
        </span>
        <span v-if="category.printerId" class="text-xs text-500">
          <i class="pi pi-print ml-1" />طابعة {{ category.printerId }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import type { MenuCategory } from '../../../../types/menu.types'

defineProps<{ category: MenuCategory; toggling?: boolean }>()
const emit = defineEmits<{
  select: [cat: MenuCategory]
  edit:   [cat: MenuCategory]
  delete: [cat: MenuCategory]
  toggle: [cat: MenuCategory]
}>()
</script>