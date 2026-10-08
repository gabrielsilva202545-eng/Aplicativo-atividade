import React, { useState } from 'react';
import { ProductionOrder, ProductionOrderStatus } from '../types/pcp.ts';
import {
  Printer,
  CheckSquare,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  User,
  Plus,
} from 'lucide-react';

interface ProductionKanbanViewProps {
  productionOrders: ProductionOrder[];
  onUpdateStatus: (id: string, status: ProductionOrderStatus) => Promise<void>;
  onOpenCreateOp: () => void;
  onOpenCompleteOp: (op: ProductionOrder) => void;
  onOpenPrintOp: (op: ProductionOrder) => void;
  onToggleStep: (opId: string, stepNumber: number, isCompleted: boolean) => Promise<void>;
  onSelectOp: (op: ProductionOrder) => void;
}

const COLUMNS: Array<{
  id: ProductionOrderStatus;
  title: string;
  subtitle: string;
  color: string;
  headerBg: string;
}> = [
  {
    id: 'planned',
    title: 'Planejada',
    subtitle: 'Aguardando liberação de insumos',
    color: 'border-slate-300 text-slate-800',
    headerBg: 'bg-slate-100',
  },
  {
    id: 'queued',
    title: 'Na Fila',
    subtitle: 'Liberada para o posto de trabalho',
    color: 'border-indigo-300 text-indigo-900',
    headerBg: 'bg-indigo-50/80',
  },
  {
    id: 'in_progress',
    title: 'Em Produção',
    subtitle: 'Operação e montagem ativas',
    color: 'border-blue-300 text-blue-900',
    headerBg: 'bg-blue-50/80',
  },
  {
    id: 'quality_check',
    title: 'Controle de Qualidade',
    subtitle: 'Testes, ensaios e inspeção',
    color: 'border-amber-300 text-amber-900',
    headerBg: 'bg-amber-50/80',
  },
  {
    id: 'completed',
    title: 'Concluída / Baixada',
    subtitle: 'Estoque atualizado e finalizado',
    color: 'border-emerald-300 text-emerald-900',
    headerBg: 'bg-emerald-50/80',
  },
];

