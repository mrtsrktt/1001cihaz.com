import { Product, PRODUCTS } from '../data/products';

export function getProductSlug(product: Product): string {
  const cleanModel = product.model
    .toLowerCase()
    .replace(/[()±.]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${product.code}-${cleanModel}`;
}

export function getProductUrl(product: Product): string {
  return `/urun/${getProductSlug(product)}`;
}

export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  
  // Clean slug
  const clean = slug.replace(/^\/urun\//, '').replace(/\/$/, '');
  
  // 1. Direct match by exact slug
  const directMatch = PRODUCTS.find((p) => getProductSlug(p) === clean);
  if (directMatch) return directMatch;
  
  // 2. Match by code prefix (e.g. 681000 or 681000-*)
  const codeMatch = PRODUCTS.find((p) => clean === p.code || clean.startsWith(`${p.code}-`));
  if (codeMatch) return codeMatch;
  
  // 3. Fallback: match by model substring
  return PRODUCTS.find((p) => clean.toLowerCase().includes(p.code.toLowerCase()));
}

export function getAllProductUrls(): { code: string; model: string; shortTitle: string; slug: string; url: string }[] {
  return PRODUCTS.map((p) => {
    const slug = getProductSlug(p);
    return {
      code: p.code,
      model: p.model,
      shortTitle: p.shortTitle,
      slug,
      url: `/urun/${slug}`,
    };
  });
}
