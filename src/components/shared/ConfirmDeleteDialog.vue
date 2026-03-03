<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :draggable="false"
    :closable="!loading"
    :style="{ width: '320px' }"
    dir="rtl"
  >
    <template #container>
      <div class="confirm-dialog" :class="{ 'leaving': loading }">

        <!-- أيقونة -->
        <div class="icon-wrap">
          <div class="icon-ring">
            <i class="pi pi-trash" />
          </div>
        </div>

        <!-- النص -->
        <p class="dialog-title">تأكيد الحذف</p>
        <p class="dialog-message">{{ message }}</p>

        <!-- الأزرار -->
        <div class="dialog-actions">
          <Button
            label="إلغاء"
            severity="secondary"
            outlined
            class="flex-1"
            :disabled="loading"
            @click="visible = false"
          />
          <Button
            label="حذف"
            severity="danger"
            class="flex-1"
            :loading="loading"
            @click="emit('confirm')"
          />
        </div>

      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

const props = defineProps<{
  modelValue: boolean
  message: string
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [v: boolean]
  confirm: []
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>

<style scoped>
.confirm-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem 1.5rem;
  border-radius: 16px;
  background: var(--p-surface-0);
  text-align: center;
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.confirm-dialog.leaving {
  opacity: 0.4;
  transform: scale(0.97);
}

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

.dialog-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--p-text-color);
  margin: 0 0 0.4rem;
}

.dialog-message {
  font-size: 0.9rem;
  color: var(--p-text-muted-color);
  margin: 0 0 1.5rem;
  line-height: 1.6;
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}
</style>