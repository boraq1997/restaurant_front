import apiClient from '../../../services/api-client'
import type { ApiTable } from '../types/waiter.types'

export default {
  // جلب جميع الطاولات
  getTables(): Promise<ApiTable[]> {
    return apiClient.get('/tables/all')
  },
}