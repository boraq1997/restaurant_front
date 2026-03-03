<template>
  <div class="admin-sidebar" :class="{ collapsed }" dir="rtl">

    <!-- Logo + Toggle -->
    <div class="sidebar-header">
      <div v-if="!collapsed" class="flex align-items-center gap-2 overflow-hidden">
        <div class="sidebar-logo">
          <i class="pi pi-shop" />
        </div>
        <div>
          <p class="font-bold text-sm m-0 line-height-1 text-900">مطعمنا</p>
          <span class="text-xs text-500">لوحة التحكم</span>
        </div>
      </div>
      <div v-else class="sidebar-logo mx-auto">
        <i class="pi pi-shop" />
      </div>

      <Button
        :icon="collapsed ? 'pi pi-align-right' : 'pi pi-align-left'"
        text rounded size="small"
        severity="secondary"
        class="toggle-btn"
        @click="emit('toggle')"
      />
    </div>

    <!-- Nav Items -->
    <nav class="sidebar-nav">
      <div
        v-for="item in navItems" :key="item.to"
        class="nav-item"
        :class="{ active: isActive(item.to) }"
        v-tooltip.left="collapsed ? item.label : ''"
        @click="router.push(item.to)"
      >
        <i :class="item.icon" class="nav-icon" />
        <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
      </div>
    </nav>

    <!-- Footer: معلومات المستخدم + logout -->
    <div class="sidebar-footer">
      <div class="nav-item" :class="{ 'justify-content-center': collapsed }"
        v-tooltip.left="collapsed ? 'تسجيل الخروج' : ''"
        @click="handleLogout"
      >
        <i class="pi pi-sign-out nav-icon text-red-400" />
        <span v-if="!collapsed" class="nav-label text-red-400">تسجيل الخروج</span>
      </div>
    </div>

  </div>

  <!-- Logout Dialog -->
  <Dialog
    v-model:visible="logoutVisible"
    :modal="true" :draggable="false"
    :style="{ width: '320px' }" dir="rtl"
  >
    <template #container>
      <div class="logout-dialog" :class="{ leaving: isLoggingOut }">
        <div class="icon-wrap">
          <div class="icon-ring">
            <i class="pi pi-sign-out" />
          </div>
        </div>
        <p class="dialog-title">تسجيل الخروج</p>
        <p class="dialog-sub">
          هل تريد تسجيل الخروج
          <span class="username">{{ auth.user?.username }}</span> ؟
        </p>
        <div class="dialog-actions">
          <Button label="إلغاء" severity="secondary" outlined class="flex-1"
            :disabled="isLoggingOut" @click="logoutVisible = false" />
          <Button label="خروج" severity="danger" class="flex-1"
            :loading="isLoggingOut" @click="confirmLogout" />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useAuthStore } from '../../auth/store/auth.store'

defineProps<{ collapsed: boolean }>()
const emit = defineEmits<{ toggle: [] }>()

const router = useRouter()
const route  = useRoute()
const auth   = useAuthStore()

const logoutVisible  = ref(false)
const isLoggingOut   = ref(false)

const navItems = [
  { label: 'لوحة التحكم',      icon: 'pi pi-chart-bar',  to: '/dashboard' },
  { label: 'إدارة المنيو',      icon: 'pi pi-list',       to: '/dashboard/menu' },
  { label: 'إدارة الطاولات',    icon: 'pi pi-th-large',   to: '/dashboard/tables' },
  { label: 'إدارة المستخدمين',  icon: 'pi pi-users',      to: '/dashboard/users' },
  { label: 'سجل الطلبات',       icon: 'pi pi-history',    to: '/dashboard/orders' },
  { label: 'صفحة الويتر',       icon: 'pi pi-clock',      to: '/waiter' },
  { label: 'صفحة الكاشير',      icon: 'pi pi-wallet',     to: '/cashier' },
]

function isActive(to: string) {
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(to)
}

function handleLogout() {
  logoutVisible.value = true
}

async function confirmLogout() {
  isLoggingOut.value = true
  await new Promise(r => setTimeout(r, 800))
  auth.logout()
}
</script>

<style scoped>
.admin-sidebar {
  width: 240px;
  min-height: 100vh;
  background: var(--p-surface-0);
  border-left: 1px solid var(--p-surface-200);
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  flex-shrink: 0;
}

.admin-sidebar.collapsed {
  width: 64px;
}

/* Header */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0.75rem;
  border-bottom: 1px solid var(--p-surface-200);
  min-height: 64px;
}

.collapsed .sidebar-header {
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

.sidebar-logo {
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  background: var(--p-primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-logo i {
  color: white;
  font-size: 0.9rem;
}

.toggle-btn {
  flex-shrink: 0;
}

/* Nav */
.sidebar-nav {
  flex: 1;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  white-space: nowrap;
  color: var(--p-text-color-secondary);
}

.nav-item:hover {
  background: var(--p-surface-100);
  color: var(--p-text-color);
}

.nav-item.active {
  background: var(--p-primary-50, #fff7ed);
  color: var(--p-primary-color);
}

.nav-icon {
  font-size: 1rem;
  flex-shrink: 0;
  width: 1rem;
  text-align: center;
}

.nav-label {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Footer */
.sidebar-footer {
  padding: 0.5rem;
  border-top: 1px solid var(--p-surface-200);
}

/* Logout Dialog */
.logout-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem 1.5rem;
  border-radius: 16px;
  background: var(--p-surface-0);
  text-align: center;
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.logout-dialog.leaving { opacity: 0.4; transform: scale(0.97); }
.icon-wrap { margin-bottom: 1.25rem; }
.icon-ring {
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--p-red-100);
  display: flex; align-items: center; justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}
.icon-ring i { font-size: 1.75rem; color: var(--p-red-500); }
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.2); }
  50%       { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
}
.dialog-title { font-size: 1.15rem; font-weight: 700; margin: 0 0 0.4rem; }
.dialog-sub { font-size: 0.9rem; color: var(--p-text-muted-color); margin: 0 0 1.5rem; line-height: 1.6; }
.username { font-weight: 700; color: var(--p-primary-color); }
.dialog-actions { display: flex; gap: 0.75rem; width: 100%; }
</style>