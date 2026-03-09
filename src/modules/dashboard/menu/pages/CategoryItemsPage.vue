<template>
  <div class="min-h-screen surface-50" dir="rtl">

    <!-- Header -->
    <div class="px-3 py-3 flex align-items-center justify-content-between border-bottom-1 border-200 surface-card">
      <Button icon="pi pi-arrow-right" text rounded severity="secondary" @click="router.back()" />
      <div class="flex gap-2">
        <Button
          icon="pi pi-sliders-h"
          label="الخيارات"
          severity="secondary"
          size="small"
          @click="optionsPanelVisible = true"
        />
        <Button label="مادة جديدة" icon="pi pi-plus" size="small" @click="openCreate" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="menu.loading" class="flex justify-content-center py-8">
      <ProgressSpinner style="width:40px;height:40px" />
    </div>

    <template v-else>

      <!-- كارد تفاصيل الفئة -->
      <CategoryInfoCard
        v-if="category"
        :category="category"
        :toggling="togglingCategory"
        @edit="openEditCategory"
        @delete="handleDeleteCategory"
        @toggle="handleToggleCategory"
      />

      <!-- المواد -->
      <div v-if="items.length === 0"
        class="flex flex-column align-items-center py-8 gap-3">
        <i class="pi pi-inbox text-5xl text-300" />
        <p class="text-500 m-0">لا توجد مواد في هذه الفئة</p>
        <Button label="إضافة مادة" icon="pi pi-plus" @click="openCreate" />
      </div>

      <main v-else class="px-3 py-3">
        <ItemGrid :items="items" @edit="openEdit" @options="openOptions" />
      </main>

    </template>

    <!-- Dialogs -->
    <ItemDialog v-model="dialogVisible" :item="editingItem"
      :loading="menu.saving" @save="handleSave" />

    <CategoryDialog v-model="categoryDialogVisible" :category="category"
      :loading="menu.saving" @save="handleSaveCategory" />

    <ConfirmDeleteDialog
      v-model="deleteDialogVisible"
      :message="deleteMessage"
      :loading="deleting"
      @confirm="onDeleteConfirmed"
    />

    <OptionsDialog
      v-model="optionsVisible"
      :item="selectedItem"
      :loading="menu.saving"
      @assign="handleAssign"
      @create-and-assign="handleCreateAndAssign"
    />

    <OptionsPanel v-model="optionsPanelVisible" />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useMenuStore } from '../../../menu/store/menu.store'
import type { MenuCategory, MenuItem } from '../../../../types/menu.types'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import ItemGrid from '../components/ItemGrid.vue'
import ItemDialog from '../components/ItemDialog.vue'
import OptionsDialog from '../components/OptionsDialog.vue'
import CategoryDialog from '../components/CategoryDialog.vue'
import CategoryInfoCard from '../components/CategoryInfoCard.vue'
import ConfirmDeleteDialog from '../../../../components/shared/ConfirmDeleteDialog.vue'
import OptionsPanel from '../components/OptionsPanel.vue'

const route  = useRoute()
const router = useRouter()
const toast  = useToast()
const menu   = useMenuStore()

const categoryId = computed(() => Number(route.params.categoryId))
const category   = computed(() => menu.categories.find(c => c.id === categoryId.value))
const items      = computed(() => category.value?.menuItems ?? [])

const dialogVisible         = ref(false)
const optionsVisible        = ref(false)
const optionsPanelVisible   = ref(false)
const categoryDialogVisible = ref(false)
const togglingCategory      = ref(false)
const editingItem           = ref<MenuItem | null>(null)
const selectedItem          = ref<MenuItem | null>(null)

const deleteDialogVisible = ref(false)
const deleteMessage       = ref('')
const deleting            = ref(false)

onMounted(async () => {
  await menu.fetchCategoryById(categoryId.value)
})

// ── المواد ──────────────────────────────────────────
function openCreate() {
  editingItem.value = null
  dialogVisible.value = true
}

function openEdit(item: MenuItem) {
  editingItem.value = item
  dialogVisible.value = true
}

function openOptions(item: MenuItem) {
  selectedItem.value = item
  optionsVisible.value = true
}

async function handleSave(form: any) {
  if (!form.name?.trim()) {
    toast.add({ severity: 'warn', summary: 'تنبيه', detail: 'اسم المادة مطلوب', life: 3000 })
    return
  }
  try {
    const payload = { ...form, categoryId: categoryId.value, specificPrinterId: form.specificPrinterId ?? 0 }
    if (editingItem.value) {
      await menu.editItem(editingItem.value.id, payload)
      toast.add({ severity: 'success', summary: 'تم', detail: 'تم تعديل المادة', life: 2000 })
    } else {
      await menu.createItem(payload)
      toast.add({ severity: 'success', summary: 'تم', detail: 'تمت الإضافة', life: 2000 })
    }
    dialogVisible.value = false
    await menu.fetchCategoryById(categoryId.value)
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشلت العملية', life: 3000 })
  }
}

async function handleAssign(optionIds: number[]) {
  if (!selectedItem.value) return
  try {
    await menu.assignOption(selectedItem.value.id, optionIds)
    await menu.fetchCategoryById(categoryId.value)
    selectedItem.value = menu.categories
      .flatMap(c => c.menuItems ?? [])
      .find(i => i.id === selectedItem.value!.id) ?? selectedItem.value
    toast.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الخيارات', life: 2000 })
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل إضافة الخيارات', life: 3000 })
  }
}

async function handleCreateAndAssign(opt: { name: string; price: number }) {
  if (!selectedItem.value) return
  try {
    const res = await menu.createOption(opt)
    if (res?.id) {
      await menu.assignOption(selectedItem.value.id, res.id)
      await menu.fetchCategoryById(categoryId.value)
      selectedItem.value = menu.categories
        .flatMap(c => c.menuItems ?? [])
        .find(i => i.id === selectedItem.value!.id) ?? selectedItem.value
    }
    toast.add({ severity: 'success', summary: 'تم', detail: 'تم إنشاء الخيار وإضافته', life: 2000 })
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشلت العملية', life: 3000 })
  }
}

// ── الفئة ──────────────────────────────────────────
function openEditCategory() {
  categoryDialogVisible.value = true
}

async function handleToggleCategory() {
  if (!category.value) return
  togglingCategory.value = true
  try {
    await menu.toggleCategory(category.value.id)
    await menu.fetchCategoryById(categoryId.value)
    toast.add({ severity: 'info', summary: 'تم', detail: category.value.isActive ? 'تم التفعيل' : 'تم التعطيل', life: 1500 })
  } finally {
    togglingCategory.value = false
  }
}

function handleDeleteCategory() {
  if (!category.value) return
  deleteMessage.value = `هل تريد حذف فئة "${category.value.name}"؟`
  deleteDialogVisible.value = true
}

async function onDeleteConfirmed() {
  if (!category.value) return
  deleting.value = true
  try {
    await menu.deleteCategory(category.value.id)
    toast.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الفئة', life: 2000 })
    deleteDialogVisible.value = false
    router.back()
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل الحذف', life: 3000 })
  } finally {
    deleting.value = false
  }
}

async function handleSaveCategory(form: any) {
  if (!category.value) return
  try {
    await menu.editCategory(category.value.id, form)
    await menu.fetchCategoryById(categoryId.value)
    toast.add({ severity: 'success', summary: 'تم', detail: 'تم تعديل الفئة', life: 2000 })
    categoryDialogVisible.value = false
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشلت العملية', life: 3000 })
  }
}
</script>