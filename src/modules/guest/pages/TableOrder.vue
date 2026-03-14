<!-- src/modules/guest/pages/TableOrder.vue -->
<template>
  <div class="min-h-screen surface-ground" dir="rtl">

    <!-- Header -->
<div class="surface-card shadow-1 px-3 py-3 sticky top-0 z-5">
  <div class="flex align-items-center justify-content-between">
    <div class="flex align-items-center gap-2">

      <!-- زر الرجوع للويتر/ادمن فقط -->
      <Button
        v-if="isWaiterRoute"
        icon="pi pi-arrow-right"
        text
        rounded
        size="small"
        class="ml-1"
        @click="goBack"
      />

      <div>
        <p class="font-bold text-base m-0 line-height-1">مطعمنا</p>
        <span class="text-color-secondary text-xs">طاولة {{ tableNumber }}</span>
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
            :item="normalizeItem(item)"
            @open="openItem"
          />
        </div>

        <div class="fixed bottom-0 left-0 right-0 z-5">
          <OrderCart
            ref="cartRef"
            :items="cartItems"
            :existing-items="existingItems"
            :updating-id="updatingId"
            :updating-action="updatingAction"
            @increase="increaseItem"
            @decrease="decreaseItem"
            @confirm="submitOrder"
            @remove-existing="removeExistingItem"
            @increase-existing="updateExistingItemQty"
            @decrease-existing="updateExistingItemQty"
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
                <MenuItemCard :item="normalizeItem(item)" @open="openItem" />
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Sidebar Desktop -->
        <div class="surface-card border-right-1 surface-border flex flex-column" style="width: 340px;">
          <div class="px-4 py-3 border-bottom-1 surface-border flex align-items-center gap-2">
            <i class="pi pi-shopping-cart text-primary" />
            <span class="font-bold text-lg">السلة</span>
            <Badge v-if="totalCartCount > 0" :value="totalCartCount" severity="danger" class="mr-auto" />
          </div>

          <div class="flex-1 overflow-y-auto px-3 py-2">

            <!-- فارغ -->
            <div
              v-if="!cartItems.length && !existingItems.length"
              class="flex flex-column align-items-center justify-content-center h-full gap-3 py-8"
            >
              <i class="pi pi-shopping-cart text-4xl text-color-secondary" />
              <p class="text-color-secondary text-sm">السلة فارغة</p>
            </div>

            <!-- مواد الفاتورة الحالية -->
            <div v-if="existingItems.length > 0" class="mb-3">
              <div class="flex align-items-center gap-2 mb-2 mt-2">
                <i class="pi pi-list text-primary text-xs" />
                <p class="text-xs font-bold text-500 m-0">الطلب الحالي على الطاولة</p>
              </div>
              <div
                v-for="item in existingItems"
                :key="item.id"
                class="flex align-items-center justify-content-between py-2 border-bottom-1 border-100"
              >
                <span class="text-xs text-900 flex-1">{{ item.name }}</span>
                <div class="flex align-items-center gap-1">
                  <Button
                    icon="pi pi-trash"
                    text rounded size="small" severity="danger"
                    style="width: 26px; height: 26px;"
                    :loading="updatingId === item.id && updatingAction === 'delete'"
                    @click="removeExistingItem(item.id)"
                  />
                  <Button
                    icon="pi pi-minus"
                    text rounded size="small"
                    style="width: 26px; height: 26px;"
                    :loading="updatingId === item.id && updatingAction === 'decrease'"
                    @click="updateExistingItemQty(item.id, item.quantity - 1)"
                  />
                  <span class="font-bold text-xs text-primary w-1rem text-center">{{ item.quantity }}</span>
                  <Button
                    icon="pi pi-plus"
                    text rounded size="small"
                    style="width: 26px; height: 26px;"
                    :loading="updatingId === item.id && updatingAction === 'increase'"
                    @click="updateExistingItemQty(item.id, item.quantity + 1)"
                  />
                  <span class="text-xs text-500" style="min-width: 55px; text-align: left;">
                    {{ item.total?.toLocaleString() }} د.ع
                  </span>
                </div>
              </div>

              <Divider v-if="cartItems.length > 0" class="my-2" />
              <div v-if="cartItems.length > 0" class="flex align-items-center gap-2 mb-2">
                <i class="pi pi-plus-circle text-green-500 text-xs" />
                <p class="text-xs font-bold text-500 m-0">إضافات جديدة</p>
              </div>
            </div>

            <!-- السلة الجديدة -->
            <div
              v-for="(cartItem, idx) in cartItems"
              :key="idx"
              class="border-round-lg p-3 mb-2 border-1 surface-border"
            >
              <div class="flex align-items-start gap-2 mb-2">
                <div class="flex-1">
                  <p class="m-0 font-bold text-sm text-color">{{ cartItem.menuItem.name }}</p>
                  <p v-if="cartItem.selectedOptions?.length" class="m-0 text-xs text-color-secondary">
                    {{ cartItem.selectedOptions.map((o: any) => o.name).join('، ') }}
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

          <!-- Footer السلة -->
          <div class="px-4 py-3 border-top-1 surface-border">

            <template v-if="existingItems.length > 0 && cartItems.length > 0">
              <div class="flex justify-content-between mb-1">
                <span class="text-color-secondary text-sm">المبلغ الحالي</span>
                <span class="text-sm font-bold">{{ existingTotal.toLocaleString() }} د.ع</span>
              </div>
              <div class="flex justify-content-between mb-1">
                <span class="text-color-secondary text-sm">المبلغ الإضافي</span>
                <span class="text-sm font-bold text-green-600">+ {{ totalPrice.toLocaleString() }} د.ع</span>
              </div>
              <Divider class="my-2" />
              <div class="flex justify-content-between align-items-center mb-3">
                <span class="font-bold text-base">المبلغ الكلي</span>
                <span class="font-bold text-xl text-primary">{{ (existingTotal + totalPrice).toLocaleString() }} د.ع</span>
              </div>
            </template>

            <template v-else>
              <div class="flex justify-content-between align-items-center mb-3">
                <span class="text-color-secondary">الإجمالي</span>
                <span class="font-bold text-xl text-primary">{{ (existingTotal + totalPrice).toLocaleString() }} د.ع</span>
              </div>
            </template>

            <Button
              label="إرسال الطلب"
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
          <p class="font-bold text-xl m-0 text-900">تم إرسال الطلب!</p>
          <p class="text-color-secondary text-sm m-0 line-height-3">تم إضافة الطلب بنجاح للطاولة</p>

          <div class="w-full surface-50 border-round-lg p-3 border-1 surface-border text-right">
            <p class="text-xs font-bold text-500 m-0 mb-2">الطلب المضاف</p>
            <div
              v-for="item in lastSubmittedItems"
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
              <span class="text-sm font-bold text-primary">
                {{ lastSubmittedItems.reduce((s, i) => s + itemTotal(i), 0) }} د.ع
              </span>
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
import { menuApi, orderApi, tableApi, customerApi } from '../../../services/api.service'
import type { MenuCategoryApi, MenuItemApi, InvoiceApi } from '../../../types/api.types'
import type { MenuItem }      from '../../../types/menu.types'
import type { CartItemLocal } from '../../../components/shared/menu/MenuItemDialog.vue'
import { useAuthStore }       from '../../auth/store/auth.store'
import { useRouter }          from 'vue-router'

