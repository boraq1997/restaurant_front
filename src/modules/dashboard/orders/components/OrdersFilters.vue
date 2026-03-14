<!-- src/modules/dashboard/orders/components/OrdersFilters.vue -->
<template>
  <div class="surface-card border-bottom-1 border-200">

    <!-- ── الصف الدائم: حالة الفاتورة + زر تبديل البحث ── -->
    <div class="px-4 py-3 flex align-items-center justify-content-between gap-3 flex-wrap">

      <!-- فلاتر الحالة (دائماً ظاهرة) -->
      <div class="flex gap-2 flex-wrap align-items-center">
        <button
          v-for="s in statusChips"
          :key="String(s.value)"
          class="status-chip flex-shrink-0"
          :class="[{ active: filters.status === s.value }, s.colorClass]"
          @click="emit('filterStatus', s.value)"
        >
          <i :class="s.icon" />
          {{ s.label }}
        </button>
      </div>

      <!-- يمين: زر فتح البحث المتقدم + مؤشر الفلاتر النشطة -->
      <div class="flex align-items-center gap-2 flex-shrink-0">
        <Tag
          v-if="activeSearchFiltersCount > 0"
          severity="warn"
          rounded
          class="cursor-pointer"
          @click.stop="emit('reset')"
        >
          <span class="text-xs font-bold">{{ activeSearchFiltersCount }} فلتر</span>
          <i class="pi pi-times text-xs mr-1" />
        </Tag>

        <Button
          :icon="isOpen ? 'pi pi-times' : 'pi pi-sliders-h'"
          :label="isOpen ? 'إخفاء' : 'بحث متقدم'"
          :severity="isOpen ? 'secondary' : 'secondary'"
          :outlined="!isOpen"
          size="small"
          @click="isOpen = !isOpen"
        />
      </div>

    </div>

    <!-- ── حقول البحث المتقدم (collapsible) ─────────────── -->
    <Transition name="slide-down">
      <div v-if="isOpen" class="border-top-1 border-100 px-4 pb-4">

        <div class="grid m-0 gap-3 pt-4">

          <!-- من تاريخ -->
          <div class="col-12 sm:col-6 lg:col-3 p-0">
            <div class="flex flex-column gap-2">
              <label class="text-xs font-bold text-500 flex align-items-center gap-1">
                <i class="pi pi-calendar text-xs text-400" />
                من تاريخ
              </label>
              <DatePicker
                :modelValue="filters.startDate"
                @update:modelValue="emit('update:filters', { ...filters, startDate: ($event as Date | null) ?? null })"
                dateFormat="yy-mm-dd"
                placeholder="اختر تاريخاً"
                showIcon
                :manualInput="false"
                class="w-full"
              />
            </div>
          </div>

          <!-- إلى تاريخ -->
          <div class="col-12 sm:col-6 lg:col-3 p-0">
            <div class="flex flex-column gap-2">
              <label class="text-xs font-bold text-500 flex align-items-center gap-1">
                <i class="pi pi-calendar text-xs text-400" />
                إلى تاريخ
              </label>
              <DatePicker
                :modelValue="filters.endDate"
                @update:modelValue="emit('update:filters', { ...filters, endDate: ($event as Date | null) ?? null })"
                dateFormat="yy-mm-dd"
                placeholder="اختر تاريخاً"
                showIcon
                :manualInput="false"
                class="w-full"
              />
            </div>
          </div>

          <!-- رقم الطاولة -->
          <div class="col-12 sm:col-6 lg:col-2 p-0">
            <div class="flex flex-column gap-2">
              <label class="text-xs font-bold text-500 flex align-items-center gap-1">
                <i class="pi pi-th-large text-xs text-400" />
                رقم الطاولة
              </label>
              <InputNumber :modelValue="filters.tableId" inputId="horizontal-buttons" @update:modelValue="emit('update:filters', { ...filters, tableId: $event })" showButtons buttonLayout="horizontal" placeholder="مثال: 5" :min="1" :useGrouping="false" fluid>
              <template #incrementbuttonicon>
                  <span class="pi pi-plus" />
              </template>
              <template #decrementbuttonicon>
                  <span class="pi pi-minus" />
              </template>
            </InputNumber>
            </div>
          </div>

          <!-- حجم الصفحة -->
          <div class="col-12 sm:col-6 lg:col-3 p-0">
            <div class="flex flex-column gap-2">
              <label class="text-xs font-bold text-500 flex align-items-center gap-1">
                <i class="pi pi-list text-xs text-400" />
                عدد النتائج
              </label>
              <Select
                :modelValue="pageSize"
                @update:modelValue="emit('update:pageSize', $event)"
                :options="pageSizeOptions"
                optionLabel="label"
                optionValue="value"
                fluid
                />
            </div>
          </div>

          <!-- أزرار الإجراءات -->
          <div class="col-12 p-0 flex align-items-end">
            <div class="flex gap-2 w-full">
              <Button
                label="بحث"
                icon="pi pi-search"
                :loading="loading"
                class="flex-2"
                @click="emit('search')"
              />
              <Button
                icon="pi pi-filter-slash"
                severity="secondary"
                outlined
                v-tooltip.bottom="'مسح الفلاتر'"
                :disabled="activeSearchFiltersCount === 0"
                @click="emit('reset')"
              />
              <Button
                icon="pi pi-refresh"
                severity="secondary"
                outlined
                :loading="loading"
                v-tooltip.bottom="'تحديث'"
                @click="emit('refresh')"
              />
            </div>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button      from 'primevue/button'
