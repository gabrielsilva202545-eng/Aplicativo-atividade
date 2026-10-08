import React, { useState, useEffect } from 'react';
import { Workstation } from '../../types/pcp.ts';
import { X, Gauge, Save } from 'lucide-react';

interface WorkstationModalProps {
  isOpen: boolean;
  onClose: () => void;
  workstation: Workstation | null;
  onSave: (data: Omit<Workstation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const WorkstationModal: React.FC<WorkstationModalProps> = ({
  isOpen,
  onClose,
  workstation,
  onSave,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [sector, setSector] = useState('');
  const [dailyHoursAvailable, setDailyHoursAvailable] = useState<number>(8);
  const [activeOperatorsCount, setActiveOperatorsCount] = useState<number>(2);
  const [nominalHourlyCapacity, setNominalHourlyCapacity] = useState<number>(20);
  const [efficiencyRatePercent, setEfficiencyRatePercent] = useState<number>(85);
  const [status, setStatus] = useState<Workstation['status']>('operational');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (workstation) {
      setCode(workstation.code);
      setName(workstation.name);
      setSector(workstation.sector);
      setDailyHoursAvailable(workstation.dailyHoursAvailable);
      setActiveOperatorsCount(workstation.activeOperatorsCount);
      setNominalHourlyCapacity(workstation.nominalHourlyCapacity);
      setEfficiencyRatePercent(workstation.efficiencyRatePercent);
      setStatus(workstation.status);
      setNotes(workstation.notes || '');
    } else {
      setCode(`PST-0${Math.floor(10 + Math.random() * 90)}`);
      setName('');
      setSector('Montagem');
      setDailyHoursAvailable(8);
      setActiveOperatorsCount(2);
      setNominalHourlyCapacity(25);
      setEfficiencyRatePercent(90);
      setStatus('operational');
      setNotes('');
    }
  }, [workstation, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave({
        code,
        name,
        sector,
        dailyHoursAvailable: Number(dailyHoursAvailable),
        activeOperatorsCount: Number(activeOperatorsCount),
        nominalHourlyCapacity: Number(nominalHourlyCapacity),
        efficiencyRatePercent: Number(efficiencyRatePercent),
        status,
        notes,
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
              <Gauge className="w-5 h-5 text-blue-600" />
              <span>{workstation ? 'Editar Posto de Trabalho' : 'Novo Posto de Trabalho'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Dimensionamento de capacidade e parâmetros de OEE da linha fabril
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
              <label className="font-semibold text-slate-700">Código</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Setor Produtivo</label>
              <input
                type="text"
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Ex: Usinagem, Montagem"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Nome do Posto / Linha</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Centro de Usinagem 3 Eixos"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Jornada Diária (Horas/Dia)</label>
              <input
                type="number"
                required
                min={1}
                max={24}
                value={dailyHoursAvailable}
                onChange={(e) => setDailyHoursAvailable(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Operadores Ativos</label>
              <input
                type="number"
                required
                min={1}
                value={activeOperatorsCount}
                onChange={(e) => setActiveOperatorsCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Capacidade Nominal (un/h)</label>
              <input
                type="number"
                required
                min={1}
                value={nominalHourlyCapacity}
                onChange={(e) => setNominalHourlyCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">OEE Esperado (%)</label>
              <input
                type="number"
                required
                min={10}
                max={100}
                value={efficiencyRatePercent}
                onChange={(e) => setEfficiencyRatePercent(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-emerald-700"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Status Operacional</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                <option value="operational">Operacional (Em atividade)</option>
                <option value="maintenance">Em Manutenção</option>
                <option value="inactive">Inativo / Desativado</option>
              </select>
            </div>

            <div className="col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Observações do Equipamento</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Máquina revisada em setembro/2026..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
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
              <span>{submitting ? 'Salvando...' : 'Salvar Posto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
