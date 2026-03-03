export interface MenuCategory {
  id: number
  name: string
  image?: string
  isActive: boolean
  printerId?: number | null
  items?: MenuItem[]
}

export interface MenuItem {
  id: number
  name: string
  description?: string
  price: number
  cost?: number
  isAvailable: boolean
  categoryId: number
  specificPrinterId?: number
  options?: MenuOption[]
}

export interface MenuOption {
  id: number
  name: string
  price: number
}

// Cart (للاستخدام في الواجهة فقط)
export interface CartItem {
  menuItem: MenuItem
  quantity: number
  notes?: string
  selectedOptions: MenuOption[]
}

// DTOs
export interface CreateCategoryDto {
  name: string
  image?: string
  isActive: boolean
  printerId?: number | null
}

export interface CreateMenuItemDto {
  name: string
  description?: string
  price: number
  cost?: number
  specificPrinterId: number
  categoryId: number
  isAvailable: boolean
}

export interface CreateMenuOptionDto {
  name: string
  price: number
}