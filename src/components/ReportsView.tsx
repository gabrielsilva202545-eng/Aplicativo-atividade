import React, { useState } from 'react';
import {
  ProductionOrder,
  RawMaterial,
  Product,
  CompanySettings,
} from '../types/pcp.ts';
import {
  FileText,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  TrendingDown,
  Layers,
  UserCheck,
} from 'lucide-react';

interface ReportsViewProps {
  productionOrders: ProductionOrder[];
  rawMaterials: RawMaterial[];
  products: Product[];
  settings: CompanySettings | null;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  productionOrders,
  rawMaterials,
  products,
  settings,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [reportType, setReportType] = useState<'orders' | 'materials' | 'capacity'>('orders');

  const filteredOps = productionOrders.filter((op) => {
    const matchesStatus = statusFilter === 'all' || op.status === statusFilter;
    const matchesProduct = productFilter === 'all' || op.productId === productFilter;
    return matchesStatus && matchesProduct;
  });

  // KPI calculations
  const totalOps = filteredOps.length;
  const completedOps = filteredOps.filter((o) => o.status === 'completed');
  const totalProduced = filteredOps.reduce((acc, o) => acc + (o.quantityProduced || 0), 0);
  const totalScrapped = filteredOps.reduce((acc, o) => acc + (o.quantityScrapped || 0), 0);
  const totalHours = filteredOps.reduce((acc, o) => acc + (o.calculatedProcessHours || 0), 0);

