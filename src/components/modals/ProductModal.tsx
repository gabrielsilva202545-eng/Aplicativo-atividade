import React, { useState, useEffect } from 'react';
import {
  Product,
  RawMaterial,
  Workstation,
  CompanySettings,
  StockUnit,
  BomItem,
  ManufacturingStep,
} from '../../types/pcp.ts';
import { X, Plus, Trash2, Layers, Clock, DollarSign, Save } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  rawMaterials: RawMaterial[];
  workstations: Workstation[];
  settings: CompanySettings | null;
  onSave: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const STOCK_UNITS: StockUnit[] = ['UN', 'KG', 'M', 'L', 'M2', 'M3', 'CX', 'PC', 'PAR', 'ROLO'];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  rawMaterials,
  workstations,
  settings,
  onSave,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState<StockUnit>('UN');
  const [salePrice, setSalePrice] = useState<number>(0);
  const [processTimeMinutes, setProcessTimeMinutes] = useState<number>(30);
  const [workstationId, setWorkstationId] = useState<string>('');
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(5);
  const [technicalResponsible, setTechnicalResponsible] = useState<string>('');
  const [bom, setBom] = useState<BomItem[]>([]);
  const [manufacturingSteps, setManufacturingSteps] = useState<ManufacturingStep[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setCode(product.code);
      setName(product.name);
      setDescription(product.description || '');
      setCategory(product.category || 'Geral');
      setUnit(product.unit);
      setSalePrice(product.salePrice);
      setProcessTimeMinutes(product.processTimeMinutes || 30);
      setWorkstationId(product.workstationId || (workstations[0]?.id || ''));
      setCurrentStock(product.currentStock || 0);
      setMinStock(product.minStock || 5);
      setTechnicalResponsible(product.technicalResponsible || '');
      setBom(product.bom ? [...product.bom] : []);
      setManufacturingSteps(product.manufacturingSteps ? [...product.manufacturingSteps] : []);
    } else {
      setCode(`PRD-00${Math.floor(10 + Math.random() * 90)}`);
      setName('');
      setDescription('');
      setCategory('Montagem Industrial');
      setUnit('UN');
      setSalePrice(150);
      setProcessTimeMinutes(30);
      setWorkstationId(workstations[0]?.id || '');
      setCurrentStock(0);
      setMinStock(5);
      setTechnicalResponsible(
        settings
          ? `${settings.technicalResponsibleName} - ${settings.technicalResponsibleRegistry}`
          : 'Engenharia de Produção'
      );
      setBom([]);
      setManufacturingSteps([
        {
          stepNumber: 1,
          title: 'Preparação e corte de matérias-primas',
          workstationId: workstations[0]?.id || '',
          standardTimeMinutes: 10,
        },
        {
          stepNumber: 2,
          title: 'Montagem principal e integração',
          workstationId: workstations[1]?.id || workstations[0]?.id || '',
          standardTimeMinutes: 15,
        },
        {
          stepNumber: 3,
          title: 'Inspeção de qualidade e embalagem',
          workstationId: workstations[2]?.id || workstations[0]?.id || '',
          standardTimeMinutes: 5,
        },
      ]);
    }
  }, [product, isOpen, workstations, settings]);

  if (!isOpen) return null;

  // Add Item to BOM
  const handleAddBomItem = () => {
    if (rawMaterials.length === 0) return;
    const defaultMat = rawMaterials[0];
    const newItem: BomItem = {
      id: `bom-${Date.now()}`,
      rawMaterialId: defaultMat.id,
      rawMaterialName: defaultMat.name,
      rawMaterialCode: defaultMat.code,
      quantityPerUnit: 1,
      unit: defaultMat.unit,
      scrapRatePercent: 0,
      notes: '',
    };
    setBom([...bom, newItem]);
  };

  const handleRemoveBomItem = (index: number) => {
    setBom(bom.filter((_, i) => i !== index));
  };

  const handleUpdateBomItem = (index: number, updates: Partial<BomItem>) => {
    const updated = [...bom];
    if (updates.rawMaterialId) {
      const mat = rawMaterials.find((m) => m.id === updates.rawMaterialId);
      if (mat) {
        updates.rawMaterialName = mat.name;
        updates.rawMaterialCode = mat.code;
        updates.unit = mat.unit;
      }
    }
    updated[index] = { ...updated[index], ...updates };
    setBom(updated);
  };

  // Add Step to Manufacturing Steps
  const handleAddStep = () => {
    const nextStepNum = manufacturingSteps.length + 1;
    setManufacturingSteps([
      ...manufacturingSteps,
      {
        stepNumber: nextStepNum,
        title: `Etapa ${nextStepNum}`,
        workstationId: workstationId || workstations[0]?.id || '',
        standardTimeMinutes: 10,
      },
    ]);
  };

  const handleRemoveStep = (index: number) => {
    const updated = manufacturingSteps
      .filter((_, i) => i !== index)
      .map((st, i) => ({ ...st, stepNumber: i + 1 }));
    setManufacturingSteps(updated);
  };

  const handleUpdateStep = (index: number, updates: Partial<ManufacturingStep>) => {
    const updated = [...manufacturingSteps];
    updated[index] = { ...updated[index], ...updates };
    setManufacturingSteps(updated);
  };

  const calculatedCost = bom.reduce((acc, item) => {
    const mat = rawMaterials.find((m) => m.id === item.rawMaterialId);
    const unitCost = mat?.unitCost || 0;
    const itemCost = unitCost * item.quantityPerUnit * (1 + (item.scrapRatePercent || 0) / 100);
    return acc + itemCost;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave({
        code,
        name,
        description,
        category,
        unit,
        salePrice: Number(salePrice),
        estimatedCost: Number(calculatedCost.toFixed(2)),
        processTimeMinutes: Number(processTimeMinutes),
        workstationId,
        currentStock: Number(currentStock),
        minStock: Number(minStock),
        bom,
        manufacturingSteps,
        technicalResponsible,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-4xl my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>{product ? 'Editar Produto & Ficha Técnica' : 'Novo Produto & Ficha Técnica (BOM)'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Cadastre tempos de processo, insumos e roteiro operacional
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Basic Product Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Identificação Geral & Tempos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-slate-700">Código SKU</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono font-bold"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="font-medium text-slate-700">Nome do Produto</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Conjunto Mecânico Articulado"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Categoria</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex: Mecânica, Iluminação"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="md:col-span-4 space-y-1">
                <label className="font-medium text-slate-700">Descrição Técnica</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Especificações breves do produto..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Unidade de Medida</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as StockUnit)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {STOCK_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              {/* TEMPO DE PROCESSO CADASTRADO */}
              <div className="space-y-1">
                <label className="font-bold text-blue-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tempo Processo (min/un)</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={processTimeMinutes}
                  onChange={(e) => setProcessTimeMinutes(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono font-bold text-blue-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Preço de Venda (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Posto de Trabalho Principal</label>
                <select
                  value={workstationId}
                  onChange={(e) => setWorkstationId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {workstations.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.code} - {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Estoque Atual</label>
                <input
                  type="number"
                  value={currentStock}
                  onChange={(e) => setCurrentStock(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Estoque Mínimo</label>
                <input
                  type="number"
                  value={minStock}
                  onChange={(e) => setMinStock(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="font-medium text-slate-700">Responsável Técnico</label>
                <input
                  type="text"
                  value={technicalResponsible}
                  onChange={(e) => setTechnicalResponsible(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Bill of Materials (BOM) */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>2. Ficha Técnica de Matérias-Primas (BOM por Unidade)</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  Custo calculado de insumos: <strong>R$ {calculatedCost.toFixed(2)}</strong> por unidade
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddBomItem}
                className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Insumo</span>
              </button>
            </div>

            {bom.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-400">
                Nenhum insumo associado a este produto. Clique em "+ Adicionar Insumo" acima.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {bom.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 md:grid-cols-6 gap-2 text-xs items-center"
                  >
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] text-slate-500 block">Matéria-Prima</label>
                      <select
                        value={item.rawMaterialId}
                        onChange={(e) => handleUpdateBomItem(idx, { rawMaterialId: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded focus:outline-none"
                      >
                        {rawMaterials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.code} - {m.name} (R$ {m.unitCost.toFixed(2)}/{m.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 block">Qtd Consumida</label>
                      <input
                        type="number"
                        step="0.001"
                        min={0.001}
                        value={item.quantityPerUnit}
                        onChange={(e) =>
                          handleUpdateBomItem(idx, { quantityPerUnit: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 block">Perda Técnica %</label>
                      <input
                        type="number"
                        min={0}
                        value={item.scrapRatePercent}
                        onChange={(e) =>
                          handleUpdateBomItem(idx, { scrapRatePercent: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 block">Instrução / Nota</label>
                      <input
                        type="text"
                        value={item.notes || ''}
                        onChange={(e) => handleUpdateBomItem(idx, { notes: e.target.value })}
                        placeholder="Ex: Corte chanfrado"
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded"
                      />
                    </div>

                    <div className="flex justify-end pt-3">
                      <button
                        type="button"
                        onClick={() => handleRemoveBomItem(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Remover insumo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Manufacturing Steps */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>3. Roteiro de Fabricação (Etapas do Processo)</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Etapa</span>
              </button>
            </div>

            <div className="space-y-2">
              {manufacturingSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 md:grid-cols-6 gap-2 text-xs items-center"
                >
                  <div className="font-mono font-bold text-slate-700">
                    Etapa {step.stepNumber}
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleUpdateStep(idx, { title: e.target.value })}
                      placeholder="Descrição da etapa..."
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <select
                      value={step.workstationId}
                      onChange={(e) => handleUpdateStep(idx, { workstationId: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded"
                    >
                      {workstations.map((w) => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <input
                      type="number"
                      min={1}
                      value={step.standardTimeMinutes}
                      onChange={(e) =>
                        handleUpdateStep(idx, { standardTimeMinutes: Number(e.target.value) })
                      }
                      placeholder="Minutos"
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded font-mono"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
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
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Salvando...' : 'Salvar Ficha do Produto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
