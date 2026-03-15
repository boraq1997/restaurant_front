<template>
  <div class="shell" dir="rtl">

    <!-- Mobile backdrop -->
    <Transition name="bd">
      <div v-if="mobileOpen" class="backdrop" @click="mobileOpen = false" />
    </Transition>

    <!-- ═══════════════════════════════
         SIDEBAR
    ═══════════════════════════════ -->
    <aside class="sidebar" :class="{ slim: slim, open: mobileOpen }">

      <!-- Brand -->
      <div class="brand">
        <div class="brand-mark">
          <i class="pi pi-shop" />
        </div>
        <Transition name="text-fade">
          <div v-if="!slim" class="brand-text">
            <span class="brand-name">مطعمنا</span>
            <span class="brand-tag">POS System</span>
          </div>
        </Transition>
        <button class="slim-btn dt-only" @click="slim = !slim">
          <i class="pi" :class="slim ? 'pi-angle-left' : 'pi-angle-right'" />
        </button>
        <button class="slim-btn mob-only" @click="mobileOpen = false">
          <i class="pi pi-times" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="nav">

        <!-- إدارة -->
        <p class="nav-group-title" v-if="!slim">إدارة</p>
        <div
          v-for="item in mgmtNav"
          :key="item.to"
          class="nav-link"
          :class="{ 'nav-link--on': isOn(item.to) }"
          v-tooltip.left="slim ? item.label : undefined"
          @click="go(item.to)"
        >
          <span class="nl-icon"><i :class="item.icon" /></span>
          <Transition name="text-fade">
            <span v-if="!slim" class="nl-text">{{ item.label }}</span>
          </Transition>
          <span v-if="!slim && isOn(item.to)" class="nl-pip" />
        </div>

        <div class="nav-sep" />

        <!-- عمليات -->
        <p class="nav-group-title" v-if="!slim">عمليات</p>
        <div
          v-for="item in opsNav"
          :key="item.to"
          class="nav-link"
          :class="{ 'nav-link--on': isOn(item.to) }"
          v-tooltip.left="slim ? item.label : undefined"
          @click="go(item.to)"
        >
          <span class="nl-icon"><i :class="item.icon" /></span>
          <Transition name="text-fade">
            <span v-if="!slim" class="nl-text">{{ item.label }}</span>
          </Transition>
          <span v-if="!slim && isOn(item.to)" class="nl-pip" />
        </div>

      </nav>

      <!-- User strip -->
      <div class="user-strip">

        <!-- عادي: زر كامل -->
        <Button
          v-if="!slim"
          label="تسجيل الخروج"
          icon="pi pi-sign-out"
          fluid
          outlined
          severity="danger"
          @click="dlgVisible = true"
        />

        <!-- مصغّر: أيقونة فقط -->
        <button
          v-else
          class="slim-logout"
          v-tooltip.left="'تسجيل الخروج'"
          @click="dlgVisible = true"
        >
          <i class="pi pi-sign-out" />
        </button>

      </div>

    </aside>

    <!-- ═══════════════════════════════
         MAIN
    ═══════════════════════════════ -->
    <div class="body">

      <!-- Header -->
      <header class="admin-header surface-card border-bottom-1 border-200 shadow-1">

        <div class="flex align-items-center gap-2">
          <!-- Hamburger — mobile only -->
          <Button
            icon="pi pi-bars"
            text rounded size="small" severity="secondary"
            class="mobile-menu-btn"
            @click="mobileOpen = true"
          />
          <i :class="activePage.icon" class="text-primary" />
          <span class="font-bold text-800">{{ activePage.label }}</span>
        </div>

        <!-- المستخدم -->
        <div class="flex align-items-center gap-2 surface-100 border-round-lg px-2 py-1">
          <i class="pi pi-user text-primary text-xs" />
          <span class="text-xs font-medium text-700">{{ auth.user?.username }}</span>
          <Tag value="أدمن" severity="warn" class="text-xs" />
        </div>

      </header>

      <!-- Page content -->
      <main class="page-body">
        <RouterView />
      </main>

    </div>

    <!-- ═══════════════════════════════
         LOGOUT DIALOG
    ═══════════════════════════════ -->
    <Dialog
      v-model:visible="dlgVisible"
      :modal="true"
      :draggable="false"
      :closable="!loggingOut"
      :style="{ width: '320px' }"
      dir="rtl"
    >
      <template #container>
        <div class="logout-dialog" :class="{ leaving: loggingOut }">
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
              :disabled="loggingOut" @click="dlgVisible = false" />
            <Button label="خروج" severity="danger" class="flex-1"
              :loading="loggingOut" @click="doLogout" />
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

const slim       = ref(false)
const mobileOpen = ref(false)
const dlgVisible = ref(false)
const loggingOut = ref(false)

const mgmtNav = [
  { label: 'لوحة التحكم',    icon: 'pi pi-objects-column', to: '/dashboard' },
  { label: 'إدارة المنيو',    icon: 'pi pi-list',           to: '/dashboard/menu' },
  { label: 'إدارة الطاولات',  icon: 'pi pi-table',          to: '/dashboard/tables' },
  { label: 'المستخدمون',      icon: 'pi pi-users',          to: '/dashboard/users' },
  { label: 'سجل الطلبات',     icon: 'pi pi-receipt',        to: '/dashboard/orders' },
  { label: 'الطابعات',         icon: 'pi pi-print',          to: '/dashboard/printers' },
  { label: 'المخازن',          icon: 'pi pi-box',            to: '/dashboard/inventory' },
]

const opsNav = [
  { label: 'الويتر',  icon: 'pi pi-server', to: '/dashboard/waiter' },
  { label: 'الكاشير', icon: 'pi pi-wallet', to: '/dashboard/cashier' },
]

