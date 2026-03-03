export enum TableStatus {
  Available = 0,  // متاحة
  Occupied  = 1,  // مشغولة
  Reserved  = 2,  // محجوزة
  Waiting   = 3,  // في انتظار الطلب
}

export enum InvoiceStatus {
  Open   = 0,  // مفتوحة
  Sent   = 1,  // أُرسلت للمطبخ
  Ready  = 2,  // جاهزة
  Closed = 3,  // مدفوعة
}

export enum OrderTypes {
  DineIn   = 0,
  TakeAway = 1,
  Delivery = 2,
}

export enum PaymentMethod {
  Cash   = 0,
  Card   = 1,
  Online = 2,
  Other  = 3,
}

export enum DiscountType {
  Percentage = 0,
  Fixed      = 1,
}

export enum TransactionType {
  In   = 0,
  Out  = 1,
  Sale = 2,
}