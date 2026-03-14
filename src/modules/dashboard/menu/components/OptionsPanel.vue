<template>
  <Drawer
    v-model:visible="visible"
    position="left"
    :style="{ width: '360px' }"
    dir="rtl"
  >
    <template #header>
      <div class="flex align-items-center gap-2">
        <div class="w-2rem h-2rem border-round-lg bg-primary flex align-items-center justify-content-center">
          <i class="pi pi-sliders-h text-white text-xs" />
        </div>
        <div>
          <p class="font-bold text-sm m-0 line-height-1">الخيارات</p>
          <span class="text-xs text-500">{{ menu.allOptions.length }} خيار</span>
        </div>
      </div>
    </template>

    <div class="flex flex-column gap-3">

      <Button
        label="إضافة خيار جديد"
        icon="pi pi-plus"
        size="small"
        class="w-full"
        @click="openCreate"
      />

      <div v-if="menu.allOptions.length === 0"
        class="flex flex-column align-items-center py-6 gap-2">
        <i class="pi pi-inbox text-4xl text-300" />
        <p class="text-500 text-sm m-0">لا توجد خيارات</p>
      </div>

      <div v-else class="flex flex-column gap-2">
        <div
          v-for="opt in menu.allOptions" :key="opt.id"
          class="flex align-items-center justify-content-between border-round-lg border-1 border-200 px-3 py-2 surface-card"
        >
          <div class="flex flex-column gap-1">
            <span class="text-sm font-medium text-900">{{ opt.name }}</span>
            <Tag
              :value="opt.price > 0 ? `+ ${opt.price.toLocaleString()} د.ع` : 'مجاني'"
              :severity="opt.price > 0 ? 'warn' : 'success'"
              class="text-xs"
            />
          </div>
          <div class="flex gap-1">
            <Button icon="pi pi-pencil" severity="secondary" text rounded size="small"
              v-tooltip.top="'تعديل'" @click="openEdit(opt)" />
            <Button icon="pi pi-trash" severity="danger" text rounded size="small"
              v-tooltip.top="'حذف'" @click="confirmDelete(opt)" />
          </div>
        </div>
      </div>

    </div>
  </Drawer>

  <!-- Dialog إضافة/تعديل -->
  <Dialog
    v-model:visible="dialogVisible"
    :header="editingOption ? 'تعديل الخيار' : 'إضافة خيار جديد'"
    :modal="true"
    :draggable="false"
    style="width: 100%; max-width: 400px"
    dir="rtl"
  >
    <div class="flex flex-column gap-3 pt-2">
      <div class="flex flex-column gap-2">
        <label class="font-semibold text-sm">الاسم <span class="text-red-500">*</span></label>
        <InputText v-model="form.name" placeholder="مثال: بدون ثوم" class="w-full" />
      </div>
      <div class="flex flex-column gap-2">
        <label class="font-semibold text-sm">الوصف</label>
        <InputText v-model="form.description" placeholder="وصف اختياري" class="w-full" />
      </div>
      <div class="flex flex-column gap-2">
        <label class="font-semibold text-sm">السعر الإضافي</label>
        <InputNumber v-model="form.price" :min="0" placeholder="0 = مجاني" class="w-full" />
      </div>
      <div class="flex align-items-center gap-2">
        <ToggleSwitch v-model="form.isAvailable" inputId="isAvailable" />
        <label for="isAvailable" class="font-semibold text-sm cursor-pointer">متاح</label>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-content-end gap-2">
        <Button label="إلغاء" severity="secondary" text @click="dialogVisible = false" />
        <Button
          :label="editingOption ? 'حفظ' : 'إضافة'"
          :icon="menu.saving ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
          :disabled="!form.name.trim() || menu.saving"
          @click="handleSave"
        />
      </div>
    </template>
  </Dialog>

  <!-- Confirm Delete -->
  <ConfirmDeleteDialog
    v-model="deleteDialogVisible"
    :message="`هل تريد حذف خيار '${pendingDelete?.name}'؟`"
    :loading="deleting"
    @confirm="handleDelete"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Drawer        from 'primevue/drawer'
import Dialog        from 'primevue/dialog'
import Button        from 'primevue/button'
import InputText     from 'primevue/inputtext'
import InputNumber   from 'primevue/inputnumber'
import Tag           from 'primevue/tag'
import ToggleSwitch  from 'primevue/toggleswitch'
import { useMenuStore } from '../../../menu/store/menu.store'
import { useToast }     from 'primevue/usetoast'
import ConfirmDeleteDialog from '../../../../components/shared/ConfirmDeleteDialog.vue'
import type { MenuOption } from '../../../../types/menu.types'

const props = defineProps<{ modelValue: boolean }>()
const emit  = defineEmits<{ 'update:modelValue': [v: boolean] }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const menu  = useMenuStore()
const toast = useToast()

const dialogVisible = ref(false)
const editingOption = ref<MenuOption | null>(null)

const emptyForm = () => ({ name: '', price: 0, description: '', imageUrl: '', isAvailable: true })
const form = ref(emptyForm())

const deleteDialogVisible = ref(false)
const pendingDelete       = ref<MenuOption | null>(null)
const deleting            = ref(false)

function openCreate() {
  editingOption.value = null
  form.value = emptyForm()
  dialogVisible.value = true
}

function openEdit(opt: MenuOption) {
  editingOption.value = opt
  form.value = {
    name:        opt.name,
    price:       opt.price,
    description: opt.description  ?? '',
    imageUrl:    opt.imageUrl     ?? '',
    isAvailable: opt.isAvailable  ?? true,
  }
  dialogVisible.value = true
}

function confirmDelete(opt: MenuOption) {
  pendingDelete.value       = opt
  deleteDialogVisible.value = true
}

async function handleSave() {
  if (!form.value.name.trim()) return
  try {
    if (editingOption.value) {
      await menu.editOption(editingOption.value.id, {
        name:        form.value.name.trim(),
        price:       form.value.price,
        description: form.value.description,
        imageUrl:    form.value.imageUrl,
        isAvailable: form.value.isAvailable,
      })
      toast.add({ severity: 'success', summary: 'تم', detail: 'تم تعديل الخيار', life: 2000 })
    } else {
      await menu.createOption({
        name:        form.value.name.trim(),
        price:       form.value.price,
        description: form.value.description,
        imageUrl:    form.value.imageUrl,
        isAvailable: form.value.isAvailable,
        menuItemIds: [],
      })
      toast.add({ severity: 'success', summary: 'تم', detail: 'تمت الإضافة', life: 2000 })
    }
    await menu.fetchMenu()
    dialogVisible.value = false
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشلت العملية', life: 3000 })
  }
}

async function handleDelete() {
  if (!pendingDelete.value) return
  deleting.value = true
  try {
    toast.add({ severity: 'info', summary: 'تنبيه', detail: 'حذف الخيار غير متاح حالياً', life: 3000 })
    deleteDialogVisible.value = false
  } finally {
    deleting.value = false
  }
}
</script>