<!-- src/modules/guest/components/OrderCart.vue -->
<template>
  <!-- Mobile Bottom Bar -->
  <div dir="rtl">

    <!-- شريط السلة السفلي -->
    <div
      class="surface-card shadow-6 border-top-1 surface-border px-3 py-2"
      style="backdrop-filter: blur(10px);"
    >
      <div class="flex align-items-center justify-content-between gap-3">

        <!-- معلومات السلة -->
        <div class="flex align-items-center gap-2">
          <div class="relative">
            <i class="pi pi-shopping-cart text-2xl text-primary" />
            <Badge
              v-if="totalCount > 0"
              :value="totalCount"
              severity="danger"
              class="absolute"
              style="top: -8px; left: -8px; font-size: 10px; min-width: 18px; height: 18px;"
            />
          </div>
          <div>
            <p class="m-0 font-bold text-sm text-900">
              {{ totalCount > 0 ? `${totalCount} مادة` : 'السلة فارغة' }}
            </p>
            <p v-if="grandTotal > 0" class="m-0 text-xs text-primary font-bold">
              {{ grandTotal.toLocaleString() }} د.ع
            </p>
          </div>
        </div>

        <!-- زر فتح السلة -->
        <Button
          :label="items.length > 0 ? 'عرض الطلب' : (existingItems.length > 0 ? 'الطلب الحالي' : 'السلة فارغة')"
          :icon="drawerVisible ? 'pi pi-times' : 'pi pi-arrow-up'"
          :disabled="items.length === 0 && existingItems.length === 0"
          size="small"
          @click="drawerVisible = true"
        />
      </div>
    </div>

    <!-- Drawer السلة -->
    <Drawer
      v-model:visible="drawerVisible"
      position="bottom"
      :style="{ height: 'auto', maxHeight: '85vh', borderRadius: '16px 16px 0 0' }"
      :pt="{ header: { style: 'padding: 12px 16px 8px' }, content: { style: 'padding: 0' } }"
    >
      <template #header>
        <div class="flex align-items-center justify-content-between w-full">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-shopping-cart text-primary" />
            <span class="font-bold text-base">تفاصيل الطلب</span>
          </div>
          <Badge v-if="totalCount > 0" :value="totalCount" severity="danger" />
        </div>
      </template>

      <div class="overflow-y-auto" style="max-height: 65vh;">

        <!-- الطلب الحالي على الطاولة -->
        <div v-if="existingItems.length > 0" class="px-3 pt-3">
          <div class="surface-50 border-round-xl border-1 border-200 overflow-hidden">

            <div class="flex align-items-center gap-2 px-3 py-2 border-bottom-1 border-200">
              <i class="pi pi-list text-primary text-xs" />
              <span class="text-xs font-bold text-500">الطلب الحالي على الطاولة</span>
            </div>

            <div class="px-3 py-1">
              <div
                v-for="item in existingItems"
                :key="item.id"
                class="flex align-items-center justify-content-between py-2 border-bottom-1 border-100"
              >
                <div class="flex align-items-center gap-2 flex-1">
                  <span class="text-xs text-900 flex-1">{{ item.name }}</span>
                </div>

                <!-- أزرار التعديل -->
                <div class="flex align-items-center gap-1">
                  <Button
                    icon="pi pi-trash"
                    text
                    rounded
                    size="small"
                    severity="danger"
                    class="w-1rem h-1rem"
                    style="width: 28px; height: 28px;"
                    :loading="updatingId === item.id && updatingAction === 'delete'"
                    @click="$emit('removeExisting', item.id)"
                  />
                  <Button
                    icon="pi pi-minus"
                    text
                    rounded
                    size="small"
                    style="width: 28px; height: 28px;"
                    :loading="updatingId === item.id && updatingAction === 'decrease'"
                    @click="$emit('decreaseExisting', item.id, item.quantity - 1)"
                  />
                  <span class="font-bold text-sm text-primary w-1rem text-center">{{ item.quantity }}</span>
                  <Button
                    icon="pi pi-plus"
                    text
                    rounded
                    size="small"
                    style="width: 28px; height: 28px;"
                    :loading="updatingId === item.id && updatingAction === 'increase'"
                    @click="$emit('increaseExisting', item.id, item.quantity + 1)"
                  />
                  <span class="text-xs text-500 mr-1" style="min-width: 60px; text-align: left;">
                    {{ item.total?.toLocaleString() }} د.ع
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- إضافات جديدة -->
        <div v-if="items.length > 0" class="px-3 pt-3">
          <div class="surface-card border-round-xl border-1 border-200 overflow-hidden">

            <div class="flex align-items-center gap-2 px-3 py-2 border-bottom-1 border-200">
              <i class="pi pi-plus-circle text-green-500 text-xs" />
              <span class="text-xs font-bold text-500">إضافات جديدة</span>
            </div>

            <div class="px-3 py-1">
              <div
                v-for="(cartItem, idx) in items"
                :key="idx"
                class="py-2 border-bottom-1 border-100"
              >
                <div class="flex align-items-start justify-content-between gap-2">
                  <div class="flex-1">
                    <p class="m-0 font-bold text-sm text-color">{{ cartItem.menuItem.name }}</p>
                    <p v-if="cartItem.selectedOptions?.length" class="m-0 text-xs text-color-secondary">
                      {{ cartItem.selectedOptions.map((o: any) => o.name).join('، ') }}
                    </p>
                    <p v-if="cartItem.note" class="m-0 text-xs text-orange-500">📝 {{ cartItem.note }}</p>
                  </div>
                  <div class="flex align-items-center gap-1">
                    <Button
                      icon="pi pi-minus"
                      text rounded size="small"
                      style="width: 28px; height: 28px;"
                      @click="$emit('decrease', cartItem.menuItem.id)"
                    />
                    <span class="font-bold text-sm text-primary w-1rem text-center">{{ cartItem.quantity }}</span>
                    <Button
                      icon="pi pi-plus"
                      text rounded size="small"
                      style="width: 28px; height: 28px;"
                      @click="$emit('increase', cartItem.menuItem.id)"
                    />
                    <span class="text-xs text-500 mr-1" style="min-width: 60px; text-align: left;">
                      {{ itemTotal(cartItem).toLocaleString() }} د.ع
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- فارغ -->
        <div
          v-if="items.length === 0 && existingItems.length === 0"
          class="flex flex-column align-items-center justify-content-center py-8 gap-3"
        >
          <i class="pi pi-shopping-cart text-4xl text-color-secondary" />
          <p class="text-color-secondary text-sm m-0">السلة فارغة</p>
        </div>

        <!-- ملخص الأسعار -->
        <div class="px-3 pt-3 pb-2">
          <div class="surface-50 border-round-xl border-1 border-200 px-3 py-3">

            <template v-if="existingItems.length > 0 && items.length > 0">
              <div class="flex justify-content-between align-items-center mb-2">
                <span class="text-sm text-color-secondary">المبلغ الحالي</span>
                <span class="text-sm font-bold text-900">{{ existingTotal.toLocaleString() }} د.ع</span>
              </div>
              <div class="flex justify-content-between align-items-center mb-2">
                <span class="text-sm text-color-secondary">المبلغ الإضافي</span>
                <span class="text-sm font-bold text-green-600">+ {{ newTotal.toLocaleString() }} د.ع</span>
              </div>
              <Divider class="my-2" />
              <div class="flex justify-content-between align-items-center">
                <span class="font-bold text-base text-900">المبلغ الكلي</span>
                <span class="font-bold text-lg text-primary">{{ grandTotal.toLocaleString() }} د.ع</span>
              </div>
            </template>

            <template v-else>
              <div class="flex justify-content-between align-items-center">
                <span class="font-bold text-base text-900">الإجمالي</span>
                <span class="font-bold text-lg text-primary">{{ grandTotal.toLocaleString() }} د.ع</span>
              </div>
            </template>

          </div>
        </div>

        <!-- زر الإرسال -->
        <div class="px-3 pb-4 pt-1">
          <Button
            label="إرسال الطلب الجديد"
            icon="pi pi-check"
            class="w-full"
            :disabled="items.length === 0"
            @click="onConfirm"
          />
        </div>

      </div>
    </Drawer>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Drawer from 'primevue/drawer'
