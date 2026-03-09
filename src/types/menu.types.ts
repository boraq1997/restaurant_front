export interface MenuCategory {
  id: number
  name: string
  image?: string
  isActive: boolean
  printerId?: number | null
  menuItems?: MenuItem[]
}

export interface MenuItem {
  id: number
  name: string
  image: string
  description?: string
  price: number
  cost?: number
  isAvailable: boolean
  categoryId: number
  specificPrinterId?: number
  menuOptions?: MenuOption[]
}

export interface MenuOption {
  id: number
  name: string
  price: number
  description?: string
  imageUrl?: string
  isAvailable?: boolean
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
  description?: string
  imageUrl?: string
  isAvailable: boolean
  menuItemIds?: number[]
}