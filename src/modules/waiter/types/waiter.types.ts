// ── الأنواع القادمة من الـ API ──────────────────────────

export type TableStatus = 0 | 1 | 2 | 3
// 0 = Available | 1 = Occupied | 2 = Reserved | 3 = Merged

export interface ApiTable {
  id: number
  number: number
  capacity: number
  status: TableStatus
  floorId: number
  primaryTableId: number | null
}

// ── الأنواع المستخدمة في الـ UI ─────────────────────────

export type TableStatusUI = 'available' | 'occupied' | 'reserved' | 'merged'

export type TableAlert = 'confirm_order' | 'new_order' | 'need_waiter'

export interface Table {
  id: number
  number: number
  capacity: number
  status: TableStatusUI
  floorId: number
  alerts: TableAlert[]
}

// تحويل status رقم → نص
export function mapStatus(s: TableStatus): TableStatusUI {
  switch (s) {
    case 0: return 'available'
    case 1: return 'occupied'
    case 2: return 'reserved'
    case 3: return 'merged'
    default: return 'available'
  }
}

// تحويل ApiTable → Table
export function mapTable(t: ApiTable): Table {
  return {
    id:       t.id,
    number:   t.number,
    capacity: t.capacity,
    status:   mapStatus(t.status),
    floorId:  t.floorId,
    alerts:   [],
  }
}