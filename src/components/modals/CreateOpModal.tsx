import React, { useState, useEffect } from 'react';
import {
  Product,
  RawMaterial,
  Workstation,
  Order,
  CompanySettings,
  ProductionOrder,
  OpMaterialRequirement,
} from '../../types/pcp.ts';
import {
  X,
  Play,
  Layers,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface CreateOpModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  rawMaterials: RawMaterial[];
  workstations: Workstation[];
  orders: Order[];
  settings: CompanySettings | null;
  initialProductId?: string;
  initialOrderId?: string;
  initialOrderItemId?: string;
  initialQuantity?: number;
  onSubmit: (data: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const CreateOpModal: React.FC<CreateOpModalProps> = ({
  isOpen,
  onClose,
  products,
  rawMaterials,
  workstations,
  orders,
  settings,
  initialProductId,
  initialOrderId,
  initialOrderItemId,
  initialQuantity,
  onSubmit,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || (products[0]?.id || '')
  );
  const [quantityPlanned, setQuantityPlanned] = useState<number>(initialQuantity || 10);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(initialOrderId || '');
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string>(initialOrderItemId || '');
  const [batchNumber, setBatchNumber] = useState<string>('');
  const [priority, setPriority] = useState<ProductionOrder['priority']>('medium');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [estimatedEndDate, setEstimatedEndDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [technicalResponsible, setTechnicalResponsible] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Initialize or update fields when modal opens or initial props change
  useEffect(() => {
    if (initialProductId) setSelectedProductId(initialProductId);
    if (initialOrderId) setSelectedOrderId(initialOrderId);
    if (initialOrderItemId) setSelectedOrderItemId(initialOrderItemId);
    if (initialQuantity) setQuantityPlanned(initialQuantity);

    const now = new Date();
    const ym = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    setBatchNumber(`LOT-${ym}-${Math.floor(Math.random() * 90 + 10)}`);

    if (settings) {
      setTechnicalResponsible(
        `${settings.technicalResponsibleName} - ${settings.technicalResponsibleRegistry}`
      );
    }
  }, [isOpen, initialProductId, initialOrderId, initialOrderItemId, initialQuantity, settings]);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const selectedWorkstation = workstations.find((w) => w.id === selectedProduct?.workstationId);

  // Calculate process hours and estimated end date automatically
  useEffect(() => {
    if (!selectedProduct) return;
    const totalMinutes = selectedProduct.processTimeMinutes * (quantityPlanned || 1);
    const processHours = totalMinutes / 60;

    // Daily capacity in workstation or standard company hours
    const dailyHours = selectedWorkstation?.dailyHoursAvailable || settings?.standardWorkingHoursPerDay || 8;
    const daysNeeded = Math.ceil(processHours / dailyHours) + 1; // 1 extra day for buffer/setup

    const start = new Date(startDate || new Date());
    start.setDate(start.getDate() + daysNeeded);
    setEstimatedEndDate(start.toISOString().split('T')[0]);
  }, [selectedProductId, quantityPlanned, startDate, selectedProduct, selectedWorkstation, settings]);

  if (!isOpen) return null;

  // Calculate required materials based on BOM
  const requiredMaterials: OpMaterialRequirement[] = selectedProduct
    ? selectedProduct.bom.map((bomItem) => {
        const rawMat = rawMaterials.find((m) => m.id === bomItem.rawMaterialId);
        const scrapMultiplier = 1 + (bomItem.scrapRatePercent || 0) / 100;
        const totalQty = Number(
          (bomItem.quantityPerUnit * (quantityPlanned || 1) * scrapMultiplier).toFixed(3)
        );
        const currentStock = rawMat?.currentStock || 0;
        const isAvailable = currentStock >= totalQty;
        const unitCost = rawMat?.unitCost || 0;

        return {
          rawMaterialId: bomItem.rawMaterialId,
          rawMaterialName: rawMat?.name || bomItem.rawMaterialName || 'Insumo',
          rawMaterialCode: rawMat?.code || bomItem.rawMaterialCode || '-',
          unit: bomItem.unit,
          requiredQuantity: totalQty,
          unitCost,
          totalCost: Number((totalQty * unitCost).toFixed(2)),
          isAvailable,
          currentStockAvailable: currentStock,
        };
      })
    : [];

  const hasMissingStock = requiredMaterials.some((m) => !m.isAvailable);
  const totalProcessHours = selectedProduct
    ? Number(((selectedProduct.processTimeMinutes * quantityPlanned) / 60).toFixed(2))
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setSubmitting(true);
    try {
      const selectedOrder = orders.find((o) => o.id === selectedOrderId);

      // Create steps clone from product manufacturing steps
      const steps = selectedProduct.manufacturingSteps.map((st) => {
        const wst = workstations.find((w) => w.id === st.workstationId);
        return {
          stepNumber: st.stepNumber,
          title: st.title,
          workstationName: wst?.name || 'Fábrica Geral',
          standardTimeMinutes: st.standardTimeMinutes * quantityPlanned,
          isCompleted: false,
        };
      });

      const opCode = `OP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      await onSubmit({
        code: opCode,
        orderId: selectedOrderId || null,
        orderNumber: selectedOrder ? selectedOrder.orderNumber : null,
        orderItemId: selectedOrderItemId || null,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productCode: selectedProduct.code,
        productUnit: selectedProduct.unit,
        quantityPlanned: Number(quantityPlanned),
        quantityProduced: 0,
        quantityScrapped: 0,
        batchNumber,
        status: hasMissingStock ? 'planned' : 'queued',
        priority,
        startDate,
        estimatedEndDate,
        calculatedProcessHours: totalProcessHours,
        workstationId: selectedProduct.workstationId,
        workstationName: selectedWorkstation?.name || 'Linha Principal',
        materialsRequired: requiredMaterials,
        steps,
        notes,
        technicalResponsible: technicalResponsible || settings?.technicalResponsibleName || 'Responsável Técnico',
        stockDeducted: false,
      });

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span>Emissão de Ordem de Produção (OP)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Cálculo automatizado de insumos por ficha técnica e dimensionamento de carga horária
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Top Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Product Select */}
            <div className="md:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Produto a Fabricar (Ficha Técnica)</label>
              <select
                required
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.name} ({p.processTimeMinutes} min/un)
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Quantidade Planejada ({selectedProduct?.unit || 'UN'})
              </label>
              <input
                type="number"
                required
                min={1}
                value={quantityPlanned}
                onChange={(e) => setQuantityPlanned(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-bold text-slate-900 tabular-nums"
              />
            </div>

            {/* Origin Order */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Vínculo com Pedido de Venda</label>
              <select
                value={selectedOrderId}
                onChange={(e) => {
                  setSelectedOrderId(e.target.value);
                  const ord = orders.find((o) => o.id === e.target.value);
                  if (ord && ord.items[0]) {
                    setSelectedOrderItemId(ord.items[0].id);
                  }
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
              >
                <option value="">Nenhum (Produção para Estoque)</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber} - {o.clientName || 'Cliente'}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Number */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Número do Lote de Fabricação</label>
              <input
                type="text"
                required
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-slate-800"
              />
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média (Padrão)</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            {/* Dates */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Data de Início Prevista</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Previsão de Conclusão (Cálculo Automático)
              </label>
              <input
                type="date"
                required
                value={estimatedEndDate}
                onChange={(e) => setEstimatedEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
              />
            </div>

            {/* Technical Responsible */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Responsável Técnico</label>
              <input
                type="text"
                required
                value={technicalResponsible}
                onChange={(e) => setTechnicalResponsible(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Process Time Summary Box */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-950">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-700" />
              <span>
                <strong>Tempo Total de Processo Calculado:</strong> {totalProcessHours} horas de fabricação
              </span>
            </div>
            <span className="font-mono text-[11px] text-blue-800">
              {selectedProduct?.processTimeMinutes} min/un × {quantityPlanned} un.
            </span>
          </div>

          {/* Dynamic BOM Requirements Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Insumos Requisitados pela Ficha Técnica (BOM)</span>
              </h3>
              {hasMissingStock && (
                <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Atenção: Há insumos com saldo insuficiente</span>
                </span>
              )}
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Código</th>
                    <th className="py-2 px-3">Matéria-Prima</th>
                    <th className="py-2 px-3 text-right">Qtd Necessária</th>
                    <th className="py-2 px-3 text-right">Saldo Físico</th>
                    <th className="py-2 px-3 text-center">Status Almoxarifado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {requiredMaterials.map((mat) => (
                    <tr key={mat.rawMaterialId} className={!mat.isAvailable ? 'bg-amber-50/40' : ''}>
                      <td className="py-1.5 px-3 font-mono font-medium">{mat.rawMaterialCode}</td>
                      <td className="py-1.5 px-3 font-medium">{mat.rawMaterialName}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold tabular-nums">
                        {mat.requiredQuantity} {mat.unit}
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono tabular-nums">
                        {mat.currentStockAvailable} {mat.unit}
                      </td>
                      <td className="py-1.5 px-3 text-center">
                        {mat.isAvailable ? (
                          <span className="text-emerald-700 font-semibold text-[11px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Disponível</span>
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold text-[11px] inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Faltam {(mat.requiredQuantity - mat.currentStockAvailable).toFixed(1)} {mat.unit}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-700">Observações Operacionais da OP</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruções especiais para os operadores de fábrica..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{submitting ? 'Emitindo...' : 'Emitir e Liberar OP'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
