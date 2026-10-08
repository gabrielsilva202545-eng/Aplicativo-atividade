import React, { useState } from 'react';
import { Order, Client, Product, OrderItem } from '../types/pcp.ts';
import { ConfirmModal } from './modals/ConfirmModal.tsx';
import {
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  PlayCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  DollarSign,
  User,
  Calendar,
} from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  clients: Client[];
  products: Product[];
  onOpenCreateOrder: () => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => Promise<void>;
  onEmitOpFromOrder: (order: Order, item: OrderItem) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  clients,
  products,
  onOpenCreateOrder,
  onEditOrder,
  onDeleteOrder,
  onEmitOpFromOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      (ord.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ord.clientName && ord.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ord.items || []).some((it) => it.productName?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusMap: Record<string, { label: string; color: string }> = {
    draft: { label: 'Orçamento / Rascunho', color: 'bg-slate-100 text-slate-700' },
    confirmed: { label: 'Confirmado', color: 'bg-blue-50 text-blue-700 font-semibold' },
    in_production: { label: 'Em Produção', color: 'bg-amber-50 text-amber-700 font-semibold' },
    ready: { label: 'Pronto / Aguardando Envio', color: 'bg-emerald-50 text-emerald-700' },
    delivered: { label: 'Entregue / Faturado', color: 'bg-slate-800 text-white' },
    cancelled: { label: 'Cancelado', color: 'bg-rose-50 text-rose-700' },
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Gestão de Pedidos de Venda
          </h1>
          <p className="text-xs text-slate-500">
            Controle de pedidos de clientes e disparo automático de Ordens de Produção (OPs)
          </p>
        </div>

        <button
          onClick={onOpenCreateOrder}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Pedido de Venda</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por número do pedido, cliente ou produto..."
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
            <option value="confirmed">Confirmados</option>
            <option value="in_production">Em Produção</option>
            <option value="ready">Prontos</option>
            <option value="delivered">Entregues</option>
            <option value="draft">Rascunhos</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          {filteredOrders.length} pedido(s)
        </div>
      </div>

      {/* Orders List / Cards */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Nenhum pedido de venda encontrado com os filtros informados.</p>
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const statusInfo = statusMap[ord.status] || {
              label: ord.status,
              color: 'bg-slate-100 text-slate-700',
            };

            return (
              <div
                key={ord.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {ord.orderNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-800">{ord.clientName || 'Cliente'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1 font-mono text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Entrega: {ord.deliveryDate}</span>
                    </div>

                    <div className="font-mono font-bold text-slate-900 text-sm">
                      R$ {(ord.totalAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>

                    <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                      <button
                        onClick={() => onEditOrder(ord)}
                        className="p-1 text-slate-400 hover:text-slate-800 rounded transition-colors"
                        title="Editar Pedido"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setOrderToDelete(ord)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Excluir Pedido"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                      <tr>
                        <th className="py-1.5 font-semibold">Produto</th>
                        <th className="py-1.5 font-semibold text-right">Qtd</th>
                        <th className="py-1.5 font-semibold text-right">Preço Un.</th>
                        <th className="py-1.5 font-semibold text-right">Total</th>
                        <th className="py-1.5 font-semibold text-center">Status Produção (OP)</th>
                        <th className="py-1.5 font-semibold text-right">Ação PCP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {(ord.items || []).map((item) => {
                        const hasOp = item.productionOrderStatus !== 'none';
                        const isCompleted = item.productionOrderStatus === 'completed';

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-medium text-slate-900">
                              <div>{item.productName || 'Produto'}</div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {item.productCode}
                              </div>
                            </td>
                            <td className="py-2.5 text-right font-mono font-bold tabular-nums">
                              {item.quantity}
                            </td>
                            <td className="py-2.5 text-right font-mono tabular-nums text-slate-600">
                              R$ {item.unitPrice.toFixed(2)}
                            </td>
                            <td className="py-2.5 text-right font-mono font-semibold tabular-nums text-slate-900">
                              R$ {item.totalPrice.toFixed(2)}
                            </td>
                            <td className="py-2.5 text-center">
                              {isCompleted ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Produzido</span>
                                </span>
                              ) : hasOp ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                  <Clock className="w-3 h-3" />
                                  <span>OP Emitida</span>
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400">
                                  Aguardando OP
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 text-right">
                              {!hasOp ? (
                                <button
                                  onClick={() => onEmitOpFromOrder(ord, item)}
                                  className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer"
                                  title="Gerar Ordem de Produção para este item"
                                >
                                  <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Gerar OP</span>
                                </button>
                              ) : (
                                <span className="text-[11px] font-mono text-slate-500">
                                  {item.productionOrderId ? 'OP em andamento' : 'Em processo'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Notes and Payment footer */}
                {(ord.notes || ord.paymentTerms) && (
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-1">
                    {ord.paymentTerms && (
                      <div>
                        <span className="font-semibold text-slate-600">Condições: </span>
                        {ord.paymentTerms}
                      </div>
                    )}
                    {ord.notes && (
                      <div className="truncate max-w-xl">
                        <span className="font-semibold text-slate-600">Observações: </span>
                        {ord.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <ConfirmModal
        isOpen={!!orderToDelete}
        title="Excluir Pedido de Venda?"
        message={
          orderToDelete
            ? `Tem certeza que deseja excluir o pedido ${orderToDelete.orderNumber} (${orderToDelete.clientName}) no valor de R$ ${(orderToDelete.totalAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}?`
            : ''
        }
        confirmText="Sim, Excluir Pedido"
        cancelText="Cancelar"
        icon="trash"
        isDanger={true}
        onConfirm={async () => {
          if (orderToDelete) {
            const id = orderToDelete.id;
            setOrderToDelete(null);
            await onDeleteOrder(id);
          }
        }}
        onCancel={() => setOrderToDelete(null)}
      />
    </div>
  );
};
