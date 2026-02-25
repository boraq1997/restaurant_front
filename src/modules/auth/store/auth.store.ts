import { defineStore } from 'pinia';
import { ref } from 'vue';
import AuthApi from '../api/auth.api';
import type { LoginPayload, User } from '../types/auth.types';
import router from '../../../app/router';

export const useAuthStore = defineStore('auth', () => {
  // const user = ref<User | null>(null);
  // const token = ref(localStorage.getItem('token') || '');
  // const loading = ref(false);

  // async function login(payload: LoginPayload) {
  //   loading.value = true;
  //   try {
  //     const res = await AuthApi.login(payload);
  //     token.value = res.token;
  //     user.value = res.user;
  //     localStorage.setItem('token', res.token);
  //     router.push('/dashboard'); // redirect after login
  //   } finally {
  //     loading.value = false;
  //   }
  // }

  // async function logout() {
  //   await AuthApi.logout();
  //   token.value = '';
  //   user.value = null;
  //   localStorage.removeItem('token');
  //   router.push('/login');
  // }

  // async function fetchUser() {
  //   if (!token.value) return;
  //   try {
  //     const res = await AuthApi.me();
  //     user.value = res.user;
  //   } catch {
  //     logout();
  //   }
  // }

  // return { user, token, loading, login, logout, fetchUser };
});