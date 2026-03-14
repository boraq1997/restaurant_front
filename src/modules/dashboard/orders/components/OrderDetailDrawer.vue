<!-- src/modules/dashboard/orders/components/OrderDetailDrawer.vue -->
<template>
  <Drawer
    :visible="modelValue"
    @update:visible="$emit('update:modelValue', $event)"
    position="left"
    style="width: 100%; max-width: 500px;"
    :modal="true"
    dir="rtl"
  >
    <template #header>
      <div class="flex align-items-center gap-3 w-full">
        <div
          class="w-2rem h-2rem border-round-lg flex align-items-center justify-content-center flex-shrink-0"
          :class="statusBg(order?.invoiceStatus)"
        >
          <i class="pi pi-receipt text-xs" :class="statusIconColor(order?.invoiceStatus)" />
        </div>
        <div>
          <p class="font-bold m-0 text-sm text-900 line-height-1">فاتورة #{{ order?.id }}</p>
          <span class="text-xs text-500">طاولة {{ order?.tableId }}</span>
        </div>
        <Tag
          :severity="statusSeverity(order?.invoiceStatus)"
          rounded
          class="mr-auto"
        >
          <span class="text-xs font-bold">{{ statusLabel(order?.invoiceStatus) }}</span>
        </Tag>
      </div>
    </template>

    <div v-if="order" class="flex flex-column gap-4 pb-4">

      <!-- ── معلومات عامة ───────────────────────────── -->
      <div class="surface-50 border-round-xl p-3 border-1 border-200 flex flex-column gap-3">
        <p class="font-bold text-sm text-900 m-0">معلومات الفاتورة</p>

        <div class="grid m-0">
          <div class="col-6 flex flex-column gap-1 py-1">
            <span class="text-xs text-400">رقم الفاتورة</span>
            <span class="text-sm font-bold text-900 font-mono">#{{ order.id }}</span>
          </div>
          <div class="col-6 flex flex-column gap-1 py-1">
            <span class="text-xs text-400">رقم الطاولة</span>
            <span class="text-sm font-bold text-900">طاولة {{ order.tableId }}</span>
          </div>
          <div class="col-6 flex flex-column gap-1 py-1">
            <span class="text-xs text-400">طريقة الدفع</span>
            <div class="flex align-items-center gap-1">
              <i :class="paymentIcon(order.paymentMethod)" class="text-xs text-500" />
              <span class="text-sm font-bold text-900">{{ paymentLabel(order.paymentMethod) }}</span>
            </div>
          </div>
          <div class="col-6 flex flex-column gap-1 py-1">
            <span class="text-xs text-400">نوع الطلب</span>
            <span class="text-sm font-bold text-900">{{ orderTypeLabel(order.orderType) }}</span>
          </div>
          <div class="col-6 flex flex-column gap-1 py-1">
            <span class="text-xs text-400">المستخدم</span>
            <span class="text-sm font-bold text-900">{{ order.username || '—' }}</span>
          </div>
          <div class="col-6 flex flex-column gap-1 py-1">
            <span class="text-xs text-400">التاريخ والوقت</span>
            <div>
              <span class="text-sm font-bold text-900 block">{{ formatDate(order.createdAt) }}</span>
              <span class="text-xs text-500">{{ formatTime(order.createdAt) }}</span>
            </div>
          </div>
        </div>

        <div v-if="order.notes" class="p-2 surface-100 border-round-lg">
          <span class="text-xs text-400 block mb-1">ملاحظات</span>
          <span class="text-sm text-700">{{ order.notes }}</span>
        </div>
      </div>

      <!-- ── المواد ──────────────────────────────────── -->
      <div>
        <p class="font-bold text-sm text-900 mb-3 m-0">
          المواد المطلوبة
          <span class="text-400 font-normal text-xs mr-1">
            ({{ validItems(order).length }} صنف)
          </span>
        </p>

        <div class="flex flex-column gap-2">
          <div
            v-for="item in order.invoiceItemsDto"
            :key="item.id"
            class="surface-50 border-round-xl border-1 border-200 overflow-hidden"
          >
            <div class="flex align-items-start justify-content-between px-3 py-3">
              <div class="flex-1 min-w-0 ml-3">
                <p class="m-0 font-bold text-sm text-900">
                  {{ item.menuItemName || 'صنف غير معروف' }}
                </p>
                <div v-if="item.selectedOptionsDto?.length" class="flex flex-wrap gap-1 mt-1">
                  <span
                    v-for="opt in item.selectedOptionsDto"
                    :key="opt.id"
                    class="text-xs bg-primary-50 text-primary px-2 py-1 border-round-lg"
                  >
                    {{ opt.name }} +{{ opt.price?.toLocaleString() }}
                  </span>
                </div>
                <p v-if="item.notes" class="m-0 text-xs text-orange-500 mt-1">
                  📝 {{ item.notes }}
                </p>
              </div>
              <div class="flex align-items-center gap-3 flex-shrink-0">
                <span class="text-xs text-400 surface-100 px-2 py-1 border-round font-bold">
                  ×{{ item.quantity }}
                </span>
                <span class="text-sm font-bold text-primary white-space-nowrap">
                  {{ item.totalPrice?.toLocaleString() }} د.ع
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── ملخص المبالغ ───────────────────────────── -->
      <div class="surface-50 border-round-xl p-4 border-1 border-200 flex flex-column gap-2">
        <p class="font-bold text-sm text-900 m-0 mb-2">ملخص المبالغ</p>

        <div class="flex justify-content-between align-items-center">
          <span class="text-sm text-500">المجموع الجزئي</span>
          <span class="text-sm font-medium text-700">
            {{ order.subTotalPrice?.toLocaleString() }} د.ع
          </span>
        </div>

        <div v-if="(order.discountPrice ?? 0) > 0" class="flex justify-content-between align-items-center">
          <span class="text-sm text-500">الخصم</span>
          <span class="text-sm font-bold text-orange-500">
            - {{ order.discountPrice?.toLocaleString() }} د.ع
          </span>
        </div>

        <Divider class="my-1" />

        <div class="flex justify-content-between align-items-center">
          <span class="font-bold text-base text-900">الإجمالي النهائي</span>
          <span class="font-bold text-xl text-primary">
            {{ order.finalPrice?.toLocaleString() }} د.ع
          </span>
        </div>
      </div>

    </div>
  </Drawer>
</template>

<script setup lang="ts">
import Drawer  from 'primevue/drawer'
import Tag     from 'primevue/tag'
import Divider from 'primevue/divider'
import { useOrderHelpers } from '../composables/useOrderHelpers'
import type { OrderDto } from '../types/orders.types'

defineProps<{
  modelValue: boolean
  order:      OrderDto | null
}>()

defineEmits<{
  'update:modelValue': [v: boolean]
}>()

const {
  formatDate, formatTime, validItems,
  statusLabel, statusSeverity, statusBg, statusIconColor,
  paymentLabel, paymentIcon,
  orderTypeLabel,
} = useOrderHelpers()
</script>