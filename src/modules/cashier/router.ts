// src/modules/cashier/router.ts

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/cashier',
    component: () => import('./pages/CashierHome.vue'),
    meta: { requiresAuth: true, role: 'cashier' },
  },
]

export default routes