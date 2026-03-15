<template>
  <div class="page" dir="rtl">

    <div class="card">

      <!-- رقم الخطأ -->
      <div class="code">404</div>

      <!-- خط فاصل -->
      <div class="divider" />

      <!-- المحتوى -->
      <div class="body">
        <h1 class="title">الصفحة غير موجودة</h1>
        <p class="desc">الرابط الذي أدخلته غير صحيح أو تم حذف هذه الصفحة.</p>
      </div>

      <!-- الأزرار -->
      <div class="actions">
        <button class="btn btn--primary" @click="goHome">
          <i class="pi pi-home" />
          الرئيسية
        </button>
        <button class="btn btn--ghost" @click="goBack">
          <i class="pi pi-arrow-right" />
          رجوع
        </button>
      </div>

    </div>

    <!-- شعار صغير -->
    <p class="brand">نظام إدارة المطعم</p>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => router.push('/')
const goBack = () => router.back()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  font-family: 'Tajawal', sans-serif;
  padding: 1.5rem;
  gap: 1.25rem;
}

/* ── الكارد ── */
.card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  animation: card-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── رقم الخطأ ── */
.code {
  font-size: 5.5rem;
  font-weight: 700;
  color: #f97316;
  line-height: 1;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
  font-family: 'Tajawal', sans-serif;
}

/* ── الفاصل ── */
.divider {
  width: 40px;
  height: 3px;
  background: #f97316;
  border-radius: 2px;
  margin: 0 auto 1.5rem;
  opacity: 0.4;
}

/* ── النص ── */
.body { margin-bottom: 2rem; }

.title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111111;
  margin: 0 0 0.5rem;
}

.desc {
  font-size: 0.9rem;
  color: #888888;
  margin: 0;
  line-height: 1.7;
}

/* ── الأزرار ── */
.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.4rem;
  border-radius: 10px;
  font-family: 'Tajawal', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.18s ease;
}

.btn--primary {
  background: #f97316;
  color: #ffffff;
}

.btn--primary:hover {
  background: #ea580c;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}

.btn--ghost {
  background: transparent;
  color: #555555;
  border: 1px solid #e0e0e0;
}

.btn--ghost:hover {
  background: #f5f5f5;
  border-color: #cccccc;
}

/* ── الشعار ── */
.brand {
  font-size: 0.78rem;
  color: #bbbbbb;
  margin: 0;
  letter-spacing: 0.02em;
}
</style>