import DatePicker  from 'primevue/datepicker'
import InputNumber from 'primevue/inputnumber'
import Select      from 'primevue/select'
import Tag         from 'primevue/tag'
import type { OrderFilters } from '../types/orders.types'

const props = defineProps<{
  filters:  OrderFilters
  pageSize: number
  loading:  boolean
}>()

const emit = defineEmits<{
  'update:filters':  [filters: OrderFilters]
  'update:pageSize': [size: number]
  search:            []
  reset:             []
  refresh:           []
  filterStatus:      [value: string | null]
}>()

// حقول البحث مغلقة افتراضياً
const isOpen = ref(false)

const pageSizeOptions = [
  { label: '10 نتائج', value: 10 },
  { label: '15 نتيجة', value: 15 },
  { label: '25 نتيجة', value: 25 },
  { label: '50 نتيجة', value: 50 },
]

const statusChips = [
  { value: null,        label: 'الكل',   icon: 'pi pi-th-large',     colorClass: 'chip-all'       },
  { value: 'Pending',   label: 'مفتوح',  icon: 'pi pi-clock',        colorClass: 'chip-pending'   },
  { value: 'Paid',      label: 'مدفوع',  icon: 'pi pi-check-circle', colorClass: 'chip-paid'      },
  { value: 'Cancelled', label: 'ملغى',   icon: 'pi pi-times-circle', colorClass: 'chip-cancelled' },
  { value: 'Refunded',  label: 'مُسترد', icon: 'pi pi-replay',       colorClass: 'chip-refunded'  },
]

// فقط حقول البحث (بدون الـ status لأنه دائماً ظاهر)
const activeSearchFiltersCount = computed(() => {
  let count = 0
  if (props.filters.startDate) count++
  if (props.filters.endDate)   count++
  if (props.filters.tableId)   count++
  return count
})
</script>

<style scoped>
/* ── Collapse Transition ───────────────────────── */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 400px;
}

/* ── Status Chips ─────────────────────────────── */
.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  border: 1.5px solid var(--p-surface-300);
  background: var(--p-surface-0);
  color: var(--p-text-color-secondary);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.status-chip:hover { background: var(--p-surface-100); }

.chip-all.active       { background: var(--p-primary-color); border-color: var(--p-primary-color); color: #fff; }
.chip-pending.active   { background: var(--p-blue-500);      border-color: var(--p-blue-500);      color: #fff; }
.chip-paid.active      { background: var(--p-green-500);     border-color: var(--p-green-500);     color: #fff; }
.chip-cancelled.active { background: var(--p-red-500);       border-color: var(--p-red-500);       color: #fff; }
.chip-refunded.active  { background: var(--p-orange-500);    border-color: var(--p-orange-500);    color: #fff; }
</style>