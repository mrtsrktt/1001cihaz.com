import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Building2,
  User,
  MapPin,
  ArrowLeft,
  Info,
  CheckCircle2,
  Lock,
  ShoppingBag,
} from 'lucide-react';
import { CartItem } from './CartDrawer';
import { CheckoutFormData, calculateOrderTotals, formatCurrency } from '../data/commerceConfig';

interface CheckoutPageProps {
  items: CartItem[];
  formData: CheckoutFormData;
  onUpdateFormData: (data: Partial<CheckoutFormData>) => void;
  onNavigate: (url: string) => void;
  onOpenCart?: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  formData,
  onUpdateFormData,
  onNavigate,
  onOpenCart,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmittedValid, setIsSubmittedValid] = useState(false);

  const totals = calculateOrderTotals(items);
  const totalQuantity = totals.itemCount;

  // Form input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      onUpdateFormData({ [name]: checked });
    } else {
      onUpdateFormData({ [name]: value });
    }
    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Lütfen ad ve soyadınızı giriniz.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Lütfen geçerli bir e-posta adresi giriniz.';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = 'Lütfen en az 10 haneli geçerli bir telefon numarası giriniz.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Lütfen teslimat ilini giriniz.';
    }

    if (!formData.district.trim()) {
      newErrors.district = 'Lütfen teslimat ilçesini giriniz.';
    }

    if (!formData.addressLine.trim() || formData.addressLine.trim().length < 10) {
      newErrors.addressLine = 'Lütfen açık adresinizi giriniz (en az 10 karakter).';
    }

    if (formData.invoiceType === 'corporate') {
      if (!formData.companyTitle.trim()) {
        newErrors.companyTitle = 'Lütfen resmi şirket unvanını giriniz.';
      }
      if (!formData.taxOffice.trim()) {
        newErrors.taxOffice = 'Lütfen vergi dairesini giriniz.';
      }
      const cleanVkn = formData.taxNumber.replace(/\D/g, '');
      if (cleanVkn.length !== 10) {
        newErrors.taxNumber = 'Lütfen 10 haneli Vergi Kimlik Numarasını (VKN) giriniz.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmittedValid(true);
    }
  };

  // 1. BOŞ SEPET KORUMASI (Boş sepetle ödeme akışına girilemez)
  if (items.length === 0) {
    return (
      <div className="min-h-[560px] max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px] py-16">
        <div className="max-w-xl mx-auto bg-white border border-[#E2E7E8] rounded-[10px] p-10 text-center shadow-xs">
          <div className="w-16 h-16 bg-[#F3F5F5] rounded-full flex items-center justify-center mx-auto mb-4 text-[#637078]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-[24px] font-[800] text-[#16242B] tracking-tight">
            Sepetiniz Boş
          </h1>
          <p className="text-[14px] text-[#637078] mt-2 leading-relaxed">
            Alışverişi tamamlama sayfasına geçebilmek için sepetinizde en az bir ürün bulunmalıdır.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/kategori/tum-urunler')}
              className="px-6 py-3 bg-[#C82B35] hover:bg-[#B3232C] text-white text-[14px] font-[700] rounded-[6px] transition-colors shadow-sm"
            >
              Ürün Kataloğuna Dön
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="px-6 py-3 bg-white border border-[#E2E7E8] hover:border-[#16242B] text-[#16242B] text-[14px] font-[600] rounded-[6px] transition-colors"
            >
              Ana Sayfa
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBFB] min-h-screen pb-24 text-[#16242B]">
      {/* Üst Gezinme / Breadcrumb */}
      <div className="border-b border-[#E2E7E8] bg-white">
        <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px] py-3.5 flex items-center justify-between text-[13px]">
          <div className="flex items-center gap-2 text-[#637078]">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="hover:text-[#16242B] transition-colors"
            >
              Ana Sayfa
            </button>
            <span>/</span>
            <span className="text-[#16242B] font-[600]">Alışverişi Tamamla</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onOpenCart) onOpenCart();
              else onNavigate('/kategori/tum-urunler');
            }}
            className="inline-flex items-center gap-1.5 text-[#16242B] hover:text-[#C82B35] font-[600] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Sepete Dön ({totalQuantity} Ürün)</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px] mt-8">
        <div className="pb-6 border-b border-[#E2E7E8]">
          <h1 className="text-[30px] font-[800] text-[#16242B] tracking-tight">
            Sipariş ve Teslimat Bilgileri
          </h1>
          <p className="text-[14px] text-[#637078] mt-1">
            Üyeliksiz alışveriş yapabilirsiniz. Lütfen teslimat ve fatura bilgilerinizi eksiksiz doldurunuz.
          </p>
        </div>

        {/* İki Sütunlu Masaüstü Yerleşim */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8 items-start">
          
          {/* SOL SÜTUN: Form Adımları (İletişim, Teslimat, Fatura, Ödeme Adımı) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} noValidate className="space-y-8">
              
              {/* ADIM 1: İletişim Bilgileri (Üyeliksiz Alışveriş) */}
              <section className="bg-white p-6 rounded-[8px] border border-[#E2E7E8] shadow-2xs">
                <div className="flex items-center gap-2.5 pb-4 border-b border-[#E2E7E8]">
                  <span className="w-7 h-7 rounded-full bg-[#16242B] text-white text-[13px] font-[700] flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-[17px] font-[700] text-[#16242B]">
                    İletişim Bilgileri
                  </h2>
                  <span className="text-[12px] text-[#637078] ml-auto">Üyeliksiz Alışveriş</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="block text-[13px] font-[600] text-[#16242B] mb-1">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Adınız ve Soyadınız"
                      className={`w-full h-[44px] px-3.5 bg-white border rounded-[6px] text-[14px] text-[#16242B] placeholder:text-[#A0ADB5] focus:outline-none focus:ring-2 focus:ring-[#16242B] transition-colors ${
                        errors.fullName ? 'border-[#C82B35]' : 'border-[#E2E7E8]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[12px] text-[#C82B35] mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[13px] font-[600] text-[#16242B] mb-1">
                      E-Posta Adresi *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ad.soyad@sirket.com"
                      className={`w-full h-[44px] px-3.5 bg-white border rounded-[6px] text-[14px] text-[#16242B] placeholder:text-[#A0ADB5] focus:outline-none focus:ring-2 focus:ring-[#16242B] transition-colors ${
                        errors.email ? 'border-[#C82B35]' : 'border-[#E2E7E8]'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[12px] text-[#C82B35] mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-[13px] font-[600] text-[#16242B] mb-1">
                      Telefon Numarası *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="05XX XXX XX XX"
                      className={`w-full h-[44px] px-3.5 bg-white border rounded-[6px] text-[14px] text-[#16242B] placeholder:text-[#A0ADB5] focus:outline-none focus:ring-2 focus:ring-[#16242B] transition-colors ${
                        errors.phone ? 'border-[#C82B35]' : 'border-[#E2E7E8]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[12px] text-[#C82B35] mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* ADIM 2: Teslimat Adresi */}
              <section className="bg-white p-6 rounded-[8px] border border-[#E2E7E8] shadow-2xs">
                <div className="flex items-center gap-2.5 pb-4 border-b border-[#E2E7E8]">
                  <span className="w-7 h-7 rounded-full bg-[#16242B] text-white text-[13px] font-[700] flex items-center justify-center">
                    2
                  </span>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C82B35]" />
                    <h2 className="text-[17px] font-[700] text-[#16242B]">
                      Teslimat Adresi
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  <div>
                    <label htmlFor="city" className="block text-[13px] font-[600] text-[#16242B] mb-1">
                      İl *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Örn. İstanbul"
                      className={`w-full h-[44px] px-3.5 bg-white border rounded-[6px] text-[14px] text-[#16242B] placeholder:text-[#A0ADB5] focus:outline-none focus:ring-2 focus:ring-[#16242B] transition-colors ${
                        errors.city ? 'border-[#C82B35]' : 'border-[#E2E7E8]'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-[12px] text-[#C82B35] mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="district" className="block text-[13px] font-[600] text-[#16242B] mb-1">
                      İlçe *
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="Örn. Pendik"
                      className={`w-full h-[44px] px-3.5 bg-white border rounded-[6px] text-[14px] text-[#16242B] placeholder:text-[#A0ADB5] focus:outline-none focus:ring-2 focus:ring-[#16242B] transition-colors ${
                        errors.district ? 'border-[#C82B35]' : 'border-[#E2E7E8]'
                      }`}
                    />
                    {errors.district && (
                      <p className="text-[12px] text-[#C82B35] mt-1">{errors.district}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="addressLine" className="block text-[13px] font-[600] text-[#16242B] mb-1">
                      Açık Teslimat Adresi *
                    </label>
                    <textarea
                      id="addressLine"
                      name="addressLine"
                      rows={3}
                      value={formData.addressLine}
                      onChange={handleChange}
                      placeholder="Cadde, sokak, bina ve daire/ofis no bilgisi"
                      className={`w-full p-3 bg-white border rounded-[6px] text-[14px] text-[#16242B] placeholder:text-[#A0ADB5] focus:outline-none focus:ring-2 focus:ring-[#16242B] transition-colors ${
                        errors.addressLine ? 'border-[#C82B35]' : 'border-[#E2E7E8]'
                      }`}
                    />
                    {errors.addressLine && (
                      <p className="text-[12px] text-[#C82B35] mt-1">{errors.addressLine}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-[13px] font-[600] text-[#16242B] mb-1">
                      Posta Kodu (İsteğe bağlı)
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="34XXX"
                      className="w-full h-[44px] px-3.5 bg-white border border-[#E2E7E8] rounded-[6px] text-[14px] text-[#16242B] placeholder:text-[#A0ADB5] focus:outline-none focus:ring-2 focus:ring-[#16242B]"
                    />
                  </div>
                </div>
              </section>

              {/* ADIM 3: Fatura Bilgileri (Bireysel / Kurumsal Seçimi) */}
              <section className="bg-white p-6 rounded-[8px] border border-[#E2E7E8] shadow-2xs">
                <div className="flex items-center gap-2.5 pb-4 border-b border-[#E2E7E8]">
                  <span className="w-7 h-7 rounded-full bg-[#16242B] text-white text-[13px] font-[700] flex items-center justify-center">
                    3
                  </span>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#C82B35]" />
                    <h2 className="text-[17px] font-[700] text-[#16242B]">
                      Fatura Türü ve Bilgileri
                    </h2>
                  </div>
                </div>

                {/* Bireysel / Kurumsal Toggle Seçimi */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <label
                    className={`p-3.5 rounded-[6px] border flex items-center gap-3 cursor-pointer transition-colors ${
                      formData.invoiceType === 'individual'
                        ? 'border-[#16242B] bg-[#F7F8F6] ring-1 ring-[#16242B]'
                        : 'border-[#E2E7E8] hover:border-[#16242B]/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="invoiceType"
                      value="individual"
                      checked={formData.invoiceType === 'individual'}
                      onChange={() => onUpdateFormData({ invoiceType: 'individual' })}
                      className="w-4 h-4 text-[#16242B] focus:ring-[#16242B]"
                    />
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#637078]" />
                      <span className="text-[14px] font-[700] text-[#16242B]">Bireysel Fatura</span>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-[6px] border flex items-center gap-3 cursor-pointer transition-colors ${
                      formData.invoiceType === 'corporate'
                        ? 'border-[#16242B] bg-[#F7F8F6] ring-1 ring-[#16242B]'
                        : 'border-[#E2E7E8] hover:border-[#16242B]/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="invoiceType"
                      value="corporate"
                      checked={formData.invoiceType === 'corporate'}
                      onChange={() => onUpdateFormData({ invoiceType: 'corporate' })}
                      className="w-4 h-4 text-[#16242B] focus:ring-[#16242B]"
                    />
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#637078]" />
                      <span className="text-[14px] font-[700] text-[#16242B]">Kurumsal Fatura</span>
                    </div>
                  </label>
                </div>

                {/* Bireysel Alanlar */}
                {formData.invoiceType === 'individual' ? (
                  <div className="mt-4 p-4 bg-[#F3F5F5] rounded-[6px] border border-[#E2E7E8]">
                    <label htmlFor="nationalId" className="block text-[13px] font-[600] text-[#16242B] mb-1">
                      T.C. Kimlik Numarası (İsteğe bağlı)
                    </label>
                    <input
                      type="text"
                      id="nationalId"
                      name="nationalId"
                      maxLength={11}
                      value={formData.nationalId}
                      onChange={handleChange}
                      placeholder="11 haneli T.C. Kimlik No (Zorunlu değildir)"
                      className="w-full sm:w-80 h-[42px] px-3.5 bg-white border border-[#E2E7E8] rounded-[6px] text-[14px] text-[#16242B] placeholder:text-[#A0ADB5] focus:outline-none focus:ring-2 focus:ring-[#16242B]"
                    />
                    <span className="text-[11px] text-[#637078] block mt-1">
                      Belirtilmediği takdirde mevzuat gereği standart nihai tüketici faturası düzenlenir.
                    </span>
                  </div>
                ) : (
                  /* Kurumsal Alanlar */
                  <div className="mt-4 p-4 bg-[#F7F8F6] rounded-[6px] border border-[#E2E7E8] space-y-4">
                    <div>
                      <label htmlFor="companyTitle" className="block text-[13px] font-[600] text-[#16242B] mb-1">
                        Şirket Resmi Unvanı *
                      </label>
                      <input
                        type="text"
                        id="companyTitle"
                        name="companyTitle"
                        value={formData.companyTitle}
                        onChange={handleChange}
                        placeholder="Örn. ABC Endüstriyel Tesisat San. ve Tic. A.Ş."
                        className={`w-full h-[42px] px-3.5 bg-white border rounded-[6px] text-[14px] text-[#16242B] placeholder:text-[#A0ADB5] focus:outline-none focus:ring-2 focus:ring-[#16242B] ${
                          errors.companyTitle ? 'border-[#C82B35]' : 'border-[#E2E7E8]'
                        }`}
                      />
                      {errors.companyTitle && (
                        <p className="text-[12px] text-[#C82B35] mt-1">{errors.companyTitle}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="taxOffice" className="block text-[13px] font-[600] text-[#16242B] mb-1">
                          Vergi Dairesi *
                        </label>
                        <input
                          type="text"
                          id="taxOffice"
                          name="taxOffice"
                          value={formData.taxOffice}
                          onChange={handleChange}
                          placeholder="Örn. Tuzla Vergi Dairesi"
                          className={`w-full h-[42px] px-3.5 bg-white border rounded-[6px] text-[14px] text-[#16242B] placeholder:text-[#A0ADB5] focus:outline-none focus:ring-2 focus:ring-[#16242B] ${
                            errors.taxOffice ? 'border-[#C82B35]' : 'border-[#E2E7E8]'
                          }`}
                        />
                        {errors.taxOffice && (
                          <p className="text-[12px] text-[#C82B35] mt-1">{errors.taxOffice}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="taxNumber" className="block text-[13px] font-[600] text-[#16242B] mb-1">
                          Vergi Kimlik Numarası (VKN) *
                        </label>
                        <input
                          type="text"
                          id="taxNumber"
                          name="taxNumber"
                          maxLength={10}
                          value={formData.taxNumber}
                          onChange={handleChange}
                          placeholder="10 haneli VKN"
                          className={`w-full h-[42px] px-3.5 bg-white border rounded-[6px] text-[14px] text-[#16242B] placeholder:text-[#A0ADB5] focus:outline-none focus:ring-2 focus:ring-[#16242B] ${
                            errors.taxNumber ? 'border-[#C82B35]' : 'border-[#E2E7E8]'
                          }`}
                        />
                        {errors.taxNumber && (
                          <p className="text-[12px] text-[#C82B35] mt-1">{errors.taxNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* ADIM 4: Ödeme Adımı (Ödeme Sağlayıcısı Görsel Tasarımı & Entegrasyon Sınırı) */}
              <section className="bg-white p-6 rounded-[8px] border border-[#E2E7E8] shadow-2xs">
                <div className="flex items-center gap-2.5 pb-4 border-b border-[#E2E7E8]">
                  <span className="w-7 h-7 rounded-full bg-[#16242B] text-white text-[13px] font-[700] flex items-center justify-center">
                    4
                  </span>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#C82B35]" />
                    <h2 className="text-[17px] font-[700] text-[#16242B]">
                      Ödeme Yöntemi
                    </h2>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 text-[12px] text-[#637078]">
                    <Lock className="w-3.5 h-3.5 text-[#16242B]" />
                    <span>256-Bit SSL Güvenli Bağlantı</span>
                  </div>
                </div>

                {/* Ödeme Formu Görsel Tasarımı */}
                <div className="mt-5 space-y-4">
                  <div className="p-4 bg-[#F7F8F6] rounded-[8px] border border-[#E2E7E8]">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2E7E8]">
                      <span className="text-[14px] font-[700] text-[#16242B] flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#C82B35]" />
                        Kredi / Banka Kartı ile Ödeme
                      </span>
                      <span className="text-[11px] font-mono text-[#637078] uppercase">
                        Visa / Mastercard / Troy
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[12px] font-[600] text-[#16242B] mb-1">
                          Kart Üzerindeki İsim
                        </label>
                        <input
                          type="text"
                          disabled
                          placeholder="Kart Sahibi Ad Soyad"
                          className="w-full h-[40px] px-3 bg-[#FAFBFB] border border-[#E2E7E8] rounded-[6px] text-[13px] text-[#637078] cursor-not-allowed"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[12px] font-[600] text-[#16242B] mb-1">
                          Kart Numarası
                        </label>
                        <input
                          type="text"
                          disabled
                          placeholder="•••• •••• •••• ••••"
                          className="w-full h-[40px] px-3 bg-[#FAFBFB] border border-[#E2E7E8] rounded-[6px] text-[13px] text-[#637078] font-mono cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-[600] text-[#16242B] mb-1">
                          Son Kullanma Tarihi
                        </label>
                        <input
                          type="text"
                          disabled
                          placeholder="AA / YY"
                          className="w-full h-[40px] px-3 bg-[#FAFBFB] border border-[#E2E7E8] rounded-[6px] text-[13px] text-[#637078] font-mono cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-[600] text-[#16242B] mb-1">
                          Güvenlik Kodu (CVV)
                        </label>
                        <input
                          type="text"
                          disabled
                          placeholder="•••"
                          className="w-full h-[40px] px-3 bg-[#FAFBFB] border border-[#E2E7E8] rounded-[6px] text-[13px] text-[#637078] font-mono cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Teknik Ödeme Entegrasyon Sınırı Açıklaması */}
                  <div className="p-4 bg-[#FBF0F0] border border-[#C82B35]/30 rounded-[8px] text-[13px] leading-relaxed">
                    <div className="flex items-start gap-2.5">
                      <Info className="w-5 h-5 text-[#C82B35] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#16242B] font-[700] block">
                          Ödeme Altyapısı Entegrasyon Bilgilendirmesi
                        </strong>
                        <p className="text-[#4A5568] mt-1 text-[12px] leading-relaxed">
                          Bu geliştirme aşamasında gerçek kredi kartı bilgisi toplanmamakta, canlı tahsilat veya sahte sipariş iletimi yapılmamaktadır. Sanal POS / Ödeme sağlayıcısı (İyzico / PayTR vb.) test/canlı API anahtarları tanımlandığında kart formu doğrudan sağlayıcının güvenli iframe/token servisine bağlanacaktır.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Gönderim Butonu */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      data-submit-order="true"
                      className="w-full h-[52px] bg-[#C82B35] hover:bg-[#B3232C] text-white text-[16px] font-[700] rounded-[6px] flex items-center justify-center gap-2 transition-colors duration-[180ms] shadow-sm"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Bilgileri Doğrula ve Devam Et</span>
                    </button>
                    <p className="text-[11px] text-[#637078] text-center mt-2">
                      Sipariş formunu gönderdiğinizde iletişim ve adres bilgileriniz doğrulanır.
                    </p>
                  </div>
                </div>
              </section>

            </form>

            {/* Doğrulama Başarılı Modal / Bilgi Bildirimi */}
            {isSubmittedValid && (
              <div
                className="fixed inset-0 z-50 bg-[#122129]/60 backdrop-blur-xs flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
              >
                <div className="bg-white rounded-[10px] border border-[#E2E7E8] max-w-lg w-full p-6 shadow-xl text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#EBF8F2] text-[#1E824C] mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-[20px] font-[800] text-[#16242B]">
                    Sipariş Bilgileri Doğrulandı
                  </h3>
                  <div className="text-[13px] text-[#4A5568] text-left bg-[#F7F8F6] p-4 rounded-[6px] border border-[#E2E7E8] space-y-1.5">
                    <div><strong>Alıcı:</strong> {formData.fullName} ({formData.phone})</div>
                    <div><strong>E-Posta:</strong> {formData.email}</div>
                    <div><strong>Teslimat:</strong> {formData.addressLine}, {formData.district} / {formData.city}</div>
                    <div>
                      <strong>Fatura Türü:</strong>{' '}
                      {formData.invoiceType === 'corporate'
                        ? `Kurumsal (${formData.companyTitle} - VKN: ${formData.taxNumber})`
                        : 'Bireysel'}
                    </div>
                  </div>
                  <div className="p-3 bg-[#FBF0F0] border border-[#C82B35]/30 rounded-[6px] text-[12px] text-[#4A5568] text-left">
                    <strong>Entegrasyon Notu:</strong> Ödeme sağlayıcısı API bağlantısı henüz canlıya alınmadığından sipariş kaydı veritabanına iletilmemiştir. Gerçek kart tahsilatı yapılmamaktadır.
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsSubmittedValid(false)}
                      className="px-5 py-2.5 bg-white border border-[#E2E7E8] hover:border-[#16242B] text-[#16242B] text-[13px] font-[600] rounded-[6px] transition-colors"
                    >
                      Bilgileri Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('/kategori/tum-urunler')}
                      className="px-5 py-2.5 bg-[#16242B] hover:bg-[#C82B35] text-white text-[13px] font-[700] rounded-[6px] transition-colors"
                    >
                      Kataloğa Dön
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* SAĞ SÜTUN: Ürün Görselleri, Adetler ve Sipariş Özeti (Sticky) */}
          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-[8px] border border-[#E2E7E8] p-6 shadow-2xs">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E7E8]">
                <h2 className="text-[17px] font-[700] text-[#16242B]">
                  Sipariş Özeti
                </h2>
                <span className="text-[12px] font-mono text-[#637078] bg-[#F3F5F5] px-2 py-0.5 rounded">
                  {totalQuantity} Adet Ürün
                </span>
              </div>

              {/* Ürün Listesi */}
              <div className="divide-y divide-[#E2E7E8] max-h-[380px] overflow-y-auto pr-1 my-3">
                {items.map((item) => (
                  <div key={item.product.code} className="py-3.5 flex items-start gap-3">
                    <div className="w-14 h-14 bg-white border border-[#E2E7E8] rounded-[6px] p-1 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.product.primaryImage}
                        alt={item.product.model}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-[700] text-[#16242B] truncate">
                        {item.product.shortTitle}
                      </h3>
                      <div className="text-[11px] font-mono text-[#637078] mt-0.5">
                        Kod: {item.product.code} · Adet: {item.quantity}
                      </div>
                      <div className="text-[13px] font-mono font-[700] text-[#16242B] mt-1">
                        {item.product.salePrice !== null
                          ? `${formatCurrency(item.product.salePrice * item.quantity)} TL`
                          : 'Satışa kapalı'}
                        <span className="text-[10px] font-normal text-[#637078] ml-1">+ KDV</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tutar Hesaplamaları: Ortak Fonksiyon ve Kuruş Doğruluğu */}
              <div className="pt-4 border-t border-[#E2E7E8] space-y-2.5 text-[13px]">
                <div className="flex justify-between items-baseline text-[#637078]">
                  <span>Ara toplam (KDV hariç)</span>
                  <span className="font-mono font-[700] text-[15px] text-[#16242B]" data-checkout-subtotal="true">
                    {totals.formattedSubtotal} TL
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-[#637078]">
                  <span>KDV (%20)</span>
                  <span className="font-mono font-[600] text-[14px] text-[#16242B]" data-checkout-vat="true">
                    {totals.formattedVat} TL
                  </span>
                </div>

                {totals.hasShipping && (
                  <div className="flex justify-between items-baseline text-[#637078]">
                    <span>Kargo Bedeli</span>
                    <span className="font-mono font-[600] text-[#16242B]">
                      {totals.formattedShipping} TL
                    </span>
                  </div>
                )}

                {/* Genel toplam (KDV dahil) */}
                <div className="pt-3 border-t border-[#E2E7E8]">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[14px] font-[800] text-[#16242B]">
                      Genel toplam (KDV dahil)
                    </span>
                    <span className="font-mono font-[800] text-[22px] text-[#C82B35] leading-none" data-checkout-total="true">
                      {totals.formattedTotal} TL
                    </span>
                  </div>
                </div>

              </div>

              <div className="mt-5 pt-4 border-t border-[#E2E7E8]">
                <div className="flex items-center gap-2 text-[12px] text-[#1E824C]">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Orijinal MRU GmbH Distribütör Garantisi</span>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};
