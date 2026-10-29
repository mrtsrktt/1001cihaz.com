import React, { useState, useEffect, useRef } from 'react';
import { Product, PRODUCTS } from '../data/products';
import { SensorConfigurator } from './SensorConfigurator';
import { getProductUrl } from '../utils/navigation';
import { getCategorySlugByType } from '../utils/categories';
import { scrollToElement } from '../utils/scroll';
import { CONTACT_CONFIG, buildWhatsAppInquiryUrl } from '../data/commerceConfig';
import {
  ShoppingBag,
  ArrowRight,
  ZoomIn,
  X,
  Check,
  AlertCircle,
  Package,
  Layers,
  FileText,
  Phone,
  ChevronRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';

import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onAddBundleToCart?: (items: { product: Product; quantity: number }[]) => void;
  onNavigate: (to: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onAddToCart,
  onAddBundleToCart,
  onNavigate,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [deviceQuantity, setDeviceQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'box' | 'compatible'>('overview');
  
  // Base device sensor configuration state (for 400GD and 500GD)
  const isBaseDevice = product.productType === 'base_device';
  const [selectedSensorCodes, setSelectedSensorCodes] = useState<string[]>([]);
  const [sensorQuantities, setSensorQuantities] = useState<Record<string, number>>({});
  const [showSensorWarning, setShowSensorWarning] = useState(false);

  // Sticky bottom purchase bar visibility tracking
  const topBuySectionRef = useRef<HTMLDivElement>(null);
  const [showBottomBar, setShowBottomBar] = useState(false);

  // Pre-calculated WhatsApp inquiry URL containing product name, code and canonical page link
  const whatsAppInquiryUrl = buildWhatsAppInquiryUrl(product);

  // Reset image, zoom, tab, and selections when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setIsZoomOpen(false);
    setActiveTab('overview');
    setDeviceQuantity(1);
    setSelectedSensorCodes([]);
    setSensorQuantities({});
    setShowSensorWarning(false);
    setShowBottomBar(false);
    window.scrollTo(0, 0);
  }, [product.code]);

  // Track when top buy action area leaves the viewport
  useEffect(() => {
    const el = topBuySectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowBottomBar(false);
        } else {
          // Only show when the top section has scrolled above the viewport
          const isAboveViewport = entry.boundingClientRect.top < 0;
          setShowBottomBar(isAboveViewport);
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [product.code]);

  const formatPrice = (val: number | null) => {
    if (val === null) return '0';
    return new Intl.NumberFormat('tr-TR').format(val);
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.primaryImage];
  const activeImage = images[selectedImageIndex] || product.primaryImage;

  // Selected sensors list verified by compatibleProductCodes
  const compatibleCodes = product.compatibleProductCodes || [];
  const selectedSensors = PRODUCTS.filter(
    (p) => selectedSensorCodes.includes(p.code) && compatibleCodes.includes(p.code) && p.salePrice !== null
  );

  const totalSensorItemsCount = selectedSensors.reduce(
    (sum, s) => sum + (sensorQuantities[s.code] || 1),
    0
  );

  // Current selection total price (KDV hariç)
  const basePriceTotal = product.salePrice !== null ? product.salePrice * deviceQuantity : null;
  const sensorsPriceTotal = isBaseDevice
    ? selectedSensors.reduce(
        (sum, s) => sum + (s.salePrice !== null ? s.salePrice * (sensorQuantities[s.code] || 1) : 0),
        0
      )
    : 0;
  const currentSelectionTotal =
    product.salePrice !== null ? (basePriceTotal || 0) + sensorsPriceTotal : null;

  // Handle direct buy button click
  const handlePrimaryBuy = () => {
    if (product.salePrice === null) {
      // Product without price is closed for sale; cannot be added to cart
      return;
    }

    if (isBaseDevice && selectedSensors.length === 0) {
      // Prompt calm warning with two options and scroll to view
      setShowSensorWarning(true);
      const el = document.getElementById('sensor-warning-box') || topBuySectionRef.current;
      scrollToElement(el);
      return;
    }

    if (isBaseDevice && selectedSensors.length > 0) {
      const bundleItems = [
        { product, quantity: deviceQuantity },
        ...selectedSensors.map((s) => ({
          product: s,
          quantity: sensorQuantities[s.code] || 1,
        })),
      ];
      if (onAddBundleToCart) {
        onAddBundleToCart(bundleItems);
      } else {
        bundleItems.forEach((item) => onAddToCart(item.product, item.quantity));
      }
      return;
    }

    onAddToCart(product, deviceQuantity);
  };

  const handleOnlyDeviceAdd = () => {
    setShowSensorWarning(false);
    onAddToCart(product, deviceQuantity);
  };

  const handleScrollToSensors = () => {
    setShowSensorWarning(false);
    const el = document.getElementById('sensor-secimi');
    scrollToElement(el);
  };

  const handleToggleSensor = (code: string) => {
    setSelectedSensorCodes((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      } else {
        setSensorQuantities((q) => ({ ...q, [code]: q[code] || 1 }));
        return [...prev, code];
      }
    });
  };

  const handleUpdateSensorQuantity = (code: string, qty: number) => {
    setSensorQuantities((prev) => ({
      ...prev,
      [code]: Math.max(1, qty),
    }));
  };

  const handleRemoveSensor = (code: string) => {
    setSelectedSensorCodes((prev) => prev.filter((c) => c !== code));
  };

  const handleAddBundleToCartInternal = (items: { product: Product; quantity: number }[]) => {
    if (onAddBundleToCart) {
      onAddBundleToCart(items);
    } else {
      items.forEach((item) => onAddToCart(item.product, item.quantity));
    }
  };

  // Find compatible or alternative products based on rules
  const getContextualRelations = () => {
    if (product.productType === 'sensor') {
      // Find base devices that list this sensor code in compatibleProductCodes
      const baseDevices = PRODUCTS.filter(
        (p) => p.productType === 'base_device' && (p.compatibleProductCodes.includes(product.code) || product.compatibleProductCodes.includes(p.code))
      );

      return {
        title: 'Bu Sensörle Uyumlu Cihazlar',
        subtitle: 'Bu sensör başlığı aşağıdaki akıllı MRU dedektör gövdeleriyle tam uyumlu çalışır:',
        products: baseDevices,
        type: 'base_devices' as const,
      };
    }

    if (product.productType === 'manometer') {
      return {
        title: 'Diğer Ölçüm Aralıkları',
        subtitle: 'DM9600 serisi farklı basınç aralıklarına sahip alternatif modeller:',
        products: PRODUCTS.filter((p) => p.productType === 'manometer' && p.code !== product.code),
        type: 'range_alternatives' as const,
      };
    }

    if (product.productType === 'set') {
      return {
        title: 'Alternatif Baca Gazı Analiz Cihazı',
        subtitle: 'Farklı emisyon ve kapasite gereksinimleri için alternatif MRU analiz seti:',
        products: PRODUCTS.filter((p) => p.productType === 'set' && p.code !== product.code),
        type: 'set_alternatives' as const,
      };
    }

    return {
      title: 'Alternatif Baz Cihaz ve Başlıklar',
      subtitle: '400GD ve 500GD dedektör serisi donanım seçenekleri:',
      products: PRODUCTS.filter((p) => p.productType === 'base_device' && p.code !== product.code),
      type: 'base_alternatives' as const,
    };
  };

  const relations = getContextualRelations();

  // Dynamically derive manometer range options directly from PRODUCTS catalog
  // Single source of truth for code, range, price, and URL
  const manometerOptions = PRODUCTS.filter((p) => p.productType === 'manometer').map((p) => {
    const match = p.shortTitle.match(/\((±[^)]+)\)/) || p.name.match(/\((±[^)]+)\)/);
    const range = match ? match[1] : p.model.replace('MRU DM9600 ', '');
    const priceDisplay =
      p.salePrice !== null && p.salePrice > 0
        ? `${formatPrice(p.salePrice)} TL`
        : 'Şu anda satışa kapalı';

    return {
      product: p,
      code: p.code,
      range,
      priceDisplay,
      url: getProductUrl(p),
    };
  });

  return (
    <div className="bg-white text-[#16242B] pb-32">
      
      {/* 1. Breadcrumb Bar */}
      <div className="border-b border-[#E2E7E8] bg-[#F3F5F5]/60">
        <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px] py-3 text-[13px] text-[#4A5568] flex items-center gap-2">
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-[#16242B] transition-colors"
          >
            Ana Sayfa
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0ADB5]" />
          <button
            onClick={() => onNavigate(`/kategori/${getCategorySlugByType(product.productType)}`)}
            className="hover:text-[#16242B] transition-colors"
          >
            {product.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0ADB5]" />
          <span className="text-[#16242B] font-[600] truncate max-w-md">
            {product.model}
          </span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px] mt-8">
        
        {/* 2. Top Section: Left ~52% Visual, Right ~48% Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: Product Visuals (Gallery on white background so white PNGs blend naturally) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* Main Image Box: Pure white background */}
            <div
              onClick={() => setIsZoomOpen(true)}
              className="w-full h-[440px] bg-white rounded-[10px] border border-[#E2E7E8] flex items-center justify-center p-8 relative cursor-zoom-in group overflow-hidden shadow-xs"
              title="Görseli büyütmek için tıklayın"
            >
              <img
                key={activeImage}
                src={activeImage}
                alt={product.shortTitle}
                className="max-h-[380px] max-w-full object-contain group-hover:scale-[1.03] transition-all duration-[180ms] ease-out motion-reduce:transform-none motion-reduce:transition-none"
                loading="eager"
              />

              <div className="absolute bottom-4 right-4 bg-white/95 border border-[#E2E7E8] text-[#16242B] text-[12px] font-[600] px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-[180ms] shadow-xs">
                <ZoomIn className="w-3.5 h-3.5 text-[#C82B35]" />
                <span>Büyüt</span>
              </div>
            </div>

            {/* Thumbnails Row: Pure white background */}
            {images.length > 1 && (
              <div className="flex items-center gap-3">
                {images.map((imgUrl, idx) => (
                  <button
                    key={imgUrl}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 bg-white rounded-[6px] border p-2 flex items-center justify-center transition-all duration-[180ms] motion-reduce:transition-none ${
                      selectedImageIndex === idx
                        ? 'border-[#16242B] ring-2 ring-[#16242B]'
                        : 'border-[#E2E7E8] hover:border-[#16242B]/50'
                    }`}
                    aria-label={`Görsel ${idx + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.model} Görsel ${idx + 1}`}
                      className="max-h-full max-w-full object-contain"
                      loading="eager"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Verified Origin Strip */}
            <div className="mt-2 p-3.5 bg-[#F3F5F5] rounded-[8px] border border-[#E2E7E8] flex items-center justify-between text-[12px] text-[#4A5568]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C82B35]" />
                <span className="font-[600] text-[#16242B]">Orijinal MRU GmbH Üretimi</span>
              </div>
              <span>Orijinal MRU Fabrika Dokümantasyonu</span>
            </div>

          </div>

          {/* RIGHT: Buy Box & Product Info */}
          <div data-product-buy-box="true" className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Product Code & Model Meta */}
              <div className="flex items-center gap-3 text-[13px] text-[#4A5568] font-mono">
                <span>Model: <strong className="text-[#16242B] font-[700]">{product.model}</strong></span>
                <span>•</span>
                <span>Ürün Kodu: <strong className="text-[#16242B] font-[700]">{product.code}</strong></span>
              </div>

              {/* 32px Product Title */}
              <h1 className="text-[32px] font-[700] text-[#16242B] tracking-tight leading-[40px] mt-2">
                {product.shortTitle}
              </h1>

              {/* 16px / 26px Short Description */}
              <p className="text-[16px] leading-[26px] text-[#4A5568] mt-3">
                {product.shortDescription}
              </p>

              {/* MANOMETER PRESSURE RANGE SELECTOR (ABOVE PRICE) */}
              {product.productType === 'manometer' && (
                <div className="mt-5 p-4 bg-[#F3F5F5] border border-[#E2E7E8] rounded-[8px]">
                  <span className="text-[12px] font-[700] text-[#16242B] block mb-2">
                    Ölçüm Aralığı Seçimi (DM9600 Modelleri):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {manometerOptions.map((opt) => {
                      const isCurrent = opt.code === product.code;

                      return (
                        <button
                          key={opt.code}
                          type="button"
                          onClick={() => onNavigate(opt.url)}
                          className={`p-2.5 rounded-[6px] border text-center transition-all ${
                            isCurrent
                              ? 'bg-[#16242B] border-[#16242B] text-white shadow-sm'
                              : 'bg-white border-[#E2E7E8] text-[#16242B] hover:border-[#16242B]'
                          }`}
                        >
                          <strong className="block text-[13px] font-[700]">{opt.range}</strong>
                          <span className={`block text-[11px] mt-0.5 ${isCurrent ? 'text-white/80' : 'text-[#4A5568]'}`}>
                            {opt.priceDisplay}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Base Device Sensor Notice (For 400GD & 500GD) */}
              {isBaseDevice && (
                <div className="mt-5 p-4 bg-[#FBF0F0] border border-[#E2E7E8] rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-[#C82B35] mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-[13px] font-[700] text-[#16242B] block">
                        Baz cihaz — sensör dahil değildir
                      </strong>
                      <span className="text-[12px] text-[#4A5568] block mt-0.5">
                        Ölçüm yapabilmek için amaca uygun en az 1 adet tak-kullan sensör seçilmelidir.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleScrollToSensors}
                    className="px-3.5 py-1.5 rounded-[6px] bg-[#16242B] hover:bg-[#C82B35] text-white text-[12px] font-[600] whitespace-nowrap transition-colors flex items-center gap-1 self-start sm:self-center"
                  >
                    <span>Uyumlu sensörünü seç</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Price Area */}
              <div className="mt-6 pt-5 border-t border-[#E2E7E8]">
                {product.salePrice !== null ? (
                  <div>
                    {product.listPrice && product.listPrice !== product.salePrice && (
                      <div className="text-[14px] text-[#4A5568] line-through">
                        {formatPrice(product.listPrice)} TL
                      </div>
                    )}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-[32px] font-[800] text-[#16242B] tracking-tight leading-none font-mono">
                        {formatPrice(product.salePrice)}
                      </span>
                      <span className="text-[18px] font-[700] text-[#16242B]">TL</span>
                      <span className="text-[14px] text-[#4A5568] font-[500] ml-1">
                        + KDV
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-[#FBF0F0] rounded-[6px] border border-[#E2E7E8] inline-block">
                    <span className="text-[15px] font-[700] text-[#C82B35] block">
                      Şu anda satışa kapalı
                    </span>
                    <span className="text-[12px] text-[#4A5568] block mt-0.5">
                      Bu modelin güncel satış fiyatı henüz tanımlanmamıştır.
                    </span>
                  </div>
                )}
              </div>

              {/* Sensor Warning Inline Accordion (when user clicks buy without selecting sensors on 400GD) */}
              {showSensorWarning && (
                <div id="sensor-warning-box" className="mt-4 p-4 bg-[#FBF0F0] border border-[#C82B35] rounded-[8px] animate-fadeIn scroll-mt-40">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-[#C82B35] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[14px] font-[700] text-[#16242B] block">
                        Sensör seçilmedi
                      </strong>
                      <p className="text-[13px] text-[#4A5568] mt-1 leading-relaxed">
                        Ölçüm için uyumlu sensör gerekir. Mevcut sensörünüz varsa yalnızca cihazı alabilirsiniz.
                      </p>
                      <div className="flex flex-wrap items-center gap-2.5 mt-3">
                        <button
                          onClick={handleOnlyDeviceAdd}
                          className="px-4 py-2 bg-white hover:bg-[#F3F5F5] border border-[#E2E7E8] text-[#16242B] rounded-[6px] text-[13px] font-[600] transition-colors"
                        >
                          Yalnızca cihazı ekle ({deviceQuantity} Adet)
                        </button>
                        <button
                          onClick={handleScrollToSensors}
                          className="px-4 py-2 bg-[#C82B35] hover:bg-[#B3232C] text-white rounded-[6px] text-[13px] font-[600] transition-colors flex items-center gap-1.5"
                        >
                          <span>Sensör seç</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Purchase Actions */}
              <div ref={topBuySectionRef} className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {product.salePrice !== null ? (
                  <>
                    {/* Device Quantity Selector (Synced with Configurator) */}
                    <div className="flex items-center border border-[#E2E7E8] rounded-[6px] bg-[#F3F5F5] h-[50px] w-32 justify-between px-2">
                      <button
                        onClick={() => setDeviceQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-[4px] hover:bg-white text-[#16242B] font-[700] flex items-center justify-center transition-colors"
                        aria-label="Cihaz adedini azalt"
                      >
                        -
                      </button>
                      <span className="font-mono font-[700] text-[15px] text-[#16242B]">
                        {deviceQuantity}
                      </span>
                      <button
                        onClick={() => setDeviceQuantity((q) => q + 1)}
                        className="w-8 h-8 rounded-[4px] hover:bg-white text-[#16242B] font-[700] flex items-center justify-center transition-colors"
                        aria-label="Cihaz adedini artır"
                      >
                        +
                      </button>
                    </div>

                    {/* Primary Buy Button: Same behavior as configurator button */}
                    <button
                      onClick={handlePrimaryBuy}
                      className="flex-1 h-[50px] px-8 rounded-[6px] bg-[#C82B35] hover:bg-[#B3232C] text-white text-[16px] font-[700] flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>
                        {isBaseDevice && selectedSensors.length > 0
                          ? `Paketi Sepete Ekle (${deviceQuantity + totalSensorItemsCount} adet · ${1 + selectedSensors.length} farklı ürün)`
                          : `Sepete Ekle (${deviceQuantity} Adet)`}
                      </span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex-1 h-[50px] px-8 rounded-[6px] bg-[#E2E7E8] text-[#637078] text-[15px] font-[700] flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <span>Şu Anda Satışa Kapalı</span>
                  </button>
                )}
              </div>

              {/* Direct Inquiry & WhatsApp Contact Section */}
              <div className="mt-5 pt-4 border-t border-[#E2E7E8]">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
                  {/* Two Action Buttons: Call and WhatsApp (Height: 42px, Gap: 10px) */}
                  <div className="flex items-center gap-[10px]">
                    {/* Call Button: Dark Border, tel:+902163789133 from central CONTACT_CONFIG */}
                    <a
                      href={CONTACT_CONFIG.phoneCallUrl}
                      className="h-[42px] px-4 rounded-[6px] bg-white border border-[#16242B] hover:bg-[#16242B] hover:text-white text-[#16242B] text-[13px] sm:text-[14px] font-[600] inline-flex items-center justify-center gap-2 transition-all duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16242B] focus-visible:ring-offset-2 group shadow-2xs"
                      aria-label="Hemen ara: 0216 378 91 33"
                    >
                      <Phone className="w-4 h-4 text-[#16242B] group-hover:text-white transition-colors" />
                      <span>Hemen ara</span>
                    </a>

                    {/* WhatsApp Button: Green icon/border, light green background, opens in new tab with prefilled inquiry message */}
                    <a
                      href={whatsAppInquiryUrl || undefined}
                      target={whatsAppInquiryUrl ? '_blank' : undefined}
                      rel={whatsAppInquiryUrl ? 'noopener noreferrer' : undefined}
                      onClick={(e) => {
                        if (!whatsAppInquiryUrl) e.preventDefault();
                      }}
                      className="h-[42px] px-4 rounded-[6px] bg-[#F0FDF4] border border-[#22C55E] hover:bg-[#DCFCE7] hover:border-[#16A34A] text-[#15803D] hover:text-[#166534] text-[13px] sm:text-[14px] font-[600] inline-flex items-center justify-center gap-2 transition-all duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 group shadow-2xs"
                      aria-label={`WhatsApp ile ürün danışma (${product.shortTitle}) - Yeni sekmede açılır`}
                    >
                      <WhatsAppIcon className="w-4 h-4 flex-shrink-0 text-[#16A34A] group-hover:text-[#15803D] transition-colors" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Accompanying short explanation */}
                  <p className="text-[12px] text-[#637078] leading-[18px]">
                    Teknik danışma ve toplu alım için bize ulaşın.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 3. VISIBLE COMPATIBLE DEVICES SECTION FOR SENSORS (Immediately following buy box) */}
        {product.productType === 'sensor' && (
          <div className="mt-12 p-6 bg-[#F3F5F5] border border-[#E2E7E8] rounded-[10px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E7E8] gap-2">
              <div>
                <span className="text-[11px] font-[700] text-[#C82B35] uppercase tracking-wider block">
                  Tak-Kullan Mimarisi
                </span>
                <h3 className="text-[20px] font-[700] text-[#16242B] mt-0.5">
                  Bu Sensörle Uyumlu Cihazlar
                </h3>
              </div>
              <div className="text-[12px] text-[#C82B35] font-[600] bg-white px-3 py-1 rounded-[4px] border border-[#E2E7E8]">
                Ana cihaz sensör dahil değildir; bu sensör ayrı ürün olarak alınır.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {relations.products.map((baseDev) => (
                <div
                  key={baseDev.code}
                  className="p-4 bg-white border border-[#E2E7E8] hover:border-[#16242B] rounded-[8px] flex items-center justify-between gap-4 transition-colors group"
                >
                  <div
                    onClick={() => onNavigate(getProductUrl(baseDev))}
                    className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-20 h-20 bg-white border border-[#E2E7E8] rounded-[6px] p-2 flex items-center justify-center flex-shrink-0">
                      <img
                        src={baseDev.primaryImage}
                        alt={baseDev.shortTitle}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-mono text-[#4A5568]">Kod: {baseDev.code}</span>
                      <h4 className="text-[15px] font-[700] text-[#16242B] truncate group-hover:text-[#C82B35] transition-colors">
                        {baseDev.model}
                      </h4>
                      <span className="text-[15px] font-mono font-[700] text-[#16242B] block mt-1">
                        {formatPrice(baseDev.salePrice)} TL <span className="text-[11px] font-normal text-[#4A5568]">+ KDV</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => onAddToCart(baseDev, 1)}
                      className="px-3.5 py-1.5 rounded-[4px] bg-[#C82B35] hover:bg-[#B3232C] text-white text-[12px] font-[600] transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Cihazı Ekle</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate(getProductUrl(baseDev))}
                      className="px-3.5 py-1 rounded-[4px] border border-[#E2E7E8] text-[#16242B] hover:border-[#16242B] text-[12px] font-[600] transition-colors text-center"
                    >
                      İncele
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Base Device Sensor Configurator Section (When viewing 400GD / 500GD) */}
        {isBaseDevice && (
          <SensorConfigurator
            baseProduct={product}
            deviceQuantity={deviceQuantity}
            onUpdateDeviceQuantity={setDeviceQuantity}
            selectedSensorCodes={selectedSensorCodes}
            sensorQuantities={sensorQuantities}
            onToggleSensor={handleToggleSensor}
            onUpdateSensorQuantity={handleUpdateSensorQuantity}
            onRemoveSensor={handleRemoveSensor}
            onAddBundleToCart={handleAddBundleToCartInternal}
          />
        )}

        {/* 5. Bottom Tabbed Sections: Genel bakış, Teknik özellikler, Kutu/set içeriği, Uyumlu ürünler */}
        <div className="mt-16 pt-10 border-t border-[#E2E7E8]">
          
          {/* Tab Navigation (Sticky bar) */}
          <div className="sticky top-0 z-20 bg-white border-b border-[#E2E7E8] flex items-center gap-8 text-[15px] font-[600]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'border-[#C82B35] text-[#C82B35]'
                  : 'border-transparent text-[#4A5568] hover:text-[#16242B]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Genel Bakış</span>
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'specs'
                  ? 'border-[#C82B35] text-[#C82B35]'
                  : 'border-transparent text-[#4A5568] hover:text-[#16242B]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Teknik Özellikler</span>
            </button>

            <button
              onClick={() => setActiveTab('box')}
              className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'box'
                  ? 'border-[#C82B35] text-[#C82B35]'
                  : 'border-transparent text-[#4A5568] hover:text-[#16242B]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>{product.code === '420145' ? 'Set İçeriği ve Öne Çıkan Özellikler' : 'Kutu / Set İçeriği'}</span>
            </button>

            <button
              onClick={() => setActiveTab('compatible')}
              className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'compatible'
                  ? 'border-[#C82B35] text-[#C82B35]'
                  : 'border-transparent text-[#4A5568] hover:text-[#16242B]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{relations.title}</span>
            </button>
          </div>

          {/* TAB 1: Genel Bakış */}
          {activeTab === 'overview' && (
            <div className="py-8 space-y-8 animate-fadeIn">
              <div>
                <h3 className="text-[20px] font-[700] text-[#16242B]">
                  Ürün Hakkında
                </h3>
                <p className="text-[15px] leading-[26px] text-[#4A5568] mt-3 whitespace-pre-line max-w-4xl">
                  {product.description}
                </p>
              </div>

              {/* Features List */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="text-[17px] font-[700] text-[#16242B] mb-3">
                    Öne Çıkan Fonksiyonlar
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl">
                    {product.features.map((feat, i) => (
                      <li
                        key={i}
                        className="p-3 bg-[#F3F5F5] rounded-[6px] border border-[#E2E7E8] text-[14px] text-[#16242B] flex items-start gap-2.5"
                      >
                        <Check className="w-4 h-4 text-[#C82B35] mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Discrepancy Note from Source (Transparent reporting) */}
              {product.discrepancyNote && (
                <div className="p-4 bg-[#F3F5F5] border-l-4 border-[#C82B35] rounded-[4px] text-[13px] text-[#4A5568] max-w-4xl">
                  <strong className="text-[#16242B] block">Kaynak Dokümantasyon Notu:</strong>
                  {product.discrepancyNote}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Teknik Özellikler */}
          {activeTab === 'specs' && (
            <div className="py-8 space-y-8 animate-fadeIn">
              <div>
                <h3 className="text-[20px] font-[700] text-[#16242B]">
                  Teknik Parametreler ve Ölçüm Skalaları
                </h3>
                <p className="text-[14px] text-[#4A5568] mt-1">
                  MRU GmbH teknik şartnamesine uygun doğrulanmış fabrika verileri.
                </p>
              </div>

              {product.specTables && product.specTables.length > 0 ? (
                product.specTables.map((table, tIdx) => (
                  <div key={tIdx} className="overflow-x-auto border border-[#E2E7E8] rounded-[8px]">
                    <table className="w-full text-[13px] text-left">
                      <thead className="bg-[#122129] text-white text-[12px] uppercase font-[700] tracking-wider">
                        <tr>
                          {table.headers.map((h, hIdx) => (
                            <th key={hIdx} className="px-5 py-3 border-r border-[#1F333F] last:border-none">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E7E8]">
                        {table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-[#F3F5F5]/60'}>
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`px-5 py-3 border-r border-[#E2E7E8] last:border-none text-[#16242B] ${
                                  cIdx === 0 ? 'font-[600]' : 'font-mono'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              ) : (
                <div className="p-6 bg-[#F3F5F5] rounded-[8px] border border-[#E2E7E8] text-[14px] text-[#4A5568]">
                  Bu sensör başlığı takıldığı baz ünitenin (400GD / 500GD) işlemci ve ekran altyapısını kullanmaktadır. Detaylı teknik kalibrasyon verileri cihaz kullanım kılavuzunda yer almaktadır.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Kutu / Set İçeriği */}
          {activeTab === 'box' && (
            <div className="py-8 space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-[20px] font-[700] text-[#16242B]">
                  {product.code === '420145' ? 'Set İçeriği ve Öne Çıkan Özellikler' : 'Paket ve Kutu İçeriği'}
                </h3>
                <p className="text-[14px] text-[#4A5568] mt-1">
                  {product.code === '420145'
                    ? 'MRU OPTIMA COA analizör setinin içeriği ve donanım özellikleri.'
                    : 'Standart teslimat kapsamında ürün kutusunda yer alan bileşenler.'}
                </p>
              </div>

              {product.boxContent && product.boxContent.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl">
                  {product.boxContent.map((item, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-white border border-[#E2E7E8] rounded-[6px] flex items-center gap-3 text-[14px] text-[#16242B]"
                    >
                      <Package className="w-4 h-4 text-[#C82B35] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 bg-[#F3F5F5] rounded-[8px] border border-[#E2E7E8] text-[14px] text-[#4A5568] max-w-2xl">
                  {isBaseDevice
                    ? 'MRU baz cihaz gövdesi, şarj kablosu/adaptörü ve taşıma çantası ile sevk edilir. Sensörler ayrıca seçilerek kutuya eklenir.'
                    : 'Kullanım için MRU 400GD veya 500GD ana cihazı gereklidir.'}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Uyumlu Ürünler / Alternatifler */}
          {activeTab === 'compatible' && (
            <div className="py-8 space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-[20px] font-[700] text-[#16242B]">
                  {relations.title}
                </h3>
                <p className="text-[14px] text-[#4A5568] mt-1">
                  {relations.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relations.products.map((relProduct) => (
                  <div
                    key={relProduct.code}
                    className="p-4 bg-white border border-[#E2E7E8] hover:border-[#16242B] rounded-[8px] flex flex-col justify-between transition-colors group cursor-pointer"
                    onClick={() => onNavigate(getProductUrl(relProduct))}
                  >
                    <div>
                      <div className="h-[180px] bg-white border border-[#E2E7E8] rounded-[6px] flex items-center justify-center p-4">
                        <img
                          src={relProduct.primaryImage}
                          alt={relProduct.shortTitle}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          loading="eager"
                        />
                      </div>
                      <div className="text-[11px] font-mono text-[#4A5568] mt-2">
                        Kod: {relProduct.code}
                      </div>
                      <h4 className="text-[15px] font-[700] text-[#16242B] mt-1 line-clamp-2 leading-snug group-hover:text-[#C82B35] transition-colors">
                        {relProduct.shortTitle}
                      </h4>
                      <p className="text-[12px] text-[#4A5568] mt-1 line-clamp-2">
                        {relProduct.shortDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E2E7E8] flex items-center justify-between">
                      <div>
                        {relProduct.salePrice !== null ? (
                          <>
                            <span className="text-[16px] font-[700] text-[#16242B] font-mono block leading-none">
                              {formatPrice(relProduct.salePrice)} TL
                            </span>
                            <span className="text-[10px] text-[#4A5568]">+ KDV</span>
                          </>
                        ) : (
                          <span className="text-[12px] font-[600] text-[#C82B35]">Şu anda satışa kapalı</span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (relProduct.salePrice !== null) {
                            onAddToCart(relProduct, 1);
                          } else {
                            onNavigate(getProductUrl(relProduct));
                          }
                        }}
                        className="px-3 py-1.5 rounded-[4px] bg-[#16242B] hover:bg-[#C82B35] text-white text-[12px] font-[600] transition-colors"
                      >
                        {relProduct.salePrice !== null ? 'Sepete Ekle' : 'İncele'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* 6. VISIBLE ANALYZER ALTERNATIVES SECTION AT THE END OF SET PAGES */}
        {product.productType === 'set' && relations.products.length > 0 && (
          <div className="mt-14 p-6 bg-[#F3F5F5] border border-[#E2E7E8] rounded-[10px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E7E8]">
              <div>
                <span className="text-[11px] font-[700] text-[#C82B35] uppercase tracking-wider block">
                  Alternatif Baca Gazı Analiz Cihazı
                </span>
                <h3 className="text-[20px] font-[700] text-[#16242B] mt-0.5">
                  Farklı Kapasite ve Tesis İhtiyaçları İçin Model Seçenekleri
                </h3>
              </div>
              <span className="text-[12px] text-[#4A5568]">
                Her iki model de bağımsız eksiksiz set içeriğine sahiptir.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {relations.products.map((altSet) => (
                <div
                  key={altSet.code}
                  onClick={() => onNavigate(getProductUrl(altSet))}
                  className="p-4 bg-white border border-[#E2E7E8] hover:border-[#16242B] rounded-[8px] flex items-center gap-4 cursor-pointer group transition-colors"
                >
                  <div className="w-24 h-24 bg-white border border-[#E2E7E8] rounded-[6px] p-2 flex items-center justify-center flex-shrink-0">
                    <img
                      src={altSet.primaryImage}
                      alt={altSet.model}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-mono text-[#4A5568]">Kod: {altSet.code}</span>
                    <h4 className="text-[15px] font-[700] text-[#16242B] truncate group-hover:text-[#C82B35] transition-colors">
                      {altSet.model}
                    </h4>
                    <span className="text-[15px] font-mono font-[700] text-[#16242B] block mt-1">
                      {formatPrice(altSet.salePrice)} TL <span className="text-[11px] font-normal text-[#4A5568]">+ KDV</span>
                    </span>
                    <span className="text-[12px] text-[#C82B35] font-[600] inline-flex items-center gap-1 mt-1">
                      <span>Modeli İncele</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 7. Lightbox Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsZoomOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-[10px] p-6 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-between items-center pb-3 border-b border-[#E2E7E8]">
              <span className="text-[14px] font-[700] text-[#16242B]">
                {product.model} — Yüksek Çözünürlüklü İnceleme
              </span>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="p-1 rounded-[4px] hover:bg-[#F3F5F5] text-[#16242B]"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full h-[540px] flex items-center justify-center p-6 bg-white rounded-[6px] mt-4 border border-[#E2E7E8]">
              <img
                src={activeImage}
                alt={product.model}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* 8. Sticky Bottom Purchase Bar (Appears when upper purchase actions scroll above viewport) */}
      {showBottomBar && (
        <aside
          data-sticky-bottom-bar="true"
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E7E8] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-3 transition-transform duration-[180ms] motion-reduce:transition-none"
          aria-label="Kompakt Satın Alma Çubuğu"
        >
          <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px] flex items-center justify-between gap-4">
            {/* Sol: Model Bilgisi ve Seçim Özeti */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 bg-white border border-[#E2E7E8] rounded-[6px] p-1 flex-shrink-0 flex items-center justify-center">
                <img
                  src={product.primaryImage}
                  alt={product.model}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-[800] text-[#16242B] tracking-tight truncate">
                    {product.model}
                  </span>
                  <span className="text-[11px] font-mono text-[#637078] hidden sm:inline">
                    Kod: {product.code}
                  </span>
                </div>
                <div className="text-[12px] text-[#637078] truncate mt-0.5">
                  {isBaseDevice && selectedSensors.length > 0 ? (
                    <span className="text-[#C82B35] font-[600]">
                      {deviceQuantity} × {product.model} + {totalSensorItemsCount} Sensör ({selectedSensors.length} model)
                    </span>
                  ) : (
                    <span>{product.shortTitle}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Sağ: Adet Seçici, KDV Hariç Toplam ve Satın Alma Kontrolü */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Adet Kontrolü (Ana seçim state'i ile senkronize) */}
              {product.salePrice !== null && (
                <div className="hidden sm:flex items-center border border-[#E2E7E8] rounded-[6px] bg-[#F3F5F5] h-[40px] px-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setDeviceQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-[4px] hover:bg-white text-[#16242B] font-[700] flex items-center justify-center transition-colors duration-[180ms]"
                    aria-label="Cihaz adedini azalt"
                  >
                    -
                  </button>
                  <span className="font-mono font-[700] text-[14px] text-[#16242B] min-w-[20px] text-center">
                    {deviceQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDeviceQuantity((q) => q + 1)}
                    className="w-7 h-7 rounded-[4px] hover:bg-white text-[#16242B] font-[700] flex items-center justify-center transition-colors duration-[180ms]"
                    aria-label="Cihaz adedini artır"
                  >
                    +
                  </button>
                </div>
              )}

              {/* Fiyat Bilgisi (KDV Hariç) */}
              {currentSelectionTotal !== null ? (
                <div className="text-right">
                  <span className="text-[11px] text-[#637078] block leading-none">Toplam (KDV Hariç)</span>
                  <div className="flex items-baseline gap-1 mt-0.5 whitespace-nowrap">
                    <span className="text-[20px] font-mono font-[800] text-[#16242B] leading-none">
                      {formatPrice(currentSelectionTotal)} TL
                    </span>
                    <span className="text-[11px] text-[#637078] font-normal leading-none">+ KDV</span>
                  </div>
                </div>
              ) : (
                <div className="text-right">
                  <span className="text-[13px] font-[700] text-[#C82B35]">Şu anda satışa kapalı</span>
                </div>
              )}

              {/* Satın Alma Butonu (handlePrimaryBuy ile birebir aynı paket ve adet state'i) */}
              {product.salePrice !== null ? (
                <button
                  type="button"
                  data-sticky-buy-btn="true"
                  onClick={handlePrimaryBuy}
                  className="h-[44px] px-6 rounded-[6px] bg-[#C82B35] hover:bg-[#B3232C] text-white text-[14px] font-[700] flex items-center gap-2 transition-colors duration-[180ms] shadow-sm whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isBaseDevice && selectedSensors.length > 0
                      ? `Paketi Sepete Ekle (${deviceQuantity + totalSensorItemsCount} Adet)`
                      : `Sepete Ekle (${deviceQuantity} Adet)`}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="h-[44px] px-6 rounded-[6px] bg-[#E2E7E8] text-[#637078] text-[13px] font-[700] flex items-center gap-2 cursor-not-allowed whitespace-nowrap"
                >
                  <span>Şu Anda Satışa Kapalı</span>
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

    </div>
  );
};
