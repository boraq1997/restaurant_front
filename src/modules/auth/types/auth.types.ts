export interface LoginPayload {
  username: string
  password: string
}

export type UserRole = 'Admin' | 'Waiter' | 'Cashier'

// شكل الـ response من الـ backend
export interface LoginResponse {
  token: string
  user: string
  roleName: UserRole 
  roleId: number
}

// بيانات المستخدم التي نخزنها محلياً
export interface AuthUser {
  username: string
  role: UserRole
}

// الصفحة الافتراضية لكل دور
export const ROLE_HOME_MAP: Record<UserRole, string> = {
  Admin:   '/dashboard',
  Waiter:  '/waiter',
  Cashier: '/cashier',
}