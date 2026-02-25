import type { CartItem } from '../../../types/menu.types'

export interface Reservation {
  guestName: string
  time: string
  date: string
  guestCount: number
}

export interface Table {
  id: number
  name: string
  number: number
  capacity: number
  status: 'available' | 'occupied' | 'reserved'
  reservation: Reservation | null
}

export interface Order {
  tableId: number
  items: CartItem[]
  totalPrice: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready'
}