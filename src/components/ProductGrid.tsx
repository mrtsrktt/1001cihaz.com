import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product, PRODUCTS } from '../data/products';
import { getCategoryUrl } from '../utils/categories';

// Exactly 8 editorial featured products in specified order
export const FEATURED_PRODUCT_CODES: string[] = [
  '681000',
  '682000',
  '11733',
  '11190',
  '912200',
  '912206',
  '690109',
  '420145',
];

interface ProductGridProps {
  onNavigate: (url: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onNavigate }) => {
  const featuredProducts: Product[] = React.useMemo(() => {
    return FEATURED_PRODUCT_CODES.map((code) =>
      PRODUCTS.find((p) => p.code === code)
    ).filter((p): p is Product => Boolean(p));
  }, []);

  const catalogUrl = getCategoryUrl('tum-urunler');

  const handleExploreAllClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      onNavigate(catalogUrl);
    }
  };

  return (
    <section id="urunler" className="mt-[72px] scroll-mt-40">
      <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-[#E2E7E8] gap-4">
          <div>
            <h2 className="text-[32px] font-[700] text-[#16242B] tracking-tight leading-tight">
              Öne çıkan ölçüm çözümleri
            </h2>
            <p className="text-[16px] leading-[26px] text-[#637078] mt-1 max-w-2xl">
              Farklı endüstriyel gaz kaçak, baca gazı emisyonu ve hassas basınç ölçüm uygulamaları için seçilmiş cihaz ve akıllı sensörler.
            </p>
          </div>

          <a
            href={catalogUrl}
            onClick={handleExploreAllClick}
            className="group inline-flex items-center gap-2 text-[15px] font-[700] text-[#16242B] hover:text-[#C82B35] transition-colors duration-[180ms] flex-shrink-0 self-start md:self-end pb-1"
            aria-label="17 ürünün tamamını keşfet"
          >
            <span>17 ürünün tamamını keşfet</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-[180ms] motion-reduce:transform-none text-[#C82B35]" />
          </a>
        </div>

        {/* 2-Row, 4-Column Editorial Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.code}
              product={product}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
