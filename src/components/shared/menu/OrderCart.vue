<template>
  <!-- Bottom Bar -->
  <div class="surface-card border-top-1 surface-border px-4 py-3">
    <div class="flex align-items-center justify-content-between gap-3">
      <div
        class="flex align-items-center gap-2 cursor-pointer"
        @click="drawerOpen = true"
      >
        <Badge v-if="totalItems > 0" :value="totalItems" />
        <span class="text-color-secondary text-sm">الإجمالي</span>
        <span class="font-bold text-lg">{{ totalPrice }} د.ع</span>
        <i v-if="items.length > 0" class="pi pi-angle-up" />
      </div>
      <Button
        label="تأكيد الطلب"
        icon="pi pi-check"
        :disabled="items.length === 0"
        @click="$emit('confirm')"
      />
    </div>
  </div>

  <!-- Drawer -->
  <Drawer
    v-model:visible="drawerOpen"
    position="bottom"
    style="height: auto; max-height: 70vh; border-radius: 1rem 1rem 0 0;"
    :modal="true"
    :dismissable="true"
  >
    <template #header>
      <div class="flex align-items-center gap-2">
        <i class="pi pi-shopping-cart" />
        <span class="font-bold text-lg">سلة الطلبات</span>
        <Badge :value="totalItems" />
      </div>
    </template>

    <!-- Empty -->
    <div v-if="items.length === 0" class="text-center py-6">
      <i class="pi pi-inbox text-4xl text-color-secondary mb-2 block" />
      <p class="text-color-secondary text-sm">لم تضف أي طلب بعد</p>
    </div>

    <!-- Items -->
    <div v-else class="flex flex-column gap-2 mb-3">
      <div
        v-for="cartItem in items"
        :key="cartItem.menuItem.id"
        class="flex align-items-center justify-content-between border-round-lg p-3 border-1 surface-border"
      >
        <div class="flex align-items-center gap-3">

          <!-- Image with fallback -->
          <div class="flex-shrink-0 relative" style="width: 44px; height: 44px;">
            <img
              :src="cartItem.menuItem.image ?? '/defaultImages/defaultFood.jpeg'"
              :alt="cartItem.menuItem.name"
              class="w-full h-full border-round"
              style="object-fit: cover;"
              @error="(e) => ((e.target as HTMLImageElement).src = '/defaultImages/defaultFood.jpeg')"
            />
            <div
              v-if="!cartItem.menuItem.isAvailable"
              class="absolute top-0 left-0 w-full h-full flex align-items-center justify-content-center border-round"
              style="background: rgba(0,0,0,0.5);"
            >
              <Tag value="غير متاح" severity="secondary" class="text-xs" />
            </div>
          </div>

          <div>
            <p class="m-0 font-semibold text-sm">{{ cartItem.menuItem.name }}</p>
            <p class="m-0 text-xs font-medium mt-1">
              {{ cartItem.menuItem.price * cartItem.quantity }} د.ع
            </p>
          </div>
        </div>

        <div class="flex align-items-center gap-1">
          <Button icon="pi pi-minus" rounded text size="small" @click="$emit('decrease', cartItem.menuItem.id)" />
          <span class="font-bold w-2rem text-center">{{ cartItem.quantity }}</span>
          <Button icon="pi pi-plus" rounded text size="small" @click="$emit('increase', cartItem.menuItem.id)" />
        </div>
      </div>
    </div>

    <!-- Total + Confirm -->
    <Divider />
    <div class="flex align-items-center justify-content-between mb-3">
      <span class="text-color-secondary font-medium">الإجمالي</span>
      <span class="font-bold text-xl">{{ totalPrice }} د.ع</span>
    </div>
    <Button
      label="تأكيد الطلب"
      icon="pi pi-check"
      class="w-full"
      :disabled="items.length === 0"
      @click="onConfirm"
    />
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Divider from 'primevue/divider'
import Drawer from 'primevue/drawer'
import Tag from 'primevue/tag'
import type { CartItem } from '../../../types/menu.types'

const props = defineProps<{
  items: CartItem[]
}>()

const emit = defineEmits<{
  increase: [id: number]
  decrease: [id: number]
  confirm: []
}>()

const drawerOpen = ref(false)

defineExpose({ closeDrawer: () => { drawerOpen.value = false } })

const totalItems = computed(() =>
  props.items.reduce((sum, i) => sum + i.quantity, 0)
)

const totalPrice = computed(() =>
  props.items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0)
)

function onConfirm() {
  drawerOpen.value = false
  emit('confirm')
}
</script>