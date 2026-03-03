<template>
  <!-- زر الخروج -->
  <Button
    icon="pi pi-sign-out"
    severity="secondary"
    text
    rounded
    v-tooltip.bottom="'تسجيل الخروج'"
    @click="visible = true"
  />

  <!-- Dialog مخصص -->
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :draggable="false"
    :closable="!isLoggingOut"
    :style="{ width: '320px' }"
    dir="rtl"
  >
    <template #container>
      <div class="logout-dialog" :class="{ 'leaving': isLoggingOut }">

        <!-- أيقونة كبيرة -->
        <div class="icon-wrap">
          <div class="icon-ring">
            <i class="pi pi-sign-out" />
          </div>
        </div>

        <!-- النص -->
        <p class="dialog-title">تسجيل الخروج</p>
        <p class="dialog-sub">
          هل تريد تسجيل الخروج
          <span class="username">{{ auth.user?.username }}</span>
          ؟
        </p>

        <!-- الأزرار -->
        <div class="dialog-actions">
          <Button
            label="إلغاء"
            severity="secondary"
            outlined
            class="flex-1"
            :disabled="isLoggingOut"
            @click="visible = false"
          />
          <Button
            label="خروج"
            severity="danger"
            class="flex-1"
            :loading="isLoggingOut"
            @click="handleLogout"
          />
        </div>

      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useAuthStore } from '../../modules/auth/store/auth.store'

const auth        = useAuthStore()
const visible     = ref(false)
const isLoggingOut = ref(false)

async function handleLogout() {
  isLoggingOut.value = true
  // تأثير بصري قبل الخروج
  await new Promise(r => setTimeout(r, 800))
  auth.logout()
}
</script>

<style scoped>
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

.logout-dialog.leaving {
  opacity: 0.4;
  transform: scale(0.97);
}

/* الأيقونة */
.icon-wrap {
  margin-bottom: 1.25rem;
}

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

.icon-ring i {
  font-size: 1.75rem;
  color: var(--p-red-500);
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.2); }
  50%       { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
}

/* النصوص */
.dialog-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--p-text-color);
  margin: 0 0 0.4rem;
}

.dialog-sub {
  font-size: 0.9rem;
  color: var(--p-text-muted-color);
  margin: 0 0 1.5rem;
  line-height: 1.6;
}

.username {
  font-weight: 700;
  color: var(--p-primary-color);
}

/* الأزرار */
.dialog-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}
</style>