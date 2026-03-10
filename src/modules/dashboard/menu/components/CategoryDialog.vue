<template>
  <Dialog
    v-model:visible="visible"
    :header="category ? 'تعديل الفئة' : 'فئة جديدة'"
    :modal="true" :draggable="false"
    :style="{ width: '380px' }" dir="rtl"
  >
    <div class="flex flex-column gap-4 pt-2">

      <!-- الاسم -->
      <div class="flex flex-column gap-2">
        <label class="font-medium text-sm">
          اسم الفئة <span class="text-red-500">*</span>
        </label>
        <InputText
          v-model="form.name"
          placeholder="مثال: المشروبات الساخنة"
          fluid
          :class="{ 'p-invalid': errors.name }"
        />
        <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
      </div>

      <!-- الصورة -->
      <div class="flex flex-column gap-2">
        <label class="font-medium text-sm">رابط الصورة</label>
        <InputText v-model="form.image" placeholder="https://..." fluid />
        <img
          v-if="form.image"
          :src="form.image"
          class="border-round-lg mt-1"
          style="height:80px; object-fit:cover; width:100%"
        />
      </div>

      <!-- الطابعة -->
      <div class="flex flex-column gap-2">
        <label class="font-medium text-sm">
          رقم الطابعة <span class="text-red-500">*</span>
        </label>
        <Select
          v-model="form.printerId"
          :options="printerOptions"
          option-label="label"
          option-value="value"
          placeholder="اختر طابعة"
          fluid
          :class="{ 'p-invalid': errors.printerId }"
        />
        <small v-if="errors.printerId" class="text-red-500">{{ errors.printerId }}</small>
      </div>

      <!-- التفعيل -->
      <div class="flex align-items-center justify-content-between">
        <label class="font-medium text-sm">تفعيل الفئة</label>
        <ToggleSwitch v-model="form.isActive" />
      </div>

    </div>

    <template #footer>
      <div class="flex gap-2 justify-content-end">
        <Button label="إلغاء" severity="secondary" outlined @click="visible = false" />
        <Button
          :label="category ? 'حفظ' : 'إضافة'"
          icon="pi pi-check"
          :loading="loading"
          @click="handleSave"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import ToggleSwitch from 'primevue/toggleswitch'
import Button from 'primevue/button'
import { useVModel } from '@vueuse/core'
import type { MenuCategory } from '../../../../types/menu.types'

const props = defineProps<{
  modelValue: boolean
  category?: MenuCategory | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [v: boolean]
  save: [form: { name: string; image: string; printerId: number; isActive: boolean }]
}>()

const visible = useVModel(props, 'modelValue', emit)

// ── أرقام الطابعات (مؤقتة - يُستبدل بـ API لاحقاً) ──
const printerOptions = [
  { label: 'طابعة 1', value: 1 },
  { label: 'طابعة 2', value: 2 },
  { label: 'طابعة 3', value: 3 },
  { label: 'طابعة 4', value: 4 },
  { label: 'طابعة 5', value: 5 },
]

const emptyForm = () => ({
  name:      '',
  image:     '',
  printerId: null as number | null,
  isActive:  true,
})

const form   = ref(emptyForm())
const errors = reactive({ name: '', printerId: '' })

// ── تعبئة الفورم عند التعديل، وتصفيره عند الإضافة ──
watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    errors.name      = ''
    errors.printerId = ''
    form.value = props.category
      ? {
          name:      props.category.name,
          image:     props.category.image ?? '',
          printerId: props.category.printerId ?? null,
          isActive:  props.category.isActive,
        }
      : emptyForm()
  },
)

function validate() {
  errors.name      = ''
  errors.printerId = ''
  let valid = true
  if (!form.value.name.trim()) {
    errors.name = 'اسم الفئة مطلوب'
    valid = false
  }
  if (!form.value.printerId) {
    errors.printerId = 'رقم الطابعة مطلوب'
    valid = false
  }
  return valid
}

function handleSave() {
  if (!validate()) return
  emit('save', {
    name:      form.value.name.trim(),
    image:     form.value.image,
    printerId: form.value.printerId!,
    isActive:  form.value.isActive,
  })
}
</script>