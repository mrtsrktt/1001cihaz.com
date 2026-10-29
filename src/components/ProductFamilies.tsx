import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ProductFamiliesProps {
  onSelectFamily: (categoryName: string) => void;
  onNavigate?: (url: string) => void;
}

export const ProductFamilies: React.FC<ProductFamiliesProps> = ({ onSelectFamily, onNavigate }) => {
  const families = [
    {
      name: 'Gaz Kaçak Dedektörleri',
      description: 'Metan, propan, hidrojen ve gaz sızıntılarının anlık tespiti.',
      image: '/images/products/682000-500gd.png',
      targetCategory: 'Gaz kaçak dedektörleri',
      url: '/kategori/gaz-kacak-dedektorleri',
      actionText: 'Modelleri gör',
    },
    {
      name: 'Sensörler ve Ölçüm Başlıkları',
      description: '400GD ve 500GD için tak-kullan kalibreli akıllı sensörler.',
      image: '/images/products/11138-hc400.jpg',
      targetCategory: 'Sensörler',
      url: '/kategori/sensorler',
      actionText: 'Sensörleri gör',
    },
    {
      name: 'Dijital Manometreler',
      description: 'HVAC ve tesisatlarda statik ve diferansiyel basınç ölçümü.',
      image: '/images/products/dm9600-series.png',
      targetCategory: 'Manometreler',
      url: '/kategori/dijital-manometreler',
      actionText: 'Manometreleri gör',
    },
    {
      name: 'Baca Gazı Analizörleri',
      description: 'Kazan ve brülör sistemlerinde emisyon ve verimlilik setleri.',
      image: '/images/products/690109-deltasmart-set.png',
      targetCategory: 'Baca gazı analizörleri',
      url: '/kategori/baca-gazi-analizorleri',
      actionText: 'Setleri gör',
    },
  ];

  const handleAction = (fam: typeof families[0]) => {
    if (onNavigate) {
      onNavigate(fam.url);
    } else {
      onSelectFamily(fam.targetCategory);
    }
  };

  return (
    <section className="mt-[72px]">
      <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px]">
        
        {/* Başlık: 32px / 700 */}
        <div className="mb-6">
          <h2 className="text-[32px] font-[700] text-[#16242B] tracking-tight">
            Ne ölçmek istiyorsunuz?
          </h2>
          <p className="text-[16px] leading-[26px] text-[#637078] mt-1">
            İhtiyacınız olan ölçüm parametresine göre MRU cihaz grubunu seçin.
          </p>
        </div>

        {/* Dört eşit kategori, her biri yaklaşık 302px genişlikte */}
        <div className="grid grid-cols-4 gap-[24px]">
          {families.map((family) => (
            <div
              key={family.name}
              role="button"
              tabIndex={0}
              onClick={() => handleAction(family)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleAction(family);
                }
              }}
              className="group bg-white border border-[#E2E7E8] hover:border-[#16242B] transition-colors rounded-[8px] overflow-hidden flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16242B]"
            >
              <div>
                {/* Üstte 180px açık zeminli görsel alanı */}
                <div className="h-[180px] bg-[#F3F5F5] flex items-center justify-center p-4">
                  <img
                    src={family.image}
                    alt={family.name}
                    className="max-h-[145px] max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Altta kategori adı, kısa açıklama ve ok */}
                <div className="p-5 pb-3">
                  <h3 className="text-[18px] font-[700] text-[#16242B] group-hover:text-[#C82B35] transition-colors">
                    {family.name}
                  </h3>
                  <p className="text-[14px] leading-[20px] text-[#637078] mt-1.5">
                    {family.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-4 pt-2 flex items-center space-x-1.5 text-[14px] font-[600] text-[#C82B35]">
                <span>{family.actionText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
