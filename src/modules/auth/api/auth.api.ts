import apiClient from '../../../services/api-client';
import { type LoginPayload, type LoginResponse } from '../types/auth.types';

export default {
  login(payload: LoginPayload): Promise<LoginResponse> {
    return apiClient.post('/login', payload);
  },
  logout(): Promise<void> {
    return apiClient.post('/auth/logout', {});
  },
  me(): Promise<LoginResponse> {
    return apiClient.get('/auth/me');
  }
};