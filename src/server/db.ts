import fs from 'fs';
import path from 'path';
import { DatabaseSchema, Product, RawMaterial, Client, Supplier, Workstation, Order, ProductionOrder, CompanySettings, StockMovement } from '../types/pcp.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

const defaultSettings: CompanySettings = {
  companyName: 'Indústria Metalmecânica Precision Ltda.',
  tradeName: 'Precision Tech - Indústria & PCP',
  cnpj: '14.892.350/0001-84',
  ie: '118.293.440.110',
  address: 'Av. das Indústrias, 1420 - Distrito Industrial - Campinas / SP - CEP 13054-700',
  phone: '(19) 3840-9200',
  email: 'pcp@precisiontech.ind.br',
  technicalResponsibleName: 'Eng. Marcelo Silveira',
  technicalResponsibleRole: 'Responsável Técnico / Engenheiro de Produção',
  technicalResponsibleRegistry: 'CREA 5069281740/SP',
  standardWorkingHoursPerDay: 8,
  currency: 'BRL',
};

const seedData: DatabaseSchema = {
  settings: defaultSettings,
  workstations: [
    {
      id: 'wst-1',
      code: 'PST-01',
      name: 'Corte e Perfilação',
      sector: 'Preparação',
      dailyHoursAvailable: 8,
      activeOperatorsCount: 2,
      nominalHourlyCapacity: 30,
      efficiencyRatePercent: 92,
      status: 'operational',
      notes: 'Serra fita automática e guilhotina hidráulica.',
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'wst-2',
      code: 'PST-02',
      name: 'Usinagem e Furação CNC',
      sector: 'Mecânica',
      dailyHoursAvailable: 16,
      activeOperatorsCount: 3,
      nominalHourlyCapacity: 20,
      efficiencyRatePercent: 88,
      status: 'operational',
      notes: 'Centro de usinagem 3 eixos e furadeira fresadora.',
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'wst-3',
      code: 'PST-03',
      name: 'Solda TIG / Caldeiraria Leve',
      sector: 'Estruturas',
      dailyHoursAvailable: 8,
      activeOperatorsCount: 2,
      nominalHourlyCapacity: 15,
      efficiencyRatePercent: 85,
      status: 'operational',
      notes: 'Mesa de soldagem ótica com exaustão pontual.',
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'wst-4',
      code: 'PST-04',
      name: 'Pintura Eletrostática a Pó',
      sector: 'Acabamento',
      dailyHoursAvailable: 8,
      activeOperatorsCount: 2,
      nominalHourlyCapacity: 40,
      efficiencyRatePercent: 90,
      status: 'operational',
      notes: 'Cabine contínua e estufa de polimerização a 200°C.',
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'wst-5',
      code: 'PST-05',
      name: 'Montagem Eletromecânica',
      sector: 'Montagem Final',
      dailyHoursAvailable: 8,
      activeOperatorsCount: 4,
      nominalHourlyCapacity: 22,
      efficiencyRatePercent: 95,
      status: 'operational',
      notes: 'Bancadas antiestáticas ESD e parafusadeiras pneumáticas.',
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'wst-6',
      code: 'PST-06',
      name: 'Inspeção de Qualidade & Embalagem',
      sector: 'Qualidade',
      dailyHoursAvailable: 8,
      activeOperatorsCount: 2,
      nominalHourlyCapacity: 45,
      efficiencyRatePercent: 98,
      status: 'operational',
      notes: 'Giga de teste elétrico, hi-pot e balança de precisão.',
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
    },
  ],
  suppliers: [
    {
      id: 'sup-1',
      code: 'FOR-001',
      name: 'AluMax Extrusão de Alumínio Ltda',
      tradeName: 'AluMax Metais',
      document: '04.123.890/0001-44',
      email: 'comercial@alumaxmetais.com.br',
      phone: '(19) 3456-7890',
      contactPerson: 'Roberto Prado',
      materialsCategory: 'Perfis e Chapas Metálicas',
      avgLeadTimeDays: 7,
      address: 'Rua do Cobre, 450 - Indaiatuba / SP',
      notes: 'Fornecedor certificado ISO 9001.',
      createdAt: '2026-09-02T10:00:00Z',
      updatedAt: '2026-09-02T10:00:00Z',
    },
    {
      id: 'sup-2',
      code: 'FOR-002',
      name: 'EletroComponentes Brasil S/A',
      tradeName: 'EletroComp',
      document: '61.455.901/0001-20',
      email: 'vendas@eletrocomp.ind.br',
      phone: '(11) 4002-8922',
      contactPerson: 'Camila Duarte',
      materialsCategory: 'Componentes Eletrônicos & LEDs',
      avgLeadTimeDays: 5,
      address: 'Av. Santo Amaro, 2100 - São Paulo / SP',
      notes: 'Entrega pontual semanal às terças.',
      createdAt: '2026-09-02T10:00:00Z',
      updatedAt: '2026-09-02T10:00:00Z',
    },
    {
      id: 'sup-3',
      code: 'FOR-003',
      name: 'FixaTudo Parafusos e Fixadores Industriais',
      tradeName: 'FixaTudo',
      document: '18.990.123/0001-88',
      email: 'pedidos@fixatudo.com.br',
      phone: '(19) 3211-5500',
      contactPerson: 'Carlos Eduardo',
      materialsCategory: 'Fixadores, Parafusos e Rebites',
      avgLeadTimeDays: 3,
      address: 'Rodovia Anhanguera, km 104 - Campinas / SP',
      notes: 'Prazo flexível e faturamento 30 dias.',
      createdAt: '2026-09-02T10:00:00Z',
      updatedAt: '2026-09-02T10:00:00Z',
    },
    {
      id: 'sup-4',
      code: 'FOR-004',
      name: 'Polimer Tintas e Revestimentos Especiais',
      tradeName: 'Polimer Tintas',
      document: '29.330.450/0001-12',
      email: 'atendimento@polimertintas.com.br',
      phone: '(11) 3660-1200',
      contactPerson: 'Fernanda Lima',
      materialsCategory: 'Tintas em Pó e Químicos',
      avgLeadTimeDays: 4,
      address: 'Av. dos Estados, 3400 - Santo André / SP',
      notes: 'Tintas RAL normalizadas com laudo técnico.',
      createdAt: '2026-09-02T10:00:00Z',
      updatedAt: '2026-09-02T10:00:00Z',
    },
  ],
  clients: [
    {
      id: 'cli-1',
      code: 'CLI-001',
      name: 'LogiLog Centros de Distribuição Ltda',
      tradeName: 'LogiLog Armazéns',
      document: '08.777.654/0001-32',
      email: 'compras@logilog.com.br',
      phone: '(11) 3290-8800',
      contactPerson: 'Juliana Mendes',
      address: 'Rod. dos Bandeirantes, s/n - Galpão 4',
      city: 'Jundiaí',
      state: 'SP',
      creditLimit: 150000,
      notes: 'Cliente preferencial com demanda contínua de luminárias e suportes.',
      createdAt: '2026-09-05T09:00:00Z',
      updatedAt: '2026-09-05T09:00:00Z',
    },
    {
      id: 'cli-2',
      code: 'CLI-002',
      name: 'AgroForte Equipamentos Agrícolas S/A',
      tradeName: 'AgroForte Indústria',
      document: '15.420.910/0001-99',
      email: 'engenharia@agroforte.com.br',
      phone: '(16) 3320-1100',
      contactPerson: 'Marcos Vinicius',
      address: 'Distrito Agroindustrial, Lote 12',
      city: 'Ribeirão Preto',
      state: 'SP',
      creditLimit: 220000,
      notes: 'Exige laudo de inspeção e teste de isolamento junto à entrega.',
      createdAt: '2026-09-05T09:00:00Z',
      updatedAt: '2026-09-05T09:00:00Z',
    },
    {
      id: 'cli-3',
      code: 'CLI-003',
      name: 'Varejo Brasil Supermercados & Galpões',
      tradeName: 'Rede Varejo Brasil',
      document: '21.003.541/0001-08',
      email: 'facilities@varejobrasil.com.br',
      phone: '(19) 3998-4455',
      contactPerson: 'Renata Silveira',
      address: 'Av. Barão de Itapura, 980',
      city: 'Campinas',
      state: 'SP',
      creditLimit: 85000,
      notes: 'Pedidos recorrentes para reformas de lojas.',
      createdAt: '2026-09-05T09:00:00Z',
      updatedAt: '2026-09-05T09:00:00Z',
    },
  ],
  rawMaterials: [
    {
      id: 'mp-1',
      code: 'MP-ALU-01',
      name: 'Perfil Alumínio Estrutural 40x40mm',
      description: 'Barra de liga 6063-T5 com ranhuras padronizadas para fixação.',
      unit: 'M',
      supplierId: 'sup-1',
      unitCost: 45.0,
      currentStock: 180,
      minStock: 50,
      reservedStock: 30,
      location: 'Almoxarifado Central - Rua A-01',
      leadTimeDays: 7,
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'mp-2',
      code: 'MP-LED-01',
      name: 'Módulo LED Industrial 150W 6500K',
      description: 'Placa MCPCB com 144 LEDs SMD de alta eficiência 160 lm/W.',
      unit: 'UN',
      supplierId: 'sup-2',
      unitCost: 85.0,
      currentStock: 95,
      minStock: 30,
      reservedStock: 25,
      location: 'Almoxarifado Eletrônico - Gaveta E-04',
      leadTimeDays: 5,
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'mp-3',
      code: 'MP-DRV-01',
      name: 'Driver Bivolt IP67 150W Alto FP',
      description: 'Fonte chaveada selada com proteção contra surtos 4kV.',
      unit: 'UN',
      supplierId: 'sup-2',
      unitCost: 65.0,
      currentStock: 75,
      minStock: 20,
      reservedStock: 25,
      location: 'Almoxarifado Eletrônico - Prateleira E-02',
      leadTimeDays: 5,
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'mp-4',
      code: 'MP-FIX-01',
      name: 'Kit Fixadores Inox M6x20mm com Arruelas',
      description: 'Caixa com parafusos sextavados internos, arruelas e porcas auto-travantes.',
      unit: 'CX',
      supplierId: 'sup-3',
      unitCost: 18.5,
      currentStock: 60,
      minStock: 15,
      reservedStock: 15,
      location: 'Almoxarifado Geral - Prateleira F-03',
      leadTimeDays: 3,
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'mp-5',
      code: 'MP-PNT-01',
      name: 'Tinta Pó Epóxi Ral 7035 Cinza',
      description: 'Pó eletrostático com cura rápida para acabamento industrial anti-corrosão.',
      unit: 'KG',
      supplierId: 'sup-4',
      unitCost: 32.0,
      currentStock: 48,
      minStock: 20,
      reservedStock: 10,
      location: 'Almoxarifado Químico - Tambores Q-01',
      leadTimeDays: 4,
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'mp-6',
      code: 'MP-CAB-01',
      name: 'Cabo Flexível PP 3x1.5mm 1kV',
      description: 'Cabo blindado de alta resistência para alimentação de iluminação industrial.',
      unit: 'M',
      supplierId: 'sup-2',
      unitCost: 6.8,
      currentStock: 220,
      minStock: 60,
      reservedStock: 50,
      location: 'Almoxarifado Elétrico - Rolo C-05',
      leadTimeDays: 5,
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
    },
  ],
  products: [
    {
      id: 'prd-1',
      code: 'PRD-001',
      name: 'Luminária High-Bay LED 150W Industrial IP65',
      description: 'Luminária industrial de alto rendimento para galpões e centros logísticos com dissipador térmico em alumínio extrudado.',
      category: 'Iluminação Industrial',
      unit: 'UN',
      salePrice: 385.0,
      estimatedCost: 245.5,
      processTimeMinutes: 45, // 0.75h por unidade
      workstationId: 'wst-5',
      currentStock: 12,
      minStock: 10,
      technicalResponsible: 'Eng. Marcelo Silveira - CREA 5069281740/SP',
      bom: [
        {
          id: 'bom-1',
          rawMaterialId: 'mp-1',
          rawMaterialName: 'Perfil Alumínio Estrutural 40x40mm',
          rawMaterialCode: 'MP-ALU-01',
          quantityPerUnit: 1.2,
          unit: 'M',
          scrapRatePercent: 3,
          notes: 'Corte no PST-01 com acabamento chanfrado',
        },
        {
          id: 'bom-2',
          rawMaterialId: 'mp-2',
          rawMaterialName: 'Módulo LED Industrial 150W 6500K',
          rawMaterialCode: 'MP-LED-01',
          quantityPerUnit: 1.0,
          unit: 'UN',
          scrapRatePercent: 1,
          notes: 'Instalação com pasta térmica de alta condutividade',
        },
        {
          id: 'bom-3',
          rawMaterialId: 'mp-3',
          rawMaterialName: 'Driver Bivolt IP67 150W Alto FP',
          rawMaterialCode: 'MP-DRV-01',
          quantityPerUnit: 1.0,
          unit: 'UN',
          scrapRatePercent: 0,
          notes: 'Fixação mecânica no compartimento superior',
        },
        {
          id: 'bom-4',
          rawMaterialId: 'mp-4',
          rawMaterialName: 'Kit Fixadores Inox M6x20mm com Arruelas',
          rawMaterialCode: 'MP-FIX-01',
          quantityPerUnit: 0.5,
          unit: 'CX',
          scrapRatePercent: 2,
          notes: 'Torque de aperto recomendado: 4.5 Nm',
        },
        {
          id: 'bom-5',
          rawMaterialId: 'mp-5',
          rawMaterialName: 'Tinta Pó Epóxi Ral 7035 Cinza',
          rawMaterialCode: 'MP-PNT-01',
          quantityPerUnit: 0.4,
          unit: 'KG',
          scrapRatePercent: 5,
          notes: 'Pintura eletrostática fosca espessura 80µm',
        },
        {
          id: 'bom-6',
          rawMaterialId: 'mp-6',
          rawMaterialName: 'Cabo Flexível PP 3x1.5mm 1kV',
          rawMaterialCode: 'MP-CAB-01',
          quantityPerUnit: 2.0,
          unit: 'M',
          scrapRatePercent: 2,
          notes: 'Comprimento útil de rabicho: 1.8 metros',
        },
      ],
      manufacturingSteps: [
        {
          stepNumber: 1,
          title: 'Corte e furação dos perfis do dissipador',
          workstationId: 'wst-1',
          standardTimeMinutes: 10,
          instructions: 'Conferir gabarito de corte de 1200mm ± 0.5mm.',
        },
        {
          stepNumber: 2,
          title: 'Tratamento de superfície e pintura eletrostática',
          workstationId: 'wst-4',
          standardTimeMinutes: 15,
          instructions: 'Desengraxe fosfatizante e cura em estufa a 200°C por 15 min.',
        },
        {
          stepNumber: 3,
          title: 'Montagem do circuito LED e fixação do Driver',
          workstationId: 'wst-5',
          standardTimeMinutes: 12,
          instructions: 'Aplicar camada uniforme de pasta térmica e parafusar com torquímetro.',
        },
        {
          stepNumber: 4,
          title: 'Teste funcional, estanqueidade IP65 e embalagem',
          workstationId: 'wst-6',
          standardTimeMinutes: 8,
          instructions: 'Burn-in elétrico de 5 min a 220V e inspeção visual do selo.',
        },
      ],
      createdAt: '2026-09-02T11:00:00Z',
      updatedAt: '2026-09-02T11:00:00Z',
    },
    {
      id: 'prd-2',
      code: 'PRD-002',
      name: 'Suporte Articulado Reforçado para Linha de Montagem',
      description: 'Braço pantográfico articulado com mola compensadora para ferramentas pneumáticas de até 5kg.',
      category: 'Estruturas Mecânicas',
      unit: 'UN',
      salePrice: 240.0,
      estimatedCost: 135.0,
      processTimeMinutes: 30, // 0.5h por unidade
      workstationId: 'wst-3',
      currentStock: 8,
      minStock: 5,
      technicalResponsible: 'Eng. Marcelo Silveira - CREA 5069281740/SP',
      bom: [
        {
          id: 'bom-201',
          rawMaterialId: 'mp-1',
          rawMaterialName: 'Perfil Alumínio Estrutural 40x40mm',
          rawMaterialCode: 'MP-ALU-01',
          quantityPerUnit: 1.8,
          unit: 'M',
          scrapRatePercent: 3,
          notes: 'Segmentos de 600mm e 1200mm',
        },
        {
          id: 'bom-202',
          rawMaterialId: 'mp-4',
          rawMaterialName: 'Kit Fixadores Inox M6x20mm com Arruelas',
          rawMaterialCode: 'MP-FIX-01',
          quantityPerUnit: 0.8,
          unit: 'CX',
          scrapRatePercent: 2,
          notes: 'Inclui mancais de bucha auto-lubrificante',
        },
        {
          id: 'bom-203',
          rawMaterialId: 'mp-5',
          rawMaterialName: 'Tinta Pó Epóxi Ral 7035 Cinza',
          rawMaterialCode: 'MP-PNT-01',
          quantityPerUnit: 0.5,
          unit: 'KG',
          scrapRatePercent: 4,
          notes: 'Camada de proteção mecânica',
        },
      ],
      manufacturingSteps: [
        {
          stepNumber: 1,
          title: 'Corte e furação das hastes articuladas',
          workstationId: 'wst-1',
          standardTimeMinutes: 10,
          instructions: 'Garantir concentricidade dos furos dos eixos articulados.',
        },
        {
          stepNumber: 2,
          title: 'Pintura a pó e cura',
          workstationId: 'wst-4',
          standardTimeMinutes: 10,
          instructions: 'Mascarar as roscas antes do processo de pintura.',
        },
        {
          stepNumber: 3,
          title: 'Montagem mecânica, ajuste de tensão da mola e embalagem',
          workstationId: 'wst-5',
          standardTimeMinutes: 10,
          instructions: 'Testar articulação em amplitude total de 180° sem folgas.',
        },
      ],
      createdAt: '2026-09-02T11:00:00Z',
      updatedAt: '2026-09-02T11:00:00Z',
    },
  ],
  orders: [
    {
      id: 'ord-1',
      orderNumber: 'PED-2026-001',
      clientId: 'cli-1',
      clientName: 'LogiLog Centros de Distribuição Ltda',
      orderDate: '2026-10-01',
      deliveryDate: '2026-10-15',
      items: [
        {
          id: 'item-1',
          productId: 'prd-1',
          productName: 'Luminária High-Bay LED 150W Industrial IP65',
          productCode: 'PRD-001',
          quantity: 25,
          unitPrice: 385.0,
          totalPrice: 9625.0,
          productionOrderStatus: 'generated',
          productionOrderId: 'op-1',
        },
      ],
      totalAmount: 9625.0,
      paymentTerms: '28 DDL faturado',
      status: 'in_production',
      notes: 'Entregar no Galpão 4 de Jundiaí com agendamento prévio.',
      responsibleTechnical: 'Eng. Marcelo Silveira - CREA 5069281740/SP',
      createdAt: '2026-10-01T14:30:00Z',
      updatedAt: '2026-10-02T09:00:00Z',
    },
    {
      id: 'ord-2',
      orderNumber: 'PED-2026-002',
      clientId: 'cli-2',
      clientName: 'AgroForte Equipamentos Agrícolas S/A',
      orderDate: '2026-10-03',
      deliveryDate: '2026-10-20',
      items: [
        {
          id: 'item-2',
          productId: 'prd-2',
          productName: 'Suporte Articulado Reforçado para Linha de Montagem',
          productCode: 'PRD-002',
          quantity: 15,
          unitPrice: 240.0,
          totalPrice: 3600.0,
          productionOrderStatus: 'generated',
          productionOrderId: 'op-2',
        },
      ],
      totalAmount: 3600.0,
      paymentTerms: '30/60 dias',
      status: 'in_production',
      notes: 'Anexar certificado de conformidade técnica assinado.',
      responsibleTechnical: 'Eng. Marcelo Silveira - CREA 5069281740/SP',
      createdAt: '2026-10-03T10:15:00Z',
      updatedAt: '2026-10-04T08:30:00Z',
    },
  ],
  productionOrders: [
    {
      id: 'op-1',
      code: 'OP-2026-001',
      orderId: 'ord-1',
      orderNumber: 'PED-2026-001',
      orderItemId: 'item-1',
      productId: 'prd-1',
      productName: 'Luminária High-Bay LED 150W Industrial IP65',
      productCode: 'PRD-001',
      productUnit: 'UN',
      quantityPlanned: 25,
      quantityProduced: 0,
      quantityScrapped: 0,
      batchNumber: 'LOT-2610-01',
      status: 'in_progress',
      priority: 'high',
      startDate: '2026-10-04',
      estimatedEndDate: '2026-10-12',
      actualStartDate: '2026-10-04T08:00:00Z',
      calculatedProcessHours: 18.75, // 25 un * 0.75h = 18.75 horas de processo
      workstationId: 'wst-5',
      workstationName: 'Montagem Eletromecânica',
      materialsRequired: [
        {
          rawMaterialId: 'mp-1',
          rawMaterialName: 'Perfil Alumínio Estrutural 40x40mm',
          rawMaterialCode: 'MP-ALU-01',
          unit: 'M',
          requiredQuantity: 30.9, // 25 * 1.2 * 1.03
          unitCost: 45.0,
          totalCost: 1390.5,
          isAvailable: true,
          currentStockAvailable: 180,
        },
        {
          rawMaterialId: 'mp-2',
          rawMaterialName: 'Módulo LED Industrial 150W 6500K',
          rawMaterialCode: 'MP-LED-01',
          unit: 'UN',
          requiredQuantity: 25.25,
          unitCost: 85.0,
          totalCost: 2146.25,
          isAvailable: true,
          currentStockAvailable: 95,
        },
        {
          rawMaterialId: 'mp-3',
          rawMaterialName: 'Driver Bivolt IP67 150W Alto FP',
          rawMaterialCode: 'MP-DRV-01',
          unit: 'UN',
          requiredQuantity: 25.0,
          unitCost: 65.0,
          totalCost: 1625.0,
          isAvailable: true,
          currentStockAvailable: 75,
        },
        {
          rawMaterialId: 'mp-4',
          rawMaterialName: 'Kit Fixadores Inox M6x20mm com Arruelas',
          rawMaterialCode: 'MP-FIX-01',
          unit: 'CX',
          requiredQuantity: 12.75,
          unitCost: 18.5,
          totalCost: 235.88,
          isAvailable: true,
          currentStockAvailable: 60,
        },
        {
          rawMaterialId: 'mp-5',
          rawMaterialName: 'Tinta Pó Epóxi Ral 7035 Cinza',
          rawMaterialCode: 'MP-PNT-01',
          unit: 'KG',
          requiredQuantity: 10.5,
          unitCost: 32.0,
          totalCost: 336.0,
          isAvailable: true,
          currentStockAvailable: 48,
        },
        {
          rawMaterialId: 'mp-6',
          rawMaterialName: 'Cabo Flexível PP 3x1.5mm 1kV',
          rawMaterialCode: 'MP-CAB-01',
          unit: 'M',
          requiredQuantity: 51.0,
          unitCost: 6.8,
          totalCost: 346.8,
          isAvailable: true,
          currentStockAvailable: 220,
        },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Corte e furação dos perfis do dissipador',
          workstationName: 'Corte e Perfilação',
          standardTimeMinutes: 250,
          isCompleted: true,
          completedAt: '2026-10-04T16:00:00Z',
          operatorName: 'Antônio Carlos',
          notes: '25 perfis cortados no padrão 1200mm.',
        },
        {
          stepNumber: 2,
          title: 'Tratamento de superfície e pintura eletrostática',
          workstationName: 'Pintura Eletrostática a Pó',
          standardTimeMinutes: 375,
          isCompleted: true,
          completedAt: '2026-10-05T17:30:00Z',
          operatorName: 'Sérgio Ramos',
          notes: 'Espessura média de 85µm aprovada.',
        },
        {
          stepNumber: 3,
          title: 'Montagem do circuito LED e fixação do Driver',
          workstationName: 'Montagem Eletromecânica',
          standardTimeMinutes: 300,
          isCompleted: false,
          notes: 'Em andamento na bancada 2.',
        },
        {
          stepNumber: 4,
          title: 'Teste funcional, estanqueidade IP65 e embalagem',
          workstationName: 'Inspeção de Qualidade & Embalagem',
          standardTimeMinutes: 200,
          isCompleted: false,
        },
      ],
      notes: 'Lote prioritário para entrega ao cliente LogiLog.',
      technicalResponsible: 'Eng. Marcelo Silveira - CREA 5069281740/SP',
      stockDeducted: false,
      createdAt: '2026-10-02T09:00:00Z',
      updatedAt: '2026-10-05T17:30:00Z',
    },
    {
      id: 'op-2',
      code: 'OP-2026-002',
      orderId: 'ord-2',
      orderNumber: 'PED-2026-002',
      orderItemId: 'item-2',
      productId: 'prd-2',
      productName: 'Suporte Articulado Reforçado para Linha de Montagem',
      productCode: 'PRD-002',
      productUnit: 'UN',
      quantityPlanned: 15,
      quantityProduced: 0,
      quantityScrapped: 0,
      batchNumber: 'LOT-2610-02',
      status: 'queued',
      priority: 'medium',
      startDate: '2026-10-08',
      estimatedEndDate: '2026-10-16',
      calculatedProcessHours: 7.5, // 15 un * 0.5h = 7.5 horas de processo
      workstationId: 'wst-3',
      workstationName: 'Solda TIG / Caldeiraria Leve',
      materialsRequired: [
        {
          rawMaterialId: 'mp-1',
          rawMaterialName: 'Perfil Alumínio Estrutural 40x40mm',
          rawMaterialCode: 'MP-ALU-01',
          unit: 'M',
          requiredQuantity: 27.81,
          unitCost: 45.0,
          totalCost: 1251.45,
          isAvailable: true,
          currentStockAvailable: 180,
        },
        {
          rawMaterialId: 'mp-4',
          rawMaterialName: 'Kit Fixadores Inox M6x20mm com Arruelas',
          rawMaterialCode: 'MP-FIX-01',
          unit: 'CX',
          requiredQuantity: 12.24,
          unitCost: 18.5,
          totalCost: 226.44,
          isAvailable: true,
          currentStockAvailable: 60,
        },
        {
          rawMaterialId: 'mp-5',
          rawMaterialName: 'Tinta Pó Epóxi Ral 7035 Cinza',
          rawMaterialCode: 'MP-PNT-01',
          unit: 'KG',
          requiredQuantity: 7.8,
          unitCost: 32.0,
          totalCost: 249.6,
          isAvailable: true,
          currentStockAvailable: 48,
        },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Corte e furação das hastes articuladas',
          workstationName: 'Corte e Perfilação',
          standardTimeMinutes: 150,
          isCompleted: false,
        },
        {
          stepNumber: 2,
          title: 'Pintura a pó e cura',
          workstationName: 'Pintura Eletrostática a Pó',
          standardTimeMinutes: 150,
          isCompleted: false,
        },
        {
          stepNumber: 3,
          title: 'Montagem mecânica, ajuste de tensão da mola e embalagem',
          workstationName: 'Montagem Eletromecânica',
          standardTimeMinutes: 150,
          isCompleted: false,
        },
      ],
      notes: 'Liberar após conclusão da preparação de cortes.',
      technicalResponsible: 'Eng. Marcelo Silveira - CREA 5069281740/SP',
      stockDeducted: false,
      createdAt: '2026-10-04T08:30:00Z',
      updatedAt: '2026-10-04T08:30:00Z',
    },
    {
      id: 'op-0',
      code: 'OP-2026-000',
      orderId: null,
      orderNumber: null,
      productId: 'prd-1',
      productName: 'Luminária High-Bay LED 150W Industrial IP65',
      productCode: 'PRD-001',
      productUnit: 'UN',
      quantityPlanned: 10,
      quantityProduced: 10,
      quantityScrapped: 0,
      batchNumber: 'LOT-2609-09',
      status: 'completed',
      priority: 'medium',
      startDate: '2026-09-25',
      estimatedEndDate: '2026-09-28',
      actualStartDate: '2026-09-25T08:00:00Z',
      actualEndDate: '2026-09-28T16:45:00Z',
      calculatedProcessHours: 7.5,
      workstationId: 'wst-5',
      workstationName: 'Montagem Eletromecânica',
      materialsRequired: [],
      steps: [
        {
          stepNumber: 1,
          title: 'Corte e furação dos perfis do dissipador',
          workstationName: 'Corte e Perfilação',
          standardTimeMinutes: 100,
          isCompleted: true,
          completedAt: '2026-09-25T14:00:00Z',
          operatorName: 'Antônio Carlos',
        },
        {
          stepNumber: 2,
          title: 'Tratamento de superfície e pintura eletrostática',
          workstationName: 'Pintura Eletrostática a Pó',
          standardTimeMinutes: 150,
          isCompleted: true,
          completedAt: '2026-09-26T16:00:00Z',
          operatorName: 'Sérgio Ramos',
        },
        {
          stepNumber: 3,
          title: 'Montagem do circuito LED e fixação do Driver',
          workstationName: 'Montagem Eletromecânica',
          standardTimeMinutes: 120,
          isCompleted: true,
          completedAt: '2026-09-27T17:00:00Z',
          operatorName: 'Rodrigo Paes',
        },
        {
          stepNumber: 4,
          title: 'Teste funcional, estanqueidade IP65 e embalagem',
          workstationName: 'Inspeção de Qualidade & Embalagem',
          standardTimeMinutes: 80,
          isCompleted: true,
          completedAt: '2026-09-28T16:30:00Z',
          operatorName: 'Marcelo Silveira',
        },
      ],
      notes: 'Produção para estoque de segurança concluída com 100% de aprovação.',
      technicalResponsible: 'Eng. Marcelo Silveira - CREA 5069281740/SP',
      completionNotes: 'Lote testado no hi-pot sem nenhuma fuga de corrente. Estoque liberado.',
      stockDeducted: true,
      createdAt: '2026-09-24T10:00:00Z',
      updatedAt: '2026-09-28T16:45:00Z',
    },
  ],
  stockMovements: [
    {
      id: 'mov-1',
      type: 'PRODUCTION_CONSUMPTION',
      itemType: 'raw_material',
      itemId: 'mp-1',
      itemName: 'Perfil Alumínio Estrutural 40x40mm',
      quantity: 12.36,
      unit: 'M',
      referenceType: 'PRODUCTION_ORDER',
      referenceId: 'op-0',
      technicalResponsible: 'Eng. Marcelo Silveira - CREA 5069281740/SP',
      notes: 'Baixa de matéria-prima por conclusão da OP-2026-000',
      timestamp: '2026-09-28T16:45:00Z',
    },
    {
      id: 'mov-2',
      type: 'PRODUCTION_ENTRY',
      itemType: 'product',
      itemId: 'prd-1',
      itemName: 'Luminária High-Bay LED 150W Industrial IP65',
      quantity: 10,
      unit: 'UN',
      referenceType: 'PRODUCTION_ORDER',
      referenceId: 'op-0',
      technicalResponsible: 'Eng. Marcelo Silveira - CREA 5069281740/SP',
      notes: 'Entrada de produto acabado no estoque - Lote LOT-2609-09',
      timestamp: '2026-09-28T16:45:00Z',
    },
  ],
};

