<template>
  <Dialog
    :visible="modelValue"
    :header="floor ? 'تعديل الطابق' : 'إضافة طابق جديد'"
    :modal="true"
    :draggable="false"
    :closable="!loading"
    style="width: 100%; max-width: 400px;"
    dir="rtl"
    @update:visible="emit('update:modelValue', $event)"
  >
    <div class="flex flex-column gap-4 pt-2">

      <div class="flex flex-column gap-2">
        <label class="font-semibold text-sm text-800">
          اسم الطابق <span class="text-red-500">*</span>
        </label>
        <InputText
          v-model="form.name"
          placeholder="مثال: الطابق الأول"
          class="w-full"
          :disabled="loading"
        />
      </div>

      <div class="flex flex-column gap-2">
        <label class="font-semibold text-sm text-800">الوصف</label>
        <Textarea
          v-model="form.description"
          placeholder="وصف اختياري للطابق"
          class="w-full"
          rows="2"
          :disabled="loading"
        />
      </div>

      <div class="flex align-items-center gap-2">
        <ToggleSwitch v-model="form.isActive" :disabled="loading" />
        <span class="text-sm text-700">{{ form.isActive ? 'مفعّل' : 'معطّل' }}</span>
      </div>

    </div>

    <template #footer>
      <div class="flex justify-content-end gap-2">
        <Button label="إلغاء" severity="secondary" text :disabled="loading"
          @click="emit('update:modelValue', false)" />
        <Button
          :label="floor ? 'حفظ التعديلات' : 'إضافة'"
          :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
          :disabled="loading || !form.name?.trim()"
          @click="handleSave"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import ToggleSwitch from 'primevue/toggleswitch'
import type { Floor, CreateFloorDto } from '../types/tables-admin.types'

const props = defineProps<{ modelValue: boolean; floor: Floor | null; loading: boolean }>()
const emit  = defineEmits<{ 'update:modelValue': [v: boolean]; save: [data: CreateFloorDto] }>()

const form = ref({ name: '', description: '', isActive: true })

watch(() => props.modelValue, (val) => {
  if (val) {
    form.value = props.floor
      ? { name: props.floor.name, description: props.floor.description ?? '', isActive: props.floor.isActive }
      : { name: '', description: '', isActive: true }
  }
})

function handleSave() {
  if (!form.value.name?.trim()) return
  emit('save', { name: form.value.name.trim(), description: form.value.description, isActive: form.value.isActive })
}
</script>