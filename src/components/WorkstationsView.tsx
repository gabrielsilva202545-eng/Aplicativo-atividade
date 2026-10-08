import React, { useState } from 'react';
import { Workstation, ProductionOrder } from '../types/pcp.ts';
import { ConfirmModal } from './modals/ConfirmModal.tsx';
import {
  Gauge,
  Plus,
  Edit2,
  Trash2,
  Users,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface WorkstationsViewProps {
  workstations: Workstation[];
  productionOrders: ProductionOrder[];
  onOpenCreateWorkstation: () => void;
  onEditWorkstation: (workstation: Workstation) => void;
  onDeleteWorkstation: (id: string) => Promise<void>;
}

export const WorkstationsView: React.FC<WorkstationsViewProps> = ({
  workstations,
  productionOrders,
  onOpenCreateWorkstation,
  onEditWorkstation,
  onDeleteWorkstation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [workstationToDelete, setWorkstationToDelete] = useState<Workstation | null>(null);

  const activeOps = productionOrders.filter(
    (op) => op.status !== 'completed' && op.status !== 'cancelled'
  );

  const filteredWorkstations = workstations.filter(
    (w) =>
      (w.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.sector || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Overall plant capacity stats
  const totalDailyHours = workstations
    .filter((w) => w.status === 'operational')
    .reduce((acc, w) => acc + w.dailyHoursAvailable, 0);

  const totalOperators = workstations.reduce((acc, w) => acc + w.activeOperatorsCount, 0);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Capacidade Produtiva & Postos de Trabalho
          </h1>
          <p className="text-xs text-slate-500">
            Dimensionamento de carga horária fabril, postos de operação, OEE e cálculo de gargalos da fábrica
          </p>
        </div>

        <button
          onClick={onOpenCreateWorkstation}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Cadastrar Posto / Máquina</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Capacidade Diária da Fábrica</div>
          <div className="font-mono text-xl font-bold text-slate-900 mt-1 tabular-nums flex items-baseline gap-2">
            <span>{totalDailyHours} horas / dia</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalDailyHours * 5}h disponíveis por semana (5 dias)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Equipe Fabril Alocada</div>
          <div className="font-mono text-xl font-bold text-slate-900 mt-1 tabular-nums">
            {totalOperators} operadores
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Distribuídos em {workstations.length} postos</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">OEE Médio Estimado</div>
          <div className="font-mono text-xl font-bold text-emerald-700 mt-1 tabular-nums">
            {(
              workstations.reduce((acc, w) => acc + w.efficiencyRatePercent, 0) /
              (workstations.length || 1)
            ).toFixed(1)}
            %
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Eficiência Geral dos Equipamentos</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Buscar posto por nome, código ou setor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        <div className="text-xs text-slate-500 font-mono">
          {filteredWorkstations.length} posto(s) ativo(s)
        </div>
      </div>

      {/* Grid of Workstation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkstations.map((w) => {
          const assignedOps = activeOps.filter((o) => o.workstationId === w.id);
          const assignedHours = assignedOps.reduce(
            (acc, o) => acc + (o.calculatedProcessHours || 0),
            0
          );
          const weeklyCapacity = w.dailyHoursAvailable * 5;
          const loadPct =
            weeklyCapacity > 0 ? Math.round((assignedHours / weeklyCapacity) * 100) : 0;
          const isBottleneck = loadPct > 85;

          return (
            <div
              key={w.id}
              className={`bg-white border rounded-xl p-5 shadow-xs transition-all space-y-4 ${
                isBottleneck ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {w.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Setor: {w.sector}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {w.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditWorkstation(w)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 rounded transition-colors"
                    title="Editar Posto"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setWorkstationToDelete(w)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    title="Excluir Posto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Jornada / Dia</span>
                  </div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">
                    {w.dailyHoursAvailable}h / dia
                  </div>
                </div>

                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>Operadores</span>
                  </div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">
                    {w.activeOperatorsCount} ativos
                  </div>
                </div>

                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-slate-400" />
                    <span>Capacidade Nom.</span>
                  </div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">
                    {w.nominalHourlyCapacity} un/hora
                  </div>
                </div>

                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-emerald-600" />
                    <span>OEE Padrão</span>
                  </div>
                  <div className="font-mono font-bold text-emerald-700 mt-0.5">
                    {w.efficiencyRatePercent}%
                  </div>
                </div>
              </div>

              {/* Load & Bottleneck Gauge */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">Taxa de Ocupação Semanal:</span>
                  <span className="font-mono font-bold tabular-nums">
                    {loadPct}% ({assignedHours.toFixed(1)}h / {weeklyCapacity}h)
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      loadPct > 90 ? 'bg-rose-600' : loadPct > 75 ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, loadPct))}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>{assignedOps.length} OPs alocadas neste posto</span>
                  {isBottleneck ? (
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Alerta de Sobrecarga</span>
                    </span>
                  ) : (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Capacidade Disponível</span>
                    </span>
                  )}
                </div>
              </div>

              {w.notes && (
                <p className="text-[11px] text-slate-500 italic bg-slate-50/50 p-2 rounded">
                  {w.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={!!workstationToDelete}
        title="Excluir Posto de Trabalho?"
        message={
          workstationToDelete
            ? `Tem certeza que deseja excluir o posto de trabalho ${workstationToDelete.code} - ${workstationToDelete.name}? Isto afetará o cálculo de capacidade produtiva das rotas associadas.`
            : ''
        }
        confirmText="Sim, Excluir Posto"
        cancelText="Cancelar"
        icon="trash"
        isDanger={true}
        onConfirm={async () => {
          if (workstationToDelete) {
            const id = workstationToDelete.id;
            setWorkstationToDelete(null);
            await onDeleteWorkstation(id);
          }
        }}
        onCancel={() => setWorkstationToDelete(null)}
      />
    </div>
  );
};