export class Database {
  private static instance: Database;
  private data: DatabaseSchema;
  private isSaving = false;

  private constructor() {
    this.ensureDataDir();
    this.data = this.load();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private ensureDataDir(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all required collections exist
        return {
          settings: { ...defaultSettings, ...(parsed.settings || {}) },
          products: parsed.products || [],
          rawMaterials: parsed.rawMaterials || [],
          clients: parsed.clients || [],
          suppliers: parsed.suppliers || [],
          workstations: parsed.workstations || [],
          orders: parsed.orders || [],
          productionOrders: parsed.productionOrders || [],
          stockMovements: parsed.stockMovements || [],
        };
      }
    } catch (err) {
      console.error('Error loading database, initializing with seed data:', err);
    }

    this.saveDirect(seedData);
    return JSON.parse(JSON.stringify(seedData));
  }

  private saveDirect(data: DatabaseSchema): void {
    try {
      this.ensureDataDir();
      const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Error writing database to disk:', err);
    }
  }

  public save(): void {
    if (this.isSaving) return;
    this.isSaving = true;
    try {
      this.saveDirect(this.data);
    } finally {
      this.isSaving = false;
    }
  }

  public resetToDefault(): DatabaseSchema {
    this.data = JSON.parse(JSON.stringify(seedData));
    this.save();
    return this.data;
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  // Settings
  public getSettings(): CompanySettings {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<CompanySettings>): CompanySettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.save();
    return this.data.settings;
  }

  // Products
  public getProducts(): Product[] {
    return this.data.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  public createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const id = `prd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.data.products.push(newProduct);
    this.save();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.products[index];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    const deleted = this.data.products.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Raw Materials
  public getRawMaterials(): RawMaterial[] {
    return this.data.rawMaterials;
  }

  public getRawMaterialById(id: string): RawMaterial | undefined {
    return this.data.rawMaterials.find((m) => m.id === id);
  }

  public createRawMaterial(data: Omit<RawMaterial, 'id' | 'createdAt' | 'updatedAt'>): RawMaterial {
    const id = `mp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newMaterial: RawMaterial = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.data.rawMaterials.push(newMaterial);
    this.save();
    return newMaterial;
  }

  public updateRawMaterial(id: string, updates: Partial<RawMaterial>): RawMaterial | null {
    const index = this.data.rawMaterials.findIndex((m) => m.id === id);
    if (index === -1) return null;
    this.data.rawMaterials[index] = {
      ...this.data.rawMaterials[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.rawMaterials[index];
  }

  public deleteRawMaterial(id: string): boolean {
    const initialLen = this.data.rawMaterials.length;
    this.data.rawMaterials = this.data.rawMaterials.filter((m) => m.id !== id);
    const deleted = this.data.rawMaterials.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Clients
  public getClients(): Client[] {
    return this.data.clients;
  }

  public createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
    const id = `cli-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newClient: Client = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.data.clients.push(newClient);
    this.save();
    return newClient;
  }

  public updateClient(id: string, updates: Partial<Client>): Client | null {
    const index = this.data.clients.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.data.clients[index] = {
      ...this.data.clients[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.clients[index];
  }

  public deleteClient(id: string): boolean {
    const initialLen = this.data.clients.length;
    this.data.clients = this.data.clients.filter((c) => c.id !== id);
    const deleted = this.data.clients.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Suppliers
  public getSuppliers(): Supplier[] {
    return this.data.suppliers;
  }

  public createSupplier(data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Supplier {
    const id = `sup-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newSupplier: Supplier = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.data.suppliers.push(newSupplier);
    this.save();
    return newSupplier;
  }

  public updateSupplier(id: string, updates: Partial<Supplier>): Supplier | null {
    const index = this.data.suppliers.findIndex((s) => s.id === id);
    if (index === -1) return null;
    this.data.suppliers[index] = {
      ...this.data.suppliers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.suppliers[index];
  }

  public deleteSupplier(id: string): boolean {
    const initialLen = this.data.suppliers.length;
    this.data.suppliers = this.data.suppliers.filter((s) => s.id !== id);
    const deleted = this.data.suppliers.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Workstations (Capacidade Produtiva)
  public getWorkstations(): Workstation[] {
    return this.data.workstations;
  }

  public createWorkstation(data: Omit<Workstation, 'id' | 'createdAt' | 'updatedAt'>): Workstation {
    const id = `wst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newWorkstation: Workstation = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.data.workstations.push(newWorkstation);
    this.save();
    return newWorkstation;
  }

  public updateWorkstation(id: string, updates: Partial<Workstation>): Workstation | null {
    const index = this.data.workstations.findIndex((w) => w.id === id);
    if (index === -1) return null;
    this.data.workstations[index] = {
      ...this.data.workstations[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.workstations[index];
  }

  public deleteWorkstation(id: string): boolean {
    const initialLen = this.data.workstations.length;
    this.data.workstations = this.data.workstations.filter((w) => w.id !== id);
    const deleted = this.data.workstations.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Orders (Pedidos)
  public getOrders(): Order[] {
    return this.data.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id);
  }

  public createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const id = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.data.orders.push(newOrder);
    this.save();
    return newOrder;
  }

  public updateOrder(id: string, updates: Partial<Order>): Order | null {
    const index = this.data.orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    this.data.orders[index] = {
      ...this.data.orders[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.orders[index];
  }

  public deleteOrder(id: string): boolean {
    const initialLen = this.data.orders.length;
    this.data.orders = this.data.orders.filter((o) => o.id !== id);
    const deleted = this.data.orders.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Production Orders (Ordens de Produção - OP)
  public getProductionOrders(): ProductionOrder[] {
    return this.data.productionOrders;
  }

  public getProductionOrderById(id: string): ProductionOrder | undefined {
    return this.data.productionOrders.find((op) => op.id === id);
  }

  public createProductionOrder(data: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>): ProductionOrder {
    const id = `op-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newOP: ProductionOrder = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    // If linked to an order, link and update the order status
    if (data.orderId) {
      const order = this.getOrderById(data.orderId);
      if (order) {
        const item = data.orderItemId
          ? (order.items || []).find((i) => i.id === data.orderItemId)
          : (order.items || []).find((i) => i.productId === data.productId);
        if (item) {
          item.productionOrderStatus = 'generated';
          item.productionOrderId = id;
          newOP.orderItemId = item.id;
        }
        order.status = 'in_production';
        order.updatedAt = now;
      }
    }

    // Reserve stock for required materials
    if (newOP.materialsRequired && Array.isArray(newOP.materialsRequired)) {
      for (const mat of newOP.materialsRequired) {
        const rawMat = this.getRawMaterialById(mat.rawMaterialId);
        if (rawMat) {
          rawMat.reservedStock = Number(((rawMat.reservedStock || 0) + (mat.requiredQuantity || 0)).toFixed(3));
          rawMat.updatedAt = now;
        }
      }
    }

    this.data.productionOrders.push(newOP);
    this.save();
    return newOP;
  }

  public updateProductionOrder(id: string, updates: Partial<ProductionOrder>): ProductionOrder | null {
    const index = this.data.productionOrders.findIndex((op) => op.id === id);
    if (index === -1) return null;
    this.data.productionOrders[index] = {
      ...this.data.productionOrders[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.productionOrders[index];
  }

  public deleteProductionOrder(id: string): boolean {
    const op = this.getProductionOrderById(id);
    if (!op) return false;

    const now = new Date().toISOString();

    // Release reserved stock if not yet completed/deducted
    if (!op.stockDeducted && op.materialsRequired) {
      for (const mat of op.materialsRequired) {
        const rawMat = this.getRawMaterialById(mat.rawMaterialId);
        if (rawMat) {
          rawMat.reservedStock = Math.max(0, Number(((rawMat.reservedStock || 0) - (mat.requiredQuantity || 0)).toFixed(3)));
          rawMat.updatedAt = now;
        }
      }
    }

    // If linked to order, revert item status
    if (op.orderId) {
      const order = this.getOrderById(op.orderId);
      if (order) {
        const item = (order.items || []).find((i) => i.productionOrderId === id || i.id === op.orderItemId);
        if (item) {
          item.productionOrderStatus = 'none';
          item.productionOrderId = null;
        }
        // Check if any other items in production
        const hasOtherOps = (order.items || []).some((i) => i.productionOrderStatus === 'generated');
        if (!hasOtherOps && order.status === 'in_production') {
          order.status = 'confirmed';
        }
        order.updatedAt = now;
      }
    }

    const initialLen = this.data.productionOrders.length;
    this.data.productionOrders = this.data.productionOrders.filter((o) => o.id !== id);
    const deleted = this.data.productionOrders.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  /**
   * Baixa e Conclusão de Ordem de Produção:
   * 1. Atualiza status para 'completed'
   * 2. Registra quantidade real produzida e refugo
   * 3. Registra apontamento do responsável técnico
   * 4. Abate matérias-primas utilizadas do estoque físico
   * 5. Dá entrada no produto acabado no estoque
   * 6. Registra as movimentações de estoque para rastreabilidade
   */
  public completeProductionOrder(
    id: string,
    payload: {
      quantityProduced: number;
      quantityScrapped: number;
      completionNotes?: string;
      technicalResponsible: string;
      deductStock?: boolean;
    }
  ): { success: boolean; productionOrder?: ProductionOrder; error?: string } {
    const op = this.getProductionOrderById(id);
    if (!op) return { success: false, error: 'Ordem de Produção não encontrada' };

    const now = new Date().toISOString();
    const shouldDeduct = payload.deductStock !== false && !op.stockDeducted;

    if (shouldDeduct) {
      // 1. Abater matérias-primas do estoque e desonerar estoque reservado
      for (const mat of op.materialsRequired || []) {
        const rawMat = this.getRawMaterialById(mat.rawMaterialId);
        if (rawMat) {
          const qtyToDeduct = Number(mat.requiredQuantity) || 0;
          rawMat.currentStock = Math.max(0, Number((rawMat.currentStock - qtyToDeduct).toFixed(3)));
          rawMat.reservedStock = Math.max(0, Number(((rawMat.reservedStock || 0) - qtyToDeduct).toFixed(3)));
          rawMat.updatedAt = now;

          // Registrar movimentação de consumo
          this.data.stockMovements.push({
            id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type: 'PRODUCTION_CONSUMPTION',
            itemType: 'raw_material',
            itemId: rawMat.id,
            itemName: rawMat.name,
            quantity: qtyToDeduct,
            unit: rawMat.unit,
            referenceType: 'PRODUCTION_ORDER',
            referenceId: op.id,
            technicalResponsible: payload.technicalResponsible || op.technicalResponsible || 'Responsável Técnico',
            notes: `Consumo apontado na conclusão da ${op.code} (${op.productName})`,
            timestamp: now,
          });
        }
      }

      // 2. Dar entrada do produto acabado no estoque
      const product = this.getProductById(op.productId);
      if (product) {
        const qtyToAdd = Number(payload.quantityProduced) || op.quantityPlanned;
        product.currentStock = Number(((product.currentStock || 0) + qtyToAdd).toFixed(2));
        product.updatedAt = now;

        // Registrar movimentação de entrada
        this.data.stockMovements.push({
          id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: 'PRODUCTION_ENTRY',
          itemType: 'product',
          itemId: product.id,
          itemName: product.name,
          quantity: qtyToAdd,
          unit: product.unit,
          referenceType: 'PRODUCTION_ORDER',
          referenceId: op.id,
          technicalResponsible: payload.technicalResponsible || op.technicalResponsible || 'Responsável Técnico',
          notes: `Entrada de produção concluída da ${op.code} - Lote ${op.batchNumber}`,
          timestamp: now,
        });
      }

      op.stockDeducted = true;
    }

    // 3. Atualizar a OP
    op.status = 'completed';
    op.quantityProduced = payload.quantityProduced;
    op.quantityScrapped = payload.quantityScrapped;
    op.completionNotes = payload.completionNotes || null;
    op.technicalResponsible = payload.technicalResponsible || op.technicalResponsible || 'Responsável Técnico';
    op.actualEndDate = now;
    op.updatedAt = now;

    // Concluir todas as etapas caso alguma estivesse pendente
    (op.steps || []).forEach((s) => {
      if (!s.isCompleted) {
        s.isCompleted = true;
        s.completedAt = now;
        s.operatorName = s.operatorName || (op.technicalResponsible ? op.technicalResponsible.split('-')[0].trim() : 'Operador');
      }
    });

    // Se estiver vinculada a um pedido, verificar se todos os itens foram concluídos
    if (op.orderId) {
      const order = this.getOrderById(op.orderId);
      if (order) {
        const item = op.orderItemId
          ? (order.items || []).find((i) => i.id === op.orderItemId)
          : (order.items || []).find((i) => i.productId === op.productId);
        if (item) {
          item.productionOrderStatus = 'completed';
        }
        const allCompleted = (order.items || []).every((i) => i.productionOrderStatus === 'completed');
        if (allCompleted) {
          order.status = 'ready';
        }
        order.updatedAt = now;
      }
    }

    this.save();
    return { success: true, productionOrder: op };
  }

  // Stock Movements
  public getStockMovements(): StockMovement[] {
    return this.data.stockMovements;
  }
}
