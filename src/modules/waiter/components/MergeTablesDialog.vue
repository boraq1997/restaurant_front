<!-- src/modules/waiter/components/MergeTablesDialog.vue -->
<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :draggable="false"
    :closable="false"
    pt:root:style="padding:0; margin:0;"
    pt:mask:style="align-items: flex-end; padding: 0;"
    style="width: 100%; max-width: 560px; margin: 0; border-radius: 24px 24px 0 0;"
    dir="rtl"
  >
    <template #container>
      <div class="md-sheet">

        <!-- ── Handle bar ── -->
        <div class="md-handle-wrap">
          <div class="md-handle" />
        </div>

        <!-- ── Header ── -->
        <div class="md-header">
          <div class="md-header-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="2"
                stroke="currentColor" stroke-width="1.8"/>
              <rect x="13" y="3" width="8" height="8" rx="2"
                stroke="currentColor" stroke-width="1.8"/>
              <rect x="3" y="13" width="8" height="8" rx="2"
                stroke="currentColor" stroke-width="1.8"/>
              <rect x="13" y="13" width="8" height="8" rx="2"
                stroke="currentColor" stroke-width="1.8"/>
              <path d="M11 7h2M11 17h2M7 11v2M17 11v2"
                stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="flex flex-column gap-1 flex-1">
            <span class="md-title">دمج الطاولات</span>
            <span class="md-sub">من نفس الطابق فقط</span>
          </div>
          <button class="md-close" @click="visible = false" :disabled="loading">
            <i class="pi pi-times" />
          </button>
        </div>

        <!-- ── Step indicator ── -->
        <div class="md-steps">
          <div class="md-step" :class="step >= 1 ? 'md-step--active' : 'md-step--inactive'">
            <div class="md-step-dot">
              <i v-if="step > 1" class="pi pi-check" style="font-size:0.6rem" />
              <span v-else>١</span>
            </div>
            <span>الطابق</span>
          </div>
          <div class="md-step-line" :class="step >= 2 ? 'md-step-line--done' : ''" />
          <div class="md-step" :class="step >= 2 ? 'md-step--active' : 'md-step--inactive'">
            <div class="md-step-dot">
              <i v-if="step > 2" class="pi pi-check" style="font-size:0.6rem" />
              <span v-else>٢</span>
            </div>
            <span>الهدف</span>
          </div>
          <div class="md-step-line" :class="step >= 3 ? 'md-step-line--done' : ''" />
          <div class="md-step" :class="step >= 3 ? 'md-step--active' : 'md-step--inactive'">
            <div class="md-step-dot"><span>٣</span></div>
            <span>الدمج</span>
          </div>
        </div>

        <!-- ── Body ── -->
        <div class="md-body">

          <!-- STEP 1: اختيار الطابق -->
          <Transition name="slide-up">
            <div v-if="step === 1" key="s1" class="md-step-body">
              <p class="md-step-label">اختر الطابق</p>
              <div class="md-floor-grid">
                <button
                  v-for="floor in floors"
                  :key="floor.id"
                  class="md-floor-btn"
                  :class="selectedFloorId === floor.id ? 'md-floor-btn--active' : ''"
                  @click="selectFloor(floor.id)"
                >
                  <div class="md-floor-icon">
                    <i class="pi pi-building" />
                  </div>
                  <span class="md-floor-name">{{ floor.name }}</span>
                  <span class="md-floor-badge">{{ floorTableCount(floor.id) }} طاولة</span>
                </button>
              </div>
            </div>
          </Transition>

          <!-- STEP 2: اختيار الطاولة الهدف -->
          <Transition name="slide-up">
            <div v-if="step === 2" key="s2" class="md-step-body">
              <p class="md-step-label">
                الطاولة الهدف
                <span class="md-step-hint">ستُدمج باقي الطاولات إليها</span>
              </p>
              <div class="md-table-grid">
                <button
                  v-for="table in floorTables"
                  :key="table.id"
                  class="md-table-btn"
                  :class="[
                    targetTableId === table.id    ? 'md-table-btn--target'   : '',
                    table.status  === 'occupied'  ? 'md-table-btn--occupied' : '',
                  ]"
                  @click="setTarget(table)"
                >
                  <div class="md-table-status-dot"
                    :class="table.status === 'occupied' ? 'dot-occupied' : 'dot-free'" />
                  <div class="md-table-num">{{ table.number }}</div>
                  <div class="md-table-info">
                    <span class="md-table-name">{{ table.name }}</span>
                    <span class="md-table-cap">
                      <i class="pi pi-users" style="font-size:0.6rem" />
                      {{ table.capacity }}
                    </span>
                  </div>
                  <Transition name="pop">
                    <div v-if="targetTableId === table.id" class="md-table-check md-table-check--target">
                      <i class="pi pi-flag-fill" style="font-size:0.6rem" />
                    </div>
                  </Transition>
                </button>
              </div>
            </div>
          </Transition>

          <!-- STEP 3: اختيار الطاولات للدمج -->
          <Transition name="slide-up">
            <div v-if="step === 3" key="s3" class="md-step-body">

              <!-- الهدف المختار -->
              <div class="md-target-reminder">
                <i class="pi pi-flag-fill" style="font-size:0.75rem" />
                <span>الهدف:</span>
                <strong>{{ tableName(targetTableId!) }}</strong>
                <span class="md-reminder-cap">({{ targetTable?.capacity }} كرسي)</span>
                <button class="md-change-btn" @click="step = 2">تغيير</button>
              </div>

              <p class="md-step-label" style="margin-top:0.85rem">
                اختر للدمج
                <span class="md-step-hint">يمكن تحديد أكثر من طاولة</span>
              </p>

              <div class="md-table-grid">
                <button
                  v-for="table in sourceTables"
                  :key="table.id"
                  class="md-table-btn"
                  :class="[
                    selectedSourceIds.includes(table.id) ? 'md-table-btn--selected'  : '',
                    table.status === 'occupied'          ? 'md-table-btn--occupied'  : '',
                  ]"
                  @click="toggleSource(table.id)"
                >
                  <div class="md-table-status-dot"
                    :class="table.status === 'occupied' ? 'dot-occupied' : 'dot-free'" />
                  <div class="md-table-num">{{ table.number }}</div>
                  <div class="md-table-info">
                    <span class="md-table-name">{{ table.name }}</span>
                    <span class="md-table-cap">
                      <i class="pi pi-users" style="font-size:0.6rem" />
                      {{ table.capacity }}
                    </span>
                  </div>
                  <Transition name="pop">
                    <div v-if="selectedSourceIds.includes(table.id)" class="md-table-check md-table-check--selected">
                      <i class="pi pi-check" style="font-size:0.6rem" />
                    </div>
                  </Transition>
                </button>
              </div>

              <div v-if="sourceTables.length === 0" class="md-empty">
                <i class="pi pi-info-circle" />
                لا توجد طاولات أخرى في هذا الطابق
              </div>

              <!-- ملخص -->
              <Transition name="slide-up">
                <div v-if="selectedSourceIds.length > 0" class="md-summary">
                  <div class="md-summary-header">
                    <i class="pi pi-list-check" style="font-size:0.75rem" />
                    <span>ملخص الدمج</span>
                    <span class="md-summary-cap mr-auto">
                      إجمالي {{ mergedCapacity }} كرسي
                    </span>
                  </div>
                  <div class="md-summary-row">
                    <div class="md-summary-chips">
                      <span v-for="id in selectedSourceIds" :key="id" class="md-chip md-chip--src">
                        {{ tableName(id) }}
                      </span>
                    </div>
                    <i class="pi pi-arrow-left md-summary-arrow" />
                    <span class="md-chip md-chip--target">
                      <i class="pi pi-flag-fill" style="font-size:0.55rem" />
                      {{ tableName(targetTableId!) }}
                    </span>
                  </div>
                </div>
              </Transition>

            </div>
          </Transition>

        </div>

        <!-- ── Footer ── -->
        <div class="md-footer">
          <button
            v-if="step > 1"
            class="md-btn md-btn--back"
            :disabled="loading"
            @click="step--"
          >
            <i class="pi pi-arrow-right" />
          </button>
          <button
            v-if="step === 1"
            class="md-btn md-btn--cancel flex-1"
            :disabled="loading"
            @click="visible = false"
          >
            إلغاء
          </button>
          <button
            class="md-btn md-btn--primary flex-1"
            :disabled="!canProceed || loading"
            @click="handleNext"
          >
            <i v-if="loading" class="pi pi-spinner pi-spin" />
            <template v-else>
              <template v-if="step < 3">
                التالي
                <i class="pi pi-arrow-left" />
              </template>
              <template v-else>
                <i class="pi pi-check" />
                دمج الطاولات
              </template>
            </template>
          </button>
        </div>

      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import type { Table } from '../types/waiter.types'

