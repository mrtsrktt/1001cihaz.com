import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, X, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { PRODUCTS } from '../data/products';
import { CATEGORY_DEFINITIONS, matchesSearchQuery } from '../utils/categories';
import { getProductUrl } from '../utils/navigation';
import { buildGeneralWhatsAppUrl } from '../data/commerceConfig';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentPath: string;
  onNavigate: (url: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  currentPath,
  onNavigate,
  cartCount,
  onOpenCart,
  onLogoClick,
}) => {
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format currency helper
  const formatPrice = (val: number | null) => {
    if (val === null) return '0';
    return new Intl.NumberFormat('tr-TR').format(val);
  };

  // Live matching suggestions (max 5)
  const suggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    return PRODUCTS.filter((p) => matchesSearchQuery(p, searchQuery));
  }, [searchQuery]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setIsSuggestionsOpen(false);
      onNavigate(`/arama?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    } else if (e.key === 'Escape') {
      setIsSuggestionsOpen(false);
    }
  };

  const whatsAppUrl = buildGeneralWhatsAppUrl();

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* 1. Üst şerit: 28px, koyu zemin */}
      <div className="h-[28px] bg-[#122129] text-white">
        <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px] h-full flex items-center justify-between">
          <span className="text-[12px] font-[500] text-white/80 tracking-normal">
            Profesyonel ölçüm teknolojileri
          </span>
          <a
            href="tel:02163789133"
            className="text-[12px] font-[500] text-white/90 hover:text-white transition-colors"
          >
            0216 378 91 33
          </a>
        </div>
      </div>

      {/* 2. Ana header: 88px */}
      <div className="h-[88px] bg-white border-b border-[#E2E7E8]">
        <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px] h-full flex items-center justify-between">
          
          {/* Solda: 1001cihaz resmi logosu ve dikey hizalı slogan metni */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (onLogoClick) {
                onLogoClick();
              } else {
                onNavigate('/');
              }
            }}
            className="flex flex-col justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16242B] rounded-[6px] px-2 py-1 -mx-2 -my-1 shrink-0 group"
            aria-label="1001cihaz Ana Sayfa"
          >
            <img
              src="/images/brand/logo-light.svg"
              alt="1001cihaz"
              width={220}
              height={44}
              className="w-[220px] h-auto object-contain"
            />
            <span
              className="mt-[5px] text-[12px] leading-[16px] font-[500] text-[#617078] whitespace-nowrap tracking-normal pl-[84px]"
            >
              Profesyoneller için doğru seçim.
            </span>
          </a>

          {/* Ortada: 520×46px belirgin arama with Live Suggestions Popover */}
          <div ref={searchContainerRef} className="w-[520px] relative">
            <div className="h-[46px] bg-[#F3F5F5] rounded-[8px] border border-[#E2E7E8] focus-within:border-[#16242B] focus-within:bg-white flex items-center px-4 transition-all">
              <button
                type="button"
                onClick={handleSearchSubmit}
                aria-label="Arama yap"
                className="text-[#637078] hover:text-[#16242B] transition-colors"
              >
                <Search className="w-[18px] h-[18px] flex-shrink-0" />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSuggestionsOpen(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) setIsSuggestionsOpen(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ürün adı, model veya ürün kodu ile arayın..."
                className="w-full bg-transparent border-none text-[15px] text-[#16242B] placeholder-[#637078] outline-none ml-2.5 font-normal"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    setIsSuggestionsOpen(false);
                  }}
                  className="text-[#637078] hover:text-[#16242B] p-1 ml-1"
                  aria-label="Aramayı temizle"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Autocomplete Suggestions Popover */}
            {isSuggestionsOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E2E7E8] rounded-[8px] shadow-xl z-50 overflow-hidden">
                {suggestions.length > 0 ? (
                  <div>
                    <div className="p-2.5 bg-[#F3F5F5]/70 border-b border-[#E2E7E8] text-[11px] font-[700] uppercase tracking-wider text-[#637078] flex justify-between items-center">
                      <span>Önerilen Ürünler ({suggestions.length})</span>
                      <span className="text-[10px] font-normal text-[#A0ADB5]">Enter ile tüm sonuçlar</span>
                    </div>

                    <div className="divide-y divide-[#E2E7E8] max-h-[320px] overflow-y-auto">
                      {suggestions.slice(0, 5).map((prod) => (
                        <div
                          key={prod.code}
                          onClick={() => {
                            setIsSuggestionsOpen(false);
                            onNavigate(getProductUrl(prod));
                          }}
                          className="p-3 hover:bg-[#F3F5F5] flex items-center gap-3 cursor-pointer transition-colors group"
                        >
                          <div className="w-11 h-11 bg-white border border-[#E2E7E8] rounded-[4px] p-1 flex items-center justify-center flex-shrink-0">
                            <img
                              src={prod.primaryImage}
                              alt={prod.shortTitle}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-[11px] font-mono text-[#637078]">
                              <span>Kod: {prod.code}</span>
                              <span>·</span>
                              <span>{prod.brand}</span>
                            </div>
                            <h4 className="text-[13px] font-[700] text-[#16242B] group-hover:text-[#C82B35] transition-colors truncate">
                              {prod.shortTitle}
                            </h4>
                          </div>

                          <div className="text-right flex-shrink-0">
                            {prod.salePrice !== null ? (
                              <span className="text-[13px] font-[700] text-[#16242B] font-mono">
                                {formatPrice(prod.salePrice)} TL
                              </span>
                            ) : (
                              <span className="text-[12px] font-[600] text-[#C82B35]">
                                Şu anda satışa kapalı
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full p-2.5 bg-[#16242B] hover:bg-[#C82B35] text-white text-[12px] font-[700] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Tüm sonuçları gör ({suggestions.length} ürün)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-[#637078] text-[13px]">
                    <p className="font-[600] text-[#16242B]">“{searchQuery}” için ürün bulunamadı</p>
                    <p className="text-[12px] mt-1">Farklı bir model veya ürün kodu ile aramayı deneyebilirsiniz.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sağda: teknik danışma ve adet göstergeli sepet (aynı düşey merkezde) */}
          <div className="flex items-center space-x-7">
            <a
              href={whatsAppUrl || undefined}
              target={whatsAppUrl ? '_blank' : undefined}
              rel={whatsAppUrl ? 'noopener noreferrer' : undefined}
              onClick={(e) => {
                if (!whatsAppUrl) {
                  e.preventDefault();
                }
              }}
              className="flex items-center space-x-2 text-[14px] font-[600] text-[#16242B] hover:text-[#15803D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] group"
              aria-label="WhatsApp ile teknik danışma (Yeni sekmede açılır)"
            >
              <WhatsAppIcon className="w-[18px] h-[18px] text-[#16A34A] group-hover:scale-105 transition-transform flex-shrink-0" />
              <span>Teknik danışma</span>
            </a>

            <button
              onClick={onOpenCart}
              className="flex items-center space-x-2 text-[14px] font-[600] text-[#16242B] hover:text-[#C82B35] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16242B]"
              aria-label="Sepeti Görüntüle"
            >
              <div className="relative">
                <ShoppingBag className="w-[20px] h-[20px] text-[#16242B]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#C82B35] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Sepet</span>
              {cartCount > 0 && (
                <span className="text-[#637078] font-normal">({cartCount})</span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* 3. Altında 48px kategori menüsü (Bağımsız URL'ler) */}
      <nav className="h-[48px] bg-white border-b border-[#E2E7E8]" aria-label="Kategori Gezintisi">
        <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px] h-full flex items-center">
          <div className="flex items-center space-x-8">
            {CATEGORY_DEFINITIONS.map((catDef) => {
              const categoryUrl = `/kategori/${catDef.slug}`;
              const isActive =
                currentPath === categoryUrl ||
                currentPath.startsWith(`${categoryUrl}?`) ||
                (catDef.slug === 'tum-urunler' && currentPath === '/kategori/tum-urunler');

              return (
                <button
                  key={catDef.slug}
                  onClick={() => onNavigate(categoryUrl)}
                  className={`text-[14px] font-[600] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16242B] ${
                    isActive
                      ? 'text-[#C82B35]'
                      : 'text-[#16242B] hover:text-[#C82B35]'
                  }`}
                >
                  {catDef.navTitle}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};
