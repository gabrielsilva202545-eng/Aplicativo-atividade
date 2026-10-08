import React, { useState, useEffect } from 'react';
import {
  Product,
  RawMaterial,
  Workstation,
  Client,
  Supplier,
  Order,
  ProductionOrder,
  CompanySettings,
  StockMovement,
  ProductionOrderStatus,
  OrderItem,
} from './types/pcp.ts';
import { api } from './services/api.ts';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { ProductionOrdersView } from './components/ProductionOrdersView.tsx';
import { OrdersView } from './components/OrdersView.tsx';
import { ProductsView } from './components/ProductsView.tsx';
import { RawMaterialsView } from './components/RawMaterialsView.tsx';
import { WorkstationsView } from './components/WorkstationsView.tsx';
import { EntitiesView } from './components/EntitiesView.tsx';
import { ReportsView } from './components/ReportsView.tsx';
import { SettingsView } from './components/SettingsView.tsx';

// Modals
import { CreateOpModal } from './components/modals/CreateOpModal.tsx';
import { CompleteOpModal } from './components/modals/CompleteOpModal.tsx';
import { PrintOpModal } from './components/modals/PrintOpModal.tsx';
import { OpDetailModal } from './components/modals/OpDetailModal.tsx';
import { ProductModal } from './components/modals/ProductModal.tsx';
import { RawMaterialModal } from './components/modals/RawMaterialModal.tsx';
import { OrderModal } from './components/modals/OrderModal.tsx';
import { WorkstationModal } from './components/modals/WorkstationModal.tsx';
import { PartnerModal } from './components/modals/PartnerModal.tsx';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [workstations, setWorkstations] = useState<Workstation[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  // Modal States
  const [isCreateOpOpen, setIsCreateOpOpen] = useState(false);
  const [createOpPrefill, setCreateOpPrefill] = useState<{
    productId?: string;
    orderId?: string;
    orderItemId?: string;
    quantity?: number;
  }>({});

  const [selectedOpForComplete, setSelectedOpForComplete] = useState<ProductionOrder | null>(null);
  const [selectedOpForPrint, setSelectedOpForPrint] = useState<ProductionOrder | null>(null);
  const [selectedOpForDetail, setSelectedOpForDetail] = useState<ProductionOrder | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isWorkstationModalOpen, setIsWorkstationModalOpen] = useState(false);
  const [selectedWorkstation, setSelectedWorkstation] = useState<Workstation | null>(null);

  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [partnerType, setPartnerType] = useState<'client' | 'supplier'>('client');
  const [selectedPartner, setSelectedPartner] = useState<Client | Supplier | null>(null);

  // Initial Data Fetch
  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        fetchedSettings,
        fetchedProducts,
        fetchedMaterials,
        fetchedWorkstations,
        fetchedClients,
        fetchedSuppliers,
        fetchedOrders,
        fetchedOps,
        fetchedMovements,
      ] = await Promise.all([
        api.getSettings(),
        api.getProducts(),
        api.getRawMaterials(),
        api.getWorkstations(),
        api.getClients(),
        api.getSuppliers(),
        api.getOrders(),
        api.getProductionOrders(),
        api.getStockMovements(),
      ]);

      setSettings(fetchedSettings);
      setProducts(fetchedProducts);
      setRawMaterials(fetchedMaterials);
      setWorkstations(fetchedWorkstations);
      setClients(fetchedClients);
      setSuppliers(fetchedSuppliers);
      setOrders(fetchedOrders);
      setProductionOrders(fetchedOps);
      setStockMovements(fetchedMovements);
    } catch (err: any) {
      console.error('Failed to load initial data:', err);
      setError(err.message || 'Falha ao conectar ao servidor de banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // OP Actions
  const handleCreateOp = async (data: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await api.createProductionOrder(data);
    setProductionOrders((prev) => [created, ...prev]);
    // Refresh orders and materials to sync links
    const [fetchedOrders, fetchedMaterials] = await Promise.all([
      api.getOrders(),
      api.getRawMaterials(),
    ]);
    setOrders(fetchedOrders);
    setRawMaterials(fetchedMaterials);
  };

  const handleUpdateOpStatus = async (id: string, status: ProductionOrderStatus) => {
    const updated = await api.updateOpStatus(id, status);
    setProductionOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    if (selectedOpForDetail && selectedOpForDetail.id === id) {
      setSelectedOpForDetail(updated);
    }
  };

  const handleToggleStep = async (opId: string, stepNumber: number, isCompleted: boolean) => {
    const updated = await api.updateOpStep(opId, stepNumber, { isCompleted });
    setProductionOrders((prev) => prev.map((o) => (o.id === opId ? updated : o)));
    if (selectedOpForDetail && selectedOpForDetail.id === opId) {
      setSelectedOpForDetail(updated);
    }
  };

  const handleCompleteOp = async (payload: {
    quantityProduced: number;
    quantityScrapped: number;
    completionNotes?: string;
    technicalResponsible: string;
    deductStock?: boolean;
  }) => {
    if (!selectedOpForComplete) return;
    const completed = await api.completeProductionOrder(selectedOpForComplete.id, payload);
    setProductionOrders((prev) =>
      prev.map((o) => (o.id === selectedOpForComplete.id ? completed : o))
    );

    // Refresh inventory and products after stock deduction
    const [fetchedMaterials, fetchedProducts, fetchedMovements, fetchedOrders] = await Promise.all([
      api.getRawMaterials(),
      api.getProducts(),
      api.getStockMovements(),
      api.getOrders(),
    ]);
    setRawMaterials(fetchedMaterials);
    setProducts(fetchedProducts);
    setStockMovements(fetchedMovements);
    setOrders(fetchedOrders);
  };

  const handleDeleteOp = async (id: string) => {
    await api.deleteProductionOrder(id);
    setProductionOrders((prev) => prev.filter((o) => o.id !== id));
  };

  // Product CRUD
  const handleSaveProduct = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedProduct) {
      const updated = await api.updateProduct(selectedProduct.id, data);
      setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? updated : p)));
    } else {
      const created = await api.createProduct(data);
      setProducts((prev) => [...prev, created]);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    await api.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Raw Material CRUD
  const handleSaveMaterial = async (data: Omit<RawMaterial, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedMaterial) {
      const updated = await api.updateRawMaterial(selectedMaterial.id, data);
      setRawMaterials((prev) => prev.map((m) => (m.id === selectedMaterial.id ? updated : m)));
    } else {
      const created = await api.createRawMaterial(data);
      setRawMaterials((prev) => [...prev, created]);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    await api.deleteRawMaterial(id);
    setRawMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  // Order CRUD
  const handleSaveOrder = async (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedOrder) {
      const updated = await api.updateOrder(selectedOrder.id, data);
      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? updated : o)));
    } else {
      const created = await api.createOrder(data);
      setOrders((prev) => [created, ...prev]);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    await api.deleteOrder(id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  // Workstation CRUD
  const handleSaveWorkstation = async (data: Omit<Workstation, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedWorkstation) {
      const updated = await api.updateWorkstation(selectedWorkstation.id, data);
      setWorkstations((prev) => prev.map((w) => (w.id === selectedWorkstation.id ? updated : w)));
    } else {
      const created = await api.createWorkstation(data);
      setWorkstations((prev) => [...prev, created]);
    }
  };

  const handleDeleteWorkstation = async (id: string) => {
    await api.deleteWorkstation(id);
    setWorkstations((prev) => prev.filter((w) => w.id !== id));
  };

  // Client & Supplier CRUD
  const handleSaveClient = async (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedPartner && partnerType === 'client') {
      const updated = await api.updateClient(selectedPartner.id, data);
      setClients((prev) => prev.map((c) => (c.id === selectedPartner.id ? updated : c)));
    } else {
      const created = await api.createClient(data);
      setClients((prev) => [...prev, created]);
    }
  };

  const handleDeleteClient = async (id: string) => {
    await api.deleteClient(id);
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSaveSupplier = async (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedPartner && partnerType === 'supplier') {
      const updated = await api.updateSupplier(selectedPartner.id, data);
      setSuppliers((prev) => prev.map((s) => (s.id === selectedPartner.id ? updated : s)));
    } else {
      const created = await api.createSupplier(data);
      setSuppliers((prev) => [...prev, created]);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    await api.deleteSupplier(id);
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  // Settings & Reset
  const handleSaveSettings = async (newSettings: CompanySettings) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
  };

  const handleResetDatabase = async () => {
    await api.resetDatabase();
    await loadAllData();
  };

  // Contextual Trigger: Emit OP from Order Item
  const handleEmitOpFromOrder = (order: Order, item: OrderItem) => {
    setCreateOpPrefill({
      productId: item.productId,
      orderId: order.id,
      orderItemId: item.id,
      quantity: item.quantity,
    });
    setIsCreateOpOpen(true);
  };

  // Contextual Trigger: Emit OP from Product
  const handleEmitOpForProduct = (product: Product) => {
    setCreateOpPrefill({
      productId: product.id,
      quantity: 10,
    });
    setIsCreateOpOpen(true);
  };

  // Calculated Counts
  const activeOpsCount = productionOrders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  ).length;
  const lowStockCount = rawMaterials.filter((m) => m.currentStock <= m.minStock).length;
  const activeOrdersCount = orders.filter((o) => ['confirmed', 'in_production'].includes(o.status)).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <div className="text-sm font-semibold text-slate-800">Carregando PCP Master...</div>
        <div className="text-xs text-slate-500 mt-1">Conectando ao banco de dados industrial</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Header */}
      <Header
        currentView={currentView}
        settings={settings}
        lowStockCount={lowStockCount}
        onOpenCreateOp={() => {
          setCreateOpPrefill({});
          setIsCreateOpOpen(true);
        }}
        onSelectView={setCurrentView}
      />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          activeOpsCount={activeOpsCount}
          ordersCount={activeOrdersCount}
          lowStockCount={lowStockCount}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {error && (
            <div className="mb-4 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
              <strong>Erro:</strong> {error}
            </div>
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              productionOrders={productionOrders}
              rawMaterials={rawMaterials}
              workstations={workstations}
              orders={orders}
              stockMovements={stockMovements}
              settings={settings}
              onOpenCreateOp={() => {
                setCreateOpPrefill({});
                setIsCreateOpOpen(true);
              }}
              onSelectView={setCurrentView}
              onSelectOpForDetail={(op) => setSelectedOpForDetail(op)}
            />
          )}

          {currentView === 'kanban' && (
            <ProductionOrdersView
              productionOrders={productionOrders}
              onUpdateStatus={handleUpdateOpStatus}
              onOpenCreateOp={() => {
                setCreateOpPrefill({});
                setIsCreateOpOpen(true);
              }}
              onOpenCompleteOp={(op) => setSelectedOpForComplete(op)}
              onOpenPrintOp={(op) => setSelectedOpForPrint(op)}
              onDeleteOp={handleDeleteOp}
              onToggleStep={handleToggleStep}
              onSelectOp={(op) => setSelectedOpForDetail(op)}
            />
          )}

          {currentView === 'orders' && (
            <OrdersView
              orders={orders}
              clients={clients}
              products={products}
              onOpenCreateOrder={() => {
                setSelectedOrder(null);
                setIsOrderModalOpen(true);
              }}
              onEditOrder={(order) => {
                setSelectedOrder(order);
                setIsOrderModalOpen(true);
              }}
              onDeleteOrder={handleDeleteOrder}
              onEmitOpFromOrder={handleEmitOpFromOrder}
            />
          )}

          {currentView === 'products' && (
            <ProductsView
              products={products}
              rawMaterials={rawMaterials}
              workstations={workstations}
              onOpenCreateProduct={() => {
                setSelectedProduct(null);
                setIsProductModalOpen(true);
              }}
              onEditProduct={(p) => {
                setSelectedProduct(p);
                setIsProductModalOpen(true);
              }}
              onDeleteProduct={handleDeleteProduct}
              onEmitOpForProduct={handleEmitOpForProduct}
            />
          )}

          {currentView === 'materials' && (
            <RawMaterialsView
              rawMaterials={rawMaterials}
              suppliers={suppliers}
              onOpenCreateMaterial={() => {
                setSelectedMaterial(null);
                setIsMaterialModalOpen(true);
              }}
              onEditMaterial={(m) => {
                setSelectedMaterial(m);
                setIsMaterialModalOpen(true);
              }}
              onDeleteMaterial={handleDeleteMaterial}
            />
          )}

          {currentView === 'workstations' && (
            <WorkstationsView
              workstations={workstations}
              productionOrders={productionOrders}
              onOpenCreateWorkstation={() => {
                setSelectedWorkstation(null);
                setIsWorkstationModalOpen(true);
              }}
              onEditWorkstation={(w) => {
                setSelectedWorkstation(w);
                setIsWorkstationModalOpen(true);
              }}
              onDeleteWorkstation={handleDeleteWorkstation}
            />
          )}

          {currentView === 'entities' && (
            <EntitiesView
              clients={clients}
              suppliers={suppliers}
              onOpenCreateClient={() => {
                setPartnerType('client');
                setSelectedPartner(null);
                setIsPartnerModalOpen(true);
              }}
              onEditClient={(client) => {
                setPartnerType('client');
                setSelectedPartner(client);
                setIsPartnerModalOpen(true);
              }}
              onDeleteClient={handleDeleteClient}
              onOpenCreateSupplier={() => {
                setPartnerType('supplier');
                setSelectedPartner(null);
                setIsPartnerModalOpen(true);
              }}
              onEditSupplier={(supplier) => {
                setPartnerType('supplier');
                setSelectedPartner(supplier);
                setIsPartnerModalOpen(true);
              }}
              onDeleteSupplier={handleDeleteSupplier}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView
              productionOrders={productionOrders}
              rawMaterials={rawMaterials}
              products={products}
              settings={settings}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onResetDatabase={handleResetDatabase}
            />
          )}
        </main>
      </div>

      {/* Operation Modals */}
      <CreateOpModal
        isOpen={isCreateOpOpen}
        onClose={() => setIsCreateOpOpen(false)}
        products={products}
        rawMaterials={rawMaterials}
        workstations={workstations}
        orders={orders}
        settings={settings}
        initialProductId={createOpPrefill.productId}
        initialOrderId={createOpPrefill.orderId}
        initialOrderItemId={createOpPrefill.orderItemId}
        initialQuantity={createOpPrefill.quantity}
        onSubmit={handleCreateOp}
      />

      <CompleteOpModal
        isOpen={!!selectedOpForComplete}
        onClose={() => setSelectedOpForComplete(null)}
        op={selectedOpForComplete}
        settings={settings}
        onComplete={handleCompleteOp}
      />

      <PrintOpModal
        isOpen={!!selectedOpForPrint}
        onClose={() => setSelectedOpForPrint(null)}
        op={selectedOpForPrint}
        settings={settings}
      />

      <OpDetailModal
        isOpen={!!selectedOpForDetail}
        onClose={() => setSelectedOpForDetail(null)}
        op={selectedOpForDetail}
        settings={settings}
        onOpenPrint={(op) => setSelectedOpForPrint(op)}
        onOpenComplete={(op) => setSelectedOpForComplete(op)}
        onToggleStep={handleToggleStep}
      />

      {/* Entity Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        rawMaterials={rawMaterials}
        workstations={workstations}
        settings={settings}
        onSave={handleSaveProduct}
      />

      <RawMaterialModal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        material={selectedMaterial}
        suppliers={suppliers}
        onSave={handleSaveMaterial}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        order={selectedOrder}
        clients={clients}
        products={products}
        onSave={handleSaveOrder}
      />

      <WorkstationModal
        isOpen={isWorkstationModalOpen}
        onClose={() => setIsWorkstationModalOpen(false)}
        workstation={selectedWorkstation}
        onSave={handleSaveWorkstation}
      />

      <PartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        type={partnerType}
        data={selectedPartner}
        onSaveClient={handleSaveClient}
        onSaveSupplier={handleSaveSupplier}
      />
    </div>
  );
}
