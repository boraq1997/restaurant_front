import apiClient from '../../../services/api-client'
import type { OpenSessionDto, CloseSessionDto, CashTransactionDto } from '../../../types/cashbox.types'

export const cashboxApi = {
  openSession(data: OpenSessionDto) {
    return apiClient.post('/cashBox/openSession', data)
  },
  closeSession(data: CloseSessionDto) {
    return apiClient.post('/cashBox/closeSession', data)
  },
  recordTransaction(data: CashTransactionDto) {
    return apiClient.post('/cashBox/recordTransaction', data)
  },
  getSessionTransactions(sessionId: number) {
    return apiClient.get(`/cashBox/session/${sessionId}/transactions`)
  },
  getActiveSession() {
    return apiClient.get('/cashBox/active-session')
  },
}