import http from '../../../services/http'
import type { LoginPayload, LoginResponse } from '../types/auth.types'

export default {
  login(payload: LoginPayload): Promise<LoginResponse> {
    return http.post('/login', payload).then(res => res.data)
  },
}