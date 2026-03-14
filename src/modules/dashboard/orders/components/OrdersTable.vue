<!-- src/modules/dashboard/orders/components/OrdersTable.vue -->
<template>
  <div class="surface-card border-round-xl border-1 border-200 overflow-hidden shadow-1">
    <DataTable
      :value="orders"
      :loading="loading"
      stripedRows
      responsiveLayout="scroll"
      class="orders-table"
      @row-click="$emit('select', $event.data)"
    >
      <!-- رقم الفاتورة -->
      <Column header="#" style="width: 70px">
        <template #body="{ data }">
          <span class="font-mono text-xs text-400">#{{ data.id }}</span>
        </template>
      </Column>

      <!-- الطاولة -->
      <Column header="الطاولة" style="width: 100px">
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-th-large text-xs text-primary" />
            <span class="font-bold text-sm text-900">{{ data.tableId }}</span>
          </div>
        </template>
      </Column>

      <!-- الحالة -->
      <Column header="الحالة" style="width: 110px">
        <template #body="{ data }">
          <Tag :severity="statusSeverity(data.invoiceStatus)" rounded>
            <span class="text-xs font-bold">{{ statusLabel(data.invoiceStatus) }}</span>
          </Tag>
        </template>
      </Column>

      <!-- طريقة الدفع -->
      <Column header="طريقة الدفع" style="width: 120px">
        <template #body="{ data }">
          <div class="flex align-items-center gap-1 text-sm text-600">
            <i :class="paymentIcon(data.paymentMethod)" class="text-xs" />
            <span>{{ paymentLabel(data.paymentMethod) }}</span>
          </div>
        </template>
      </Column>

      <!-- المواد -->
      <Column header="المواد">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-1">
            <template v-if="validItems(data).length > 0">
              <span
                v-for="item in validItems(data).slice(0, 3)"
                :key="item.id"
                class="item-chip"
              >
                {{ item.menuItemName }} ×{{ item.quantity }}
              </span>
              <span v-if="validItems(data).length > 3" class="item-chip item-chip--more">
                +{{ validItems(data).length - 3 }} أخرى
              </span>
            </template>
            <span v-else class="text-xs text-400 italic">—</span>
          </div>
        </template>
      </Column>

      <!-- المجموع -->
      <Column header="المجموع" style="width: 130px">
        <template #body="{ data }">
          <div class="flex flex-column gap-1">
            <span v-if="data.discountPrice > 0" class="text-xs text-400 line-through">
              {{ data.subTotalPrice?.toLocaleString() }} د.ع
            </span>
            <span class="font-bold text-sm text-primary">
              {{ data.finalPrice?.toLocaleString() }} د.ع
            </span>
          </div>
        </template>
      </Column>

      <!-- الخصم -->
      <Column header="الخصم" style="width: 100px">
        <template #body="{ data }">
          <span v-if="data.discountPrice > 0" class="text-xs font-bold text-orange-500">
            - {{ data.discountPrice?.toLocaleString() }} د.ع
          </span>
          <span v-else class="text-xs text-300">—</span>
        </template>
      </Column>

      <!-- التاريخ -->
      <Column header="التاريخ والوقت" style="width: 150px">
        <template #body="{ data }">
          <div class="flex flex-column gap-1">
            <span class="text-xs text-900 font-medium">{{ formatDate(data.createdAt) }}</span>
            <span class="text-xs text-400">{{ formatTime(data.createdAt) }}</span>
          </div>
        </template>
      </Column>

      <!-- المستخدم -->
      <Column header="المستخدم" style="width: 120px">
        <template #body="{ data }">
          <span class="text-xs text-600">{{ data.username || '—' }}</span>
        </template>
      </Column>

      <!-- إجراءات -->
      <Column header="" style="width: 60px">
        <template #body="{ data }">
          <Button
            icon="pi pi-eye"
            text rounded size="small" severity="secondary"
            v-tooltip.top="'عرض التفاصيل'"
            @click.stop="$emit('select', data)"
          />
        </template>
      </Column>

    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column    from 'primevue/column'
import Button    from 'primevue/button'
import Tag       from 'primevue/tag'
import { useOrderHelpers } from '../composables/useOrderHelpers'
import type { OrderDto } from '../types/orders.types'

defineProps<{
  orders:  OrderDto[]
  loading: boolean
}>()

defineEmits<{
  select: [order: OrderDto]
}>()

const {
  formatDate, formatTime, validItems,
  statusLabel, statusSeverity,
  paymentLabel, paymentIcon,
} = useOrderHelpers()
</script>

<style scoped>
.orders-table :deep(.p-datatable-row-odd) {
  background: var(--p-surface-50);
}
.orders-table :deep(tr:hover) {
  background: var(--p-surface-100) !important;
  cursor: pointer;
}
.orders-table :deep(th) {
  background: var(--p-surface-50) !important;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--p-text-color-secondary);
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--p-surface-200);
}
.orders-table :deep(td) {
  padding: 0.6rem 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid var(--p-surface-100);
}

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