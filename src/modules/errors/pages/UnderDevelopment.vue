<template>
  <div class="page" dir="rtl">

    <!-- خلفية نقاط هادئة -->
    <div class="bg-dots" />

    <div class="wrapper">

      <!-- الشعار العلوي -->
      <div class="logo-bar">
        <div class="logo-icon">
          <i class="pi pi-shop" />
        </div>
        <span class="logo-name">مطعمنا</span>
      </div>

      <!-- المحتوى الرئيسي -->
      <div class="main">

        <!-- الرسم المتحرك -->
        <div class="illustration">
          <div class="gear gear--large">
            <svg viewBox="0 0 60 60" fill="none">
              <path d="M30 18a12 12 0 1 0 0 24 12 12 0 0 0 0-24z" stroke="currentColor" stroke-width="2.5"/>
              <path d="M30 6v6M30 48v6M6 30h6M48 30h6M12.7 12.7l4.2 4.2M43.1 43.1l4.2 4.2M47.3 12.7l-4.2 4.2M16.9 43.1l-4.2 4.2" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="gear gear--small">
            <svg viewBox="0 0 40 40" fill="none">
              <path d="M20 12a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" stroke="currentColor" stroke-width="2"/>
              <path d="M20 4v4M20 32v4M4 20h4M32 20h4M8.7 8.7l2.8 2.8M28.5 28.5l2.8 2.8M31.3 8.7l-2.8 2.8M11.5 28.5l-2.8 2.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="gear-dot" />
        </div>

        <!-- العنوان -->
        <div class="text-block">
          <div class="badge">
            <span class="badge-dot" />
            قيد التطوير
          </div>
          <h1 class="title">نعمل على شيء رائع</h1>
          <p class="desc">
            هذه الصفحة لا تزال تحت التطوير.<br />
            سنُعلمك فور الانتهاء منها.
          </p>
        </div>

        <!-- شريط التقدم -->
        <div class="progress-card">
          <div class="progress-top">
            <span class="progress-text">نسبة الإنجاز</span>
            <span class="progress-pct">{{ progress }}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-thumb" :style="{ width: progress + '%' }" />
          </div>
          <div class="progress-steps">
            <div
              v-for="(step, i) in steps"
              :key="i"
              class="step"
              :class="step.done ? 'step--done' : 'step--pending'"
            >
              <div class="step-icon">
                <i :class="step.done ? 'pi pi-check' : 'pi pi-clock'" />
              </div>
              <span>{{ step.label }}</span>
            </div>
          </div>
        </div>

        <!-- الأزرار -->
        <div class="actions">
          <button class="btn btn--primary" @click="goBack">
            <i class="pi pi-arrow-right" />
            العودة
          </button>
          <button class="btn btn--outline" @click="goHome">
            <i class="pi pi-home" />
            الرئيسية
          </button>
        </div>

      </div>

      <!-- Footer -->
      <p class="footer-text">نظام إدارة المطعم &mdash; جميع الحقوق محفوظة</p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router   = useRouter()
const progress = ref(65)

const steps = ref([
  { label: 'تصميم الواجهة',  done: true  },
  { label: 'بناء الـ API',    done: true  },
  { label: 'ربط البيانات',    done: false },
  { label: 'اختبار وإطلاق',  done: false },
])

const goBack = () => router.back()
const goHome = () => router.push('/')
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  font-family: 'Tajawal', sans-serif;
  padding: 2rem 1.25rem;
  position: relative;
  overflow: hidden;
}

.bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.55;
  pointer-events: none;
}

.wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

/* ── الشعار ── */
.logo-bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  animation: fade-down 0.5s ease both;
}

.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f97316;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon i { color: #fff; font-size: 0.95rem; }

.logo-name {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

/* ── الكارد ── */
.main {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  animation: card-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

@keyframes card-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fade-down {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── التروس ── */
.illustration {
  position: relative;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gear { position: absolute; color: #f97316; }

.gear--large {
  width: 72px;
  height: 72px;
  top: 0;
  right: 0;
  animation: spin-cw 8s linear infinite;
}

.gear--small {
  width: 46px;
  height: 46px;
  bottom: 4px;
  left: 4px;
  animation: spin-ccw 6s linear infinite;
  color: #fb923c;
  opacity: 0.7;
}

.gear-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f97316;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 4px #fff7ed;
}

@keyframes spin-cw  { to { transform: rotate(360deg); } }
@keyframes spin-ccw { to { transform: rotate(-360deg); } }

/* ── النص ── */
.text-block {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 999px;
  padding: 0.3rem 0.9rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #f97316;
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f97316;
  animation: pulse-dot 1.8s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.65); }
}

.title {
  font-size: 1.45rem;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.desc {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.8;
}

/* ── شريط التقدم ── */
.progress-card {
  width: 100%;
  background: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.1rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.progress-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-text { font-size: 0.8rem; color: #6b7280; font-weight: 500; }
.progress-pct  { font-size: 0.85rem; color: #f97316; font-weight: 700; }

.progress-track {
  height: 7px;
  background: #f3f4f6;
  border-radius: 99px;
  overflow: hidden;
}

.progress-thumb {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #fb923c);
  border-radius: 99px;
  transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.progress-thumb::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.4) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.8s ease-in-out infinite;
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}

/* ── الخطوات ── */
.progress-steps {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 0.75rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.78rem;
  font-weight: 500;
}

.step--done    { color: #6b7280; }
.step--pending { color: #9ca3af; }

.step-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.6rem;
}

.step--done    .step-icon { background: #dcfce7; color: #16a34a; }
.step--pending .step-icon { background: #f3f4f6; color: #9ca3af; }

/* ── الأزرار ── */
.actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}

.btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem 1rem;
  border-radius: 11px;
  font-family: 'Tajawal', sans-serif;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.18s ease;
}

.btn--primary {
  background: #f97316;
  color: #fff;
}

.btn--primary:hover {
  background: #ea580c;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(249, 115, 22, 0.28);
}

.btn--outline {
  background: transparent;
  color: #6b7280;
  border: 1.5px solid #e5e7eb;
}

.btn--outline:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #111827;
}

/* ── Footer ── */
.footer-text {
  font-size: 0.75rem;
  color: #9ca3af;
  animation: fade-down 0.5s ease 0.3s both;
}
</style>