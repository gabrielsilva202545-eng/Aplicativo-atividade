import React, { useState, useEffect } from 'react';
import { Order, Client, Product, OrderItem, OrderStatus } from '../../types/pcp.ts';
import { X, ShoppingBag, Plus, Trash2, Save } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  clients: Client[];
  products: Product[];
  onSave: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  order,
  clients,
  products,
  onSave,
}) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [clientId, setClientId] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [paymentTerms, setPaymentTerms] = useState('28 DDL faturado');
  const [status, setStatus] = useState<OrderStatus>('confirmed');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setOrderNumber(order.orderNumber);
      setClientId(order.clientId);
      setOrderDate(order.orderDate);
      setDeliveryDate(order.deliveryDate);
      setItems(order.items ? [...order.items] : []);
      setPaymentTerms(order.paymentTerms || '');
      setStatus(order.status);
      setNotes(order.notes || '');
    } else {
      setOrderNumber(`PED-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      setClientId(clients[0]?.id || '');
      setOrderDate(new Date().toISOString().split('T')[0]);

      const delivery = new Date();
      delivery.setDate(delivery.getDate() + 15);
      setDeliveryDate(delivery.toISOString().split('T')[0]);

      if (products.length > 0) {
        const p = products[0];
        setItems([
          {
            id: `item-${Date.now()}`,
            productId: p.id,
            productName: p.name,
            productCode: p.code,
            quantity: 10,
            unitPrice: p.salePrice,
            totalPrice: p.salePrice * 10,
            productionOrderStatus: 'none',
          },
        ]);
      } else {
        setItems([]);
      }
      setPaymentTerms('28 DDL faturado');
      setStatus('confirmed');
      setNotes('');
    }
  }, [order, isOpen, clients, products]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (products.length === 0) return;
    const p = products[0];
    const newItem: OrderItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      productId: p.id,
      productName: p.name,
      productCode: p.code,
      quantity: 5,
      unitPrice: p.salePrice,
      totalPrice: p.salePrice * 5,
      productionOrderStatus: 'none',
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, updates: Partial<OrderItem>) => {
    const updated = [...items];
    const current = updated[index];

    if (updates.productId) {
      const p = products.find((prod) => prod.id === updates.productId);
      if (p) {
        updates.productName = p.name;
        updates.productCode = p.code;
        updates.unitPrice = p.salePrice;
        updates.totalPrice = p.salePrice * (updates.quantity || current.quantity);
      }
    } else if (updates.quantity !== undefined || updates.unitPrice !== undefined) {
      const q = updates.quantity !== undefined ? updates.quantity : current.quantity;
      const u = updates.unitPrice !== undefined ? updates.unitPrice : current.unitPrice;
      updates.totalPrice = Number((q * u).toFixed(2));
    }

    updated[index] = { ...current, ...updates };
    setItems(updated);
  };

  const totalAmount = items.reduce((acc, it) => acc + (it.totalPrice || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Adicione pelo menos um produto ao pedido.');
      return;
    }

    const client = clients.find((c) => c.id === clientId);

    setSubmitting(true);
    try {
      await onSave({
        orderNumber,
        clientId,
        clientName: client?.tradeName || client?.name || 'Cliente',
        orderDate,
        deliveryDate,
        items,
        totalAmount: Number(totalAmount.toFixed(2)),
        paymentTerms,
        status,
        notes,
        responsibleTechnical: 'PCP / Comercial',
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <span>{order ? 'Editar Pedido de Venda' : 'Novo Pedido de Venda'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Cadastre pedidos de clientes para planejar a produção fabril
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Número do Pedido</label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Cliente</label>
              <select
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name} {c.tradeName ? `(${c.tradeName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Data do Pedido</label>
              <input
                type="date"
                required
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Data de Entrega Prometida</label>
              <input
                type="date"
                required
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Status do Pedido</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                <option value="draft">Rascunho / Orçamento</option>
                <option value="confirmed">Confirmado</option>
                <option value="in_production">Em Produção</option>
                <option value="ready">Pronto</option>
                <option value="delivered">Entregue</option>
              </select>
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="font-semibold text-slate-700">Condições Comerciais e Pagamento</label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder="Ex: 28 DDL faturado, À vista com 5% de desconto"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Itens do Pedido de Venda
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Item</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {items.map((it, idx) => (
                <div
                  key={it.id || idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 md:grid-cols-6 gap-2 text-xs items-center"
                >
                  <div className="md:col-span-3 space-y-1">
                    <label className="text-[10px] text-slate-500 block">Produto</label>
                    <select
                      value={it.productId}
                      onChange={(e) => handleUpdateItem(idx, { productId: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.code} - {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 block">Qtd</label>
                    <input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) =>
                        handleUpdateItem(idx, { quantity: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 block">Preço Unit. (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={it.unitPrice}
                      onChange={(e) =>
                        handleUpdateItem(idx, { unitPrice: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <span className="font-mono font-bold text-slate-900">
                      R$ {it.totalPrice.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-900">Valor Total do Pedido:</span>
              <span className="font-mono text-base font-bold text-blue-900 tabular-nums">
                R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-700">Observações Gerais</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruções de entrega, notas fiscais, etc."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
            />
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
              <span>{submitting ? 'Salvando...' : 'Salvar Pedido'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
