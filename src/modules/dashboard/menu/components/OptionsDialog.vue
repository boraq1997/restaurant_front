<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :draggable="false"
    :style="{ width: '460px' }"
    dir="rtl"
  >
    <template #header>
      <div class="flex align-items-center gap-2">
        <div class="w-2rem h-2rem border-round-lg bg-primary flex align-items-center justify-content-center">
          <i class="pi pi-cog text-white text-xs" />
        </div>
        <div>
          <p class="font-bold text-sm m-0 line-height-1">خيارات المادة</p>
          <span class="text-xs text-500">{{ item?.name }}</span>
        </div>
      </div>
    </template>

    <div class="flex flex-column gap-4">

      <!-- ── الخيارات المضافة حالياً ── -->
      <div>
        <p class="font-medium text-sm text-500 mb-2 m-0">الخيارات المضافة للمادة</p>
        <div v-if="item?.menuOptions?.length" class="flex flex-column gap-2">
          <div
            v-for="opt in item.menuOptions" :key="opt.id"
            class="flex align-items-center justify-content-between border-round-lg border-1 border-200 px-3 py-2 surface-50"
          >
            <div class="flex align-items-center gap-2">
              <i class="pi pi-check-circle text-primary text-xs" />
              <span class="text-sm font-medium">{{ opt.name }}</span>
            </div>
            <Tag
              :value="opt.price > 0 ? `+ ${opt.price.toLocaleString()} د.ع` : 'مجاني'"
              :severity="opt.price > 0 ? 'warn' : 'success'"
              class="text-xs"
            />
          </div>
        </div>
        <div v-else class="flex flex-column align-items-center py-3 gap-1">
          <i class="pi pi-inbox text-3xl text-300" />
          <p class="text-500 text-sm m-0">لا توجد خيارات مضافة</p>
        </div>
      </div>

      <Divider class="my-0" />

      <!-- ── اختيار خيارات متوفرة ── -->
      <div v-if="mode === 'select'">
        <div class="flex align-items-center justify-content-between mb-2">
          <p class="font-medium text-sm text-500 m-0">إضافة خيارات متوفرة</p>
          <Button
            label="خيار جديد"
            icon="pi pi-plus"
            size="small"
            text
            @click="mode = 'create'"
          />
        </div>

        <!-- قائمة الخيارات المتوفرة -->
        <div v-if="availableOptions.length" class="flex flex-column gap-2">
          <div
            v-for="opt in availableOptions" :key="opt.id"
            class="flex align-items-center gap-3 border-round-lg border-1 px-3 py-2 cursor-pointer transition-all transition-duration-150"
            :class="isSelected(opt.id)
              ? 'border-primary bg-primary-50'
              : 'border-200 surface-50 hover:surface-100'"
            @click="toggleSelect(opt.id)"
          >
            <div
              class="w-1rem h-1rem border-round border-2 flex align-items-center justify-content-center flex-shrink-0"
              :class="isSelected(opt.id) ? 'border-primary bg-primary' : 'border-300'"
            >
              <i v-if="isSelected(opt.id)" class="pi pi-check text-white" style="font-size:0.6rem" />
            </div>
            <span class="text-sm flex-1">{{ opt.name }}</span>
            <Tag
              :value="opt.price > 0 ? `+ ${opt.price.toLocaleString()} د.ع` : 'مجاني'"
              :severity="opt.price > 0 ? 'warn' : 'success'"
              class="text-xs"
            />
          </div>
        </div>
        <div v-else class="text-center py-3">
          <p class="text-500 text-sm m-0">لا توجد خيارات متوفرة</p>
        </div>

        <!-- زر الحفظ -->
        <Button
          v-if="selectedIds.length"
          :label="`إضافة ${selectedIds.length} خيار`"
          icon="pi pi-check"
          class="w-full mt-3"
          :loading="loading"
          @click="handleAssign"
        />
      </div>

      <!-- ── إنشاء خيار جديد ── -->
      <div v-else-if="mode === 'create'">
        <div class="flex align-items-center justify-content-between mb-3">
          <p class="font-medium text-sm text-500 m-0">خيار جديد</p>
          <Button
            icon="pi pi-arrow-right"
            size="small"
            text
            severity="secondary"
            v-tooltip="'رجوع'"
            @click="mode = 'select'"
          />
        </div>

        <div class="flex flex-column gap-3">
          <div class="flex flex-column gap-2">
            <label class="text-sm font-medium">اسم الخيار <span class="text-red-500">*</span></label>
            <InputText v-model="newOption.name" placeholder="مثال: بدون ثوم" fluid />
          </div>
          <div class="flex flex-column gap-2">
            <label class="text-sm font-medium">السعر الإضافي</label>
            <InputNumber v-model="newOption.price" placeholder="0 = مجاني" fluid :min="0" />
          </div>
          <Button
            label="إنشاء وإضافة للمادة"
            icon="pi pi-plus"
            :loading="loading"
            :disabled="!newOption.name.trim()"
            @click="handleCreateAndAssign"
          />
        </div>
      </div>

    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { useMenuStore } from '../../../menu/store/menu.store'
import type { MenuItem, MenuOption } from '../../../../types/menu.types'

const props = defineProps<{
  modelValue: boolean
  item?: MenuItem | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [v: boolean]
  assign:      [optionIds: number[]]
  createAndAssign: [opt: { name: string; price: number }]
}>()

const menu = useMenuStore()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

// الوضع: اختيار أو إنشاء
const mode        = ref<'select' | 'create'>('select')
const selectedIds = ref<number[]>([])
const newOption   = ref({ name: '', price: 0 })

// جمع كل الخيارات من المينيو وإزالة المكررات وإزالة المضافة مسبقاً
const availableOptions = computed<MenuOption[]>(() => {
  const currentIds = new Set(props.item?.menuOptions?.map(o => o.id) ?? [])
  const allOptions = menu.categories
    .flatMap(c => c.menuItems ?? [])
    .flatMap(i => i.menuOptions ?? [])

  // إزالة المكررات بالـ id
  const unique = new Map<number, MenuOption>()
  allOptions.forEach(o => {
    if (!currentIds.has(o.id)) unique.set(o.id, o)
  })
  return Array.from(unique.values())
})

// إعادة تعيين عند تغيير المادة
watch(() => props.item, () => {
  selectedIds.value = []
  newOption.value   = { name: '', price: 0 }
  mode.value        = 'select'
})

function isSelected(id: number) {
  return selectedIds.value.includes(id)
}

function toggleSelect(id: number) {
  const idx = selectedIds.value.indexOf(id)
  if (idx === -1) selectedIds.value.push(id)
  else selectedIds.value.splice(idx, 1)
}

function handleAssign() {
  emit('assign', [...selectedIds.value])
  selectedIds.value = []
}

function handleCreateAndAssign() {
  if (!newOption.value.name.trim()) return
  emit('createAndAssign', { ...newOption.value })
  newOption.value = { name: '', price: 0 }
  mode.value = 'select'
}
</script>