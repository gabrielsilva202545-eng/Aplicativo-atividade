import {
  Product,
  RawMaterial,
  Client,
  Supplier,
  Workstation,
  Order,
  ProductionOrder,
  CompanySettings,
  StockMovement,
  DatabaseSchema,
} from '../types/pcp.ts';

const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errMsg = `Erro na requisição (${response.status})`;
    try {
      const errObj = await response.json();
      if (errObj.error) errMsg = errObj.error;
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }

  return response.json();
}

export const api = {
  // Settings
  getSettings: () => request<CompanySettings>('/settings'),
  updateSettings: (data: Partial<CompanySettings>) =>
    request<CompanySettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Products
  getProducts: () => request<Product[]>('/products'),
  getProduct: (id: string) => request<Product>(`/products/${id}`),
  createProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProduct: (id: string, data: Partial<Product>) =>
    request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProduct: (id: string) =>
    request<{ success: boolean }>(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Raw Materials
  getRawMaterials: () => request<RawMaterial[]>('/raw-materials'),
  createRawMaterial: (data: Omit<RawMaterial, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<RawMaterial>('/raw-materials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateRawMaterial: (id: string, data: Partial<RawMaterial>) =>
    request<RawMaterial>(`/raw-materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteRawMaterial: (id: string) =>
    request<{ success: boolean }>(`/raw-materials/${id}`, {
      method: 'DELETE',
    }),

  // Clients
  getClients: () => request<Client[]>('/clients'),
  createClient: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateClient: (id: string, data: Partial<Client>) =>
    request<Client>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteClient: (id: string) =>
    request<{ success: boolean }>(`/clients/${id}`, {
      method: 'DELETE',
    }),

  // Suppliers
  getSuppliers: () => request<Supplier[]>('/suppliers'),
  createSupplier: (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<Supplier>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSupplier: (id: string, data: Partial<Supplier>) =>
    request<Supplier>(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteSupplier: (id: string) =>
    request<{ success: boolean }>(`/suppliers/${id}`, {
      method: 'DELETE',
    }),

  // Workstations
  getWorkstations: () => request<Workstation[]>('/workstations'),
  createWorkstation: (data: Omit<Workstation, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<Workstation>('/workstations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateWorkstation: (id: string, data: Partial<Workstation>) =>
    request<Workstation>(`/workstations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteWorkstation: (id: string) =>
    request<{ success: boolean }>(`/workstations/${id}`, {
      method: 'DELETE',
    }),

  // Orders
  getOrders: () => request<Order[]>('/orders'),
  createOrder: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateOrder: (id: string, data: Partial<Order>) =>
    request<Order>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteOrder: (id: string) =>
    request<{ success: boolean }>(`/orders/${id}`, {
      method: 'DELETE',
    }),

  // Production Orders
  getProductionOrders: () => request<ProductionOrder[]>('/production-orders'),
  getProductionOrder: (id: string) => request<ProductionOrder>(`/production-orders/${id}`),
  createProductionOrder: (data: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<ProductionOrder>('/production-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProductionOrder: (id: string, data: Partial<ProductionOrder>) =>
    request<ProductionOrder>(`/production-orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProductionOrder: (id: string) =>
    request<{ success: boolean }>(`/production-orders/${id}`, {
      method: 'DELETE',
    }),
  updateOpStatus: (id: string, status: ProductionOrder['status']) =>
    request<ProductionOrder>(`/production-orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  updateOpStep: (
    id: string,
    stepNumber: number,
    payload: { isCompleted: boolean; operatorName?: string; notes?: string }
  ) =>
    request<ProductionOrder>(`/production-orders/${id}/step/${stepNumber}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  completeProductionOrder: (
    id: string,
    payload: {
      quantityProduced: number;
      quantityScrapped: number;
      completionNotes?: string;
      technicalResponsible: string;
      deductStock?: boolean;
    }
  ) =>
    request<ProductionOrder>(`/production-orders/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Stock Movements
  getStockMovements: () => request<StockMovement[]>('/stock-movements'),

  // Summary KPIs
  getReportsSummary: () =>
    request<{
      opsCount: number;
      opsByStatus: Record<string, number>;
      lowStockMaterialsCount: number;
      lowStockMaterials: RawMaterial[];
      totalProduced: number;
      totalScrapped: number;
      scrapRate: number;
      activeProductionHours: number;
      totalDailyCapacityHours: number;
      workstationLoads: Array<{
        workstationId: string;
        workstationName: string;
        sector: string;
        assignedHours: number;
        weeklyCapacityHours: number;
        loadPercentage: number;
        activeOpsCount: number;
      }>;
      activeOrdersCount: number;
      productsCount: number;
    }>('/reports/summary'),

  // Database tools
  resetDatabase: () =>
    request<{ success: boolean; message: string; data: DatabaseSchema }>('/database/reset', {
      method: 'POST',
    }),
};
