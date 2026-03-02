// src/modules/cashier/types/cashier.types.ts

import type { CartItem } from '../../../types/menu.types'

export type PaymentMethod = 'cash' | 'card' | 'online'

export type PaymentStatus = 'unpaid' | 'paid'

export interface CashierTable {
  id: number
  name: string
  number: number
  capacity: number
  paymentStatus: PaymentStatus
  order: CashierOrder | null
}

export interface CashierOrder {
  id: number
  tableId: number
  items: CartItem[]
  totalPrice: number
  createdAt: string
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod
}

export interface Invoice {
  orderId: number
  tableId: number
  tableName: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: PaymentMethod
  paidAt: string
}