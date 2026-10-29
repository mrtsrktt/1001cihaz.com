import React, { useEffect, useRef } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../data/products';
import { calculateOrderTotals, formatCurrency } from '../data/commerceConfig';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (code: string, qty: number) => void;
  onRemoveItem: (code: string) => void;
  onClearCart: () => void;
  onNavigate: (url: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Manage focus, body scroll lock, and return focus
  useEffect(() => {
    if (isOpen) {
      // 1. Remember the trigger element that opened the cart
      if (document.activeElement instanceof HTMLElement) {
        previousActiveElementRef.current = document.activeElement;
      }
      document.body.style.overflow = 'hidden';

      // 2. Move focus into the drawer panel
      const focusTimer = setTimeout(() => {
        if (closeBtnRef.current) {
          closeBtnRef.current.focus();
        } else if (drawerRef.current) {
          drawerRef.current.focus();
        }
      }, 50);

      return () => clearTimeout(focusTimer);
    } else {
      document.body.style.overflow = 'auto';

      // 3. Return focus to the trigger element upon closing
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
        previousActiveElementRef.current = null;
      }
    }
  }, [isOpen]);

  // Trap focus inside the drawer and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes drawer
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Tab trap inside drawer
      if (e.key === 'Tab') {
        const drawer = drawerRef.current;
        if (!drawer) return;

        const focusableSelectors =
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusableElements = Array.from(
          drawer.querySelectorAll<HTMLElement>(focusableSelectors)
        ).filter((el) => el.offsetParent !== null);

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: if on first element or outside, cycle to last element
          if (document.activeElement === firstElement || !drawer.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element or outside, cycle to first element
          if (document.activeElement === lastElement || !drawer.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const totals = calculateOrderTotals(items);
  const totalItemCount = totals.itemCount;

  return (
    <div
      data-cart-drawer="true"
      className={`fixed inset-0 z-50 flex justify-end transition-all duration-200 ${
        isOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
      }`}
      role="dialog"
      aria-modal={isOpen ? 'true' : undefined}
      aria-labelledby="cart-drawer-title"
    >
      {/* Backdrop with 200ms smooth fade (180–220ms requirement) */}
      <div
        className={`fixed inset-0 bg-[#122129]/60 backdrop-blur-[2px] transition-opacity duration-200 ease-in-out motion-reduce:transition-none ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel with 200ms slide-in/out and ref for focus management */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={`relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col z-10 border-l border-[#E2E7E8] transform transition-transform duration-200 ease-in-out motion-reduce:transition-none focus:outline-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header: Title "Sepetim" */}
        <div className="p-4 px-6 bg-[#16242B] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#C82B35]" />
            <h2 id="cart-drawer-title" className="text-[16px] font-[700] tracking-tight">
              Sepetim ({totalItemCount > 0 ? `${totalItemCount} adet · ${items.length} farklı ürün` : '0 adet'})
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white transition-colors duration-[180ms] rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Sepeti Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16 text-[#4A5568]">
              <ShoppingBag className="w-12 h-12 text-[#A0ADB5]" />
              <p className="text-[16px] font-[600] text-[#16242B]">
                Sepetinizde ürün bulunmuyor
              </p>
              <p className="text-[13px] text-[#4A5568] max-w-xs leading-relaxed">
                İhtiyacınıza uygun cihaz veya sensör başlığını ürün detay sayfasından sepete ekleyebilirsiniz.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate('/kategori/tum-urunler');
                }}
                className="mt-2 px-5 py-2.5 bg-[#16242B] hover:bg-[#C82B35] text-white text-[13px] font-[700] rounded-[6px] transition-colors duration-[180ms]"
              >
                Ürünleri Keşfet
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.code}
                className="p-3 bg-white border border-[#E2E7E8] rounded-[6px] flex items-start space-x-3 relative shadow-xs"
              >
                <div className="w-16 h-16 bg-white border border-[#E2E7E8] rounded-[4px] p-1 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={item.product.primaryImage}
                    alt={item.product.shortTitle}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-[13px] font-[700] text-[#16242B] truncate">
                      {item.product.shortTitle}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.product.code)}
                      className="text-[#4A5568] hover:text-[#C82B35] p-0.5 transition-colors duration-[180ms] rounded-[4px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#16242B]"
                      aria-label="Ürünü sepetten kaldır"
                      title="Kaldır"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-[#4A5568] mt-0.5 font-mono">
                    Kod: {item.product.code}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E2E7E8]">
                    <div className="flex items-center border border-[#E2E7E8] rounded-[4px] bg-[#F3F5F5] text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.product.code, Math.max(1, item.quantity - 1))}
                        className="px-2 py-0.5 hover:bg-white text-[#16242B] font-[700] transition-colors duration-[180ms]"
                        aria-label="Adedi azalt"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 font-[700] text-[#16242B] border-x border-[#E2E7E8] font-mono bg-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.code, item.quantity + 1)}
                        className="px-2 py-0.5 hover:bg-white text-[#16242B] font-[700] transition-colors duration-[180ms]"
                        aria-label="Adedi artır"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      {item.product.salePrice !== null ? (
                        <span className="text-[13px] font-[700] text-[#16242B] font-mono">
                          {formatCurrency(item.product.salePrice * item.quantity)} TL{' '}
                          <span className="text-[10px] font-normal text-[#4A5568]">+ KDV</span>
                        </span>
                      ) : (
                        <span className="text-[12px] font-[600] text-[#C82B35]">Satışa kapalı</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="p-5 bg-[#F3F5F5] border-t border-[#E2E7E8] space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-baseline text-[#637078]">
                <span className="text-[13px]">Ara toplam (KDV hariç)</span>
                <span className="font-mono font-[700] text-[#16242B] text-[15px]" data-cart-subtotal="true">
                  {totals.formattedSubtotal} TL
                </span>
              </div>

              <div className="flex justify-between items-baseline text-[#637078]">
                <span className="text-[13px]">KDV (%20)</span>
                <span className="font-mono font-[600] text-[#16242B] text-[14px]" data-cart-vat="true">
                  {totals.formattedVat} TL
                </span>
              </div>

              {totals.hasShipping && (
                <div className="flex justify-between items-baseline text-[#637078]">
                  <span className="text-[13px]">Kargo</span>
                  <span className="font-mono font-[600] text-[#16242B] text-[14px]">
                    {totals.formattedShipping} TL
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-[#E2E7E8] flex justify-between items-baseline">
                <span className="font-[700] text-[#16242B] text-[14px]">Genel toplam (KDV dahil)</span>
                <span className="font-mono font-[800] text-[#C82B35] text-[20px]" data-cart-total="true">
                  {totals.formattedTotal} TL
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E7E8] space-y-2">
              {/* Ana Buton: Alışverişi tamamla -> /odeme */}
              <button
                type="button"
                data-checkout-btn="true"
                onClick={() => {
                  onClose();
                  onNavigate('/odeme');
                }}
                className="w-full h-[46px] px-4 bg-[#C82B35] hover:bg-[#B3232C] text-white rounded-[6px] text-[14px] font-[700] flex items-center justify-center space-x-2 transition-colors duration-[180ms] shadow-sm"
              >
                <span>Alışverişi tamamla</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* İkincil Bağlantı: Alışverişe devam et */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-center text-[13px] font-[600] text-[#637078] hover:text-[#16242B] transition-colors duration-[180ms]"
              >
                Alışverişe devam et
              </button>
            </div>
            
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onClearCart}
                className="text-[11px] text-[#637078] hover:text-[#C82B35] underline transition-colors"
              >
                Sepeti Boşalt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
