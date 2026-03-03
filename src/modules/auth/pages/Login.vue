<script lang="ts" setup>
import { ref } from "vue";
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Avatar from 'primevue/avatar';
import FloatLabel from 'primevue/floatlabel';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from "../store/auth.store";

const username = ref('');
const password = ref('');
const toast = useToast();
const authStore = useAuthStore();

const handleLogin = async () => {
  if (!username.value || !password.value) {
    toast.add({
      severity: 'warn',
      summary: 'تنبيه',
      detail: 'يرجى إدخال اسم المستخدم وكلمة المرور',
      life: 3000
    });
    return;
  }

  try {
    await authStore.login({ username: username.value, password: password.value });
    toast.add({
      severity: 'success',
      summary: 'مرحباً',
      detail: `أهلاً ${username.value}`,
      life: 2000
    });
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data ||
      'فشل تسجيل الدخول، تحقق من البيانات';
    toast.add({
      severity: 'error',
      summary: 'خطأ في تسجيل الدخول',
      detail: typeof msg === 'string' ? msg : 'بيانات غير صحيحة',
      life: 4000
    });
  }
};
</script>

<template>
  <!-- منع أي submit افتراضي -->
  <div class="login-wrapper" dir="rtl" @keydown.enter.prevent="handleLogin">
    <div class="login-form">

      <!-- Header -->
      <div class="form-header">
        <Avatar image="/logo2.jpg" size="xlarge" shape="circle" />
        <h4 class="form-title">تسجيل الدخول لإدارة النظام</h4>
      </div>

      <!-- Fields -->
      <div class="fields-container">

        <!-- Username -->
        <FloatLabel variant="on">
          <IconField>
            <InputIcon class="fas fa-user" />
            <InputText
              id="username"
              v-model="username"
              autocomplete="username"
              fluid
            />
          </IconField>
          <label for="username">اسم المستخدم</label>
        </FloatLabel>

        <!-- Password -->
        <FloatLabel variant="on">
          <IconField>
            <InputIcon class="fas fa-lock" />
            <Password
              id="password"
              v-model="password"
              autocomplete="current-password"
              fluid
              toggleMask
              :feedback="false"
              input-id="password-input"
            />
          </IconField>
          <label for="password-input">كلمة المرور</label>
        </FloatLabel>

        <!-- Submit -->
        <Button
          label="دخول"
          icon="pi pi-sign-in"
          :loading="authStore.loading"
          fluid
          @click.prevent="handleLogin"
        />

      </div>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--p-surface-50);
}

.login-form {
  width: 360px;
  background: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.form-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
  text-align: center;
}

.form-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--p-text-color-secondary);
}

.fields-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>