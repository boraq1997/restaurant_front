import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import apiClient from '../../../../services/api-client'
import type {
  Printer,
  CreatePrinterRequest,
  UpdatePrinterRequest,
  PrinterDiscovery,
} from '../types/printers-types'

export const usePrinterStore = defineStore('printer', () => {
  const toast = useToast()

  const printers           = ref<Printer[]>([])
  const discoveredPrinters = ref<PrinterDiscovery[]>([])
  const loading            = ref(false)
  const submitting         = ref(false)

  async function fetchPrinters() {
    loading.value = true
    try {
      printers.value = await apiClient.get('/printers')
    } catch (err: any) {
      toast.add({ severity: 'error', summary: 'خطأ', detail: err?.response?.data?.message ?? 'فشل تحميل الطابعات', life: 3000 })
    } finally {
      loading.value = false
    }
  }

  async function fetchDiscovered() {
    try {
      discoveredPrinters.value = await apiClient.get('/printers/discovered-printers')
    } catch {
      discoveredPrinters.value = []
    }
  }

  async function createPrinter(payload: CreatePrinterRequest): Promise<boolean> {
    submitting.value = true
    try {
      const printer = await apiClient.post('/printers', payload)
      printers.value.push(printer)
      toast.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الطابعة بنجاح', life: 3000 })
      return true
    } catch (err: any) {
      toast.add({ severity: 'error', summary: 'خطأ', detail: err?.response?.data?.message ?? 'فشل إضافة الطابعة', life: 3000 })
      return false
    } finally {
      submitting.value = false
    }
  }

  async function updatePrinter(id: number, payload: UpdatePrinterRequest): Promise<boolean> {
    submitting.value = true
    try {
      const updated = await apiClient.put(`/printers/${id}`, payload)
      const idx = printers.value.findIndex(p => p.id === id)
      if (idx !== -1) printers.value[idx] = updated
      toast.add({ severity: 'success', summary: 'تم', detail: 'تم تعديل الطابعة بنجاح', life: 3000 })
      return true
    } catch (err: any) {
      toast.add({ severity: 'error', summary: 'خطأ', detail: err?.response?.data?.message ?? 'فشل تعديل الطابعة', life: 3000 })
      return false
    } finally {
      submitting.value = false
    }
  }

  async function deletePrinter(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/printers/${id}`)
      printers.value = printers.value.filter(p => p.id !== id)
      toast.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الطابعة بنجاح', life: 3000 })
      return true
    } catch (err: any) {
      toast.add({ severity: 'error', summary: 'خطأ', detail: err?.response?.data?.message ?? 'فشل حذف الطابعة', life: 3000 })
      return false
    }
  }

  return {
    printers,
    discoveredPrinters,
    loading,
    submitting,
    fetchPrinters,
    fetchDiscovered,
    createPrinter,
    updatePrinter,
    deletePrinter,
  }
})