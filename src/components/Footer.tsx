import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { scrollToElement } from '../utils/scroll';
import { WhatsAppIcon } from './WhatsAppIcon';
import { CONTACT_CONFIG, buildGeneralWhatsAppUrl } from '../data/commerceConfig';

interface FooterProps {
  onSelectCategory?: (category: string) => void;
  onNavigate?: (url: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onNavigate: propsNavigate }) => {
  const navContext = useNavigation();
  const navigate = propsNavigate || navContext?.navigate;

  const handleLinkClick = (url: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (navigate && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      navigate(url);
    }
  };

  const handleCatClick = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    const el = document.getElementById('urunler');
    scrollToElement(el);
  };

  const whatsAppUrl = buildGeneralWhatsAppUrl();

  return (
    <footer className="mt-[72px] bg-[#122129] text-[#A0ADB5] text-[13px] border-t border-[#1F333F]">
      <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px] py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#1F333F]">
          
          {/* Col 1: Wordmark, Slogan & Company Context */}
          <div className="md:col-span-5 space-y-4">
            <div>
              <a
                href="/"
                onClick={handleLinkClick('/')}
                className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C82B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#122129] rounded-[4px]"
                aria-label="1001cihaz Ana Sayfa"
              >
                <img
                  src="/images/brand/logo-dark.svg"
                  alt="1001cihaz"
                  width={250}
                  height={50}
                  className="w-[240px] md:w-[250px] h-auto object-contain"
                />
              </a>
              <p className="mt-[11px] text-[14px] leading-[20px] text-[#E2E8F0] font-[500]">
                Profesyoneller için doğru seçim.
              </p>
            </div>
            <p className="text-[#86959E] leading-[22px] max-w-sm">
              Profesyonel ölçüm ihtiyaçlarınız için gaz dedektörleri, sensörler, dijital manometreler ve baca gazı analiz cihazları.
            </p>
            <div>
              <a
                href="/kategori/tum-urunler"
                onClick={handleLinkClick('/kategori/tum-urunler')}
                className="inline-flex items-center gap-1.5 text-[14px] font-[600] text-white hover:text-[#C82B35] transition-colors duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C82B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#122129] rounded-[4px] group"
              >
                <span>Tüm ürünleri keşfet</span>
                <span className="transition-transform duration-180 group-hover:translate-x-1" aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[14px] font-[700] text-white tracking-wide">
              Ürün Kategorileri
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <button
                  onClick={() => handleCatClick('Gaz kaçak dedektörleri')}
                  className="hover:text-white transition-colors text-left"
                >
                  Gaz Kaçak Dedektörleri
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCatClick('Sensörler')}
                  className="hover:text-white transition-colors text-left"
                >
                  Sensörler ve Başlıklar
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCatClick('Manometreler')}
                  className="hover:text-white transition-colors text-left"
                >
                  Dijital Manometreler
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCatClick('Baca gazı analizörleri')}
                  className="hover:text-white transition-colors text-left"
                >
                  Baca Gazı Analizörleri
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[14px] font-[700] text-white tracking-wide">
              İletişim Bilgileri
            </h4>
            <div className="space-y-3 leading-relaxed text-[#86959E]">
              <p>
                <span className="text-[#A0ADB5] block text-[12px]">Telefon</span>
                <a href={CONTACT_CONFIG.phoneCallUrl} className="text-white hover:text-[#C82B35] font-mono font-[600] text-[15px]">
                  {CONTACT_CONFIG.phoneDisplay}
                </a>
              </p>

              {/* WhatsApp Button */}
              <div>
                <span className="text-[#A0ADB5] block text-[12px] mb-1.5">WhatsApp</span>
                <a
                  href={whatsAppUrl || undefined}
                  target={whatsAppUrl ? '_blank' : undefined}
                  rel={whatsAppUrl ? 'noopener noreferrer' : undefined}
                  onClick={(e) => {
                    if (!whatsAppUrl) e.preventDefault();
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[6px] bg-[#162A34] hover:bg-[#1A3340] border border-[#234252] hover:border-[#22C55E] text-white hover:text-white text-[13px] font-[600] transition-all duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] group"
                  aria-label={`WhatsApp İletişim: ${CONTACT_CONFIG.whatsappDisplay} (Yeni sekmede açılır)`}
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#22C55E] group-hover:scale-105 transition-transform flex-shrink-0" />
                  <span className="font-mono text-white text-[14px] font-[600]">{CONTACT_CONFIG.whatsappDisplay}</span>
                </a>
              </div>

              <p>
                <span className="text-[#A0ADB5] block text-[12px]">E-Posta</span>
                <a href={`mailto:${CONTACT_CONFIG.email}`} className="text-white hover:text-[#C82B35] underline">
                  {CONTACT_CONFIG.email}
                </a>
              </p>
              <p className="text-[12px]">
                <span className="text-[#A0ADB5] block">Adres</span>
                Sülüntepe Mah. Mevlana Cad. No: 38 Pendik / İstanbul
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright and VAT notice */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[12px] text-[#6A7982] gap-4">
          <div>
            © {new Date().getFullYear()} 1001cihaz.com. Tüm hakları saklıdır.
          </div>
          <div className="text-center md:text-right max-w-xl text-[12px]">
            Fiyatlar liste ve satış verilerine dayanmakta olup KDV hariçtir. Cihaz teknik verileri orijinal üretici dokümantasyonuna dayanmaktadır.
          </div>
        </div>
      </div>
    </footer>
  );
};
