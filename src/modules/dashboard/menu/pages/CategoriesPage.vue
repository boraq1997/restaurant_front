<template>
  <div class="min-h-screen surface-50" dir="rtl">

    <!-- Header -->
    <div class="px-3 py-3 flex align-items-center justify-content-between border-bottom-1 border-200 surface-card">
      <span class="font-bold text-lg text-900">الفئات</span>
      <div class="flex gap-2">
        <Button
          icon="pi pi-sliders-h"
          label="الخيارات"
          severity="secondary"
          size="small"
          @click="optionsPanelVisible = true"
        />
        <Button label="فئة جديدة" icon="pi pi-plus" size="small" @click="openCreate" />
      </div>
    </div>

    <div v-if="menu.loading" class="flex justify-content-center py-8">
      <ProgressSpinner style="width:40px;height:40px" />
    </div>

    <div v-else-if="menu.categories.length === 0"
      class="flex flex-column align-items-center py-8 gap-3">
      <i class="pi pi-inbox text-5xl text-300" />
      <p class="text-500 m-0">لا توجد فئات</p>
      <Button label="إضافة فئة" icon="pi pi-plus" @click="openCreate" />
    </div>

    <main v-else class="px-3 py-3">
      <CategoryGrid
        :categories="menu.categories"
        :toggling-id="togglingId"
        @select="goToItems"
        @edit="openEdit"
        @delete="handleDelete"
        @toggle="handleToggle"
      />
    </main>

    <CategoryDialog
      v-model="dialogVisible"
      :category="editingCategory"
      :loading="menu.saving"
      @save="handleSave"
    />

    <ConfirmDeleteDialog
      v-model="deleteDialogVisible"
      :message="deleteMessage"
      :loading="deleting"
      @confirm="onDeleteConfirmed"
    />

    <OptionsPanel v-model="optionsPanelVisible" />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useMenuStore } from '../../../menu/store/menu.store'
import type { MenuCategory } from '../../../../types/menu.types'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import CategoryGrid from '../components/CategoryGrid.vue'
import CategoryDialog from '../components/CategoryDialog.vue'
import ConfirmDeleteDialog from '../../../../components/shared/ConfirmDeleteDialog.vue'
import OptionsPanel from '../components/OptionsPanel.vue'

const router  = useRouter()
const toast   = useToast()
const menu    = useMenuStore()

const dialogVisible   = ref(false)
const editingCategory = ref<MenuCategory | null>(null)
const togglingId      = ref<number | null>(null)

const deleteDialogVisible = ref(false)
const deleteMessage       = ref('')
const deleting            = ref(false)
const pendingDeleteId     = ref<number | null>(null)
const optionsPanelVisible = ref(false)

onMounted(() => menu.fetchMenu())

function goToItems(cat: MenuCategory) {
  router.push(`/dashboard/menu/${cat.id}`)
}

function openCreate() {
  editingCategory.value = null
  dialogVisible.value = true
}

function openEdit(cat: MenuCategory) {
  editingCategory.value = cat
  dialogVisible.value = true
}

async function handleSave(form: any) {
  if (!form.name?.trim()) {
    toast.add({ severity: 'warn', summary: 'تنبيه', detail: 'اسم الفئة مطلوب', life: 3000 })
    return
  }
  try {
    if (editingCategory.value) {
      await menu.editCategory(editingCategory.value.id, form)
      toast.add({ severity: 'success', summary: 'تم', detail: 'تم تعديل الفئة', life: 2000 })
    } else {
      await menu.createCategory(form)
      toast.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الفئة', life: 2000 })
    }
    dialogVisible.value = false
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشلت العملية', life: 3000 })
  }
}

async function handleToggle(cat: MenuCategory) {
  togglingId.value = cat.id
  try {
    await menu.toggleCategory(cat.id)
  } finally {
    togglingId.value = null
  }
}

// بدل confirm.require
function handleDelete(cat: MenuCategory) {
  pendingDeleteId.value = cat.id
  deleteMessage.value   = `هل تريد حذف "${cat.name}"؟`
  deleteDialogVisible.value = true
}

async function onDeleteConfirmed() {
  if (!pendingDeleteId.value) return
  deleting.value = true
  try {
    await menu.deleteCategory(pendingDeleteId.value)
    toast.add({ severity: 'success', summary: 'تم', detail: 'تم الحذف', life: 2000 })
    deleteDialogVisible.value = false
  } catch {
    toast.add({ severity: 'error', summary: 'خطأ', detail: 'فشل الحذف', life: 3000 })
  } finally {
    deleting.value = false
    pendingDeleteId.value = null
  }
}
</script>