import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BarbeariaTenant,
  PlatformView,
  BarberTab,
  SuperAdminTab,
  AppointmentItem,
  ClientItem,
  FinanceEntry,
  AuditLogItem,
  ServiceItem,
  CutImage,
  ProfessionalItem,
  NewBarbeariaPayload,
  WebhookEventPayload,
} from '../types';
import { cutsImages, servicesList, barbeariaConfig } from '../data/barbeariaData';
import { calculateEndTime } from '../utils/bookingAvailability';

// Seeded sample tenants for multi-tenant SaaS architecture (SNAKE BARBER)
const initialTenants: BarbeariaTenant[] = [
  {
    ...barbeariaConfig,
    id: 'lupumba',
    slug: 'barbearialupumba',
    tagline: 'Estilo & Precisão em Cordeiros',
    description: 'Central Digital Oficial. Cortes de cabelo e barba com alto padrão de acabamento, pontualidade e estilo.',
    ownerEmail: 'barbeiro@lupumba.com',
    ownerName: 'Luan & Pumba Barbeiros',
    password: '123456',
    miniCentralAtiva: true,
    agendaAtiva: true,
    plan: 'Plano Pro',
    planPrice: 149.9,
    planStatus: 'ativo',
    subscriptionStatus: 'ativa',
    subscriptionId: 'sub_lupumba_2026',
    paymentId: 'pay_lupumba_confirmed',
    lastPaymentDate: '15/10/2026',
    periodStartDate: '15/10/2026',
    accessExpiresAt: '15/11/2026',
    subscriptionExpiresAt: '15/11/2026',
    memberSince: '15/01/2026',
    nextBillingDate: '15/11/2026',
    cuts: [...cutsImages],
    services: [...servicesList],
    professionals: [
      {
        id: 'prof-1',
        name: 'Luan Barbeiro',
        role: 'Master Barber / Sócio',
        phone: '(47) 99623-9122',
        commissionPercent: 60,
        isActive: true,
      },
      {
        id: 'prof-2',
        name: 'Pumba Pimentel',
        role: 'Barbeiro Especialista',
        phone: '(47) 99623-9122',
        commissionPercent: 55,
        isActive: true,
      },
    ],
  },
  {
    id: 'navalha-ouro',
    slug: 'barbearianavalhaouro',
    name: 'NAVALHA DE OURO BARBERSHOP',
    barbeiro: 'Carlos Navalha',
    responsavel: 'Carlos Alberto',
    tagline: 'Tradição e Estilo Clássico',
    description: 'Ambiente climatizado, cerveja gelada e o melhor fade da região central.',
    phone: '(47) 98877-6655',
    phoneRaw: '47988776655',
    whatsappFormatted: '(47) 98877-6655',
    whatsappNumber: '5547988776655',
    instagram: 'navalhadouro_oficial',
    instagramUrl: 'https://instagram.com',
    googleMapsUrl: 'https://maps.google.com',
    address: 'Av. Brasil, 1200',
    neighborhood: 'Centro',
    city: 'Balneário Camboriú - SC',
    hours: 'Segunda a sábado, das 09h às 21h',
    ownerEmail: 'carlos@navalhaouro.com',
    ownerName: 'Carlos Alberto',
    password: '123456',
    miniCentralAtiva: true,
    agendaAtiva: true,
    plan: 'Plano Enterprise',
    planPrice: 249.9,
    planStatus: 'ativo',
    subscriptionStatus: 'ativa',
    subscriptionId: 'sub_navalha_2026',
    paymentId: 'pay_navalha_confirmed',
    lastPaymentDate: '10/10/2026',
    periodStartDate: '10/10/2026',
    accessExpiresAt: '10/11/2026',
    subscriptionExpiresAt: '10/11/2026',
    memberSince: '10/02/2026',
    nextBillingDate: '10/11/2026',
    cuts: [...cutsImages.slice(0, 6)],
    services: [...servicesList.slice(0, 5)],
    professionals: [
      {
        id: 'prof-nav-1',
        name: 'Carlos Navalha',
        role: 'Proprietário',
        phone: '(47) 98877-6655',
        commissionPercent: 70,
        isActive: true,
      },
    ],
  },
  {
    id: 'don-corleone',
    slug: 'barbeariadoncorleone',
    name: 'DON CORLEONE BARBER CLUB',
    barbeiro: 'Vito & Enzo',
    responsavel: 'Vito Corleone',
    tagline: 'Experiência Mafiosa e Barboterapia',
    description: 'Cortes executivos, toalha quente e acabamento na navalha.',
    phone: '(47) 97766-5544',
    phoneRaw: '47977665544',
    whatsappFormatted: '(47) 97766-5544',
    whatsappNumber: '5547977665544',
    instagram: 'doncorleone_barber',
    instagramUrl: 'https://instagram.com',
    googleMapsUrl: 'https://maps.google.com',
    address: 'Rua Uruguai, 450',
    neighborhood: 'Fazenda',
    city: 'Itajaí - SC',
    hours: 'Segunda a sexta, das 10h às 20h',
    ownerEmail: 'vito@doncorleone.com',
    ownerName: 'Vito Corleone',
    password: '123456',
    miniCentralAtiva: false,
    agendaAtiva: true,
    plan: 'Plano Start',
    planPrice: 89.9,
    planStatus: 'pendente',
    subscriptionStatus: 'pendente',
    subscriptionId: 'sub_don_2026',
    paymentId: 'pay_don_pending',
    lastPaymentDate: '05/10/2026',
    periodStartDate: '05/10/2026',
    accessExpiresAt: '05/11/2026',
    subscriptionExpiresAt: '05/11/2026',
    memberSince: '05/03/2026',
    nextBillingDate: '05/11/2026',
    cuts: [...cutsImages.slice(0, 5)],
    services: [...servicesList.slice(0, 4)],
    professionals: [
      {
        id: 'prof-don-1',
        name: 'Vito Corleone',
        role: 'Master Barber',
        phone: '(47) 97766-5544',
        commissionPercent: 60,
        isActive: true,
      },
    ],
  },
  {
    id: 'kings-cut',
    slug: 'barbeariakingscut',
    name: "KING'S CUT BARBEARIA",
    barbeiro: 'Felipe Reis',
    responsavel: 'Felipe Reis',
    tagline: 'Onde o homem moderno cuida do visual',
    description: 'Atendimento rápido e descomplicado.',
    phone: '(47) 96655-4433',
    phoneRaw: '47966554433',
    whatsappFormatted: '(47) 96655-4433',
    whatsappNumber: '5547966554433',
    instagram: 'kingscut_itj',
    instagramUrl: 'https://instagram.com',
    googleMapsUrl: 'https://maps.google.com',
    address: 'Rua Reinaldo Amâncio Cabral, 88',
    neighborhood: 'São Vicente',
    city: 'Itajaí - SC',
    hours: 'Terça a sábado, das 09h às 19h',
    ownerEmail: 'felipe@kingscut.com',
    ownerName: 'Felipe Reis',
    password: '123456',
    miniCentralAtiva: false,
    agendaAtiva: false,
    plan: 'Plano Pro',
    planPrice: 149.9,
    planStatus: 'bloqueado',
    subscriptionStatus: 'suspensa',
    subscriptionId: 'sub_kings_2026',
    paymentId: 'pay_kings_overdue',
    lastPaymentDate: '12/08/2026',
    periodStartDate: '12/08/2026',
    accessExpiresAt: '12/09/2026',
    subscriptionExpiresAt: '12/09/2026',
    memberSince: '12/12/2025',
    nextBillingDate: '12/09/2026',
    cuts: [...cutsImages.slice(0, 4)],
    services: [...servicesList.slice(0, 3)],
    professionals: [
      {
        id: 'prof-king-1',
        name: 'Felipe Reis',
        role: 'Barbeiro',
        phone: '(47) 96655-4433',
        commissionPercent: 50,
        isActive: true,
      },
    ],
  },
];

