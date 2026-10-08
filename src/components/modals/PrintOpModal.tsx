import React from 'react';
import { ProductionOrder, CompanySettings } from '../../types/pcp.ts';
import { X, Printer, CheckCircle, Clock, ShieldCheck } from 'lucide-react';

interface PrintOpModalProps {
  isOpen: boolean;
  onClose: () => void;
  op: ProductionOrder | null;
  settings: CompanySettings | null;
}

export const PrintOpModal: React.FC<PrintOpModalProps> = ({
  isOpen,
  onClose,
  op,
  settings,
}) => {
  if (!isOpen || !op) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl my-8 overflow-hidden print-container">
        {/* Modal Controls (No print) */}
        <div className="no-print px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-100">
          <div className="text-xs text-slate-600 font-medium flex items-center gap-2">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Visualização de Impressão da Ordem de Produção (Formato A4)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Ordem de Produção</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 text-slate-900 space-y-5 bg-white print:p-0">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
            <div className="space-y-0.5">
              <div className="text-base font-bold uppercase tracking-wide text-slate-900">
                {settings?.companyName}
              </div>
              <div className="text-xs font-semibold text-blue-800">
                {settings?.tradeName} · Sistema de Gestão Industrial (PCP)
              </div>
              <div className="text-[11px] text-slate-600">
                {settings?.address} · Fone: {settings?.phone}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                CNPJ: {settings?.cnpj} · IE: {settings?.ie}
              </div>
            </div>

            <div className="text-right">
              <div className="px-3 py-1 bg-slate-900 text-white rounded font-mono font-bold text-sm tracking-wider inline-block">
                ORDEM DE PRODUÇÃO
              </div>
              <div className="font-mono text-xl font-black text-slate-900 mt-1">
                {op.code}
              </div>
              <div className="text-[11px] font-mono text-slate-600">
                Lote: <strong>{op.batchNumber}</strong>
              </div>
            </div>
          </div>

          {/* Identification Grid */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 border border-slate-300 rounded text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Produto</span>
              <span className="font-bold text-slate-900 block">{op.productName}</span>
              <span className="font-mono text-[11px] text-slate-600">SKU: {op.productCode}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Qtd Planejada</span>
              <span className="font-mono text-base font-bold text-blue-700 block">
                {op.quantityPlanned} {op.productUnit}
              </span>
              <span className="text-[10px] text-slate-500">
                Tempo Estimado: {op.calculatedProcessHours}h
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Cronograma</span>
              <span className="text-[11px] block">Início: <strong>{op.startDate}</strong></span>
              <span className="text-[11px] block">Término: <strong>{op.estimatedEndDate}</strong></span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Origem / Prioridade</span>
              <span className="text-[11px] font-medium block">
                {op.orderNumber ? `Pedido ${op.orderNumber}` : 'Para Estoque'}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-700">
                Prioridade: {op.priority.toUpperCase()}
              </span>
            </div>
          </div>

          {/* BOM Section: Materials Required */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between border-b border-slate-300 pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                1. Requisição de Matérias-Primas (Ficha Técnica / Almoxarifado)
              </h3>
              <span className="text-[10px] text-slate-500">
                Separar insumos antes do início da montagem
              </span>
            </div>

            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold border-b border-slate-300 text-[11px]">
                <tr>
                  <th className="py-1.5 px-2 border-r border-slate-300">Código</th>
                  <th className="py-1.5 px-2 border-r border-slate-300">Descrição do Insumo</th>
                  <th className="py-1.5 px-2 text-right border-r border-slate-300">Qtd Requisitada</th>
                  <th className="py-1.5 px-2 text-center border-r border-slate-300">Lote Separado</th>
                  <th className="py-1.5 px-2 text-center">Visto Almoxarife</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {op.materialsRequired.map((mat) => (
                  <tr key={mat.rawMaterialId}>
                    <td className="py-1.5 px-2 font-mono text-[11px] border-r border-slate-200">
                      {mat.rawMaterialCode}
                    </td>
                    <td className="py-1.5 px-2 font-medium border-r border-slate-200">
                      {mat.rawMaterialName}
                    </td>
                    <td className="py-1.5 px-2 text-right font-mono font-bold tabular-nums border-r border-slate-200">
                      {mat.requiredQuantity} {mat.unit}
                    </td>
                    <td className="py-1.5 px-2 text-center border-r border-slate-200 font-mono text-[10px] text-slate-400">
                      [ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]
                    </td>
                    <td className="py-1.5 px-2 text-center font-mono text-[10px] text-slate-400">
                      [ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Manufacturing Steps Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between border-b border-slate-300 pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                2. Roteiro Operacional de Fabricação & Apontamentos de Chão de Fábrica
              </h3>
              <span className="text-[10px] text-slate-500">
                Apontar tempos e assinar ao término de cada fase
              </span>
            </div>

            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold border-b border-slate-300 text-[11px]">
                <tr>
                  <th className="py-1.5 px-2 border-r border-slate-300 w-12 text-center">Etapa</th>
                  <th className="py-1.5 px-2 border-r border-slate-300">Operação / Posto de Trabalho</th>
                  <th className="py-1.5 px-2 text-right border-r border-slate-300 w-24">Tempo Pad.</th>
                  <th className="py-1.5 px-2 text-center border-r border-slate-300 w-28">Início (Hora)</th>
                  <th className="py-1.5 px-2 text-center border-r border-slate-300 w-28">Fim (Hora)</th>
                  <th className="py-1.5 px-2 text-center w-32">Visto Operador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {op.steps.map((st) => (
                  <tr key={st.stepNumber}>
                    <td className="py-2 px-2 text-center font-bold font-mono border-r border-slate-200">
                      {st.stepNumber}
                    </td>
                    <td className="py-2 px-2 border-r border-slate-200">
                      <div className="font-semibold text-slate-900">{st.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Posto: {st.workstationName}
                      </div>
                    </td>
                    <td className="py-2 px-2 text-right font-mono tabular-nums border-r border-slate-200">
                      {st.standardTimeMinutes} min
                    </td>
                    <td className="py-2 px-2 text-center border-r border-slate-200 font-mono text-[10px] text-slate-400">
                      ___:___
                    </td>
                    <td className="py-2 px-2 text-center border-r border-slate-200 font-mono text-[10px] text-slate-400">
                      ___:___
                    </td>
                    <td className="py-2 px-2 text-center border-slate-200 font-mono text-[10px] text-slate-400">
                      {st.operatorName || '________________'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Operational Notes */}
          {op.notes && (
            <div className="p-2.5 bg-slate-50 border border-slate-300 rounded text-xs space-y-0.5">
              <span className="font-bold text-[10px] uppercase text-slate-600 block">
                Observações de Produção / Instruções Específicas:
              </span>
              <p className="text-slate-800">{op.notes}</p>
            </div>
          )}

          {/* Quality & Signatures Block */}
          <div className="border border-slate-300 rounded p-4 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="p-2 border border-dashed border-slate-300 rounded space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-600 block">
                  Controle de Qualidade
                </span>
                <div className="text-[11px] space-y-1 text-slate-700">
                  <div>[ &nbsp; ] Aprovado Total</div>
                  <div>[ &nbsp; ] Aprovado com Ressalvas</div>
                  <div>[ &nbsp; ] Reprovado / Sucata</div>
                </div>
              </div>

              <div className="p-2 border border-dashed border-slate-300 rounded space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-600 block">
                  Apontamento Final
                </span>
                <div className="text-[11px] text-slate-700">
                  <div>Qtd Boa: ___________ {op.productUnit}</div>
                  <div>Refugo: ___________ {op.productUnit}</div>
                  <div>Data: ____/____/2026</div>
                </div>
              </div>

              <div className="p-2 border border-dashed border-slate-300 rounded space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-600 block">
                  Liberação para Expedição
                </span>
                <div className="text-[11px] text-slate-700">
                  <div>Embalado: [ &nbsp; ] Sim</div>
                  <div>Identificado: [ &nbsp; ] Sim</div>
                  <div>Data: ____/____/2026</div>
                </div>
              </div>
            </div>

            {/* Official Signatures Row */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-8 items-end">
              <div className="text-center">
                <div className="border-b border-slate-900 pb-1 w-56 mx-auto text-xs font-mono">
                  &nbsp;
                </div>
                <div className="text-[11px] font-bold text-slate-800 mt-1">
                  Operador / Líder de Produção
                </div>
                <div className="text-[10px] text-slate-500">Chão de Fábrica</div>
              </div>

              <div className="text-center">
                <div className="border-b border-slate-900 pb-1 w-64 mx-auto">
                  <span className="text-xs font-bold text-slate-900 block">
                    {op.technicalResponsible || settings?.technicalResponsibleName}
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    {settings?.technicalResponsibleRole || 'Engenheiro de Produção'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 block">
                    {settings?.technicalResponsibleRegistry}
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1 font-bold">
                  Responsável Técnico Homologador
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
