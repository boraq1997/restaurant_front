import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const APP_NAME = 'مطعمنا'

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
    meta: { guest: true, title: 'تسجيل الدخول' },
  },

  // ── صفحة الزبون (بدون تسجيل دخول) ────────────────
  {
    path: '/table/:token',
    name: 'table-order',
    component: () => import('../../modules/guest/pages/TableOrder.vue'),
    meta: { public: true, title: 'طلب الطاولة' },
  },

  // ── ويتر ──────────────────────────────────────────
  {
    path: '/waiter',
    name: 'waiter-home',
    component: () => import('../../modules/waiter/pages/WaiterHome.vue'),
    meta: { public: true, title: 'الويتر' },
  },
  {
    path: '/waiter/table/:id',
    name: 'waiter-table',
    component: () => import('../../modules/guest/pages/TableOrder.vue'),
    meta: { public: true, title: 'الطاولة' },
  },

  // ── كاشير ─────────────────────────────────────────
  {
    path: '/cashier',
    name: 'cashier-home',
    component: () => import('../../modules/cashier/pages/CashierHome.vue'),
    meta: { public: true, title: 'الكاشير' },
  },
  {
    path: '/cashier/history',
    name: 'cashier-order-history',
    component: () => import('../../modules/cashier/components/OrderHistoryPage.vue'),
    meta: { requiresAuth: true, role: 'cashier', title: 'سجل الطلبات' },
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
        meta: { title: 'لوحة التحكم' },
      },
      {
        path: 'menu',
        name: 'menu-categories',
        component: () => import('../../modules/dashboard/menu/pages/CategoriesPage.vue'),
        meta: { title: 'إدارة المنيو' },
      },
      {
        path: 'menu/:categoryId',
        name: 'menu-items',
        component: () => import('../../modules/dashboard/menu/pages/CategoryItemsPage.vue'),
        meta: { title: 'مواد الفئة' },
      },
      {
        path: 'users',
        name: 'dashboard-users',
        //component: () => import('../../modules/errors/pages/UnderDevelopment.vue'),
        component: ()=>import('../../modules/errors/pages/UnderDevelopment.vue'),
        meta: { title: 'إدارة المستخدمين' },
      },
      {
        path: 'tables',
        name: 'dashboard-tables',
        component: () => import('../../modules/dashboard/tables/pages/TablesPage.vue'),
        meta: { title: 'إدارة الطاولات' },
      },
      {
        path: 'waiter',
        name: 'admin-waiter',
        component: () => import('../../modules/waiter/pages/WaiterHome.vue'),
        meta: { title: 'الويتر' },
      },
      {
        path: 'waiter/table/:id',
        name: 'admin-waiter-table',
        component: () => import('../../modules/guest/pages/TableOrder.vue'),
        meta: { title: 'الطاولة' },
      },
      {
        path: 'cashier',
        name: 'admin-cashier',
        component: () => import('../../modules/cashier/pages/CashierHome.vue'),
        meta: { title: 'الكاشير' },
      },
      {
        path: 'printers',
        name: 'dashboard-printers',
        component: () => import('../../modules/dashboard/printers/pages/PrintersPage.vue'),
        meta: { title: 'الطابعات' },
      },
      {
        path: 'orders',
        name: 'dashboard-orders',
        component: () => import('../../modules/dashboard/orders/OrderHistoryPage.vue'),
        meta: { title: 'سجل الطلبات' },
      },
      {
        path: 'inventory',
        name: 'dashboard-inventory',
        component: () => import('../../modules/dashboard/inventory/InventoryPage.vue'),
        meta: { title: 'المخزون' },
      },
    ],
  },

  // ── صفحات الخطأ ────────────────────────────────────
  {
    path: '/500',
    name: 'error-500',
    component: () => import('../../modules/errors/pages/Error500.vue'),
    meta: { public: true, title: 'خطأ في الخادم' },
  },
  {
    path: '/404',
    name: 'error-404',
    component: () => import('../../modules/errors/pages/Error404.vue'),
    meta: { public: true, title: 'الصفحة غير موجودة' },
  },

  // ── Redirect الرئيسية ──────────────────────────────
  { path: '/', redirect: '/login' },

  // ── 404 catch-all — يجب أن يكون آخر route دائماً ──
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../../modules/errors/pages/Error404.vue'),
    meta: { public: true, title: 'الصفحة غير موجودة' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ── تحديث عنوان الـ tab تلقائياً ──────────────────────
router.afterEach((to) => {
  const pageTitle = to.meta.title as string | undefined
  document.title = pageTitle ? `${APP_NAME} | ${pageTitle}` : APP_NAME
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