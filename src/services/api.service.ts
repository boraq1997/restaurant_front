// src/services/api.service.ts
import apiClient from './api-client'
import type {
  MenuCategoryApi,
  TableApi,
  InvoiceApi,
  AddInvoiceItemRequestDto,
  EditOrderRequestDto,
  VoidItemRequestDto,
  CheckoutRequestDto,
  MoveInvoiceRequestDto,
  TransferItemsRequestDto,
} from '../types/api.types'

export const menuApi = {
  getAll: (): Promise<MenuCategoryApi[]> =>
    apiClient.get('/menu/all'),

  getFullMenu: (): Promise<MenuCategoryApi[]> =>
    apiClient.get('/menu/all'),
}

export const tableApi = {
  getAll: (): Promise<TableApi[]> =>
    apiClient.get('/tables/all'),

  getById: (id: number): Promise<TableApi> =>
    apiClient.get(`/tables/${id}`),

  getByToken: (token: string): Promise<TableApi> =>
    apiClient.get(`/customers/Menu/${token}`),

  getInvoices: (tableId: number): Promise<InvoiceApi[]> =>
    apiClient.get(`/tables/${tableId}/invoices`),
}

export const orderApi = {
  getById: (id: number): Promise<InvoiceApi> =>
    apiClient.get(`/order/${id}`),

  addItem: (dto: AddInvoiceItemRequestDto): Promise<InvoiceApi> =>
    apiClient.post('/order/add-item', dto),

  editOrder: (dto: EditOrderRequestDto): Promise<InvoiceApi> =>
    apiClient.put('/order/edit-order', dto),

  voidItem: (dto: VoidItemRequestDto): Promise<void> =>
    apiClient.post('/order/void-item', dto),

  checkout: (dto: CheckoutRequestDto): Promise<void> =>
    apiClient.post('/order/checkout', dto),

  moveInvoice: (dto: MoveInvoiceRequestDto): Promise<void> =>
    apiClient.post('/order/move-invoice', dto),

  transferItems: (dto: TransferItemsRequestDto): Promise<void> =>
    apiClient.post('/order/transfer-items', dto),

  getHistory: (params?: {
    StartDate?: string
    EndDate?: string
    TableId?: number
    PageNumber?: number
    PageSize?: number
  }): Promise<any> =>
    apiClient.get('/order/history', params),

  removeItem: (itemId: number) =>
    apiClient.delete(`/order/remove-item/${itemId}`),

  updateItem: (itemId: number, quantity: number) =>
    apiClient.put(`/order/update-item/${itemId}`, { quantity }),
}