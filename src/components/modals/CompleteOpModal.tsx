import React, { useState, useEffect } from 'react';
import { ProductionOrder, CompanySettings } from '../../types/pcp.ts';
import {
  X,
  CheckSquare,
  AlertTriangle,
  Package,
  Layers,
  UserCheck,
} from 'lucide-react';

interface CompleteOpModalProps {
  isOpen: boolean;
  onClose: () => void;
  op: ProductionOrder | null;
  settings: CompanySettings | null;
  onComplete: (payload: {
    quantityProduced: number;
    quantityScrapped: number;
    completionNotes?: string;
    technicalResponsible: string;
    deductStock?: boolean;
  }) => Promise<void>;
}

export const CompleteOpModal: React.FC<CompleteOpModalProps> = ({
  isOpen,
  onClose,
  op,
  settings,
  onComplete,
}) => {
  const [quantityProduced, setQuantityProduced] = useState<number>(op?.quantityPlanned || 0);
  const [quantityScrapped, setQuantityScrapped] = useState<number>(0);
  const [completionNotes, setCompletionNotes] = useState<string>('');
  const [technicalResponsible, setTechnicalResponsible] = useState<string>('');
  const [deductStock, setDeductStock] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (op && isOpen) {
      setQuantityProduced(op.quantityPlanned);
      setQuantityScrapped(0);
      setCompletionNotes('');
      setTechnicalResponsible(
        settings
          ? `${settings.technicalResponsibleName} - ${settings.technicalResponsibleRegistry}`
          : op.technicalResponsible || 'Responsável Técnico'
      );
      setDeductStock(true);
    }
  }, [op, settings, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onComplete({
        quantityProduced: Number(quantityProduced),
        quantityScrapped: Number(quantityScrapped),
        completionNotes,
        technicalResponsible,
        deductStock,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !op) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-emerald-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              <span>Baixa & Conclusão de Ordem de Produção</span>
            </h2>
            <p className="text-xs text-slate-500">
              Apontamento final de fábrica, liberação de estoque e laudo técnico
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
          {/* OP Summary Header */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-900 text-sm">{op.code}</span>
              <span className="font-mono text-slate-500">Lote: {op.batchNumber}</span>
            </div>
            <div className="font-medium text-slate-800">{op.productName}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-3">
              <span>Planejado: <strong>{op.quantityPlanned} {op.productUnit}</strong></span>
              {op.orderNumber && <span>Pedido: <strong>{op.orderNumber}</strong></span>}
            </div>
          </div>

          {/* Quantities Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Quantidade Aprovada (Boa) ({op.productUnit})
              </label>
              <input
                type="number"
                required
                min={0}
                value={quantityProduced}
                onChange={(e) => setQuantityProduced(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono font-bold text-emerald-800 tabular-nums text-sm"
              />
              <span className="text-[10px] text-slate-400">Entrará no estoque de produto acabado</span>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Refugo / Perdas / Sucata ({op.productUnit})
              </label>
              <input
                type="number"
                min={0}
                value={quantityScrapped}
                onChange={(e) => setQuantityScrapped(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono font-bold text-rose-700 tabular-nums text-sm"
              />
              <span className="text-[10px] text-slate-400">Peças reprovadas no controle</span>
            </div>
          </div>

          {/* Technical Responsible Sign-off */}
          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Responsável Técnico pela Liberação / Laudo</span>
            </label>
            <input
              type="text"
              required
              value={technicalResponsible}
              onChange={(e) => setTechnicalResponsible(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Completion Notes */}
          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-700">Parecer Técnico / Observações da Baixa</label>
            <textarea
              rows={2}
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="Ex: Lote inspecionado e aprovado em conformidade com as tolerâncias de projeto..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
            />
          </div>

          {/* Deduct Stock Checkbox */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={deductStock}
                onChange={(e) => setDeductStock(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-semibold text-slate-900 block">
                  Efetuar baixa física e automática de estoque
                </span>
                <span className="text-slate-500 text-[11px] block">
                  Deduz as matérias-primas utilizadas do almoxarifado conforme a ficha técnica (BOM) e adiciona {quantityProduced} {op.productUnit} ao estoque de produtos acabados.
                </span>
              </div>
            </label>
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
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <CheckSquare className="w-4 h-4" />
              <span>{submitting ? 'Concluindo...' : 'Confirmar Baixa da OP'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
