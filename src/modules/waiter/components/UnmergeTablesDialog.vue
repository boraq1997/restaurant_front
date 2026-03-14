<!-- src/modules/waiter/components/UnmergeTablesDialog.vue -->
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
      <div class="ud-sheet">

        <!-- Handle -->
        <div class="ud-handle-wrap"><div class="ud-handle" /></div>

        <!-- Header -->
        <div class="ud-header">
          <div class="ud-header-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="2"
                stroke="currentColor" stroke-width="1.8"/>
              <rect x="13" y="3" width="8" height="8" rx="2"
                stroke="currentColor" stroke-width="1.8"/>
              <rect x="3" y="13" width="8" height="8" rx="2"
                stroke="currentColor" stroke-width="1.8"/>
              <rect x="13" y="13" width="8" height="8" rx="2"
                stroke="currentColor" stroke-width="1.8"/>
              <path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="flex flex-column gap-1 flex-1">
            <span class="ud-title">فصل الطاولات</span>
            <span class="ud-sub">اختر المجموعة ثم حدد طريقة الفصل</span>
          </div>
          <button class="ud-close" @click="visible = false" :disabled="loading">
            <i class="pi pi-times" />
          </button>
        </div>

        <!-- Step indicator -->
        <div class="ud-steps">
          <div class="ud-step" :class="step >= 1 ? 'ud-step--active' : 'ud-step--inactive'">
            <div class="ud-step-dot">
              <i v-if="step > 1" class="pi pi-check" style="font-size:0.6rem" />
              <span v-else>١</span>
            </div>
            <span>المجموعة</span>
          </div>
          <div class="ud-step-line" :class="step >= 2 ? 'ud-step-line--done' : ''" />
          <div class="ud-step" :class="step >= 2 ? 'ud-step--active' : 'ud-step--inactive'">
            <div class="ud-step-dot"><span>٢</span></div>
            <span>الفصل</span>
          </div>
        </div>

        <!-- Body -->
        <div class="ud-body">

          <!-- STEP 1: اختيار المجموعة -->
          <Transition name="fade-step">
            <div v-if="step === 1" key="s1" class="ud-step-body">
              <p class="ud-step-label">اختر المجموعة المراد فصلها</p>

              <div v-if="mergedTables.length === 0" class="ud-empty">
                <i class="pi pi-inbox" style="font-size:1.5rem; opacity:0.3" />
                <span>لا توجد طاولات مدمجة حالياً</span>
              </div>

              <div v-else class="ud-group-list">
                <button
                  v-for="table in mergedTables"
                  :key="table.id"
                  class="ud-group-btn"
                  :class="selectedGroupId === table.id ? 'ud-group-btn--active' : ''"
                  @click="selectGroup(table)"
                >
                  <!-- رقم الطاولة الرئيسية -->
                  <div class="ud-group-num">{{ table.number }}</div>

                  <div class="ud-group-info">
                    <div class="ud-group-name">
                      {{ table.name }}
                      <span class="ud-primary-tag">رئيسية</span>
                    </div>
                    <div class="ud-group-meta">
                      <span>
                        <i class="pi pi-clone" style="font-size:0.6rem" />
                        {{ (table.mergedTables?.length ?? 0) + 1 }} طاولات
                      </span>
                      <span>
                        <i class="pi pi-users" style="font-size:0.6rem" />
                        {{ totalCapacity(table) }} كرسي
                      </span>
                    </div>
                    <!-- الطاولات الفرعية -->
                    <div class="ud-sub-chips">
                      <span
                        v-for="mt in table.mergedTables"
                        :key="mt.id"
                        class="ud-sub-chip"
                      >
                        {{ mt.name?.trim() ? mt.name : `طاولة ${mt.number}` }}
                      </span>
                    </div>
                  </div>

                  <Transition name="pop">
                    <div v-if="selectedGroupId === table.id" class="ud-group-check">
                      <i class="pi pi-check" style="font-size:0.6rem" />
                    </div>
                  </Transition>
                </button>
              </div>
            </div>
          </Transition>

          <!-- STEP 2: اختيار طريقة الفصل -->
          <Transition name="fade-step">
            <div v-if="step === 2" key="s2" class="ud-step-body">

              <!-- المجموعة المختارة (reminder) -->
              <div class="ud-group-reminder">
                <i class="pi pi-th-large" style="font-size:0.75rem" />
                <span>المجموعة:</span>
                <strong>{{ selectedGroup?.name }}</strong>
                <button class="ud-change-btn" @click="step = 1">تغيير</button>
              </div>

              <p class="ud-step-label" style="margin-top:0.85rem">
                اختر الطاولات للفصل
                <span class="ud-step-hint">أو حدد الرئيسية لفصل الكل</span>
              </p>

              <!-- الطاولة الرئيسية -->
              <div class="ud-table-grid">
                <button
                  class="ud-table-btn"
                  :class="isPrimarySelected ? 'ud-table-btn--primary-sel' : ''"
                  @click="togglePrimary"
                >
                  <div class="ud-primary-dot" />
                  <div class="ud-table-num">{{ selectedGroup?.number }}</div>
                  <div class="ud-table-info">
                    <span class="ud-table-name">{{ selectedGroup?.name }}</span>
                    <span class="ud-table-cap">
                      <i class="pi pi-users" style="font-size:0.6rem" />
                      {{ selectedGroup?.capacity }}
                    </span>
                  </div>
                  <div class="ud-all-tag">فصل الكل</div>
                  <Transition name="pop">
                    <div v-if="isPrimarySelected" class="ud-table-check ud-table-check--warn">
                      <i class="pi pi-check" style="font-size:0.6rem" />
                    </div>
                  </Transition>
                </button>

                <!-- الطاولات الفرعية -->
                <button
                  v-for="mt in selectedGroup?.mergedTables"
                  :key="mt.id"
                  class="ud-table-btn"
                  :class="[
                    isSubSelected(mt.id) ? 'ud-table-btn--sub-sel' : '',
                    isPrimarySelected    ? 'ud-table-btn--dimmed'  : '',
                  ]"
                  :disabled="isPrimarySelected"
                  @click="toggleSub(mt.id)"
                >
                  <div class="ud-table-num">{{ mt.number }}</div>
                  <div class="ud-table-info">
                    <span class="ud-table-name">{{ mt.name?.trim() ? mt.name : `طاولة ${mt.number}` }}</span>
                    <span class="ud-table-cap">
                      <i class="pi pi-users" style="font-size:0.6rem" />
                      {{ mt.capacity }}
                    </span>
                  </div>
                  <Transition name="pop">
                    <div v-if="isSubSelected(mt.id)" class="ud-table-check ud-table-check--sub">
                      <i class="pi pi-check" style="font-size:0.6rem" />
                    </div>
                  </Transition>
                </button>
              </div>

              <!-- ملخص -->
              <Transition name="fade-step">
                <div v-if="canUnmerge" class="ud-summary">
                  <div class="ud-summary-header">
                    <i class="pi pi-info-circle" style="font-size:0.72rem" />
                    <span v-if="isPrimarySelected">سيتم فصل جميع الطاولات ({{ (selectedGroup?.mergedTables?.length ?? 0) + 1 }})</span>
                    <span v-else>سيتم فصل {{ selectedSubIds.length }} طاولة</span>
                  </div>
                </div>
              </Transition>

            </div>
          </Transition>

        </div>

        <!-- Footer -->
        <div class="ud-footer">
          <button
            v-if="step > 1"
            class="ud-btn ud-btn--back"
            :disabled="loading"
            @click="step--"
          >
            <i class="pi pi-arrow-right" />
          </button>
          <button
            v-if="step === 1"
            class="ud-btn ud-btn--cancel flex-1"
            :disabled="loading"
            @click="visible = false"
          >
            إلغاء
          </button>
          <button
            class="ud-btn ud-btn--primary flex-1"
            :disabled="!canProceed || loading"
            @click="handleNext"
          >
            <i v-if="loading" class="pi pi-spinner pi-spin" />
            <template v-else>
              <template v-if="step === 1">
                التالي <i class="pi pi-arrow-left" />
              </template>
              <template v-else>
                <i class="pi pi-check" /> فصل الطاولات
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

