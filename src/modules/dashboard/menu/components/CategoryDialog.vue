<template>
  <Dialog
    v-model:visible="visible"
    :header="category ? 'تعديل الفئة' : 'فئة جديدة'"
    :modal="true" :draggable="false"
    :style="{ width: '380px' }" dir="rtl"
  >
    <div class="flex flex-column gap-4 pt-2">
      <div class="flex flex-column gap-2">
        <label class="font-medium text-sm">اسم الفئة <span class="text-red-500">*</span></label>
        <InputText v-model="form.name" placeholder="مثال: المشروبات الساخنة" fluid />
      </div>
      <div class="flex flex-column gap-2">
        <label class="font-medium text-sm">رابط الصورة</label>
        <InputText v-model="form.image" placeholder="https://..." fluid />
        <img v-if="form.image" :src="form.image"
          class="border-round-lg mt-1" style="height:80px; object-fit:cover; width:100%" />
      </div>
      <div class="flex flex-column gap-2">
        <label class="font-medium text-sm">رقم الطابعة</label>
        <InputNumber v-model="form.printerId" placeholder="اختياري" fluid :min="1" />
      </div>
      <div class="flex align-items-center justify-content-between">
        <label class="font-medium text-sm">تفعيل الفئة</label>
        <ToggleSwitch v-model="form.isActive" />
      </div>
    </div>

    <template #footer>
      <div class="flex gap-2 justify-content-end">
        <Button label="إلغاء" severity="secondary" outlined @click="visible = false" />
        <Button :label="category ? 'حفظ' : 'إضافة'" icon="pi pi-check"
          :loading="loading" @click="emit('save', form)" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
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
  save: [form: { name: string; image: string; printerId: number | null; isActive: boolean }]
}>()

const visible = useVModel(props, 'modelValue', emit)

const form = ref({ name: '', image: '', printerId: null as number | null, isActive: true })

watch(() => props.category, (cat) => {
  form.value = cat
    ? { name: cat.name, image: cat.image ?? '', printerId: cat.printerId ?? null, isActive: cat.isActive }
    : { name: '', image: '', printerId: null, isActive: true }
}, { immediate: true })
</script>