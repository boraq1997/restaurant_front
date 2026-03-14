// src/modules/dashboard/orders/composables/useOrderHelpers.ts

export function useOrderHelpers() {

  function formatDate(str: string) {
    if (!str) return '—'
    return new Date(str).toLocaleDateString('ar-IQ', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  }

  function formatTime(str: string) {
    if (!str) return ''
    return new Date(str).toLocaleTimeString('ar-IQ', {
      hour: '2-digit', minute: '2-digit',
    })
  }

  function toDateStr(d: Date) {
    return d.toISOString().split('T')[0]
  }

  function validItems(order: any) {
    return (order.invoiceItemsDto ?? []).filter((i: any) => i.menuItemName?.trim())
  }

  // ── Status ────────────────────────────────────────────
  function statusLabel(s?: string | number) {
    if (s === 'Pending'   || s === 0) return 'مفتوح'
    if (s === 'Paid'      || s === 1) return 'مدفوع'
    if (s === 'Cancelled' || s === 2) return 'ملغى'
    if (s === 'Refunded'  || s === 3) return 'مُسترد'
    return 'غير معروف'
  }

  function statusSeverity(s?: string | number): 'info' | 'success' | 'danger' | 'warn' | 'secondary' {
    if (s === 'Pending'   || s === 0) return 'info'
    if (s === 'Paid'      || s === 1) return 'success'
    if (s === 'Cancelled' || s === 2) return 'danger'
    if (s === 'Refunded'  || s === 3) return 'warn'
    return 'secondary'
  }

  function statusBg(s?: string | number) {
    if (s === 'Pending'   || s === 0) return 'bg-blue-50'
    if (s === 'Paid'      || s === 1) return 'bg-green-50'
    if (s === 'Cancelled' || s === 2) return 'bg-red-50'
    return 'bg-orange-50'
  }

  function statusIconColor(s?: string | number) {
    if (s === 'Pending'   || s === 0) return 'text-blue-500'
    if (s === 'Paid'      || s === 1) return 'text-green-500'
    if (s === 'Cancelled' || s === 2) return 'text-red-500'
    return 'text-orange-500'
  }

  function statusStripe(s?: string | number) {
    if (s === 'Pending'   || s === 0) return 'stripe-blue'
    if (s === 'Paid'      || s === 1) return 'stripe-green'
    if (s === 'Cancelled' || s === 2) return 'stripe-red'
    return 'stripe-orange'
  }

  // ── Payment ───────────────────────────────────────────
  function paymentLabel(m?: string | number) {
    if (m === 'Cash'       || m === 0) return 'نقدي'
    if (m === 'CreditCard' || m === 1) return 'بطاقة'
    if (m === 'Debt'       || m === 2) return 'دَيْن'
    if (m === 'Other'      || m === 3) return 'أخرى'
    return '—'
  }

  function paymentIcon(m?: string | number) {
    if (m === 'Cash'       || m === 0) return 'pi pi-wallet'
    if (m === 'CreditCard' || m === 1) return 'pi pi-credit-card'
    if (m === 'Debt'       || m === 2) return 'pi pi-user'
    return 'pi pi-question'
  }

  // ── Order Type ────────────────────────────────────────
  function orderTypeLabel(t?: string | number) {
    if (t === 'DineIn'   || t === 0) return 'داخلي'
    if (t === 'TakeAway' || t === 1) return 'خارجي'
    if (t === 'Delivery' || t === 2) return 'توصيل'
    return '—'
  }

  return {
    formatDate, formatTime, toDateStr, validItems,
    statusLabel, statusSeverity, statusBg, statusIconColor, statusStripe,
    paymentLabel, paymentIcon,
    orderTypeLabel,
  }
}