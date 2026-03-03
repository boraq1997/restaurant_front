import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const ROLE_HOME_MAP = {
  Admin:   '/dashboard',
  Waiter:  '/waiter',
  Cashier: '/cashier',
} as const

const routes: RouteRecordRaw[] = [

  // ── عامة ───────────────────────────────────────────
  {
    path: '/login',
    name: 'login',
    component: () => import('../../modules/auth/pages/Login.vue'),
    meta: { guest: true },
  },

  // ── صفحة الزبون (بدون تسجيل دخول) ────────────────
  {
    path: '/table/:id',
    name: 'table-order',
    component: () => import('../../modules/guest/pages/TableOrder.vue'),
    meta: { public: true },
  },

  // ── كابتن الصالة ───────────────────────────────────
  {
    path: '/waiter',
    name: 'waiter-home',
    component: () => import('../../modules/waiter/pages/WaiterHome.vue'),
    meta: { requiresAuth: true, roles: ['Waiter', 'Admin'] },
  },

  // ── الكاشير ────────────────────────────────────────
  {
    path: '/cashier',
    name: 'cashier-home',
    component: () => import('../../modules/cashier/pages/CashierHome.vue'),
    meta: { requiresAuth: true, roles: ['Cashier', 'Admin'] },
  },

  // ── الأدمن ─────────────────────────────────────────
  // {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   component: () => import('../../modules/admin/pages/AdminDashboard.vue'),
  //   meta: { requiresAuth: true, roles: ['Admin'] },
  // },

  // ── Redirects ──────────────────────────────────────
  { path: '/', redirect: '/login' },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ── Navigation Guard ───────────────────────────────────
router.beforeEach(async (to) => {
  const { useAuthStore } = await import('../../modules/auth/store/auth.store')
  const auth = useAuthStore()

  const isAuth  = !!auth.token
  const role    = auth.user?.role as keyof typeof ROLE_HOME_MAP | undefined
  const myHome  = role ? ROLE_HOME_MAP[role] : null

  // صفحة الزبون - متاحة للجميع بدون تسجيل دخول
  if (to.meta.public) return true

  // صفحة تسجيل الدخول - إذا كان مسجلاً وجّهه لصفحته
  if (to.meta.guest) {
    return isAuth && myHome ? myHome : true
  }

  // باقي الصفحات تحتاج تسجيل دخول
  if (!isAuth) return '/login'

  // التحقق من الدور
  const allowedRoles = to.meta.roles as string[] | undefined
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // ليس له صلاحية → وجّهه لصفحته
    return myHome ?? '/login'
  }

  return true
})

export default router