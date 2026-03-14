<template>
  <Dialog
    v-model:visible="visible"
    :header="isEdit ? 'تعديل الطابعة' : 'إضافة طابعة جديدة'"
    :style="{ width: '480px' }"
    modal
    :draggable="false"
    dir="rtl"
    @hide="resetForm"
  >
    <div class="flex flex-column gap-3 pt-2">

      <!-- Name -->
      <div class="flex flex-column gap-1">
        <label class="font-medium text-900">
          اسم الطابعة <span class="text-red-500">*</span>
        </label>
        <InputText
          v-model="form.name"
          placeholder="مثال: طابعة المطبخ"
          :class="{ 'p-invalid': errors.name }"
          autofocus
        />
        <small class="p-error" v-if="errors.name">{{ errors.name }}</small>
      </div>

      <!-- IP + Port -->
      <div class="flex gap-2">
        <div class="flex flex-column gap-1 flex-1">
          <label class="font-medium text-900">عنوان IP</label>
          <InputText
            v-model="form.ipAddress"
            placeholder="192.168.1.100"
            dir="ltr"
          />
        </div>
        <div class="flex flex-column gap-1">
          <label class="font-medium text-900">المنفذ</label>
          <InputNumber
            v-model="form.port"
            placeholder="9100"
            :use-grouping="false"
            :min="1"
            :max="65535"
          />
        </div>
      </div>

      <!-- Location -->
      <div class="flex flex-column gap-1">
        <label class="font-medium text-900">الموقع</label>
        <InputText
          v-model="form.location"
          placeholder="مثال: المطبخ، الكاشير"
        />
      </div>

      <!-- Description -->
      <div class="flex flex-column gap-1">
        <label class="font-medium text-900">الوصف</label>
        <Textarea
          v-model="form.description"
          placeholder="وصف اختياري"
          :rows="2"
          auto-resize
        />
      </div>

      <!-- Discovered Printers (only on create) -->
      <div
        v-if="!isEdit && printerStore.discoveredPrinters.length"
        class="surface-50 border-round p-3 border-1 border-200"
      >
        <p class="text-sm font-semibold text-700 mt-0 mb-2">
          <i class="pi pi-search-plus ml-1" />طابعات مكتشفة على الشبكة
        </p>
        <div class="flex flex-column gap-1">
          <template v-for="group in printerStore.discoveredPrinters" :key="group.machineName">
            <p class="text-xs text-400 m-0">{{ group.machineName }}</p>
            <div
              v-for="name in group.printerNames"
              :key="name"
              class="flex align-items-center gap-2 px-2 py-1 border-round cursor-pointer hover:surface-200 transition-colors transition-duration-150"
              @click="form.name = name"
            >
              <i class="pi pi-print text-400 text-sm" />
              <span class="text-sm">{{ name }}</span>
            </div>
          </template>
        </div>
      </div>

    </div>

    <template #footer>
      <Button label="إلغاء" text severity="secondary" @click="visible = false" />
      <Button
        :label="isEdit ? 'حفظ التعديلات' : 'إضافة'"
        icon="pi pi-check"
        :loading="printerStore.submitting"
        @click="submit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import { usePrinterStore } from '../store/printerStore'
import type { Printer } from '../types/printers-types'

const props = defineProps<{
  modelValue: boolean
  printer?: Printer | null
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const printerStore = usePrinterStore()
const isEdit = computed(() => !!props.printer)

const form = reactive({
  name:        '',
  ipAddress:   '',
  port:        null as number | null,
  location:    '',
  description: '',
})

const errors = reactive({ name: '' })

watch(
  () => props.printer,
  (val) => {
    if (val) {
      form.name        = val.name
      form.ipAddress   = val.ipAddress ?? ''
      form.port        = val.port ?? null
      form.location    = val.location ?? ''
      form.description = val.description ?? ''
    }
  },
  { immediate: true }
)

function resetForm() {
  form.name        = ''
  form.ipAddress   = ''
  form.port        = null
  form.location    = ''
  form.description = ''
  errors.name      = ''
}

function validate(): boolean {
  errors.name = form.name.trim() ? '' : 'اسم الطابعة مطلوب'
  return !errors.name
}

async function submit() {
  if (!validate()) return

  const payload = {
    name:        form.name.trim(),
    ipAddress:   form.ipAddress  || undefined,
    port:        form.port       ?? undefined,
    location:    form.location   || undefined,
    description: form.description || undefined,
  }

  let ok = false
  if (isEdit.value && props.printer) {
    ok = await printerStore.updatePrinter(props.printer.id, { id: props.printer.id, ...payload })
  } else {
    ok = await printerStore.createPrinter(payload)
  }

  if (ok) visible.value = false
}
</script>