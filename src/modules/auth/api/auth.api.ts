import apiClient from '../../../services/api-client'
import type { LoginPayload, LoginResponse } from '../types/auth.types'

export default {
  login(payload: LoginPayload): Promise<LoginResponse> {
    return apiClient.post('/login', payload)
  },
}