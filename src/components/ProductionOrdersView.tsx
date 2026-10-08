import React, { useState } from 'react';
import { ProductionOrder, ProductionOrderStatus } from '../types/pcp.ts';
import { ProductionKanbanView } from './ProductionKanbanView.tsx';
import {
  Kanban,
  Table as TableIcon,
  Plus,
  Printer,
  CheckSquare,
  Trash2,
  Eye,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ProductionOrdersViewProps {
  productionOrders: ProductionOrder[];
  onUpdateStatus: (id: string, status: ProductionOrderStatus) => Promise<void>;
  onOpenCreateOp: () => void;
  onOpenCompleteOp: (op: ProductionOrder) => void;
  onOpenPrintOp: (op: ProductionOrder) => void;
  onDeleteOp: (id: string) => Promise<void>;
  onToggleStep: (opId: string, stepNumber: number, isCompleted: boolean) => Promise<void>;
  onSelectOp: (op: ProductionOrder) => void;
}

export const ProductionOrdersView: React.FC<ProductionOrdersViewProps> = ({
  productionOrders,
  onUpdateStatus,
  onOpenCreateOp,
  onOpenCompleteOp,
  onOpenPrintOp,
  onDeleteOp,
  onToggleStep,
  onSelectOp,
}) => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = productionOrders.filter((op) => {
    const matchesSearch =
      op.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || op.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusMap: Record<string, { label: string; color: string }> = {
    planned: { label: 'Planejada', color: 'bg-slate-100 text-slate-700' },
    queued: { label: 'Na Fila', color: 'bg-indigo-50 text-indigo-700' },
    in_progress: { label: 'Em Produção', color: 'bg-blue-50 text-blue-700 font-semibold' },
    quality_check: { label: 'Qualidade', color: 'bg-amber-50 text-amber-700' },
    completed: { label: 'Concluída / Baixada', color: 'bg-emerald-50 text-emerald-700 font-semibold' },
    cancelled: { label: 'Cancelada', color: 'bg-rose-50 text-rose-700' },
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Gestão de Ordens de Produção (OP)
          </h1>
          <p className="text-xs text-slate-500">
            Acompanhamento operacional, tempos de fabricação, fichas técnicas e baixa física de estoque
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-200/70 rounded-lg">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Quadro Kanban</span>
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Lista Detalhada</span>
            </button>
          </div>

          <button
            onClick={onOpenCreateOp}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Emitir Nova OP</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Kanban vs Table */}
      {activeTab === 'kanban' ? (
        <ProductionKanbanView
          productionOrders={productionOrders}
          onUpdateStatus={onUpdateStatus}
          onOpenCreateOp={onOpenCreateOp}
          onOpenCompleteOp={onOpenCompleteOp}
          onOpenPrintOp={onOpenPrintOp}
          onToggleStep={onToggleStep}
          onSelectOp={onSelectOp}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          {/* Table Filters */}
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-3">
              <input
                type="text"
                placeholder="Buscar por código, produto ou lote..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-sm px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="all">Todos os Status</option>
                <option value="planned">Planejada</option>
                <option value="queued">Na Fila</option>
                <option value="in_progress">Em Produção</option>
                <option value="quality_check">Controle de Qualidade</option>
                <option value="completed">Concluída / Baixada</option>
              </select>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Total: {filteredOrders.length} ordens encontradas
            </div>
          </div>

          {/* Table Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Código / Lote</th>
                  <th className="py-3 px-4">Produto & Ficha</th>
                  <th className="py-3 px-4 text-right">Qtd Planejada</th>
                  <th className="py-3 px-4 text-right">Qtd Produzida</th>
                  <th className="py-3 px-4">Previsão Fim</th>
                  <th className="py-3 px-4">Tempo Proc.</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Resp. Técnico</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      Nenhuma ordem de produção corresponde aos filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((op) => {
                    const statusInfo = statusMap[op.status] || {
                      label: op.status,
                      color: 'bg-slate-100 text-slate-700',
                    };

                    return (
                      <tr
                        key={op.id}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        onClick={() => onSelectOp(op)}
                      >
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-slate-900">{op.code}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Lote: {op.batchNumber}
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-semibold text-slate-900 truncate">
                            {op.productName}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {op.productCode} {op.orderNumber && `· ${op.orderNumber}`}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                          {op.quantityPlanned} {op.productUnit}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-emerald-700">
                          {op.quantityProduced > 0 ? `${op.quantityProduced} ${op.productUnit}` : '-'}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                          {op.estimatedEndDate}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                          {op.calculatedProcessHours ? `${op.calculatedProcessHours}h` : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-600 truncate max-w-[160px]">
                          {op.technicalResponsible.split('-')[0].trim()}
                        </td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onOpenPrintOp(op)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                              title="Imprimir Ordem de Produção"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            {op.status !== 'completed' && (
                              <button
                                onClick={() => onOpenCompleteOp(op)}
                                className="px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 rounded transition-colors flex items-center gap-1"
                                title="Dar baixa nesta OP"
                              >
                                <CheckSquare className="w-3.5 h-3.5" />
                                <span>Baixa</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Tem certeza que deseja excluir a Ordem de Produção ${op.code}?`
                                  )
                                ) {
                                  onDeleteOp(op.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Excluir Ordem de Produção"
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
      )}
    </div>
  );
};
