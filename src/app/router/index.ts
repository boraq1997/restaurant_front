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
    path: '/table/:token', 
    name: 'table-order',
    component: () => import('../../modules/guest/pages/TableOrder.vue'),
    meta: { public: true },
  },

  // ── ويتر (بدون layout) ────────────────────────────
  {
    path: '/waiter',
    name: 'waiter-home',
    component: () => import('../../modules/waiter/pages/WaiterHome.vue'),
    meta: { public: true },
  },
  {
    path: '/waiter/table/:id',
    name: 'waiter-table',
    component: () => import('../../modules/guest/pages/TableOrder.vue'),
    meta: { public: true },
  },

  // ── كاشير (بدون layout) ───────────────────────────
  {
    path: '/cashier',
    name: 'cashier-home',
    component: () => import('../../modules/cashier/pages/CashierHome.vue'),
    meta: { public: true },
  },
  {
    path: '/cashier/history',
    name: 'cashier-order-history',
    component: () => import('../../modules/cashier/components/OrderHistoryPage.vue'),
    meta: { requiresAuth: true, role: 'cashier' }
  },

  // ── الأدمن مع AdminLayout ──────────────────────────
  {
    path: '/dashboard',
    component: () => import('../../modules/dashboard/layout/AdminLayout.vue'),
    meta: { requiresAuth: true, roles: ['Admin'] },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../../modules/dashboard/home/pages/DashboardHome.vue'),
      },
      {
        path: 'menu',
        name: 'menu-categories',
        component: () => import('../../modules/dashboard/menu/pages/CategoriesPage.vue'),
      },
      {
        path: 'menu/:categoryId',
        name: 'menu-items',
        component: () => import('../../modules/dashboard/menu/pages/CategoryItemsPage.vue'),
      },
      // ← احذف هذا تماماً (كان يسبب المشكلة)
      // { path: '/table/:id', name: 'table-order', ... }
      {
        path: 'users',
        name: 'dashboard-users',
        component: () => import('../../modules/dashboard/users/pages/UsersHome.vue'),
      },
      {
        path: 'tables',
        name: 'dashboard-tables',
        component: () => import('../../modules/dashboard/tables/pages/TablesPage.vue'),
      },
      {
        path: 'waiter',
        name: 'admin-waiter',
        component: () => import('../../modules/waiter/pages/WaiterHome.vue'),
      },
      {
        path: 'waiter/table/:id',        // ← صفحة الطاولة للأدمن داخل Layout
        name: 'admin-waiter-table',
        component: () => import('../../modules/guest/pages/TableOrder.vue'),
      },
      {
        path: 'cashier',
        name: 'admin-cashier',
        component: () => import('../../modules/cashier/pages/CashierHome.vue'),
      },
    ],
  },

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

  const isAuth = !!auth.token
  const role   = auth.user?.role as keyof typeof ROLE_HOME_MAP | undefined
  const myHome = role ? ROLE_HOME_MAP[role] : null

  if (to.meta.public) return true

  if (to.meta.guest) {
    return isAuth && myHome ? myHome : true
  }

  if (!isAuth) return '/login'

  const allowedRoles = to.meta.roles as string[] | undefined
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return myHome ?? '/login'
  }

  return true
})

export default router