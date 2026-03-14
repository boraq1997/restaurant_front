<template>
  <Dialog
    :visible="modelValue"
    :header="table ? 'تعديل الطاولة' : 'إضافة طاولة جديدة'"
    :modal="true"
    :draggable="false"
    :closable="!loading"
    style="width: 100%; max-width: 440px;"
    dir="rtl"
    @update:visible="emit('update:modelValue', $event)"
  >
    <div class="flex flex-column gap-4 pt-2">

      <!-- رقم الطاولة -->
      <div class="flex flex-column gap-2">
        <label class="font-semibold text-sm text-800">
          رقم الطاولة <span class="text-red-500">*</span>
        </label>
        <InputNumber
          v-model="form.number"
          :min="1" :max="999"
          placeholder="مثال: 1"
          class="w-full"
          :disabled="loading"
          showButtons buttonLayout="horizontal" :step="1"
        />
      </div>

      <!-- اسم الطاولة -->
      <div class="flex flex-column gap-2">
        <label class="font-semibold text-sm text-800">
          اسم الطاولة <span class="text-red-500">*</span>
        </label>
        <InputText
          v-model="form.name"
          placeholder="مثال: طاولة النافذة"
          class="w-full"
          :disabled="loading"
        />
      </div>

      <!-- عدد الكراسي -->
      <div class="flex flex-column gap-2">
        <label class="font-semibold text-sm text-800">
          عدد الكراسي <span class="text-red-500">*</span>
        </label>
        <InputNumber
          v-model="form.capacity"
          :min="1" :max="50"
          placeholder="مثال: 4"
          class="w-full"
          :disabled="loading"
          showButtons buttonLayout="horizontal" :step="1"
        />
        <!-- معاينة الكراسي -->
        <div class="flex gap-1 flex-wrap mt-1">
          <div
            v-for="i in Math.min(form.capacity ?? 0, 20)" :key="i"
            class="w-1rem h-1rem border-round bg-primary-100 border-1 border-primary-200"
          />
          <span v-if="(form.capacity ?? 0) > 20" class="text-xs text-500 align-self-center">
            +{{ (form.capacity ?? 0) - 20 }}
          </span>
        </div>
      </div>

      <!-- الطابق -->
      <div class="flex flex-column gap-2">
        <label class="font-semibold text-sm text-800">
          الطابق <span class="text-red-500">*</span>
        </label>
        <Select
          v-model="form.floorId"
          :options="floors"
          option-label="name"
          option-value="id"
          placeholder="اختر الطابق"
          class="w-full"
          :disabled="loading || floors.length === 0"
        />
        <span class="text-xs text-400">
          <i class="pi pi-info-circle ml-1" />
          سيتم ربط الطوابق بقاعدة البيانات لاحقاً
        </span>
      </div>

    </div>

    <template #footer>
      <div class="flex justify-content-end gap-2">
        <Button
          label="إلغاء"
          severity="secondary"
          text
          :disabled="loading"
          @click="emit('update:modelValue', false)"
        />
        <Button
          :label="table ? 'حفظ التعديلات' : 'إضافة'"
          :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
          :disabled="loading || !isValid"
          @click="handleSave"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import type { AdminTable, Floor, CreateTableDto } from '../types/tables-admin.types'

const props = defineProps<{
  modelValue: boolean
  table: AdminTable | null
  floors: Floor[]
  defaultFloorId?: number | null
  loading: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [v: boolean]
  save: [data: CreateTableDto]
}>()

const form = ref({
  number:   1,
  name:     '',
  capacity: 4,
  floorId:  1,
})

watch(() => props.modelValue, (val) => {
  if (val) {
    form.value = props.table
      ? { 
          name: props.table.name, 
          number: props.table.number, 
          capacity: props.table.capacity, 
          floorId: props.table.floorId 
        }
      : { 
          name: 'طاولة', 
          number: 1, 
          capacity: 4, 
          floorId: props.defaultFloorId ?? props.floors[0]?.id ?? 1 
        }
  }
})

const isValid = computed(() =>
  !!form.value.number &&
  !!form.value.name?.trim() &&
  !!form.value.capacity &&
  !!form.value.floorId
)

function handleSave() {
  if (!isValid.value) return
  emit('save', {
    number:   form.value.number,
    name:     form.value.name.trim(),
    capacity: form.value.capacity,
    floorId:  form.value.floorId,
  })
}
</script>