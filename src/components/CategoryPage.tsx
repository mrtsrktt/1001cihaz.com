import React, { useMemo } from 'react';
import { ChevronRight, X, Filter, RotateCcw, Search, Check } from 'lucide-react';
import { Product, PRODUCTS, SENSOR_PURPOSES, SensorPurpose } from '../data/products';
import { CategoryDefinition, matchesSearchQuery, getCategoryUrl } from '../utils/categories';
import { ProductCard } from './ProductCard';

interface CategoryPageProps {
  categoryDef?: CategoryDefinition;
  isSearchMode?: boolean;
  currentSearchQuery?: string;
  onNavigate: (url: string, options?: { scroll?: boolean }) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
}

export interface FilterState {
  group: string;
  purpose: string;
  priceRange: string;
  device?: string;
}

// Single source filter helper with excludedFacet support
export function matchesPriceRange(price: number | null, range: string): boolean {
  if (!range) return true;
  if (price === null) return false;
  if (range === 'under-10000' || range === '0-10000') return price < 10000;
  if (range === '10000-25000' || range === '10000-20000') return price >= 10000 && price <= 25000;
  if (range === 'over-25000' || range === '20000-plus') return price > 25000;
  return true;
}

export function applyFilters(
  products: Product[],
  filters: FilterState,
  excludedFacet?: 'group' | 'purpose' | 'priceRange' | 'device'
): Product[] {
  return products.filter((p) => {
    // 1. Group facet
    if (excludedFacet !== 'group' && filters.group) {
      if (p.productType !== filters.group) return false;
    }

    // 2. Sensor purpose facet (Single source of truth from p.sensorPurpose!)
    if (excludedFacet !== 'purpose' && filters.purpose) {
      if (p.sensorPurpose !== filters.purpose) return false;
    }

    // 3. Price range facet
    // Rule: products with null price are excluded when priceRange is active; return on clear
    if (excludedFacet !== 'priceRange' && filters.priceRange) {
      if (!matchesPriceRange(p.salePrice, filters.priceRange)) return false;
    }

    // 4. Device compatibility facet (if active and diverse)
    if (excludedFacet !== 'device' && filters.device) {
      if (!p.compatibleProductCodes || !p.compatibleProductCodes.includes(filters.device)) {
        return false;
      }
    }

    return true;
  });
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categoryDef,
  isSearchMode = false,
  currentSearchQuery = '',
  onNavigate,
}) => {
  // Parse URL search parameters for filter state
  const searchParams = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, [window.location.search]);

  const selectedGroup = searchParams.get('grup') || '';
  const selectedPurpose = (searchParams.get('amac') || searchParams.get('uygulama') || '') as SensorPurpose | '';
  const selectedDevice = searchParams.get('cihaz') || '';
  const selectedPriceRange = searchParams.get('fiyat') || '';
  const selectedSort = searchParams.get('sira') || 'varsayilan';
  const effectiveQuery = isSearchMode ? (searchParams.get('q') || currentSearchQuery || '') : '';

  // Current active filters object
  const currentFilters: FilterState = useMemo(() => {
    return {
      group: selectedGroup,
      purpose: selectedPurpose,
      priceRange: selectedPriceRange,
      device: selectedDevice,
    };
  }, [selectedGroup, selectedPurpose, selectedPriceRange, selectedDevice]);

  // Update URL parameters helper
  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    if (updates.amac !== undefined) params.delete('uygulama');

    const queryString = params.toString();
    const basePath = window.location.pathname;
    onNavigate(queryString ? `${basePath}?${queryString}` : basePath, { scroll: false });
  };

  const handleClearAllFilters = () => {
    const params = new URLSearchParams();
    if (isSearchMode && effectiveQuery) {
      params.set('q', effectiveQuery);
    }
    const queryString = params.toString();
    onNavigate(queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname, {
      scroll: false,
    });
  };

  // Base product list for category or search scope
  const baseProducts = useMemo(() => {
    if (isSearchMode) {
      if (!effectiveQuery.trim()) return PRODUCTS;
      return PRODUCTS.filter((p) => matchesSearchQuery(p, effectiveQuery));
    }
    if (!categoryDef || categoryDef.productType === 'all') {
      return PRODUCTS;
    }
    return PRODUCTS.filter((p) => p.productType === categoryDef.productType);
  }, [categoryDef, isSearchMode, effectiveQuery]);

  // Determine if sensor compatibility in this scope is diverse or identical
  // Requirement 3: All 9 sensors are compatible with both 400GD and 500GD -> show info banner instead of redundant filter!
  const hasDiverseCompatibility = useMemo(() => {
    const sensors = baseProducts.filter((p) => p.productType === 'sensor');
    if (sensors.length === 0) return false;
    const firstCompatKey = sensors[0].compatibleProductCodes.slice().sort().join(',');
    return sensors.some((s) => s.compatibleProductCodes.slice().sort().join(',') !== firstCompatKey);
  }, [baseProducts]);

  // =========================================================================
  // FACETED COUNTS (applyFilters with excludedFacet)
  // Maintains category/search scope, applies all other filters, excludes own facet!
  // =========================================================================

  // 1. Group facet counts (excludes 'group')
  const groupCounts = useMemo(() => {
    const productsForGroup = applyFilters(baseProducts, currentFilters, 'group');
    return {
      all: productsForGroup.length,
      base_device: productsForGroup.filter((p) => p.productType === 'base_device').length,
      sensor: productsForGroup.filter((p) => p.productType === 'sensor').length,
      manometer: productsForGroup.filter((p) => p.productType === 'manometer').length,
      set: productsForGroup.filter((p) => p.productType === 'set').length,
    };
  }, [baseProducts, currentFilters]);

  // 2. Sensor purpose facet counts (excludes 'purpose')
  // When Sensörler + under-10000 is active:
  // Yanıcı gaz: 3, Soğutucu gaz: 1, Ortam gazı: 1, Sıcaklık/iklim: 2, Baca geri tepmesi: 1!
  const purposeCounts = useMemo(() => {
    const productsForPurpose = applyFilters(baseProducts, currentFilters, 'purpose');
    const counts: Record<string, number> = {
      all: productsForPurpose.filter((p) => p.productType === 'sensor').length,
    };
    SENSOR_PURPOSES.forEach((p) => {
      counts[p.key] = productsForPurpose.filter((prod) => prod.sensorPurpose === p.key).length;
    });
    return counts;
  }, [baseProducts, currentFilters]);

  // 3. Price range facet counts (excludes 'priceRange')
  const priceCounts = useMemo(() => {
    const productsForPrice = applyFilters(baseProducts, currentFilters, 'priceRange');
    return {
      all: productsForPrice.length,
      'under-10000': productsForPrice.filter((p) => matchesPriceRange(p.salePrice, 'under-10000')).length,
      '10000-25000': productsForPrice.filter((p) => matchesPriceRange(p.salePrice, '10000-25000')).length,
      'over-25000': productsForPrice.filter((p) => matchesPriceRange(p.salePrice, 'over-25000')).length,
    };
  }, [baseProducts, currentFilters]);

  // Apply all active filters to get filtered list
  const filteredProducts = useMemo(() => {
    return applyFilters(baseProducts, currentFilters);
  }, [baseProducts, currentFilters]);

  // Apply sorting
  // Critical requirement: Fiyatsız ürünler her iki fiyat sıralamasında da sonda bulunsun.
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    switch (selectedSort) {
      case 'fiyat-artan':
        return list.sort((a, b) => {
          if (a.salePrice === null) return 1;
          if (b.salePrice === null) return -1;
          return a.salePrice - b.salePrice;
        });

      case 'fiyat-azalan':
        return list.sort((a, b) => {
          if (a.salePrice === null) return 1;
          if (b.salePrice === null) return -1;
          return b.salePrice - a.salePrice;
        });

      case 'ad-artan':
        return list.sort((a, b) => a.shortTitle.localeCompare(b.shortTitle, 'tr-TR'));

      case 'varsayilan':
      default:
        return list;
    }
  }, [filteredProducts, selectedSort]);

  // Visibility flags
  const isSpecificCategory = categoryDef && categoryDef.productType !== 'all' && !isSearchMode;
  const isSensorRelevant =
    categoryDef?.slug === 'sensorler' ||
    categoryDef?.productType === 'all' ||
    isSearchMode ||
    selectedGroup === 'sensor';

  const showGroupFilter = !isSpecificCategory; // Hide redundant group filter inside single-group category

  // Active filters list for chips/pills
  const activeFilters = useMemo(() => {
    const list: { key: string; label: string; onRemove: () => void }[] = [];

    if (selectedGroup) {
      const groupNames: Record<string, string> = {
        base_device: 'Gaz Kaçak Dedektörleri',
        sensor: 'Sensörler',
        manometer: 'Dijital Manometreler',
        set: 'Baca Gazı Analizörleri',
      };
      list.push({
        key: 'grup',
        label: `Grup: ${groupNames[selectedGroup] || selectedGroup}`,
        onRemove: () => updateParams({ grup: null }),
      });
    }

    if (selectedPurpose) {
      const match = SENSOR_PURPOSES.find((p) => p.key === selectedPurpose);
      const labelText = match ? match.label : selectedPurpose;
      list.push({
        key: 'amac',
        label: `Sensör Amacı: ${labelText}`,
        onRemove: () => updateParams({ amac: null, uygulama: null }),
      });
    }

    if (hasDiverseCompatibility && selectedDevice) {
      const deviceNames: Record<string, string> = {
        '681000': 'MRU 400GD ile Uyumlu',
        '682000': 'MRU 500GD ile Uyumlu',
      };
      list.push({
        key: 'cihaz',
        label: `Uyum: ${deviceNames[selectedDevice] || selectedDevice}`,
        onRemove: () => updateParams({ cihaz: null }),
      });
    }

    if (selectedPriceRange) {
      const priceNames: Record<string, string> = {
        'under-10000': '10.000 TL altı',
        '0-10000': '10.000 TL altı',
        '10000-25000': '10.000 TL – 25.000 TL',
        '10000-20000': '10.000 TL – 25.000 TL',
        'over-25000': '25.000 TL üzeri',
        '20000-plus': '25.000 TL üzeri',
      };
      list.push({
        key: 'fiyat',
        label: `Fiyat: ${priceNames[selectedPriceRange] || selectedPriceRange}`,
        onRemove: () => updateParams({ fiyat: null }),
      });
    }

    return list;
  }, [selectedGroup, selectedPurpose, selectedPriceRange, selectedDevice, hasDiverseCompatibility]);

  // Page header texts
  const pageTitle = isSearchMode
    ? effectiveQuery
      ? `"${effectiveQuery}" için Arama Sonuçları`
      : 'Katalogda Arama'
    : categoryDef?.title || 'Tüm Ürünler';

  const pageDescription = isSearchMode
    ? `Katalogdaki ürün adı, model, açıklama ve ürün kodlarına göre listelenen sonuçlar.`
    : categoryDef?.shortDescription ||
      'MRU markalı profesyonel gaz ölçüm cihazları, sensörler ve emisyon analizörleri kataloğu.';

  return (
    <div className="bg-white text-[#16242B] pb-24 min-h-[70vh]">
      
      {/* 1. Breadcrumbs Bar */}
      <div className="border-b border-[#E2E7E8] bg-[#F3F5F5]/60">
        <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px] py-3 text-[13px] text-[#4A5568] flex items-center gap-2">
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-[#16242B] transition-colors"
          >
            Ana Sayfa
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0ADB5]" />
          {isSearchMode ? (
            <span className="text-[#16242B] font-[600]">Arama Sonuçları</span>
          ) : (
            <span className="text-[#16242B] font-[600]">{categoryDef?.navTitle || 'Ürünler'}</span>
          )}
        </div>
      </div>

      {/* 2. Compact Category Header (No big hero, products visible immediately) */}
      <div className="border-b border-[#E2E7E8] bg-white py-6">
        <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[36px] font-[700] text-[#16242B] tracking-tight leading-tight">
                  {pageTitle}
                </h1>
                <span className="px-3 py-1 rounded-full bg-[#F3F5F5] border border-[#E2E7E8] text-[13px] font-[700] text-[#637078]">
                  {sortedProducts.length} Ürün
                </span>
              </div>
              <p className="text-[15px] leading-[24px] text-[#637078] mt-2 max-w-3xl line-clamp-2">
                {pageDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Catalog Layout (240px Sidebar + 24px Gap + 3-col Grid) */}
      <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px] mt-8">
        <div className="flex gap-6 items-start">
          
          {/* ======================================================== */}
          {/* LEFT FILTER SIDEBAR (240px)                              */}
          {/* ======================================================== */}
          <aside className="w-[240px] flex-shrink-0 bg-white border border-[#E2E7E8] rounded-[8px] p-5 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7E8]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#16242B]" />
                <span className="text-[14px] font-[700] text-[#16242B]">Filtreler</span>
              </div>
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-[12px] font-[600] text-[#C82B35] hover:underline"
                >
                  Temizle
                </button>
              )}
            </div>

            {/* A. Ürün Grubu (Faceted dynamic counts from applyFilters) */}
            {showGroupFilter && (
              <div className="space-y-3">
                <h3 className="text-[12px] font-[700] text-[#16242B] uppercase tracking-wider">
                  Ürün Grubu
                </h3>
                <div className="space-y-1.5 text-[13px]">
                  {[
                    { key: '', label: 'Tüm Gruplar', count: groupCounts.all },
                    { key: 'base_device', label: 'Gaz Kaçak Dedektörleri', count: groupCounts.base_device },
                    { key: 'sensor', label: 'Sensörler', count: groupCounts.sensor },
                    { key: 'manometer', label: 'Dijital Manometreler', count: groupCounts.manometer },
                    { key: 'set', label: 'Baca Gazı Analizörleri', count: groupCounts.set },
                  ].map((grp) => {
                    const isSelected = selectedGroup === grp.key;
                    return (
                      <button
                        key={grp.key}
                        type="button"
                        onClick={() => updateParams({ grup: grp.key || null })}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[4px] text-left transition-colors ${
                          isSelected
                            ? 'bg-[#16242B] text-white font-[600]'
                            : 'text-[#4A5568] hover:bg-[#F3F5F5] hover:text-[#16242B]'
                        }`}
                      >
                        <span className="leading-snug pr-1">{grp.label}</span>
                        <span className={`text-[11px] font-mono flex-shrink-0 ${isSelected ? 'text-white/80' : 'text-[#A0ADB5]'}`}>
                          {grp.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* B. Sensörlerde Kullanım Amacı (Single source of truth from SENSOR_PURPOSES) */}
            {isSensorRelevant && (
              <div className="space-y-3 pt-4 border-t border-[#E2E7E8]">
                <h3 className="text-[12px] font-[700] text-[#16242B] uppercase tracking-wider">
                  Sensör Amacı
                </h3>
                <div className="space-y-1.5 text-[13px]">
                  <button
                    type="button"
                    onClick={() => updateParams({ amac: null, uygulama: null })}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[4px] text-left transition-colors ${
                      !selectedPurpose
                        ? 'bg-[#16242B] text-white font-[600]'
                        : 'text-[#4A5568] hover:bg-[#F3F5F5] hover:text-[#16242B]'
                    }`}
                  >
                    <span className="leading-snug pr-1">Tüm Sensörler</span>
                    <span className={`text-[11px] font-mono flex-shrink-0 ${!selectedPurpose ? 'text-white/80' : 'text-[#A0ADB5]'}`}>
                      {purposeCounts.all}
                    </span>
                  </button>

                  {/* 5 Shared Groups: 3 / 1 / 2 / 2 / 1 - labels wrap naturally across 2 lines if needed */}
                  {SENSOR_PURPOSES.map((purp) => {
                    const isSelected = selectedPurpose === purp.key;
                    const count = purposeCounts[purp.key] || 0;
                    return (
                      <button
                        key={purp.key}
                        type="button"
                        onClick={() => updateParams({ amac: purp.key })}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[4px] text-left transition-colors ${
                          isSelected
                            ? 'bg-[#16242B] text-white font-[600]'
                            : 'text-[#4A5568] hover:bg-[#F3F5F5] hover:text-[#16242B]'
                        }`}
                      >
                        <span className="leading-snug pr-1">{purp.label}</span>
                        <span className={`text-[11px] font-mono flex-shrink-0 ${isSelected ? 'text-white/80' : 'text-[#A0ADB5]'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* C. Cihaz Uyumluluğu (Requirement 3: Informational banner if all compatible; dynamic filter if diverse) */}
            {isSensorRelevant && (
              <div className="pt-4 border-t border-[#E2E7E8]">
                <h3 className="text-[12px] font-[700] text-[#16242B] uppercase tracking-wider mb-2">
                  Cihaz Uyumluluğu
                </h3>
                {hasDiverseCompatibility ? (
                  <div className="space-y-1.5 text-[13px]">
                    {[
                      { key: '', label: 'Tüm Dedektörler' },
                      { key: '681000', label: 'MRU 400GD ile Uyumlu' },
                      { key: '682000', label: 'MRU 500GD ile Uyumlu' },
                    ].map((dev) => {
                      const isSelected = selectedDevice === dev.key;
                      return (
                        <button
                          key={dev.key}
                          type="button"
                          onClick={() => updateParams({ cihaz: dev.key || null })}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[4px] text-left transition-colors ${
                            isSelected
                              ? 'bg-[#16242B] text-white font-[600]'
                              : 'text-[#4A5568] hover:bg-[#F3F5F5] hover:text-[#16242B]'
                          }`}
                        >
                          <span className="truncate">{dev.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 bg-[#F3F5F5] border border-[#E2E7E8] rounded-[6px] flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#C82B35] flex-shrink-0 mt-0.5" />
                    <span className="text-[12px] text-[#4A5568] leading-snug font-[500]">
                      Bu sensörler MRU 400GD ve 500GD ile uyumludur.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* D. Fiyat Aralığı (Faceted dynamic counts from applyFilters) */}
            <div className="space-y-3 pt-4 border-t border-[#E2E7E8]">
              <h3 className="text-[12px] font-[700] text-[#16242B] uppercase tracking-wider">
                Fiyat Aralığı
              </h3>
              <div className="space-y-1.5 text-[13px]">
                {[
                  { key: '', label: 'Tüm Fiyatlar', count: priceCounts.all },
                  { key: 'under-10000', label: '10.000 TL altı', count: priceCounts['under-10000'] },
                  { key: '10000-25000', label: '10.000 – 25.000 TL', count: priceCounts['10000-25000'] },
                  { key: 'over-25000', label: '25.000 TL üzeri', count: priceCounts['over-25000'] },
                ].map((prc) => {
                  const isSelected =
                    selectedPriceRange === prc.key ||
                    (prc.key === 'under-10000' && selectedPriceRange === '0-10000') ||
                    (prc.key === 'over-25000' && selectedPriceRange === '20000-plus');

                  return (
                    <button
                      key={prc.key}
                      type="button"
                      onClick={() => updateParams({ fiyat: prc.key || null })}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[4px] text-left transition-colors ${
                        isSelected
                          ? 'bg-[#16242B] text-white font-[600]'
                          : 'text-[#4A5568] hover:bg-[#F3F5F5] hover:text-[#16242B]'
                      }`}
                    >
                      <span className="truncate">{prc.label}</span>
                      <span className={`text-[11px] font-mono flex-shrink-0 ${isSelected ? 'text-white/80' : 'text-[#A0ADB5]'}`}>
                        {prc.count}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-[#A0ADB5] leading-normal pt-1">
                Fiyat filtresi devredeyken fiyatsız modeller (DM9600 10 bar) gizlenir.
              </p>
            </div>

          </aside>

          {/* ======================================================== */}
          {/* RIGHT PRODUCT GRID & TOOLBAR                             */}
          {/* ======================================================== */}
          <main className="flex-1 min-w-0">
            
            {/* Top Toolbar: Results count, active filter tags, sort */}
            <div className="bg-[#F3F5F5] border border-[#E2E7E8] rounded-[8px] p-3.5 mb-6 flex flex-wrap items-center justify-between gap-4">
              
              {/* Left: Count & Active Filter Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-[700] text-[#16242B]">
                  {sortedProducts.length} sonuç listeleniyor
                </span>

                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 ml-2 pl-3 border-l border-[#E2E7E8]">
                    {activeFilters.map((flt) => (
                      <span
                        key={flt.key}
                        className="inline-flex items-center gap-1 bg-white border border-[#E2E7E8] text-[#16242B] text-[12px] font-[600] pl-2.5 pr-1.5 py-0.5 rounded-full shadow-2xs"
                      >
                        <span>{flt.label}</span>
                        <button
                          type="button"
                          onClick={flt.onRemove}
                          aria-label={`${flt.label} filtresini kaldır`}
                          className="hover:bg-[#F3F5F5] rounded-full p-0.5 text-[#637078] hover:text-[#C82B35]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={handleClearAllFilters}
                      className="text-[12px] font-[600] text-[#C82B35] hover:underline ml-1"
                    >
                      Tümünü temizle
                    </button>
                  </div>
                )}
              </div>

              {/* Right: Sort Dropdown */}
              <div className="flex items-center gap-2 ml-auto">
                <label htmlFor="catalog-sort" className="text-[13px] text-[#4A5568] whitespace-nowrap">
                  Sırala:
                </label>
                <select
                  id="catalog-sort"
                  value={selectedSort}
                  onChange={(e) => updateParams({ sira: e.target.value === 'varsayilan' ? null : e.target.value })}
                  className="bg-white border border-[#E2E7E8] rounded-[6px] px-3 py-1.5 text-[13px] font-[600] text-[#16242B] outline-none focus:border-[#16242B] transition-colors cursor-pointer"
                >
                  <option value="varsayilan">Varsayılan (Katalog Sırası)</option>
                  <option value="fiyat-artan">Fiyat: Düşükten Yükseğe</option>
                  <option value="fiyat-azalan">Fiyat: Yüksekten Düşüğe</option>
                  <option value="ad-artan">Ürün Adı: A – Z</option>
                </select>
              </div>

            </div>

            {/* Product Cards: 3-column Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.code}
                    product={product}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            ) : (
              /* EMPTY RESULTS SCREEN */
              <div className="bg-[#F3F5F5] border border-[#E2E7E8] rounded-[8px] p-12 text-center my-6">
                <div className="w-12 h-12 rounded-full bg-white border border-[#E2E7E8] mx-auto flex items-center justify-center text-[#637078] mb-4">
                  {isSearchMode ? <Search className="w-6 h-6 text-[#C82B35]" /> : <Filter className="w-6 h-6" />}
                </div>
                <h2 className="text-[20px] font-[700] text-[#16242B]">
                  {isSearchMode ? `“${effectiveQuery}” araması için sonuç bulunamadı` : 'Eşleşen Ürün Bulunamadı'}
                </h2>
                <p className="text-[14px] text-[#637078] max-w-md mx-auto mt-2 leading-relaxed">
                  Seçili filtre kriterlerine uygun bir model bulunamadı. Filtreleri temizleyerek tüm modelleri inceleyebilirsiniz.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="px-5 py-2.5 bg-[#16242B] hover:bg-[#C82B35] text-white text-[13px] font-[700] rounded-[6px] inline-flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Filtreleri Temizle</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate(getCategoryUrl('tum-urunler'))}
                    className="px-5 py-2.5 bg-white border border-[#E2E7E8] hover:border-[#16242B] text-[#16242B] text-[13px] font-[700] rounded-[6px] transition-colors"
                  >
                    Tüm Ürünleri Gör
                  </button>
                </div>
              </div>
            )}

          </main>

        </div>
      </div>

    </div>
  );
};