interface Floor { id: number; name: string }

const props = defineProps<{
  modelValue: boolean
  tables:     Table[]
  floors:     Floor[]
  loading:    boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [v: boolean]
  confirm: [payload: { sourceTableIds: number[]; targetTableId: number }]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const step              = ref(1)
const selectedFloorId   = ref<number | null>(null)
const targetTableId     = ref<number | null>(null)
const selectedSourceIds = ref<number[]>([])

watch(visible, (val) => { if (val) reset() })

function reset() {
  step.value              = 1
  selectedFloorId.value   = null
  targetTableId.value     = null
  selectedSourceIds.value = []
}

function selectFloor(id: number) {
  if (selectedFloorId.value === id) return
  selectedFloorId.value   = id
  targetTableId.value     = null
  selectedSourceIds.value = []
}

const floorTables = computed(() => {
  if (!selectedFloorId.value) return []
  return props.tables.filter(
    t => t.floorId === selectedFloorId.value && t.status !== 'merged'
  )
})

function floorTableCount(floorId: number) {
  return props.tables.filter(t => t.floorId === floorId && t.status !== 'merged').length
}

function setTarget(table: Table) {
  selectedSourceIds.value = selectedSourceIds.value.filter(id => id !== table.id)
  targetTableId.value = table.id
}

const targetTable = computed(() =>
  props.tables.find(t => t.id === targetTableId.value)
)

const sourceTables = computed(() =>
  floorTables.value.filter(t => t.id !== targetTableId.value)
)

function toggleSource(id: number) {
  const idx = selectedSourceIds.value.indexOf(id)
  if (idx === -1) selectedSourceIds.value.push(id)
  else            selectedSourceIds.value.splice(idx, 1)
}

function tableName(id: number) {
  return props.tables.find(t => t.id === id)?.name ?? `طاولة ${id}`
}

const mergedCapacity = computed(() => {
  const ids = [...selectedSourceIds.value, targetTableId.value].filter(Boolean) as number[]
  return ids.reduce((sum, id) => sum + (props.tables.find(t => t.id === id)?.capacity ?? 0), 0)
})

const canProceed = computed(() => {
  if (step.value === 1) return !!selectedFloorId.value
  if (step.value === 2) return !!targetTableId.value
  return selectedSourceIds.value.length > 0
})

function handleNext() {
  if (!canProceed.value) return
  if (step.value < 3) { step.value++; return }
  if (!targetTableId.value) return
  emit('confirm', {
    sourceTableIds: [...selectedSourceIds.value],
    targetTableId:  targetTableId.value,
  })
}
</script>

<style scoped>
.md-sheet {
  display: flex; flex-direction: column;
  background: var(--p-surface-0);
  border-radius: 20px 20px 0 0;
  max-height: 92dvh;
  overflow: hidden;
}

.md-handle-wrap { display: flex; justify-content: center; padding: 10px 0 4px; }
.md-handle { width: 40px; height: 4px; border-radius: 2px; background: var(--p-surface-300); }

/* Header */
.md-header {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.5rem 1.25rem 0.85rem;
  border-bottom: 1px solid var(--p-surface-200);
}
.md-header-icon {
  width: 42px; height: 42px; border-radius: 12px;
  background: color-mix(in srgb, var(--p-primary-color) 12%, transparent);
  display: flex; align-items: center; justify-content: center;
  color: var(--p-primary-color); flex-shrink: 0;
}
.md-title { font-size: 1.05rem; font-weight: 800; color: var(--p-text-color); line-height: 1.1; }
.md-sub   { font-size: 0.72rem; color: var(--p-text-muted-color); }
.md-close {
  width: 36px; height: 36px; border-radius: 10px;
  border: 1.5px solid var(--p-surface-200);
  background: transparent; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--p-text-muted-color); flex-shrink: 0;
  transition: all .08s;
}
.md-close:hover { background: var(--p-surface-100); }

