<!-- src/modules/cashier/components/CashboxSessionDialog.vue -->

<template>
  <!-- Dialog فتح جلسة جديدة -->
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :draggable="false"
    :closable="mode === 'close'"
    style="width: 100%; max-width: 380px;"
    dir="rtl"
  >
    <template #container>
      <div class="session-dialog">

        <!-- أيقونة -->
        <div class="icon-wrap">
          <div class="icon-ring" :class="mode === 'open' ? 'icon-ring--green' : 'icon-ring--red'">
            <i :class="mode === 'open' ? 'pi pi-lock-open' : 'pi pi-lock'" />
          </div>
        </div>

        <!-- العنوان -->
        <p class="dialog-title">
          {{ mode === 'open' ? 'فتح جلسة الكاشير' : 'إغلاق جلسة الكاشير' }}
        </p>
        <p class="dialog-sub">
          {{ mode === 'open'
            ? 'يجب فتح جلسة قبل البدء بعمليات الدفع'
            : 'أدخل المبلغ النهائي في الصندوق لإغلاق الجلسة' }}
        </p>

        <!-- حقل المبلغ -->
        <div class="w-full mb-4">
          <label class="text-sm font-bold text-700 block mb-2">
            {{ mode === 'open' ? 'الرصيد الافتتاحي' : 'المبلغ الختامي في الصندوق' }}
            <span class="text-red-500">*</span>
          </label>
          <InputNumber
            v-model="amount"
            placeholder="0"
            suffix=" د.ع"
            :min="0"
            fluid
            :autofocus="true"
          />
        </div>

        <!-- معلومات الجلسة (عند الإغلاق) -->
        <div
          v-if="mode === 'close' && sessionInfo"
          class="w-full mb-4 p-3 surface-50 border-round-lg border-1 surface-border"
        >
          <div class="flex justify-content-between mb-2">
            <span class="text-xs text-500">الرصيد الافتتاحي</span>
            <span class="text-xs font-bold text-900">{{ sessionInfo.openingBalance?.toLocaleString() }} د.ع</span>
          </div>
          <div class="flex justify-content-between">
            <span class="text-xs text-500">وقت الفتح</span>
            <span class="text-xs font-bold text-900">{{ formatTime(sessionInfo.openedAt) }}</span>
          </div>
        </div>

        <!-- الأزرار -->
        <div class="dialog-actions">
          <Button
            v-if="mode === 'close'"
            label="إلغاء"
            severity="secondary"
            outlined
            class="flex-1"
            :disabled="loading"
            @click="visible = false"
          />
          <Button
            :label="mode === 'open' ? 'فتح الجلسة' : 'إغلاق الجلسة'"
            :severity="mode === 'open' ? 'success' : 'danger'"
            :icon="loading ? 'pi pi-spin pi-spinner' : (mode === 'open' ? 'pi pi-check' : 'pi pi-lock')"
            class="flex-1"
            :disabled="!amount || loading"
            @click="handleConfirm"
          />
        </div>

      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'

const props = defineProps<{
  modelValue: boolean
  mode: 'open' | 'close'
  loading?: boolean
  sessionInfo?: { openingBalance: number; openedAt: string } | null
}>()

const emit = defineEmits<{
  'update:modelValue': [v: boolean]
  confirm: [amount: number]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const amount = ref<number | null>(null)

function handleConfirm() {
  if (!amount.value && amount.value !== 0) return
  emit('confirm', amount.value)
  amount.value = null
}

function formatTime(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString('ar-IQ', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.session-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem 1.5rem;
  border-radius: 16px;
  background: var(--p-surface-0);
  text-align: center;
}

.icon-wrap { margin-bottom: 1.25rem; }

.icon-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}

.icon-ring--green {
  background: var(--p-green-100);
}
.icon-ring--green i {
  font-size: 1.75rem;
  color: var(--p-green-500);
}

.icon-ring--red {
  background: var(--p-red-100);
}
.icon-ring--red i {
  font-size: 1.75rem;
  color: var(--p-red-500);
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.1); }
  50%       { box-shadow: 0 0 0 10px rgba(0,0,0,0); }
}

.dialog-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--p-text-color);
  margin: 0 0 0.4rem;
}

.dialog-sub {
  font-size: 0.875rem;
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