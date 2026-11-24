import type {
  DashboardActivityMock,
  DashboardOrderMock,
  DashboardStat,
} from "@/types";

export const DASHBOARD_STATS: DashboardStat[] = [
  {
    id: "stat-products",
    label: "Productos publicados",
    value: "6",
    helper: "Lotes ilustrativos activos en vitrina",
    trend: "Catálogo demo",
  },
  {
    id: "stat-inquiries",
    label: "Solicitudes recibidas",
    value: "14",
    helper: "Consultas simuladas esta semana",
    trend: "+4 recientes",
  },
  {
    id: "stat-orders",
    label: "Acuerdos en curso",
    value: "5",
    helper: "Pedidos de muestra por entregar",
    trend: "3 esta semana",
  },
  {
    id: "stat-municipality",
    label: "Alcance cercano",
    value: "45 km",
    helper: "Radio visual alrededor de Uruapan",
    trend: "Michoacán",
  },
];

export const DASHBOARD_ORDERS: DashboardOrderMock[] = [
  {
    id: "PED-2041",
    businessName: "Cocina Tradicional El Portal (Demo)",
    municipality: "Morelia",
    productSummary: "3 cajas de Aguacate Hass (30 kg) · 2 cajas de Guayaba",
    totalEstimateMxn: 2420,
    requestedDate: "Entrega sugerida: Viernes",
    status: "confirmado",
    statusLabel: "Confirmado (Demo)",
  },
  {
    id: "PED-2038",
    businessName: "Frutería La Huerta (Demo)",
    municipality: "Uruapan",
    productSummary: "5 cajas de Aguacate Hass (50 kg)",
    totalEstimateMxn: 2900,
    requestedDate: "Entrega sugerida: Mañana",
    status: "en_camino",
    statusLabel: "En ruta (Demo)",
  },
  {
    id: "PED-2034",
    businessName: "Abarrotes Don Pepe (Demo)",
    municipality: "Pátzcuaro",
    productSummary: "2 arpillas de Cebolla blanca · 1 caja de Jitomate",
    totalEstimateMxn: 1392,
    requestedDate: "Entrega sugerida: Lunes",
    status: "pendiente",
    statusLabel: "Por acordar (Demo)",
  },
  {
    id: "PED-2029",
    businessName: "Comedor Universitario Sur (Demo)",
    municipality: "Morelia",
    productSummary: "4 cajas de Guayaba (40 kg)",
    totalEstimateMxn: 1360,
    requestedDate: "Completado la semana pasada",
    status: "completado",
    statusLabel: "Entregado (Demo)",
  },
];

export const DASHBOARD_ACTIVITY: DashboardActivityMock[] = [
  {
    id: "act-1",
    title: "Nueva consulta sobre Aguacate Hass",
    detail: "Cocina Tradicional El Portal preguntó por calibre 48 en Uruapan.",
    timeAgo: "Hace 2 horas",
    type: "inquiry",
  },
  {
    id: "act-2",
    title: "Actualización visual de disponibilidad",
    detail: "Se marcó el lote de Guayaba como disponible para entrega semanal.",
    timeAgo: "Ayer",
    type: "catalog",
  },
  {
    id: "act-3",
    title: "Acuerdo de entrega simulado #PED-2038",
    detail: "Frutería La Huerta confirmó recepción en centro de Uruapan.",
    timeAgo: "Hace 2 días",
    type: "order",
  },
  {
    id: "act-4",
    title: "Perfil de demostración verificado",
    detail: "Ubicación ilustrativa: Uruapan, Meseta Purépecha, Michoacán.",
    timeAgo: "Hace 5 días",
    type: "profile",
  },
];
