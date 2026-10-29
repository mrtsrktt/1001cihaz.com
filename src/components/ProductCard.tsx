import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../data/products';
import { getProductUrl } from '../utils/navigation';

interface ProductCardProps {
  product: Product;
  onNavigate?: (url: string) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNavigate,
  className = '',
}) => {
  const formatPrice = (val: number | null) => {
    if (val === null) return '0';
    return new Intl.NumberFormat('tr-TR').format(val);
  };

  const productUrl = getProductUrl(product);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If ordinary left click without modifier keys, use client routing if onNavigate provided
    if (onNavigate && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      onNavigate(productUrl);
    }
  };

  return (
    <a
      href={productUrl}
      onClick={handleClick}
      data-product-card="true"
      data-product-code={product.code}
      className={`group bg-white rounded-[8px] border border-[#E2E7E8] hover:border-[#16242B] p-5 flex flex-col justify-between transition-all duration-[220ms] ease-out hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(18,33,41,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16242B] focus-visible:ring-offset-2 focus-visible:-translate-y-1 focus-visible:shadow-[0_12px_28px_rgba(18,33,41,0.09)] text-left no-underline block h-full motion-reduce:transform-none motion-reduce:transition-none shadow-2xs ${className}`}
      aria-label={`${product.shortTitle} - Ürünü İncele`}
    >
      <div>
        {/* Beyaz görsel zemini, dengeli ürün ölçeği, en fazla %3 büyüme (scale-[1.03], 350ms) */}
        <div className="w-full h-[220px] bg-white rounded-[6px] border border-[#E2E7E8] group-hover:border-[#16242B]/30 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-[220ms]">
          <img
            src={product.primaryImage}
            alt={product.shortTitle}
            className="max-h-[185px] max-w-full object-contain transition-transform duration-[350ms] ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
            loading="eager"
          />

          {/* Baz Cihaz Notu */}
          {product.productType === 'base_device' && (
            <div className="absolute top-2.5 left-2.5 bg-[#FBF0F0] border border-[#C82B35]/30 text-[#C82B35] text-[10px] font-[700] px-2 py-0.5 rounded-[4px] shadow-2xs">
              Baz cihaz — sensör dahil değildir
            </div>
          )}
        </div>

        {/* İçerik Bilgileri */}
        <div className="mt-3.5 flex flex-col">
          {/* Ürün Kodu & Marka */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#637078]">
            <span>Kod: {product.code}</span>
            <span className="truncate ml-2">{product.brand}</span>
          </div>

          {/* İki satır başlık: sabit min-height ile tüm kartlar hizalı kalır */}
          <h3 className="text-[16px] font-[700] text-[#16242B] leading-[23px] line-clamp-2 min-h-[46px] mt-1.5 group-hover:text-[#C82B35] transition-colors duration-[180ms]">
            {product.shortTitle}
          </h3>

          {/* İki satır açıklama */}
          <p className="text-[13px] leading-[20px] text-[#637078] line-clamp-2 min-h-[40px] mt-1.5">
            {product.shortDescription}
          </p>
        </div>
      </div>

      {/* Alt bölüm: Fiyat ve tam genişlikte buton */}
      <div className="pt-3.5 border-t border-[#E2E7E8] mt-3.5">
        <div className="min-h-[44px] flex flex-col justify-end">
          {product.salePrice !== null ? (
            <div>
              <span className="text-[11px] text-[#637078] block">Satış Fiyatı</span>
              <div className="flex items-baseline gap-1 mt-0.5 flex-nowrap whitespace-nowrap">
                <span className="text-[22px] font-[800] text-[#16242B] font-mono leading-none tracking-tight">
                  {formatPrice(product.salePrice)}&nbsp;TL
                </span>
                <span className="text-[11px] text-[#637078] font-normal ml-1">
                  + KDV
                </span>
              </div>
            </div>
          ) : (
            <div>
              <span className="text-[11px] text-[#637078] block">Satış Durumu</span>
              <span className="text-[14px] font-[700] text-[#C82B35] leading-none mt-1 block whitespace-nowrap">
                Şu anda satışa kapalı
              </span>
            </div>
          )}
        </div>

        {/* Alt bölümde tam genişlikte “Ürünü incele”: 220ms geçiş, ok 3px sağa */}
        <div data-card-btn="true" className="w-full h-[40px] mt-3.5 rounded-[6px] border border-[#E2E7E8] group-hover:border-[#16242B] group-hover:bg-[#16242B] group-hover:text-white group-focus-visible:border-[#16242B] group-focus-visible:bg-[#16242B] group-focus-visible:text-white text-[#16242B] text-[13px] font-[600] flex items-center justify-center gap-1.5 transition-colors duration-[220ms] motion-reduce:transition-none">
          <span>Ürünü incele</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px] transition-transform duration-[220ms] ease-out motion-reduce:transform-none" />
        </div>
      </div>
    </a>
  );
};
