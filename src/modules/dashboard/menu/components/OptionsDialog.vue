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

    <div class="flex flex-column gap-3">

      <!-- ── قائمة جميع الخيارات مع checkboxes ── -->
      <div v-if="mode === 'list'">
        <div class="flex align-items-center justify-content-between mb-3">
          <p class="font-medium text-sm text-500 m-0">
            جميع الخيارات المتوفرة
            <span v-if="pendingIds.length" class="text-primary font-bold">
              ({{ pendingIds.length }} محدد)
            </span>
          </p>
          <Button
            label="خيار جديد"
            icon="pi pi-plus"
            size="small"
            text
            @click="mode = 'create'"
          />
        </div>

        <!-- لا توجد خيارات أصلاً -->
        <div v-if="allOptions.length === 0" class="flex flex-column align-items-center py-4 gap-2">
          <i class="pi pi-inbox text-3xl text-300" />
          <p class="text-500 text-sm m-0">لا توجد خيارات متوفرة</p>
          <Button label="إنشاء خيار جديد" icon="pi pi-plus" size="small" @click="mode = 'create'" />
        </div>

        <!-- الخيارات -->
        <div v-else class="flex flex-column gap-2">
          <div
            v-for="opt in allOptions"
            :key="opt.id"
            class="flex align-items-center gap-3 border-round-lg border-1 px-3 py-2 cursor-pointer transition-all transition-duration-150"
            :class="pendingIds.includes(opt.id)
              ? 'border-primary bg-primary-50'
              : 'border-200 surface-50 hover:surface-100'"
            @click="toggleOption(opt.id)"
          >
            <!-- checkbox مخصص -->
            <div
              class="w-1rem h-1rem border-round border-2 flex align-items-center justify-content-center flex-shrink-0 transition-all"
              :class="pendingIds.includes(opt.id)
                ? 'border-primary bg-primary'
                : 'border-300 surface-0'"
            >
              <i
                v-if="pendingIds.includes(opt.id)"
                class="pi pi-check text-white"
                style="font-size:0.6rem"
              />
            </div>

            <span class="text-sm flex-1">{{ opt.name }}</span>

            <!-- مضاف مسبقاً -->
            <Tag
              v-if="alreadyAssigned(opt.id)"
              value="مضاف"
              severity="success"
              class="text-xs ml-1"
            />

            <Tag
              :value="opt.price > 0 ? `+ ${opt.price.toLocaleString()} د.ع` : 'مجاني'"
              :severity="opt.price > 0 ? 'warn' : 'success'"
              class="text-xs"
            />
          </div>
        </div>

        <!-- زر الحفظ -->
        <div v-if="isDirty" class="flex gap-2 mt-4">
          <Button
            label="حفظ التغييرات"
            icon="pi pi-check"
            class="flex-1"
            :loading="loading"
            @click="handleSave"
          />
          <Button
            label="إلغاء"
            severity="secondary"
            outlined
            @click="resetPending"
          />
        </div>

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
            @click="mode = 'list'"
          />
        </div>

        <div class="flex flex-column gap-3">
          <div class="flex flex-column gap-2">
            <label class="text-sm font-medium">اسم الخيار <span class="text-red-500">*</span></label>
            <InputText v-model="newOption.name" placeholder="مثال: بدون ثوم" fluid />
          </div>
          <div class="flex flex-column gap-2">
            <label class="text-sm font-medium">الوصف</label>
            <InputText v-model="newOption.description" placeholder="وصف اختياري" fluid />
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
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { useMenuStore } from '../../../menu/store/menu.store'
import type { MenuItem, MenuOption } from '../../../../types/menu.types'

const props = defineProps<{
  modelValue: boolean
  item?:      MenuItem | null
  loading?:   boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [v: boolean]
  assign:            [optionIds: number[]]
  createAndAssign:   [opt: { name: string; price: number; description?: string; isAvailable: boolean; menuItemIds: number[] }]
}>()

const menu = useMenuStore()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const mode       = ref<'list' | 'create'>('list')
const pendingIds = ref<number[]>([])        // الحالة المعلقة (ما سيُرسل)
const newOption  = ref({ name: '', price: 0, description: '', isAvailable: true })

// ── جميع الخيارات المتوفرة في المينيو (بدون تكرار) ──
const allOptions = computed<MenuOption[]>(() => {
  const all = menu.categories
    .flatMap(c => c.menuItems ?? [])
    .flatMap(i => i.menuOptions ?? [])
  const unique = new Map<number, MenuOption>()
  all.forEach(o => unique.set(o.id, o))
  return Array.from(unique.values())
})

// ── ids الخيارات المضافة حالياً للمادة ──
const currentIds = computed(() =>
  props.item?.menuOptions?.map(o => o.id) ?? []
)

// ── هل هناك تغيير؟ ──
const isDirty = computed(() => {
  const curr = [...currentIds.value].sort((a, b) => a - b)
  const pend = [...pendingIds.value].sort((a, b) => a - b)
  return JSON.stringify(curr) !== JSON.stringify(pend)
})

function alreadyAssigned(id: number) {
  return currentIds.value.includes(id)
}

// ── إعادة التعيين عند فتح الـ dialog أو تغيير المادة ──
watch(
  [() => props.modelValue, () => props.item],
  ([open]) => {
    if (!open) return
    resetPending()
    newOption.value = { name: '', price: 0, description: '', isAvailable: true }
    mode.value = 'list'
  },
)

function resetPending() {
  pendingIds.value = [...currentIds.value]
}

function toggleOption(id: number) {
  const idx = pendingIds.value.indexOf(id)
  if (idx === -1) pendingIds.value.push(id)
  else            pendingIds.value.splice(idx, 1)
}

// ── حفظ التغييرات: يرسل القائمة الكاملة الجديدة ──
function handleSave() {
  emit('assign', [...pendingIds.value])
}

function handleCreateAndAssign() {
  if (!newOption.value.name.trim()) return
  emit('createAndAssign', {
    name:        newOption.value.name.trim(),
    price:       newOption.value.price,
    description: newOption.value.description,
    isAvailable: newOption.value.isAvailable,
    menuItemIds: [],
  })
  newOption.value = { name: '', price: 0, description: '', isAvailable: true }
  mode.value = 'list'
}
</script>