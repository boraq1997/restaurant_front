<template>
  <Dialog v-model:visible="visible" :header="item ? 'تعديل المادة' : 'مادة جديدة'"
    :modal="true" :draggable="false" :style="{ width: '420px' }" dir="rtl">
    <div class="flex flex-column gap-3 pt-2">
      <div class="flex flex-column gap-2">
        <label class="font-medium text-sm">الاسم <span class="text-red-500">*</span></label>
        <InputText v-model="form.name" fluid />
      </div>
      <div class="flex flex-column gap-2">
        <label class="font-medium text-sm">الوصف</label>
        <Textarea v-model="form.description" :rows="2" fluid />
      </div>
      <div class="flex flex-column gap-2">
        <label class="font-medium text-sm">رابط الصورة</label>
        <InputText v-model="form.image" placeholder="https://..." fluid />
        <img v-if="form.image" :src="form.image"
          class="border-round-lg" style="height:70px; object-fit:cover; width:100%" />
      </div>
      <div class="grid m-0 gap-2">
        <div class="col flex flex-column gap-2 p-0">
          <label class="font-medium text-sm">السعر <span class="text-red-500">*</span></label>
          <InputNumber v-model="form.price" fluid :min="0" />
        </div>
        <div class="col flex flex-column gap-2 p-0">
          <label class="font-medium text-sm">التكلفة</label>
          <InputNumber v-model="form.cost" fluid :min="0" />
        </div>
      </div>
      <div class="flex flex-column gap-2">
        <label class="font-medium text-sm">رقم الطابعة الخاصة</label>
        <InputNumber v-model="form.specificPrinterId" fluid :min="1" />
      </div>
      <div class="flex align-items-center justify-content-between">
        <label class="font-medium text-sm">متاح للطلب</label>
        <ToggleSwitch v-model="form.isAvailable" />
      </div>
    </div>
    <template #footer>
      <div class="flex gap-2 justify-content-end">
        <Button label="إلغاء" severity="secondary" outlined @click="visible = false" />
        <Button :label="item ? 'حفظ' : 'إضافة'" icon="pi pi-check"
          :loading="loading" @click="emit('save', form)" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
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
  set: (v) => emit('update:modelValue', v)
})

const form = ref({ name: '', description: '', image: '', price: 0, cost: null as number | null, specificPrinterId: null as number | null, isAvailable: true })

watch(() => props.item, (i) => {
  form.value = i
    ? { name: i.name, description: i.description ?? '', image: (i as any).image ?? '', price: i.price, cost: i.cost ?? null, specificPrinterId: i.specificPrinterId ?? null, isAvailable: i.isAvailable }
    : { name: '', description: '', image: '', price: 0, cost: null, specificPrinterId: null, isAvailable: true }
}, { immediate: true })
</script>