/* Steps */
.md-steps {
  display: flex; align-items: center; justify-content: center;
  padding: 0.7rem 2rem;
  background: var(--p-surface-50);
  border-bottom: 1px solid var(--p-surface-200);
}
.md-step {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  font-size: 0.68rem; font-weight: 700; color: var(--p-text-muted-color);
  transition: color .08s;
}
.md-step--active   { color: var(--p-primary-color); }
.md-step--inactive { opacity: 0.4; }
.md-step-dot {
  width: 26px; height: 26px; border-radius: 50%;
  border: 2px solid currentColor;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; font-weight: 800; transition: all .1s;
}
.md-step--active .md-step-dot {
  background: var(--p-primary-color); color: #fff; border-color: var(--p-primary-color);
}
.md-step-line {
  flex: 1; height: 2px; margin: 0 6px; margin-bottom: 16px;
  background: var(--p-surface-300); border-radius: 1px; transition: background .15s;
}
.md-step-line--done { background: var(--p-primary-color); }

/* Body */
.md-body { flex: 1; overflow-y: auto; padding: 1rem 1.25rem; -webkit-overflow-scrolling: touch; will-change: scroll-position; }
.md-step-body { min-height: 160px; }
.md-step-label {
  font-size: 0.78rem; font-weight: 800; color: var(--p-text-muted-color);
  margin: 0 0 0.75rem; display: flex; align-items: center; gap: 0.5rem;
}
.md-step-hint { font-weight: 400; font-size: 0.7rem; opacity: 0.7; }