import MenuCategory   from '../../../components/shared/menu/MenuCategory.vue'
import MenuItemCard   from '../../../components/shared/menu/MenuItem.vue'
import OrderCart      from '../components/OrderCart.vue'
import MenuItemDialog from '../../../components/shared/menu/MenuItemDialog.vue'

import Card            from 'primevue/card'
import Tag             from 'primevue/tag'
import Badge           from 'primevue/badge'
import Button          from 'primevue/button'
import Divider         from 'primevue/divider'
import Dialog          from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'

// ── ثوابت ──────────────────────────────────────────────
const CUSTOMER_ID = 1

// ── composables ────────────────────────────────────────
const route     = useRoute()
const router    = useRouter()
const toast     = useToast()
const authStore = useAuthStore()

// ── state ──────────────────────────────────────────────
const loading            = ref(true)
const submitting         = ref(false)
const successVisible     = ref(false)
const tableData          = ref<any | null>(null)
const allCategories      = ref<MenuCategoryApi[]>([])
const selectedCategoryId = ref<number | null>(null)
const cartItems          = ref<CartItemLocal[]>([])
const existingItems      = ref<{ id: number; name: string; quantity: number; price: number; total: number }[]>([])
const lastSubmittedItems = ref<CartItemLocal[]>([])
const dialogVisible      = ref(false)
const selectedItem       = ref<MenuItemApi | null>(null)
const cartRef            = ref()
const currentInvoiceId   = ref<number | null>(null)
const tableInvoices      = ref<InvoiceApi[]>([])
const showPrevOrders     = ref(false)
const updatingId         = ref<number | null>(null)
const updatingAction     = ref<string | null>(null)

// ── helpers ────────────────────────────────────────────
/** تحويل MenuItemApi → MenuItem (يضمن أن image دائماً string) */
function normalizeItem(item: MenuItemApi): MenuItem {
  return {
    ...item,
    image: item.image ?? '',
  } as unknown as MenuItem
}

// ── computed ───────────────────────────────────────────
const isWaiterRoute = computed(() => !!route.params.id)

