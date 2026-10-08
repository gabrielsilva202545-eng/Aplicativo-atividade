import React from 'react';
import { CompanySettings } from '../types/pcp.ts';
import { Plus, UserCheck, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  settings: CompanySettings | null;
  lowStockCount: number;
  onOpenCreateOp: () => void;
  onSelectView: (view: string) => void;
}

const VIEW_TITLES: Record<string, string> = {
  dashboard: 'Painel Geral de Produção',
  kanban: 'Acompanhamento da Produção (Kanban)',
  orders: 'Gestão de Pedidos de Venda',
  products: 'Ficha Técnica (BOM) & Produtos',
  materials: 'Almoxarifado & Matérias-Primas',
  workstations: 'Capacidade Produtiva & Postos',
  entities: 'Clientes & Fornecedores',
  reports: 'Relatórios de Acompanhamento',
  settings: 'Configurações & Responsável Técnico',
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  settings,
  lowStockCount,
  onOpenCreateOp,
  onSelectView,
}) => {
  return (
    <header className="no-print h-16 border-b border-slate-200 bg-white sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectView('dashboard');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2 hover:text-blue-700 transition-colors"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
          PCP Master
        </a>

        <div className="hidden md:flex items-center text-sm text-slate-500 gap-2 pl-4 border-l border-slate-200">
          <span>Sistema Integrado de PCP</span>
          <span aria-hidden="true" className="text-slate-300">/</span>
          <span className="font-medium text-slate-800">{VIEW_TITLES[currentView] || 'Produção'}</span>
        </div>
      </div>

      {/* Zone 2: Navigation Links or Contextual Signals */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-slate-600">
        {lowStockCount > 0 && (
          <button
            onClick={() => onSelectView('materials')}
            className="flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-medium transition-colors"
            title={`${lowStockCount} matérias-primas com estoque abaixo do mínimo`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{lowStockCount} Insumos em Alerta</span>
          </button>
        )}

        <button
          onClick={() => onSelectView('settings')}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors"
          title="Clique para editar o Responsável Técnico"
        >
          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-700 font-medium">Resp. Técnico:</span>
          <span className="text-slate-900">{settings?.technicalResponsibleName || 'Eng. Responsável'}</span>
        </button>
      </div>

      {/* Zone 3: 1-2 Primary Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenCreateOp}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Emitir Ordem de Produção</span>
        </button>
      </div>
    </header>
  );
};
