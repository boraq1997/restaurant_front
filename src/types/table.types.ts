import type { TableStatus } from './api.types'

export interface Table {
  id: number
  number: number
  capacity: number
  status: TableStatus
  floorId: number
  primaryTableId?: number | null
  // الفواتير المرتبطة بالطاولة
  invoices?: Invoice[]
}

export interface Invoice {
  id: number
  tableId: number
  status: number
  totalAmount: number
  createdAt: string
  items?: InvoiceItem[]
}

export interface InvoiceItem {
  id: number
  menuItemId: number
  menuItemName: string
  quantity: number
  price: number
  notes?: string
  selectedOptions?: { id: number; name: string; price: number }[]
}

// DTOs للإرسال
export interface UpdateTableDto {
  id: number
  number: number
  capacity: number
  primaryTableId?: number | null
  status: number
  floorId: number
}

export interface MergeTablesDto {
  sourceTableId: number
  targetTableId: number
}