const initialAppointments: AppointmentItem[] = [
  {
    id: 'apt-1',
    tenantId: 'lupumba',
    clientName: 'Mateus Oliveira',
    clientPhone: '(47) 99123-4567',
    services: ['degrade', 'barba'],
    serviceNames: 'Degradê + Barba',
    professionalId: 'prof-1',
    professionalName: 'Luan Barbeiro',
    dayLabel: 'Hoje',
    timeSlot: '09:00',
    endTimeSlot: '10:00',
    durationMinutes: 60,
    totalPrice: 65,
    paymentStatus: 'PAGO',
    paymentMethod: 'Pix',
    paidAt: '2026-10-01 08:35',
    status: 'concluido',
    createdAt: '2026-10-01 08:30',
  },
  {
    id: 'apt-2',
    tenantId: 'lupumba',
    clientName: 'Gabriel Santos',
    clientPhone: '(47) 99876-5432',
    services: ['corte-navalhado'],
    serviceNames: 'Corte Navalhado',
    professionalId: 'prof-1',
    professionalName: 'Luan Barbeiro',
    dayLabel: 'Hoje',
    timeSlot: '10:00',
    endTimeSlot: '10:45',
    durationMinutes: 45,
    totalPrice: 50,
    paymentStatus: 'PAGO',
    paymentMethod: 'Cartão',
    paidAt: '2026-10-01 09:20',
    status: 'concluido',
    createdAt: '2026-10-01 09:15',
  },
  {
    id: 'apt-3',
    tenantId: 'lupumba',
    clientName: 'Lucas Ferreira',
    clientPhone: '(47) 99234-5678',
    services: ['degrade'],
    serviceNames: 'Degradê',
    professionalId: 'prof-2',
    professionalName: 'Pumba Pimentel',
    dayLabel: 'Hoje',
    timeSlot: '13:30',
    endTimeSlot: '14:15',
    durationMinutes: 45,
    totalPrice: 50,
    paymentStatus: 'PAGO',
    paymentMethod: 'Pix',
    paidAt: '2026-10-01 10:25',
    status: 'confirmado',
    createdAt: '2026-10-01 10:20',
  },
  {
    id: 'apt-4',
    tenantId: 'lupumba',
    clientName: 'Rafael Andrade',
    clientPhone: '(47) 99765-4321',
    services: ['combo-completo'],
    serviceNames: 'Combo Lupumba Vip',
    professionalId: 'prof-1',
    professionalName: 'Luan Barbeiro',
    dayLabel: 'Hoje',
    timeSlot: '15:30',
    endTimeSlot: '16:30',
    durationMinutes: 60,
    totalPrice: 90,
    paymentStatus: 'PAGO',
    paymentMethod: 'Pix',
    paidAt: '2026-10-01 11:05',
    status: 'confirmado',
    createdAt: '2026-10-01 11:00',
  },
  {
    id: 'apt-5',
    tenantId: 'lupumba',
    clientName: 'Thiago Costa',
    clientPhone: '(47) 99345-6789',
    services: ['corte-normal'],
    serviceNames: 'Corte Normal',
    professionalId: 'prof-1',
    professionalName: 'Luan Barbeiro',
    dayLabel: 'Hoje',
    timeSlot: '17:30',
    endTimeSlot: '18:05',
    durationMinutes: 35,
    totalPrice: 40,
    paymentStatus: 'PENDENTE',
    status: 'pendente',
    createdAt: '2026-10-01 11:30',
  },
  {
    id: 'apt-6',
    tenantId: 'lupumba',
    clientName: 'Bruno Henrique',
    clientPhone: '(47) 99456-7890',
    services: ['degrade', 'sobrancelha'],
    serviceNames: 'Degradê + Sobrancelha',
    professionalId: 'prof-2',
    professionalName: 'Pumba Pimentel',
    dayLabel: 'Amanhã',
    timeSlot: '10:00',
    endTimeSlot: '10:55',
    durationMinutes: 55,
    totalPrice: 60,
    paymentStatus: 'PAGO',
    paymentMethod: 'Pix',
    paidAt: '2026-10-01 11:50',
    status: 'confirmado',
    createdAt: '2026-10-01 11:45',
  },
];

