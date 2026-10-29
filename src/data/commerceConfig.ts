/**
 * Single source of truth for commercial configurations (VAT, Shipping, Fees).
 * 
 * NOTE: As confirmed by user:
 * VAT rate is set to 20% (0.20).
 * Source product prices remain strictly VAT-exclusive (KDV hariç).
 * All money arithmetic is performed via integer kuruş (cents) calculation.
 */

export interface CommerceConfig {
  vatRate: number;
  vatRatePercent: number;
  shippingFee: number | null;
  freeShippingThreshold: number | null;
  currency: string;
}

export const COMMERCE_CONFIG: CommerceConfig = {
  // Kullanıcı tarafından teyit edilen %20 KDV oranı
  vatRate: 0.20,
  vatRatePercent: 20,
  
  // Teyitli kargo anlaşması ve bedeli henüz girilmemiştir; uydurulmamıştır.
  shippingFee: null,
  
  // Ücretsiz kargo eşiği teyit edilmemiştir; uydurulmamıştır.
  freeShippingThreshold: null,
  
  currency: 'TL',
};

/**
 * Formats a currency amount into Turkish locale string.
 * Uses integer formatting for whole amounts (e.g. 37.765 TL),
 * and 2 fraction digits when kuruş/decimals exist (e.g. 12,50 TL).
 */
export function formatCurrency(amount: number): string {
  if (!Number.isFinite(amount)) return '0';
  const hasDecimals = Math.round(amount * 100) % 100 !== 0;
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export interface CartCalculationResult {
  subtotal: number;
  subtotalCents: number;
  vatAmount: number;
  vatAmountCents: number;
  shippingAmount: number;
  total: number;
  totalCents: number;
  formattedSubtotal: string;
  formattedVat: string;
  formattedShipping: string | null;
  formattedTotal: string;
  hasShipping: boolean;
  itemCount: number;
}

/**
 * Unified calculation function for cart drawer and checkout page.
 * Performs accurate kuruş-based integer arithmetic.
 */
export function calculateOrderTotals(
  items: { product: { salePrice: number | null }; quantity: number }[]
): CartCalculationResult {
  let subtotalCents = 0;
  let itemCount = 0;

  for (const item of items) {
    if (
      item.product.salePrice !== null &&
      Number.isFinite(item.product.salePrice) &&
      item.quantity > 0
    ) {
      const priceCents = Math.round(item.product.salePrice * 100);
      subtotalCents += priceCents * item.quantity;
      itemCount += item.quantity;
    }
  }

  const vatRate = COMMERCE_CONFIG.vatRate ?? 0.20;
  const vatAmountCents = Math.round(subtotalCents * vatRate);

  let shippingCents = 0;
  if (
    COMMERCE_CONFIG.shippingFee !== null &&
    Number.isFinite(COMMERCE_CONFIG.shippingFee)
  ) {
    if (
      COMMERCE_CONFIG.freeShippingThreshold !== null &&
      subtotalCents >= Math.round(COMMERCE_CONFIG.freeShippingThreshold * 100)
    ) {
      shippingCents = 0;
    } else {
      shippingCents = Math.round(COMMERCE_CONFIG.shippingFee * 100);
    }
  }

  const totalCents = subtotalCents + vatAmountCents + shippingCents;

  const subtotal = subtotalCents / 100;
  const vatAmount = vatAmountCents / 100;
  const shippingAmount = shippingCents / 100;
  const total = totalCents / 100;

  return {
    subtotal,
    subtotalCents,
    vatAmount,
    vatAmountCents,
    shippingAmount,
    total,
    totalCents,
    formattedSubtotal: formatCurrency(subtotal),
    formattedVat: formatCurrency(vatAmount),
    formattedShipping: COMMERCE_CONFIG.shippingFee !== null ? formatCurrency(shippingAmount) : null,
    formattedTotal: formatCurrency(total),
    hasShipping: COMMERCE_CONFIG.shippingFee !== null,
    itemCount,
  };
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  addressLine: string;
  postalCode: string;
  invoiceType: 'individual' | 'corporate';
  sameAsDelivery: boolean;
  nationalId: string;
  companyTitle: string;
  taxOffice: string;
  taxNumber: string;
  invoiceCity: string;
  invoiceDistrict: string;
  invoiceAddressLine: string;
  orderNotes: string;
}

export const DEFAULT_CHECKOUT_FORM: CheckoutFormData = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  district: '',
  addressLine: '',
  postalCode: '',
  invoiceType: 'individual',
  sameAsDelivery: true,
  nationalId: '',
  companyTitle: '',
  taxOffice: '',
  taxNumber: '',
  invoiceCity: '',
  invoiceDistrict: '',
  invoiceAddressLine: '',
  orderNotes: '',
};

/**
 * Single source of truth for verified corporate contact information.
 * WhatsApp number is set to null until officially confirmed; it must NOT be guessed.
 */
export interface ContactConfig {
  phoneDisplay: string;
  phoneCallUrl: string;
  whatsappNumber: string | null;
  whatsappDisplay: string;
  email: string;
}

export const CONTACT_CONFIG: ContactConfig = {
  phoneDisplay: '0216 378 91 33',
  phoneCallUrl: 'tel:+902163789133',
  // Kullanıcı tarafından teyit edilen WhatsApp hattı
  whatsappNumber: '905412341678',
  whatsappDisplay: '0541 234 16 78',
  email: 'info@mru.com.tr',
};

/**
 * Generates general technical consultation WhatsApp link.
 * Returns null if no verified WhatsApp number is configured.
 * Does NOT generate aimless wa.me/?text= links and does NOT auto-send messages.
 */
export function buildGeneralWhatsAppUrl(): string | null {
  if (!CONTACT_CONFIG.whatsappNumber) {
    return null;
  }
  const cleanNumber = CONTACT_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
  if (!cleanNumber) {
    return null;
  }
  const message = 'Merhaba, MRU cihaz ve sensör seçimi hakkında teknik danışma almak istiyorum.';
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

/**
 * Generates WhatsApp inquiry link containing product title, product code, and page link.
 * Returns null if no verified WhatsApp number is configured.
 * Does NOT generate aimless wa.me/?text= links and does NOT auto-send messages.
 */
export function buildWhatsAppInquiryUrl(
  product: { shortTitle: string; code: string },
  customUrl?: string
): string | null {
  if (!CONTACT_CONFIG.whatsappNumber) {
    return null;
  }
  const cleanNumber = CONTACT_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
  if (!cleanNumber) {
    return null;
  }
  const currentOrigin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://1001cihaz.com';
  const pageUrl =
    customUrl ||
    (typeof window !== 'undefined' && window.location.href
      ? window.location.href
      : `${currentOrigin}/urun/${product.code}`);

  const message = `Merhaba, ${product.shortTitle} (Ürün Kodu: ${product.code}) hakkında teknik danışma ve toplu alım için bilgi almak istiyorum.\n\nÜrün Bağlantısı: ${pageUrl}`;
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

