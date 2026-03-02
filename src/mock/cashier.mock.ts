// src/mock/cashier.mock.ts

import type { CashierTable, CashierOrder } from '../modules/cashier/types/cashier.types'

export const cashierOrders: CashierOrder[] = [
  {
    id: 1,
    tableId: 1,
    items: [
      {
        menuItem: {
          id: 7,
          name: 'برغر كلاسيك',
          description: 'لحم بقري طازج 200 غرام مع جبن شيدر',
          price: 9000,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
          categoryId: 3,
          available: true,
        },
        quantity: 2,
        selectedSize: { id: 2, name: 'دبل', price: 3000 },
        selectedExtras: [
          { extra: { id: 10, name: 'جبن إضافي', price: 1000 }, quantity: 1 },
          { extra: { id: 11, name: 'بيض مقلي', price: 1000 }, quantity: 1 },
        ],
        removedItems: [
          { id: 3, name: 'بصل' },
          { id: 4, name: 'مخلل' },
        ],
        note: 'اللحم متوسط النضج وليس كامل النضج',
      },
      {
        menuItem: {
          id: 1,
          name: 'قهوة عربية',
          description: 'قهوة عربية أصيلة محضرة بالهيل والزعفران',
          price: 3000,
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop',
          categoryId: 1,
          available: true,
        },
        quantity: 2,
        selectedSize: { id: 2, name: 'وسط', price: 500 },
        selectedExtras: [
          { extra: { id: 2, name: 'زعفران إضافي', price: 500 }, quantity: 1 },
        ],
        note: 'بدون سكر',
      },
    ],
    totalPrice: 25000,
    createdAt: '2026-03-01T20:00:00',
    paymentStatus: 'unpaid',
  },
  {
    id: 2,
    tableId: 3,
    items: [
      {
        menuItem: {
          id: 8,
          name: 'دجاج مشوي',
          description: 'دجاج متبل بالأعشاب والثوم مشوي على الفحم',
          price: 11000,
          image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c1?w=400&h=400&fit=crop',
          categoryId: 3,
          available: true,
        },
        quantity: 1,
        selectedExtras: [
          { extra: { id: 13, name: 'صوص ثوم', price: 500 }, quantity: 2 },
          { extra: { id: 14, name: 'أرز إضافي', price: 1500 }, quantity: 1 },
        ],
        removedItems: [
          { id: 5, name: 'سلطة' },
        ],
      },
      {
        menuItem: {
          id: 5,
          name: 'ليموناضة',
          description: 'ليموناضة منعشة بالنعناع الطازج',
          price: 3500,
          image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop',
          categoryId: 2,
          available: true,
        },
        quantity: 2,
        note: 'ثلج قليل',
      },
    ],
    totalPrice: 18000,
    createdAt: '2026-03-01T19:30:00',
    paymentStatus: 'unpaid',
  },
  {
    id: 3,
    tableId: 5,
    items: [
      {
        menuItem: {
          id: 12,
          name: 'تشيز كيك',
          description: 'تشيز كيك كريمي بقاعدة البسكويت',
          price: 6000,
          image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
          categoryId: 5,
          available: true,
        },
        quantity: 3,
        selectedExtras: [
          { extra: { id: 20, name: 'آيس كريم', price: 1500 }, quantity: 3 },
        ],
      },
      {
        menuItem: {
          id: 3,
          name: 'أمريكانو',
          description: 'إسبريسو مزدوج مع ماء ساخن',
          price: 3500,
          image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=400&fit=crop',
          categoryId: 1,
          available: true,
        },
        quantity: 3,
        selectedSize: { id: 2, name: 'وسط', price: 500 },
      },
    ],
    totalPrice: 30000,
    createdAt: '2026-03-01T18:45:00',
    paymentStatus: 'paid',
    paymentMethod: 'cash',
  },
]

export const cashierTables: CashierTable[] = [
  {
    id: 1,
    name: 'طاولة النافذة',
    number: 1,
    capacity: 4,
    paymentStatus: 'unpaid',
    order: cashierOrders[0],
  },
  {
    id: 2,
    name: 'طاولة الزاوية',
    number: 2,
    capacity: 2,
    paymentStatus: 'unpaid',
    order: null,
  },
  {
    id: 3,
    name: 'طاولة الوسط',
    number: 3,
    capacity: 6,
    paymentStatus: 'unpaid',
    order: cashierOrders[1],
  },
  {
    id: 4,
    name: 'طاولة الحديقة',
    number: 4,
    capacity: 4,
    paymentStatus: 'unpaid',
    order: null,
  },
  {
    id: 5,
    name: 'طاولة VIP',
    number: 5,
    capacity: 15,
    paymentStatus: 'paid',
    order: cashierOrders[2],
  },
]