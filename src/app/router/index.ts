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

  // ── ويتر وكاشير (بدون layout) ─────────────────────
  {
    path: '/waiter',
    name: 'waiter-home',
    component: () => import('../../modules/waiter/pages/WaiterHome.vue'),
    //meta: { requiresAuth: true, roles: ['Waiter'] },
    meta: { public: true },
  },
  {
    path: '/cashier',
    name: 'cashier-home',
    component: () => import('../../modules/cashier/pages/CashierHome.vue'),
    //meta: { requiresAuth: true, roles: ['Cashier'] },
    meta: { public: true },
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
      {
        path: '/table/:id',
        name: 'table-order',
        component: () => import('../../modules/guest/pages/TableOrder.vue'),
      },
      // {
      //   path: 'tables',
      //   name: 'dashboard-tables',
      //   component: () => import('../../modules/dashboard/tables/pages/TablesPage.vue'),
      // },
      {
        path: 'users',
        name: 'dashboard-users',
        component: () => import('../../modules/dashboard/users/pages/UsersHome.vue'),
      },
      // {
      //   path: 'orders',
      //   name: 'dashboard-orders',
      //   component: () => import('../../modules/dashboard/orders/pages/OrdersPage.vue'),
      // },
      // ── ويتر وكاشير داخل Layout للأدمن ──────────────
      {
        path: 'waiter',
        name: 'admin-waiter',
        component: () => import('../../modules/waiter/pages/WaiterHome.vue'),
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