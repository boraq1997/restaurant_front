<template>
  <div class="admin-layout" dir="rtl">

    <!-- Mobile Overlay Backdrop -->
    <Transition name="backdrop-fade">
      <div
        v-if="isMobileOpen"
        class="sidebar-backdrop"
        @click="isMobileOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      class="admin-sidebar"
      :class="{
        collapsed,
        'mobile-open': isMobileOpen,
        'mobile-hidden': !isMobileOpen
      }"
    >

      <!-- Logo + Toggle -->
      <div class="sidebar-header">
        <div v-if="!collapsed" class="flex align-items-center gap-2 overflow-hidden">
          <div class="sidebar-logo">
            <i class="pi pi-shop text-white text-sm" />
          </div>
          <div>
            <p class="font-bold text-sm m-0 line-height-1 text-900">مطعمنا</p>
            <span class="text-xs text-500">لوحة التحكم</span>
          </div>
        </div>
        <div v-else class="sidebar-logo mx-auto">
          <i class="pi pi-shop text-white text-sm" />
        </div>

        <Button
          :icon="collapsed ? 'pi pi-align-right' : 'pi pi-align-left'"
          text rounded size="small" severity="secondary"
          class="flex-shrink-0 desktop-toggle"
          @click="collapsed = !collapsed"
        />

        <!-- Close button shown only on mobile -->
        <Button
          icon="pi pi-times"
          text rounded size="small" severity="secondary"
          class="flex-shrink-0 mobile-close-btn"
          @click="isMobileOpen = false"
        />
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <div
          v-for="item in navItems" :key="item.to"
          class="nav-item"
          :class="{ active: isActive(item.to) }"
          v-tooltip.left="collapsed ? item.label : ''"
          @click="navigateTo(item.to)"
        >
          <i :class="item.icon" class="nav-icon" />
          <Transition name="label-fade">
            <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
          </Transition>
        </div>
      </nav>

      <!-- Logout -->
      <div class="sidebar-footer">
        <div class="sidebar-divider mb-2" />
        <div
          class="nav-item logout-item"
          v-tooltip.left="collapsed ? 'تسجيل الخروج' : ''"
          @click="logoutVisible = true"
        >
          <i class="pi pi-sign-out nav-icon" />
          <Transition name="label-fade">
            <span v-if="!collapsed" class="nav-label">تسجيل الخروج</span>
          </Transition>
        </div>
      </div>

    </aside>

    <!-- Main: Header + Body -->
    <div class="admin-main">

      <!-- Header -->
      <header class="admin-header surface-card border-bottom-1 border-200 shadow-1">

        <div class="flex align-items-center gap-2">
          <!-- Hamburger button — mobile only -->
          <Button
            icon="pi pi-bars"
            text rounded size="small" severity="secondary"
            class="mobile-menu-btn"
            @click="isMobileOpen = true"
          />

          <i :class="currentPage.icon" class="text-primary" />
          <span class="font-bold text-800">{{ currentPage.label }}</span>
        </div>

        <!-- المستخدم -->
        <div class="flex align-items-center gap-2 surface-100 border-round-lg px-2 py-1">
          <i class="pi pi-user text-primary text-xs" />
          <span class="text-xs font-medium text-700">{{ auth.user?.username }}</span>
          <Tag value="أدمن" severity="warn" class="text-xs" />
        </div>

      </header>

      <!-- Body -->
      <main class="admin-content">
        <RouterView />
      </main>

    </div>

    <!-- Logout Dialog -->
    <Dialog
      v-model:visible="logoutVisible"
      :modal="true" :draggable="false"
      :closable="!isLoggingOut"
      :style="{ width: '320px' }"
      dir="rtl"
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

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import { useAuthStore } from '../../auth/store/auth.store'

const router = useRouter()
const route  = useRoute()
const auth   = useAuthStore()

// Desktop: collapsed/expanded toggle
const collapsed     = ref(false)
// Mobile: sidebar overlay open/close
const isMobileOpen  = ref(false)

const logoutVisible = ref(false)
const isLoggingOut  = ref(false)

const navItems = [
  { label: 'لوحة التحكم',     icon: 'pi pi-chart-bar', to: '/dashboard' },
  { label: 'إدارة المنيو',     icon: 'pi pi-list',      to: '/dashboard/menu' },
  { label: 'إدارة الطاولات',   icon: 'pi pi-th-large',  to: '/dashboard/tables' },
  { label: 'إدارة المستخدمين', icon: 'pi pi-users',     to: '/dashboard/users' },
  { label: 'سجل الطلبات',      icon: 'pi pi-history',   to: '/dashboard/orders' },
  { label: 'صفحة الويتر',      icon: 'pi pi-clock',     to: '/dashboard/waiter' },
  { label: 'صفحة الكاشير',     icon: 'pi pi-wallet',    to: '/dashboard/cashier' },
  { label: 'الطابعات',          icon: 'pi pi-print',      to: '/dashboard/printers' },

]

const currentPage = computed(() =>
  navItems.find(item =>
    item.to === '/dashboard'
      ? route.path === '/dashboard'
      : route.path.startsWith(item.to)
  ) ?? { label: 'لوحة التحكم', icon: 'pi pi-chart-bar' }
)

