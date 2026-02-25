import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Login from '../../modules/auth/pages/Login.vue';

const routes: RouteRecordRaw[] = [
  { path: '/login', component: Login },
  { 
    path: '/table/:id', 
    component: () => import('../../modules/guest/pages/TableOrder.vue'),
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;