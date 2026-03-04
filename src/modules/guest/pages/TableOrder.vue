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
                :categories="activeCategories"
                :selected-id="selectedCategoryId"
                @select="selectedCategoryId = $event"
              />
            </template>
          </Card>
        </div>

        <div class="px-3 py-3 flex flex-column gap-3" style="padding-bottom: 120px;">
          <MenuItemCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            @open="openItem"
          />
        </div>

        <div class="fixed bottom-0 left-0 right-0 z-5">
          <OrderCart
            ref="cartRef"
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
              v-if="activeCategories.length"
              :categories="activeCategories"
              :selected-id="selectedCategoryId"
              @select="selectedCategoryId = $event"
            />
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
                  <Button icon="pi pi-minus" rounded text size="small" @click="decreaseItem(cartItem.menuItem.id)" />
                  <span class="font-bold text-sm">{{ cartItem.quantity }}</span>
                  <Button icon="pi pi-plus" rounded text size="small" @click="increaseItem(cartItem.menuItem.id)" />
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

    <!-- Dialog إضافة منتج -->
    <MenuItemDialog
      v-model="dialogVisible"
      :item="selectedItem"
      @add="onDialogAdd"
    />

    <!-- Dialog نجاح الطلب -->
    <Dialog
      v-model:visible="successVisible"
      :modal="true"
      :draggable="false"
      :closable="false"
      :style="{ width: '320px' }"
      dir="rtl"
    >
      <template #container>
        <div class="flex flex-column align-items-center p-5 gap-3 surface-card border-round-xl text-center">
          <div class="w-5rem h-5rem border-round-full bg-green-100 flex align-items-center justify-content-center">
            <i class="pi pi-check text-green-600 text-4xl" />
          </div>
          <p class="font-bold text-xl m-0 text-900">تم إرسال طلبك!</p>
          <p class="text-color-secondary text-sm m-0 line-height-3">
            سيقوم الويتر بتأكيد طلبك قريباً
          </p>

          <!-- ملخص الطلب المرسل -->
          <div class="w-full surface-50 border-round-lg p-3 border-1 surface-border text-right">
            <p class="text-xs font-bold text-500 m-0 mb-2">طلبك الحالي</p>
            <div
              v-for="item in cartItems"
              :key="item.menuItem.id"
              class="flex justify-content-between align-items-center py-1"
            >
              <span class="text-sm text-900">{{ item.menuItem.name }}</span>
              <div class="flex align-items-center gap-2">
                <span class="text-xs text-500">x{{ item.quantity }}</span>
                <span class="text-xs font-bold text-primary">{{ itemTotal(item) }} د.ع</span>
              </div>
            </div>
            <div class="border-top-1 surface-border mt-2 pt-2 flex justify-content-between">
              <span class="text-sm font-bold text-900">الإجمالي</span>
              <span class="text-sm font-bold text-primary">{{ totalPrice }} د.ع</span>
            </div>
          </div>

          <Button
            label="إضافة المزيد"
            icon="pi pi-plus"
            class="w-full mt-1"
            severity="secondary"
            outlined
            @click="successVisible = false"
          />
        </div>
      </template>
    </Dialog>

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

import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'

// ── ثوابت ──────────────────────────────────────────────
const CUSTOMER_ID = 1 // زبون عشوائي دائماً

// ── composables ────────────────────────────────────────
const route = useRoute()
const toast = useToast()

// ── state ──────────────────────────────────────────────
const loading        = ref(true)
const submitting     = ref(false)
const successVisible = ref(false)

const allCategories      = ref<MenuCategoryApi[]>([])
const selectedCategoryId = ref<number | null>(null)

const cartItems     = ref<CartItemLocal[]>([])
const dialogVisible = ref(false)
const selectedItem  = ref<MenuItemApi | null>(null)
const cartRef       = ref()

// invoiceId يُحفظ بعد أول طلب ناجح لإضافة باقي الأصناف لنفس الفاتورة
const currentInvoiceId = ref<number | null>(null)

// ── computed ───────────────────────────────────────────
const tableId = computed(() => {
  const id = Number(route.params.id)
  return isNaN(id) ? null : id
})

/** الفئات الفعالة التي تحتوي على عناصر متاحة */
const activeCategories = computed<MenuCategoryApi[]>(() => {
  return allCategories.value.filter(
    c => c.isActive && c.menuItems?.some(i => i.isAvailable)
  )
})

/** العناصر المتاحة للفئة المختارة */
const filteredItems = computed<MenuItemApi[]>(() => {
  if (!selectedCategoryId.value) return []
  const cat = allCategories.value.find(c => c.id === selectedCategoryId.value)
  return cat?.menuItems?.filter(i => i.isAvailable) ?? []
})

const totalCartCount = computed(() =>
  cartItems.value.reduce((s, i) => s + i.quantity, 0)
)

const totalPrice = computed(() =>
  cartItems.value.reduce((s, i) => s + itemTotal(i), 0)
)

// ── helpers ────────────────────────────────────────────
function itemTotal(item: CartItemLocal) {
  const optionsTotal = item.selectedOptions.reduce((s, o) => s + o.price, 0)
  return (item.menuItem.price + optionsTotal) * item.quantity
}

// ── lifecycle ──────────────────────────────────────────
onMounted(async () => {
  try {
    const res = await menuApi.getFullMenu()
    allCategories.value = Array.isArray(res) ? res : []

    // اختر أول فئة فعالة تلقائياً
    if (activeCategories.value.length > 0) {
      selectedCategoryId.value = activeCategories.value[0].id
    }
  } catch {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل تحميل المنيو، يرجى تحديث الصفحة',
      life: 4000,
    })
  } finally {
    loading.value = false
  }
})

// ── actions ────────────────────────────────────────────
function openItem(item: MenuItemApi) {
  selectedItem.value = item
  dialogVisible.value = true
}

function onDialogAdd(cartItem: CartItemLocal) {
  // إذا نفس المنتج بنفس الخيارات والملاحظة → زد الكمية فقط
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

function increaseItem(id: number) {
  const item = cartItems.value.find(i => i.menuItem.id === id)
  if (item) item.quantity++
}

function decreaseItem(id: number) {
  const idx = cartItems.value.findIndex(i => i.menuItem.id === id)
  if (idx === -1) return
  if (cartItems.value[idx].quantity > 1) {
    cartItems.value[idx].quantity--
  } else {
    cartItems.value.splice(idx, 1)
  }
}

async function submitOrder() {
  if (!cartItems.value.length || !tableId.value) return

  submitting.value = true

  try {
    for (const item of cartItems.value) {
      const res = await orderApi.addItem({
        invoiceId:           currentInvoiceId.value,  // null في أول طلب
        tableId:             tableId.value,
        customerId:          CUSTOMER_ID,
        menuItemId:          item.menuItem.id,
        quantity:            item.quantity,
        notes:               item.note || null,
        selectedItemOptions: item.selectedOptions.map(o => o.id),
      })

      // احفظ الـ invoiceId من أول رد لإضافة باقي الأصناف لنفس الفاتورة
      if (!currentInvoiceId.value && res?.id) {
        currentInvoiceId.value = res.id
      }
    }

    // أغلق الدرّاور وأظهر رسالة النجاح — السلة تبقى كما هي
    cartRef.value?.closeDrawer()
    successVisible.value = true

  } catch {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: 'فشل إرسال الطلب، حاول مرة أخرى',
      life: 3000,
    })
  } finally {
    submitting.value = false
  }
}
</script>