function isActive(to: string) {
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(to)
}

/** Navigate and auto-close sidebar on mobile after picking a page */
function navigateTo(to: string) {
  router.push(to)
  isMobileOpen.value = false
}

async function confirmLogout() {
  isLoggingOut.value = true
  await new Promise(r => setTimeout(r, 800))
  auth.logout()
}
</script>

<style scoped>
/* ══════════════════════════════════════════
   Layout الرئيسي
══════════════════════════════════════════ */
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--p-surface-50);
}

/* ══════════════════════════════════════════
   Sidebar — shared base
══════════════════════════════════════════ */
.admin-sidebar {
  width: 230px;
  height: 100vh;
  background: var(--p-surface-0);
  border-left: 1px solid var(--p-surface-200);
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  flex-shrink: 0;
  overflow: hidden;
  position: sticky;
  top: 0;
  z-index: 100;
}

.admin-sidebar.collapsed {
  width: 64px;
}

/* ── Sidebar Header ── */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.75rem;
  height: 60px;
  border-bottom: 1px solid var(--p-surface-200);
  flex-shrink: 0;
  gap: 0.5rem;
}

.collapsed .sidebar-header {
  justify-content: center;
  flex-direction: column;
  height: 60px;
  padding: 0;
  gap: 0;
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

/* ── Nav ── */
.sidebar-nav {
  flex: 1;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  color: var(--p-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
}

.nav-item:hover {
  background: var(--p-surface-100);
  color: var(--p-text-color);
}

.nav-item.active {
  background: var(--p-primary-50, #fff7ed);
  color: var(--p-primary-color);
  font-weight: 600;
}

.nav-icon {
  font-size: 1rem;
  flex-shrink: 0;
  width: 1rem;
  text-align: center;
}

.nav-label {
  font-size: 0.875rem;
}

/* ── Footer ── */
.sidebar-footer {
  padding: 0.5rem;
  flex-shrink: 0;
}

.sidebar-divider {
  height: 1px;
  background: var(--p-surface-200);
}

.logout-item { color: var(--p-red-400) !important; }
.logout-item:hover {
  background: var(--p-red-50) !important;
  color: var(--p-red-500) !important;
}

/* ══════════════════════════════════════════
   Main area
══════════════════════════════════════════ */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* ── Header ── */
.admin-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

/* ── Body ── */
.admin-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ══════════════════════════════════════════
   Label Transition
══════════════════════════════════════════ */
.label-fade-enter-active { transition: opacity 0.2s ease 0.1s; }
.label-fade-leave-active { transition: opacity 0.1s ease; }
.label-fade-enter-from,
.label-fade-leave-to { opacity: 0; }

/* ══════════════════════════════════════════
   Logout Dialog
══════════════════════════════════════════ */
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
  width: 72px; height: 72px;
  border-radius: 50%;
  background: var(--p-red-100);
  display: flex; align-items: center; justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}
.icon-ring i { font-size: 1.75rem; color: var(--p-red-500); }
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.2); }
  50%       { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
}
.dialog-title { font-size: 1.15rem; font-weight: 700; margin: 0 0 0.4rem; color: var(--p-text-color); }
.dialog-sub { font-size: 0.9rem; color: var(--p-text-muted-color); margin: 0 0 1.5rem; line-height: 1.6; }
.username { font-weight: 700; color: var(--p-primary-color); }
.dialog-actions { display: flex; gap: 0.75rem; width: 100%; }

/* ══════════════════════════════════════════
   DESKTOP  (≥ 768px) — normal sticky sidebar
══════════════════════════════════════════ */
@media (min-width: 768px) {
  .mobile-menu-btn  { display: none !important; }
  .mobile-close-btn { display: none !important; }

  /* Sidebar always visible, just toggled wide ↔ narrow */
  .admin-sidebar {
    position: sticky;
    transform: none !important;
  }
}

/* ══════════════════════════════════════════
   MOBILE  (< 768px) — overlay drawer
══════════════════════════════════════════ */
@media (max-width: 767px) {
  .desktop-toggle  { display: none !important; }
  .mobile-menu-btn { display: inline-flex !important; }
  .mobile-close-btn { display: inline-flex !important; }

  /* Sidebar floats above content */
  .admin-sidebar {
    position: fixed;
    top: 0;
    right: 0;         /* RTL: drawer slides from the right */
    height: 100vh;
    width: 260px !important;  /* always full-width on mobile, ignore collapsed */
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
    z-index: 200;
  }

  .admin-sidebar.mobile-open {
    transform: translateX(0);
  }

  /* Keep nav-label always visible on mobile (ignore collapsed state) */
  .admin-sidebar .nav-label { display: inline !important; opacity: 1 !important; }
  .admin-sidebar .sidebar-logo { margin: 0 !important; }

  /* Main takes full width */
  .admin-main { width: 100%; }
}

/* ── Backdrop ── */
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 199;
  backdrop-filter: blur(2px);
}

.backdrop-fade-enter-active { transition: opacity 0.25s ease; }
.backdrop-fade-leave-active { transition: opacity 0.2s ease; }
.backdrop-fade-enter-from,
.backdrop-fade-leave-to { opacity: 0; }
</style>