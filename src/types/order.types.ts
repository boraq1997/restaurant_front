import type { InvoiceStatus, OrderTypes, DiscountType, PaymentMethod } from './api.types'

export interface AddInvoiceItemDto {
  invoiceId?: number | null
  tableId: number
  customerId: number
  menuItemId: number
  quantity: number
  notes?: string | null
  selectedItemOptions?: number[]
}

export interface EditOrderDto {
  invoiceId: number
  customerId: number
  orderType: OrderTypes
  discountType: DiscountType
  discount?: number | null
  notes?: string | null
}

export interface CheckoutDto {
  invoiceId: number
  cashBoxSessionId?: number | null
  paymentMethod: PaymentMethod
  amountPaid: number
  notes?: string | null
}

export interface VoidItemDto {
  invoiceItemId: number
  voidReason?: string
}

export interface TransferItemsDto {
  sourceTableId: number
  targetTableId: number
  targetInvoiceId?: number | null
  invoiceItemIds?: number[]
}

export interface MoveInvoiceDto {
  targetTableId: number
  invoiceId: number
}

export interface OrderHistoryParams {
  startDate?: string
  endDate?: string
  status?: InvoiceStatus
  tableId?: number
  customerId?: number
  pageNumber?: number
  pageSize?: number
}