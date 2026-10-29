import React, { useEffect, useState, useRef } from 'react';
import { X, Info, ShoppingBag, PhoneCall } from 'lucide-react';
import { Product } from '../data/products';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  allProducts: Product[];
  onSelectProductByCode: (code: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  allProducts,
  onSelectProductByCode,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (product) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setSelectedImage(product.primaryImage);
      document.body.style.overflow = 'hidden';

      // Focus management: move focus into the modal
      setTimeout(() => {
        if (closeButtonRef.current) {
          closeButtonRef.current.focus();
        }
      }, 50);
    } else {
      document.body.style.overflow = 'auto';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [product, onClose]);

  if (!product) return null;

  const formatPrice = (val: number | null) => {
    if (val === null) return null;
    return new Intl.NumberFormat('tr-TR').format(val);
  };

  const compatibleProducts = allProducts.filter((p) =>
    product.compatibleProductCodes.includes(p.code)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-anthracite-950/70 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        ref={modalRef}
        className="relative bg-white border border-anthracite-800 shadow-2xl max-w-3xl w-full my-8 z-10 overflow-hidden flex flex-col max-h-[85vh] focus:outline-none"
      >
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-surface-subtle border-b border-surface-border">
          <div className="flex items-center space-x-3 text-xs">
            <span className="font-semibold text-anthracite-900">Hızlı İnceleme</span>
            <span className="text-anthracite-400">|</span>
            <span className="text-anthracite-600">
              Ürün Kodu: <span className="font-mono font-semibold text-anthracite-950">{product.code}</span>
            </span>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 text-anthracite-500 hover:text-anthracite-950 hover:bg-surface-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anthracite-800"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left: Images */}
            <div className="md:col-span-5 space-y-3">
              <div className="h-64 w-full bg-surface-light border border-surface-border p-4 flex items-center justify-center relative">
                <img
                  src={selectedImage || product.primaryImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Thumbnails if multiple images */}
              {product.images.length > 1 && (
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`h-14 w-14 p-1 border bg-white flex items-center justify-center transition-all ${
                        selectedImage === img
                          ? 'border-anthracite-900 ring-1 ring-anthracite-900'
                          : 'border-surface-border hover:border-anthracite-500'
                      }`}
                    >
                      <img src={img} alt={`${product.name} - ${idx}`} className="max-h-full max-w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info, Price, Actions */}
            <div className="md:col-span-7 space-y-4">
              
              <div className="space-y-1">
                <div className="text-xs text-anthracite-500">
                  {product.category}
                </div>
                <h2 id="quick-view-title" className="text-lg font-bold text-anthracite-950 leading-snug">
                  {product.name}
                </h2>
              </div>

              {/* Informative Sensor Banner for Base Devices (Calm & informative, not restrictive) */}
              {product.requiresSensor && (
                <div className="p-3 bg-surface-subtle border border-surface-border text-anthracite-800 text-xs leading-relaxed flex items-start space-x-2">
                  <Info className="w-4 h-4 text-anthracite-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-anthracite-950 mb-0.5">Sensör Bilgilendirmesi</strong>
                    Bu ürün baz cihazdır. Ölçüm yapabilmesi için uyumlu bir sensör başlığı gereklidir. Mevcut uyumlu sensörünüz varsa cihazı tek başına temin edebilirsiniz.
                  </div>
                </div>
              )}

              {/* Short Description */}
              <p className="text-sm text-anthracite-700 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Price display */}
              <div className="p-3 bg-surface-subtle border border-surface-border">
                <div className="text-xs text-anthracite-500 mb-1">
                  Satış Fiyatı (KDV Hariç)
                </div>
                {product.salePrice !== null ? (
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold font-mono text-anthracite-950">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-sm font-semibold text-anthracite-800">TL</span>
                    <span className="text-xs text-anthracite-500 font-medium">+ KDV</span>
                    {product.listPrice && product.listPrice !== product.salePrice && (
                      <span className="ml-3 text-xs text-anthracite-400 line-through">
                        Liste: {formatPrice(product.listPrice)} TL
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-sm font-medium text-anthracite-800">
                    Fiyat bilgisi için iletişime geçin
                  </div>
                )}
              </div>

              {/* Compatibility section */}
              {compatibleProducts.length > 0 && (
                <div className="pt-2 border-t border-surface-border">
                  <div className="text-xs font-semibold text-anthracite-700 mb-2">
                    {product.productType === 'base_device' ? 'Uyumlu Sensör Başlıkları:' : 'Uyumlu Ana Üniteler:'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {compatibleProducts.map((comp) => (
                      <button
                        key={comp.code}
                        onClick={() => onSelectProductByCode(comp.code)}
                        className="px-2.5 py-1 bg-white hover:bg-surface-subtle border border-surface-border hover:border-anthracite-700 text-xs text-anthracite-800 transition-colors flex items-center space-x-1"
                      >
                        <span className="font-medium">{comp.shortTitle}</span>
                        <span className="font-mono text-anthracite-400 text-[11px]">({comp.code})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-surface-border flex items-center space-x-3">
                <button
                  onClick={() => {
                    onAddToCart(product);
                  }}
                  className="flex-1 py-2.5 px-4 bg-anthracite-900 hover:bg-anthracite-800 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-colors border border-anthracite-900"
                >
                  <ShoppingBag className="w-4 h-4 text-mruRed-400" />
                  <span>Sepete Ekle</span>
                </button>

                <a
                  href="tel:02163789133"
                  className="py-2.5 px-4 bg-white hover:bg-surface-subtle text-anthracite-800 border border-surface-border hover:border-anthracite-700 text-xs font-medium flex items-center space-x-2 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-anthracite-600" />
                  <span>Teknik Danışma</span>
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
