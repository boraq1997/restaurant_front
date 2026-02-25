<template>
  <Dialog
  v-model:visible="visible"
  :header="item?.name"
  position="bottom"
  :modal="true"
  :draggable="false"
  style="width: 100%; max-width: 600px; border-radius: 1rem 1rem 0 0; margin: 0;"
  :pt="{
    root: { class: 'surface-card' },
    header: { class: 'surface-card text-color' },
    content: { class: 'surface-card' },
    footer: { class: 'surface-card' },
  }"
>
    <template v-if="item">

      <!-- Image -->
      <img
        :src="item.image"
        :alt="item.name"
        class="w-full border-round-lg mb-3"
        style="height: 200px; object-fit: cover;"
        @error="onImageError"
      />

      <!-- Description -->
      <p class="text-color-secondary text-sm line-height-3 mb-4 m-0">
        {{ item.description }}
      </p>

      <!-- Sizes -->
      <div v-if="item.sizes?.length" class="mb-4">
        <p class="font-bold text-sm mb-2 m-0 text-color">الحجم</p>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="size in item.sizes"
            :key="size.id"
            @click="selectedSize = size"
            :class="[
                'cursor-pointer border-round-lg px-3 py-2 border-1 text-sm transition-all',
                selectedSize?.id === size.id
                ? 'border-primary bg-primary text-white font-bold'
                : 'surface-border surface-card text-color-secondary'
            ]"
            >
            {{ size.name }}
            <span v-if="size.price > 0" class="text-xs"> +{{ size.price }} د.ع</span>
          </div>
        </div>
      </div>

      <!-- Extras -->
      <div v-if="item.extras?.length" class="mb-4">
        <p class="font-bold text-sm mb-2 m-0 text-color">إضافات</p>
        <div class="flex flex-column gap-2">
          <div
            v-for="extra in item.extras"
            :key="extra.id"
            class="flex align-items-center justify-content-between surface-card border-round-lg px-3 py-2 border-1 surface-border"
            >
            <div class="flex align-items-center gap-2">
              <Checkbox
                :modelValue="isExtraSelected(extra.id)"
                @update:modelValue="toggleExtra(extra)"
                binary
              />
              <span class="text-sm">{{ extra.name }}</span>
            </div>
            <span v-if="extra.price > 0" class="text-xs text-primary font-medium">
              +{{ extra.price }} د.ع
            </span>
            <span v-else class="text-xs text-color-secondary">مجاني</span>
          </div>
        </div>
      </div>

      <!-- Removable -->
      <div v-if="item.removable?.length" class="mb-4">
        <p class="font-bold text-sm mb-2 m-0 text-color">إزالة مكونات</p>
        <div class="flex flex-wrap gap-2">
          <Chip
  v-for="r in item.removable"
  :key="r.id"
  :label="r.name"
  :class="[
    'cursor-pointer text-sm transition-all',
    isRemoved(r.id) ? 'bg-red-500 text-0' : 'surface-card'
  ]"
  :icon="isRemoved(r.id) ? 'pi pi-times' : 'pi pi-minus'"
  @click="toggleRemove(r)"
/>
        </div>
      </div>

      <!-- Note -->
      <div class="mb-4">
        <p class="font-bold text-sm mb-2 m-0 text-color">ملاحظة</p>
        <Textarea
          v-model="note"
          placeholder="أي تعليمات خاصة..."
          class="w-full"
          rows="2"
          autoResize
        />
      </div>

    </template>

    <template #footer>
      <div class="flex align-items-center justify-content-between w-full">
        <span class="font-bold text-primary text-lg">{{ totalPrice }} د.ع</span>
        <Button
          label="إضافة للسلة"
          icon="pi pi-shopping-cart"
          @click="addToCart"
        />
      </div>
    </template>

  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Chip from 'primevue/chip'
import Textarea from 'primevue/textarea'
import type { MenuItem, MenuItemSize, MenuItemExtra, MenuItemRemovable, CartItem, CartItemExtra } from '../../../types/menu.types'

const props = defineProps<{
  modelValue: boolean
  item: MenuItem | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  add: [cartItem: CartItem]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const selectedSize = ref<MenuItemSize | null>(null)
const selectedExtras = ref<CartItemExtra[]>([])
const removedItems = ref<MenuItemRemovable[]>([])
const note = ref('')

// reset عند فتح dialog جديد
watch(() => props.item, () => {
  selectedSize.value = props.item?.sizes?.[0] ?? null
  selectedExtras.value = []
  removedItems.value = []
  note.value = ''
})

const totalPrice = computed(() => {
  if (!props.item) return 0
  let total = props.item.price
  if (selectedSize.value) total += selectedSize.value.price
  selectedExtras.value.forEach(e => total += e.extra.price * e.quantity)
  return total
})

function isExtraSelected(id: number) {
  return selectedExtras.value.some(e => e.extra.id === id)
}

function toggleExtra(extra: MenuItemExtra) {
  const index = selectedExtras.value.findIndex(e => e.extra.id === extra.id)
  if (index === -1) {
    selectedExtras.value.push({ extra, quantity: 1 })
  } else {
    selectedExtras.value.splice(index, 1)
  }
}

function isRemoved(id: number) {
  return removedItems.value.some(r => r.id === id)
}

function toggleRemove(item: MenuItemRemovable) {
  const index = removedItems.value.findIndex(r => r.id === item.id)
  if (index === -1) {
    removedItems.value.push(item)
  } else {
    removedItems.value.splice(index, 1)
  }
}

function addToCart() {
  if (!props.item) return
  emit('add', {
    menuItem: props.item,
    quantity: 1,
    selectedSize: selectedSize.value ?? undefined,
    selectedExtras: selectedExtras.value.length ? selectedExtras.value : undefined,
    removedItems: removedItems.value.length ? removedItems.value : undefined,
    note: note.value || undefined,
  })
  visible.value = false
}

function onImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = 'https://placehold.co/600x200?text=صورة'
}
</script>