import React from 'react';
import { ProductionOrder, CompanySettings } from '../../types/pcp.ts';
import {
  X,
  Printer,
  CheckSquare,
  Clock,
  Layers,
  Calendar,
  UserCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface OpDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  op: ProductionOrder | null;
  settings: CompanySettings | null;
  onOpenPrint: (op: ProductionOrder) => void;
  onOpenComplete: (op: ProductionOrder) => void;
  onToggleStep: (opId: string, stepNumber: number, isCompleted: boolean) => Promise<void>;
}

export const OpDetailModal: React.FC<OpDetailModalProps> = ({
  isOpen,
  onClose,
  op,
  settings,
  onOpenPrint,
  onOpenComplete,
  onToggleStep,
}) => {
  if (!isOpen || !op) return null;

  const totalSteps = (op.steps || []).length;
  const completedSteps = (op.steps || []).filter((s) => s.isCompleted).length;
  const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-900">{op.code}</span>
              <span className="text-xs text-slate-500 font-mono">Lote: {op.batchNumber}</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                {op.status === 'completed'
                  ? 'Concluída / Baixada'
                  : op.status === 'in_progress'
                  ? 'Em Produção'
                  : op.status === 'quality_check'
                  ? 'Controle de Qualidade'
                  : op.status === 'queued'
                  ? 'Na Fila'
                  : 'Planejada'}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              {op.productName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPrint(op)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Imprimir OP"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <span className="text-[10px] text-slate-500 font-medium block">Quantidade Planejada</span>
              <span className="font-mono text-sm font-bold text-slate-900">
                {op.quantityPlanned} {op.productUnit}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-medium block">Quantidade Produzida</span>
              <span className="font-mono text-sm font-bold text-emerald-700">
                {op.quantityProduced > 0 ? `${op.quantityProduced} ${op.productUnit}` : 'Em fabricação'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-medium block">Previsão de Término</span>
              <span className="font-mono text-sm font-semibold text-slate-800">
                {op.estimatedEndDate}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-medium block">Tempo de Processo</span>
              <span className="font-mono text-sm font-semibold text-blue-700">
                {op.calculatedProcessHours}h
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">
                Progresso das Etapas: {completedSteps}/{totalSteps} concluídas
              </span>
              <span className="font-mono font-bold tabular-nums">{progressPct}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  op.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-600'
                }`}
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
          </div>

          {/* Manufacturing Steps with toggle */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Roteiro de Fabricação & Apontamento de Etapas</span>
            </h3>
            <div className="space-y-2">
              {(op.steps || []).map((st) => (
                <div
                  key={st.stepNumber}
                  onClick={() => {
                    if (op.status !== 'completed') {
                      onToggleStep(op.id, st.stepNumber, !st.isCompleted);
                    }
                  }}
                  className={`p-3 border rounded-lg flex items-center justify-between transition-colors ${
                    st.isCompleted
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'hover:bg-slate-50 border-slate-200 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={st.isCompleted}
                      readOnly
                      className="rounded text-blue-600 cursor-pointer"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">
                        Etapa {st.stepNumber}: {st.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {st.workstationName} · Tempo Padrão: {st.standardTimeMinutes} min
                        {st.completedAt && ` · Concluída em ${new Date(st.completedAt).toLocaleTimeString('pt-BR')}`}
                      </div>
                    </div>
                  </div>
                  {st.isCompleted ? (
                    <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Concluída</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Pendente</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Materials Required (BOM) Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Matérias-Primas Requisitadas (Ficha Técnica)</span>
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Código</th>
                    <th className="py-2 px-3">Insumo</th>
                    <th className="py-2 px-3 text-right">Qtd Requisitada</th>
                    <th className="py-2 px-3 text-right">Saldo em Almoxarifado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {(op.materialsRequired || []).map((mat) => (
                    <tr key={mat.rawMaterialId}>
                      <td className="py-1.5 px-3 font-mono font-medium">{mat.rawMaterialCode}</td>
                      <td className="py-1.5 px-3 font-medium">{mat.rawMaterialName}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold tabular-nums">
                        {mat.requiredQuantity} {mat.unit}
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono tabular-nums">
                        {mat.currentStockAvailable} {mat.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Technical Responsible and Notes */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800">Responsável Técnico Homologado:</span>
              <span className="text-slate-900">{op.technicalResponsible}</span>
            </div>
            {op.stockDeducted && (
              <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Estoque Baixado Automaticamente
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => onOpenPrint(op)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Imprimir OP (A4)</span>
          </button>

          <div className="flex items-center gap-2">
            {op.status !== 'completed' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenComplete(op);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Dar Baixa / Finalizar Produção</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
