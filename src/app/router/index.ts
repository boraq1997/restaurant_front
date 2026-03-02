// src/app/router/index.ts

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '../../modules/auth/pages/Login.vue'

const routes: RouteRecordRaw[] = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: () => import('../../modules/waiter/pages/WaiterHome.vue'),
  },
  {
    path: '/table/:id',
    component: () => import('../../modules/guest/pages/TableOrder.vue'),
  },
  {
    path: '/cashier',
    component: () => import('../../modules/cashier/pages/CashierHome.vue'),
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router