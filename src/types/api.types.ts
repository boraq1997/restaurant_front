// src/types/api.types.ts

export enum InvoiceStatus { Open = 0, Paid = 1, Voided = 2, Transferred = 3 }
export enum OrderTypes { DineIn = 0, Takeaway = 1, Delivery = 2 }
export enum PaymentMethod { Cash = 0, Card = 1, Online = 2, Complimentary = 3 }
export enum DiscountType { Percentage = 0, Fixed = 1 }
export enum TableStatus { Available = 0, Occupied = 1, Reserved = 2, Merged = 3 }

export interface MenuOptionApi {
  id: number
  name: string
  price: number
}

export interface MenuItemApi {
  id: number
  name: string
  description?: string | null
  price: number
  isAvailable: boolean
  categoryId: number
  image?: string | null        // ← أضفناها
  menuOptions?: MenuOptionApi[] // ← أضفناها (الـ API يرجعها بهذا الاسم)
}

export interface MenuCategoryApi {
  id: number
  name: string
  image?: string | null
  isActive: boolean
  printerId?: number | null
  menuItems?: MenuItemApi[]    // ← صححنا من items إلى menuItems
}

export interface TableApi {
  id: number
  number: number
  capacity: number
  status: TableStatus
  floorId: number
}

export interface InvoiceItemApi {
  id: number
  menuItemId: number
  menuItemName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  notes?: string | null
  selectedOptions?: MenuOptionApi[]
}

export interface InvoiceApi {
  id: number
  tableId: number
  status: InvoiceStatus
  orderType: OrderTypes
  notes?: string | null
  createdAt: string
  items: InvoiceItemApi[]
  totalPrice: number
}

// --- Request DTOs ---
export interface AddInvoiceItemRequestDto {
  invoiceId?: number | null
  tableId: number
  customerId: number
  menuItemId: number
  quantity: number
  notes?: string | null
  selectedItemOptions?: number[]
}

export interface EditOrderRequestDto {
  invoiceId: number
  customerId: number
  orderType: OrderTypes
  discountType: DiscountType
  discount?: number | null
  notes?: string | null
}

export interface CheckoutRequestDto {
  invoiceId: number
  cashBoxSessionId?: number | null
  paymentMethod: PaymentMethod
  amountPaid: number
  notes?: string | null
}

export interface VoidItemRequestDto {
  invoiceItemId: number
  voidReason?: string | null
}

export interface TransferItemsRequestDto {
  sourceTableId: number
  targetTableId: number
  targetInvoiceId?: number | null
  invoiceItemIds?: number[]
}

export interface MoveInvoiceRequestDto {
  targetTableId: number
  invoiceId: number
}