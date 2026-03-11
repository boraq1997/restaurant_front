export interface Printer {
  id: number
  name: string
  ipAddress?: string | null
  port?: number | null
  location?: string | null
  description?: string | null
}

export interface CreatePrinterRequest {
  name: string
  ipAddress?: string
  port?: number
  location?: string
  description?: string
}

export interface UpdatePrinterRequest {
  id: number
  name: string
  ipAddress?: string
  port?: number
  location?: string
  description?: string
}

export interface PrinterDiscovery {
  machineName: string
  printerNames: string[]
}