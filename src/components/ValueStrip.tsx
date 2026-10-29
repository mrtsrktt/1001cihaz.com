import React from 'react';
import { Target, Layers, PhoneCall } from 'lucide-react';

export const ValueStrip: React.FC = () => {
  return (
    <section className="mt-[24px]">
      <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px]">
        <div className="w-full max-w-[1280px] mx-auto h-[64px] bg-[#F3F5F5] rounded-[8px] px-8 border border-[#E2E7E8]/60 grid grid-cols-3 divide-x divide-[#E2E7E8] items-center">
          
          {/* Sütun 1: Ölçüm amacına göre seçim */}
          <div className="flex items-center space-x-3 pr-6">
            <Target className="w-5 h-5 text-[#C82B35] flex-shrink-0" />
            <div className="truncate">
              <span className="text-[14px] font-[700] text-[#16242B] block leading-snug">
                Ölçüm amacına göre seçim
              </span>
              <span className="text-[12px] text-[#637078] block truncate">
                Uygulamanıza uygun doğru cihaz ve prob yapısı
              </span>
            </div>
          </div>

          {/* Sütun 2: Uyumlu cihaz ve sensörler */}
          <div className="flex items-center space-x-3 px-6">
            <Layers className="w-5 h-5 text-[#C82B35] flex-shrink-0" />
            <div className="truncate">
              <span className="text-[14px] font-[700] text-[#16242B] block leading-snug">
                Uyumlu cihaz ve sensörler
              </span>
              <span className="text-[12px] text-[#637078] block truncate">
                Modüler tak-kullan akıllı sensör mimarisi
              </span>
            </div>
          </div>

          {/* Sütun 3: Teknik danışma */}
          <div className="flex items-center space-x-3 pl-6">
            <PhoneCall className="w-5 h-5 text-[#C82B35] flex-shrink-0" />
            <div className="truncate">
              <span className="text-[14px] font-[700] text-[#16242B] block leading-snug">
                Teknik danışma
              </span>
              <span className="text-[12px] text-[#637078] block truncate">
                Cihaz ve sensör seçimi için teknik danışma
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