import Divider from 'primevue/divider'

// ── props ──────────────────────────────────────────────
const props = defineProps<{
  items: any[]
  existingItems: { id: number; name: string; quantity: number; price: number; total: number }[]
  updatingId?: number | null
  updatingAction?: string | null
}>()

// ── emits ──────────────────────────────────────────────
const emit = defineEmits<{
  increase:         [id: number]
  decrease:         [id: number]
  confirm:          []
  removeExisting:   [id: number]
  increaseExisting: [id: number, newQty: number]
  decreaseExisting: [id: number, newQty: number]
}>()

// ── state ──────────────────────────────────────────────
const drawerVisible = ref(false)

// ── computed ───────────────────────────────────────────
const totalCount = computed(() =>
  props.items.reduce((s, i) => s + i.quantity, 0)
)

const existingTotal = computed(() =>
  props.existingItems.reduce((s, i) => s + (i.total ?? i.price * i.quantity), 0)
)

const newTotal = computed(() =>
  props.items.reduce((s, i) => s + itemTotal(i), 0)
)

const grandTotal = computed(() => existingTotal.value + newTotal.value)

// ── helpers ────────────────────────────────────────────
function itemTotal(item: any) {
  const optionsTotal = item.selectedOptions?.reduce((s: number, o: any) => s + o.price, 0) ?? 0
  return (item.menuItem.price + optionsTotal) * item.quantity
}

// ── actions ────────────────────────────────────────────
function onConfirm() {
  drawerVisible.value = false
  emit('confirm')
}

// ── expose ─────────────────────────────────────────────
defineExpose({
  closeDrawer: () => { drawerVisible.value = false }
})
</script>