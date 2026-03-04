<!-- src/modules/guest/pages/TableOrder.vue -->
<template>
  <div class="min-h-screen surface-ground" dir="rtl">

    <!-- Header -->
    <div class="surface-card shadow-1 px-3 py-3 sticky top-0 z-5">
      <div class="flex align-items-center justify-content-between">
        <div class="flex align-items-center gap-2">
          <div>
            <p class="font-bold text-base m-0 line-height-1">مطعمنا</p>
            <span class="text-color-secondary text-xs">طاولة {{ tableId }}</span>
          </div>
        </div>
        <Tag value="متاحة" severity="success" class="text-xs" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-content-center align-items-center py-8">
      <ProgressSpinner />
    </div>

    <template v-else>
      <!-- MOBILE -->
      <div class="md:hidden">
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

        <div class="px-3 py-3 flex flex-column gap-3 " style="padding-bottom: 120px;">
          <MenuItemCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            @open="openItem"
          />
        </div>

        <div class="fixed bottom-0 left-0 right-0 z-5">
          <OrderCart
            :items="cartItems"
            @increase="increaseItem"
            @decrease="decreaseItem"
            @confirm="submitOrder"
          />
        </div>
      </div>

      <!-- DESKTOP -->
      <div class="hidden md:flex gap-0" style="height: calc(100vh - 64px);">
        <div class="flex flex-column flex-1 overflow-hidden">
          <div class="px-3 pt-3 pb-2 surface-card shadow-1 z-4" style="position: sticky; top: 0;">
            <MenuCategory
              v-if="allCategories.length"
              :categories="categories"
              :selected-id="selectedCategoryId"
              @select="selectedCategoryId = $event"
            />
            {{ console.log(allCategories) }}
          </div>
          <div class="overflow-y-auto flex-1 px-3 py-3">
            <div class="grid">
              <div v-for="item in filteredItems" :key="item.id" class="col-12 lg:col-6 xl:col-4">
                <MenuItemCard :item="item" @open="openItem" />
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Sidebar -->
        <div class="surface-card border-right-1 surface-border flex flex-column" style="width: 340px;">
          <div class="px-4 py-3 border-bottom-1 surface-border flex align-items-center gap-2">
            <i class="pi pi-shopping-cart text-primary" />
            <span class="font-bold text-lg">السلة</span>
            <Badge v-if="cartItems.length" :value="totalCartCount" severity="danger" class="mr-auto" />
          </div>

          <div class="flex-1 overflow-y-auto px-3 py-2">
            <div v-if="!cartItems.length" class="flex flex-column align-items-center justify-content-center h-full gap-3 py-8">
              <i class="pi pi-shopping-cart text-4xl text-color-secondary" />
              <p class="text-color-secondary text-sm">السلة فارغة</p>
            </div>

            <div v-for="(cartItem, idx) in cartItems" :key="idx" class="surface-hover border-round-lg p-3 mb-2 border-1 surface-border">
              <div class="flex align-items-center gap-2 mb-2">
                <div class="flex-1">
                  <p class="m-0 font-bold text-sm text-color">{{ cartItem.menuItem.name }}</p>
                  <p v-if="cartItem.selectedOptions.length" class="m-0 text-xs text-color-secondary">
                    {{ cartItem.selectedOptions.map(o => o.name).join('، ') }}
                  </p>
                  <p v-if="cartItem.note" class="m-0 text-xs text-orange-500">📝 {{ cartItem.note }}</p>
                </div>
              </div>
              <div class="flex align-items-center justify-content-between">
                <div class="flex align-items-center gap-2">
                  <Button icon="pi pi-minus" rounded text size="small" @click="decreaseItem(idx)" />
                  <span class="font-bold text-sm">{{ cartItem.quantity }}</span>
                  <Button icon="pi pi-plus" rounded text size="small" @click="increaseItem(idx)" />
                </div>
                <span class="text-primary font-bold text-sm">{{ itemTotal(cartItem) }} د.ع</span>
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
              :disabled="!cartItems.length || submitting"
              :loading="submitting"
              @click="submitOrder"
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
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { menuApi, orderApi } from '../../../services/api.service'
import type { MenuCategoryApi, MenuItemApi } from '../../../types/api.types'
import type { CartItemLocal } from '../../../components/shared/menu/MenuItemDialog.vue'

import MenuCategory from '../../../components/shared/menu/MenuCategory.vue'
import MenuItemCard from '../../../components/shared/menu/MenuItem.vue'
import OrderCart from '../../../components/shared/menu/OrderCart.vue'
import MenuItemDialog from '../../../components/shared/menu/MenuItemDialog.vue'

