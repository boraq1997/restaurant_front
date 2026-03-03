<template>
  <div class="min-h-screen surface-50" dir="rtl">

    <!-- Quick Nav -->
    <main class="px-3 pt-4">
      <div class="grid">

        <div class="col-12 md:col-4">
          <div
            class="surface-card border-round-xl p-4 shadow-1 cursor-pointer hover:shadow-3 transition-all transition-duration-200"
            @click="router.push('/waiter')"
          >
            <i class="pi pi-th-large text-3xl text-primary mb-3 block" />
            <p class="font-bold text-900 m-0">الطاولات والطلبات</p>
            <span class="text-xs text-500">صفحة الويتر</span>
          </div>
        </div>

        <div class="col-12 md:col-4">
          <div
            class="surface-card border-round-xl p-4 shadow-1 cursor-pointer hover:shadow-3 transition-all transition-duration-200"
            @click="router.push('/cashier')"
          >
            <i class="pi pi-wallet text-3xl text-green-500 mb-3 block" />
            <p class="font-bold text-900 m-0">الكاشير</p>
            <span class="text-xs text-500">صفحة الكاشير</span>
          </div>
        </div>

        <div class="col-12 md:col-4">
          <div
            class="surface-card border-round-xl p-4 shadow-1 cursor-pointer hover:shadow-3 transition-all transition-duration-200"
            @click="router.push('/dashboard/menu')"
          >
            <i class="pi pi-list text-3xl text-orange-500 mb-3 block" />
            <p class="font-bold text-900 m-0">إدارة المنيو</p>
            <span class="text-xs text-500">الفئات والأصناف</span>
          </div>
        </div>

      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../auth/store/auth.store'
import Button from 'primevue/button'

const router = useRouter()
const auth   = useAuthStore()
</script>