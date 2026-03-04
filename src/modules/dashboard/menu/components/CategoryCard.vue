<template>
  <div
    class="surface-card border-round-xl border-1 overflow-hidden cursor-pointer transition-all transition-duration-200 hover:shadow-3"
    :class="category.isActive ? 'border-200' : 'border-300'"
    @click="emit('select', category)"
  >
    <div class="relative" style="height: 120px; background: var(--p-surface-100)">
      <img
        v-if="category.image"
        :src="category.image"
        :alt="category.name"
        class="w-full h-full"
        style="object-fit: cover"
        @error="(e) => ((e.target as HTMLImageElement).src = '/defaultImages/defaultFood.jpeg')"
      />
      <div v-else class="w-full h-full flex flex-column align-items-center justify-content-center gap-2">
        <img
          src="/defaultImages/defaultFood.jpeg"
          alt="صورة غير متوفرة"
          class="w-full h-full"
          style="object-fit: cover; opacity: 0.4;"
        />
        <span
          class="absolute text-xs font-medium text-600"
          style="background: rgba(255,255,255,0.8); padding: 2px 8px; border-radius: 4px;"
        >
          لا توجد صورة
        </span>
      </div>

      <div class="absolute top-0 left-0 m-2">
        <Tag :value="category.isActive ? 'فعّال' : 'معطّل'"
          :severity="category.isActive ? 'success' : 'warn'" class="text-xs" />
      </div>
    </div>

    <div class="px-3 py-2">
      <div class="flex align-items-center justify-content-between mb-1">
        <span class="font-bold text-900" :class="{ 'text-400': !category.isActive }">
          {{ category.name }}
        </span>
        <div class="flex gap-1" @click.stop>

          <Button
            :icon="category.isActive ? 'pi pi-eye-slash' : 'pi pi-eye'"
            :severity="category.isActive ? 'warning' : 'success'"
            text rounded size="small" :loading="toggling"
            v-tooltip="category.isActive ? 'تعطيل' : 'تفعيل'"
            @click="toggleConfirmVisible=true"
            
          />

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

  <!-- Toggle Confirm Dialog -->
  <Dialog
    v-model:visible="toggleConfirmVisible"
    :modal="true"
    :draggable="false"
    :closable="!toggling"
    :style="{ width: '320px' }"
    dir="rtl"
  >
    <template #container>
      <div class="confirm-dialog">

        <div class="icon-wrap">
          <div class="icon-ring" :style="{ background: category.isActive ? 'var(--p-orange-100)' : 'var(--p-green-100)' }">
            <i
              :class="category.isActive ? 'pi pi-eye-slash' : 'pi pi-eye'"
              :style="{ color: category.isActive ? 'var(--p-orange-500)' : 'var(--p-green-500)' }"
            />
          </div>
        </div>

        <p class="dialog-title">{{ category.isActive ? 'تأكيد التعطيل' : 'تأكيد التفعيل' }}</p>
        <p class="dialog-message">{{ category.isActive ? 'هل تريد تعطيل هذا الصنف؟' : 'هل تريد تفعيل هذا الصنف؟' }}</p>

        <div class="dialog-actions">
          <Button
            label="إلغاء"
            severity="secondary"
            outlined
            class="flex-1"
            :disabled="toggling"
            @click="toggleConfirmVisible = false"
          />
          <Button
            :label="category.isActive ? 'تعطيل' : 'تفعيل'"
            :severity="category.isActive ? 'warning' : 'success'"
            class="flex-1"
            :loading="toggling"
            @click="emit('toggle', category); toggleConfirmVisible = false"
          />
        </div>

      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import type { MenuCategory } from '../../../../types/menu.types'

defineProps<{ category: MenuCategory; toggling?: boolean }>()
const emit = defineEmits<{
  select: [cat: MenuCategory]
  edit:   [cat: MenuCategory]
  delete: [cat: MenuCategory]
  toggle: [cat: MenuCategory]
}>()

const toggleConfirmVisible = ref(false)
</script>

<style scoped>
.confirm-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem 1.5rem;
  border-radius: 16px;
  background: var(--p-surface-0);
  text-align: center;
}

.icon-wrap {
  margin-bottom: 1.25rem;
}

.icon-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}

.icon-ring i {
  font-size: 1.75rem;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.1); }
  50%       { box-shadow: 0 0 0 10px rgba(0,0,0,0); }
}

.dialog-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--p-text-color);
  margin: 0 0 0.4rem;
}

.dialog-message {
  font-size: 0.9rem;
  color: var(--p-text-muted-color);
  margin: 0 0 1.5rem;
  line-height: 1.6;
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}
</style>