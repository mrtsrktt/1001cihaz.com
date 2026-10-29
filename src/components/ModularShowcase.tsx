import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ModularShowcaseProps {
  onQuickView400GD: () => void;
  onSelectSensor: (sensorCode: string) => void;
}

export const ModularShowcase: React.FC<ModularShowcaseProps> = ({
  onQuickView400GD,
  onSelectSensor,
}) => {
  const steps = [
    { num: '01', title: 'Cihazını seç', desc: '400GD veya 500GD dayanıklı baz gövde' },
    { num: '02', title: 'Ölçümüne uygun sensörü seç', desc: 'Sahaya özel tak-kullan kalibreli başlık' },
    { num: '03', title: 'Birlikte incele', desc: 'Uyumlu konfigürasyonu ve teknik değerleri gör' },
  ];

  const sensors = [
    {
      code: '11138',
      name: 'HC400',
      label: 'Yanıcı Gaz Sensörü',
      image: '/images/products/11138-hc400.jpg',
    },
    {
      code: '11190',
      name: 'RF400',
      label: 'Soğutucu Gaz Sensörü',
      image: '/images/products/11190-rf400.jpg',
    },
    {
      code: '12130',
      name: 'CO400',
      label: 'Karbonmonoksit Sensörü',
      image: '/images/products/12130-co400.jpg',
    },
  ];

  return (
    <section className="mt-[72px]">
      <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px]">
        <div className="bg-[#F3F5F5] rounded-[12px] border border-[#E2E7E8] p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Concept & Steps */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <span className="text-[12px] font-[700] text-[#C82B35] tracking-wider uppercase">
                  Modüler Ölçüm Mimarisi
                </span>
                
                <h2 className="text-[32px] font-[700] text-[#16242B] tracking-tight leading-[40px] mt-2">
                  İhtiyacınız değiştiğinde, sensörünüzü değiştirin.
                </h2>
                
                <p className="text-[16px] leading-[26px] text-[#637078] mt-3">
                  MRU 400GD ve 500GD serisi, tak-kullan sensör başlıklarıyla tek gövdede yanıcı gaz, soğutucu akışkan ve karbonmonoksit ölçümünü birleştirir. Yeni bir cihaz almak yerine yalnızca sensörü değiştirerek sahaya hızla uyum sağlayın.
                </p>

                {/* 3 Steps */}
                <div className="mt-8 space-y-4">
                  {steps.map((s, idx) => (
                    <div key={s.num} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-[6px] bg-white border border-[#E2E7E8] flex items-center justify-center text-[13px] font-[700] text-[#16242B] flex-shrink-0">
                        {s.num}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-[650] text-[#16242B]">
                            {s.title}
                          </span>
                          {idx < steps.length - 1 && (
                            <ArrowRight className="w-3.5 h-3.5 text-[#637078]" />
                          )}
                        </div>
                        <p className="text-[13px] text-[#637078] mt-0.5">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-[#E2E7E8]">
                <button
                  onClick={onQuickView400GD}
                  className="h-[46px] px-6 rounded-[6px] bg-[#16242B] hover:bg-[#C82B35] text-white text-[14px] font-[600] inline-flex items-center gap-2 transition-colors shadow-sm"
                >
                  <span>400GD’yi incele</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Base Unit + 3 Sensors Showcase */}
            <div className="lg:col-span-6 bg-white rounded-[10px] border border-[#E2E7E8] p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                
                {/* 400GD Base Unit */}
                <div
                  onClick={onQuickView400GD}
                  className="flex-1 flex flex-col items-center p-4 bg-[#F3F5F5] rounded-[8px] cursor-pointer hover:border-[#16242B] border border-transparent transition-all group w-full"
                >
                  <div className="h-[200px] flex items-center justify-center w-full">
                    <img
                      src="/images/products/681000-400gd.png"
                      alt="MRU 400GD Baz Gövde"
                      className="max-h-[190px] object-contain group-hover:scale-105 transition-transform"
                      loading="eager"
                    />
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-[11px] font-mono text-[#637078] block">Kod: 681000</span>
                    <strong className="text-[14px] font-[700] text-[#16242B] block">400GD Baz Gövde</strong>
                    <span className="text-[12px] text-[#637078]">Sensörsüz ana ünite</span>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="hidden sm:flex flex-col items-center justify-center text-[#637078]">
                  <ArrowRight className="w-5 h-5 text-[#C82B35]" />
                  <span className="text-[10px] font-[600] uppercase tracking-wider mt-1 text-[#637078]">
                    Uyumlu
                  </span>
                </div>

                {/* 3 Real Sensors Stacking */}
                <div className="flex-1 flex flex-col gap-3 w-full">
                  {sensors.map((s) => (
                    <div
                      key={s.code}
                      onClick={() => onSelectSensor(s.code)}
                      className="flex items-center gap-3 p-2.5 bg-[#F3F5F5] rounded-[6px] cursor-pointer hover:bg-white hover:border-[#16242B] border border-transparent transition-all group"
                    >
                      <div className="w-14 h-14 bg-white rounded-[4px] border border-[#E2E7E8] flex items-center justify-center p-1 flex-shrink-0">
                        <img
                          src={s.image}
                          alt={s.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          loading="eager"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <strong className="text-[13px] font-[700] text-[#16242B] group-hover:text-[#C82B35] transition-colors">
                            {s.name}
                          </strong>
                          <span className="text-[10px] font-mono text-[#637078]">{s.code}</span>
                        </div>
                        <p className="text-[12px] text-[#637078] truncate">
                          {s.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
