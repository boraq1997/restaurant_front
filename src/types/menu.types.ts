export interface MenuItemSize {
  id: number
  name: string
  price: number
}

export interface MenuItemExtra {
  id: number
  name: string
  price: number
}

export interface MenuItemRemovable {
  id: number
  name: string
}

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  categoryId: number
  available: boolean
  sizes?: MenuItemSize[]
  extras?: MenuItemExtra[]
  removable?: MenuItemRemovable[]
}

export interface MenuItemOption {
  id: number
  name: string
  price: number
}

export interface MenuCategory {
  id: number
  name: string
  icon: string
}

// الكمية لكل extra في السلة
export interface CartItemExtra {
  extra: MenuItemExtra
  quantity: number
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  selectedSize?: MenuItemSize
  selectedExtras?: CartItemExtra[]
  removedItems?: MenuItemRemovable[]
  note?: string
}

// لمقبلات الطاولة
export interface PlatterChoice {
  menuItem: MenuItem
  quantity: number
}

export interface PlatterItem {
  menuItem: MenuItem
  quantity: number
  selectedSize?: MenuItemSize
  choices?: PlatterChoice[]
  note?: string
}

export interface Order {
  tableId: number
  items: CartItem[]
  totalPrice: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready'
}