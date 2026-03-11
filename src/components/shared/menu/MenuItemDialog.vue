<!-- src/components/shared/menu/MenuItemDialog.vue -->
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
        v-if="item.image"
        :src="item.image"
        :alt="item.name"
        class="w-full border-round-lg mb-3"
        style="height: 200px; object-fit: cover;"
        @error="(e) => ((e.target as HTMLImageElement).src = '/defaultImages/defaultFood.jpeg')"
      />

      <!-- Description -->
      <p v-if="item.description" class="text-color-secondary text-sm line-height-3 mb-4 m-0">
        {{ item.description }}
      </p>

      <!-- Options (menuOptions من الـ API) -->
      <div v-if="item.menuOptions?.length" class="mb-4">
        <p class="font-bold text-sm mb-2 m-0 text-color">الخيارات والإضافات</p>
        <div class="flex flex-column gap-2">
          <div
            v-for="option in item.menuOptions"
            :key="option.id"
            class="flex align-items-center justify-content-between surface-card border-round-lg px-3 py-2 border-1 cursor-pointer transition-all"
            :class="isSelected(option.id) ? 'border-primary bg-primary-50' : 'surface-border'"
            @click="toggleOption(option)"
          >
            <div class="flex align-items-center gap-2">
              <Checkbox
                :modelValue="isSelected(option.id)"
                @update:modelValue="toggleOption(option)"
                binary
              />
              <span class="text-sm text-color">{{ option.name }}</span>
            </div>
            <span class="text-xs font-medium" :class="option.price > 0 ? 'text-primary' : 'text-color-secondary'">
              {{ option.price > 0 ? `+${option.price} د.ع` : 'مجاني' }}
            </span>
          </div>
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

      <!-- Quantity -->
      <div class="flex align-items-center justify-content-between mb-2">
        <p class="font-bold text-sm m-0 text-color">الكمية</p>
        <div class="flex align-items-center gap-3">
          <Button icon="pi pi-minus" rounded outlined size="small" @click="qty > 1 && qty--" />
          <span class="font-bold text-lg w-2rem text-center">{{ qty }}</span>
          <Button icon="pi pi-plus" rounded size="small" @click="qty++" />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex align-items-center justify-content-between w-full">
        <span class="font-bold text-primary text-lg">{{ totalPrice }} د.ع</span>
        <Button label="إضافة للسلة" icon="pi pi-shopping-cart" @click="addToCart" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Textarea from 'primevue/textarea'
import type { MenuItemApi, MenuOptionApi } from '../../../types/api.types'

export interface CartItemLocal {
  menuItem: MenuItemApi
  quantity: number
  selectedOptions: MenuOptionApi[]
  note: string
}

const props = defineProps<{
  modelValue: boolean
  item: MenuItemApi | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  add: [cartItem: CartItemLocal]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const selectedOptions = ref<MenuOptionApi[]>([])
const note = ref('')
const qty = ref(1)

// إعادة تعيين عند تغيير المنتج
watch(() => [props.item, props.modelValue], ([, isVisible]) => {
  if (isVisible) {
    selectedOptions.value = []
    note.value = ''
    qty.value = 1
  }
})

const totalPrice = computed(() => {
  if (!props.item) return 0
  const optionsTotal = selectedOptions.value.reduce((s, o) => s + o.price, 0)
  return (props.item.price + optionsTotal) * qty.value
})

function isSelected(id: number) {
  return selectedOptions.value.some(o => o.id === id)
}

function toggleOption(option: MenuOptionApi) {
  const idx = selectedOptions.value.findIndex(o => o.id === option.id)
  if (idx === -1) selectedOptions.value.push(option)
  else selectedOptions.value.splice(idx, 1)
}

function addToCart() {
  if (!props.item) return
  emit('add', {
    menuItem:        props.item,
    quantity:        qty.value,
    selectedOptions: [...selectedOptions.value],
    note:            note.value,
  })
  // ✅ إعادة تعيين بعد الإضافة
  selectedOptions.value = []
  note.value = ''
  qty.value = 1
  visible.value = false
}
</script>