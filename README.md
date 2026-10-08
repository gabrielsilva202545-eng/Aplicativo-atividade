# PCP Master - Sistema de Gestão e Planejamento da Produção

Sistema ERP / PCP (Planejamento e Controle da Produção) completo, responsivo e persistente para pequenas e médias indústrias.

---

## 🚀 Como Rodar a Aplicação

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo de desenvolvimento (Full-Stack Express + Vite):**
   ```bash
   npm run dev
   ```
   A aplicação será iniciada na porta `3000`: `http://localhost:3000`.

3. **Compilar para produção:**
   ```bash
   npm run build
   npm start
   ```

---

## 🏭 Estrutura e Funcionalidades

### 1. Cadastros Persistentes (CRUD Completo)
- **Ficha Técnica do Produto (BOM):**
  - Cadastro de produtos com código SKU, categoria, unidade de medida (`UN`, `KG`, `M`, etc.), preço de venda e **tempo de processo padrão cadastrado** (em minutos por unidade).
  - Composição de Matérias-Primas (BOM): quantidade necessária por unidade produzida e percentual de perda técnica tolerada (`%`).
  - Roteiro Operacional: etapas padronizadas com posto de trabalho e tempo de operação.
- **Matérias-Primas (Almoxarifado):**
  - Código, descrição, unidade, fornecedor homologado, custo unitário (R$), estoque físico atual, estoque mínimo de segurança, saldo reservado e localização no almoxarifado.
  - Alerta automático quando o saldo atinge ou fica abaixo do estoque mínimo.
- **Capacidade Produtiva:**
  - Cadastro de postos de trabalho / máquinas / setores (Usinagem, Corte, Montagem, Pintura, Qualidade).
  - Jornada diária disponível (horas/dia), operadores ativos, capacidade nominal em unidades/hora e índice de eficiência operacional (`OEE %`).
  - Monitoramento de taxa de ocupação semanal e alerta de gargalo (`> 85%`).
- **Clientes e Fornecedores:**
  - Cadastros completos com CNPJ/CPF, contatos, prazos de entrega e limites comerciais.

### 2. Gestão de Pedidos e Ordens de Produção (OP)
- **Pedidos de Venda:**
  - Emissão de pedidos com múltiplos itens, cálculo automático de totais e prazos de entrega.
  - Ação direta **"Gerar OP"** a partir de qualquer item do pedido.
- **Emissão de Ordem de Produção:**
  - Cálculo automático de insumos requeridos conforme a Ficha Técnica (BOM) multiplicada pela quantidade a produzir.
  - Verificação de estoque disponível de insumos em tempo real, alertando se faltar matéria-prima.
  - Cálculo automático do tempo total de fabricação e da previsão de término com base na capacidade horária do posto.
  - Geração automática de lote de rastreabilidade (`LOT-AAMM-XX`).
- **Acompanhamento em Tempo Real (Kanban Fabril):**
  - Esteira com 5 estágios: *Planejada*, *Na Fila*, *Em Produção*, *Controle de Qualidade* e *Concluída/Baixada*.
  - Avanço e recuo com 1 clique, checklist de etapas operacionais e indicação de progresso percentual.
- **Baixa / Conclusão de OP com Controle Físico de Estoque:**
  - Apontamento de quantidade aprovada, refugo/perdas técnicas e parecer técnico.
  - **Baixa automática:** deduz as matérias-primas consumidas do almoxarifado e dá entrada no produto acabado no estoque de produtos acabados.
  - Registro de histórico de movimentação para auditoria.

### 3. Responsável Técnico & Emissão de Documentos
- **Responsável Técnico nos Documentos:**
  - Nome completo, cargo/função e registro profissional (CREA/CRQ) configuráveis na tela de Configurações.
  - Assinatura e carimbo formal impressos em todas as Ordens de Produção, Fichas Técnicas e Relatórios.
- **Emissão e Impressão de Ordem de Produção (A4):**
  - Layout formal com cabeçalho corporativo, dados da empresa, código de barras simulado, lote, identificação do pedido, requisição de materiais da BOM, roteiro de etapas com campos de visto manual para operadores e assinatura do Responsável Técnico.
- **Relatórios Gerenciais de Produção:**
  - Filtros por período, produto e status da OP.
  - Indicadores de unidades produzidas, taxa de refugo (%), horas alocadas e consumo de matérias-primas.
  - Impressão formatada em A4 com chancela técnica.

---

## 🗄️ Estrutura do Banco de Dados Persistente (`data/database.json`)

O banco de dados utiliza armazenamento atômico com integridade transacional e persistência contínua em disco:

```typescript
interface DatabaseSchema {
  settings: CompanySettings;           // Razão social, CNPJ, dados do Responsável Técnico
  products: Product[];                 // Produtos, Ficha Técnica (BOM), Tempos e Etapas
  rawMaterials: RawMaterial[];         // Insumos, estoque físico, mínimo e custos
  clients: Client[];                   // Clientes e condições de faturamento
  suppliers: Supplier[];               // Fornecedores e prazos de entrega (lead time)
  workstations: Workstation[];         // Postos de trabalho, horas/dia, capacidade e OEE
  orders: Order[];                     // Pedidos de venda com itens e status
  productionOrders: ProductionOrder[]; // Ordens de produção, apontamentos e status
  stockMovements: StockMovement[];     // Histórico rastreável de baixas e entradas
}
```

A aplicação inclui rotas para:
- Exportar backup completo do banco em formato JSON (`/api/database/export`).
- Restaurar dados iniciais de demonstração da fábrica (`/api/database/reset`).