const initialClients: ClientItem[] = [
  {
    id: 'cli-0',
    tenantId: 'lupumba',
    name: 'ruan gabriel',
    phone: '478847747488',
    totalVisits: 0,
    totalSpent: 0,
    lastVisit: 'Recente',
    favoriteService: 'Degradê Navalhado',
    instagram: '@ruahncat',
    status: 'ativo',
    fidelityPoints: 0,
  },
  {
    id: 'cli-1',
    tenantId: 'lupumba',
    name: 'Mateus Oliveira',
    phone: '(47) 99123-4567',
    totalVisits: 14,
    totalSpent: 890,
    lastVisit: 'Hoje',
    favoriteService: 'Degradê + Barba',
    instagram: '@mateus.oli',
    status: 'ativo',
    fidelityPoints: 0,
  },
  {
    id: 'cli-2',
    tenantId: 'lupumba',
    name: 'Gabriel Santos',
    phone: '(47) 99876-5432',
    totalVisits: 8,
    totalSpent: 420,
    lastVisit: 'Hoje',
    favoriteService: 'Corte Navalhado',
    instagram: '@gabrielsantos.cut',
    status: 'ativo',
    fidelityPoints: 8,
  },
  {
    id: 'cli-3',
    tenantId: 'lupumba',
    name: 'Lucas Ferreira',
    phone: '(47) 99234-5678',
    totalVisits: 6,
    totalSpent: 300,
    lastVisit: 'Há 15 dias',
    favoriteService: 'Degradê',
    instagram: '@lucas_ferr',
    status: 'ativo',
    fidelityPoints: 7,
  },
  {
    id: 'cli-4',
    tenantId: 'lupumba',
    name: 'Rafael Andrade',
    phone: '(47) 99765-4321',
    totalVisits: 19,
    totalSpent: 1650,
    lastVisit: 'Há 7 dias',
    favoriteService: 'Combo Lupumba Vip',
    instagram: '@rafael_andrade',
    status: 'ativo',
    fidelityPoints: 10,
    hasFreeCutReward: true,
    rewardsClaimed: 1,
  },
  {
    id: 'cli-5',
    tenantId: 'lupumba',
    name: 'Carlos Eduardo Silva',
    phone: '(47) 99911-2233',
    totalVisits: 3,
    totalSpent: 135,
    lastVisit: 'Há 28 dias',
    favoriteService: 'Corte Normal',
    instagram: '@carlosedu_silva',
    status: 'ativo',
    fidelityPoints: 3,
  },
];

const initialFinance: FinanceEntry[] = [
  {
    id: 'fin-1',
    tenantId: 'lupumba',
    description: 'Corte + Barba (Mateus Oliveira)',
    type: 'receita',
    amount: 65,
    category: 'Serviço',
    date: '01/10/2026',
    method: 'Pix',
  },
  {
    id: 'fin-2',
    tenantId: 'lupumba',
    description: 'Corte Navalhado (Gabriel Santos)',
    type: 'receita',
    amount: 50,
    category: 'Serviço',
    date: '01/10/2026',
    method: 'Cartão',
  },
  {
    id: 'fin-3',
    tenantId: 'lupumba',
    description: 'Pomadas modeladoras e lâminas',
    type: 'despesa',
    amount: 180,
    category: 'Estoque / Produtos',
    date: '30/09/2026',
    method: 'Pix',
  },
  {
    id: 'fin-4',
    tenantId: 'lupumba',
    description: 'Internet Fibra Óptica',
    type: 'despesa',
    amount: 120,
    category: 'Custos Fixos',
    date: '28/09/2026',
    method: 'Pix',
  },
];

const initialAudit: AuditLogItem[] = [
  {
    id: 'log-1',
    tenantId: 'lupumba',
    tenantName: 'LUPUMBA BARBEARIA',
    action: 'Criação da Mini Central',
    details: 'Mini Central pública ativada e pronta para compartilhamento.',
    performedBy: 'Sistema SaaS',
    timestamp: '01/10/2026 09:00',
  },
  {
    id: 'log-2',
    tenantId: 'don-corleone',
    tenantName: 'DON CORLEONE BARBER CLUB',
    action: 'Pausa da Mini Central',
    details: 'Mini central desativada temporariamente para reforma visual.',
    performedBy: 'Super Admin',
    timestamp: '01/10/2026 10:15',
  },
  {
    id: 'log-3',
    tenantId: 'kings-cut',
    tenantName: "KING'S CUT BARBEARIA",
    action: 'Bloqueio de Agenda e Mini Central',
    details: 'Suspensão aplicada por atraso de assinatura SaaS.',
    performedBy: 'Super Admin',
    timestamp: '01/10/2026 11:00',
  },
];

interface SaaSContextType {
  // Navigation & Views
  currentView: PlatformView;
  setCurrentView: (view: PlatformView) => void;
  barberActiveTab: BarberTab;
  setBarberActiveTab: (tab: BarberTab) => void;
  superAdminActiveTab: SuperAdminTab;
  setSuperAdminActiveTab: (tab: SuperAdminTab) => void;

