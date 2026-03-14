<!-- src/modules/dashboard/orders/pages/OrderHistoryPage.vue -->
<template>
  <div class="min-h-screen surface-50" dir="rtl">

    <!-- ── Header + Stats ─────────────────────────────── -->
    <!-- <OrdersHeader
      :total-records="store.totalRecords"
      :stats="store.stats"
      :active-status="store.filters.status"
      @filter-status="store.toggleStatusFilter"
    /> -->

    <!-- ── Filters ────────────────────────────────────── -->
    <OrdersFilters
      :filters="store.filters"
      :page-size="store.pageSize"
      :loading="store.loading"
      @update:filters="store.filters = $event"
      @update:page-size="store.setPageSize($event)"
      @search="store.fetchOrders(1)"
      @reset="store.resetFilters"
      @refresh="store.fetchOrders(store.currentPage)"
      @filter-status="store.toggleStatusFilter"
    />

    <!-- ── Content ────────────────────────────────────── -->
    <main class="px-4 pt-4 pb-6">

      <!-- Loading -->
      <div v-if="store.loading" class="flex justify-content-center align-items-center py-8">
        <ProgressSpinner style="width:44px;height:44px" />
      </div>

      <template v-else>

        <!-- فارغ -->
        <div
          v-if="store.orders.length === 0"
          class="flex flex-column align-items-center py-8 gap-3"
        >
          <div class="w-6rem h-6rem border-round-full surface-100 flex align-items-center justify-content-center">
            <i class="pi pi-inbox text-4xl text-300" />
          </div>
          <p class="font-bold text-500 m-0 text-lg">لا توجد طلبات</p>
          <p class="text-400 text-sm m-0">جرّب تغيير الفلاتر أو توسيع نطاق البحث</p>
          <Button label="مسح الفلاتر" text @click="store.resetFilters" />
        </div>

        <template v-else>

          <!-- Desktop: جدول -->
          <div class="hidden md:block">
            <OrdersTable
              :orders="store.orders"
              :loading="store.loading"
              @select="openDetail"
            />
          </div>

          <!-- Mobile: كروت -->
          <div class="md:hidden">
            <OrdersCards
              :orders="store.orders"
              @select="openDetail"
            />
          </div>

          <!-- Pagination -->
          <OrdersPagination
            :current-page="store.currentPage"
            :total-pages="store.totalPages"
            :total-records="store.totalRecords"
            :visible-pages="store.visiblePages"
            @go="store.fetchOrders"
          />

        </template>
      </template>
    </main>

    <!-- ── Detail Drawer ──────────────────────────────── -->
    <OrderDetailDrawer
      v-model="drawerVisible"
      :order="selectedOrder"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button         from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

import { useOrdersStore }    from './store/Orders.store'
import OrdersHeader          from './components/Ordersheader.vue'
import OrdersFilters         from './components/Ordersfilters.vue'
import OrdersTable           from './components/OrdersTable.vue'
import OrdersCards           from './components/OrdersCards.vue'
import OrdersPagination      from './components/OrdersPagination.vue'
import OrderDetailDrawer     from './components/OrderDetailDrawer.vue'
import type { OrderDto }     from './types/orders.types'

const store         = useOrdersStore()
const drawerVisible = ref(false)
const selectedOrder = ref<OrderDto | null>(null)

onMounted(() => {
  store.fetchOrders(1)
  store.fetchStats()
})

function openDetail(order: OrderDto) {
  selectedOrder.value = order
  drawerVisible.value = true
}
</script>