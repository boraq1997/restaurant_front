<template>
  <div class="min-h-screen surface-ground" dir="rtl">

    <!-- Header -->
<div class="surface-card shadow-1 px-4 py-3 sticky top-0 z-5">
  <div class="flex align-items-center justify-content-between">
    <div class="flex align-items-center gap-3">
      <div class="w-3rem h-3rem border-round-lg surface-hover flex align-items-center justify-content-center text-2xl border-1 surface-border">
        🍽️
      </div>
      <div>
        <p class="font-bold text-lg m-0">مطعمنا</p>
        <div class="flex align-items-center gap-2 mt-1">
          <span class="text-color-secondary text-sm">{{ table?.name }} · طاولة {{ table?.number }}</span>
        </div>
      </div>
    </div>
    <!-- <Tag value="مفتوح الآن" severity="success" icon="pi pi-circle-fill" /> -->
          <Tag :value="statusLabel" :severity="statusSeverity" class="text-xs" />

  </div>

  <!-- Reservation Info -->
  <div
    v-if="table?.reservation"
    class="mt-3 p-2 border-round-lg border-1 surface-border bg-orange-100"
  >
    <div class="flex align-items-center gap-2 mb-2">
      <i class="pi pi-calendar text-orange-500 text-xs" />
      <span class="text-xs font-bold text-orange-500">حجز مسبق</span>
    </div>
    <div class="flex flex-wrap gap-3">
      <div class="flex align-items-center gap-1">
        <i class="pi pi-user text-color-secondary text-xs" />
        <span class="text-xs text-color-secondary">{{ table.reservation.guestName }}</span>
      </div>
      <div class="flex align-items-center gap-1">
        <i class="pi pi-clock text-color-secondary text-xs" />
        <span class="text-xs text-color-secondary">{{ table.reservation.time }}</span>
      </div>
      <div class="flex align-items-center gap-1">
        <i class="pi pi-users text-color-secondary text-xs" />
        <span class="text-xs text-color-secondary">{{ table.reservation.guestCount }} أشخاص</span>
      </div>
    </div>
  </div>
</div>

    <!-- Table Not Found -->
    <div v-if="!table" class="flex flex-column align-items-center justify-content-center py-8 gap-3">
      <i class="pi pi-exclamation-triangle text-5xl text-yellow-500" />
      <p class="text-color-secondary">الطاولة غير موجودة</p>
    </div>

    <template v-else>

      <!-- Table Details Card -->

      <!-- Categories -->
      <div class="px-3 pt-3">
        <Card class="w-full">
          <template #content>
            <MenuCategory
              :categories="categories"
              :selected-id="selectedCategoryId"
              @select="selectedCategoryId = $event"
            />
          </template>
        </Card>
      </div>

      <!-- Menu Items -->
      <div class="px-3 py-3 flex flex-column gap-3" style="padding-bottom: 120px;">
        <div v-if="filteredItems.length === 0" class="text-center py-8">
          <i class="pi pi-inbox text-5xl text-color-secondary mb-3 block" />
          <p class="text-color-secondary">لا توجد أصناف في هذه الفئة</p>
        </div>
        <MenuItemCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            @open="openItem"
        />
      </div>

      <!-- Cart -->
      <div class="fixed bottom-0 left-0 right-0 z-5">
        <OrderCart
          ref="cartRef"
          :items="cartItems"
          @increase="increaseItem"
          @decrease="decreaseItem"
          @confirm="confirmOrder"
        />

        <!-- بعد Cart مباشرة -->
        <MenuItemDialog
        v-model="dialogVisible"
        :item="selectedItem"
        @add="onDialogAdd"
        />
      </div>

    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { tables } from '../../../mock/tables.mock'
import { categories, menuItems } from '../../../mock/menu.mock'
import type { CartItem, MenuItem } from '../../../types/menu.types'
import type { Table } from '../types/guest.types'
import MenuCategory from '../../../components/shared/menu/MenuCategory.vue'
import MenuItemCard from '../../../components/shared/menu/MenuItem.vue'
import OrderCart from '../../../components/shared/menu/OrderCart.vue'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import MenuItemDialog from '../../../components/shared/menu/MenuItemDialog.vue'

const route = useRoute()
const toast = useToast()
const cartRef = ref()

const table = ref<Table | null>(null)
const selectedCategoryId = ref(categories[0].id)
const cartItems = ref<CartItem[]>([])
const dialogVisible = ref(false)
const selectedItem = ref<MenuItem | null>(null)

onMounted(() => {
  const id = Number(route.params.id)
  table.value = tables.find(t => t.id === id) || null
})

const filteredItems = computed(() =>
  menuItems.filter(item => item.categoryId === selectedCategoryId.value)
)

const statusLabel = computed(() => {
  switch (table.value?.status) {
    case 'available': return 'متاحة'
    case 'occupied': return 'مشغولة'
    case 'reserved': return 'محجوزة'
    default: return ''
  }
})

const statusSeverity = computed(() => {
  switch (table.value?.status) {
    case 'available': return 'success'
    case 'occupied': return 'danger'
    case 'reserved': return 'warn'
    default: return 'secondary'
  }
})

// function addToCart(item: MenuItem) {
//   const existing = cartItems.value.find(i => i.menuItem.id === item.id)
//   if (existing) {
//     existing.quantity++
//   } else {
//     cartItems.value.push({ menuItem: item, quantity: 1 })
//   }
//   cartRef.value?.closeDrawer()
//   toast.add({
//     severity: 'success',
//     summary: 'تمت الإضافة',
//     detail: `تم إضافة ${item.name} للسلة`,
//     life: 2000,
//   })
// }

function increaseItem(id: number) {
  const item = cartItems.value.find(i => i.menuItem.id === id)
  if (item) item.quantity++
}

function decreaseItem(id: number) {
  const index = cartItems.value.findIndex(i => i.menuItem.id === id)
  if (index === -1) return
  if (cartItems.value[index].quantity === 1) {
    cartItems.value.splice(index, 1)
  } else {
    cartItems.value[index].quantity--
  }
}

function confirmOrder() {
  cartItems.value = []
  toast.add({
    severity: 'success',
    summary: 'تم إرسال الطلب 🎉',
    detail: 'سيصلك طلبك قريباً',
    life: 3000,
  })
}

function openItem(item: MenuItem) {
  selectedItem.value = item
  dialogVisible.value = true
}

function onDialogAdd(cartItem: CartItem) {
  const existing = cartItems.value.find(
    i => i.menuItem.id === cartItem.menuItem.id &&
    i.selectedSize?.id === cartItem.selectedSize?.id
  )
  if (existing) {
    existing.quantity++
  } else {
    cartItems.value.push(cartItem)
  }
  cartRef.value?.closeDrawer()
  toast.add({
    severity: 'success',
    summary: 'تمت الإضافة',
    detail: `تم إضافة ${cartItem.menuItem.name} للسلة`,
    life: 2000,
  })
}
</script>