const tableId = computed(() =>
  route.params.id ? Number(route.params.id) : tableData.value?.id ?? null
)

const tableNumber = computed(() =>
  tableData.value?.tableNumber ?? tableData.value?.number ?? tableId.value ?? route.params.token
)

const existingTotal = computed(() =>
  existingItems.value.reduce((s, i) => s + (i.total ?? i.price * i.quantity), 0)
)

const activeCategories = computed<MenuCategoryApi[]>(() =>
  allCategories.value.filter(c => {
    const isActive = c.isActive === undefined ? true : c.isActive
    return isActive && (c.menuItems?.length ?? 0) > 0
  })
)

const filteredItems = computed<MenuItemApi[]>(() => {
  if (!selectedCategoryId.value) return []
  const cat = allCategories.value.find(c => c.id === selectedCategoryId.value)
  return cat?.menuItems?.filter(i => i.isAvailable === undefined ? true : i.isAvailable) ?? []
})

const totalCartCount = computed(() =>
  cartItems.value.reduce((s, i) => s + i.quantity, 0)
)

const totalPrice = computed(() =>
  cartItems.value.reduce((s, i) => s + itemTotal(i), 0)
)

// ── helpers ────────────────────────────────────────────
function itemTotal(item: CartItemLocal) {
  const optionsTotal = item.selectedOptions?.reduce((s: number, o: any) => s + o.price, 0) ?? 0
  return (item.menuItem.price + optionsTotal) * item.quantity
}

function isPendingInvoice(inv: any): boolean {
  return inv.invoiceStatus === 0 || inv.status === 0
}

// ── refreshInvoices ────────────────────────────────────
async function refreshInvoices() {
  if (isWaiterRoute.value) {
    if (!tableId.value) return
    const invoices    = await tableApi.getInvoices(tableId.value)
    const rawInvoices = Array.isArray(invoices) ? invoices : []

    tableInvoices.value = rawInvoices.map((inv: any) => ({
      ...inv,
      status:     inv.invoiceStatus ?? inv.status ?? 0,
      totalPrice: inv.finalPrice    ?? inv.totalPrice ?? 0,
      items:      inv.invoiceItemsDto ?? inv.items ?? [],
    }))

    const openInvoice = tableInvoices.value.find(inv => isPendingInvoice(inv))

    if (openInvoice) {
      currentInvoiceId.value = openInvoice.id
      const invoiceItems     = (openInvoice as any).items ?? openInvoice.invoiceItemsDto ?? []
      existingItems.value    = invoiceItems.map((item: any) => ({
        id:       item.id,
        name:     item.menuItemName,
        quantity: item.quantity,
        price:    item.price,
        total:    item.totalPrice,
      }))
      showPrevOrders.value = true
    } else {
      currentInvoiceId.value = null
      existingItems.value    = []
      showPrevOrders.value   = false
    }

  } else {
    if (!currentInvoiceId.value) return
    try {
      const invoice = await orderApi.getById(currentInvoiceId.value)
      if (!invoice) return

      if (isPendingInvoice(invoice)) {
        const items = (invoice as any).invoiceItemsDto ?? (invoice as any).items ?? []
        existingItems.value = items.map((item: any) => ({
          id:       item.id,
          name:     item.menuItemName,
          quantity: item.quantity,
          price:    item.price,
          total:    item.totalPrice,
        }))
      } else {
        localStorage.removeItem(`invoice_${route.params.token}`)
        currentInvoiceId.value = null
        existingItems.value    = []
      }
    } catch {
      existingItems.value = []
    }
  }
}

// ── lifecycle ──────────────────────────────────────────
onMounted(async () => {
  try {
    if (isWaiterRoute.value) {
      const [tableRes, menuRes] = await Promise.all([
        tableApi.getById(Number(route.params.id)),
        menuApi.getAll(),
      ])
      tableData.value     = tableRes
      allCategories.value = Array.isArray(menuRes) ? menuRes : []
      try {
        await refreshInvoices()
      } catch {
        tableInvoices.value = []
      }

    } else {
      const res           = await tableApi.getByToken(route.params.token as string)
      tableData.value     = res
      allCategories.value = Array.isArray((res as any).menu) ? (res as any).menu : []

      const savedInvoiceId = localStorage.getItem(`invoice_${route.params.token}`)
      if (savedInvoiceId) {
        try {
          const invoice = await orderApi.getById(Number(savedInvoiceId))
          if (invoice && isPendingInvoice(invoice)) {
            currentInvoiceId.value = invoice.id
            const items = (invoice as any).invoiceItemsDto ?? (invoice as any).items ?? []
            existingItems.value = items.map((item: any) => ({
              id:       item.id,
              name:     item.menuItemName,
              quantity: item.quantity,
              price:    item.price,
              total:    item.totalPrice,
            }))
          } else {
            localStorage.removeItem(`invoice_${route.params.token}`)
          }
        } catch {
          localStorage.removeItem(`invoice_${route.params.token}`)
        }
      }
    }

    if (activeCategories.value.length > 0) {
      selectedCategoryId.value = activeCategories.value[0]!.id
    }

  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل البيانات، يرجى تحديث الصفحة', life: 4000 })
  } finally {
    loading.value = false
  }
})

