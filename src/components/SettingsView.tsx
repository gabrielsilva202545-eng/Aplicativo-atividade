import React, { useState } from 'react';
import { CompanySettings } from '../types/pcp.ts';
import {
  Settings,
  UserCheck,
  Building,
  Database,
  Save,
  RotateCcw,
  Download,
  CheckCircle,
} from 'lucide-react';

interface SettingsViewProps {
  settings: CompanySettings | null;
  onSaveSettings: (settings: CompanySettings) => Promise<void>;
  onResetDatabase: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetDatabase,
}) => {
  const [formData, setFormData] = useState<CompanySettings>(
    settings || {
      companyName: 'Indústria Metalmecânica Precision Ltda.',
      tradeName: 'Precision Tech PCP',
      cnpj: '14.892.350/0001-84',
      ie: '118.293.440.110',
      address: 'Av. das Indústrias, 1420 - Distrito Industrial - Campinas / SP',
      phone: '(19) 3840-9200',
      email: 'pcp@precisiontech.ind.br',
      technicalResponsibleName: 'Eng. Marcelo Silveira',
      technicalResponsibleRole: 'Responsável Técnico / Engenheiro de Produção',
      technicalResponsibleRegistry: 'CREA 5069281740/SP',
      standardWorkingHoursPerDay: 8,
      currency: 'BRL',
    }
  );

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveSettings(formData);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          Configurações da Empresa & Responsável Técnico
        </h1>
        <p className="text-xs text-slate-500">
          Personalize as informações da fábrica e do responsável técnico que constarão em todas as Ordens de Produção e relatórios emitidos
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Configurações salvas com sucesso! O nome do Responsável Técnico foi atualizado no sistema.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Technical Responsible Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Responsável Técnico Oficial
            </h2>
            <span className="text-[11px] text-slate-400 font-normal">
              (Impresso em Ordens de Produção, Fichas Técnicas e Relatórios)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-slate-700">Nome Completo do Responsável</label>
              <input
                type="text"
                required
                value={formData.technicalResponsibleName}
                onChange={(e) =>
                  setFormData({ ...formData, technicalResponsibleName: e.target.value })
                }
                placeholder="Ex: Eng. Marcelo Silveira"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Cargo / Função Técnica</label>
              <input
                type="text"
                required
                value={formData.technicalResponsibleRole}
                onChange={(e) =>
                  setFormData({ ...formData, technicalResponsibleRole: e.target.value })
                }
                placeholder="Ex: Engenheiro de Produção / PCP"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Registro Profissional (CREA / CRQ)</label>
              <input
                type="text"
                required
                value={formData.technicalResponsibleRegistry}
                onChange={(e) =>
                  setFormData({ ...formData, technicalResponsibleRegistry: e.target.value })
                }
                placeholder="Ex: CREA 5069281740/SP"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Dados Cadastrais da Empresa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-slate-700">Razão Social</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Nome Fantasia</label>
              <input
                type="text"
                value={formData.tradeName}
                onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">CNPJ</label>
              <input
                type="text"
                required
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Inscrição Estadual (IE)</label>
              <input
                type="text"
                value={formData.ie}
                onChange={(e) => setFormData({ ...formData, ie: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="font-medium text-slate-700">Endereço da Planta Industrial</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Telefone / Ramal</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Email do Departamento de PCP</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </form>

      {/* Database Tools Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-700" />
          <h3 className="font-bold text-slate-900">
            Armazenamento & Manutenção do Banco de Dados
          </h3>
        </div>
        <p className="text-slate-600 text-[11px]">
          Todos os cadastros, fichas técnicas, estoques e ordens de produção são salvos de forma persistente e atômica. Você pode exportar um backup completo em JSON ou reiniciar os dados com o conjunto de demonstração.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="/api/database/export"
            download="pcp-master-database.json"
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Backup (JSON)</span>
          </a>

          <button
            onClick={async () => {
              if (
                confirm(
                  'ATENÇÃO: Deseja realmente restaurar os dados de demonstração da fábrica? Suas alterações manuais serão resetadas para o modelo padrão.'
                )
              ) {
                await onResetDatabase();
              }
            }}
            className="px-3.5 py-2 text-xs font-medium text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Restaurar Dados de Fábrica / Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
