<template>
  <div
    class="surface-card border-round-xl border-1 overflow-hidden transition-all transition-duration-200 hover:shadow-3"
    :class="item.isAvailable ? 'border-200' : 'border-300 opacity-80'"
  >
    <!-- الصورة -->
    <div class="relative" style="height:110px; background:var(--p-surface-100)">
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.name"
        class="w-full h-full"
        style="object-fit:cover"
        @error="(e) => ((e.target as HTMLImageElement).src = '/defaultImages/defaultFood.jpeg')"
      />
      <div v-else class="w-full h-full relative">
        <img
          src="/defaultImages/defaultFood.jpeg"
          alt="صورة غير متوفرة"
          class="w-full h-full"
          style="object-fit:cover; opacity:0.4"
        />
        <span
          class="absolute text-xs font-medium text-600"
          style="top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(255,255,255,0.8);padding:2px 8px;border-radius:4px;white-space:nowrap"
        >
          لا توجد صورة
        </span>
      </div>

      <!-- badge الحالة فقط -->
      <div class="absolute top-0 left-0 m-2">
        <Tag
          :value="item.isAvailable ? 'متاح' : 'غير متاح'"
          :severity="item.isAvailable ? 'success' : 'secondary'"
          class="text-xs"
        />
      </div>
    </div>

    <!-- المعلومات -->
    <div class="px-3 py-2">
      <div class="flex align-items-start justify-content-between gap-2 mb-1">
        <span class="font-bold text-900 text-sm line-height-2">{{ item.name }}</span>

        <!-- أزرار الإجراءات الثلاثة -->
        <div class="flex gap-1 flex-shrink-0">
          <!-- تعديل -->
          <Button
            icon="pi pi-pencil"
            severity="secondary"
            text rounded size="small"
            v-tooltip="'تعديل'"
            @click="emit('edit', item)"
          />

          <!-- تفعيل / تعطيل -->
          <ConfirmPopup :group="`toggle-${item.id}`" />
          <Button
            :icon="toggling ? 'pi pi-spin pi-spinner' : (item.isAvailable ? 'pi pi-eye-slash' : 'pi pi-eye')"
            :severity="item.isAvailable ? 'warning' : 'success'"
            text rounded size="small"
            :disabled="toggling"
            v-tooltip="item.isAvailable ? 'تعطيل' : 'تفعيل'"
            @click="confirmToggle($event)"
          />

          <!-- حذف -->
          <Button
            icon="pi pi-trash"
            severity="danger"
            text rounded size="small"
            v-tooltip="'حذف'"
            @click="emit('delete', item)"
          />

          <!-- الخيارات -->
          <Button
            icon="pi pi-cog"
            severity="info"
            text rounded size="small"
            v-tooltip="'الخيارات'"
            @click="emit('options', item)"
          />
        </div>
      </div>

      <p
        v-if="item.description"
        class="text-xs text-500 m-0 mb-2"
        style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden"
      >
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
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ConfirmPopup from 'primevue/confirmpopup'
import type { MenuItem } from '../../../../types/menu.types'

const props = defineProps<{
  item:      MenuItem
  toggling?: boolean
}>()

const emit = defineEmits<{
  edit:    [item: MenuItem]
  options: [item: MenuItem]
  toggle:  [item: MenuItem]
  delete:  [item: MenuItem]
}>()

const confirm        = useConfirm()

function confirmToggle(event: MouseEvent) {
  confirm.require({
    target:  event.currentTarget as HTMLElement,
    group:   `toggle-${props.item.id}`,
    message: props.item.isAvailable
      ? `هل تريد تعطيل "${props.item.name}"؟`
      : `هل تريد تفعيل "${props.item.name}"؟`,
    icon:    props.item.isAvailable ? 'pi pi-eye-slash' : 'pi pi-eye',
    acceptLabel:  props.item.isAvailable ? 'تعطيل' : 'تفعيل',
    rejectLabel:  'إلغاء',
    acceptClass:  props.item.isAvailable ? 'p-button-warning p-button-sm' : 'p-button-success p-button-sm',
    rejectClass:  'p-button-secondary p-button-text p-button-sm',
    accept: () => emit('toggle', props.item),
  })
}
</script>