export const ProductionKanbanView: React.FC<ProductionKanbanViewProps> = ({
  productionOrders,
  onUpdateStatus,
  onOpenCreateOp,
  onOpenCompleteOp,
  onOpenPrintOp,
  onToggleStep,
  onSelectOp,
}) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredOrders = productionOrders.filter((op) => {
    const matchesSearch =
      op.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (op.orderNumber && op.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriority =
      filterPriority === 'all' || op.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  const getNextStatus = (current: ProductionOrderStatus): ProductionOrderStatus | null => {
    switch (current) {
      case 'planned':
        return 'queued';
      case 'queued':
        return 'in_progress';
      case 'in_progress':
        return 'quality_check';
      case 'quality_check':
        return 'completed';
      default:
        return null;
    }
  };

  const getPrevStatus = (current: ProductionOrderStatus): ProductionOrderStatus | null => {
    switch (current) {
      case 'quality_check':
        return 'in_progress';
      case 'in_progress':
        return 'queued';
      case 'queued':
        return 'planned';
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por código da OP, produto, lote ou pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 whitespace-nowrap">Prioridade:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">Todas as prioridades</option>
              <option value="urgent">Urgente</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateOp}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Emitir Nova OP</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 items-start">
        {COLUMNS.map((col) => {
          const colOrders = filteredOrders.filter((op) => op.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-50 border border-slate-200 rounded-xl flex flex-col min-h-[580px] shadow-xs"
            >
              {/* Column Header */}
              <div className={`p-3 border-b border-slate-200 rounded-t-xl ${col.headerBg}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                    {col.title}
                  </h3>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-700 tabular-nums">
                    {colOrders.length}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                  {col.subtitle}
                </p>
              </div>

              {/* Cards List */}
              <div className="p-2.5 flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-250px)]">
                {colOrders.length === 0 ? (
                  <div className="py-10 text-center text-[11px] text-slate-400">
                    Nenhuma OP nesta etapa
                  </div>
                ) : (
                  colOrders.map((op) => {
                    const isExpanded = !!expandedCards[op.id];
                    const totalSteps = op.steps.length;
                    const completedSteps = op.steps.filter((s) => s.isCompleted).length;
                    const progressPct =
                      totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

                    const nextStatus = getNextStatus(op.status);
                    const prevStatus = getPrevStatus(op.status);

                    return (
                      <div
                        key={op.id}
                        onClick={() => onSelectOp(op)}
                        className="bg-white border border-slate-200 hover:border-blue-400 rounded-lg p-3 shadow-xs hover:shadow-sm transition-all cursor-pointer relative group"
                      >
                        {/* Card Header */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {op.code}
                          </span>

                          <div className="flex items-center gap-1">
                            {op.priority === 'urgent' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700">
                                URGENTE
                              </span>
                            )}
                            {op.priority === 'high' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700">
                                ALTA
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenPrintOp(op);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                              title="Imprimir Ordem de Produção"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Product Title */}
                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 mb-1.5 leading-snug">
                          {op.productName}
                        </h4>

                        {/* Quantities & Batch */}
                        <div className="flex items-center justify-between text-[11px] text-slate-600 mb-2 font-mono">
                          <span className="font-bold text-slate-800 tabular-nums">
                            {op.quantityPlanned} {op.productUnit}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Lote: {op.batchNumber}
                          </span>
                        </div>

                        {/* Order Link if present */}
                        {op.orderNumber && (
                          <div className="text-[10px] text-blue-700 font-medium mb-2 bg-blue-50/60 px-2 py-0.5 rounded border border-blue-100 truncate">
                            Origem: {op.orderNumber}
                          </div>
                        )}

                        {/* Step Progress Bar */}
                        <div className="space-y-1 mb-2.5">
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>Etapas: {completedSteps}/{totalSteps}</span>
                            <span className="font-mono tabular-nums">{progressPct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                op.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-600'
                              }`}
                              style={{ width: `${progressPct}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Expandable Step Checklist */}
                        {isExpanded && (
                          <div className="my-2.5 pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                            <div className="font-semibold text-slate-700 text-[10px] uppercase tracking-wider">
                              Roteiro de Produção:
                            </div>
                            {op.steps.map((st) => (
                              <div
                                key={st.stepNumber}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (op.status !== 'completed') {
                                    onToggleStep(op.id, st.stepNumber, !st.isCompleted);
                                  }
                                }}
                                className={`p-1.5 rounded flex items-start gap-1.5 cursor-pointer transition-colors ${
                                  st.isCompleted
                                    ? 'bg-emerald-50/80 text-emerald-900'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={st.isCompleted}
                                  readOnly
                                  className="mt-0.5 rounded text-blue-600 cursor-pointer pointer-events-none"
                                />
                                <div className="flex-1 leading-tight">
                                  <div className="font-medium">{st.title}</div>
                                  <div className="text-[10px] text-slate-400">
                                    {st.workstationName} · {st.standardTimeMinutes} min
                                    {st.completedAt && ' · Concluída'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Card Footer: Metadata and Action Buttons */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                          <button
                            onClick={(e) => toggleExpand(op.id, e)}
                            className="flex items-center gap-0.5 text-slate-500 hover:text-slate-800"
                          >
                            <span>{isExpanded ? 'Ocultar' : 'Roteiro'}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>

                          <div className="flex items-center gap-1">
                            {/* Move Backward */}
                            {prevStatus && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateStatus(op.id, prevStatus);
                                }}
                                className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded transition-colors"
                                title="Voltar etapa anterior"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            {/* Move Forward or Complete */}
                            {nextStatus && nextStatus !== 'completed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateStatus(op.id, nextStatus);
                                }}
                                className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded flex items-center gap-0.5 transition-colors"
                                title="Avançar para próxima etapa"
                              >
                                <span>Avançar</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            {/* Baixa / Conclusão */}
                            {op.status !== 'completed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenCompleteOp(op);
                                }}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded flex items-center gap-0.5 transition-colors shadow-2xs"
                                title="Dar baixa e concluir OP com apontamento de estoque"
                              >
                                <CheckSquare className="w-3 h-3" />
                                <span>Baixa</span>
                              </button>
                            )}

                            {op.status === 'completed' && (
                              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                                <CheckSquare className="w-3 h-3" />
                                <span>Baixada</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
