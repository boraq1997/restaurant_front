import apiClient from '../../../services/api-client'
import type { UpdateTableDto, MergeTablesDto } from '../../../types/table.types'

export const tableApi = {
  getAll() {
    return apiClient.get('/tables/all')
  },
  getInvoices(id: number) {
    return apiClient.get(`/tables/${id}/invoices`)
  },
  update(id: number, data: UpdateTableDto) {
    return apiClient.put(`/tables/${id}`, data)
  },
  merge(data: MergeTablesDto) {
    return apiClient.post('/tables/merge', data)
  },
}