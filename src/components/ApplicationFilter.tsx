import React from 'react';
import { Flame, Snowflake, Gauge, Activity, Check, X } from 'lucide-react';
import { ApplicationCategory } from '../data/products';
import { scrollToElement } from '../utils/scroll';

interface ApplicationFilterProps {
  selectedApp: ApplicationCategory | null;
  onSelectApp: (app: ApplicationCategory | null) => void;
  productCounts: Record<ApplicationCategory, number>;
}

export const ApplicationFilter: React.FC<ApplicationFilterProps> = ({
  selectedApp,
  onSelectApp,
  productCounts,
}) => {
  const applications: {
    id: ApplicationCategory;
    title: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'gaz-kacak-tespiti',
      title: 'Gaz Kaçak Tespiti',
      description: 'Doğal gaz, LPG, metan, hidrojen ve patlayıcı gaz sızıntılarının tespiti.',
      icon: <Flame className="w-5 h-5 text-mruRed-600" />,
    },
    {
      id: 'sogutma-iklimlendirme',
      title: 'Soğutma ve İklimlendirme',
      description: 'HVAC-R sistemlerinde soğutucu gaz kaçağı ve ortam hava kalitesi ölçümü.',
      icon: <Snowflake className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'basinc-olcumu',
      title: 'Basınç Ölçümü',
      description: 'Statik ve diferansiyel basınç, baca çekişi ve sızdırmazlık testleri.',
      icon: <Gauge className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'yanma-analizi',
      title: 'Yanma Analizi',
      description: 'Kazan ve brülör baca gazı emisyonları (O2, CO) ve yanma verimliliği hesaplanması.',
      icon: <Activity className="w-5 h-5 text-emerald-600" />,
    },
  ];

  const handleToggle = (id: ApplicationCategory) => {
    const newApp = selectedApp === id ? null : id;
    onSelectApp(newApp);
    const el = document.getElementById('urunler');
    scrollToElement(el);
  };

  return (
    <section className="py-12 bg-white border-b border-surface-border">
      <div className="max-w-[1440px] mx-auto px-8 min-[1440px]:px-[80px]">
        
        {/* Section title & active state */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-surface-border">
          <div>
            <h2 className="text-xl font-bold text-anthracite-950 tracking-tight">
              Uygulamaya Göre Keşif
            </h2>
          </div>

          <div className="flex items-center space-x-3 mt-2 md:mt-0">
            {selectedApp && (
              <button
                onClick={() => onSelectApp(null)}
                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-surface-subtle hover:bg-surface-border border border-surface-border text-xs text-anthracite-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Uygulama Filtresini Kaldır</span>
              </button>
            )}
            <span className="text-xs text-anthracite-500">
              Saha ihtiyacınıza göre filtreleyin
            </span>
          </div>
        </div>

        {/* 4 Application Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {applications.map((app) => {
            const isSelected = selectedApp === app.id;
            const count = productCounts[app.id] || 0;

            return (
              <div
                key={app.id}
                role="button"
                tabIndex={0}
                onClick={() => handleToggle(app.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggle(app.id);
                  }
                }}
                className={`p-5 border transition-all cursor-pointer flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anthracite-800 ${
                  isSelected
                    ? 'border-anthracite-900 bg-surface-subtle shadow-sm ring-1 ring-anthracite-900'
                    : 'border-surface-border bg-white hover:border-anthracite-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-surface-light border border-surface-border">
                      {app.icon}
                    </div>
                    <span className="text-xs text-anthracite-600 font-medium">
                      {count} Ürün
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-anthracite-950 mb-1">
                    {app.title}
                  </h3>
                  <p className="text-xs text-anthracite-600 leading-relaxed">
                    {app.description}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-surface-border flex items-center justify-between text-xs text-anthracite-700 font-medium">
                  <span>{isSelected ? 'Seçili' : 'Filtrele'}</span>
                  {isSelected ? <Check className="w-4 h-4 text-mruRed-600" /> : <span className="text-anthracite-400">→</span>}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
