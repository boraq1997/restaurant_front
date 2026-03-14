// src/modules/waiter/types/waiter.types.ts

export type TableStatus = 0 | 1 | 2 | 3
// 0 = Available | 1 = Occupied | 2 = Reserved | 3 = Merged

export interface ApiTable {
  id:             number
  number:         number
  capacity:       number
  status:         TableStatus
  floorId:        number
  primaryTableId: number | null
  mergedTables:   { id: number; name: string; number: number; capacity: number }[]
}

export type TableStatusUI = 'available' | 'occupied' | 'reserved' | 'merged'

export type TableAlert = 'confirm_order' | 'new_order' | 'need_waiter'

export interface MergedTableInfo {
  id:       number
  name:     string
  number:   number
  capacity: number
}

export interface Table {
  id:             number
  number:         number
  capacity:       number
  status:         TableStatusUI
  floorId:        number
  primaryTableId: number | null
  mergedTables:   MergedTableInfo[]  // الطاولات المدمجة مع هذه الطاولة
  alerts:         TableAlert[]
  name?:          string
  reservation?:   {
    guestName:  string
    time:       string
    date:       string
    guestCount: number
  } | null
}

export function mapStatus(s: TableStatus | string): TableStatusUI {
  const v = typeof s === 'string' ? s.toLowerCase() : s
  switch (v) {
    case 'occupied': case 1: return 'occupied'
    case 'reserved': case 2: return 'reserved'
    case 'merged':   case 3: return 'merged'
    default:                  return 'available'
  }
}

export function mapTable(t: ApiTable): Table {
  return {
    id:             t.id,
    number:         t.number,
    capacity:       t.capacity,
    status:         mapStatus(t.status),
    floorId:        t.floorId,
    primaryTableId: t.primaryTableId,
    mergedTables:   t.mergedTables ?? [],
    alerts:         [],
  }
}