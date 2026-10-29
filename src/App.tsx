import React, { useState, useEffect, useMemo } from 'react';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Product, PRODUCTS } from './data/products';
import { getProductBySlug, getProductUrl } from './utils/navigation';
import { getCategoryBySlug, getCategorySlugByName } from './utils/categories';
import { Header } from './components/Header';
import { HeroShowcase } from './components/HeroShowcase';
import { ValueStrip } from './components/ValueStrip';
import { ProductFamilies } from './components/ProductFamilies';
import { ProductGrid } from './components/ProductGrid';
import { ModularShowcase } from './components/ModularShowcase';
import { ConsultationSection } from './components/ConsultationSection';
import { Footer } from './components/Footer';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CategoryPage } from './components/CategoryPage';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { CheckoutPage } from './components/CheckoutPage';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CheckoutFormData, DEFAULT_CHECKOUT_FORM } from './data/commerceConfig';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const MainApp: React.FC = () => {
  const { currentPath, navigate } = useNavigation();

  // Extract pure pathname (without ?query)
  const pathname = useMemo(() => {
    return currentPath.split('?')[0] || '/';
  }, [currentPath]);

  // Global search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize searchQuery from URL when on /arama
  useEffect(() => {
    if (pathname === '/arama') {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get('q');
      if (q !== null) {
        setSearchQuery(q);
      }
    }
  }, [pathname, currentPath]);

  // Initialize cart from localStorage with strict catalog and positive-integer quantity validation
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('1001cihaz_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item: any) => {
              if (!item || typeof item !== 'object') return null;
              if (typeof item.code !== 'string') return null;

              // Enforce strictly positive integer numbers: reject string numerics, NaN, Infinity, fractions, <= 0
              if (
                typeof item.quantity !== 'number' ||
                !Number.isInteger(item.quantity) ||
                item.quantity <= 0
              ) {
                return null;
              }

              const product = PRODUCTS.find((p) => p.code === item.code);
              // Reject products with no price (null, undefined, <= 0) or unverified items
              if (
                !product ||
                product.salePrice === null ||
                typeof product.salePrice !== 'number' ||
                product.salePrice <= 0
              ) {
                return null;
              }

              return { product, quantity: item.quantity };
            })
            .filter((i): i is CartItem => i !== null);
        }
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage:', e);
    }
    return [];
  });

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      const serialized = cartItems.map((item) => ({
        code: item.product.code,
        quantity: item.quantity,
      }));
      localStorage.setItem('1001cihaz_cart', JSON.stringify(serialized));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout form data state preserved across navigation
  const [checkoutFormData, setCheckoutFormData] = useState<CheckoutFormData>(() => {
    try {
      const saved = sessionStorage.getItem('1001cihaz_checkout_form');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CHECKOUT_FORM;
  });

  const handleUpdateCheckoutFormData = (data: Partial<CheckoutFormData>) => {
    setCheckoutFormData((prev) => {
      const next = { ...prev, ...data };
      try {
        sessionStorage.setItem('1001cihaz_checkout_form', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // 1. ROUTE: Product Detail Match
  const currentProduct = useMemo(() => {
    if (pathname.startsWith('/urun/')) {
      const slug = pathname.replace(/^\/urun\//, '');
      return getProductBySlug(slug) || null;
    }
    return null;
  }, [pathname]);

  // 2. ROUTE: Category Match
  const currentCategoryDef = useMemo(() => {
    if (pathname.startsWith('/kategori/')) {
      const slug = pathname.replace(/^\/kategori\//, '');
      return getCategoryBySlug(slug) || null;
    }
    return null;
  }, [pathname]);

  // Is Search Page
  const isSearchPage = pathname === '/arama';

  // Is Checkout Page
  const isCheckoutPage = pathname === '/odeme';

  // Is invalid / 404 Route
  const is404 = useMemo(() => {
    if (pathname === '/') return false;
    if (pathname === '/arama') return false;
    if (pathname === '/odeme') return false;
    if (pathname.startsWith('/urun/')) return currentProduct === null;
    if (pathname.startsWith('/kategori/')) return currentCategoryDef === null;
    return true; // Any other unmatched URL
  }, [pathname, currentProduct, currentCategoryDef]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    // Prevent adding products with missing/null price
    if (product.salePrice === null || typeof product.salePrice !== 'number' || product.salePrice <= 0) {
      return;
    }
    const validatedQty = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.code === product.code);
      if (existing) {
        return prev.map((item) =>
          item.product.code === product.code
            ? { ...item, quantity: item.quantity + validatedQty }
            : item
        );
      }
      return [...prev, { product, quantity: validatedQty }];
    });
    setIsCartOpen(true);
  };

  const handleAddBundleToCart = (bundleItems: { product: Product; quantity: number }[]) => {
    setCartItems((prev) => {
      let updated = [...prev];

      bundleItems.forEach((bundleItem) => {
        // Enforce valid price and positive integer quantity
        if (
          bundleItem.product.salePrice === null ||
          typeof bundleItem.product.salePrice !== 'number' ||
          bundleItem.product.salePrice <= 0
        ) {
          return;
        }
        const qty =
          Number.isInteger(bundleItem.quantity) && bundleItem.quantity > 0
            ? bundleItem.quantity
            : 1;

        const existing = updated.find((item) => item.product.code === bundleItem.product.code);
        if (existing) {
          updated = updated.map((item) =>
            item.product.code === bundleItem.product.code
              ? { ...item, quantity: item.quantity + qty }
              : item
          );
        } else {
          updated.push({ product: bundleItem.product, quantity: qty });
        }
      });

      return updated;
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (code: string, qty: number) => {
    if (!Number.isInteger(qty) || qty <= 0) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.code === code ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveCartItem = (code: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.code !== code));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Navigation handlers
  const handleNavigateToProductByCode = (code: string) => {
    const target = PRODUCTS.find((p) => p.code === code);
    if (target) {
      navigate(getProductUrl(target));
    }
  };

  const handleCategorySelect = (categoryNameOrSlug: string) => {
    const slug = getCategorySlugByName(categoryNameOrSlug);
    navigate(`/kategori/${slug}`);
  };

  const handleLogoClick = () => {
    setSearchQuery('');
    navigate('/');
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#16242B]">
      {/* 1. Header: 28px top bar, 88px main bar, 48px category subnav with independent URLs */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentPath={currentPath}
        onNavigate={navigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onLogoClick={handleLogoClick}
      />

      {/* Main Content Area: Routes */}
      <main className="flex-1">
        {is404 ? (
          /* 404 NOT FOUND PAGE */
          <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px] py-24 text-center">
            <div className="w-16 h-16 bg-[#FBF0F0] text-[#C82B35] rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-[32px] font-[700] text-[#16242B]">
              {pathname.startsWith('/kategori/')
                ? 'Kategori Bulunamadı'
                : pathname.startsWith('/urun/')
                ? 'Ürün Bulunamadı'
                : 'Sayfa Bulunamadı'}
            </h1>
            <p className="text-[16px] text-[#637078] mt-2 max-w-md mx-auto leading-relaxed">
              {pathname.startsWith('/kategori/')
                ? 'Aradığınız kategori katalogda mevcut değil veya bağlantısı güncellenmiş olabilir.'
                : pathname.startsWith('/urun/')
                ? 'Aradığınız ürün katalogda bulunamadı veya bağlantı güncellendi.'
                : 'Ulaşmaya çalıştığınız sayfa mevcut değil veya taşınmış olabilir.'}
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/kategori/tum-urunler')}
                className="px-6 py-2.5 bg-[#16242B] hover:bg-[#C82B35] text-white text-[14px] font-[600] rounded-[6px] transition-colors"
              >
                Tüm Ürünleri Gör (17 Ürün)
              </button>
              <button
                type="button"
                onClick={handleLogoClick}
                className="px-6 py-2.5 bg-white border border-[#E2E7E8] hover:border-[#16242B] text-[#16242B] text-[14px] font-[600] rounded-[6px] inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ana Sayfaya Dön</span>
              </button>
            </div>
          </div>
        ) : isCheckoutPage ? (
          /* CHECKOUT / ALISVERISI TAMAMLA PAGE */
          <CheckoutPage
            items={cartItems}
            formData={checkoutFormData}
            onUpdateFormData={handleUpdateCheckoutFormData}
            onNavigate={navigate}
            onOpenCart={() => setIsCartOpen(true)}
          />
        ) : currentProduct ? (
          /* PRODUCT DETAIL PAGE */
          <ProductDetailPage
            product={currentProduct}
            onAddToCart={handleAddToCart}
            onAddBundleToCart={handleAddBundleToCart}
            onNavigate={navigate}
          />
        ) : currentCategoryDef ? (
          /* DEDICATED CATEGORY PAGE */
          <CategoryPage
            categoryDef={currentCategoryDef}
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
          />
        ) : isSearchPage ? (
          /* SEARCH RESULTS PAGE */
          <CategoryPage
            isSearchMode
            currentSearchQuery={searchQuery}
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
          />
        ) : (
          /* HOMEPAGE */
          <div className="pb-16">
            {/* 2. Hero Showcase: 4-slide slider */}
            <HeroShowcase
              onNavigate={navigate}
              onQuickViewByCode={handleNavigateToProductByCode}
              onFilterCategory={handleCategorySelect}
            />

            {/* 3. Short Value Strip: 64px high, 3 columns */}
            <ValueStrip />

            {/* 4. Product Families: Ne ölçmek istiyorsunuz? */}
            <ProductFamilies
              onSelectFamily={handleCategorySelect}
              onNavigate={navigate}
            />

            {/* 5. Editorial Showcase: Öne çıkan ölçüm çözümleri (8 ürün) */}
            <ProductGrid onNavigate={navigate} />

            {/* 6. Modular System Showcase */}
            <ModularShowcase
              onQuickView400GD={() => handleNavigateToProductByCode('681000')}
              onSelectSensor={handleNavigateToProductByCode}
            />

            {/* 7. Technical Consultation */}
            <ConsultationSection />
          </div>
        )}
      </main>

      {/* 8. Footer: Dark #122129 */}
      <Footer onSelectCategory={handleCategorySelect} onNavigate={navigate} />

      {/* Floating WhatsApp Consultation Box (Fixed at bottom-right 24px, responsive to sticky bottom bar & modals) */}
      <FloatingWhatsApp
        isCartOpen={isCartOpen}
        currentProduct={currentProduct}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onNavigate={navigate}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <NavigationProvider>
      <MainApp />
    </NavigationProvider>
  );
};

export default App;
