<!-- src/modules/cashier/components/OrderSummary.vue -->

<template>
  <div class="flex flex-column gap-3">

    <!-- معلومات الطاولة -->
    <div class="flex align-items-center justify-content-between">
      <div class="flex align-items-center gap-2">
        <i class="pi pi-th-large text-primary" />
        <span class="font-bold text-900">{{ table.name }}</span>
      </div>
      <Tag :severity="paymentSeverity" rounded>
        <span class="text-xs font-bold">{{ paymentLabel }}</span>
      </Tag>
    </div>

    <Divider class="my-1" />

    <!-- قائمة المواد -->
    <div class="flex flex-column gap-2">
      <div
        v-for="(cartItem, index) in table.order!.items"
        :key="index"
        class="surface-50 border-round-lg border-1 surface-border overflow-hidden"
      >
        <!-- الصنف الرئيسي -->
        <div
          class="flex align-items-center gap-3 p-3 cursor-pointer hover:surface-100 transition-all transition-duration-200"
          @click="toggleItem(index)"
        >
          <img
            :src="cartItem.menuItem.image || DEFAULT_IMAGE"
            :alt="cartItem.menuItem.name"
            class="border-round flex-shrink-0"
            style="width: 48px; height: 48px; object-fit: cover;"
            @error="onImageError"
          />
          <div class="flex-1">
            <p class="m-0 font-bold text-sm text-900">{{ cartItem.menuItem.name }}</p>
            <span v-if="cartItem.selectedOptions" class="text-xs text-500">
              {{ cartItem.selectedSize.name }}
            </span>
          </div>
          <div class="flex flex-column align-items-end gap-1">
            <span class="font-bold text-sm text-primary">
              {{ itemTotal(cartItem).toLocaleString() }} د.ع
            </span>
            <span class="text-xs text-500">x{{ cartItem.quantity }}</span>
          </div>
          <i
            class="pi text-400 text-xs mr-1"
            :class="expandedItems.includes(index) ? 'pi-angle-up' : 'pi-angle-down'"
          />
        </div>

        <!-- التفاصيل عند الضغط -->
        <Transition name="expand">
          <div
            v-if="expandedItems.includes(index)"
            class="px-3 pb-3 flex flex-column gap-2 border-top-1 surface-border pt-2"
          >

            <!-- تفاصيل السعر -->
            <div class="flex flex-column gap-1 p-2 surface-100 border-round-lg">
              <div class="flex justify-content-between align-items-center">
                <span class="text-xs text-500">السعر الأساسي</span>
                <span class="text-xs font-medium text-700">
                  {{ (cartItem.menuItem.price + (cartItem.selectedSize?.price ?? 0)).toLocaleString() }} د.ع
                </span>
              </div>
              <div
                v-if="cartItem.selectedSize"
                class="flex justify-content-between align-items-center"
              >
                <span class="text-xs text-500">الحجم ({{ cartItem.selectedSize.name }})</span>
                <span class="text-xs font-medium text-700">
                  {{ cartItem.selectedSize.price > 0 ? `+ ${cartItem.selectedSize.price.toLocaleString()} د.ع` : 'مجاني' }}
                </span>
              </div>
              <template v-if="cartItem.selectedExtras?.length">
                <div
                  v-for="extra in cartItem.selectedExtras"
                  :key="extra.extra.id"
                  class="flex justify-content-between align-items-center"
                >
                  <span class="text-xs text-500">{{ extra.extra.name }} x{{ extra.quantity }}</span>
                  <span class="text-xs font-medium text-700">
                    {{ extra.extra.price > 0 ? `+ ${(extra.extra.price * extra.quantity).toLocaleString()} د.ع` : 'مجاني' }}
                  </span>
                </div>
              </template>
              <Divider class="my-1" />
              <div class="flex justify-content-between align-items-center">
                <span class="text-xs font-bold text-900">المجموع x{{ cartItem.quantity }}</span>
                <span class="text-xs font-bold text-primary">
                  {{ itemTotal(cartItem).toLocaleString() }} د.ع
                </span>
              </div>
            </div>

            <!-- إزالات -->
            <div v-if="cartItem.removedItems?.length">
              <p class="text-xs font-bold text-color-secondary m-0 mb-1">إزالة</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="removed in cartItem.removedItems"
                  :key="removed.id"
                  class="text-xs bg-red-50 text-red-500 px-2 py-1 border-round"
                >
                  - {{ removed.name }}
                </span>
              </div>
            </div>

            <!-- ملاحظة -->
            <div v-if="cartItem.note">
              <p class="text-xs font-bold text-color-secondary m-0 mb-1">ملاحظة</p>
              <p class="text-xs text-700 m-0 p-2 surface-100 border-round">
                {{ cartItem.note }}
              </p>
            </div>

            <!-- لا توجد تفاصيل -->
            <div
              v-if="!cartItem.selectedExtras?.length && !cartItem.removedItems?.length && !cartItem.note && !cartItem.selectedSize"
              class="text-xs text-400 text-center py-1"
            >
              لا توجد تفاصيل إضافية
            </div>

          </div>
        </Transition>

      </div>
    </div>

    <Divider class="my-1" />

    <!-- المجموع -->
    <div class="flex justify-content-between align-items-center">
      <span class="font-bold text-base text-900">الإجمالي</span>
      <span class="font-bold text-xl text-primary">
        {{ table.order!.totalPrice.toLocaleString() }} د.ع
      </span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'
import type { CashierTable } from '../types/cashier.types'
import type { CartItem } from '../../../types/menu.types'

const props = defineProps<{ table: CashierTable }>()

const DEFAULT_IMAGE = '/defaultImages/defaultFood.jpeg'

// ✅ إصلاح المشكلة: استخدام index بدلاً من menuItem.id
const expandedItems = ref<number[]>([])

function toggleItem(index: number) {
  const pos = expandedItems.value.indexOf(index)
  if (pos === -1) {
    expandedItems.value.push(index)
  } else {
    expandedItems.value.splice(pos, 1)
  }
}

const paymentSeverity = computed(() =>
  props.table.paymentStatus === 'unpaid' ? 'danger' : 'success'
)

const paymentLabel = computed(() =>
  props.table.paymentStatus === 'unpaid' ? 'غير مدفوع' : 'مدفوع'
)

function itemTotal(cartItem: CartItem) {
  const base   = cartItem.menuItem.price + (cartItem.selectedSize?.price ?? 0)
  const extras = cartItem.selectedExtras?.reduce((sum, e) => sum + e.extra.price * e.quantity, 0) ?? 0
  return (base + extras) * cartItem.quantity
}

function onImageError(e: Event) {
  const img = e.target as HTMLImageElement
  if (img.dataset.fallback === '1') return
  img.dataset.fallback = '1'
  img.src = DEFAULT_IMAGE
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 300px;
}
</style>