// ── actions ────────────────────────────────────────────
function openItem(item: MenuItem) {
  selectedItem.value  = item as unknown as MenuItemApi
  dialogVisible.value = true
}

function onDialogAdd(cartItem: CartItemLocal) {
  const existingIdx = cartItems.value.findIndex(c =>
    c.menuItem.id === cartItem.menuItem.id &&
    JSON.stringify(c.selectedOptions.map((o: any) => o.id).sort()) ===
    JSON.stringify(cartItem.selectedOptions.map((o: any) => o.id).sort()) &&
    c.note === cartItem.note
  )
  if (existingIdx !== -1) {
    cartItems.value[existingIdx]!.quantity += cartItem.quantity
  } else {
    cartItems.value.push(cartItem)
  }
}

function increaseItem(itemIndex: number) {
  if (cartItems.value[itemIndex]) {
    cartItems.value[itemIndex]!.quantity++
  }
}

function decreaseItem(itemIndex: number) {
  if (itemIndex === -1) return
  if ((cartItems.value[itemIndex]?.quantity ?? 0) > 1) {
    cartItems.value[itemIndex]!.quantity--
  } else {
    cartItems.value.splice(itemIndex, 1)
  }
}

async function removeExistingItem(itemId: number) {
  updatingId.value     = itemId
  updatingAction.value = 'delete'
  try {
    await orderApi.voidItem({ invoiceItemId: itemId, voidReason: null })
    await refreshInvoices()
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل حذف المادة', life: 3000 })
  } finally {
    updatingId.value     = null
    updatingAction.value = null
  }
}

async function updateExistingItemQty(itemId: number, newQty: number) {
  if (newQty <= 0) return removeExistingItem(itemId)
  const action = newQty > (existingItems.value.find(i => i.id === itemId)?.quantity ?? 0) ? 'increase' : 'decrease'
  updatingId.value     = itemId
  updatingAction.value = action
  try {
    await orderApi.addItem({
      invoiceId:           currentInvoiceId.value,
      tableId:             tableId.value!,
      customerId:          CUSTOMER_ID,
      menuItemId:          0,
      quantity:            newQty,
      notes:               null,
      selectedItemOptions: [],
    })
    await refreshInvoices()
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تعديل الكمية', life: 3000 })
  } finally {
    updatingId.value     = null
    updatingAction.value = null
  }
}

async function submitOrder() {
  if (!cartItems.value.length) return
  submitting.value = true
  try {
    if (!isWaiterRoute.value) {
      const token = route.params.token as string
      const items = cartItems.value.map(item => ({
        menuItemId: item.menuItem.id,
        quantity:   item.quantity,
        optionIds:  item.selectedOptions.map((o: any) => o.id),
        notes:      item.note || undefined,
      }))
      const res = await customerApi.submitOrder(token, items)

      if (res?.id) {
        currentInvoiceId.value = res.id
        localStorage.setItem(`invoice_${token}`, String(res.id))
      }
    } else {
      if (!tableId.value) return
      for (const item of cartItems.value) {
        if (!item.menuItem.id || item.menuItem.id === 0) continue
        const res = await orderApi.addItem({
          invoiceId:           currentInvoiceId.value,
          tableId:             tableId.value,
          customerId:          CUSTOMER_ID,
          menuItemId:          item.menuItem.id,
          quantity:            item.quantity,
          notes:               item.note || null,
          selectedItemOptions: item.selectedOptions.map((o: any) => o.id),
        })
        if (!currentInvoiceId.value && res?.id) {
          currentInvoiceId.value = res.id
        }
      }
    }

    lastSubmittedItems.value = [...cartItems.value]
    cartItems.value          = []
    cartRef.value?.closeDrawer()
    successVisible.value     = true

    try { await refreshInvoices() } catch { /* تجاهل */ }

  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل إرسال الطلب، حاول مرة أخرى', life: 3000 })
  } finally {
    submitting.value = false
  }
}

function goBack() {
  if (authStore.userRole === 'Admin') {
    router.push('/dashboard/waiter')
  } else {
    router.push('/waiter')
  }
}
</script>

<style scoped>
.expand-enter-active, .expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 600px; }
</style>