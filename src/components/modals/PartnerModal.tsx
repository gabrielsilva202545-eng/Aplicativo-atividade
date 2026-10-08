import React, { useState, useEffect } from 'react';
import { Client, Supplier } from '../../types/pcp.ts';
import { X, Users, Building, Save } from 'lucide-react';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'client' | 'supplier';
  data: Client | Supplier | null;
  onSaveClient?: (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onSaveSupplier?: (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const PartnerModal: React.FC<PartnerModalProps> = ({
  isOpen,
  onClose,
  type,
  data,
  onSaveClient,
  onSaveSupplier,
}) => {
  const isClient = type === 'client';
  const clientData = isClient ? (data as Client) : null;
  const supplierData = !isClient ? (data as Supplier) : null;

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Campinas');
  const [state, setState] = useState('SP');
  const [creditLimit, setCreditLimit] = useState<number>(50000);
  const [materialsCategory, setMaterialsCategory] = useState('');
  const [avgLeadTimeDays, setAvgLeadTimeDays] = useState<number>(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (data) {
      setCode(data.code);
      setName(data.name);
      setTradeName(data.tradeName || '');
      setDocument(data.document);
      setEmail(data.email);
      setPhone(data.phone);
      setContactPerson(data.contactPerson);
      setAddress(data.address);
      if (isClient && clientData) {
        setCity(clientData.city || '');
        setState(clientData.state || '');
        setCreditLimit(clientData.creditLimit || 50000);
      } else if (!isClient && supplierData) {
        setMaterialsCategory(supplierData.materialsCategory || '');
        setAvgLeadTimeDays(supplierData.avgLeadTimeDays || 5);
      }
    } else {
      setCode(isClient ? `CLI-0${Math.floor(10 + Math.random() * 90)}` : `FOR-0${Math.floor(10 + Math.random() * 90)}`);
      setName('');
      setTradeName('');
      setDocument('');
      setEmail('');
      setPhone('');
      setContactPerson('');
      setAddress('');
      setCity('Campinas');
      setState('SP');
      setCreditLimit(50000);
      setMaterialsCategory('Metais e Insumos');
      setAvgLeadTimeDays(5);
    }
  }, [data, isClient, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isClient && onSaveClient) {
        await onSaveClient({
          code,
          name,
          tradeName,
          document,
          email,
          phone,
          contactPerson,
          address,
          city,
          state,
          creditLimit: Number(creditLimit),
        });
      } else if (!isClient && onSaveSupplier) {
        await onSaveSupplier({
          code,
          name,
          tradeName,
          document,
          email,
          phone,
          contactPerson,
          materialsCategory,
          avgLeadTimeDays: Number(avgLeadTimeDays),
          address,
        });
      }
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
              {isClient ? <Users className="w-5 h-5 text-blue-600" /> : <Building className="w-5 h-5 text-blue-600" />}
              <span>
                {data
                  ? `Editar ${isClient ? 'Cliente' : 'Fornecedor'}`
                  : `Novo ${isClient ? 'Cliente' : 'Fornecedor'}`}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {isClient ? 'Cadastro de comprador e limite comercial' : 'Cadastro de fornecedor de matérias-primas'}
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
              <label className="font-semibold text-slate-700">CNPJ / CPF</label>
              <input
                type="text"
                required
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                placeholder="00.000.000/0001-00"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Razão Social / Nome</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Nome Fantasia</label>
              <input
                type="text"
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Pessoa de Contato</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Telefone / WhatsApp</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(19) 99999-0000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Email Corporativo</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contato@empresa.com.br"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Endereço Completo</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, bairro..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            {isClient ? (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Cidade / UF</label>
                  <div className="grid grid-cols-3 gap-1">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Cidade"
                      className="col-span-2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                    <input
                      type="text"
                      maxLength={2}
                      value={state}
                      onChange={(e) => setState(e.target.value.toUpperCase())}
                      placeholder="UF"
                      className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Limite de Crédito (R$)</label>
                  <input
                    type="number"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Categoria de Insumos</label>
                  <input
                    type="text"
                    value={materialsCategory}
                    onChange={(e) => setMaterialsCategory(e.target.value)}
                    placeholder="Ex: Metais, Eletrônicos"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Lead Time Médio (Dias)</label>
                  <input
                    type="number"
                    min={1}
                    value={avgLeadTimeDays}
                    onChange={(e) => setAvgLeadTimeDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </>
            )}
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
              <span>{submitting ? 'Salvando...' : 'Salvar Registro'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
