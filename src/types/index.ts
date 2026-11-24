export type CategorySlug =
  | "frutas"
  | "verduras"
  | "hortalizas"
  | "legumbres"
  | "tuberculos"
  | "otros";

export type AvailabilityStatus =
  | "disponible"
  | "pocas_unidades"
  | "bajo_pedido";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
  accentBg: string;
  productCountLabel: string;
}

export interface Farmer {
  id: string;
  name: string;
  farmName: string;
  municipality: string;
  region: string;
  specialty: string;
  bio: string;
  yearsExperience: number;
  image: string;
  badges: string[];
  distanceKmMock: number;
  isDemo: true;
}

export interface Product {
  id: string;
  name: string;
  category: CategorySlug;
  categoryLabel: string;
  priceMxn: number;
  unit: string;
  minOrder: string;
  farmerId: string;
  farmerName: string;
  municipality: string;
  availability: AvailabilityStatus;
  availabilityLabel: string;
  image: string;
  backdropColor: string;
  description: string;
  harvestSeason: string;
  packaging: string;
  qualityGrade: string;
  distanceKmMock: number;
  featured?: boolean;
  isDemo: true;
}

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend: string;
}

export interface DashboardOrderMock {
  id: string;
  businessName: string;
  municipality: string;
  productSummary: string;
  totalEstimateMxn: number;
  requestedDate: string;
  status: "pendiente" | "confirmado" | "en_camino" | "completado";
  statusLabel: string;
}

export interface DashboardActivityMock {
  id: string;
  title: string;
  detail: string;
  timeAgo: string;
  type: "inquiry" | "catalog" | "order" | "profile";
}
