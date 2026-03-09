import apiClient from '../../../../services/api-client'
import type { CreateTableDto, EditTableDto, CreateFloorDto, EditFloorDto } from '../types/tables-admin.types'

export const tablesAdminApi = {
  // ── طاولات ──────────────────────────────────────
  getAll(activeOnly = false) {
    return apiClient.get('/tables/all', { ActiveOnly: activeOnly })
  },
  getById(id: number) {
    return apiClient.get(`/tables/${id}`)
  },
  getByFloor(floorId: number) {
    return apiClient.get(`/tables/floor/${floorId}`)
  },
  create(data: CreateTableDto) {
    return apiClient.post('/tables/create', data)
  },
  edit(id: number, data: EditTableDto) {
    return apiClient.put(`/tables/${id}`, data)
  },
  delete(id: number) {
    return apiClient.delete(`/tables/${id}`)
  },
  regenerateQr(id: number) {
    return apiClient.post(`/tables/${id}/regenerate-qr`, {})
  },

  // ── طوابق ───────────────────────────────────────
  getAllFloors(activeOnly = false) {
    return apiClient.get('/tables/floor/all', { ActiveOnly: activeOnly })
  },
  createFloor(data: CreateFloorDto) {
    return apiClient.post('/tables/floor/create', data)
  },
  editFloor(id: number, data: EditFloorDto) {
    return apiClient.put(`/tables/floor/${id}`, data)
  },
  deleteFloor(id: number) {
    return apiClient.delete(`/tables/floor/${id}`)
  },
}