/* Floor grid */
.md-floor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.6rem;
}
.md-floor-btn {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 1rem 0.75rem; border-radius: 16px;
  border: 2px solid var(--p-surface-200);
  background: var(--p-surface-0);
  cursor: pointer; transition: all .08s;
  -webkit-tap-highlight-color: transparent;
}
.md-floor-btn:active { opacity: 0.75; }
.md-floor-btn:hover  { border-color: var(--p-primary-color); }
.md-floor-btn--active {
  border-color: var(--p-primary-color);
  background: color-mix(in srgb, var(--p-primary-color) 7%, transparent);
}
.md-floor-icon {
  width: 40px; height: 40px; border-radius: 12px;
  background: var(--p-surface-100);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; color: var(--p-text-muted-color);
  transition: all .08s;
}
.md-floor-btn--active .md-floor-icon {
  background: color-mix(in srgb, var(--p-primary-color) 14%, transparent);
  color: var(--p-primary-color);
}
.md-floor-name  { font-size: 0.82rem; font-weight: 700; color: var(--p-text-color); }
.md-floor-badge {
  font-size: 0.68rem; color: var(--p-text-muted-color);
  background: var(--p-surface-100); border-radius: 20px; padding: 1px 8px;
}
.md-floor-btn--active .md-floor-badge {
  background: color-mix(in srgb, var(--p-primary-color) 14%, transparent);
  color: var(--p-primary-color);
}

