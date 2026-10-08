import React, { useState } from 'react';
import { RawMaterial, Supplier } from '../types/pcp.ts';
import { ConfirmModal } from './modals/ConfirmModal.tsx';
import {
  Boxes,
  Plus,
  AlertTriangle,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  DollarSign,
  TrendingDown,
  Building,
} from 'lucide-react';

interface RawMaterialsViewProps {
  rawMaterials: RawMaterial[];
  suppliers: Supplier[];
  onOpenCreateMaterial: () => void;
  onEditMaterial: (material: RawMaterial) => void;
  onDeleteMaterial: (id: string) => Promise<void>;
}

export const RawMaterialsView: React.FC<RawMaterialsViewProps> = ({
  rawMaterials,
  suppliers,
  onOpenCreateMaterial,
  onEditMaterial,
  onDeleteMaterial,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<RawMaterial | null>(null);

  const filteredMaterials = rawMaterials.filter((m) => {
    const matchesSearch =
      (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.location && m.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLowStock = !onlyLowStock || m.currentStock <= m.minStock;
    return matchesSearch && matchesLowStock;
  });

  const lowStockCount = rawMaterials.filter((m) => m.currentStock <= m.minStock).length;
  const totalStockValue = rawMaterials.reduce(
    (acc, m) => acc + m.currentStock * m.unitCost,
    0
  );

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Almoxarifado & Matérias-Primas
          </h1>
          <p className="text-xs text-slate-500">
            Controle de estoque de insumos, pontos de reposição, estoques mínimos e custos médios
          </p>
        </div>

        <button
          onClick={onOpenCreateMaterial}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Cadastrar Matéria-Prima</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total de Itens Cadastrados</div>
          <div className="font-mono text-xl font-bold text-slate-900 mt-1 tabular-nums">
            {rawMaterials.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Insumos ativos no catálogo</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Itens em Nível Crítico</div>
          <div className="font-mono text-xl font-bold text-amber-600 mt-1 tabular-nums flex items-center gap-2">
            <span>{lowStockCount}</span>
            {lowStockCount > 0 && (
              <span className="text-xs font-normal text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Abaixo do mínimo
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Requerem compra ou reposição</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Valor Total Imobilizado</div>
          <div className="font-mono text-xl font-bold text-slate-900 mt-1 tabular-nums">
            R$ {totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Custo total em armazém</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <input
            type="text"
            placeholder="Buscar matéria-prima por código, nome ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />

          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyLowStock}
              onChange={(e) => setOnlyLowStock(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Apenas estoque crítico ({lowStockCount})</span>
          </label>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          {filteredMaterials.length} item(ns) listado(s)
        </div>
      </div>

      {/* Table of Raw Materials */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Descrição do Insumo</th>
                <th className="py-3 px-4">Unidade</th>
                <th className="py-3 px-4 text-right">Custo Unitário</th>
                <th className="py-3 px-4 text-right">Estoque Físico</th>
                <th className="py-3 px-4 text-right">Estoque Mínimo</th>
                <th className="py-3 px-4 text-right">Saldo Disponível</th>
                <th className="py-3 px-4">Localização / Fornecedor</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Nenhuma matéria-prima encontrada com os filtros informados.
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((m) => {
                  const isLow = m.currentStock <= m.minStock;
                  const availableStock = Math.max(0, m.currentStock - (m.reservedStock || 0));
                  const supplier = suppliers.find((s) => s.id === m.supplierId);

                  return (
                    <tr
                      key={m.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isLow ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {m.code}
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold text-slate-900 truncate">
                          {m.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {m.description || 'Sem descrição adicional'}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {m.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                        R$ {m.unitCost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isLow && (
                            <span title="Estoque no ponto crítico de reposição">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            </span>
                          )}
                          <span
                            className={`font-mono font-bold tabular-nums ${
                              isLow ? 'text-amber-700' : 'text-slate-900'
                            }`}
                          >
                            {m.currentStock}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500 tabular-nums">
                        {m.minStock}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-blue-700">
                        {availableStock}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-600">
                        <div className="flex items-center gap-1 text-slate-700 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{m.location || 'Almoxarifado Geral'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {supplier ? supplier.tradeName || supplier.name : 'Sem fornecedor'} · {m.leadTimeDays}d lead time
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditMaterial(m)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 rounded transition-colors"
                            title="Editar Matéria-Prima"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setMaterialToDelete(m)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                            title="Excluir Matéria-Prima"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!materialToDelete}
        title="Excluir Matéria-Prima?"
        message={
          materialToDelete
            ? `Tem certeza que deseja excluir o insumo ${materialToDelete.code} - ${materialToDelete.name}? Isto pode impactar fichas técnicas cadastradas.`
            : ''
        }
        confirmText="Sim, Excluir Matéria-Prima"
        cancelText="Cancelar"
        icon="trash"
        isDanger={true}
        onConfirm={async () => {
          if (materialToDelete) {
            const id = materialToDelete.id;
            setMaterialToDelete(null);
            await onDeleteMaterial(id);
          }
        }}
        onCancel={() => setMaterialToDelete(null)}
      />
    </div>
  );
};
