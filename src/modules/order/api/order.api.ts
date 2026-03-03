import apiClient from '../../../services/api-client'
import type {
  AddInvoiceItemDto, EditOrderDto, CheckoutDto,
  VoidItemDto, TransferItemsDto, MoveInvoiceDto, OrderHistoryParams
} from '../../../types/order.types'

export const orderApi = {
  getById(id: number) {
    return apiClient.get(`/order/${id}`)
  },
  addItem(data: AddInvoiceItemDto) {
    return apiClient.post('/order/add-item', data)
  },
  editOrder(data: EditOrderDto) {
    return apiClient.put('/order/edit-order', data)
  },
  transferItems(data: TransferItemsDto) {
    return apiClient.post('/order/transfer-items', data)
  },
  checkout(data: CheckoutDto) {
    return apiClient.post('/order/checkout', data)
  },
  voidItem(data: VoidItemDto) {
    return apiClient.post('/order/void-item', data)
  },
  moveInvoice(data: MoveInvoiceDto) {
    return apiClient.post('/order/move-invoice', data)
  },
  getHistory(params?: OrderHistoryParams) {
    return apiClient.get('/order/history', params)
  },
}