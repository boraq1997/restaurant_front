import type { Table } from '../modules/waiter/types/waiter.types'

export const tables: Table[] = [
  { 
    id: 1, 
    name: 'طاولة النافذة', 
    number: 1, 
    capacity: 4, 
    status: 'occupied',
    reservation: null,
    alerts: ['confirm_order', 'need_waiter']
  },
  { 
    id: 2, 
    name: 'طاولة الزاوية', 
    number: 2, 
    capacity: 2, 
    status: 'available',
    reservation: null,
    alerts: []
  },
  { 
    id: 3, 
    name: 'طاولة الوسط', 
    number: 3, 
    capacity: 6, 
    status: 'occupied',
    reservation: {
      guestName: 'أحمد العلي',
      time: '22:00',
      date: '2026-02-25',
      guestCount: 4
    },
    alerts: ['new_order']
  },
  {
    id: 4,
    name: 'طاولة الحديقة', 
    number: 4,
    capacity: 4,
    status: 'reserved',
    reservation: {
      guestName: 'سارة محمد',
      time: '21:00',
      date: '2026-02-25',
      guestCount: 2
    },
    alerts: []
  },
  { 
    id: 5, 
    name: 'طاولة VIP', 
    number: 5, 
    capacity: 15, 
    status: 'available',
    reservation: null,
    alerts: []
  },
]