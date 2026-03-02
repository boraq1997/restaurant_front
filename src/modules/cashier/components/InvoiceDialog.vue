<!-- src/modules/cashier/components/InvoiceDialog.vue -->

<template>
  <Dialog
    v-model:visible="visible"
    header="إتمام الدفع"
    :modal="true"
    :draggable="false"
    position="bottom"
    style="width: 100%; max-width: 480px; border-radius: 1rem 1rem 0 0; margin: 0;"
    :pt="{
      root: { class: 'surface-card' },
      header: { class: 'surface-card text-color' },
      content: { class: 'surface-card' },
      footer: { class: 'surface-card' },
    }"
    dir="rtl"
  >
    <template v-if="table?.order">

      <!-- المبلغ الكلي -->
      <div class="flex justify-content-between align-items-center mb-4 p-3 bg-primary border-round-xl">
        <span class="font-bold text-white text-base">الإجمالي</span>
        <span class="font-bold text-white text-2xl">{{ table.order.totalPrice.toLocaleString() }} د.ع</span>
      </div>

      <!-- طريقة الدفع -->
      <div class="mb-4">
        <p class="font-bold text-sm mb-2 m-0 text-color">طريقة الدفع</p>
        <div class="flex gap-2">
          <div
            v-for="method in paymentMethods"
            :key="method.value"
            class="flex-1 flex flex-column align-items-center justify-content-center gap-2 p-3 border-round-xl border-2 cursor-pointer transition-all transition-duration-200"
            :class="selectedMethod === method.value
              ? 'border-primary bg-primary-50'
              : 'surface-border surface-card'"
            @click="selectedMethod = method.value"
          >
            <i :class="[method.icon, 'text-xl', selectedMethod === method.value ? 'text-primary' : 'text-500']" />
            <span class="text-xs font-medium" :class="selectedMethod === method.value ? 'text-primary' : 'text-500'">
              {{ method.label }}
            </span>
          </div>
        </div>
      </div>

      <!-- خيار العملات (نقدي فقط) -->
      <div v-if="selectedMethod === 'cash'" class="flex flex-column gap-3">

        <!-- زر اختيار العملات -->
        <Button
          label="مساعدة في حساب العملات"
          icon="pi pi-wallet"
          severity="secondary"
          outlined
          class="w-full"
          @click="billsDialogVisible = true"
        />

        <!-- ملخص بعد اختيار العملات -->
        <Transition name="fade">
          <div
            v-if="receivedAmount > 0"
            class="flex flex-column gap-2 p-3 surface-50 border-round-lg border-1 surface-border"
          >
            <div class="flex justify-content-between align-items-center">
              <span class="text-sm text-500">المبلغ المستلم</span>
              <span class="font-bold text-sm text-900">{{ receivedAmount.toLocaleString() }} د.ع</span>
            </div>
            <div class="flex justify-content-between align-items-center">
              <span class="text-sm text-500">المبلغ المطلوب</span>
              <span class="font-bold text-sm text-900">{{ table.order.totalPrice.toLocaleString() }} د.ع</span>
            </div>
            <Divider class="my-1" />
            <div
              v-if="change > 0"
              class="flex justify-content-between align-items-center p-2 bg-green-50 border-round-lg"
            >
              <span class="text-sm text-green-700 font-bold">الباقي للزبون</span>
              <span class="font-bold text-lg text-green-700">{{ change.toLocaleString() }} د.ع</span>
            </div>
            <div
              v-else-if="change === 0"
              class="flex align-items-center justify-content-center gap-2 p-2 bg-green-50 border-round-lg"
            >
              <i class="pi pi-check-circle text-green-600" />
              <span class="text-sm text-green-700 font-bold">المبلغ مطابق تماماً</span>
            </div>
          </div>
        </Transition>

      </div>

    </template>

    <template #footer>
      <div class="flex gap-2 w-full">
        <Button
          label="إلغاء"
          severity="secondary"
          outlined
          class="flex-1"
          @click="visible = false"
        />
        <Button
          label="تأكيد الدفع"
          icon="pi pi-check"
          class="flex-1"
          :disabled="!canConfirm"
          @click="confirmPayment"
        />
      </div>
    </template>

  </Dialog>

  <!-- Bills Dialog -->
  <BillsDialog
    v-model="billsDialogVisible"
    :total-price="table?.order?.totalPrice ?? 0"
    @confirm="onBillsConfirm"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import BillsDialog from './BillsDialog.vue'
import type { CashierTable, PaymentMethod } from '../types/cashier.types'

const props = defineProps<{
  modelValue: boolean
  table: CashierTable | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [method: PaymentMethod]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const selectedMethod     = ref<PaymentMethod>('cash')
const receivedAmount     = ref(0)
const billsDialogVisible = ref(false)

watch(visible, (val) => {
  if (val) {
    selectedMethod.value = 'cash'
    receivedAmount.value = 0
  }
})

const paymentMethods = [
  { value: 'cash'   as PaymentMethod, label: 'نقدي',     icon: 'pi pi-wallet' },
  { value: 'card'   as PaymentMethod, label: 'بطاقة',    icon: 'pi pi-credit-card' },
  { value: 'online' as PaymentMethod, label: 'إلكتروني', icon: 'pi pi-mobile' },
]

const change = computed(() =>
  receivedAmount.value - (props.table?.order?.totalPrice ?? 0)
)

const canConfirm = computed(() => {
  if (!props.table?.order) return false
  if (selectedMethod.value === 'cash' && receivedAmount.value > 0) {
    return receivedAmount.value >= props.table.order.totalPrice
  }
  return true
})

function onBillsConfirm(amount: number) {
  receivedAmount.value = amount
}

function confirmPayment() {
  emit('confirm', selectedMethod.value)
  visible.value = false
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>