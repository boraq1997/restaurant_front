<template>
  <div class="min-h-screen surface-ground" dir="rtl">

    <!-- Header -->
    <div class="surface-card shadow-1 px-3 py-3 sticky top-0 z-5">
      <div class="flex align-items-center justify-content-between">
        <div class="flex align-items-center gap-2">

          <!-- زر العودة -->
          <Button
            icon="pi pi-arrow-right"
            text
            rounded
            severity="secondary"
            @click="router.back()"
          />

          <div>
            <p class="font-bold text-base m-0 line-height-1">{{ table?.name ?? 'مطعمنا' }}</p>
            <span class="text-color-secondary text-xs">طاولة {{ table?.number }}</span>
          </div>
        </div>

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
      <Button label="العودة" icon="pi pi-arrow-right" text @click="router.back()" />
    </div>

    <template v-else>

      <!-- ===== MOBILE (< md) ===== -->
      <div class="md:hidden">

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

        <!-- Cart Fixed Bottom -->
        <div class="fixed bottom-0 left-0 right-0 z-5">
          <OrderCart
            ref="cartRef"
            :items="cartItems"
            @increase="increaseItem"
            @decrease="decreaseItem"
            @confirm="confirmOrder"
          />
        </div>

      </div>

      <!-- ===== TABLET & DESKTOP (>= md) ===== -->
      <div class="hidden md:flex gap-0" style="height: calc(100vh - 80px);">

        <!-- Right: Menu -->
        <div class="flex flex-column flex-1 overflow-hidden">

          <!-- Categories sticky -->
          <div class="px-3 pt-3 pb-2 surface-card shadow-1 z-4" style="position: sticky; top: 0;">
            <MenuCategory
              :categories="categories"
              :selected-id="selectedCategoryId"
              @select="selectedCategoryId = $event"
            />
          </div>

          <!-- Items Grid -->
          <div class="overflow-y-auto flex-1 px-3 py-3">
            <div v-if="filteredItems.length === 0" class="text-center py-8">
              <i class="pi pi-inbox text-5xl text-color-secondary mb-3 block" />
              <p class="text-color-secondary">لا توجد أصناف في هذه الفئة</p>
            </div>
            <div class="grid">
              <div
                v-for="item in filteredItems"
                :key="item.id"
                class="col-12 lg:col-6 xl:col-4"
              >
                <MenuItemCard :item="item" @open="openItem" />
              </div>
            </div>
          </div>

        </div>

        <!-- Left: Cart Sidebar -->
        <div
          class="surface-card border-right-1 surface-border flex flex-column"
          style="width: 340px; min-width: 300px;"
        >
          <div class="px-4 py-3 border-bottom-1 surface-border flex align-items-center gap-2">
            <i class="pi pi-shopping-cart text-primary" />
            <span class="font-bold text-lg">السلة</span>
            <Badge v-if="cartItems.length" :value="totalCartCount" severity="danger" class="mr-auto" />
          </div>

          <div class="flex-1 overflow-y-auto px-3 py-2">
            <div v-if="cartItems.length === 0" class="flex flex-column align-items-center justify-content-center h-full gap-3 py-8">
              <i class="pi pi-shopping-cart text-4xl text-color-secondary" />
              <p class="text-color-secondary text-sm">السلة فارغة</p>
            </div>

            <div v-for="cartItem in cartItems" :key="cartItem.menuItem.id" class="surface-hover border-round-lg p-3 mb-2 border-1 surface-border">
              <div class="flex align-items-center gap-2 mb-2">
                <img
                  :src="cartItem.menuItem.image"
                  :alt="cartItem.menuItem.name"
                  class="border-round"
                  style="width: 48px; height: 48px; object-fit: cover;"
                />
                <div class="flex-1">
                  <p class="m-0 font-bold text-sm text-color">{{ cartItem.menuItem.name }}</p>
                  <p class="m-0 text-xs text-color-secondary" v-if="cartItem.selectedSize">{{ cartItem.selectedSize.name }}</p>
                </div>
              </div>
              <div class="flex align-items-center justify-content-between">
                <div class="flex align-items-center gap-2">
                  <Button icon="pi pi-minus" rounded text size="small" @click="decreaseItem(cartItem.menuItem.id)" />
                  <span class="font-bold text-sm">{{ cartItem.quantity }}</span>
                  <Button icon="pi pi-plus" rounded text size="small" @click="increaseItem(cartItem.menuItem.id)" />
                </div>
                <span class="text-primary font-bold text-sm">
                  {{ (cartItem.menuItem.price + (cartItem.selectedSize?.price || 0)) * cartItem.quantity }} د.ع
                </span>
              </div>
            </div>
          </div>

          <div class="px-4 py-3 border-top-1 surface-border">
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-color-secondary">الإجمالي</span>
              <span class="font-bold text-xl text-primary">{{ totalPrice }} د.ع</span>
            </div>
            <Button
              label="تأكيد الطلب"
              icon="pi pi-check"
              class="w-full"
              :disabled="cartItems.length === 0"
              @click="confirmOrder"
            />
          </div>

        </div>

      </div>

    </template>

    <!-- Dialog -->
    <MenuItemDialog
      v-model="dialogVisible"
      :item="selectedItem"
      @add="onDialogAdd"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import MenuItemDialog from '../../../components/shared/menu/MenuItemDialog.vue'

const route = useRoute()
const router = useRouter()
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

const totalCartCount = computed(() =>
  cartItems.value.reduce((sum, i) => sum + i.quantity, 0)
)

const totalPrice = computed(() =>
  cartItems.value.reduce((sum, i) => {
    const base = i.menuItem.price + (i.selectedSize?.price || 0)
    return sum + base * i.quantity
  }, 0)
)

const statusLabel = computed(() => {
  switch (table.value?.status) {
    case 'available': return 'متاحة'
    case 'occupied':  return 'مشغولة'
    case 'reserved':  return 'محجوزة'
    default: return ''
  }
})

const statusSeverity = computed(() => {
  switch (table.value?.status) {
    case 'available': return 'success'
    case 'occupied':  return 'danger'
    case 'reserved':  return 'warn'
    default: return 'secondary'
  }
})

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