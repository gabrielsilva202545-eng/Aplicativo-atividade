export type StockUnit = 'UN' | 'KG' | 'M' | 'L' | 'M2' | 'M3' | 'CX' | 'PC' | 'PAR' | 'ROLO';

export interface BomItem {
  id: string;
  rawMaterialId: string;
  rawMaterialName?: string;
  rawMaterialCode?: string;
  quantityPerUnit: number;
  unit: StockUnit;
  scrapRatePercent: number; // perda técnica %
  notes?: string;
}

export interface ManufacturingStep {
  stepNumber: number;
  title: string;
  workstationId: string;
  standardTimeMinutes: number;
  instructions?: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  unit: StockUnit;
  salePrice: number;
  estimatedCost: number;
  processTimeMinutes: number; // tempo de processo padrão por unidade
  workstationId: string;
  currentStock: number;
  minStock: number;
  bom: BomItem[];
  manufacturingSteps: ManufacturingStep[];
  technicalResponsible: string;
  createdAt: string;
  updatedAt: string;
}

export interface RawMaterial {
  id: string;
  code: string;
  name: string;
  description: string;
  unit: StockUnit;
  supplierId: string;
  unitCost: number;
  currentStock: number;
  minStock: number;
  reservedStock: number;
  location: string;
  leadTimeDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  code: string;
  name: string;
  tradeName?: string;
  document: string; // CNPJ ou CPF
  email: string;
  phone: string;
  contactPerson: string;
  address: string;
  city: string;
  state: string;
  creditLimit: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  tradeName?: string;
  document: string; // CNPJ
  email: string;
  phone: string;
  contactPerson: string;
  materialsCategory: string;
  avgLeadTimeDays: number;
  address: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workstation {
  id: string;
  code: string;
  name: string;
  sector: string;
  dailyHoursAvailable: number; // horas disponíveis/dia
  activeOperatorsCount: number;
  nominalHourlyCapacity: number; // peças/hora
  efficiencyRatePercent: number; // OEE %
  status: 'operational' | 'maintenance' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName?: string;
  productCode?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productionOrderStatus: 'none' | 'generated' | 'completed';
  productionOrderId?: string | null;
}

export type OrderStatus = 'draft' | 'confirmed' | 'in_production' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName?: string;
  orderDate: string;
  deliveryDate: string;
  items: OrderItem[];
  totalAmount: number;
  paymentTerms: string;
  status: OrderStatus;
  notes?: string;
  responsibleTechnical: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductionOrderStatus = 'planned' | 'queued' | 'in_progress' | 'quality_check' | 'completed' | 'cancelled';
export type ProductionOrderPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface OpMaterialRequirement {
  rawMaterialId: string;
  rawMaterialName: string;
  rawMaterialCode: string;
  unit: StockUnit;
  requiredQuantity: number;
  unitCost: number;
  totalCost: number;
  isAvailable: boolean;
  currentStockAvailable: number;
  consumedQuantity?: number;
}

export interface OpStep {
  stepNumber: number;
  title: string;
  workstationName: string;
  standardTimeMinutes: number;
  isCompleted: boolean;
  completedAt?: string | null;
  operatorName?: string | null;
  notes?: string | null;
}

export interface ProductionOrder {
  id: string;
  code: string;
  orderId?: string | null;
  orderNumber?: string | null;
  orderItemId?: string | null;
  productId: string;
  productName: string;
  productCode: string;
  productUnit: StockUnit;
  quantityPlanned: number;
  quantityProduced: number;
  quantityScrapped: number;
  batchNumber: string;
  status: ProductionOrderStatus;
  priority: ProductionOrderPriority;
  startDate: string;
  estimatedEndDate: string;
  actualStartDate?: string | null;
  actualEndDate?: string | null;
  calculatedProcessHours: number;
  workstationId: string;
  workstationName?: string;
  materialsRequired: OpMaterialRequirement[];
  steps: OpStep[];
  notes?: string;
  technicalResponsible: string;
  completionNotes?: string | null;
  stockDeducted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySettings {
  companyName: string;
  tradeName: string;
  cnpj: string;
  ie: string;
  address: string;
  phone: string;
  email: string;
  technicalResponsibleName: string;
  technicalResponsibleRole: string;
  technicalResponsibleRegistry: string;
  standardWorkingHoursPerDay: number;
  currency: string;
}

export interface StockMovement {
  id: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'PRODUCTION_CONSUMPTION' | 'PRODUCTION_ENTRY';
  itemType: 'raw_material' | 'product';
  itemId: string;
  itemName: string;
  quantity: number;
  unit: StockUnit;
  referenceType: 'PRODUCTION_ORDER' | 'PURCHASE' | 'MANUAL';
  referenceId: string;
  technicalResponsible: string;
  notes: string;
  timestamp: string;
}

export interface DatabaseSchema {
  products: Product[];
  rawMaterials: RawMaterial[];
  clients: Client[];
  suppliers: Supplier[];
  workstations: Workstation[];
  orders: Order[];
  productionOrders: ProductionOrder[];
  stockMovements: StockMovement[];
  settings: CompanySettings;
}
