import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { CONTACT_CONFIG, buildGeneralWhatsAppUrl } from '../data/commerceConfig';

export const ConsultationSection: React.FC = () => {
  const whatsAppUrl = buildGeneralWhatsAppUrl();

  return (
    <section id="danisma" className="mt-[72px]">
      <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px]">
        <div className="border border-[#E2E7E8] rounded-[12px] p-8 lg:p-10 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Message */}
            <div className="lg:col-span-7">
              <span className="text-[12px] font-[700] text-[#C82B35] uppercase tracking-wider">
                Teknik Danışma
              </span>
              <h2 className="text-[32px] font-[700] text-[#16242B] tracking-tight leading-[40px] mt-2">
                Doğru cihazı birlikte seçelim.
              </h2>
              <p className="text-[16px] leading-[26px] text-[#637078] mt-3 max-w-xl">
                Ölçüm yapacağınız gaz türü, çalışma basınç skalası veya baca gazı analiz parametrelerinize en uygun MRU modelini belirlemek için doğrudan ekibimizle iletişime geçebilirsiniz.
              </p>
            </div>

            {/* Right: Action Buttons */}
            <div className="lg:col-span-5 flex flex-col gap-[12px]">
              
              {/* Top Row: Equal Width Buttons (Hemen ara and WhatsApp) */}
              <div className="grid grid-cols-2 gap-[12px]">
                
                {/* Hemen ara */}
                <a
                  href={CONTACT_CONFIG.phoneCallUrl}
                  className="h-[48px] px-4 rounded-[6px] bg-white border border-[#16242B] hover:bg-[#16242B] hover:text-white text-[#16242B] text-[14px] font-[600] inline-flex items-center justify-center gap-2 transition-all duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16242B] focus-visible:ring-offset-2 shadow-2xs group"
                  aria-label="Hemen ara: 0216 378 91 33"
                >
                  <Phone className="w-4 h-4 text-[#16242B] group-hover:text-white transition-colors flex-shrink-0" />
                  <span>Hemen ara</span>
                </a>

                {/* WhatsApp */}
                <a
                  href={whatsAppUrl || undefined}
                  target={whatsAppUrl ? "_blank" : undefined}
                  rel={whatsAppUrl ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (!whatsAppUrl) e.preventDefault();
                  }}
                  className="h-[48px] px-4 rounded-[6px] bg-[#F0FDF4] border border-[#22C55E] hover:bg-[#DCFCE7] hover:border-[#16A34A] text-[#15803D] hover:text-[#166534] text-[14px] font-[600] inline-flex items-center justify-center gap-2 transition-all duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 shadow-2xs group"
                  aria-label="WhatsApp ile teknik danışma (Yeni sekmede açılır)"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#16A34A] group-hover:text-[#15803D] transition-colors flex-shrink-0" />
                  <span>WhatsApp</span>
                </a>

              </div>

              {/* Bottom Row: Full Width Email Button */}
              <a
                href={`mailto:${CONTACT_CONFIG.email}`}
                className="w-full h-[48px] px-4 rounded-[6px] bg-white border border-[#16242B] hover:bg-[#16242B] hover:text-white text-[#16242B] text-[14px] font-[600] inline-flex items-center justify-center gap-2 transition-all duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16242B] focus-visible:ring-offset-2 shadow-2xs group"
                aria-label={`E-Posta gönder: ${CONTACT_CONFIG.email}`}
              >
                <Mail className="w-4 h-4 text-[#16242B] group-hover:text-white transition-colors flex-shrink-0" />
                <span>{CONTACT_CONFIG.email}</span>
              </a>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
