import type { Farmer } from "@/types";

/**
 * Productores ficticios de demostración visual para la plataforma académica Delaterra.
 * No representan cuentas ni personas reales registradas.
 */
export const FARMERS: Farmer[] = [
  {
    id: "prod-uruapan-01",
    name: "Mateo Mendoza (Demo)",
    farmName: "Huerta Los Pinos",
    municipality: "Uruapan",
    region: "Meseta Purépecha",
    specialty: "Aguacate Hass y guayaba de altura",
    bio: "Perfil ilustrativo enfocado en cosecha escalonada por calibre para restaurantes, fruterías y centros de consumo regional.",
    yearsExperience: 14,
    image: "/images/farmers/farmer-1.svg",
    badges: ["Cosecha semanal", "Entrega regional"],
    distanceKmMock: 18,
    isDemo: true,
  },
  {
    id: "prod-zamora-02",
    name: "Lucía Castellanos (Demo)",
    farmName: "Rancho Valle Verde",
    municipality: "Zamora",
    region: "Ciénega de Chapala",
    specialty: "Fresa, lechuga y cebolla blanca",
    bio: "Productora de demostración especializada en frutos rojos y hortalizas frescas empacadas en charola o arpilla el mismo día de corte.",
    yearsExperience: 9,
    image: "/images/farmers/farmer-2.svg",
    badges: ["Corte al alba", "Empaque en frío"],
    distanceKmMock: 42,
    isDemo: true,
  },
  {
    id: "prod-apatzingan-03",
    name: "Carlos Villaseñor (Demo)",
    farmName: "Cítricos Tierra Caliente",
    municipality: "Apatzingán",
    region: "Tierra Caliente",
    specialty: "Limón mexicano, naranja, mango y papaya",
    bio: "Ejemplo visual de productor frutícola con lotes por caja y reja para abastecimiento continuo de negocios gastronómicos.",
    yearsExperience: 19,
    image: "/images/farmers/farmer-3.svg",
    badges: ["Volumen por caja", "Cítricos de temporada"],
    distanceKmMock: 64,
    isDemo: true,
  },
  {
    id: "prod-morelia-04",
    name: "Elena Ramírez (Demo)",
    farmName: "Parcela San Isidro",
    municipality: "Morelia",
    region: "Región Centro",
    specialty: "Jitomate, chile serrano, calabacita y brócoli",
    bio: "Perfil ficticio orientado a negocios locales que buscan abasto cercano de verduras diarias sin intermediarios largos.",
    yearsExperience: 11,
    image: "/images/farmers/farmer-4.svg",
    badges: ["Proximidad urbana", "Surtido mixto"],
    distanceKmMock: 12,
    isDemo: true,
  },
  {
    id: "prod-puruandiro-05",
    name: "Raúl Negrete (Demo)",
    farmName: "Granos El Bajío",
    municipality: "Puruándiro",
    region: "Bajío Michoacano",
    specialty: "Frijol, garbanzo, lenteja y maíz blanco",
    bio: "Representación académica de productor de granos y legumbres seleccionados por costal de 25 kg y 50 kg para comedores y tiendas.",
    yearsExperience: 22,
    image: "/images/farmers/farmer-5.svg",
    badges: ["Grano cribado", "Venta por bulto"],
    distanceKmMock: 53,
    isDemo: true,
  },
  {
    id: "prod-zitacuaro-06",
    name: "Sofía Mondragón (Demo)",
    farmName: "Ladera del Oriente",
    municipality: "Zitácuaro",
    region: "Oriente Michoacano",
    specialty: "Papa, camote, zanahoria y plátano",
    bio: "Perfil de muestra dedicado a tubérculos de tierra húmeda y cultivos de ladera con disponibilidad constante durante el trimestre.",
    yearsExperience: 8,
    image: "/images/farmers/farmer-6.svg",
    badges: ["Lotes lavados", "Precio transparente"],
    distanceKmMock: 75,
    isDemo: true,
  },
];

export const FARMERS_BY_ID: Record<string, Farmer> = Object.fromEntries(
  FARMERS.map((farmer) => [farmer.id, farmer]),
);

export const MUNICIPALITIES: string[] = Array.from(
  new Set(FARMERS.map((farmer) => farmer.municipality)),
).sort((a, b) => a.localeCompare(b, "es-MX"));
