import { Product } from '../data/products';

export interface CategoryDefinition {
  slug: string;
  title: string;
  navTitle: string;
  shortDescription: string;
  productType: Product['productType'] | 'all';
  altSlugs?: string[];
}

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    slug: 'tum-urunler',
    title: 'Tüm Ürünler',
    navTitle: 'Tüm ürünler',
    shortDescription:
      'MRU markalı profesyonel gaz kaçak dedektörleri, değiştirilebilir akıllı sensörler, dijital manometreler ve baca gazı analiz setlerinin tamamı.',
    productType: 'all',
    altSlugs: ['urunler'],
  },
  {
    slug: 'gaz-kacak-dedektorleri',
    title: 'Gaz Kaçak Dedektörleri',
    navTitle: 'Gaz kaçak dedektörleri',
    shortDescription:
      'Doğal gaz, LPG ve hidrojen tesisatlarında profesyonel kaçak tespiti için modüler ve pompalı ana cihaz gövdeleri.',
    productType: 'base_device',
    altSlugs: ['gaz-kacak-tespiti'],
  },
  {
    slug: 'sensorler',
    title: 'Sensörler ve Ölçüm Başlıkları',
    navTitle: 'Sensörler',
    shortDescription:
      '400GD ve 500GD ana ünitelerine tak-kullan olarak bağlanan yanıcı gaz, soğutucu F-gaz, ortam havası ve sıcaklık/nem başlıkları.',
    productType: 'sensor',
    altSlugs: ['sensorler-ve-olcum-basliklari'],
  },
  {
    slug: 'dijital-manometreler',
    title: 'Dijital Manometreler',
    navTitle: 'Dijital manometreler',
    shortDescription:
      'Kazan, brülör ve gaz hatlarında diferansiyel basınç, statik basınç ve kaçak testi ölçümleri için yüksek hassasiyetli DM9600 modelleri.',
    productType: 'manometer',
    altSlugs: ['manometreler'],
  },
  {
    slug: 'baca-gazi-analizorleri',
    title: 'Baca Gazı Analiz Cihazları',
    navTitle: 'Baca gazı analizörleri',
    shortDescription:
      'Kazan ve yakma tesislerinde O₂, CO emisyonları, baca çekişi ve verimlilik ölçümü için eksiksiz profesyonel analiz setleri.',
    productType: 'set',
    altSlugs: ['baca-gazi-analiz-cihazlari'],
  },
];

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().trim();
  return CATEGORY_DEFINITIONS.find(
    (c) => c.slug === clean || (c.altSlugs && c.altSlugs.includes(clean))
  );
}

export function getCategorySlugByType(productType: Product['productType']): string {
  const match = CATEGORY_DEFINITIONS.find((c) => c.productType === productType);
  return match ? match.slug : 'tum-urunler';
}

export function getCategorySlugByName(name: string): string {
  const clean = name.toLowerCase().trim();
  const match = CATEGORY_DEFINITIONS.find(
    (c) =>
      c.navTitle.toLowerCase() === clean ||
      c.title.toLowerCase() === clean ||
      c.slug === clean ||
      (c.altSlugs && c.altSlugs.includes(clean))
  );
  return match ? match.slug : 'tum-urunler';
}

export function getCategoryUrl(slug: string): string {
  return `/kategori/${slug}`;
}

/**
 * Robust Turkish search matching
 * Supports both exact Turkish casing (İ/i, I/ı) and ASCII normalization
 */
export function normalizeTurkish(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

export function matchesSearchQuery(product: Product, query: string): boolean {
  if (!query || !query.trim()) return true;
  const q = query.trim();
  const qTr = q.toLocaleLowerCase('tr-TR');
  const qNorm = normalizeTurkish(q);

  const fields = [
    product.name,
    product.shortTitle,
    product.model,
    product.code,
    product.shortDescription,
    product.category,
  ];

  return fields.some((field) => {
    if (!field) return false;
    const fTr = field.toLocaleLowerCase('tr-TR');
    if (fTr.includes(qTr)) return true;
    const fNorm = normalizeTurkish(field);
    return fNorm.includes(qNorm);
  });
}
