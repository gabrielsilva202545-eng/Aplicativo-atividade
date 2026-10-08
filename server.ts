import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Database } from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const db = Database.getInstance();

app.use(express.json());

// API Routes

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Settings (Empresa e Responsável Técnico)
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(db.getSettings());
});

app.put('/api/settings', (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Products (Produtos e Ficha Técnica / BOM)
app.get('/api/products', (_req: Request, res: Response) => {
  res.json(db.getProducts());
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
});

app.post('/api/products', (req: Request, res: Response) => {
  try {
    const newProduct = db.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json({ success: true });
});

// Raw Materials (Matérias-Primas)
app.get('/api/raw-materials', (_req: Request, res: Response) => {
  res.json(db.getRawMaterials());
});

app.post('/api/raw-materials', (req: Request, res: Response) => {
  try {
    const created = db.createRawMaterial(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/raw-materials/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateRawMaterial(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Matéria-prima não encontrada' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/raw-materials/:id', (req: Request, res: Response) => {
  const success = db.deleteRawMaterial(req.params.id);
  if (!success) return res.status(404).json({ error: 'Matéria-prima não encontrada' });
  res.json({ success: true });
});

// Clients (Clientes)
app.get('/api/clients', (_req: Request, res: Response) => {
  res.json(db.getClients());
});

app.post('/api/clients', (req: Request, res: Response) => {
  try {
    const created = db.createClient(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/clients/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateClient(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/clients/:id', (req: Request, res: Response) => {
  const success = db.deleteClient(req.params.id);
  if (!success) return res.status(404).json({ error: 'Cliente não encontrado' });
  res.json({ success: true });
});

// Suppliers (Fornecedores)
app.get('/api/suppliers', (_req: Request, res: Response) => {
  res.json(db.getSuppliers());
});

app.post('/api/suppliers', (req: Request, res: Response) => {
  try {
    const created = db.createSupplier(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/suppliers/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateSupplier(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/suppliers/:id', (req: Request, res: Response) => {
  const success = db.deleteSupplier(req.params.id);
  if (!success) return res.status(404).json({ error: 'Fornecedor não encontrado' });
  res.json({ success: true });
});

// Workstations (Capacidade Produtiva)
app.get('/api/workstations', (_req: Request, res: Response) => {
  res.json(db.getWorkstations());
});

app.post('/api/workstations', (req: Request, res: Response) => {
  try {
    const created = db.createWorkstation(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/workstations/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateWorkstation(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Posto de trabalho não encontrado' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/workstations/:id', (req: Request, res: Response) => {
  const success = db.deleteWorkstation(req.params.id);
  if (!success) return res.status(404).json({ error: 'Posto de trabalho não encontrado' });
  res.json({ success: true });
});

// Orders (Pedidos)
app.get('/api/orders', (_req: Request, res: Response) => {
  res.json(db.getOrders());
});

app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const created = db.createOrder(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/orders/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateOrder(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/orders/:id', (req: Request, res: Response) => {
  const success = db.deleteOrder(req.params.id);
  if (!success) return res.status(404).json({ error: 'Pedido não encontrado' });
  res.json({ success: true });
});

// Production Orders (Ordens de Produção - OP)
app.get('/api/production-orders', (_req: Request, res: Response) => {
  res.json(db.getProductionOrders());
});

app.get('/api/production-orders/:id', (req: Request, res: Response) => {
  const op = db.getProductionOrderById(req.params.id);
  if (!op) return res.status(404).json({ error: 'Ordem de produção não encontrada' });
  res.json(op);
});

app.post('/api/production-orders', (req: Request, res: Response) => {
  try {
    const created = db.createProductionOrder(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/production-orders/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateProductionOrder(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Ordem de produção não encontrada' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/production-orders/:id', (req: Request, res: Response) => {
  const success = db.deleteProductionOrder(req.params.id);
  if (!success) return res.status(404).json({ error: 'Ordem de produção não encontrada' });
  res.json({ success: true });
});

// Update OP Status (Kanban drag or click)
app.patch('/api/production-orders/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const op = db.getProductionOrderById(req.params.id);
    if (!op) return res.status(404).json({ error: 'Ordem de produção não encontrada' });

    const updates: any = { status };
    if (status === 'in_progress' && !op.actualStartDate) {
      updates.actualStartDate = new Date().toISOString();
    }
    const updated = db.updateProductionOrder(req.params.id, updates);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Toggle or update Step completion in OP
app.patch('/api/production-orders/:id/step/:stepNumber', (req: Request, res: Response) => {
  try {
    const stepNumber = Number(req.params.stepNumber);
    const { isCompleted, operatorName, notes } = req.body;
    const op = db.getProductionOrderById(req.params.id);
    if (!op) return res.status(404).json({ error: 'Ordem de produção não encontrada' });

    const step = op.steps.find((s) => s.stepNumber === stepNumber);
    if (!step) return res.status(404).json({ error: 'Etapa não encontrada' });

    step.isCompleted = isCompleted;
    step.completedAt = isCompleted ? new Date().toISOString() : null;
    if (operatorName !== undefined) step.operatorName = operatorName;
    if (notes !== undefined) step.notes = notes;

    db.save();
    res.json(op);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Baixa / Conclusão de Ordem de Produção (com abate de estoque e produto acabado)
app.post('/api/production-orders/:id/complete', (req: Request, res: Response) => {
  try {
    const result = db.completeProductionOrder(req.params.id, req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result.productionOrder);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Stock Movements
app.get('/api/stock-movements', (_req: Request, res: Response) => {
  res.json(db.getStockMovements());
});

// Production & PCP KPI Summary
app.get('/api/reports/summary', (_req: Request, res: Response) => {
  try {
    const data = db.getData();
    const ops = data.productionOrders;
    const products = data.products;
    const rawMaterials = data.rawMaterials;
    const workstations = data.workstations;
    const orders = data.orders;

    // Status breakdown
    const opsByStatus = {
      planned: ops.filter((o) => o.status === 'planned').length,
      queued: ops.filter((o) => o.status === 'queued').length,
      in_progress: ops.filter((o) => o.status === 'in_progress').length,
      quality_check: ops.filter((o) => o.status === 'quality_check').length,
      completed: ops.filter((o) => o.status === 'completed').length,
      cancelled: ops.filter((o) => o.status === 'cancelled').length,
    };

    // Material alerts (estoque baixo)
    const lowStockMaterials = rawMaterials.filter((m) => m.currentStock <= m.minStock);

    // Total produced units and scrap rate
    const totalProduced = ops.reduce((acc, o) => acc + (o.quantityProduced || 0), 0);
    const totalScrapped = ops.reduce((acc, o) => acc + (o.quantityScrapped || 0), 0);
    const scrapRate = totalProduced + totalScrapped > 0 ? (totalScrapped / (totalProduced + totalScrapped)) * 100 : 0;

    // Active production hours
    const activeProductionHours = ops
      .filter((o) => ['in_progress', 'quality_check', 'queued'].includes(o.status))
      .reduce((acc, o) => acc + (o.calculatedProcessHours || 0), 0);

    // Total daily capacity in hours across operational workstations
    const totalDailyCapacityHours = workstations
      .filter((w) => w.status === 'operational')
      .reduce((acc, w) => acc + w.dailyHoursAvailable, 0);

    // Workstation load analysis
    const workstationLoads = workstations.map((w) => {
      const assignedOps = ops.filter(
        (o) => o.workstationId === w.id && ['in_progress', 'queued', 'quality_check'].includes(o.status)
      );
      const assignedHours = assignedOps.reduce((acc, o) => acc + (o.calculatedProcessHours || 0), 0);
      const weeklyCapacityHours = w.dailyHoursAvailable * 5; // 5 dias úteis
      const loadPercentage = weeklyCapacityHours > 0 ? Math.round((assignedHours / weeklyCapacityHours) * 100) : 0;
      return {
        workstationId: w.id,
        workstationName: w.name,
        sector: w.sector,
        assignedHours,
        weeklyCapacityHours,
        loadPercentage,
        activeOpsCount: assignedOps.length,
      };
    });

    res.json({
      opsCount: ops.length,
      opsByStatus,
      lowStockMaterialsCount: lowStockMaterials.length,
      lowStockMaterials,
      totalProduced,
      totalScrapped,
      scrapRate: Number(scrapRate.toFixed(1)),
      activeProductionHours: Number(activeProductionHours.toFixed(1)),
      totalDailyCapacityHours,
      workstationLoads,
      activeOrdersCount: orders.filter((o) => ['confirmed', 'in_production'].includes(o.status)).length,
      productsCount: products.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Database Export & Reset
app.get('/api/database/export', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="pcp-database-backup.json"');
  res.send(JSON.stringify(db.getData(), null, 2));
});

app.post('/api/database/reset', (_req: Request, res: Response) => {
  const resetData = db.resetToDefault();
  res.json({ success: true, message: 'Banco de dados restaurado com sucesso!', data: resetData });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PCP Master server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
