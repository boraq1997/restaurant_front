<template>
  <Dialog
    :visible="modelValue"
    header="باركود الطاولة"
    :modal="true"
    :draggable="false"
    style="width: 100%; max-width: 340px;"
    dir="rtl"
    @update:visible="emit('update:modelValue', $event)"
  >
    <div class="flex flex-column align-items-center gap-3 py-2">

      <div class="surface-100 border-round-xl p-3">
        <canvas ref="qrCanvas" />
      </div>

      <div class="text-center">
        <p class="font-bold text-900 m-0">طاولة {{ table?.number }}</p>
        <p class="text-xs text-500 m-0 mt-1">{{ qrUrl }}</p>
      </div>

      <div class="flex gap-2 w-full">
        <Button
          label="تحميل"
          icon="pi pi-download"
          class="flex-1"
          severity="secondary"
          @click="downloadQr"
        />
        <Button
          label="نسخ الرابط"
          icon="pi pi-copy"
          class="flex-1"
          @click="copyLink"
        />
      </div>

    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import QRCode from 'qrcode'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import type { AdminTable } from '../types/tables-admin.types'

const props = defineProps<{ modelValue: boolean; table: AdminTable | null }>()
const emit  = defineEmits<{ 'update:modelValue': [v: boolean] }>()

const toast    = useToast()
const qrCanvas = ref<HTMLCanvasElement | null>(null)

const qrUrl = computed(() =>
  props.table ? `${window.location.origin}/table/${props.table.qrToken}` : ''
)

watch(() => props.modelValue, async (val) => {
  if (val && props.table) {
    await nextTick()
    await nextTick()
    if (qrCanvas.value) {
      await QRCode.toCanvas(qrCanvas.value, qrUrl.value, {
        width: 250,
        margin: 2,
        color: { dark: '#1a1a1a', light: '#ffffff' },
      })
    }
  }
})

function downloadQr() {
  if (!qrCanvas.value || !props.table) return
  const link = document.createElement('a')
  link.download = `table-${props.table.number}-qr.png`
  link.href = qrCanvas.value.toDataURL()
  link.click()
}

function copyLink() {
  navigator.clipboard.writeText(qrUrl.value)
  toast.add({ severity: 'info', summary: 'تم النسخ', detail: 'تم نسخ رابط الطاولة', life: 2000 })
}
</script>