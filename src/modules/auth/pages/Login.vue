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

const username = ref('');
const password = ref('');
const loading = ref(false);
const toast = useToast();

const handleLogin = () => {
  if (!username.value || !password.value) {
    toast.add({
      severity: 'warn',
      summary: 'تنبيه',
      detail: 'يرجى إدخال اسم المستخدم وكلمة المرور',
      life: 3000
    });
    return;
  }

  loading.value = true;
  // TODO: replace with real auth call
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};
</script>

<template>
    <div class="login-form" dir="rtl">

      <!-- Header -->
      <div class="form-header">
        <Avatar image="/logo2.jpg" size="xlarge" shape="circle" />
        <h4 class="form-title text-color-secondary">تسجيل الدخول لإدارة النظام</h4>
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
            <InputIcon class="fas fa-lock"/>
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

        <!-- Forgot password -->
        <div class="forgot-row">
          <Button
            label="هل نسيت كلمة المرور؟"
            variant="link"
            size="small"
            class="forgot-btn"
          />
        </div>

        <!-- Submit -->
        <Button
          label="دخول"
          icon="pi pi-sign-in"
          :loading="loading"
          fluid
          @click="handleLogin"
        />

      </div>
    </div>
</template>

<style scoped>
.login-form {
  width: 360px;
  background: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  margin: auto;
  margin-top: 20vh;
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
  color: var(--p-text-color);
}

.fields-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.forgot-row {
  display: flex;
  justify-content: flex-start; /* right side in RTL */
  margin-top: -0.75rem;
}

.forgot-btn {
  padding: 0 !important;
  font-size: 0.85rem;
}
</style>