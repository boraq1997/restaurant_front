<!-- src/modules/dashboard/orders/components/OrdersPagination.vue -->
<template>
  <div v-if="totalPages > 1" class="flex flex-column align-items-center gap-3 mt-5">
    <div class="flex align-items-center gap-1">

      <Button
        icon="pi pi-angle-double-right"
        text rounded size="small" severity="secondary"
        :disabled="currentPage === 1"
        @click="$emit('go', 1)"
      />
      <Button
        icon="pi pi-angle-right"
        text rounded size="small" severity="secondary"
        :disabled="currentPage === 1"
        @click="$emit('go', currentPage - 1)"
      />

      <div class="flex gap-1">
        <button
          v-for="(page, i) in visiblePages"
          :key="i"
          class="page-btn"
          :class="{ active: page === currentPage, dots: page === '...' }"
          :disabled="page === '...'"
          @click="page !== '...' && $emit('go', Number(page))"
        >
          {{ page }}
        </button>
      </div>

      <Button
        icon="pi pi-angle-left"
        text rounded size="small" severity="secondary"
        :disabled="currentPage === totalPages"
        @click="$emit('go', currentPage + 1)"
      />
      <Button
        icon="pi pi-angle-double-left"
        text rounded size="small" severity="secondary"
        :disabled="currentPage === totalPages"
        @click="$emit('go', totalPages)"
      />

    </div>

    <p class="text-xs text-400 m-0">
      صفحة {{ currentPage }} من {{ totalPages }} · إجمالي {{ totalRecords.toLocaleString() }} فاتورة
    </p>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  currentPage:  number
  totalPages:   number
  totalRecords: number
  visiblePages: (number | string)[]
}>()

defineEmits<{
  go: [page: number]
}>()
</script>

<style scoped>
.page-btn {
  min-width: 2rem;
  height: 2rem;
  border-radius: 8px;
  border: 1.5px solid var(--p-surface-300);
  background: var(--p-surface-0);
  color: var(--p-text-color-secondary);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  padding: 0 0.35rem;
}
.page-btn:hover:not(.dots):not(.active) { background: var(--p-surface-100); }
.page-btn.active {
  background: var(--p-primary-color);
  border-color: var(--p-primary-color);
  color: #fff;
  font-weight: 700;
}
.page-btn.dots {
  border-color: transparent;
  background: transparent;
  cursor: default;
}
</style>