const allNav = [...mgmtNav, ...opsNav]

const activePage = computed(() =>
  allNav.find(n => n.to === '/dashboard'
    ? route.path === '/dashboard'
    : route.path.startsWith(n.to)
  ) ?? { label: 'لوحة التحكم', icon: 'pi pi-objects-column' }
)

function isOn(to: string) {
  return to === '/dashboard' ? route.path === '/dashboard' : route.path.startsWith(to)
}

function go(to: string) {
  router.push(to)
  mobileOpen.value = false
}

async function doLogout() {
  loggingOut.value = true
  await new Promise(r => setTimeout(r, 700))
  auth.logout()
}
</script>

<style scoped>
.shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #f4f4f5;
  font-family: 'Tajawal', system-ui, sans-serif;
}

/* ══ Sidebar ══ */
.sidebar {
  width: 220px;
  height: 100vh;
  background: #ffffff;
  border-left: 1px solid #e4e4e7;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.22s cubic-bezier(.4,0,.2,1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.sidebar.slim { width: 62px; }

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0 1rem;
  height: 60px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
  overflow: hidden;
}

.sidebar.slim .brand {
  justify-content: center;
  padding: 0;
  flex-direction: column;
  gap: 0;
}

.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f97316;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.brand-mark i { color: #fff; font-size: 0.8rem; }

.brand-text {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  min-width: 0;
}
.brand-name {
  font-size: 0.88rem;
  font-weight: 800;
  color: #18181b;
  white-space: nowrap;
  line-height: 1.15;
}
.brand-tag {
  font-size: 0.62rem;
  color: #a1a1aa;
  font-weight: 500;
  letter-spacing: 0.03em;
}

.slim-btn {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid #e4e4e7;
  background: transparent;
  color: #a1a1aa;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.62rem;
  flex-shrink: 0;
  transition: all .12s;
  margin-right: auto;
}
.slim-btn:hover { background: #f4f4f5; color: #52525b; }
.sidebar.slim .slim-btn { margin: 0; }

/* Nav */
.nav {
  flex: 1;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
}
.nav::-webkit-scrollbar { display: none; }

.nav-group-title {
  font-size: 0.6rem;
  font-weight: 700;
  color: #a1a1aa;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.5rem 0.6rem 0.2rem;
  margin: 0;
}

.nav-sep {
  height: 1px;
  background: #f0f0f0;
  margin: 0.5rem 0.4rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.65rem;
  border-radius: 8px;
  cursor: pointer;
  color: #71717a;
  transition: all .12s ease;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}
.nav-link:hover    { background: #fafafa; color: #18181b; }
.nav-link--on      { background: #fff7ed; color: #f97316; font-weight: 600; }
.sidebar.slim .nav-link { justify-content: center; padding: 0.6rem; }

.nl-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.82rem;
}
.nl-text { font-size: 0.83rem; flex: 1; }
.nl-pip  { width: 5px; height: 5px; border-radius: 50%; background: #f97316; flex-shrink: 0; }

/* User strip */
.user-strip {
  padding: 0.75rem;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* slim mode: أيقونة خروج فقط */
.slim-logout {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1.5px solid #fca5a5;
  background: #fff1f2;
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all .15s;
}
.slim-logout:hover {
  background: #fee2e2;
  border-color: #f87171;
  transform: scale(1.06);
}

/* ══ Main ══ */
.body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

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

.mobile-menu-btn { display: none; }

.page-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ══ Logout Dialog ══ */
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
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--p-red-100);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}
.icon-ring i { font-size: 1.75rem; color: var(--p-red-500); }

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.2); }
  50%       { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
}

.dialog-title { font-size: 1.15rem; font-weight: 700; margin: 0 0 0.4rem; color: var(--p-text-color); }
.dialog-sub   { font-size: 0.9rem; color: var(--p-text-muted-color); margin: 0 0 1.5rem; line-height: 1.6; }
.username     { font-weight: 700; color: var(--p-primary-color); }
.dialog-actions { display: flex; gap: 0.75rem; width: 100%; }

/* ══ Backdrop ══ */
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.38);
  z-index: 199;
  backdrop-filter: blur(2px);
}

/* ══ Transitions ══ */
.text-fade-enter-active { transition: opacity .15s ease .04s, transform .15s ease .04s; }
.text-fade-leave-active { transition: opacity .1s ease; }
.text-fade-enter-from   { opacity: 0; transform: translateX(4px); }
.text-fade-leave-to     { opacity: 0; }

.bd-enter-active { transition: opacity .2s ease; }
.bd-leave-active { transition: opacity .18s ease; }
.bd-enter-from, .bd-leave-to { opacity: 0; }

/* ══ Helpers ══ */
.dt-only  { }
.mob-only { display: none !important; }

/* ══ Desktop ══ */
@media (min-width: 768px) {
  .mobile-menu-btn { display: none !important; }
  .sidebar { position: sticky; transform: none !important; }
}

/* ══ Mobile ══ */
@media (max-width: 767px) {
  .dt-only  { display: none !important; }
  .mob-only { display: flex !important; }
  .mobile-menu-btn { display: inline-flex !important; }

  .sidebar {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 240px !important;
    transform: translateX(100%);
    transition: transform .28s cubic-bezier(.4,0,.2,1);
    box-shadow: -6px 0 28px rgba(0,0,0,.1);
    z-index: 200;
  }
  .sidebar.open { transform: translateX(0); }
  .sidebar .nl-text { display: inline !important; opacity: 1 !important; }
  .body { width: 100%; }
}
</style>