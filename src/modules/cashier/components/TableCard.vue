<!-- src/modules/cashier/components/TableCard.vue -->

<template>
  <Card
    class="w-full border-1 transition-all transition-duration-300 overflow-hidden"
    :class="[cardClass, hasOrder ? 'cursor-pointer' : 'opacity-60']"
    :pt="{ root: { class: cardBgClass }, content: { class: 'p-2' }, header: { class: 'pb-0' } }"
    @click="hasOrder ? emit('click', table) : undefined"
  >
    <template #header>
      <div class="flex align-items-center justify-content-between px-3 pt-3">
        <Tag :severity="paymentSeverity" rounded>
          <span class="font-bold text-xs">{{ paymentLabel }}</span>
        </Tag>
        <span class="text-xs font-bold surface-100 px-2 py-1 border-round">#{{ table.number }}</span>
      </div>
    </template>

    <template #content>

      <!-- شكل الطاولة -->
      <div class="flex justify-content-center my-2">
        <div class="flex flex-column align-items-center gap-1">
          <div class="flex gap-1">
            <div
              v-for="i in topChairs" :key="'t'+i"
              class="border-round-top-md border-1"
              :class="chairClass"
              style="width:1rem; height:0.5rem;"
            />
          </div>
          <div
            class="flex align-items-center justify-content-center border-round-lg border-2"
            :class="tableBodyClass"
            style="width:5.5rem; height:3rem;"
          >
            <div class="flex flex-column align-items-center gap-1">
              <i class="pi pi-th-large text-lg" :class="tableIconClass" />
              <span class="text-xs font-bold" :class="tableIconClass">{{ table.name }}</span>
            </div>
          </div>
          <div class="flex gap-1">
            <div
              v-for="i in bottomChairs" :key="'b'+i"
              class="border-round-bottom-md border-1"
              :class="chairClass"
              style="width:1rem; height:0.5rem;"
            />
          </div>
        </div>
      </div>

      <!-- اسم الطاولة -->
      <p
        class="text-center font-bold text-sm m-0 mb-2"
        :class="hasUnpaidOrder ? 'text-white' : 'text-900'"
      >
        {{ table.name }}
      </p>

      <Divider class="my-1" :class="hasUnpaidOrder ? 'border-white-alpha-30' : ''" />

      <!-- المبلغ أو لا يوجد طلب -->
      <div style="min-height: 2.5rem;">
        <div v-if="table.order" class="flex flex-column gap-1">
          <div class="flex align-items-center justify-content-between">
            <span class="text-xs" :class="hasUnpaidOrder ? 'text-white-alpha-70' : 'text-500'">
              المبلغ الكلي
            </span>
            <span class="font-bold text-sm" :class="hasUnpaidOrder ? 'text-white' : 'text-primary'">
              {{ table.order.totalPrice.toLocaleString() }} د.ع
            </span>
          </div>
          <div class="flex align-items-center justify-content-between">
            <span class="text-xs" :class="hasUnpaidOrder ? 'text-white-alpha-70' : 'text-500'">
              عدد الأصناف
            </span>
            <span class="text-xs font-medium" :class="hasUnpaidOrder ? 'text-white-alpha-70' : 'text-700'">
              {{ table.order.items.length }} صنف
            </span>
          </div>
        </div>

        <!-- فارغة -->
        <div v-else class="flex align-items-center justify-content-center gap-1 py-1 border-round bg-surface-100">
          <i class="pi pi-minus-circle text-xs text-400" />
          <span class="text-xs font-semibold text-400">لا يوجد طلب</span>
        </div>
      </div>

    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'
import type { CashierTable } from '../types/cashier.types'

const props = defineProps<{ table: CashierTable }>()
const emit = defineEmits<{ click: [table: CashierTable] }>()

const topChairs    = computed(() => Math.ceil(props.table.capacity / 2))
const bottomChairs = computed(() => Math.floor(props.table.capacity / 2))
const hasOrder     = computed(() => !!props.table.order)
const hasUnpaidOrder = computed(() => props.table.order && props.table.paymentStatus === 'unpaid')

const cardClass = computed(() => {
  if (!hasOrder.value)          return 'border-200 shadow-1'
  if (hasUnpaidOrder.value)     return 'border-primary shadow-2'
  if (props.table.paymentStatus === 'paid') return 'border-green-400 shadow-1'
  return 'border-200 shadow-1'
})

const cardBgClass = computed(() => {
  if (!hasOrder.value)          return 'surface-100'
  if (hasUnpaidOrder.value)     return 'bg-primary'
  if (props.table.paymentStatus === 'paid') return 'bg-green-50'
  return ''
})

const chairClass = computed(() => {
  if (hasUnpaidOrder.value) return 'bg-white-alpha-30 border-white-alpha-40'
  return 'surface-100 surface-border'
})

const tableBodyClass = computed(() => {
  if (!hasOrder.value)          return 'border-200 surface-card'
  if (hasUnpaidOrder.value)     return 'border-white bg-white-alpha-20'
  if (props.table.paymentStatus === 'paid') return 'border-green-400 bg-green-50'
  return 'border-200 surface-card'
})

const tableIconClass = computed(() => {
  if (hasUnpaidOrder.value)     return 'text-white'
  if (props.table.paymentStatus === 'paid') return 'text-green-600'
  return 'text-400'
})

const paymentSeverity = computed(() => {
  if (!hasOrder.value) return 'secondary'
  return props.table.paymentStatus === 'unpaid' ? 'danger' : 'success'
})

const paymentLabel = computed(() => {
  if (!hasOrder.value) return 'فارغة'
  return props.table.paymentStatus === 'unpaid' ? 'غير مدفوع' : 'مدفوع'
})
</script>