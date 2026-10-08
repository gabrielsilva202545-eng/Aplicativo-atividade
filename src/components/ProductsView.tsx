import React, { useState } from 'react';
import { Product, RawMaterial, Workstation } from '../types/pcp.ts';
import { ConfirmModal } from './modals/ConfirmModal.tsx';
import {
  Layers,
  Plus,
  Clock,
  DollarSign,
  Package,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  rawMaterials: RawMaterial[];
  workstations: Workstation[];
  onOpenCreateProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => Promise<void>;
  onEmitOpForProduct: (product: Product) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  rawMaterials,
  workstations,
  onOpenCreateProduct,
  onEditProduct,
  onDeleteProduct,
  onEmitOpForProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedProducts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = products.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Ficha Técnica do Produto (BOM) & Engenharia
          </h1>
          <p className="text-xs text-slate-500">
            Estrutura de materiais (Bill of Materials), tempos de processo fabril cadastrados e roteiro operacional
          </p>
        </div>

        <button
          onClick={onOpenCreateProduct}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Cadastrar Novo Produto & BOM</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Buscar produto por nome, código SKU ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        <div className="text-xs text-slate-500 font-mono">
          {filteredProducts.length} produto(s) cadastrado(s)
        </div>
      </div>

      {/* Products List with Expandable BOM details */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Nenhum produto cadastrado com os critérios pesquisados.</p>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isExpanded = !!expandedProducts[p.id];
            const workstation = workstations.find((w) => w.id === p.workstationId);

            // Compute total BOM material cost per unit
            const totalMaterialCost = (p.bom || []).reduce((acc, item) => {
              const mat = rawMaterials.find((m) => m.id === item.rawMaterialId);
              const cost = mat ? mat.unitCost * item.quantityPerUnit * (1 + (item.scrapRatePercent || 0) / 100) : 0;
              return acc + cost;
            }, 0);

            return (
              <div
                key={p.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs transition-all space-y-4"
              >
                {/* Main Product Info Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {p.code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {p.category}
                      </span>
                      <span className="text-[11px] text-slate-400">·</span>
                      <span className="text-xs text-slate-600 font-medium">
                        Unidade: {p.unit}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-3xl">
                      {p.description}
                    </p>
                  </div>

                  {/* Metrics Badges */}
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    {/* Process Time (TEMPO DE PROCESSO CADASTRADO) */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
                      <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-blue-600" />
                        <span>Tempo de Processo</span>
                      </div>
                      <div className="font-mono font-bold text-slate-900 text-sm tabular-nums mt-0.5">
                        {p.processTimeMinutes} min / un
                        <span className="text-[10px] text-slate-400 font-normal ml-1">
                          ({(p.processTimeMinutes / 60).toFixed(2)}h)
                        </span>
                      </div>
                    </div>

                    {/* Stock */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
                      <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 font-medium">
                        <Package className="w-3 h-3 text-emerald-600" />
                        <span>Estoque Acabado</span>
                      </div>
                      <div className="font-mono font-bold text-slate-900 text-sm tabular-nums mt-0.5">
                        {p.currentStock} {p.unit}
                      </div>
                    </div>

                    {/* Sale Price & Material Cost */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-right">
                      <div className="text-[10px] text-slate-500 font-medium">Preço de Venda</div>
                      <div className="font-mono font-bold text-slate-900 text-sm tabular-nums mt-0.5">
                        R$ {p.salePrice.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Custo Mat.: R$ {totalMaterialCost.toFixed(2)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                      <button
                        onClick={() => onEmitOpForProduct(p)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Emitir Ordem de Produção para este produto"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Emitir OP</span>
                      </button>

                      <button
                        onClick={() => onEditProduct(p)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Editar Produto e Ficha Técnica"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setProductToDelete(p)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Excluir Produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleExpand(p.id)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer ml-1"
                        title="Exibir Ficha Técnica Completa (BOM)"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Section: Ficha Técnica (BOM) & Roteiro de Fabricação */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-100 space-y-5">
                    {/* BOM Table */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-600" />
                          <span>Composição de Matérias-Primas (BOM por Unidade Produzida)</span>
                        </h4>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {(p.bom || []).length} componente(s) cadastrado(s)
                        </span>
                      </div>

                      <div className="overflow-x-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="py-2 px-3">Código</th>
                              <th className="py-2 px-3">Matéria-Prima</th>
                              <th className="py-2 px-3 text-right">Qtd por Unidade</th>
                              <th className="py-2 px-3 text-right">Perda Tolerada (%)</th>
                              <th className="py-2 px-3 text-right">Custo Unitário</th>
                              <th className="py-2 px-3 text-right">Custo Componente</th>
                              <th className="py-2 px-3">Observações Técnicas</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {(p.bom || []).map((item) => {
                              const rawMat = rawMaterials.find((m) => m.id === item.rawMaterialId);
                              const cost = rawMat ? rawMat.unitCost : 0;
                              const totalItemCost =
                                cost * item.quantityPerUnit * (1 + (item.scrapRatePercent || 0) / 100);

                              return (
                                <tr key={item.id} className="hover:bg-slate-50/50">
                                  <td className="py-2 px-3 font-mono font-medium text-slate-600">
                                    {rawMat?.code || item.rawMaterialCode || '-'}
                                  </td>
                                  <td className="py-2 px-3 font-medium text-slate-900">
                                    {rawMat?.name || item.rawMaterialName || 'Matéria-prima'}
                                  </td>
                                  <td className="py-2 px-3 text-right font-mono font-bold tabular-nums">
                                    {item.quantityPerUnit} {item.unit}
                                  </td>
                                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-500">
                                    {item.scrapRatePercent}%
                                  </td>
                                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                                    R$ {cost.toFixed(2)}
                                  </td>
                                  <td className="py-2 px-3 text-right font-mono font-semibold tabular-nums text-slate-900">
                                    R$ {totalItemCost.toFixed(2)}
                                  </td>
                                  <td className="py-2 px-3 text-slate-500 text-[11px] max-w-xs truncate">
                                    {item.notes || '-'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Manufacturing Steps (Roteiro de Fabricação) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>Roteiro de Fabricação & Tempos Operacionais Padronizados</span>
                        </h4>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Tempo Total: {p.processTimeMinutes} minutos
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {(p.manufacturingSteps || []).map((step) => {
                          const wst = workstations.find((w) => w.id === step.workstationId);

                          return (
                            <div
                              key={step.stepNumber}
                              className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 font-mono">
                                  Etapa {step.stepNumber}
                                </span>
                                <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                                  {step.standardTimeMinutes} min
                                </span>
                              </div>
                              <div className="font-semibold text-slate-800">
                                {step.title}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Posto: {wst?.name || 'Geral'}
                              </div>
                              {step.instructions && (
                                <p className="text-[10px] text-slate-600 pt-1 border-t border-slate-200/60 italic">
                                  "{step.instructions}"
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Technical Responsible Sign-off */}
                    <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-700">Responsável Técnico pela Ficha: </span>
                        <span>{p.technicalResponsible}</span>
                      </div>
                      <div className="font-mono text-slate-400 text-[10px]">
                        ID: {p.id}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <ConfirmModal
        isOpen={!!productToDelete}
        title="Excluir Produto & Ficha Técnica?"
        message={
          productToDelete
            ? `Tem certeza que deseja excluir o produto ${productToDelete.code} - ${productToDelete.name}? Isto também removerá sua Ficha Técnica (BOM) e roteiro produtivo.`
            : ''
        }
        confirmText="Sim, Excluir Produto"
        cancelText="Cancelar"
        icon="trash"
        isDanger={true}
        onConfirm={async () => {
          if (productToDelete) {
            const id = productToDelete.id;
            setProductToDelete(null);
            await onDeleteProduct(id);
          }
        }}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
};