const props = withDefaults(defineProps<{
  modelValue:   boolean
  mergedTables: Table[]
  loading:      boolean
}>(), { mergedTables: () => [] })

const emit = defineEmits<{
  'update:modelValue': [v: boolean]
  confirm: [payload: { tablesToUnmerge: number[] }]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const step            = ref(1)
const selectedGroupId = ref<number | null>(null)
const isPrimarySelected = ref(false)
const selectedSubIds    = ref<number[]>([])

watch(visible, (val) => { if (val) reset() })

function reset() {
  step.value            = 1
  selectedGroupId.value = null
  isPrimarySelected.value = false
  selectedSubIds.value    = []
}

const selectedGroup = computed(() =>
  props.mergedTables.find(t => t.id === selectedGroupId.value)
)

function selectGroup(table: Table) {
  selectedGroupId.value   = table.id
  isPrimarySelected.value = false
  selectedSubIds.value    = []
}

function togglePrimary() {
  isPrimarySelected.value = !isPrimarySelected.value
  if (isPrimarySelected.value) selectedSubIds.value = []
}

function toggleSub(id: number) {
  const idx = selectedSubIds.value.indexOf(id)
  if (idx === -1) selectedSubIds.value.push(id)
  else            selectedSubIds.value.splice(idx, 1)
}

function isSubSelected(id: number) {
  return selectedSubIds.value.includes(id)
}

function totalCapacity(table: Table) {
  return table.capacity + (table.mergedTables?.reduce((s, m) => s + (m.capacity ?? 0), 0) ?? 0)
}

const canProceed = computed(() => {
  if (step.value === 1) return !!selectedGroupId.value
  return isPrimarySelected.value || selectedSubIds.value.length > 0
})

const canUnmerge = computed(() =>
  isPrimarySelected.value || selectedSubIds.value.length > 0
)

function handleNext() {
  if (!canProceed.value) return
  if (step.value === 1) { step.value = 2; return }

  const ids: number[] = []
  if (isPrimarySelected.value && selectedGroup.value) {
    // فصل الكل: الرئيسية + جميع الفرعيات
    ids.push(selectedGroup.value.id)
    for (const mt of selectedGroup.value.mergedTables ?? []) ids.push(mt.id)
  } else {
    ids.push(...selectedSubIds.value)
  }

  if (ids.length === 0) return
  emit('confirm', { tablesToUnmerge: ids })
}
</script>

<style scoped>
.ud-sheet {
  display: flex; flex-direction: column;
  background: var(--p-surface-0);
  border-radius: 20px 20px 0 0;
  max-height: 92dvh; overflow: hidden;
}

.ud-handle-wrap { display: flex; justify-content: center; padding: 10px 0 4px; }
.ud-handle { width: 40px; height: 4px; border-radius: 2px; background: var(--p-surface-300); }

/* Header */
.ud-header {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.5rem 1.25rem 0.85rem;
  border-bottom: 1px solid var(--p-surface-200);
}
.ud-header-icon {
  width: 42px; height: 42px; border-radius: 12px;
  background: color-mix(in srgb, #f97316 12%, transparent);
  display: flex; align-items: center; justify-content: center;
  color: #f97316; flex-shrink: 0;
}
.ud-title { font-size: 1.05rem; font-weight: 800; color: var(--p-text-color); line-height: 1.1; }
.ud-sub   { font-size: 0.72rem; color: var(--p-text-muted-color); }
.ud-close {
  width: 36px; height: 36px; border-radius: 10px;
  border: 1.5px solid var(--p-surface-200);
  background: transparent; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--p-text-muted-color); flex-shrink: 0; transition: all .08s;
}
.ud-close:hover { background: var(--p-surface-100); }

/* Steps */
.ud-steps {
  display: flex; align-items: center; justify-content: center;
  padding: 0.7rem 3rem;
  background: var(--p-surface-50);
  border-bottom: 1px solid var(--p-surface-200);
}
.ud-step {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  font-size: 0.68rem; font-weight: 700; color: var(--p-text-muted-color);
  transition: color .08s;
}
.ud-step--active   { color: #f97316; }
.ud-step--inactive { opacity: 0.4; }
.ud-step-dot {
  width: 26px; height: 26px; border-radius: 50%;
  border: 2px solid currentColor;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; font-weight: 800; transition: all .1s;
}
.ud-step--active .ud-step-dot { background: #f97316; color: #fff; border-color: #f97316; }
.ud-step-line {
  flex: 1; height: 2px; margin: 0 8px; margin-bottom: 16px;
  background: var(--p-surface-300); border-radius: 1px; transition: background .15s;
}
.ud-step-line--done { background: #f97316; }

/* Body */
.ud-body { flex: 1; overflow-y: auto; padding: 1rem 1.25rem; -webkit-overflow-scrolling: touch; }
.ud-step-body { min-height: 160px; }
.ud-step-label {
  font-size: 0.78rem; font-weight: 800; color: var(--p-text-muted-color);
  margin: 0 0 0.75rem; display: flex; align-items: center; gap: 0.5rem;
}
.ud-step-hint { font-weight: 400; font-size: 0.7rem; opacity: 0.7; }

/* Group list */
.ud-group-list { display: flex; flex-direction: column; gap: 0.55rem; }
.ud-group-btn {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.85rem 1rem; border-radius: 14px;
  border: 2px solid var(--p-surface-200);
  background: var(--p-surface-0); cursor: pointer;
  text-align: right; position: relative;
  transition: border-color .08s, background .08s;
  -webkit-tap-highlight-color: transparent;
}
.ud-group-btn:active  { opacity: 0.75; }
.ud-group-btn:hover   { border-color: var(--p-surface-400); }
.ud-group-btn--active {
  border-color: #f97316;
  background: color-mix(in srgb, #f97316 6%, transparent);
}

.ud-group-num {
  width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
  background: var(--p-surface-100);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; font-weight: 900; color: var(--p-text-color);
  transition: all .08s;
}
.ud-group-btn--active .ud-group-num {
  background: color-mix(in srgb, #f97316 14%, transparent);
  color: #f97316;
}
.ud-group-info { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.ud-group-name {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.85rem; font-weight: 700; color: var(--p-text-color);
}
.ud-primary-tag {
  font-size: 0.62rem; font-weight: 700; padding: 1px 6px;
  border-radius: 20px; background: color-mix(in srgb, #f97316 14%, transparent); color: #f97316;
}
.ud-group-meta {
  display: flex; gap: 0.75rem;
  font-size: 0.7rem; color: var(--p-text-muted-color);
}
.ud-group-meta span { display: flex; align-items: center; gap: 3px; }
.ud-sub-chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
.ud-sub-chip {
  font-size: 0.65rem; padding: 1px 7px; border-radius: 20px;
  background: var(--p-surface-100); color: var(--p-text-muted-color);
}
.ud-group-check {
  width: 20px; height: 20px; border-radius: 50%;
  background: #f97316; color: #fff; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}

/* Table grid */
.ud-table-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.55rem;
}
.ud-table-btn {
  position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 0.8rem 0.5rem 0.65rem; border-radius: 14px; min-height: 85px;
  border: 2px solid var(--p-surface-200);
  background: var(--p-surface-0); cursor: pointer; overflow: hidden;
  transition: all .08s;
  -webkit-tap-highlight-color: transparent;
}
.ud-table-btn:active   { opacity: 0.7; }
.ud-table-btn:hover    { border-color: var(--p-surface-400); }
.ud-table-btn--primary-sel {
  border-color: #f97316;
  background: color-mix(in srgb, #f97316 7%, transparent);
}
.ud-table-btn--sub-sel {
  border-color: #10b981;
  background: color-mix(in srgb, #10b981 7%, transparent);
}
.ud-table-btn--dimmed  { opacity: 0.35; pointer-events: none; }

.ud-primary-dot {
  position: absolute; top: 7px; right: 7px;
  width: 7px; height: 7px; border-radius: 50%;
  background: #f97316;
}
.ud-all-tag {
  font-size: 0.6rem; font-weight: 700; padding: 1px 6px; border-radius: 20px;
  background: color-mix(in srgb, #f97316 14%, transparent); color: #f97316;
  margin-top: 2px;
}

.ud-table-num {
  font-size: 1.5rem; font-weight: 900; line-height: 1; color: var(--p-text-color);
}
.ud-table-btn--primary-sel .ud-table-num { color: #f97316; }
.ud-table-btn--sub-sel     .ud-table-num { color: #059669; }

.ud-table-info { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.ud-table-name { font-size: 0.68rem; font-weight: 600; color: var(--p-text-muted-color); }
.ud-table-cap  { font-size: 0.65rem; color: var(--p-text-muted-color); display: flex; align-items: center; gap: 3px; }

.ud-table-check {
  position: absolute; bottom: 5px; left: 5px;
  width: 18px; height: 18px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; color: #fff;
}
.ud-table-check--warn { background: #f97316; }
.ud-table-check--sub  { background: #10b981; }

/* Group reminder */
.ud-group-reminder {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.65rem 0.9rem; border-radius: 12px;
  background: color-mix(in srgb, #f97316 8%, transparent);
  border: 1.5px solid color-mix(in srgb, #f97316 22%, transparent);
  font-size: 0.78rem; color: #f97316;
}
.ud-group-reminder strong { font-weight: 800; }
.ud-change-btn {
  margin-right: auto; font-size: 0.72rem; color: #f97316;
  background: transparent; border: none; cursor: pointer;
  font-weight: 700; text-decoration: underline; padding: 0; font-family: inherit;
}

/* Summary */
.ud-summary {
  margin-top: 0.85rem; padding: 0.75rem 1rem;
  border-radius: 12px;
  background: color-mix(in srgb, #f97316 6%, transparent);
  border: 1.5px dashed color-mix(in srgb, #f97316 30%, transparent);
}
.ud-summary-header {
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.75rem; font-weight: 600; color: #f97316;
}

/* Empty */
.ud-empty {
  text-align: center; padding: 2.5rem 0;
  font-size: 0.82rem; color: var(--p-text-muted-color);
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
}

/* Footer */
.ud-footer {
  display: flex; gap: 0.6rem;
  padding: 0.85rem 1.25rem;
  padding-bottom: max(0.85rem, env(safe-area-inset-bottom));
  border-top: 1px solid var(--p-surface-200);
  background: var(--p-surface-0);
}

/* Buttons */
.ud-btn {
  display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  padding: 0 1.25rem; height: 50px; min-width: 50px;
  border-radius: 14px; font-size: 0.9rem; font-weight: 700;
  cursor: pointer; border: none; transition: all .08s;
  -webkit-tap-highlight-color: transparent; font-family: inherit;
}
.ud-btn:active   { opacity: 0.8; }
.ud-btn:disabled { opacity: 0.42; pointer-events: none; }
.ud-btn--back    { background: var(--p-surface-100); color: var(--p-text-muted-color); border: 1.5px solid var(--p-surface-200); }
.ud-btn--cancel  { background: var(--p-surface-100); color: var(--p-text-color); border: 1.5px solid var(--p-surface-200); }
.ud-btn--primary { background: #f97316; color: #fff; }
.ud-btn--primary:hover { filter: brightness(1.06); }

/* Transitions */
.fade-step-enter-active, .fade-step-leave-active { transition: opacity .12s ease; }
.fade-step-enter-from, .fade-step-leave-to { opacity: 0; }
.pop-enter-active { transition: all .1s ease; }
.pop-enter-from   { opacity: 0; transform: scale(0.6); }
.pop-leave-active { transition: all .08s ease; }
.pop-leave-to     { opacity: 0; transform: scale(0.6); }
</style>