import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { menuApi } from '../api/menu.api'
import type { MenuCategory, MenuItem, CreateCategoryDto, CreateMenuItemDto, CreateMenuOptionDto } from '../../../types/menu.types'

export const useMenuStore = defineStore('menu', () => {
  const categories = ref<MenuCategory[]>([])
  const loading    = ref(false)
  const saving     = ref(false)
  const error      = ref<string | null>(null)

  const allItems = computed<MenuItem[]>(() =>
    categories.value.flatMap(c => c.menuItems ?? [])  // ← items → menuItems
  )

  const allOptions = computed(() =>
    categories.value
      .flatMap(c => c.menuItems ?? [])
      .flatMap(i => i.menuOptions ?? [])
      .filter((o, i, arr) => arr.findIndex(x => x.id === o.id) === i)
  )

  const activeCategories = computed(() =>
    categories.value.filter(c => c.isActive)
  )

  // ── جلب كل المينيو ──────────────────────────────
  async function fetchMenu() {
    loading.value = true
    error.value = null
    try {
      const data = await menuApi.getAll()
      categories.value = data
    } catch (e: any) {
      error.value = e?.message ?? 'فشل تحميل المينيو'
    } finally {
      loading.value = false
    }
  }

  async function fetchCategoryById(id: number) {
    loading.value = true
    error.value = null
    try {
      const data = await menuApi.getCategoryById(id)
      // تحديث الفئة في الـ store
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        categories.value[index] = data
      } else {
        categories.value.push(data)
      }
    } catch (e: any) {
      error.value = e?.message ?? 'فشل تحميل الفئة'
    } finally {
      loading.value = false
    }
  }

  // ── الفئات ──────────────────────────────────────
  async function createCategory(data: CreateCategoryDto) {
    saving.value = true
    try {
      await menuApi.createCategory(data)
      await fetchMenu()
    } finally {
      saving.value = false
    }
  }

  async function editCategory(id: number, data: Partial<CreateCategoryDto>) {
    saving.value = true
    try {
      await menuApi.editCategory(id, data)
      await fetchMenu()
    } finally {
      saving.value = false
    }
  }

  async function deleteCategory(id: number) {
    saving.value = true
    try {
      await menuApi.deleteCategory(id)
      categories.value = categories.value.filter(c => c.id !== id)
    } finally {
      saving.value = false
    }
  }

  async function toggleCategory(id: number) {
    try {
      await menuApi.toggleCategory(id)
      const cat = categories.value.find(c => c.id === id)
      if (cat) cat.isActive = !cat.isActive
    } catch (e: any) {
      error.value = e?.message ?? 'فشل تغيير حالة الفئة'
    }
  }

  // ── المواد ──────────────────────────────────────
  async function createItem(data: CreateMenuItemDto) {
    saving.value = true
    try {
      await menuApi.createItem(data)
      await fetchMenu()
    } finally {
      saving.value = false
    }
  }

  async function editItem(id: number, data: Partial<CreateMenuItemDto>) {
    saving.value = true
    try {
      await menuApi.editItem(id, data)
      await fetchMenu()
    } finally {
      saving.value = false
    }
  }

  async function toggleItem(id: number) {
  try {
    await menuApi.toggleItem(id)
    // تحديث محلي فوري بدون fetch
    for (const cat of categories.value) {
      const item = (cat.menuItems ?? []).find(i => i.id === id)
      if (item) {
        item.isAvailable = !item.isAvailable
        break
      }
    }
  } catch (e: any) {
    error.value = e?.message ?? 'فشل تغيير حالة المادة'
    throw e
  }
}

async function deleteItem(id: number) {
  saving.value = true
  try {
    await menuApi.deleteItem(id)
    // حذف محلي فوري
    for (const cat of categories.value) {
      const index = (cat.menuItems ?? []).findIndex(i => i.id === id)
      if (index !== -1) {
        cat.menuItems!.splice(index, 1)
        break
      }
    }
  } catch (e: any) {
    error.value = e?.message ?? 'فشل حذف المادة'
    throw e
  } finally {
    saving.value = false
  }
}

  // ── الـ Options ──────────────────────────────────
  async function createOption(data: CreateMenuOptionDto) {
    saving.value = true
    try {
      const res = await menuApi.createOption(data)
      return res
    } finally {
      saving.value = false
    }
  }

  async function editOption(id: number, data: Partial<CreateMenuOptionDto>) {
    saving.value = true
    try {
      await menuApi.editOption(id, data)
    } finally {
      saving.value = false
    }
  }

  async function assignOption(itemId: number, optionIds: number[]) {
    await menuApi.assignOption(itemId, optionIds)
    await fetchMenu()
  }

  return {
    categories, loading, saving, error,
    allItems, allOptions, activeCategories,
    fetchMenu, fetchCategoryById,
    createCategory, editCategory, deleteCategory, toggleCategory,
    createItem, editItem, toggleItem, deleteItem,
    createOption, editOption, assignOption,
  }
})