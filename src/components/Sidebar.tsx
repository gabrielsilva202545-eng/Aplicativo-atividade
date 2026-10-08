import React from 'react';
import {
  LayoutDashboard,
  Kanban,
  ShoppingBag,
  Layers,
  Boxes,
  Gauge,
  Users,
  FileText,
  Settings,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  activeOpsCount: number;
  ordersCount: number;
  lowStockCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  activeOpsCount,
  ordersCount,
  lowStockCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Painel Geral',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'kanban',
      label: 'Ordens de Produção',
      icon: Kanban,
      badge: activeOpsCount > 0 ? activeOpsCount : null,
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'orders',
      label: 'Pedidos de Venda',
      icon: ShoppingBag,
      badge: ordersCount > 0 ? ordersCount : null,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'products',
      label: 'Ficha Técnica & Produtos',
      icon: Layers,
      badge: null,
    },
    {
      id: 'materials',
      label: 'Matérias-Primas',
      icon: Boxes,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeColor: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'workstations',
      label: 'Capacidade Produtiva',
      icon: Gauge,
      badge: null,
    },
    {
      id: 'entities',
      label: 'Clientes & Fornecedores',
      icon: Users,
      badge: null,
    },
    {
      id: 'reports',
      label: 'Relatórios de PCP',
      icon: FileText,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Configurações & Resp. Téc.',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="no-print w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      <div className="p-4 border-b border-slate-800">
        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
          Módulo de Gestão
        </div>
        <div className="text-sm font-medium text-white flex items-center justify-between">
          <span>PCP & Engenharia</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge !== null && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      isActive ? 'bg-blue-700 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400">
        <div className="flex items-center justify-between text-slate-300 font-medium mb-1">
          <span>Status do Sistema</span>
          <span className="text-emerald-400">Online</span>
        </div>
        <div className="text-slate-500 text-[10px]">
          Banco de Dados Ativo · Persistência JSON
        </div>
      </div>
    </aside>
  );
};
