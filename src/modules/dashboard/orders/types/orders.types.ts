// src/modules/dashboard/orders/types/orders.types.ts

export interface OrderFilters {
  startDate: Date | null
  endDate:   Date | null
  status:    string | null
  tableId:   number | null
}

export interface OrderStats {
  total:     number
  pending:   number
  paid:      number
  cancelled: number
}

export interface InvoiceItemDto {
  id:                 number
  menuItemId?:        number
  menuItemName:       string
  quantity:           number
  price:              number
  totalPrice:         number
  notes?:             string | null
  selectedOptionsDto?: { id: number; name: string; price: number }[]
}

export interface OrderDto {
  id:              number
  tableId:         number
  invoiceStatus:   string | number
  paymentMethod?:  string | number
  orderType?:      string | number
  notes?:          string | null
  createdAt:       string
  invoiceItemsDto?: InvoiceItemDto[]
  subTotalPrice?:  number
  discountPrice?:  number
  finalPrice:      number
  username?:       string
}

export interface PaginatedResult<T> {
  items:       T[]
  totalCount:  number
  totalPages:  number
  currentPage: number
}