  // Multi-tenancy
  tenants: BarbeariaTenant[];
  currentTenantId: string;
  currentTenant: BarbeariaTenant;
  switchTenant: (tenantId: string) => void;
  updateCurrentTenant: (updates: Partial<BarbeariaTenant>) => void;

  // Super Admin Controls
  toggleMiniCentral: (tenantId: string) => void;
  toggleAgenda: (tenantId: string) => void;
  setTenantControls: (tenantId: string, miniCentralAtiva: boolean, agendaAtiva: boolean) => void;
  confirmPaymentAndGrantAccess: (tenantId: string, paymentId?: string, confirmedAt?: string) => void;
  registerBarbearia: (payload: NewBarbeariaPayload) => { success: boolean; tenant?: BarbeariaTenant; error?: string };
  simulateWebhook: (payload: WebhookEventPayload) => void;

  // Auth States
  isBarberLoggedIn: boolean;
  barberEmail: string;
  loginBarber: (email: string, pass: string) => { success: boolean; error?: string };
  logoutBarber: () => void;

  isSuperAdminLoggedIn: boolean;
  loginSuperAdmin: (email: string, pass: string) => { success: boolean; error?: string };
  logoutSuperAdmin: () => void;

  // Business Data
  appointments: AppointmentItem[];
  addAppointment: (apt: Omit<AppointmentItem, 'id' | 'createdAt'>) => AppointmentItem;
  updateAppointmentStatus: (id: string, status: AppointmentItem['status']) => void;
  confirmAppointmentPayment: (appointmentId: string, method?: 'Pix' | 'Cartão' | 'Dinheiro') => void;

  clients: ClientItem[];
  addClient: (cli: Omit<ClientItem, 'id'>) => void;
  addFidelityStamp: (clientId: string) => void;
  redeemFreeCut: (clientId: string) => void;

  financeEntries: FinanceEntry[];
  addFinanceEntry: (entry: Omit<FinanceEntry, 'id'>) => void;

  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, details: string, tenantId?: string, tenantName?: string) => void;

  // Toast / feedback message
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const SaaSContext = createContext<SaaSContextType | undefined>(undefined);

