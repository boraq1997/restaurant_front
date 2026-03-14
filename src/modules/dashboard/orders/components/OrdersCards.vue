<!-- src/modules/dashboard/orders/components/OrdersCards.vue -->
<template>
  <div class="orders-grid">
    <div
      v-for="order in orders"
      :key="order.id"
      class="order-card surface-card border-round-xl overflow-hidden cursor-pointer"
      @click="$emit('select', order)"
    >
      <!-- شريط الحالة -->
      <div class="status-stripe" :class="statusStripe(order.invoiceStatus)" />

      <div class="p-3 flex flex-column gap-2">

        <!-- الطاولة + الحالة -->
        <div class="flex align-items-center justify-content-between">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-th-large text-xs text-primary" />
            <span class="font-bold text-sm text-900">طاولة {{ order.tableId }}</span>
            <span class="text-xs text-300 font-mono">#{{ order.id }}</span>
          </div>
          <Tag :severity="statusSeverity(order.invoiceStatus)" rounded>
            <span class="font-bold" style="font-size:0.65rem">{{ statusLabel(order.invoiceStatus) }}</span>
          </Tag>
        </div>

        <!-- المواد -->
        <div class="flex flex-wrap gap-1">
          <template v-if="validItems(order).length > 0">
            <span
              v-for="item in validItems(order).slice(0, 2)"
              :key="item.id"
              class="item-chip"
            >
              {{ item.menuItemName }} ×{{ item.quantity }}
            </span>
            <span v-if="validItems(order).length > 2" class="item-chip item-chip--more">
              +{{ validItems(order).length - 2 }}
            </span>
          </template>
          <span v-else class="text-xs text-400 italic">—</span>
        </div>

        <!-- المستخدم + طريقة الدفع -->
        <div class="flex align-items-center gap-2 text-xs text-400">
          <div v-if="order.username" class="flex align-items-center gap-1">
            <i class="pi pi-user text-xs" />
            <span>{{ order.username }}</span>
          </div>
          <div class="flex align-items-center gap-1">
            <i :class="paymentIcon(order.paymentMethod)" class="text-xs" />
            <span>{{ paymentLabel(order.paymentMethod) }}</span>
          </div>
        </div>

        <!-- التاريخ + المبلغ -->
        <div class="flex align-items-center justify-content-between border-top-1 border-100 pt-2 mt-1">
          <span class="text-xs text-400">{{ formatDate(order.createdAt) }} {{ formatTime(order.createdAt) }}</span>
          <div class="flex flex-column align-items-end gap-0">
            <span v-if="order.discountPrice > 0" class="text-xs text-400 line-through">
              {{ order.subTotalPrice?.toLocaleString() }} د.ع
            </span>
            <span class="font-bold text-primary">{{ order.finalPrice?.toLocaleString() }} د.ع</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag'
import { useOrderHelpers } from '../composables/useOrderHelpers'
import type { OrderDto } from '../types/orders.types'

defineProps<{ orders: OrderDto[] }>()
defineEmits<{ select: [order: OrderDto] }>()

const {
  formatDate, formatTime, validItems,
  statusLabel, statusSeverity, statusStripe,
  paymentLabel, paymentIcon,
} = useOrderHelpers()
</script>

<style scoped>
.orders-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.order-card {
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  transition: transform 0.15s, box-shadow 0.15s;
  border: 1px solid var(--p-surface-200);
}
.order-card:active { transform: scale(0.985); }

.status-stripe { height: 3px; }
:global(.stripe-blue)   { background: var(--p-blue-400); }
:global(.stripe-green)  { background: var(--p-green-500); }
:global(.stripe-red)    { background: var(--p-red-400); }
:global(.stripe-orange) { background: var(--p-orange-400); }

.item-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  background: var(--p-surface-100);
  color: var(--p-text-color-secondary);
  font-size: 0.72rem;
  white-space: nowrap;
}
.item-chip--more {
  background: var(--p-primary-50, #fff7ed);
  color: var(--p-primary-color);
  font-weight: 600;
}
</style>