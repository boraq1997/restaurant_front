// src/services/api.service.ts
import apiClient from './api-client'
import type {
  MenuCategoryApi,
  TableApi,
  InvoiceApi,
  AddInvoiceItemRequestDto,
  EditOrderRequestDto,
  VoidItemRequestDto,
  MoveInvoiceRequestDto,
  TransferItemsRequestDto,
} from '../types/api.types'

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface CheckoutRequestDto {
  invoiceId:        number
  cashBoxSessionId?: number | null
  paymentMethod:    number          // PaymentMethod enum: 0=Cash, 1=Card, 2=Online, 3=...
  amountPaid:       number
  discountType?:    number          // DiscountType: 0=نسبة مئوية, 1=مبلغ ثابت
  discountAmount?:  number | null   // nullable
  notes?:           string
}

export interface OpenCashBoxSessionRequestDto {
  cashBoxId:      number
  openingBalance: number
}

export interface CloseCashBoxSessionRequestDto {
  cashBoxSessionId: number
  cashAmount:       number
}

export interface CashTransactionRequestDto {
  cashBoxSessionId: number
  cashAmount:       number
  reason?:          string
  type:             0 | 1 | 2   // TransactionType: 0=In, 1=Out, 2=...
}

export interface MergeTablesRequestDto {
  sourceTableId: number
  targetTableId: number
}

// ─── Menu API ─────────────────────────────────────────────────────────────────

export const menuApi = {
  getAll: (): Promise<MenuCategoryApi[]> =>
    apiClient.get('/menu/all'),

  getFullMenu: (): Promise<MenuCategoryApi[]> =>
    apiClient.get('/menu/all'),
}

// ─── Table API ────────────────────────────────────────────────────────────────

export const tableApi = {
  getAll: (): Promise<TableApi[]> =>
    apiClient.get('/tables/all'),

  getById: (id: number): Promise<TableApi> =>
    apiClient.get(`/tables/${id}`),

  getByToken: (token: string): Promise<TableApi> =>
    apiClient.get(`/customers/Menu/${token}`),

  getInvoices: (tableId: number): Promise<InvoiceApi[]> =>
    apiClient.get(`/tables/${tableId}/invoices`),

  /** دمج طاولتين */
  mergeTables: (dto: MergeTablesRequestDto): Promise<void> =>
    apiClient.post('/tables/merge', dto),
}

// ─── Order API ────────────────────────────────────────────────────────────────

export const orderApi = {
  getById: (id: number): Promise<InvoiceApi> =>
    apiClient.get(`/order/${id}`),

  /** إضافة صنف للفاتورة */
  addItem: (dto: AddInvoiceItemRequestDto): Promise<InvoiceApi> =>
    apiClient.post('/order/add-item', dto),

  /** تعديل بيانات الطلب */
  editOrder: (dto: EditOrderRequestDto): Promise<InvoiceApi> =>
    apiClient.put('/order/edit-order', dto),

  /** إلغاء صنف من الفاتورة */
  voidItem: (dto: VoidItemRequestDto): Promise<void> =>
    apiClient.post('/order/void-item', dto),

  /** إتمام الدفع - يدعم الخصم وربط الجلسة */
  checkout: (dto: CheckoutRequestDto): Promise<void> =>
    apiClient.post('/order/checkout', dto),

  /** نقل الفاتورة لطاولة أخرى */
  moveInvoice: (dto: MoveInvoiceRequestDto): Promise<void> =>
    apiClient.post('/order/move-invoice', dto),

  /** نقل أصناف محددة من طاولة لأخرى */
  transferItems: (dto: TransferItemsRequestDto): Promise<void> =>
    apiClient.post('/order/transfer-items', dto),

  /** سجل الفواتير مع فلترة */
  getHistory: (params?: {
    StartDate?:   string
    EndDate?:     string
    Status?:      number
    TableId?:     number
    CustomerId?:  number
    PageNumber?:  number
    PageSize?:    number
  }): Promise<any> =>
    apiClient.get('/order/history', params),
}

// ─── CashBox API ──────────────────────────────────────────────────────────────

export const cashBoxApi = {
  /** فتح جلسة صندوق */
  openSession: (dto: OpenCashBoxSessionRequestDto): Promise<any> =>
    apiClient.post('/cashbox/opensession', dto),

  /** إغلاق جلسة صندوق */
  closeSession: (dto: CloseCashBoxSessionRequestDto): Promise<any> =>
    apiClient.post('/cashbox/closesession', dto),

  /** تسجيل معاملة نقدية */
  recordTransaction: (dto: CashTransactionRequestDto): Promise<any> =>
    apiClient.post('/cashbox/recordtransaction', dto),

  /** جلب معاملات جلسة معينة */
  getSessionTransactions: (sessionId: number): Promise<any[]> =>
    apiClient.get(`/cashbox/session/${sessionId}/transactions`),

  /** جلب الجلسة النشطة حالياً */
  getActiveSession: (): Promise<any> =>
    apiClient.get('/cashbox/active-session'),
}