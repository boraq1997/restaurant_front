export interface AdminTable {
  id: number
  name: string
  number: number
  capacity: number
  floorId: number
  status: number
  isActive: boolean
  qrToken: string
  primaryTableId?: number | null
}

export interface Floor {
  id: number
  name: string
  isActive: boolean
  discription?: string
  tableCount: number
  tables: AdminTable[]
}

export interface CreateTableDto {
  name: string
  number: number
  capacity: number
  floorId: number
}

export interface EditTableDto {
  name: string
  number: number
  capacity: number
  floorId: number
}

export interface CreateFloorDto {
  name: string
  description?: string
  isActive: boolean
}

export interface EditFloorDto {
  name: string
  description?: string
  isActive: boolean
}