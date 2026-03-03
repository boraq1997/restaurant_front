import type { TransactionType } from './api.types'

export interface OpenSessionDto {
  cashBoxId: number
  openingBalance: number
}

export interface CloseSessionDto {
  cashBoxSessionId: number
  cashAmount: number
}

export interface CashTransactionDto {
  cashBoxSessionId: number
  cashAmount: number
  reason?: string
  type: TransactionType
}