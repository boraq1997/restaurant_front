import 'vue-router'
import type { UserRole } from '../../modules/auth/types/auth.types'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guest?: boolean
    public?: boolean
    roles?: UserRole[]
  }
}