//PRIMVUE IMPORTS
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

// ---- الثوابت ----
const CUSTOMER_ID = 1 // مؤقت — يُستبدل لاحقاً بالـ auth

// ---- composables ----
const route = useRoute()
const toast = useToast()

// ---- state ----
const loading = ref(true)
const submitting = ref(false)

const allCategories = ref<MenuCategoryApi[]>([])
const selectedCategoryId = ref<number | null>(0)

const cartItems = ref<CartItemLocal[]>([])
const dialogVisible = ref(false)
const selectedItem = ref<MenuItemApi | null>(null)

const currentInvoiceId = ref<number | null>(null)

// ---- computed ----

const tableId = computed(() => {
  const id = Number(route.params.id)
  return isNaN(id) ? null : id
})

/** الفئات الفعالة التي تحتوي على عناصر */
const categories = computed(() => {
  return Array.isArray(allCategories.value)
    ? allCategories.value
        .filter(c => c.isActive && Array.isArray(c.menuItems) && c.menuItems.length > 0)
        .map(c => ({
          id: c.id,
          name: c.name,
          icon: '🍽️'
        }))
    : []
})

/** العناصر حسب الفئة المختارة */
const filteredItems = computed(() => {
  if (!Array.isArray(allCategories.value)) return []
  if (!selectedCategoryId.value) return []

  const cat = allCategories.value.find(
    c => c.id === Number(selectedCategoryId.value)
  )

  if (!cat || !Array.isArray(cat.menuItems)) return []

  return cat.menuItems.filter(i => i.isAvailable)
})

const totalCartCount = computed(() =>
  cartItems.value.reduce((s, i) => s + i.quantity, 0)
)

const totalPrice = computed(() =>
  cartItems.value.reduce((s, i) => s + itemTotal(i), 0)
)

// ---- helpers ----

function itemTotal(item: CartItemLocal) {
  const optionsTotal = item.selectedOptions.reduce(
    (s, o) => s + o.price,
    0
  )
  return (item.menuItem.price + optionsTotal) * item.quantity
}

// ---- lifecycle ----

onMounted(async () => {
  try {
    const res = await menuApi.getFullMenu()
    console.log(res)
    // تأكد أن البيانات Array
    allCategories.value = Array.isArray(res) ? res : []

    // اختر أول فئة فعالة تلقائياً
    if (categories.value.length > 0) {
      selectedCategoryId.value = categories.value[0].id
    }


  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل تحميل المنيو',
      life: 3000
    })
  } finally {
    loading.value = false
  }
})

// ---- actions ----

function openItem(item: MenuItemApi) {
  selectedItem.value = item
  dialogVisible.value = true
}

function onDialogAdd(cartItem: CartItemLocal) {
  const existingIdx = cartItems.value.findIndex(c =>
    c.menuItem.id === cartItem.menuItem.id &&
    JSON.stringify(c.selectedOptions.map(o => o.id).sort()) ===
    JSON.stringify(cartItem.selectedOptions.map(o => o.id).sort()) &&
    c.note === cartItem.note
  )

  if (existingIdx !== -1) {
    cartItems.value[existingIdx].quantity += cartItem.quantity
  } else {
    cartItems.value.push(cartItem)
  }
}

// ✅ صحيح - البحث عبر menuItem.id
function increaseItem(id: number) {
  const item = cartItems.value.find(i => i.menuItem.id === id)
  if (!item) return
  item.quantity++
}

function decreaseItem(id: number) {
  const item = cartItems.value.find(i => i.menuItem.id === id)
  if (!item) return
  if (item.quantity > 1) {
    item.quantity--
  } else {
    cartItems.value = cartItems.value.filter(i => i.menuItem.id !== id)
  }
}

async function submitOrder() {
  if (!cartItems.value.length) return
  if (!tableId.value) return

  submitting.value = true

  try {
    for (const item of cartItems.value) {
      const res = await orderApi.addItem({
        invoiceId: currentInvoiceId.value,
        tableId: tableId.value,
        customerId: CUSTOMER_ID,
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        notes: item.note || null,
        selectedItemOptions: item.selectedOptions.map(o => o.id),
      })

      if (!currentInvoiceId.value && res.data?.id) {
        currentInvoiceId.value = res.data.id
      }
    }

    toast.add({
      severity: 'success',
      summary: 'تم الطلب',
      detail: 'تم إرسال طلبك بنجاح',
      life: 3000
    })

    cartItems.value = []

  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل إرسال الطلب',
      life: 3000
    })
  } finally {
    submitting.value = false
  }
}
</script>