import React from 'react';
import { ArrowRight } from 'lucide-react';
import { scrollToElement } from '../utils/scroll';

interface HeroProps {
  onExploreClick: () => void;
  onConsultClick?: () => void;
  onQuickViewProductByCode: (code: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onConsultClick,
  onQuickViewProductByCode,
}) => {
  const handleConsult = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onConsultClick) {
      onConsultClick();
    } else {
      const el = document.getElementById('danisma');
      if (el) {
        scrollToElement(el);
      } else {
        window.location.href = 'tel:02163789133';
      }
    }
  };

  return (
    <section className="bg-[#F7F8F6] border-b border-[#E5E8E5] h-[570px] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px] h-full">
        <div className="flex h-full gap-[48px] items-stretch">
          
          {/* Sol Sütun: 520px, düşey merkezde */}
          <div className="w-[520px] flex-shrink-0 flex flex-col justify-center">
            
            {/* Küçük üst metin: 12px/700, 1.5px harf aralığı */}
            <p className="text-[12px] font-[700] tracking-[1.5px] text-[#617078] uppercase">
              PROFESYONEL ÖLÇÜM TEKNOLOJİLERİ
            </p>

            {/* 20px sonra ana başlık: 60px/650, satır yüksekliği 66px, harf aralığı -2px */}
            <h1 className="mt-[20px] text-[60px] font-[650] leading-[66px] tracking-[-2px] text-[#14232B]">
              Hassas ölçüm.<br />
              Güvenle çalışın.
            </h1>

            {/* 24px sonra açıklama: 17px, satır yüksekliği 28px, maksimum 460px genişlik */}
            <p className="mt-[24px] text-[17px] leading-[28px] text-[#617078] max-w-[460px]">
              Gaz kaçak tespiti, basınç ölçümü ve baca gazı analizi için profesyonel MRU cihazları.
            </p>

            {/* 32px sonra kırmızı ana buton ve teknik danışma metin bağlantısı */}
            <div className="mt-[32px] flex items-center">
              <button
                onClick={onExploreClick}
                className="w-[192px] h-[50px] rounded-[6px] bg-[#C82B35] hover:bg-[#B3232C] text-white font-[600] text-[15px] flex items-center justify-center space-x-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14232B]"
              >
                <span>Ürünleri keşfet</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <a
                href="#danisma"
                onClick={handleConsult}
                className="ml-6 text-[15px] font-[600] text-[#14232B] hover:text-[#C82B35] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14232B]"
              >
                Teknik danışma
              </a>
            </div>

          </div>

          {/* Sağ Ürün Sahnesi: Kalan alan. Çerçeve, kart, ayırıcı çizgi ve gri panel yok */}
          <div className="flex-1 h-full relative">
            
            {/* DELTAsmart İkincil Ürün: yaklaşık 270px görsel yüksekliği; solda ve ana üründen 65px daha aşağıda */}
            <div className="absolute left-[20px] top-[105px] w-[260px] flex flex-col items-center">
              <div className="h-[270px] w-full flex items-center justify-center">
                <img
                  src="/images/products/690109-deltasmart-set.png"
                  alt="DELTAsmart SET LL"
                  className="max-h-[270px] max-w-full object-contain cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                  onClick={() => onQuickViewProductByCode('690109')}
                />
              </div>
              
              {/* Hafif eliptik gölge */}
              <div className="w-[170px] h-[10px] rounded-[100%] bg-[#14232B]/10 blur-[4px] mt-1" />

              {/* Tek satır model etiketi, 14px/600 */}
              <button
                onClick={() => onQuickViewProductByCode('690109')}
                className="mt-2 text-[14px] font-[600] text-[#14232B] hover:text-[#C82B35] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14232B]"
              >
                DELTAsmart SET LL
              </button>
            </div>

            {/* MRU 400GD Ana Ürün: yaklaşık 410px görsel yüksekliği; sağ yarıda konumlandır */}
            <div className="absolute right-[30px] top-[40px] w-[280px] flex flex-col items-center">
              <div className="h-[410px] w-full flex items-center justify-center">
                <img
                  src="/images/products/681000-400gd.png"
                  alt="MRU 400GD"
                  className="max-h-[410px] max-w-full object-contain cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                  onClick={() => onQuickViewProductByCode('681000')}
                />
              </div>

              {/* Hafif eliptik gölge */}
              <div className="w-[140px] h-[12px] rounded-[100%] bg-[#14232B]/12 blur-[5px] mt-1" />

              {/* Tek satır model etiketi, 14px/600 */}
              <button
                onClick={() => onQuickViewProductByCode('681000')}
                className="mt-2 text-[14px] font-[600] text-[#14232B] hover:text-[#C82B35] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14232B]"
              >
                MRU 400GD
              </button>
            </div>

            {/* Sahnenin altında küçük açıklama */}
            <div className="absolute bottom-[24px] right-[30px] text-[12px] text-[#617078] select-none">
              400GD baz cihazdır; sensör ayrıca seçilir.
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
