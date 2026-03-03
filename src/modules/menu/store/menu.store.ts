import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { menuApi } from '../api/menu.api'
import type { MenuCategory, MenuItem } from '../../../types/menu.types'

export const useMenuStore = defineStore('menu', () => {
  const categories = ref<MenuCategory[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // كل الأصناف المتاحة من جميع الفئات
  const allItems = computed<MenuItem[]>(() =>
    categories.value.flatMap(c => c.items ?? [])
  )

  const activeCategories = computed(() =>
    categories.value.filter(c => c.isActive)
  )

  const itemsByCategory = (categoryId: number) =>
    computed(() =>
      categories.value
        .find(c => c.id === categoryId)
        ?.items?.filter(i => i.isAvailable) ?? []
    )

  async function fetchMenu() {
    loading.value = true
    error.value = null
    try {
      // /api/menu/all يرجع categories مع items بداخلها
      const data = await menuApi.getAll()
      categories.value = data
    } catch (e: any) {
      error.value = e?.message ?? 'فشل تحميل المينيو'
    } finally {
      loading.value = false
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

  return {
    categories, loading, error,
    allItems, activeCategories,
    itemsByCategory,
    fetchMenu, toggleCategory,
  }
})