/* Table grid */
.md-table-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.55rem;
}
.md-table-btn {
  position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 0.8rem 0.5rem 0.65rem;
  border-radius: 14px;
  border: 2px solid var(--p-surface-200);
  background: var(--p-surface-0);
  cursor: pointer; overflow: hidden; min-height: 85px;
  transition: all .08s;
  -webkit-tap-highlight-color: transparent;
}
.md-table-btn:active { opacity: 0.7; }
.md-table-btn:hover  { border-color: var(--p-surface-400); }
.md-table-btn--target {
  border-color: var(--p-primary-color);
  background: color-mix(in srgb, var(--p-primary-color) 7%, transparent);
}
.md-table-btn--selected {
  border-color: #10b981;
  background: color-mix(in srgb, #10b981 7%, transparent);
}
.md-table-btn--occupied { opacity: 0.72; }

.md-table-num {
  font-size: 1.5rem; font-weight: 900; line-height: 1;
  color: var(--p-text-color);
}
.md-table-btn--target   .md-table-num { color: var(--p-primary-color); }
.md-table-btn--selected .md-table-num { color: #059669; }

.md-table-info { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.md-table-name { font-size: 0.68rem; font-weight: 600; color: var(--p-text-muted-color); }
.md-table-cap  { font-size: 0.65rem; color: var(--p-text-muted-color); display: flex; align-items: center; gap: 3px; }

.md-table-status-dot {
  position: absolute; top: 7px; right: 7px;
  width: 7px; height: 7px; border-radius: 50%;
}
.dot-occupied { background: #ef4444; }
.dot-free     { background: #10b981; }

.md-table-check {
  position: absolute; bottom: 5px; left: 5px;
  width: 18px; height: 18px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; color: #fff;
}
.md-table-check--target   { background: var(--p-primary-color); }
.md-table-check--selected { background: #10b981; }

/* Target reminder */
.md-target-reminder {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.65rem 0.9rem; border-radius: 12px;
  background: color-mix(in srgb, var(--p-primary-color) 8%, transparent);
  border: 1.5px solid color-mix(in srgb, var(--p-primary-color) 22%, transparent);
  font-size: 0.78rem; color: var(--p-text-muted-color);
  color: var(--p-primary-color);
}
.md-target-reminder strong { font-weight: 800; }
.md-reminder-cap { font-size: 0.7rem; color: var(--p-primary-color); opacity: 0.7; }
.md-change-btn {
  margin-right: auto; font-size: 0.72rem;
  color: var(--p-primary-color); background: transparent;
  border: none; cursor: pointer; font-weight: 700;
  text-decoration: underline; padding: 0; font-family: inherit;
}

/* Summary */
.md-summary {
  margin-top: 0.85rem; padding: 0.85rem 1rem;
  border-radius: 14px;
  background: var(--p-surface-50);
  border: 1.5px dashed var(--p-surface-300);
  display: flex; flex-direction: column; gap: 0.5rem;
}
.md-summary-header {
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.72rem; font-weight: 700; color: var(--p-text-muted-color);
}
.md-summary-cap { font-size: 0.7rem; font-weight: 600; }
.md-summary-row { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.md-summary-arrow { color: var(--p-text-muted-color); font-size: 0.72rem; }
.md-summary-chips { display: flex; flex-wrap: wrap; gap: 4px; }
.md-chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 9px; border-radius: 20px;
  font-size: 0.72rem; font-weight: 700;
}
.md-chip--src    { background: color-mix(in srgb, #10b981 14%, transparent); color: #065f46; }
.md-chip--target { background: color-mix(in srgb, var(--p-primary-color) 14%, transparent); color: var(--p-primary-color); }

/* Empty */
.md-empty {
  text-align: center; padding: 2rem 0;
  font-size: 0.8rem; color: var(--p-text-muted-color);
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
}

/* Footer */
.md-footer {
  display: flex; gap: 0.6rem;
  padding: 0.85rem 1.25rem;
  padding-bottom: max(0.85rem, env(safe-area-inset-bottom));
  border-top: 1px solid var(--p-surface-200);
  background: var(--p-surface-0);
}

/* Buttons */
.md-btn {
  display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  padding: 0 1.25rem; height: 50px; min-width: 50px;
  border-radius: 14px; font-size: 0.9rem; font-weight: 700;
  cursor: pointer; border: none; transition: all .08s;
  -webkit-tap-highlight-color: transparent; font-family: inherit;
}
.md-btn:active    { opacity: 0.8; }
.md-btn:disabled  { opacity: 0.42; pointer-events: none; }
.md-btn--back     { background: var(--p-surface-100); color: var(--p-text-muted-color); border: 1.5px solid var(--p-surface-200); }
.md-btn--cancel   { background: var(--p-surface-100); color: var(--p-text-color); border: 1.5px solid var(--p-surface-200); }
.md-btn--primary  { background: var(--p-primary-color); color: #fff; }
.md-btn--primary:hover { filter: brightness(1.06); }

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active { transition: opacity .12s ease; }
.slide-up-enter-from { opacity: 0; }
.slide-up-leave-to   { opacity: 0; }
.pop-enter-active { transition: all .1s ease; }
.pop-enter-from   { opacity: 0; transform: scale(0.6); }
.pop-leave-active { transition: all .08s ease; }
.pop-leave-to     { opacity: 0; transform: scale(0.6); }
</style>