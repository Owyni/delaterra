import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    slug: "frutas",
    name: "Frutas",
    description:
      "Aguacate, cítricos, berries y fruta tropical cosechada en huertas michoacanas.",
    image: "/images/categories/frutas.svg",
    accentBg: "#EAF1E3",
    productCountLabel: "8 productos ilustrativos",
  },
  {
    slug: "verduras",
    name: "Verduras",
    description:
      "Jitomate, pepino, calabacita y brócoli de corte reciente para cocinas y comercios.",
    image: "/images/categories/verduras.svg",
    accentBg: "#E6EFE2",
    productCountLabel: "4 productos ilustrativos",
  },
  {
    slug: "hortalizas",
    name: "Hortalizas",
    description:
      "Cebolla blanca, chiles, zanahoria y lechuga de riego limpio y selección uniforme.",
    image: "/images/categories/hortalizas.svg",
    accentBg: "#EDF2E3",
    productCountLabel: "4 productos ilustrativos",
  },
  {
    slug: "legumbres",
    name: "Legumbres",
    description:
      "Frijol, garbanzo y lenteja cribados de grano limpio listos para abasto por bulto.",
    image: "/images/categories/legumbres.svg",
    accentBg: "#F3EFE2",
    productCountLabel: "3 productos ilustrativos",
  },
  {
    slug: "tuberculos",
    name: "Tubérculos",
    description:
      "Papa y camote de tierra fértil con buena conservación para distribución regional.",
    image: "/images/categories/tuberculos.svg",
    accentBg: "#F2ECE3",
    productCountLabel: "2 productos ilustrativos",
  },
  {
    slug: "otros",
    name: "Otros productos agrícolas",
    description:
      "Granos regionales como maíz blanco criollo y cosechas complementarias de temporada.",
    image: "/images/categories/otros.svg",
    accentBg: "#EBEFE4",
    productCountLabel: "1 producto ilustrativo",
  },
];

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((category) => [category.slug, category.name]),
);
