import React, { useState, useEffect } from 'react';
import { RawMaterial, Supplier, StockUnit } from '../../types/pcp.ts';
import { X, Boxes, Save } from 'lucide-react';

interface RawMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: RawMaterial | null;
  suppliers: Supplier[];
  onSave: (data: Omit<RawMaterial, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const STOCK_UNITS: StockUnit[] = ['UN', 'KG', 'M', 'L', 'M2', 'M3', 'CX', 'PC', 'PAR', 'ROLO'];

export const RawMaterialModal: React.FC<RawMaterialModalProps> = ({
  isOpen,
  onClose,
  material,
  suppliers,
  onSave,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState<StockUnit>('UN');
  const [supplierId, setSupplierId] = useState('');
  const [unitCost, setUnitCost] = useState<number>(0);
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(10);
  const [location, setLocation] = useState('');
  const [leadTimeDays, setLeadTimeDays] = useState<number>(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (material) {
      setCode(material.code);
      setName(material.name);
      setDescription(material.description || '');
      setUnit(material.unit);
      setSupplierId(material.supplierId || (suppliers[0]?.id || ''));
      setUnitCost(material.unitCost);
      setCurrentStock(material.currentStock);
      setMinStock(material.minStock);
      setLocation(material.location || '');
      setLeadTimeDays(material.leadTimeDays || 5);
    } else {
      setCode(`MP-INS-0${Math.floor(10 + Math.random() * 90)}`);
      setName('');
      setDescription('');
      setUnit('UN');
      setSupplierId(suppliers[0]?.id || '');
      setUnitCost(25.0);
      setCurrentStock(50);
      setMinStock(20);
      setLocation('Almoxarifado Geral');
      setLeadTimeDays(5);
    }
  }, [material, isOpen, suppliers]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave({
        code,
        name,
        description,
        unit,
        supplierId,
        unitCost: Number(unitCost),
        currentStock: Number(currentStock),
        minStock: Number(minStock),
        reservedStock: material?.reservedStock || 0,
        location,
        leadTimeDays: Number(leadTimeDays),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg my-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-blue-600" />
              <span>{material ? 'Editar Matéria-Prima' : 'Nova Matéria-Prima'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Controle de estoque de insumos e estoques de segurança
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Código / SKU</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Unidade de Medida</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as StockUnit)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                {STOCK_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Descrição do Insumo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Chapa de Aço Inox 304 2mm"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Detalhes / Especificação</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Normas, dimensões, pureza..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Custo Unitário (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Fornecedor Padrão</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.tradeName || s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Estoque Físico Atual</label>
              <input
                type="number"
                step="0.1"
                required
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Estoque Mínimo de Segurança</label>
              <input
                type="number"
                step="0.1"
                required
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Localização no Almoxarifado</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Prateleira B-04"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Lead Time (dias reposição)</label>
              <input
                type="number"
                min={1}
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Salvando...' : 'Salvar Matéria-Prima'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
