<template>
  <Dialog
    v-model:visible="visible"
    :header="item ? 'تعديل المادة' : 'مادة جديدة'"
    :modal="true" :draggable="false"
    :style="{ width: '420px' }" dir="rtl"
  >
    <div class="flex flex-column gap-3 pt-2">

      <!-- الاسم -->
      <div class="flex flex-column gap-2">
        <label class="font-medium text-sm">الاسم <span class="text-red-500">*</span></label>
        <InputText
          v-model="form.name"
          fluid
          :class="{ 'p-invalid': errors.name }"
        />
        <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
      </div>

      <!-- الوصف -->
      <div class="flex flex-column gap-2">
        <label class="font-medium text-sm">الوصف</label>
        <Textarea v-model="form.description" :rows="2" fluid />
      </div>

      <!-- الصورة -->
      <div class="flex flex-column gap-2">
        <label class="font-medium text-sm">رابط الصورة</label>
        <InputText v-model="form.image" placeholder="https://..." fluid />
        <img
          v-if="form.image"
          :src="form.image"
          class="border-round-lg"
          style="height:70px; object-fit:cover; width:100%"
        />
      </div>

      <!-- السعر والتكلفة -->
      <div class="grid m-0 gap-2">
        <div class="col flex flex-column gap-2 p-0">
          <label class="font-medium text-sm">السعر <span class="text-red-500">*</span></label>
          <InputNumber
            v-model="form.price"
            fluid :min="0"
            :class="{ 'p-invalid': errors.price }"
          />
          <small v-if="errors.price" class="text-red-500">{{ errors.price }}</small>
        </div>
        <div class="col flex flex-column gap-2 p-0">
          <label class="font-medium text-sm">التكلفة</label>
          <InputNumber v-model="form.cost" fluid :min="0" />
        </div>
      </div>

      <!-- الطابعة الخاصة (اختيارية) -->
      <div class="flex flex-column gap-2">
        <label class="font-medium text-sm">
          طابعة خاصة
          <span class="text-xs text-400 font-normal mr-1">(اختياري - يستخدم طابعة الفئة إن لم تُحدد)</span>
        </label>
        <Select
          v-model="form.specificPrinterId"
          :options="printerOptions"
          option-label="label"
          option-value="value"
          placeholder="بدون طابعة خاصة"
          :show-clear="true"
          fluid
        />
      </div>

      <!-- متاح للطلب -->
      <div class="flex align-items-center justify-content-between">
        <label class="font-medium text-sm">متاح للطلب</label>
        <ToggleSwitch v-model="form.isAvailable" />
      </div>

    </div>

    <template #footer>
      <div class="flex gap-2 justify-content-end">
        <Button label="إلغاء" severity="secondary" outlined @click="visible = false" />
        <Button
          :label="item ? 'حفظ' : 'إضافة'"
          icon="pi pi-check"
          :loading="loading"
          @click="handleSave"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import ToggleSwitch from 'primevue/toggleswitch'
import Button from 'primevue/button'
import type { MenuItem } from '../../../../types/menu.types'

const props = defineProps<{
  modelValue: boolean
  item?: MenuItem | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [v: boolean]
  save: [form: any]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

// ── أرقام الطابعات (مؤقتة - يُستبدل بـ API لاحقاً) ──
const printerOptions = [
  { label: 'طابعة 1', value: 1 },
  { label: 'طابعة 2', value: 2 },
  { label: 'طابعة 3', value: 3 },
  { label: 'طابعة 4', value: 4 },
  { label: 'طابعة 5', value: 5 },
]

const emptyForm = () => ({
  name:              '',
  description:       '',
  image:             '',
  price:             0,
  cost:              null as number | null,
  specificPrinterId: null as number | null,
  isAvailable:       true,
})

const form   = ref(emptyForm())
const errors = reactive({ name: '', price: '' })

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    errors.name  = ''
    errors.price = ''
    form.value = props.item
      ? {
          name:              props.item.name,
          description:       props.item.description ?? '',
          image:             (props.item as any).image ?? '',
          price:             props.item.price,
          cost:              props.item.cost ?? null,
          // ✅ لا نرسل 0 - نتركها null إذا لم تكن محددة
          specificPrinterId: props.item.specificPrinterId
            ? props.item.specificPrinterId
            : null,
          isAvailable: props.item.isAvailable,
        }
      : emptyForm()
  },
)

function validate() {
  errors.name  = ''
  errors.price = ''
  let valid = true
  if (!form.value.name.trim()) {
    errors.name = 'اسم المادة مطلوب'
    valid = false
  }
  if (!form.value.price || form.value.price <= 0) {
    errors.price = 'السعر مطلوب'
    valid = false
  }
  return valid
}

function handleSave() {
  if (!validate()) return
  emit('save', {
    ...form.value,
    name:              form.value.name.trim(),
    // ✅ إرسال null وليس 0 عندما لا تكون الطابعة محددة
    specificPrinterId: form.value.specificPrinterId ?? null,
  })
}
</script>