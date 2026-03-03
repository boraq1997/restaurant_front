import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AuthApi from '../api/auth.api'
import type { LoginPayload, AuthUser, UserRole } from '../types/auth.types'
import { ROLE_HOME_MAP } from '../types/auth.types'
import router from '../../../app/router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const user = ref<AuthUser | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  )
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed<UserRole | null>(() => user.value?.role ?? null)

  async function login(payload: LoginPayload) {
    loading.value = true
    error.value = null

    try {
      const res = await AuthApi.login(payload)

      // الـ backend يرجع "user" وليس "username"
      const authUser: AuthUser = {
        username: res.user,
        role: res.role,
      }

      token.value = res.token
      user.value = authUser

      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(authUser))

      const home = ROLE_HOME_MAP[res.role] ?? '/waiter'
      await router.push(home)

    } catch (err: any) {
      error.value = err?.response?.data?.message || 'فشل تسجيل الدخول'
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    error.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  function hasRole(...roles: UserRole[]): boolean {
    return !!user.value && roles.includes(user.value.role)
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    userRole,
    login,
    logout,
    hasRole,
  }
})