  const scrapRate =
    totalProduced + totalScrapped > 0
      ? ((totalScrapped / (totalProduced + totalScrapped)) * 100).toFixed(1)
      : '0.0';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header (No print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Relatórios Gerenciais de Produção (PCP)
          </h1>
          <p className="text-xs text-slate-500">
            Acompanhamento de desempenho fabril, consumo de matérias-primas e laudos técnicos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-200/70 rounded-lg">
            <button
              onClick={() => setReportType('orders')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                reportType === 'orders'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ordens de Produção
            </button>
            <button
              onClick={() => setReportType('materials')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                reportType === 'materials'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Consumo de Insumos
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            <span>Imprimir Relatório (A4)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (No print) */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Status da OP:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Todos os Status</option>
            <option value="completed">Apenas Concluídas</option>
            <option value="in_progress">Apenas Em Produção</option>
            <option value="quality_check">Em Controle de Qualidade</option>
            <option value="queued">Na Fila</option>
            <option value="planned">Planejadas</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Produto:</span>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Todos os Produtos</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-xs text-slate-500 font-mono">
          Exibindo {filteredOps.length} ordens no relatório
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs print-container space-y-6">
        {/* Formal Report Header */}
        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-blue-800">
                {settings?.tradeName || settings?.companyName}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {reportType === 'orders'
                  ? 'Relatório Analítico de Ordens de Produção (PCP)'
                  : 'Relatório de Projeção & Consumo de Matérias-Primas'}
              </h2>
              <div className="text-xs text-slate-500 mt-1">
                {settings?.address} · CNPJ: {settings?.cnpj}
              </div>
            </div>

            <div className="text-right text-xs text-slate-500">
              <div className="font-mono">
                Data de Emissão: {new Date().toLocaleDateString('pt-BR')} às{' '}
                {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-slate-700 font-medium mt-1">
                Responsável Técnico: {settings?.technicalResponsibleName}
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                {settings?.technicalResponsibleRegistry}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Indicators Row */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          <div>
            <div className="text-slate-500 font-medium">Total de OPs Selecionadas</div>
            <div className="text-lg font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
              {totalOps} ordens
            </div>
          </div>
          <div>
            <div className="text-slate-500 font-medium">Unidades Produzidas</div>
            <div className="text-lg font-bold font-mono text-emerald-700 mt-0.5 tabular-nums">
              {totalProduced} unidades
            </div>
          </div>
          <div>
            <div className="text-slate-500 font-medium">Tempo Total Alocado</div>
            <div className="text-lg font-bold font-mono text-blue-700 mt-0.5 tabular-nums">
              {totalHours.toFixed(1)} horas
            </div>
          </div>
          <div>
            <div className="text-slate-500 font-medium">Taxa de Refugo / Perda</div>
            <div className="text-lg font-bold font-mono text-slate-800 mt-0.5 tabular-nums">
              {scrapRate}% ({totalScrapped} un.)
            </div>
          </div>
        </div>

        {/* Report Content based on ReportType */}
        {reportType === 'orders' ? (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              Detalhamento das Ordens de Fabricação
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Código OP</th>
                    <th className="py-2.5 px-3">Produto & Lote</th>
                    <th className="py-2.5 px-3 text-right">Planejado</th>
                    <th className="py-2.5 px-3 text-right">Produzido</th>
                    <th className="py-2.5 px-3 text-right">Refugo</th>
                    <th className="py-2.5 px-3">Início</th>
                    <th className="py-2.5 px-3">Término</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Resp. Técnico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredOps.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-slate-400">
                        Nenhuma ordem de produção para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredOps.map((op) => (
                      <tr key={op.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">
                          {op.code}
                        </td>
                        <td className="py-2 px-3">
                          <div className="font-medium text-slate-900">{op.productName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Lote: {op.batchNumber} {op.orderNumber && `· ${op.orderNumber}`}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums">
                          {op.quantityPlanned} {op.productUnit}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                          {op.quantityProduced > 0 ? `${op.quantityProduced} ${op.productUnit}` : '-'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums text-rose-600">
                          {op.quantityScrapped > 0 ? `${op.quantityScrapped} ${op.productUnit}` : '0'}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                          {op.startDate}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                          {op.actualEndDate ? op.actualEndDate.split('T')[0] : op.estimatedEndDate}
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-semibold text-[11px]">
                            {op.status === 'completed'
                              ? 'Concluída'
                              : op.status === 'in_progress'
                              ? 'Em Produção'
                              : op.status === 'quality_check'
                              ? 'Qualidade'
                              : op.status === 'queued'
                              ? 'Na Fila'
                              : 'Planejada'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[11px] text-slate-600 truncate max-w-[150px]">
                          {op.technicalResponsible ? op.technicalResponsible.split('-')[0].trim() : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Materials Projection */
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              Projeção de Insumos & Necessidade de Compra
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Matéria-Prima</th>
                    <th className="py-2.5 px-3">Unidade</th>
                    <th className="py-2.5 px-3 text-right">Estoque Físico</th>
                    <th className="py-2.5 px-3 text-right">Estoque Mínimo</th>
                    <th className="py-2.5 px-3 text-right">Custo Unitário</th>
                    <th className="py-2.5 px-3 text-right">Valor Total em Estoque</th>
                    <th className="py-2.5 px-3 text-center">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {rawMaterials.map((m) => {
                    const isLow = m.currentStock <= m.minStock;
                    const totalVal = m.currentStock * m.unitCost;

                    return (
                      <tr key={m.id}>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">{m.code}</td>
                        <td className="py-2 px-3 font-medium text-slate-900">{m.name}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{m.unit}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold tabular-nums">
                          {m.currentStock}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-500">
                          {m.minStock}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums">
                          R$ {m.unitCost.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold tabular-nums">
                          R$ {totalVal.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {isLow ? (
                            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                              Abaixo do Mínimo
                            </span>
                          ) : (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-medium">
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Technical Responsible Sign-off Box */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 items-end">
          <div className="text-xs text-slate-500 space-y-1">
            <p>
              Documento emitido pelo sistema integrado de Planejamento e Controle da Produção.
            </p>
            <p className="font-mono text-[10px] text-slate-400">
              Autenticação de Relatório: PCP-REP-{Date.now().toString(36).toUpperCase()}
            </p>
          </div>

          <div className="text-center">
            <div className="border-b border-slate-900 pb-1 w-64 mx-auto">
              <span className="text-xs font-bold text-slate-900 block">
                {settings?.technicalResponsibleName}
              </span>
              <span className="text-[11px] text-slate-600 block">
                {settings?.technicalResponsibleRole}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block">
                {settings?.technicalResponsibleRegistry}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
              Assinatura do Responsável Técnico
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