export function SaaSProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<BarbeariaTenant[]>(() => {
    const saved = localStorage.getItem('saas_tenants_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialTenants;
      }
    }
    return initialTenants;
  });

  const [currentTenantId, setCurrentTenantId] = useState<string>('lupumba');
  const [currentView, setCurrentView] = useState<PlatformView>('mini-central');
  const [barberActiveTab, setBarberActiveTab] = useState<BarberTab>('dashboard');
  const [superAdminActiveTab, setSuperAdminActiveTab] = useState<SuperAdminTab>('visao-geral');

  const [isBarberLoggedIn, setIsBarberLoggedIn] = useState<boolean>(false);
  const [barberEmail, setBarberEmail] = useState<string>('barbeiro@lupumba.com');
  const [isSuperAdminLoggedIn, setIsSuperAdminLoggedIn] = useState<boolean>(false);

  const [appointments, setAppointments] = useState<AppointmentItem[]>(() => {
    const saved = localStorage.getItem('saas_appointments_v1');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [clients, setClients] = useState<ClientItem[]>(() => {
    const saved = localStorage.getItem('saas_clients_v1');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>(() => {
    const saved = localStorage.getItem('saas_finance_v1');
    return saved ? JSON.parse(saved) : initialFinance;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('saas_audit_v1');
    return saved ? JSON.parse(saved) : initialAudit;
  });

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('saas_tenants_v1', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('saas_appointments_v1', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('saas_clients_v1', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('saas_finance_v1', JSON.stringify(financeEntries));
  }, [financeEntries]);

  useEffect(() => {
    localStorage.setItem('saas_audit_v1', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const currentTenant =
    tenants.find((t) => t.id === currentTenantId) || tenants[0] || initialTenants[0];

  const switchTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
    showNotification(`Barbearia alternada para: ${tenants.find((t) => t.id === tenantId)?.name || tenantId}`, 'info');
  };

  const addAuditLog = (
    action: string,
    details: string,
    tId: string = currentTenant.id,
    tName: string = currentTenant.name
  ) => {
    const now = new Date();
    const formatted = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      tenantId: tId,
      tenantName: tName,
      action,
      details,
      performedBy: isSuperAdminLoggedIn ? 'Super Admin' : 'Barbeiro / Proprietário',
      timestamp: formatted,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // SUPER ADMIN INDEPENDENT CONTROLS
  const toggleMiniCentral = (tenantId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenantId) {
          const nextState = !t.miniCentralAtiva;
          addAuditLog(
            nextState ? 'Ativação de Mini Central' : 'Desativação de Mini Central',
            nextState
              ? 'Mini Central pública reativada para aceitar agendamentos.'
              : 'Mini Central pública pausada. Agendamentos suspensos.',
            t.id,
            t.name
          );
          showNotification(
            `${t.name}: Mini Central agora está ${nextState ? 'ONLINE e aceitando agendamentos' : 'PAUSADA (agendamentos suspensos)'}`,
            nextState ? 'success' : 'error'
          );
          return { ...t, miniCentralAtiva: nextState };
        }
        return t;
      })
    );
  };

  const toggleAgenda = (tenantId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenantId) {
          const nextState = !t.agendaAtiva;
          addAuditLog(
            nextState ? 'Ativação de Agenda e Sistema' : 'Bloqueio de Agenda e Sistema',
            nextState
              ? 'Acesso ao sistema interno do barbeiro liberado.'
              : 'Acesso ao sistema interno do barbeiro bloqueado pelo Super Admin.',
            t.id,
            t.name
          );
          showNotification(
            `${t.name}: Acesso ao sistema interno agora está ${nextState ? 'LIBERADO' : 'SUSPENSO / BLOQUEADO'}`,
            nextState ? 'success' : 'error'
          );

          // If current logged in barber belongs to this tenant and agenda was suspended, force kick
          if (!nextState && isBarberLoggedIn && currentTenantId === tenantId) {
            setIsBarberLoggedIn(false);
            setCurrentView('barber-login');
            showNotification('Seu acesso foi suspenso pela administração da plataforma.', 'error');
          }

          return { ...t, agendaAtiva: nextState };
        }
        return t;
      })
    );
  };

  const setTenantControls = (
    tenantId: string,
    miniCentralAtiva: boolean,
    agendaAtiva: boolean
  ) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenantId) {
          addAuditLog(
            'Atualização de Permissões da Barbearia',
            `Mini Central: ${miniCentralAtiva ? 'Ativa' : 'Inativa'} | Agenda: ${agendaAtiva ? 'Ativa' : 'Inativa'}`,
            t.id,
            t.name
          );
          return { ...t, miniCentralAtiva, agendaAtiva };
        }
        return t;
      })
    );
    showNotification('Status da barbearia atualizado com sucesso!', 'success');
  };

  // 15. REGRA DOS 30 DIAS — CONFIRMAÇÃO DE PAGAMENTO & LIBERAÇÃO DE ACESSO
  const confirmPaymentAndGrantAccess = (
    tenantId: string,
    paymentId: string = `pay_${Date.now()}`,
    confirmedAt: string = new Date().toISOString()
  ) => {
    const dateObj = new Date(confirmedAt);
    dateObj.setDate(dateObj.getDate() + 30);
    const newExpiresAt = dateObj.toLocaleDateString('pt-BR');
    const newBillingDate = dateObj.toLocaleDateString('pt-BR');
    const startDate = new Date(confirmedAt).toLocaleDateString('pt-BR');

    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenantId) {
          addAuditLog(
            'Pagamento Confirmado (+30 Dias)',
            `Pagamento ID ${paymentId} confirmado em ${new Date(confirmedAt).toLocaleString('pt-BR')}. Acesso liberado por +30 dias até ${newExpiresAt}.`,
            t.id,
            t.name
          );
          return {
            ...t,
            subscriptionStatus: 'ativa',
            planStatus: 'ativo',
            agendaAtiva: true,
            miniCentralAtiva: true,
            paymentId,
            lastPaymentDate: startDate,
            periodStartDate: startDate,
            accessExpiresAt: newExpiresAt,
            subscriptionExpiresAt: newExpiresAt,
            nextBillingDate: newBillingDate,
          };
        }
        return t;
      })
    );
    showNotification(`Pagamento ${paymentId} confirmado! Acesso ao Snake Barber liberado por 30 dias até ${newExpiresAt}.`, 'success');
  };

  // 3. CADASTRO DE NOVA BARBEARIA
  const registerBarbearia = (
    payload: NewBarbeariaPayload
  ): { success: boolean; tenant?: BarbeariaTenant; error?: string } => {
    const cleanSlug = payload.slug
      .toLowerCase()
      .trim()
      .replace(/^\/+|\/+$/g, '')
      .replace(/[^a-z0-9-]/g, '');

    if (!cleanSlug) {
      return { success: false, error: 'Por favor, defina um slug válido para o endereço da barbearia.' };
    }

    // Impedir slug duplicado (Item 7 dos testes obrigatórios)
    const slugExists = tenants.some(
      (t) => t.slug.toLowerCase() === cleanSlug || t.id.toLowerCase() === cleanSlug
    );
    if (slugExists) {
      return {
        success: false,
        error: `O endereço "/${cleanSlug}" já está em uso por outra barbearia cadastrada. Por favor, escolha um slug exclusivo.`,
      };
    }

    // Impedir e-mail duplicado
    const emailExists = tenants.some(
      (t) => t.ownerEmail.toLowerCase() === payload.accessEmail.trim().toLowerCase()
    );
    if (emailExists) {
      return {
        success: false,
        error: 'Este e-mail de acesso já está vinculado a outra barbearia.',
      };
    }

    const planPrices: Record<string, number> = {
      'Plano Start': 89.9,
      'Plano Pro': 149.9,
      'Plano Enterprise': 249.9,
    };

    const newId = `tenant_${cleanSlug}_${Date.now()}`;
    const newTenant: BarbeariaTenant = {
      id: newId,
      slug: cleanSlug,
      name: payload.name.trim(),
      barbeiro: payload.ownerName.trim(),
      responsavel: payload.ownerName.trim(),
      ownerName: payload.ownerName.trim(),
      ownerEmail: payload.accessEmail.trim().toLowerCase(),
      password: payload.password,
      phone: payload.phone.trim(),
      phoneRaw: payload.phone.replace(/\D/g, ''),
      whatsappFormatted: payload.whatsappNumber.trim(),
      whatsappNumber: payload.whatsappNumber.replace(/\D/g, ''),
      instagram: payload.instagram.replace(/^@/, '').trim(),
      instagramUrl: `https://instagram.com/${payload.instagram.replace(/^@/, '').trim()}`,
      googleMapsUrl: 'https://maps.google.com',
      address: payload.address.trim(),
      neighborhood: payload.neighborhood.trim(),
      city: payload.city.trim(),
      hours: 'Segunda a sábado, das 09h às 20h',
      tagline: 'Estilo, Presença e Tradição',
      description: `${payload.name} - Atendimento personalizado com alto padrão de acabamento e estilo.`,

      // 14. CADASTRO NÃO LIBERA O SISTEMA (PENDENTE)
      plan: payload.plan,
      planPrice: planPrices[payload.plan] || 149.9,
      planStatus: 'pendente',
      subscriptionStatus: 'pendente',
      agendaAtiva: false,
      miniCentralAtiva: false,

      subscriptionId: `sub_pend_${Date.now()}`,
      paymentId: `pay_pend_${Date.now()}`,
      lastPaymentDate: 'Pendente',
      periodStartDate: '',
      accessExpiresAt: 'Pendente de ativação',
      subscriptionExpiresAt: 'Pendente de ativação',
      nextBillingDate: 'Pendente',
      memberSince: new Date().toLocaleDateString('pt-BR'),

      cuts: [...cutsImages],
      services: [...servicesList],
      professionals: [
        {
          id: `prof_${Date.now()}`,
          name: payload.ownerName.trim(),
          role: 'Master Barber / Proprietário',
          phone: payload.phone.trim(),
          commissionPercent: 100,
          isActive: true,
        },
      ],
    };

    setTenants((prev) => [...prev, newTenant]);
    addAuditLog(
      'Cadastro de Nova Barbearia',
      `Nova barbearia registrada: ${newTenant.name} (slug: /${newTenant.slug}). Plano: ${newTenant.plan}. Status inicial: PENDENTE de pagamento.`,
      newTenant.id,
      newTenant.name
    );

    showNotification(`Barbearia "${newTenant.name}" cadastrada! Conclua o pagamento para ativar.`, 'info');
    return { success: true, tenant: newTenant };
  };

  // 23. SIMULADOR DE WEBHOOKS
  const simulateWebhook = (payload: WebhookEventPayload) => {
    addAuditLog(
      `Webhook Event: ${payload.event}`,
      `Origem: ${payload.gatewaySimulator || 'gateway'}. ID Pagamento: ${payload.paymentId}. Valor: R$ ${payload.amount || 0}`,
      payload.tenantId
    );

    if (payload.event === 'payment.confirmed') {
      confirmPaymentAndGrantAccess(payload.tenantId, payload.paymentId, payload.timestamp);
    } else if (payload.event === 'payment.failed') {
      setTenants((prev) =>
        prev.map((t) => (t.id === payload.tenantId ? { ...t, subscriptionStatus: 'atrasada' } : t))
      );
      showNotification('Webhook: Pagamento falhou. Assinatura marcada como ATRASADA.', 'error');
    } else if (payload.event === 'payment.refunded') {
      setTenantControls(payload.tenantId, false, false);
      setTenants((prev) =>
        prev.map((t) => (t.id === payload.tenantId ? { ...t, subscriptionStatus: 'suspensa' } : t))
      );
      showNotification('Webhook: Pagamento estornado. Assinatura SUSPENSA.', 'error');
    } else if (payload.event === 'subscription.cancelled') {
      setTenantControls(payload.tenantId, false, false);
      setTenants((prev) =>
        prev.map((t) => (t.id === payload.tenantId ? { ...t, subscriptionStatus: 'cancelada' } : t))
      );
      showNotification('Webhook: Assinatura CANCELADA pelo cliente.', 'info');
    }
  };

  // BARBER MINI CENTRAL EDITOR ACTION
  const updateCurrentTenant = (updates: Partial<BarbeariaTenant>) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === currentTenantId) {
          const updated = { ...t, ...updates };
          addAuditLog('Edição da Mini Central', 'Dados cadastrais ou visuais alterados pelo proprietário.', t.id, t.name);
          return updated;
        }
        return t;
      })
    );
    showNotification('Mini Central atualizada com sucesso!', 'success');
  };

  // 12. VÍNCULO DO BARBEIRO AO TENANT NO LOGIN
  const loginBarber = (email: string, pass: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Por favor, informe seu e-mail cadastrado.' };
    }

    // Identificar barbearia estritamente vinculada ao e-mail ou profissional
    const target = tenants.find((t) => {
      if (t.ownerEmail.toLowerCase() === cleanEmail) return true;
      if (t.professionals && t.professionals.some((p) => p.phone.replace(/\D/g, '') === cleanEmail.replace(/\D/g, ''))) return true;
      return false;
    });

    if (!target) {
      return {
        success: false,
        error: 'E-mail não vinculado a nenhuma barbearia cadastrada no Snake Barber. Verifique os dados digitados ou cadastre sua barbearia.',
      };
    }

    // 14. REGRA DE ACESSO: Pagamento Pendente (após cadastro sem pagamento)
    if (target.subscriptionStatus === 'pendente') {
      const errorMsg =
        'Pagamento Pendente: Seu cadastro foi realizado com sucesso, mas o acesso ao sistema da barbearia só é liberado após a confirmação do pagamento do seu plano. Efetue o pagamento para liberar seu acesso por 30 dias.';
      return { success: false, error: errorMsg };
    }

    // 14. REGRA DE ACESSO: Assinatura atrasada
    if (target.subscriptionStatus === 'atrasada') {
      const errorMsg =
        'Assinatura em Atraso: A mensalidade da sua barbearia está pendente. Regularize o pagamento para reativar o acesso ao painel operacional.';
      return { success: false, error: errorMsg };
    }

    // 14. REGRA DE ACESSO: Assinatura suspensa/expirada/cancelada
    if (target.subscriptionStatus === 'suspensa' || target.subscriptionStatus === 'cancelada') {
      const errorMsg = `Assinatura ${target.subscriptionStatus.toUpperCase()}: Acesso ao sistema suspenso por vencimento em ${target.subscriptionExpiresAt}. Regularize a assinatura da sua barbearia para reativar o acesso.`;
      return { success: false, error: errorMsg };
    }

    // 14. REGRA DE ACESSO: Agenda / Sistema desativado pelo Super Admin
    if (!target.agendaAtiva) {
      const errorMsg =
        'Acesso suspenso: A agenda e o sistema operacional desta barbearia foram bloqueados pela administração. Entre em contato com o suporte Snake Barber.';
      return { success: false, error: errorMsg };
    }

    // Vincular barbeiro à barbearia e bloquear troca de tenant
    setIsBarberLoggedIn(true);
    setBarberEmail(email);
    setCurrentTenantId(target.id);
    localStorage.setItem('saas_barber_tenant_id', target.id);
    setCurrentView('barber-system');
    showNotification(`Bem-vindo ao Snake Barber — ${target.name}!`, 'success');
    return { success: true };
  };

  const logoutBarber = () => {
    setIsBarberLoggedIn(false);
    localStorage.removeItem('saas_barber_tenant_id');
    setCurrentView('barber-login');
    showNotification('Você saiu do sistema operacional.', 'info');
  };

  const loginSuperAdmin = (email: string, pass: string): { success: boolean; error?: string } => {
    if (!email || !pass) {
      return { success: false, error: 'Informe e-mail e senha de administrador.' };
    }
    setIsSuperAdminLoggedIn(true);
    setCurrentView('super-admin');
    showNotification('Painel do Super Administrador acessado com sucesso!', 'success');
    return { success: true };
  };

  const logoutSuperAdmin = () => {
    setIsSuperAdminLoggedIn(false);
    setCurrentView('mini-central');
    showNotification('Sessão de Super Admin finalizada.', 'info');
  };

  // BUSINESS LOGIC: APPOINTMENTS
  const addAppointment = (aptData: Omit<AppointmentItem, 'id' | 'createdAt'>): AppointmentItem => {
    const now = new Date();
    const formatted = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    const duration = aptData.durationMinutes || 45;
    const endTime = aptData.endTimeSlot || calculateEndTime(aptData.timeSlot, duration);
    const paymentStatus = aptData.paymentStatus || 'PENDENTE';

    const newApt: AppointmentItem = {
      ...aptData,
      id: `apt-${Date.now()}`,
      durationMinutes: duration,
      endTimeSlot: endTime,
      paymentStatus,
      paidAt: paymentStatus === 'PAGO' ? now.toISOString() : undefined,
      createdAt: formatted,
    };
    setAppointments((prev) => [newApt, ...prev]);

    // If payment is confirmed as PAGO, automatically record in finance
    if (paymentStatus === 'PAGO') {
      addFinanceEntry({
        tenantId: aptData.tenantId,
        description: `Agendamento Pago: ${aptData.clientName} (${aptData.serviceNames})`,
        type: 'receita',
        amount: aptData.totalPrice,
        category: 'Serviço',
        date: now.toLocaleDateString('pt-BR'),
        method: aptData.paymentMethod || 'Pix',
      });
      addAuditLog(
        'Agendamento Confirmado e Pago',
        `Cliente: ${aptData.clientName} | Horário: ${aptData.timeSlot} às ${endTime} (${duration}min) | Barbeiro: ${aptData.professionalName} | Valor: R$ ${aptData.totalPrice} | Status: PAGO (Horário Ocupado)`,
        aptData.tenantId
      );
    } else {
      addAuditLog(
        'Agendamento Pré-Registrado (Pendente)',
        `Cliente: ${aptData.clientName} | Horário: ${aptData.timeSlot} | Valor: R$ ${aptData.totalPrice} | Status: PENDENTE (Aguardando Pagamento)`,
        aptData.tenantId
      );
    }

    // Also register or update client record
    setClients((prev) => {
      const existing = prev.find(
        (c) => c.tenantId === aptData.tenantId && c.phone === aptData.clientPhone
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalVisits: c.totalVisits + 1,
                totalSpent: c.totalSpent + aptData.totalPrice,
                lastVisit: 'Hoje',
              }
            : c
        );
      } else {
        const newClient: ClientItem = {
          id: `cli-${Date.now()}`,
          tenantId: aptData.tenantId,
          name: aptData.clientName,
          phone: aptData.clientPhone,
          totalVisits: 1,
          totalSpent: aptData.totalPrice,
          lastVisit: 'Hoje',
          favoriteService: aptData.serviceNames,
        };
        return [newClient, ...prev];
      }
    });

    return newApt;
  };

  const confirmAppointmentPayment = (
    appointmentId: string,
    method: 'Pix' | 'Cartão' | 'Dinheiro' = 'Pix'
  ) => {
    const now = new Date();
    let updatedApt: AppointmentItem | null = null;

    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          const wasPaid = apt.paymentStatus === 'PAGO';
          if (!wasPaid) {
            addFinanceEntry({
              tenantId: apt.tenantId,
              description: `Pagamento Recebido: ${apt.clientName} (${apt.serviceNames})`,
              type: 'receita',
              amount: apt.totalPrice,
              category: 'Serviço',
              date: now.toLocaleDateString('pt-BR'),
              method,
            });
            addAuditLog(
              'Pagamento de Agendamento Confirmado',
              `Cliente: ${apt.clientName} | Horário: ${apt.timeSlot} às ${apt.endTimeSlot} | Valor: R$ ${apt.totalPrice} | Método: ${method} | Horário definitivamente ocupado.`,
              apt.tenantId
            );
          }
          const updated: AppointmentItem = {
            ...apt,
            paymentStatus: 'PAGO',
            status: 'confirmado',
            paymentMethod: method,
            paidAt: now.toISOString(),
          };
          updatedApt = updated;
          return updated;
        }
        return apt;
      })
    );

    showNotification('Pagamento confirmado com sucesso! Horário garantido e ocupado na agenda.', 'success');
  };

  const updateAppointmentStatus = (id: string, status: AppointmentItem['status']) => {
    let concludedApt: AppointmentItem | null = null;

    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          // If concluded and was not paid, register in finance as received
          if (status === 'concluido' && apt.status !== 'concluido' && apt.paymentStatus !== 'PAGO') {
            addFinanceEntry({
              tenantId: apt.tenantId,
              description: `Corte finalizado: ${apt.clientName} (${apt.serviceNames})`,
              type: 'receita',
              amount: apt.totalPrice,
              category: 'Serviço',
              date: new Date().toLocaleDateString('pt-BR'),
              method: apt.paymentMethod || 'Pix',
            });
          }
          const nextPaymentStatus =
            status === 'cancelado' ? 'CANCELADO' : status === 'concluido' ? 'PAGO' : apt.paymentStatus;

          const updated = { ...apt, status, paymentStatus: nextPaymentStatus };
          if (status === 'concluido') {
            concludedApt = updated;
          }
          return updated;
        }
        return apt;
      })
    );

    // If appointment was marked as concluded, increment client visits and loyalty stamps
    if (status === 'concluido' && concludedApt) {
      const targetApt = concludedApt as AppointmentItem;
      setClients((prev) =>
        prev.map((c) => {
          const matchPhone = c.phone.replace(/\D/g, '') === targetApt.clientPhone.replace(/\D/g, '');
          const matchName = c.name.toLowerCase() === targetApt.clientName.toLowerCase();
          if (matchPhone || matchName) {
            const currentPoints = c.fidelityPoints || 0;
            const nextPoints = Math.min(10, currentPoints + 1);
            const wonFreeCut = nextPoints >= 10;

            if (wonFreeCut && !c.hasFreeCutReward) {
              showNotification(
                `🎉 PARABÉNS! ${c.name} completou 10 cortes na barbearia e ganhou um CORTE DE BRINDE! O benefício já está disponível na aba de clientes.`,
                'success'
              );
              addAuditLog(
                'Corte de Brinde Liberado (10 Cortes Concluídos)',
                `Cliente ${c.name} completou 10 cortes e ganhou um corte grátis de brinde.`,
                c.tenantId
              );
            }

            return {
              ...c,
              totalVisits: c.totalVisits + 1,
              fidelityPoints: nextPoints,
              hasFreeCutReward: wonFreeCut ? true : c.hasFreeCutReward,
              lastVisit: 'Hoje',
            };
          }
          return c;
        })
      );
    }

    showNotification(`Status do agendamento alterado para: ${status.toUpperCase()}`, 'info');
  };

  const addFidelityStamp = (clientId: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          if (c.fidelityPoints && c.fidelityPoints >= 10) {
            showNotification(`🎁 ${c.name} já completou 10 cortes e possui um corte de brinde liberado!`, 'info');
            return c;
          }
          const nextPoints = (c.fidelityPoints || 0) + 1;
          const wonReward = nextPoints >= 10;

          if (wonReward) {
            showNotification(
              `🎉 PARABÉNS! ${c.name} completou 10 cortes e ganhou um CORTE DE BRINDE! O presente já está disponível no cadastro do cliente.`,
              'success'
            );
            addAuditLog(
              'Corte de Brinde Liberado (10 Cortes)',
              `Cliente ${c.name} atingiu 10 cortes na barbearia e ganhou um corte de brinde gratuito.`,
              c.tenantId
            );
          } else {
            showNotification(`Carimbo adicionado para ${c.name}! (${nextPoints}/10 cortes)`, 'info');
          }

          return {
            ...c,
            fidelityPoints: nextPoints,
            hasFreeCutReward: wonReward ? true : c.hasFreeCutReward,
          };
        }
        return c;
      })
    );
  };

  const redeemFreeCut = (clientId: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          addAuditLog(
            'Corte de Brinde Resgatado',
            `Corte gratuito de fidelidade resgatado por ${c.name}. Cartão fidelidade de 10 cortes reiniciado.`,
            c.tenantId
          );
          showNotification(
            `🎁 Corte de brinde resgatado com sucesso para ${c.name}! Novo ciclo de fidelidade reiniciado.`,
            'success'
          );
          return {
            ...c,
            fidelityPoints: 0,
            hasFreeCutReward: false,
            rewardsClaimed: (c.rewardsClaimed || 0) + 1,
          };
        }
        return c;
      })
    );
  };

  const addClient = (cliData: Omit<ClientItem, 'id'>) => {
    const newClient: ClientItem = {
      ...cliData,
      id: `cli-${Date.now()}`,
    };
    setClients((prev) => [newClient, ...prev]);
    showNotification(`Cliente ${cliData.name} cadastrado com sucesso!`, 'success');
  };

  const addFinanceEntry = (entryData: Omit<FinanceEntry, 'id'>) => {
    const newEntry: FinanceEntry = {
      ...entryData,
      id: `fin-${Date.now()}`,
    };
    setFinanceEntries((prev) => [newEntry, ...prev]);
    showNotification('Lançamento financeiro registrado com sucesso!', 'success');
  };

  return (
    <SaaSContext.Provider
      value={{
        currentView,
        setCurrentView,
        barberActiveTab,
        setBarberActiveTab,
        superAdminActiveTab,
        setSuperAdminActiveTab,
        tenants,
        currentTenantId,
        currentTenant,
        switchTenant,
        updateCurrentTenant,
        toggleMiniCentral,
        toggleAgenda,
        setTenantControls,
        confirmPaymentAndGrantAccess,
        registerBarbearia,
        simulateWebhook,
        isBarberLoggedIn,
        barberEmail,
        loginBarber,
        logoutBarber,
        isSuperAdminLoggedIn,
        loginSuperAdmin,
        logoutSuperAdmin,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        confirmAppointmentPayment,
        clients,
        addClient,
        addFidelityStamp,
        redeemFreeCut,
        financeEntries,
        addFinanceEntry,
        auditLogs,
        addAuditLog,
        notification,
        showNotification,
      }}
    >
      {children}
    </SaaSContext.Provider>
  );
}

export function useSaaS() {
  const context = useContext(SaaSContext);
  if (!context) {
    throw new Error('useSaaS must be used within a SaaSProvider');
  }
  return context;
}
