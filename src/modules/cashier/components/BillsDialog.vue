<!-- src/modules/cashier/components/BillsDialog.vue -->

<template>
  <Dialog
  v-model:visible="visible"
  header="اختيار الأوراق النقدية"
  :modal="true"
  :draggable="false"
  style="width: 100vw; height: 100dvh; max-width: 100vw; max-height: 100dvh; margin: 0; border-radius: 0; top: 0; left: 0;"
  :pt="{
    root: { style: 'width: 100vw; height: 100dvh; max-height: 100dvh; margin: 0; border-radius: 0;' },
    mask: { style: 'padding: 0;' },
    header: { class: 'surface-card border-bottom-1 border-200' },
    content: { class: 'surface-ground p-3 overflow-y-auto flex-1', style: 'height: calc(100dvh - 120px);' },
    footer: { class: 'surface-card border-top-1 border-200 p-3' },
  }"
  dir="rtl"
>

    <!-- ملخص المبالغ -->
    <div class="flex gap-2 mb-4 sticky top-0 z-1 pt-1 pb-2 surface-ground">
      <div class="flex-1 p-3 bg-primary border-round-xl flex flex-column align-items-center gap-1">
        <span class="text-xs text-white-alpha-70">المطلوب</span>
        <span class="font-bold text-white text-base line-height-1">
          {{ totalPrice.toLocaleString() }}
        </span>
        <span class="text-xs text-white-alpha-70">د.ع</span>
      </div>

      <div
        class="flex-1 p-3 border-round-xl flex flex-column align-items-center gap-1 transition-all transition-duration-300"
        :class="billsTotal > 0
          ? billsTotal >= totalPrice ? 'bg-green-500' : 'bg-orange-400'
          : 'surface-card border-1 surface-border'"
      >
        <span
          class="text-xs"
          :class="billsTotal > 0 ? 'text-white-alpha-70' : 'text-500'"
        >
          المستلم
        </span>
        <span
          class="font-bold text-base line-height-1"
          :class="billsTotal > 0 ? 'text-white' : 'text-900'"
        >
          {{ billsTotal.toLocaleString() }}
        </span>
        <span
          class="text-xs"
          :class="billsTotal > 0 ? 'text-white-alpha-70' : 'text-500'"
        >
          د.ع
        </span>
      </div>

      <div
        v-if="billsTotal > 0"
        class="flex-1 p-3 border-round-xl flex flex-column align-items-center gap-1"
        :class="billsChange >= 0
          ? 'bg-green-50 border-1 border-green-300'
          : 'bg-red-50 border-1 border-red-300'"
      >
        <span
          class="text-xs font-medium"
          :class="billsChange >= 0 ? 'text-green-600' : 'text-red-500'"
        >
          {{ billsChange >= 0 ? 'الباقي' : 'ناقص' }}
        </span>
        <span
          class="font-bold text-base line-height-1"
          :class="billsChange >= 0 ? 'text-green-700' : 'text-red-600'"
        >
          {{ Math.abs(billsChange).toLocaleString() }}
        </span>
        <span
          class="text-xs"
          :class="billsChange >= 0 ? 'text-green-600' : 'text-red-500'"
        >
          د.ع
        </span>
      </div>
    </div>

    <!-- الأوراق النقدية -->
    <div class="grid m-0">
      <div
        v-for="bill in iraqiBills"
        :key="bill.value"
        class="col-6 sm:col-4 md:col-3 p-2"
      >
        <div
          class="border-round-xl overflow-hidden cursor-pointer transition-all transition-duration-200"
          :class="selectedBills[bill.value]
            ? 'shadow-4'
            : 'shadow-1'"
          @click="addBill(bill.value)"
        >
          <!-- صورة الورقة -->
          <div class="relative" style="aspect-ratio: 2/1;">
            <img
              :src="bill.image"
              :alt="bill.label"
              class="w-full h-full"
              style="object-fit: cover;"
              @error="(e) => ((e.target as HTMLImageElement).src = DEFAULT_IMAGE)"

            />
            <!-- overlay + عداد -->
            <Transition name="fade">
              <div
                v-if="selectedBills[bill.value]"
                class="absolute top-0 left-0 w-full h-full flex align-items-center justify-content-center"
                style="background: rgba(0,0,0,0.35);"
              >
                <span
                  class="bg-primary text-white font-bold border-round-full flex align-items-center justify-content-center text-xl"
                  style="width: 2.5rem; height: 2.5rem;"
                >
                  {{ selectedBills[bill.value] }}
                </span>
              </div>
            </Transition>
          </div>

          <!-- أسفل الكارد -->
          <div
            class="flex align-items-center justify-content-between px-2 py-2 transition-all transition-duration-200"
            :class="selectedBills[bill.value] ? 'bg-primary' : 'surface-card'"
          >
            <span
              class="font-bold text-sm"
              :class="selectedBills[bill.value] ? 'text-white' : 'text-900'"
            >
              {{ bill.label }}
            </span>
            <div v-if="selectedBills[bill.value]" class="flex align-items-center gap-1">
              <Button
                icon="pi pi-minus"
                rounded
                text
                size="small"
                class="text-white w-1rem h-1rem"
                @click.stop="removeBill(bill.value)"
              />
              <Button
                icon="pi pi-plus"
                rounded
                text
                size="small"
                class="text-white w-1rem h-1rem"
                @click.stop="addBill(bill.value)"
              />
            </div>
          </div>

        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-2 w-full">
        <Button
          label="إلغاء"
          severity="secondary"
          outlined
          class="flex-1"
          @click="cancel"
        />
        <Button
          label="تأكيد"
          icon="pi pi-check"
          class="flex-1"
          :disabled="billsTotal === 0"
          @click="confirm"
        />
      </div>
    </template>

  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const props = defineProps<{
  modelValue: boolean
  totalPrice: number
}>()
const DEFAULT_IMAGE = '/defaultImages/defaultFood.jpeg'

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [amount: number]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const selectedBills = ref<Record<number, number>>({})

const iraqiBills = [
  { value: 250,   label: '250 د.ع',    image: '/bills/250.jpg' },
  { value: 500,   label: '500 د.ع',    image: '/bills/500.jpg' },
  { value: 1000,  label: '1,000 د.ع',  image: '/bills/1000.jpg' },
  { value: 5000,  label: '5,000 د.ع',  image: '/bills/5000.jpg' },
  { value: 10000, label: '10,000 د.ع', image: '/bills/10000.jpg' },
  { value: 25000, label: '25,000 د.ع', image: '/bills/25000.jpg' },
  { value: 50000, label: '50,000 د.ع', image: '/bills/50000.jpg' },
]

const billsTotal = computed(() =>
  Object.entries(selectedBills.value).reduce(
    (sum, [bill, count]) => sum + Number(bill) * count, 0
  )
)

const billsChange = computed(() => billsTotal.value - props.totalPrice)

function addBill(value: number) {
  selectedBills.value[value] = (selectedBills.value[value] ?? 0) + 1
}

function removeBill(value: number) {
  if (!selectedBills.value[value]) return
  if (selectedBills.value[value] === 1) {
    delete selectedBills.value[value]
  } else {
    selectedBills.value[value]--
  }
}

// function onBillImageError(e: Event, value: number) {
//   const img = e.target as HTMLImageElement
//   img.src = `https://placehold.co/200x100?text=${value.toLocaleString()}`
// }

function confirm() {
  emit('confirm', billsTotal.value)
  selectedBills.value = {}
  visible.value = false
}

function cancel() {
  selectedBills.value = {}
  visible.value = false
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>