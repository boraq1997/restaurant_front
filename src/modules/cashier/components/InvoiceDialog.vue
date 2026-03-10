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

      <!-- قسم الخصم -->
      <div class="mb-4">
        <div class="flex align-items-center justify-content-between mb-2">
          <p class="font-bold text-sm m-0 text-color">خصم (اختياري)</p>
          <div class="flex gap-1 surface-100 border-round-lg p-1">
            <button
              class="discount-type-btn"
              :class="{ active: discountType === 0 }"
              @click="discountType = 0; discountAmount = null"
            >
              <i class="pi pi-percentage text-xs" /> نسبة
            </button>
            <button
              class="discount-type-btn"
              :class="{ active: discountType === 1 }"
              @click="discountType = 1; discountAmount = null"
            >
              <i class="pi pi-wallet text-xs" /> مبلغ
            </button>
          </div>
        </div>

        <div class="flex align-items-center gap-2">
          <InputNumber
            v-model="discountAmount"
            :placeholder="discountType === 0 ? 'مثال: 10' : 'مثال: 5000'"
            :suffix="discountType === 0 ? ' %' : ' د.ع'"
            :min="0"
            :max="discountType === 0 ? 100 : table.order.totalPrice"
            fluid
            class="flex-1"
          />
          <Button
            v-if="discountAmount"
            icon="pi pi-times"
            severity="secondary"
            text
            rounded
            size="small"
            @click="discountAmount = null"
          />
        </div>

        <!-- معاينة الخصم -->
        <Transition name="fade">
          <div
            v-if="discountAmount && discountValue > 0"
            class="mt-2 p-2 bg-orange-50 border-1 border-orange-200 border-round-lg flex justify-content-between align-items-center"
          >
            <span class="text-xs text-orange-700 font-medium">
              الخصم ({{ discountType === 0 ? discountAmount + '%' : discountAmount?.toLocaleString() + ' د.ع' }})
            </span>
            <span class="text-xs font-bold text-orange-700">
              - {{ discountValue.toLocaleString() }} د.ع
            </span>
          </div>
        </Transition>

        <!-- المبلغ النهائي بعد الخصم -->
        <Transition name="fade">
          <div
            v-if="discountValue > 0"
            class="mt-2 p-3 bg-green-50 border-1 border-green-300 border-round-xl flex justify-content-between align-items-center"
          >
            <span class="font-bold text-green-800 text-sm">المبلغ بعد الخصم</span>
            <span class="font-bold text-xl text-green-700">{{ finalPrice.toLocaleString() }} د.ع</span>
          </div>
        </Transition>
      </div>

      <!-- خيار العملات (نقدي فقط) -->
      <div v-if="selectedMethod === 'cash'" class="flex flex-column gap-3">

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
              <span class="font-bold text-sm text-900">{{ finalPrice.toLocaleString() }} د.ع</span>
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
    :total-price="finalPrice"
    @confirm="onBillsConfirm"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import InputNumber from 'primevue/inputnumber'
import BillsDialog from './BillsDialog.vue'
import type { CashierTable, PaymentMethod } from '../types/cashier.types'

const props = defineProps<{
  modelValue: boolean
  table: CashierTable | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [payload: { method: PaymentMethod; discountType: number; discountAmount: number | null; finalPrice: number }]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const selectedMethod     = ref<PaymentMethod>('cash')
const receivedAmount     = ref(0)
const billsDialogVisible = ref(false)
const discountType       = ref<0 | 1>(0)   // 0 = نسبة، 1 = مبلغ ثابت
const discountAmount     = ref<number | null>(null)

watch(visible, (val) => {
  if (val) {
    selectedMethod.value = 'cash'
    receivedAmount.value = 0
    discountType.value   = 0
    discountAmount.value = null
  }
})

const paymentMethods = [
  { value: 'cash'   as PaymentMethod, label: 'نقدي',     icon: 'pi pi-wallet' },
  { value: 'card'   as PaymentMethod, label: 'بطاقة',    icon: 'pi pi-credit-card' },
  { value: 'online' as PaymentMethod, label: 'إلكتروني', icon: 'pi pi-mobile' },
]

// حساب قيمة الخصم
const discountValue = computed(() => {
  if (!discountAmount.value || !props.table?.order) return 0
  const total = props.table.order.totalPrice
  if (discountType.value === 0) {
    // نسبة مئوية
    return Math.round((total * discountAmount.value) / 100)
  } else {
    // مبلغ ثابت
    return Math.min(discountAmount.value, total)
  }
})

// المبلغ النهائي بعد الخصم
const finalPrice = computed(() => {
  if (!props.table?.order) return 0
  return Math.max(0, props.table.order.totalPrice - discountValue.value)
})

const change = computed(() => receivedAmount.value - finalPrice.value)

const canConfirm = computed(() => {
  if (!props.table?.order) return false
  if (selectedMethod.value === 'cash' && receivedAmount.value > 0) {
    return receivedAmount.value >= finalPrice.value
  }
  return true
})

function onBillsConfirm(amount: number) {
  receivedAmount.value = amount
}

function confirmPayment() {
  emit('confirm', {
    method:         selectedMethod.value,
    discountType:   discountType.value,
    discountAmount: discountAmount.value ?? null,
    finalPrice:     finalPrice.value,
  })
  visible.value = false
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.discount-type-btn {
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--p-text-color-secondary);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.discount-type-btn.active {
  background: var(--p-surface-0);
  color: var(--p-primary-color);
  font-weight: 700;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}
</style>