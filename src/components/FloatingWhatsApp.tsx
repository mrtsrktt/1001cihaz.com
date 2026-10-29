import React, { useState, useEffect } from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { buildGeneralWhatsAppUrl, buildWhatsAppInquiryUrl } from '../data/commerceConfig';

interface FloatingWhatsAppProps {
  isCartOpen: boolean;
  currentProduct?: { shortTitle: string; code: string } | null;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  isCartOpen,
  currentProduct,
}) => {
  const [hasStickyBottomBar, setHasStickyBottomBar] = useState(false);
  const [hasActiveModal, setHasActiveModal] = useState(false);

  // Compute WhatsApp link: product-specific inquiry when on product page, general technical consultation otherwise
  const whatsAppUrl = currentProduct
    ? buildWhatsAppInquiryUrl(currentProduct)
    : buildGeneralWhatsAppUrl();

  // Monitor DOM for sticky bottom purchase bar and open modal dialogs
  useEffect(() => {
    const updateUiState = () => {
      // Check if product sticky bottom purchase bar is present in DOM
      const stickyBar = document.querySelector('[data-sticky-bottom-bar="true"]');
      setHasStickyBottomBar(!!stickyBar);

      // Check if any visible modal or dialog is currently open (e.g. image lightbox, quick view, checkout alert)
      // Exclude cart drawer since isCartOpen is handled directly via prop
      const openModal = Array.from(document.querySelectorAll('[aria-modal="true"]')).find((el) => {
        if (el.getAttribute('data-cart-drawer') === 'true') return false;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      });
      setHasActiveModal(!!openModal);
    };

    updateUiState();

    window.addEventListener('scroll', updateUiState, { passive: true });
    window.addEventListener('resize', updateUiState, { passive: true });

    const observer = new MutationObserver(() => {
      updateUiState();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-modal', 'data-sticky-bottom-bar'],
    });

    return () => {
      window.removeEventListener('scroll', updateUiState);
      window.removeEventListener('resize', updateUiState);
      observer.disconnect();
    };
  }, []);

  const isHidden = isCartOpen || hasActiveModal;

  return (
    <aside
      data-floating-whatsapp="true"
      aria-label="Sabit WhatsApp Danışma Kutusu"
      className={`fixed right-6 z-30 transition-all duration-200 ease-out ${
        hasStickyBottomBar ? 'bottom-[92px]' : 'bottom-6'
      } ${
        isHidden
          ? 'opacity-0 pointer-events-none invisible translate-y-2'
          : 'opacity-100 pointer-events-auto visible translate-y-0'
      }`}
    >
      <a
        href={whatsAppUrl || undefined}
        target={whatsAppUrl ? '_blank' : undefined}
        rel={whatsAppUrl ? 'noopener noreferrer' : undefined}
        tabIndex={isHidden ? -1 : 0}
        onClick={(e) => {
          if (!whatsAppUrl) {
            e.preventDefault();
          }
        }}
        className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white border border-[#E2E7E8] hover:border-[#16A34A] text-[#16242B] hover:text-[#15803D] shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.14)] transition-all duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 group cursor-pointer"
        aria-label="WhatsApp Danışma: Ürün seçimine yardımcı olalım. (Yeni sekmede açılır)"
      >
        {/* Soft green rounded icon badge */}
        <div className="w-6 h-6 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center flex-shrink-0 text-[#16A34A] group-hover:bg-[#DCFCE7] transition-colors">
          <WhatsAppIcon className="w-3.5 h-3.5" />
        </div>

        {/* Informative concise copy */}
        <span className="text-[13px] font-[600] tracking-tight whitespace-nowrap text-[#16242B] group-hover:text-[#15803D] transition-colors">
          Ürün seçimine yardımcı olalım.
        </span>
      </a>
    </aside>
  );
};
