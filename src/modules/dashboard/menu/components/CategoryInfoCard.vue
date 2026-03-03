<template>
  <div class="surface-card border-round-xl border-1 border-200 p-3 mx-3 mt-3">
    <div class="flex align-items-center gap-3">

      <!-- صورة الفئة -->
      <div class="border-round-lg overflow-hidden flex-shrink-0"
        style="width:64px; height:64px; background:var(--p-surface-100)">
        <img v-if="category.image" :src="category.image" :alt="category.name"
          class="w-full h-full" style="object-fit:cover" />
        <div v-else class="w-full h-full flex align-items-center justify-content-center">
          <i class="pi pi-image text-2xl text-300" />
        </div>
      </div>

      <!-- معلومات -->
      <div class="flex-1">
        <div class="flex align-items-center gap-2 mb-1">
          <span class="font-bold text-900 text-lg">{{ category.name }}</span>
          <Tag
            :value="category.isActive ? 'فعّال' : 'معطّل'"
            :severity="category.isActive ? 'success' : 'secondary'"
            class="text-xs"
          />
        </div>
        <div class="flex align-items-center gap-3">
          <span class="text-xs text-500">
            <i class="pi pi-list ml-1" />
            {{ category.menuItems?.length ?? 0 }} مادة
          </span>
          <span v-if="category.printerId" class="text-xs text-500">
            <i class="pi pi-print ml-1" />
            طابعة {{ category.printerId }}
          </span>
        </div>
      </div>

      <!-- أزرار -->
      <div class="flex gap-1">
        <Button
          :icon="category.isActive ? 'pi pi-eye-slash' : 'pi pi-eye'"
          :severity="category.isActive ? 'warning' : 'success'"
          text rounded size="small"
          v-tooltip="category.isActive ? 'تعطيل' : 'تفعيل'"
          :loading="toggling"
          @click="emit('toggle')"
        />
        <Button
          icon="pi pi-pencil"
          severity="secondary"
          text rounded size="small"
          v-tooltip="'تعديل'"
          @click="emit('edit')"
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          text rounded size="small"
          v-tooltip="'حذف'"
          @click="emit('delete')"
        />
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
  edit:   []
  delete: []
  toggle: []
}>()
</script>