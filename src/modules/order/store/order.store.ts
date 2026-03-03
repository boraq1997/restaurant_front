import { defineStore } from 'pinia'
import { ref } from 'vue'
import { orderApi } from '../api/order.api'
import type { AddInvoiceItemDto, VoidItemDto, CheckoutDto } from '../../../types/order.types'
import type { Invoice } from '../../../types/table.types'
import { PaymentMethod } from '../../../types/api.types'

export const useOrderStore = defineStore('order', () => {
  const currentInvoice = ref<Invoice | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchOrder(id: number) {
    loading.value = true
    error.value = null
    try {
      currentInvoice.value = await orderApi.getById(id)
    } catch (e: any) {
      error.value = e?.message ?? 'فشل تحميل الطلب'
    } finally {
      loading.value = false
    }
  }

  async function addItem(data: AddInvoiceItemDto) {
    loading.value = true
    error.value = null
    try {
      const res = await orderApi.addItem(data)
      // إذا الـ response يرجع الفاتورة المحدّثة
      if (res?.id) currentInvoice.value = res
      return res
    } catch (e: any) {
      error.value = e?.message ?? 'فشل إضافة الصنف'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function voidItem(data: VoidItemDto) {
    try {
      await orderApi.voidItem(data)
      // احذف الصنف من الفاتورة محلياً
      if (currentInvoice.value?.items) {
        currentInvoice.value.items = currentInvoice.value.items
          .filter(i => i.id !== data.invoiceItemId)
      }
    } catch (e: any) {
      error.value = e?.message ?? 'فشل حذف الصنف'
      throw e
    }
  }

  async function checkout(invoiceId: number, amountPaid: number, method = PaymentMethod.Cash, cashBoxSessionId?: number) {
    loading.value = true
    try {
      const data: CheckoutDto = {
        invoiceId,
        amountPaid,
        paymentMethod: method,
        cashBoxSessionId: cashBoxSessionId ?? null,
      }
      await orderApi.checkout(data)
      currentInvoice.value = null
    } catch (e: any) {
      error.value = e?.message ?? 'فشل إتمام الدفع'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function moveInvoice(invoiceId: number, targetTableId: number) {
    try {
      await orderApi.moveInvoice({ invoiceId, targetTableId })
    } catch (e: any) {
      error.value = e?.message ?? 'فشل نقل الطلب'
      throw e
    }
  }

  function clearOrder() {
    currentInvoice.value = null
    error.value = null
  }

  return {
    currentInvoice, loading, error,
    fetchOrder, addItem, voidItem, checkout, moveInvoice, clearOrder,
  }
})