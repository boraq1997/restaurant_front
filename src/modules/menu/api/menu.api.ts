import apiClient from '../../../services/api-client'
import type { CreateCategoryDto, CreateMenuItemDto, CreateMenuOptionDto } from '../../../types/menu.types'

export const menuApi = {
  getAll() {
    return apiClient.get('/menu/all')
  },
  getCategories(activeOnly = true) {
    return apiClient.get('/menu/categories', { ActiveOnly: activeOnly })
  },
  getCategoryById(id: number) {
    return apiClient.get(`/menu/categories/${id}`)
  },
  createCategory(data: CreateCategoryDto) {
    return apiClient.post('/menu/categories/create', data)
  },
  editCategory(id: number, data: Partial<CreateCategoryDto>) {
    return apiClient.put(`/menu/categories/${id}/edit`, data)
  },
  deleteCategory(id: number) {
    return apiClient.delete(`/menu/categories/${id}/delete`)
  },
  toggleCategory(id: number) {
    return apiClient.post(`/menu/categories/${id}/toggle`, {})
  },
  getItemById(id: number) {
    return apiClient.get(`/menu/items/${id}`)
  },
  createItem(data: CreateMenuItemDto) {
    return apiClient.post('/menu/items/create', data)
  },
  editItem(id: number, data: Partial<CreateMenuItemDto>) {
    return apiClient.put(`/menu/items/${id}/edit`, data)
  },
  createOption(data: CreateMenuOptionDto) {
    return apiClient.post('/menu/options/create', data)
  },
  editOption(id: number, data: Partial<CreateMenuOptionDto>) {
    return apiClient.put(`/menu/options/${id}/edit`, data)
  },
  assignOption(itemId: number, optionId: number) {
    return apiClient.post(`/menu/items/${itemId}/assign-option/${optionId}`, {})
  },
}