import React from 'react';
import {
  ProductionOrder,
  RawMaterial,
  Workstation,
  Order,
  CompanySettings,
  StockMovement,
} from '../types/pcp.ts';
import {
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Gauge,
  Plus,
  ArrowRight,
  TrendingUp,
  Package,
  Layers,
} from 'lucide-react';

interface DashboardViewProps {
  productionOrders: ProductionOrder[];
  rawMaterials: RawMaterial[];
  workstations: Workstation[];
  orders: Order[];
  stockMovements: StockMovement[];
  settings: CompanySettings | null;
  onOpenCreateOp: () => void;
  onSelectView: (view: string) => void;
  onSelectOpForDetail: (op: ProductionOrder) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  productionOrders,
  rawMaterials,
  workstations,
  orders,
  stockMovements,
  settings,
  onOpenCreateOp,
  onSelectView,
  onSelectOpForDetail,
}) => {
  // KPI Calculations
  const activeOps = productionOrders.filter(
    (op) => op.status !== 'completed' && op.status !== 'cancelled'
  );
  const completedOps = productionOrders.filter((op) => op.status === 'completed');
  const lowStockMaterials = rawMaterials.filter((m) => m.currentStock <= m.minStock);

  const totalPlannedUnits = activeOps.reduce((acc, o) => acc + o.quantityPlanned, 0);
  const totalProducedUnits = completedOps.reduce((acc, o) => acc + o.quantityProduced, 0);
  const totalScrappedUnits = completedOps.reduce((acc, o) => acc + o.quantityScrapped, 0);
  const totalScrapRate =
    totalProducedUnits + totalScrappedUnits > 0
      ? ((totalScrappedUnits / (totalProducedUnits + totalScrappedUnits)) * 100).toFixed(1)
      : '0.0';

  const totalProductionHours = activeOps.reduce(
    (acc, o) => acc + (o.calculatedProcessHours || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Context */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            <span>Visão Integrada de PCP</span>
            <span aria-hidden="true">·</span>
            <span>{settings?.companyName || 'Indústria & Manufatura'}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Planejamento e Controle da Produção
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Acompanhe o fluxo fabril em tempo real, capacidade das linhas de montagem, consumo de insumos conforme ficha técnica e emissão de ordens.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectView('kanban')}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Ver Kanban Fabril
          </button>
          <button
            onClick={onOpenCreateOp}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Emitir Nova OP</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Ordens em Andamento</span>
            <PlayCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {activeOps.length}
            </span>
            <span className="text-xs text-slate-500">
              ({totalPlannedUnits} un. em produção)
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
            <span>Tempo estimado na esteira:</span>
            <span className="font-semibold text-slate-700 font-mono tabular-nums">
              {totalProductionHours.toFixed(1)}h
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Ordens Concluídas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {completedOps.length}
            </span>
            <span className="text-xs text-slate-500">
              ({totalProducedUnits} un. finalizadas)
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
            <span>Índice de Refugo/Sucata:</span>
            <span className="font-semibold text-slate-700 font-mono tabular-nums">
              {totalScrapRate}%
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Alerta de Insumos</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockMaterials.length > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {lowStockMaterials.length}
            </span>
            <span className="text-xs text-slate-500">
              abaixo do estoque mínimo
            </span>
          </div>
          <div className="mt-3 text-[11px]">
            {lowStockMaterials.length > 0 ? (
              <button
                onClick={() => onSelectView('materials')}
                className="text-amber-700 font-medium hover:underline flex items-center gap-1"
              >
                <span>Verificar no almoxarifado</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <span className="text-emerald-700 font-medium">
                Almoxarifado em níveis normais
              </span>
            )}
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Responsável Técnico</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="truncate">
            <span className="text-sm font-bold text-slate-900 truncate block">
              {settings?.technicalResponsibleName || 'Não informado'}
            </span>
            <span className="text-[11px] text-slate-500 block truncate">
              {settings?.technicalResponsibleRegistry || 'Registro CREA pendente'}
            </span>
          </div>
          <div className="mt-3 text-[11px]">
            <button
              onClick={() => onSelectView('settings')}
              className="text-blue-600 font-medium hover:underline flex items-center gap-1"
            >
              <span>Gerenciar cadastro técnico</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Production Stage Status & Workstation Load */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Active Production Pipeline */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Ordens de Produção em Andamento
              </h2>
              <p className="text-xs text-slate-500">
                Acompanhamento das OPs ativas na fábrica
              </p>
            </div>
            <button
              onClick={() => onSelectView('kanban')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Abrir Quadro Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeOps.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg">
              <Package className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Nenhuma ordem de produção em andamento no momento.</p>
              <button
                onClick={onOpenCreateOp}
                className="mt-3 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Emitir Ordem de Produção</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeOps.slice(0, 4).map((op) => {
                const totalSteps = (op.steps || []).length;
                const completedSteps = (op.steps || []).filter((s) => s.isCompleted).length;
                const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

                const statusLabelMap: Record<string, { text: string; color: string }> = {
                  planned: { text: 'Planejada', color: 'bg-slate-100 text-slate-700' },
                  queued: { text: 'Na Fila', color: 'bg-indigo-50 text-indigo-700' },
                  in_progress: { text: 'Em Produção', color: 'bg-blue-50 text-blue-700 font-semibold' },
                  quality_check: { text: 'Controle de Qualidade', color: 'bg-amber-50 text-amber-700' },
                };
                const statusInfo = statusLabelMap[op.status] || { text: op.status, color: 'bg-slate-100 text-slate-700' };

                return (
                  <div
                    key={op.id}
                    onClick={() => onSelectOpForDetail(op)}
                    className="p-3.5 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {op.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[11px] ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                        {op.priority === 'urgent' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                            Urgente
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-600 tabular-nums">
                        {op.quantityPlanned} {op.productUnit}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-slate-800 truncate mb-2">
                      {op.productName}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                      <span>Etapas: {completedSteps}/{totalSteps} concluídas ({progressPct}%)</span>
                      <span className="font-mono tabular-nums">Término: {op.estimatedEndDate}</span>
                    </div>

                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Column 3: Workstations Capacity Utilization */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Capacidade Produtiva
              </h2>
              <p className="text-xs text-slate-500">
                Ocupação horária dos postos de trabalho
              </p>
            </div>
            <button
              onClick={() => onSelectView('workstations')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Ver Postos
            </button>
          </div>

          <div className="space-y-4 flex-1">
            {workstations.map((w) => {
              const assignedOps = activeOps.filter((o) => o.workstationId === w.id);
              const assignedHours = assignedOps.reduce(
                (acc, o) => acc + (o.calculatedProcessHours || 0),
                0
              );
              const weeklyCapacity = w.dailyHoursAvailable * 5;
              const loadPct = weeklyCapacity > 0 ? Math.min(100, Math.round((assignedHours / weeklyCapacity) * 100)) : 0;

              return (
                <div key={w.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 truncate">
                      {w.name}
                    </span>
                    <span className="font-mono text-slate-600 tabular-nums">
                      {loadPct}% ({assignedHours.toFixed(1)}h / {weeklyCapacity}h)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        loadPct > 85 ? 'bg-rose-500' : loadPct > 50 ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.max(5, loadPct)}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{w.sector} · {w.dailyHoursAvailable}h/dia</span>
                    <span>{assignedOps.length} OPs alocadas</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Eficiência Média Operacional:</span>
            <span className="font-bold text-slate-800 font-mono">
              {(
                workstations.reduce((acc, w) => acc + w.efficiencyRatePercent, 0) /
                (workstations.length || 1)
              ).toFixed(0)}
              % (OEE)
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Critical Inventory & Recent Stock Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Inventory */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Almoxarifado: Insumos Críticos</span>
                {lowStockMaterials.length > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">
                    {lowStockMaterials.length}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                Itens com saldo igual ou inferior ao estoque mínimo
              </p>
            </div>
            <button
              onClick={() => onSelectView('materials')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Ver Estoque Completo
            </button>
          </div>

          {lowStockMaterials.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              Nenhuma matéria-prima com estoque crítico.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {lowStockMaterials.slice(0, 5).map((m) => (
                <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-slate-500 mr-2">{m.code}</span>
                    <span className="font-medium text-slate-800">{m.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-rose-600 tabular-nums">
                      {m.currentStock} {m.unit}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Mínimo: {m.minStock} {m.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Production History */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Histórico Recente de Apontamentos
              </h2>
              <p className="text-xs text-slate-500">
                Movimentações de consumo e entradas de produtos acabados
              </p>
            </div>
            <button
              onClick={() => onSelectView('reports')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Relatórios
            </button>
          </div>

          {stockMovements.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              Nenhuma movimentação registrada até o momento.
            </div>
          ) : (
            <div className="space-y-2.5">
              {stockMovements.slice(-5).reverse().map((mov) => {
                const isEntry = mov.type === 'PRODUCTION_ENTRY';
                return (
                  <div
                    key={mov.id}
                    className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isEntry ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {isEntry ? 'Entrada Acabado' : 'Consumo Insumo'}
                        </span>
                        <span className="font-medium text-slate-900">{mov.itemName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {mov.notes} · Por: {mov.technicalResponsible ? mov.technicalResponsible.split('-')[0].trim() : 'PCP'}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-slate-800 tabular-nums shrink-0">
                      {isEntry ? `+${mov.quantity}` : `-${mov.quantity}`} {mov.unit}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
